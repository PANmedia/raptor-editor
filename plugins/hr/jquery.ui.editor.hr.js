$.ui.editor.registerUi({
    'hr': {
        init: function(editor) {
            return editor.uiButton({
                title: _('Insert Horizontal Rule'),
                click: function() {
                    editor.replaceSelection('<hr/>');
                }
            });
        }
    }
});
