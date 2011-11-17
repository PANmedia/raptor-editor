(function($) {
    
    // Add history undo / redo buttons
    console.info('FIXME: unbind events on destroy');
    $.ui.editor.registerUi({
        undo: function(editor) {
            this.ui = editor.uiButton({
                name: 'undo',
                title: _('Step Back'),
                icons: {
                    primary: 'ui-editor-icon-undo'
                },
                classes: 'ui-editor-icon',
                disabled: true,
                click: function() {
                    editor.historyBack();
                }
            });
            editor.bind('change', $.proxy(function() {
                this.ui.button('option', 'disabled', editor.present === 0);
            }, this));
        },
        redo: function(editor) {
            this.ui = editor.uiButton({
                name: 'redo',
                title: _('Step Forward'),
                icons: {
                    primary: 'ui-editor-icon-redo'
                },
                classes: 'ui-editor-icon',
                disabled: true,
                click: function() {
                    editor.historyForward();
                }
            });
            editor.bind('change', $.proxy(function() {
                this.ui.button('option', 'disabled', editor.present === editor.history.length - 1);
            }, this));
        }
    });

})(jQuery);
