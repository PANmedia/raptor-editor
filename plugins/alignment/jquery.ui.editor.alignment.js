$.ui.editor.registerUi({
    'align-left': {
        init: function(editor) {
            return editor.uiButton({
                title: _('Left Align'),
                click: function() {
                    editor.applyStyle({ 'text-align': 'left' });
                }
            });
        }
    },

    'align-justify': {
        init: function(editor) {
            return editor.uiButton({
                title: _('Justify'),
                click: function() {
                    editor.applyStyle({ 'text-align': 'justify' });
                }
            });
        }
    },

    'align-center': {
        init: function(editor) {
            return editor.uiButton({
                title: _('Center Align'),
                click: function() {
                    editor.applyStyle({ 'text-align': 'center' });
                }
            });
        }
    },

    'align-right': {
        init: function(editor) {
            return editor.uiButton({
                title: _('Right Align'),
                click: function() {
                    editor.applyStyle({ 'text-align': 'right' });
                }
            });
        }
    }
});
