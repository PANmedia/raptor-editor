$.ui.editor.registerUi({
    hr: function(editor) {
        this.ui = editor.uiButton({
            name: 'hr',
            title: _('Insert Horizontal Rule'),
            icons: {
                primary: 'ui-icon-hr'
            },
            classes: 'ui-editor-icon',
            click: function() {
                editor.insertElement('hr');
            }
        });
    }
});
