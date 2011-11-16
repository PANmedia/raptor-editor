$.ui.editor.registerUi({
    bold: function(editor) {
        this.ui = editor.uiButton({
            name: 'bold',
            title: _('Bold'),
            icons: {
                primary: 'ui-icon-bold'
            },
            classes: 'ui-editor-icon',
            click: function() {
                editor.toggleWrapper('strong');
            }
        });
    },
    italic: function(editor) {
        this.ui = editor.uiButton({
            name: 'italic',
            title: _('Italic'),
            icons: {
                primary: 'ui-icon-italic'
            },
            classes: 'ui-editor-icon',
            click: function() {
                editor.toggleWrapper('em');
            }
        });
    },
    underline: function(editor) {
        this.ui = editor.uiButton({
            name: 'underline',
            title: _('Underline'),
            icons: {
                primary: 'ui-icon-underline'
            },
            classes: 'ui-editor-icon',
            click: function() {
                editor.toggleWrapper('span', { classes: 'underline' });
            }
        });
    },
    strikethrough: function(editor) {
        this.ui = editor.uiButton({
            name: 'strikethrough',
            title: _('Strikethrough'),
            icons: {
                primary: 'ui-icon-strikethrough'
            },
            classes: 'ui-editor-icon',
            click: function() {
                editor.toggleWrapper('del');
            }
        });
    }
});
