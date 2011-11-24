$.ui.editor.registerUi({
    'font-size-inc': {
        init: function(editor) {
            return editor.uiButton({
                title: _('Increase Font Size'),
                click: function() {
                    editor.execCommand('increasefontsize', false, null);
                }
            });
        }
    },
    'font-size-dec': {
        init: function(editor) {
            return editor.uiButton({
                title: _('Decrease Font Size'),
                click: function() {
                    editor.execCommand('decreasefontsize', false, null);
                }
            });
        }
    }
});

