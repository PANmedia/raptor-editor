$.ui.editor.addButton('showGuides', function(editor) {
    this.title = _('Show Guides');
    this.icons = {
        primary: 'ui-icon-pencil'
    };
    this.click = function() {
        editor.element.toggleClass('ui-widget-editor-guides');
    }
    console.info('FIXME: chack destroy gets called');
    this.destroy = function() {
        editor.element.removeClass('ui-widget-editor-guides');
    }
});
