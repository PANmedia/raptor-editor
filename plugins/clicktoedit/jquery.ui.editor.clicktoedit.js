(function($) {
    
    $.ui.editor.registerPlugin('clicktoedit', function(editor, options) {
        var plugin = this;
        var message = $(editor.getTemplate('clicktoedit.message', options)).appendTo('body');
        
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
            editor.element.addClass(options.baseClass + '-highlight');
            editor.element.addClass(options.baseClass + '-hover');
            message.position(options.position);
            message.stop().animate({ opacity: 1 });
        }
        
        this.hide = function() {
            editor.element.removeClass(options.baseClass + '-highlight');
            editor.element.removeClass(options.baseClass + '-hover');
            message.stop().animate({ opacity: 0 });
        }
        
        this.edit = function() {
            plugin.hide();
            editor.enableEditing();
            editor.showToolbar();
        }
        
        message.position(options.position);
        editor.element.bind('mouseenter.' + editor.widgetName, plugin.show);
        editor.element.bind('mouseleave.' + editor.widgetName, plugin.hide);
        editor.element.bind('click.' + editor.widgetName, plugin.edit);
        editor.bind('destroy', function() {
            message.remove();
            editor.element.unbind('mouseenter.' + editor.widgetName, plugin.show);
            editor.element.unbind('mouseleave.' + editor.widgetName, plugin.hide);
            editor.element.unbind('click.' + editor.widgetName, plugin.edit);
        })
    });
    
})(jQuery);
