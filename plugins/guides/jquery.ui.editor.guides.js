console.info('FIXME: check destroy gets called');
$.ui.editor.registerUi({
    showGuides: function(editor) {
        this.ui = editor.uiButton({
            name: 'showGuides',
            title: _('Show Guides'),
            icons: {
                primary: 'ui-icon-pencil'
            },
            click: function() {
                editor.element.toggleClass('ui-widget-editor-guides');
            },
            destroy: function() {
                editor.element.removeClass('ui-widget-editor-guides');
            }
        });
    }
});
