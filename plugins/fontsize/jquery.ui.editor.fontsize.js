$.ui.editor.registerUi({
    increaseFontSize: function(editor) {
        this.ui = editor.uiButton({
            name: 'increaseFontSize',
            title: _('Increase Font Size'),
            icons: {
                primary: 'ui-icon-font-increase'
            },
            classes: 'ui-editor-icon',
            click: function() {
                editor.execCommand('increasefontsize', false, null);
            }
        });
    },
    decreaseFontSize: function(editor) {
        this.ui = editor.uiButton({
            name: 'decreaseFontSize',
            title: _('Decrease Font Size'),
            icons: {
                primary: 'ui-icon-font-decrease'
            },
            classes: 'ui-editor-icon',
            click: function() {
                editor.execCommand('decreasefontsize', false, null);
            }
        });
    }
});

