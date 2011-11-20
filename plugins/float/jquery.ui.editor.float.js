$.ui.editor.registerUi({
    'float-left': function(editor) {
        this.ui = editor.uiButton({
            title: _('Float Left'),
            click: function() {
                editor.applyStyle({ 'float': 'left' });
            }
        });
    },
    
    'float-right': function(editor) {
        this.ui = editor.uiButton({
            title: _('Float Right'),
            click: function() {
                editor.applyStyle({ 'float': 'right' });
            }
        });
    },
    
    'float-none': function(editor) {
        this.ui = editor.uiButton({
            title: _('Float None'),
            click: function() {
                editor.applyStyle({ 'float': 'none' });
            }
        });
    }
});