$.ui.editor.registerUi({
    'hr': function(editor) {
        this.ui = editor.uiButton({
            title: _('Insert Horizontal Rule'),
            click: function() {
                editor.insertElement('hr');
            }
        });
    }
});
