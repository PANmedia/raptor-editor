(function($) {
    
    $.ui.editor.addButton('bold', {
        title: _('Bold'),
        icons: {
            primary: 'ui-icon-bold'
        },
        classes: 'ui-editor-icon',
        click: function() {
            this._selection.wrapWithTag.call(this, 'strong');
        }
    });
    
    $.ui.editor.addButton('italic', {
        title: _('Italic'),
        icons: {
            primary: 'ui-icon-italic'
        },
        classes: 'ui-editor-icon',
        click: function() {
            this._selection.wrapWithTag.call(this, 'em');
        }
    });
    
    $.ui.editor.addButton('underline', {
        title: _('Underline'),
        icons: {
            primary: 'ui-icon-underline'
        },
        classes: 'ui-editor-icon',
        click: function() {
            this._selection.wrapWithTag.call(this, 'span', { classes: 'underline' });
        }
    });
    
    $.ui.editor.addButton('strikethrough', {
        title: _('Strikethrough'),
        icons: {
            primary: 'ui-icon-strikethrough'
        },
        classes: 'ui-editor-icon',
        click: function() {
            this._selection.wrapWithTag.call(this, 'del');
        }
    });

})(jQuery);
