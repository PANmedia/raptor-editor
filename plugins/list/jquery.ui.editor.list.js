(function($) {
    
    $.ui.editor.addButton('unorderedList', {
        title: _('Unordered List'),
        icons: {
            primary: 'ui-icon-unordered-list'
        },
        classes: 'ui-editor-icon',
        click: function() {
            this._selection.wrapWithTag.call(this, 'ul');
        }
    });
    
    $.ui.editor.addButton('orderedList', {
        title: _('Ordered List'),
        icons: {
            primary: 'ui-icon-ordered-list'
        },
        classes: 'ui-editor-icon',
        click: function() {
            this._selection.wrapWithTag.call(this, 'ol');
        }
    });
    
})(jQuery);
