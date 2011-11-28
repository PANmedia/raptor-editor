$.ui.editor.registerUi({
    'text-bold': {
        init: function(editor, options) {
            return this.editor.uiButton({
                title: _('Bold'),
                click: function() {
                    editor.toggleWrapper('strong', { classes: options.cssPrefix + 'bold' });
                }
            });
        }
    },
    'text-italic': {
        init: function(editor, options) {
            return editor.uiButton({
                title: _('Italic'),
                click: function() {
                    editor.toggleWrapper('em', { classes: options.cssPrefix + 'italic' });
                }
            });
        }
    },
    'text-underline': {
        init: function(editor, options) {
            return editor.uiButton({
                title: _('Underline'),
                click: function() {
                    editor.toggleWrapper('u', { classes: options.cssPrefix + 'underline' });
                }
            });
        }
    },
    'text-strike': {
        init: function(editor, options) {
            return editor.uiButton({
                title: _('Strikethrough'),
                click: function() {
                    editor.toggleWrapper('del', { classes: options.cssPrefix + 'strike' });
                }
            });
        }
    }
});
