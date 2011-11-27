$.ui.editor.registerUi({
    'text-bold': {
        init: function(editor) {
            return this.editor.uiButton({
                title: _('Bold'),
                click: function() {
                    editor.toggleWrapper('strong', { classes: 'bold' });
                }
            });
        }
    },
    'text-italic': {
        init: function(editor) {
            return editor.uiButton({
                title: _('Italic'),
                click: function() {
                    editor.toggleWrapper('em', { classes: 'italic' });
                }
            });
        }
    },
    'text-underline': {
        init: function(editor) {
            return editor.uiButton({
                title: _('Underline'),
                click: function() {
                    editor.toggleWrapper('u', { classes: 'underline' });
                }
            });
        }
    },
    'text-strike': {
        init: function(editor) {
            return editor.uiButton({
                title: _('Strikethrough'),
                click: function() {
                    editor.toggleWrapper('del', { classes: 'strike' });
                }
            });
        }
    }
});
