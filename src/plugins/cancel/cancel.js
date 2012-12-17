var cancelDialog = null;

Raptor.registerUi(new Button({
    name: 'cancel',
    action: function() {
        aDialogOpen(this.getDialog());
    },
    getDialog: function() {
        if (!cancelDialog) {
            cancelDialog = $('<div>').html(_('cancelDialogContent'));
            aDialog(cancelDialog, {
                modal: true,
                resizable: false,
                autoOpen: false,
                title: _('cancelDialogTitle'),
                dialogClass: this.options.baseClass + '-dialog ' + this.options.dialogClass,
                buttons: [
                    {
                        text: _('cancelDialogOKButton'),
                        click: function() {
                            this.raptor.cancelEditing();
                            aDialogClose(cancelDialog);
                        }.bind(this),
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
