$.ui.editor.registerUi({
    'align-left': function(editor) {
        this.ui = editor.uiButton({
            title: _('Left Align'),
            click: function() {
                editor.applyStyle({ 'text-align': 'left' });
            }
        });
    },

    'align-justify': function(editor) {
        this.ui = editor.uiButton({
            title: _('Justify'),
            click: function() {
                editor.applyStyle({ 'text-align': 'justify' });
            }
        });
    },

    'align-center': function(editor) {
        this.ui = editor.uiButton({
            title: _('Center Align'),
            click: function() {
                editor.applyStyle({ 'text-align': 'center' });
            }
        });
    },

    'align-right': function(editor) {
        this.ui = editor.uiButton({
            title: _('Right Align'),
            click: function() {
                editor.applyStyle({ 'text-align': 'right' });
            }
        });
    }
});
