(function($) {
   
    $.ui.editor.addButton('floatLeft', {
        title: 'Float Left',
        icons: {
            primary: 'ui-icon-float-left'
        },
        classes: 'ui-editor-icon',
        click: function() {
            this._selection.applyStyle.call(this, { 'float': 'left' });
        }
    });
    
    $.ui.editor.addButton('floatRight', {
        title: 'Float Right',
        icons: {
            primary: 'ui-icon-float-right'
        },
        classes: 'ui-editor-icon',
        click: function() {
            this._selection.applyStyle.call(this, { 'float': 'right' });
        }
    });
    
    $.ui.editor.addButton('floatNone', {
        title: 'Float None',
        icons: {
            primary: 'ui-icon-float-none'
        },
        classes: 'ui-editor-icon',
        click: function() {
            this._selection.applyStyle.call(this, { 'float': 'none' });
        }
    });
    
})(jQuery);
