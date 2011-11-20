console.info('FIXME: check destroy gets called');
$.ui.editor.registerUi({
    'show-guides': function(editor, options) {
        this.ui = editor.uiButton({
            title: _('Show Guides'),
            icon: 'ui-icon-pencil',
            click: function() {
                editor.element.toggleClass(options.baseClass + '-guides');
            },
            destroy: function() {
                editor.element.removeClass(options.baseClass + ' -guides');
            }
        });
    }
});
