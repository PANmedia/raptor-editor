/**
 * @fileOverview Contains the dialog button class code.
 * @author  David Neilsen <david@panmedia.co.nz>
 * @author  Michael Robinson <michael@panmedia.co.nz>
 * @author Melissa Richards <melissa@panmedia.co.nz>
 */

/**
 * @todo desc??
 * @type Array
 */
var dialogs = {};

/**
 * @class the dialog button class.
 *
 * @constructor
 * @augments button
 *
 * @todo return type check and desc
 * @param {Object} options
 * @returns {DialogButton}
 */
function DialogButton(options) {
    this.state = null;
    Button.call(this, options);
}

DialogButton.prototype = Object.create(Button.prototype);

/**
 *
 * @returns {undefined}
 */
DialogButton.prototype.action = function() {
    this.state = this.raptor.stateSave();
    var dialog = this.getDialog(this);
    this.openDialog(dialog);
    aDialogOpen(dialog);
};

// <strict>

/**
 * Callback triggered when the user clicks the OK button on the dialog.
 *
 * @param {Object} dialog Dialog to get the ok button from.
 * @return {boolean} If true is returned, then the dialog is closed, otherwise if false is returned the dialog stays open.
 */
DialogButton.prototype.applyAction = function(dialog) {
    throw new Error('Expected child class to override DialogButton.applyAction');
};

/**
 * Callback triggered when the user clicks on the dialog button.
 *
 * @todo desc for return
 * @return {Boolean}
 */
DialogButton.prototype.getDialogTemplate = function() {
    throw new Error('Expected child class to override DialogButton.getDialogTemplate');
};
// <strict>

/**
 * Checks the validility of a dialog.
 *
 * @param {type} dialog
 * @returns {Boolean} True if dialof is valid
 */
DialogButton.prototype.validateDialog = function(dialog) {
    return true;
};

/**
 * Opens a dialog.
 *
 * @param {Object} dialog The dialog to open.
 */
DialogButton.prototype.openDialog = function(dialog) {
};

/**
 * Prepare and return the dialogs ok button to be used in the Raptor UI.
 *
 * @todo type for name
 * @param {type} name The name of the dialog to find the ok button of.
 * @returns {Element} The dialogs ok button.
 */
DialogButton.prototype.getOkButton= function(name) {
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
 * Prepare and return the dialogs cancel button to be used in the Raptor UI.
 *
 * @todo type of name
 * @param {type} name The name of the dialog to find the cancel button of.
 * @returns {Element} The cancel button.
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
 * @todo type of name and return
 * @param {type} name The name of the dialog to have the default options applied to it.
 * @returns {type} the default options for the dialog.
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
        }.bind(this),
        buttons: []
    };
    var okButton = this.getOkButton(name),
        cancelButton = this.getCancelButton(name);
    if (typeof okButton !== 'undefined') {
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
 * @param {type} instance
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
