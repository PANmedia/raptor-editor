/**
 * @fileOverview Contains the dialog button class code.
 * @license http://www.raptor-editor.com/license
 *
 * @author David Neilsen <david@panmedia.co.nz>
 * @author Michael Robinson <michael@panmedia.co.nz>
 * @author Melissa Richards <melissa@panmedia.co.nz>
 */

/**
 * @type {Object} Container for Raptor dialogs.
 */
var dialogs = {};

/**
 * @class
 *
 * @constructor
 * @augments {Button}
 * @param {Object} options
 * @returns {DialogButton}
 */
function DialogButton(options) {
    this.state = null;
    Button.call(this, options);
}

DialogButton.prototype = Object.create(Button.prototype);

/**
 * A dialog button's action is to open a dialog, no content is modified at this
 * stage.
 */
DialogButton.prototype.action = function() {
    this.state = this.raptor.stateSave();
    this.raptor.suspendHotkeys();
    var dialog = this.getDialog(this);
    this.openDialog(dialog);
    aDialogOpen(dialog);
};

// <strict>
/**
 * Callback triggered when the user clicks the OK button on the dialog.
 *
 * @param {Object} dialog Dialog to get the ok button from.
 * @throws {Error} If this function is not overridden.
 */
DialogButton.prototype.applyAction = function(dialog) {
    throw new Error('Expected child class to override DialogButton.applyAction');
};

/**
 * Callback triggered when the user clicks on the dialog button.
 *
 * @throws {Error} If this function is not overridden.
 */
DialogButton.prototype.getDialogTemplate = function() {
    throw new Error('Expected child class to override DialogButton.getDialogTemplate');
};
// <strict>

/**
 * Checks the validility of a dialog.
 *
 * @param {type} dialog
 * @returns {Boolean} True if dialog is valid, false otherwise.
 */
DialogButton.prototype.validateDialog = function(dialog) {
    return true;
};

/**
 * Opens a dialog.
 *
 * @param {Object} dialog The dialog to open.
 */
DialogButton.prototype.openDialog = function(dialog) { };

/**
 * Prepare and return the dialog's OK button's initialisation object.
 *
 * @param {String} name
 * @returns {Object} The initiialisation object for this dialog's OK button.
 */
DialogButton.prototype.getOkButton = function(name) {
    return {
        text: _(name + 'DialogOKButton'),
        click: function(event) {
            var valid = dialogs[name].instance.validateDialog();
            if (valid === true) {
                aDialogClose(dialogs[name].dialog);
                if (dialogs[name].instance.state !== null) {
                    dialogs[name].instance.raptor.stateRestore(dialogs[name].instance.state);
                    dialogs[name].instance.state = null;
                }
                dialogs[name].instance.applyAction.call(dialogs[name].instance, dialogs[name].dialog);
            }
        }.bind(this),
        icons: {
            primary: 'ui-icon-circle-check'
        }
    };
};

/**
 * Prepare and return the dialog's cancel button's initialisation object.
 *
 * @param {String} name
 * @returns {Object} The initiialisation object for this dialog's cancel button.
 */
DialogButton.prototype.getCancelButton = function(name) {
    return {
        text: _(name + 'DialogCancelButton'),
        click: function() {
            aDialogClose(dialogs[name].dialog);
        },
        icons: {
            primary: 'ui-icon-circle-close'
        }
    };
};

/**
 * Prepare and return the dialogs default options to be used in the Raptor UI.
 *
 * @param {String} name The name of the dialog to have the default options applied to it.
 * @returns {Object} the default options for the dialog.
 */
DialogButton.prototype.getDefaultDialogOptions = function(name) {
    var options = {
        modal: true,
        resizable: true,
        autoOpen: false,
        title: _(name + 'DialogTitle'),
        dialogClass: this.options.baseClass + '-dialog ' + this.options.dialogClass,
        close: function() {
            if (dialogs[name].instance.state !== null) {
                dialogs[name].instance.raptor.stateRestore(dialogs[name].instance.state);
            }
            dialogs[name].instance.raptor.resumeHotkeys();
            dialogs[name].instance.raptor.restoreFocus();
        }.bind(this),
        buttons: []
    };
    var okButton = this.getOkButton(name),
        cancelButton = this.getCancelButton(name);
    if (typeof okButton !== 'undefined' && okButton !== false) {
        options.buttons.push(okButton);
    }
    if (typeof cancelButton !== 'undefined') {
        options.buttons.push(cancelButton);
    }
    return options;
};

/**
 * Prepare and return the dialog to be used in the Raptor UI.
 *
 * @todo the type and description for instance.
 * @param {DialogButton} instance
 * @returns {Element} The dialog.
 */
DialogButton.prototype.getDialog = function(instance) {
    var name = instance.name;
    if (typeof dialogs[name] === 'undefined') {
        dialogs[name] = {};
    }
    dialogs[name].instance = instance;
    if (typeof dialogs[name].dialog === 'undefined') {
        dialogs[name].dialog = instance.getDialogTemplate();
        aDialog(dialogs[name].dialog, $.extend(instance.getDefaultDialogOptions(name), instance.dialogOptions));
    }
    return dialogs[name].dialog;
};
