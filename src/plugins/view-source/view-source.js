var viewSourceDialog = null;

Raptor.registerUi(new Button({
    name: 'viewSource',
    action: function() {
        this.getDialog().find('textarea').text(this.raptor.getHtml());
        aDialogOpen(this.getDialog());
    },
    getDialog: function() {
        if (!viewSourceDialog) {
            viewSourceDialog = $('<div>').html(this.editor.getTemplate('view-source.dialog', this.options));
            aDialog(viewSourceDialog, {
                modal: true,
                width: 600,
                height: 400,
                resizable: true,
                title: _('viewSourceDialogTitle'),
                autoOpen: true,
                dialogClass: this.options.baseClass + '-dialog ' + this.options.dialogClass,
                buttons: [
                    {
                        text: _('viewSourceDialogOKButton'),
                        click: function(event) {
                            var html = viewSourceDialog.find('textarea').val();
                            this.raptor.setHtml(html);
                            aDialogClose(viewSourceDialog);
                        }.bind(this),
                        icons: {
                            primary: 'ui-icon-circle-check'
                        }
                    },
                    {
                        text: _('viewSourceDialogCancelButton'),
                        click: function() {
                            aDialogClose(viewSourceDialog);
                        },
                        icons: {
                            primary: 'ui-icon-circle-close'
                        }
                    }
                ],
                close: function() {
                    this.raptor.checkChange();
                }.bind(this)
            });
        }
        return viewSourceDialog;
    }
}));
