$.ui.editor.registerUi({
    floatLeft: function(editor) {
        this.ui = editor.uiButton({
            name: 'floatLeft',
            title: _('Float Left'),
            icons: {
                primary: 'ui-icon-float-left'
            },
            classes: 'ui-editor-icon',
            click: function() {
                editor.applyStyle({ 'float': 'left' });
            }
        });
    },
    
    floatRight: function(editor) {
        this.ui = editor.uiButton({
            name: 'floatRight',
            title: _('Float Right'),
            icons: {
                primary: 'ui-icon-float-right'
            },
            classes: 'ui-editor-icon',
            click: function() {
                editor.applyStyle({ 'float': 'right' });
            }
        });
    },
    
    floatNone: function(editor) {
        this.ui = editor.uiButton({
            name: 'floatNone',
            title: _('Float None'),
            icons: {
                primary: 'ui-icon-float-none'
            },
            classes: 'ui-editor-icon',
            click: function() {
                editor.applyStyle({ 'float': 'none' });
            }
        });
    }
});