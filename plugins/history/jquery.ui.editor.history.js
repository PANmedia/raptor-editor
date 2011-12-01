// <debug>
if (debugLevel >= MAX) {
    info('FIXME: unbind events on destroy');
}
// </debug>

// Add history undo / redo buttons
$.ui.editor.registerUi({
    'undo': {
        init: function(editor) {
            editor.bind('change', this.change, this);
            
            return editor.uiButton({
                title: _('Step Back'),
                disabled: true,
                click: function() {
                    editor.historyBack();
                }
            });
        },
        change: function() {
            if (this.editor.present === 0) this.ui.disable();
            else this.ui.enable();
        }
    },
    'redo': {
        init: function(editor) {
            editor.bind('change', this.change, this);
            
            return this.ui = editor.uiButton({
                title: _('Step Forward'),
                disabled: true,
                click: function() {
                    editor.historyForward();
                }
            });
        },
        change: function() {
            if (this.editor.present === this.editor.history.length - 1) this.ui.disable();
            else this.ui.enable();
        }
    }
});
