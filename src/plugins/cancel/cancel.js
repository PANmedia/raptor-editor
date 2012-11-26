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
                dialogClass: this.raptor.options.dialogClass + ' ' + this.options.baseClass,
                buttons: [
                    {
                        text: _('cancelDialogOKButton'),
                        click: function() {
                            this.raptor.cancelEditing();
                            aDialogClose(cancelDialog);
                        }.bind(this)
                    },
                    {
                        text: _('cancelDialogCancelButton'),
                        click: function() {
                            aDialogClose(cancelDialog);
                        }
                    }
                ],
                open: function() {
                    // Apply custom icons to the dialog buttons
                    var buttons = $(this).parent().find('.ui-dialog-buttonpane');
                    aButton(buttons.find('button:eq(0)'), {
                        icons: {
                            primary: 'ui-icon-circle-check'
                        }
                    });
                    aButton(buttons.find('button:eq(1)'), {
                        icons: {
                            primary: 'ui-icon-circle-close'
                        }
                    });
                }
            });
        }
        return cancelDialog;
    }
}));
