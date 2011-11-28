$.ui.editor.registerUi({
    'show-guides': {
        init: function(editor, options) {
            this.bind('destroy', function() {
                this.editor.getElement().removeClass(options.baseClass + ' -guides');
            });
            return editor.uiButton({
                title: _('Show Guides'),
                icon: 'ui-icon-pencil',
                click: function() {
                    editor.getElement().toggleClass(options.baseClass + '-guides');
                }
            });
        }
    }
});
