$.ui.editor.registerUi({
    'font-size-inc': function(editor) {
        this.ui = editor.uiButton({
            title: _('Increase Font Size'),
            click: function() {
                editor.execCommand('increasefontsize', false, null);
            }
        });
    },
    'font-size-dec': function(editor) {
        this.ui = editor.uiButton({
            title: _('Decrease Font Size'),
            click: function() {
                editor.execCommand('decreasefontsize', false, null);
            }
        });
    }
});

