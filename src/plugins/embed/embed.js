var embedDialog = null;

Raptor.registerUi(new Button({
    name: 'embed',
    action: function() {
        aDialogOpen(this.getDialog());
    },
    getDialog: function() {
        if (!embedDialog) {
            embedDialog = $('<div>').html(this.editor.getTemplate('embed.dialog'));
            aDialog(embedDialog, {
                modal: true,
                width: 600,
                height: 400,
                resizable: true,
                autoOpen: false,
                title: _('embedDialogTitle'),
                dialogClass: this.options.dialogClass,
                buttons: [
                    {
                        text: _('embedDialogOKButton'),
                        click: function() {
                            selectionRestore();
                            selectionReplace($(this).find('textarea').val());
                            $(this).dialog('close');
                        },
                        icons: {
                            primary: 'ui-icon-circle-check'
                        }
                    },
                    {
                        text: _('embedDialogCancelButton'),
                        click: function() {
                            ui.hide();
                        },
                        icons: {
                            primary: 'ui-icon-circle-close'
                        }
                    }
                ],
                open: function() {
                    // Create fake jQuery UI tabs (to prevent hash changes)
                    var tabs = $(this).find('.ui-editor-embed-panel-tabs');

                    tabs.find('ul li').click(function() {
                        tabs.find('ul li').removeClass('ui-state-active').removeClass('ui-tabs-selected');
                        $(this).addClass('ui-state-active').addClass('ui-tabs-selected');
                        tabs.children('div').hide().eq($(this).index()).show();
                    });

                    var preview = $(this).find('.ui-editor-embed-preview');
                    $(this).find('textarea').change(function() {
                        $(preview).html($(this).val());
                    });

                },
                close: function() {
                    ui.hide();
                }
            });
        }
        return embedDialog;
    }
}));
