$.ui.editor.addButton('hr', function(editor) {
    this.title = _('Insert Horizontal Rule');
    this.icons = {
        primary: 'ui-icon-hr'
    };
    this.classes = 'ui-editor-icon';
    this.click = function() {
        editor.insertTag('hr');
    }
});
