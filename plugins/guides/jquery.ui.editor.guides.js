// <debug>
console.info('FIXME: check destroy gets called');
// </debug>

$.ui.editor.registerUi({
    'show-guides': {
        init: function(editor) {
            return editor.uiButton({
                title: _('Show Guides'),
                icon: 'ui-icon-pencil',
                click: function() {
                    editor.getElement().toggleClass(options.baseClass + '-guides');
                },
                destroy: function() {
                    editor.getElement().removeClass(options.baseClass + ' -guides');
                }
            });
        }
    }
});
