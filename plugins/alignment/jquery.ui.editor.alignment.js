(function($) {
   
    $.ui.editor.addButton('alignLeft', {
        title: 'Left-align',
        icons: {
            primary: 'ui-icon-left-align'
        },
        classes: 'ui-editor-icon',
        click: function() {
            this._selection.applyStyle.call(this, { 'text-align': 'left' });
        }
    });
    
    $.ui.editor.addButton('justify', {
        title: 'Justify',
        icons: {
            primary: 'ui-icon-justify'
        },
        classes: 'ui-editor-icon',
        click: function() {
            this._selection.applyStyle.call(this, { 'text-align': 'justify' });
        }   
    });
    
    $.ui.editor.addButton('center', {
        title: 'Center-align',
        icons: {
            primary: 'ui-icon-center-align'
        },
        classes: 'ui-editor-icon',
        click: function() {
            this._selection.applyStyle.call(this, { 'text-align': 'center' });
        }
    });
    
    $.ui.editor.addButton('alignRight', {
        title: 'Right-align',
        icons: {
            primary: 'ui-icon-right-align'
        },
        classes: 'ui-editor-icon',
        click: function() {
            this._selection.applyStyle.call(this, { 'text-align': 'right' });
        }
    });
    
})(jQuery);
