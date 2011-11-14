(function($) {
    $.ui.editor.addButton('viewSource', {
        title: 'View / Edit Source',
        icons: {
            primary: 'ui-icon-view-source'
        },
        classes: 'ui-editor-icon ui-widget-editor-button-view-source',
        click: function() {
            var editorInstance = this,
                dialog = $('.ui-widget-editor-dialog-view-source');

            if (!dialog.length) {
                dialog = $('<div style="display:none" class="ui-widget-editor-dialog-view-source">\
                                <textarea></textarea>\
                            </div>').appendTo(this._editor.toolbar);
            }

            dialog.dialog({
                modal: false,
                width: 600,
                height: 400,
                resizable: true,
                title: 'View Source',
                dialogClass: this.options.dialogClass + ' ui-widget-editor-view-source',
                show: this.options.dialogShowAnimation,
                hide: this.options.dialogHideAnimation,
                buttons: [
                    {
                        text: 'Reload Source',
                        'class': 'reload-source',
                        click: function() {
                            $(this).find('textarea').val(editorInstance.html());
                        }
                    },
                    {
                        text: 'Apply Source',
                        'class': 'apply-source',
                        click: function() {
                            editorInstance.html($(this).find('textarea').val());
                        }
                    }
                ],
                open: function() {
                    editorInstance._dialog.applyButtonIcon('reload-source', 'refresh');
                    editorInstance._dialog.applyButtonIcon('apply-source', 'circle-check');

                    $(this).find('textarea').val(editorInstance.html());
                },
                close: function() {
                    $(this).dialog('destroy');
                }
            }).dialog('open');
        },
        destroy: function() {
            var dialog = $('.ui-widget-editor-dialog-view-source');
            if (dialog.length) dialog.dialog('close');
        }
    });
})(jQuery);
