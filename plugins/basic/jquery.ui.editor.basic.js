$.ui.editor.registerUi({
    'text-bold': {
        init: function(editor) {
            return this.editor.uiButton({
                title: _('Bold'),
                click: function() {
                    this.editor.toggleWrapper('strong');
                }
            });
        }
    },
    'text-italic': {
        init: function(editor) {
            return editor.uiButton({
                title: _('Italic'),
                click: function() {
                    editor.toggleWrapper('em');
                }
            });
        }
    },
    'text-underline': {
        init: function(editor) {
            return editor.uiButton({
                title: _('Underline'),
                click: function() {
                    editor.toggleWrapper('span', { classes: 'underline' });
                }
            });
        }
    },
    'text-strike': {
        init: function(editor) {
            return editor.uiButton({
                title: _('Strikethrough'),
                click: function() {
                    editor.toggleWrapper('del');
                }
            });
        }
    }
});
