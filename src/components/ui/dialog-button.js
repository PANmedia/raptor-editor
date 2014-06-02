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
 * @augments Button
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
    this.openDialog();
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
// </strict>

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
DialogButton.prototype.openDialog = function() {
    this.raptor.pause();
    aDialogOpen(this.getDialog());
};

DialogButton.prototype.onDialogClose = function() {
    dialogs[this.name].instance.raptor.resume();
};

DialogButton.prototype.okButtonClick = function(event) {
    var valid = dialogs[this.name].instance.validateDialog();
    if (valid === true) {
        aDialogClose(dialogs[this.name].dialog);
        dialogs[this.name].instance.applyAction.call(dialogs[this.name].instance, dialogs[this.name].dialog);
    }
};

DialogButton.prototype.closeDialog = function() {
    aDialogClose(dialogs[this.name].dialog);
};

DialogButton.prototype.cancelButtonClick = DialogButton.prototype.closeDialog;

/**
 * Prepare and return the dialog's OK button's initialisation object.
 *
 * @param {String} name
 * @returns {Object} The initiialisation object for this dialog's OK button.
 */
DialogButton.prototype.getOkButton = function(name) {
    return {
        text: tr(name + 'DialogOKButton'),
        click: this.okButtonClick.bind(this),
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
        text: tr(name + 'DialogCancelButton'),
        click: this.cancelButtonClick.bind(this),
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
        title: tr(name + 'DialogTitle'),
        dialogClass: this.options.baseClass + '-dialog ' + this.options.dialogClass,
        close: this.onDialogClose.bind(this),
        buttons: []
    };
    var okButton = this.getOkButton(name),
        cancelButton = this.getCancelButton(name);
    if (typeof okButton !== 'undefined' && okButton !== false) {
        options.buttons.push(okButton);
    }
    if (typeof cancelButton !== 'undefined' && cancelButton !== false) {
        options.buttons.push(cancelButton);
    }
    return options;
};

/**
 * Prepare and return the dialog to be used in the Raptor UI.
 *
 * @returns {Element} The dialog.
 */
DialogButton.prototype.getDialog = function() {
    if (typeof dialogs[this.name] === 'undefined') {
        dialogs[this.name] = {
            dialog: $(this.getDialogTemplate())
        };
        aDialog(dialogs[this.name].dialog, $.extend(this.getDefaultDialogOptions(this.name), this.dialogOptions));
    }
    dialogs[this.name].instance = this;
    return dialogs[this.name].dialog;
};
