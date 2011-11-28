$.ui.editor.registerUi({
    'list-unordered': {
        init: function(editor) {
            return editor.uiButton({
                title: _('Unordered List'),
                click: function() {
                    if (!editor.selectionExists(rangy.getSelection())) {
                        editor.insertElement('<ul><li>First list item</li></ul>');
                    } else {
                        editor.toggleWrapper('ul');
                        editor.toggleWrapper('li');
                    }
                }
            });
        }
    },
    'list-ordered': {
        init: function(editor) {
            return editor.uiButton({
                title: _('Ordered List'),
                click: function() {
                    if (!editor.selectionExists(rangy.getSelection())) {
                        editor.insertElement('<ol><li>First list item</li></ol>');
                    } else {
                        editor.toggleWrapper('ol');
                        editor.toggleWrapper('li');
                    }
                }
            });
        }
    }
});
