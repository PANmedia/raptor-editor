(function($) {
    
    // Add history undo / redo buttons
    console.info('FIXME: unbind events on destroy');
    $.ui.editor.registerUi({
        'undo': function(editor) {
            var ui = this.ui = editor.uiButton({
                title: _('Step Back'),
                disabled: true,
                click: function() {
                    editor.historyBack();
                }
            });
            editor.bind('change', function() {
                if (editor.present === 0) ui.disable();
                else ui.enable();
            });
        },
        'redo': function(editor) {
            var ui = this.ui = editor.uiButton({
                title: _('Step Forward'),
                disabled: true,
                click: function() {
                    editor.historyForward();
                }
            });
            editor.bind('change', function() {
                if (editor.present === editor.history.length - 1) ui.disable();
                else ui.enable();
            });
        }
    });

})(jQuery);
