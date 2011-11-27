$.ui.editor.registerUi({
    'float-left': {
        init: function(editor) {
            return editor.uiButton({
                title: _('Float Left'),
                click: function() {
                    editor.applyStyle({ 'float': 'left' });
                }
            });
        }
    },
    
    'float-right': {
        init: function(editor) {
            return editor.uiButton({
                title: _('Float Right'),
                click: function() {
                    editor.applyStyle({ 'float': 'right' });
                }
            });
        }
    },
    
    'float-none': {
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