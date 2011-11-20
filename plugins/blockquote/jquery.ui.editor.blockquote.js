$.ui.editor.registerUi({
    'quote-block': function(editor) {
        this.ui = editor.uiButton({
            title: _('Blockquote'),
            click: function() {
                editor.toggleWrapper('blockquote');
            }
        });
    }
});
    