$.ui.editor.registerUi({
    'align-left': {
        init: function(editor) {
            return editor.uiButton({
                title: _('Left Align'),
                click: function() {
                    editor.toggleBlockStyle({ 
                        'text-align': 'left' 
                    }, editor.getElement());
                }
            });
        }
    },

    'align-justify': {
        init: function(editor) {
            return editor.uiButton({
                title: _('Justify'),
                click: function() {
                    editor.toggleBlockStyle({ 
                        'text-align': 'justify' 
                    }, editor.getElement());
                }
            });
        }
    },

    'align-center': {
        init: function(editor) {
            return editor.uiButton({
                title: _('Center Align'),
                click: function() {
                    editor.toggleBlockStyle({ 
                        'text-align': 'center' 
                    }, editor.getElement());
                }
            });
        }
    },

    'align-right': {
        init: function(editor) {
            return editor.uiButton({
                title: _('Right Align'),
                click: function() {
                    editor.toggleBlockStyle({ 
                        'text-align': 'right' 
                    }, editor.getElement());
                }
            });
        }
    }
});
