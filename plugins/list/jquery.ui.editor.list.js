console.info('FIXME: list plugin');
$.ui.editor.addButton('unorderedList', function(editor) {
    this.title = _('Unordered List');
    this.icons = {
        primary: 'ui-icon-unordered-list'
    };
    this.classes = 'ui-editor-icon';
    this.click = function() {
        editor.toggleWrapper('ul');
    }
});

$.ui.editor.addButton('orderedList', function(editor) {
    this.title = _('Ordered List');
    this.icons = {
        primary: 'ui-icon-ordered-list'
    };
    this.classes = 'ui-editor-icon';
    this.click = function() {
        editor.toggleWrapper('ol');
    }
});
