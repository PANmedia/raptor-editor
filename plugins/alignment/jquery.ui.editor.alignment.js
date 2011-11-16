$.ui.editor.registerUi({
    alignLeft: function(editor) {
        this.ui = editor.uiButton({
            name: 'leftAlign',
            title: _('Left Align'),
            icons: {
                primary: 'ui-icon-left-align'
            },
            classes: 'ui-editor-icon',
            click: function() {
                editor.applyStyle({ 'text-align': 'left' });
            }
        });
    },

    justify: function(editor) {
        this.ui = editor.uiButton({
            name: 'justify',
            title: _('Justify'),
            icons: {
                primary: 'ui-icon-justify'
            },
            classes: 'ui-editor-icon',
            click: function() {
                editor.applyStyle({ 'text-align': 'justify' });
            }
        });
    },

    center: function(editor) {
        this.ui = editor.uiButton({
            name: 'centerAlign',
            title: _('Center Align'),
            icons: {
                primary: 'ui-icon-center-align'
            },
            classes: 'ui-editor-icon',
            click: function() {
                editor.applyStyle({ 'text-align': 'center' });
            }
        });
    },

    alignRight: function(editor) {
        this.ui = editor.uiButton({
            name: 'rightAlign',
            title: _('Right Align'),
            icons: {
                primary: 'ui-icon-right-align'
            },
            classes: 'ui-editor-icon',
            click: function() {
                editor.applyStyle({ 'text-align': 'right' });
            }
        });
    }
});
