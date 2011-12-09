$.ui.editor.registerUi({
    showGuides: {
        init: function(editor, options) {
            this.bind('destroy', function() {
                this.editor.getElement().removeClass(options.baseClass + '-visible');
            });
            return editor.uiButton({
                title: _('Show Guides'),
                icon: 'ui-icon-pencil',
                click: function() {
                    editor.getElement().toggleClass(options.baseClass + '-visible');
                }
            });
        }
    }
});
