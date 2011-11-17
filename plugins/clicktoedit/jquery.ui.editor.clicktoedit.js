(function($) {
    
    $.ui.editor.addPlugin('clicktoedit', function(editor, options) {
        var plugin = this;
        var message = $(editor.getTemplate('clicktoedit.message')).appendTo('body');
        
        // Default options
        options = $.extend({}, {
            position: {
                at: 'center center',
                of: editor.element,
                my: 'center center',
                using: function(position) {
                    $(this).css({
                        position: 'absolute',
                        top: position.top,
                        left: position.left
                    });
                }
            }
        }, options);
        
        this.show = function() {
            if (editor.isEditing()) return;
            editor.element.addClass('ui-widget-editor-highlight');
            editor.element.addClass('ui-widget-editor-hover');
            message.position(options.position);
            message.stop().animate({ opacity: 1 });
        }
        
        this.hide = function() {
            editor.element.removeClass('ui-widget-editor-highlight');
            editor.element.removeClass('ui-widget-editor-hover');
            message.stop().animate({ opacity: 0 });
        }
        
        this.edit = function() {
            plugin.hide();
            editor.enableEditing();
            editor.showToolbar();
        }
        
        message.position(options.position);
        editor.element.bind('mouseenter.' + editor.widgetName, this.show);
        editor.element.bind('mouseleave.' + editor.widgetName, this.hide);
        editor.element.bind('click.' + editor.widgetName, this.edit);
    });
    
})(jQuery);
