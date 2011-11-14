(function($) {
   
    $.ui.editor.addButton('floatLeft', {
        title: _('Float Left'),
        icons: {
            primary: 'ui-icon-float-left'
        },
        classes: 'ui-editor-icon',
        click: function() {
            this._selection.applyStyle.call(this, { 'float': 'left' });
        }
    });
    
    $.ui.editor.addButton('floatRight', {
        title: _('Float Right'),
        icons: {
            primary: 'ui-icon-float-right'
        },
        classes: 'ui-editor-icon',
        click: function() {
            this._selection.applyStyle.call(this, { 'float': 'right' });
        }
    });
    
    $.ui.editor.addButton('floatNone', {
        title: _('Float None'),
        icons: {
            primary: 'ui-icon-float-none'
        },
        classes: 'ui-editor-icon',
        click: function() {
            this._selection.applyStyle.call(this, { 'float': 'none' });
        }
    });
    
})(jQuery);
