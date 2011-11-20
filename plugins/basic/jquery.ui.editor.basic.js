$.ui.editor.registerUi({
    'text-bold': function(editor) {
        this.ui = editor.uiButton({
            title: _('Bold'),
            click: function() {
                editor.toggleWrapper('strong');
            }
        });
    },
    'text-italic': function(editor) {
        this.ui = editor.uiButton({
            title: _('Italic'),
            click: function() {
                editor.toggleWrapper('em');
            }
        });
    },
    'text-underline': function(editor) {
        this.ui = editor.uiButton({
            title: _('Underline'),
            click: function() {
                editor.toggleWrapper('span', { classes: 'underline' });
            }
        });
    },
    'text-strike': function(editor) {
        this.ui = editor.uiButton({
            title: _('Strikethrough'),
            click: function() {
                editor.toggleWrapper('del');
            }
        });
    }
});
