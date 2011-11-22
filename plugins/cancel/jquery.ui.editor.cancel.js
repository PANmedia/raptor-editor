console.info('FIXME: cancel button');
console.info('FIXME: cancel button confimation dialog');
console.info('FIXME: cancel button confimation dialog get removed on unbind');
console.info('TODO: make cancel function avalible as a plugin');

$.ui.editor.registerUi({
    cancel: function(editor, options) {
        function cancel() {
            editor.unify(function(editor) {
                editor.resetHtml();
                editor.hideToolbar();
                editor.disableEditing();
            });
        }
        
        this.ui = editor.uiButton({
            name: 'cancel',
            title: _('Cancel'),
            icons: { primary: 'ui-icon-cancel' },
            click: function() {
                if (!editor.isDirty()) {
                    cancel();
                } else {
                    $(editor.getTemplate('cancel.dialog')).dialog({
                        modal: true,
                        resizable: false,
                        title: _('Confirm Cancel Editing'),
                        dialogClass: options.dialogClass + ' ' + options.baseClass,
                        show: editor.options.dialogShowAnimation,
                        hide: editor.options.dialogHideAnimation,
                        buttons: [
                            {
                                text: _('OK'),
                                click: function() {
                                    cancel();
                                    $(this).dialog('close');
                                }
                            },
                            {
                                text: _('Cancel'),
                                click: function() {
                                    $(this).dialog('close');
                                }
                            }
                        ],
                        open: function() {
                            // Apply custom icons to the dialog buttons
                            var buttons = $(this).parent().find('.ui-dialog-buttonpane');
                            buttons.find('button:eq(0)').button({ icons: { primary: 'ui-icon-circle-check' }});
                            buttons.find('button:eq(1)').button({ icons: { primary: 'ui-icon-circle-close' }});
                        },
                        close: function() {
                            $(this).dialog('destroy').remove();
                        }
                    });
                }
            }
        });
    }
});
