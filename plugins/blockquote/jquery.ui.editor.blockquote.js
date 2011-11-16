$.ui.editor.registerUi({
    blockquote: function(editor) {
        this.ui = editor.uiButton({
            name: 'blockquote',
            title: _('Blockquote'),
            icons: {
                primary: 'ui-icon-blockquote'
            },
            classes: 'ui-editor-icon',
            click: function() {
                editor.toggleWrapper('blockquote');
            }
        });
    }
});
    