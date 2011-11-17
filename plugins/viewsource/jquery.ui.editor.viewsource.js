(function($) {
    
    $.ui.editor.registerUi({
        viewSource: function(editor) {
            console.info('FIXME: remove dialog on destroy');
            var dialog = $(editor.getTemplate('viewsource.dialog'));
            dialog.dialog({
                modal: false,
                width: 600,
                height: 400,
                resizable: true,
                title: 'View Source',
                autoOpen: false,
                dialogClass: editor.options.dialogClass + ' ui-widget-editor-view-source',
                show: editor.options.dialogShowAnimation,
                hide: editor.options.dialogHideAnimation,
                buttons: [
                    {
                        text: _('Apply Source'),
                        click: function() {
                            editor.setHtml($(this).find('textarea').val());
                        }
                    },
                    {
                        text: _('Close'),
                        click: function() {
                            dialog.dialog('close');
                        }
                    }
                ],
                open: function() {
                    var buttons = dialog.parent().find('.ui-dialog-buttonpane');
                    buttons.find('button:eq(0)').button({ icons: { primary: 'ui-icon-circle-check' }});
                    buttons.find('button:eq(1)').button({ icons: { primary: 'ui-icon-circle-close' }});

                    $(this).find('textarea').val(editor.getHtml());
                }
            });
                    
            this.ui = editor.uiButton({
                name: 'viewSource',
                title: _('View / Edit Source'),
                icons: { primary: 'ui-icon-view-source' },
                classes: 'ui-editor-icon ui-widget-editor-button-view-source',
                click: function() {
                    dialog.dialog('open');
                },
                destroy: function() {
                    if (dialog) dialog.dialog('close').remove();
                }
            });
        }
    });
    
})(jQuery);
