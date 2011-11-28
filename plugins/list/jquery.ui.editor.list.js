// <debug>
console.info('FIXME: list plugin');
// </debug>
$.ui.editor.registerUi({
    'list-unordered': {
        init: function(editor) {
            return editor.uiButton({
                title: _('Unordered List'),
                click: function() {
                    editor.toggleWrapper('ul');
                }
            });
        }
    },
    'list-ordered': {
        init: function(editor) {
            return editor.uiButton({
                title: _('Ordered List'),
                click: function() {
                    editor.toggleWrapper('ol');
                }
            });
        }
    }
});
