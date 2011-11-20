console.info('FIXME: list plugin');
$.ui.editor.registerUi({
    'list-unordered': function(editor) {
        this.ui = editor.uiButton({
            title: _('Unordered List'),
            click: function() {
                editor.toggleWrapper('ul');
            }
        });
    },
    'list-ordered': function(editor) {
        this.ui = editor.uiButton({
            title: _('Ordered List'),
            click: function() {
                editor.toggleWrapper('ol');
            }
        });
    }
});
