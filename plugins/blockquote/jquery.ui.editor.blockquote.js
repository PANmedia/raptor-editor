$.ui.editor.registerUi({
    'quote-block': {
        init: function(editor) {
            return editor.uiButton({
                title: _('Blockquote'),
                click: function() {
                    editor.toggleWrapper('blockquote');
                }
            });
        }
    }
});
    