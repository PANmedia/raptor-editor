(function($) {
    
    $.ui.editor.addButton('unorderedList', {
        title: 'Unordered List',
        icons: {
            primary: 'ui-icon-unordered-list'
        },
        classes: 'ui-editor-icon',
        click: function() {
            this._selection.wrapWithTag.call(this, 'ul');
        }
    });
    
    $.ui.editor.addButton('orderedList', {
        title: 'Ordered List',
        icons: {
            primary: 'ui-icon-ordered-list'
        },
        classes: 'ui-editor-icon',
        click: function() {
            this._selection.wrapWithTag.call(this, 'ol');
        }
    });
    
})(jQuery);
