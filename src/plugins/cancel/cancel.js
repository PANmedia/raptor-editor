var cancelDialog = null,
    cancelInstance;

Raptor.registerUi(new Button({
    name: 'cancel',
    action: function() {
        aDialogOpen(this.getDialog());
    },
    cancelEditing: function() {
        this.raptor.cancelEditing();
    },
    getDialog: function() {
        cancelInstance = this;
        if (!cancelDialog) {
            cancelDialog = $('<div>').html(_('cancelDialogContent'));
            aDialog(cancelDialog, {
                modal: true,
                resizable: false,
                autoOpen: false,
                width: 400,
                title: _('cancelDialogTitle'),
                dialogClass: this.options.baseClass + '-dialog ' + this.options.dialogClass,
                buttons: [
                    {
                        text: _('cancelDialogOKButton'),
                        click: function() {
                            cancelInstance.cancelEditing();
                            aDialogClose(cancelDialog);
                        },
                        icons: {
                            primary: 'ui-icon-circle-check'
                        }
                    },
                    {
                        text: _('cancelDialogCancelButton'),
                        click: function() {
                            aDialogClose(cancelDialog);
                        },
                        icons: {
                            primary: 'ui-icon-circle-close'
                        }
                    }
                ]
            });
        }
        return cancelDialog;
    }
}));
