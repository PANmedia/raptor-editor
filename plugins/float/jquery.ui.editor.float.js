$.ui.editor.registerUi({
    floatLeft: {
        init: function(editor) {
            return editor.uiButton({
                title: _('Float Left'),
                click: function() {
                    editor.applyStyle({ 'float': 'left' });
                }
            });
        }
    },

    floatRight: {
        init: function(editor) {
            return editor.uiButton({
                title: _('Float Right'),
                click: function() {
                    editor.applyStyle({ 'float': 'right' });
                }
            });
        }
    },

    floatNone: {
        init: function(editor) {
            return editor.uiButton({
                title: _('Float None'),
                click: function() {
                    editor.applyStyle({ 'float': 'none' });
                }
            });
        }
    }
});