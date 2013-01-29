var dialogs = {};

function DialogButton(options) {
    state = null;
    Button.call(this, options);
}

DialogButton.prototype = Object.create(Button.prototype);

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
 * @return {boolean} If true is returned, then the dialog is closed, otherwise if false is returned the dialog stays open.
 */
DialogButton.prototype.applyAction = function(dialog) {
    throw new Error('Expected child class to override DialogButton.applyAction');
};

DialogButton.prototype.getDialogTemplate = function() {
    throw new Error('Expected child class to override DialogButton.getDialogTemplate');
};
// <strict>

DialogButton.prototype.validateDialog = function(dialog) {
    return true;
};

DialogButton.prototype.openDialog = function(dialog) {
};

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
