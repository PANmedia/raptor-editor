(function($) {
   
    $.ui.editor.addButton('showGuides', {
        title: 'Show Guides',
        icons: {
            primary: 'ui-icon-pencil'
        },
        click: function() {
            this.element.toggleClass('ui-widget-editor-guides');
        },
        destroy: function() {
            this.element.removeClass('ui-widget-editor-guides');
        }
    });
    
})(jQuery);
