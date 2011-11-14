(function($) {
    
    $.ui.editor.addPlugin('viewSource', {
        dialog: false,
        stateChange: function() {
            if (this._plugins.viewSource.dialog) this._plugins.viewSource.dialog.find('textarea').val(this.html.call(this));
        }
    });
    
    $.ui.editor.addButton('viewSource', {
       
        title: _('View / Edit Source'),
        icons: {
            primary: 'ui-icon-view-source'
        },
        classes: 'ui-editor-icon ui-widget-editor-button-view-source',
        click: function() {
            var editorInstance = this;

            if (!this._plugins.viewSource.dialog) {
                this._plugins.viewSource.dialog = $('<div style="display:none" class="ui-widget-editor-dialog-view-source">\
                                <textarea></textarea>\
                            </div>').appendTo(this._editor.toolbar);
            }

            this._plugins.viewSource.dialog.dialog({
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
                        text: _('Apply Source'),
                        'class': 'apply-source',
                        click: function() {
                            editorInstance.html($(this).find('textarea').val());
                        }
                    }
                ],
                open: function() {
                    editorInstance._dialog.applyButtonIcon('apply-source', 'circle-check');

                    $(this).find('textarea').val(editorInstance.html());
                },
                close: function() {
                    $(this).dialog('destroy');
                }
            }).dialog('open');
        },
        destroy: function() {
            if (this._plugins.viewSource.dialog) dialog.dialog('close');
        }
    });
})(jQuery);
