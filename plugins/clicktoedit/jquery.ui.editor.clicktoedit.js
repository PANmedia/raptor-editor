(function($) {
    
    $.ui.editor.registerPlugin('clicktoedit', {
        init: function(editor, options) {
            var plugin = this;
            var message = $(editor.getTemplate('clicktoedit.message', options)).appendTo('body');

            // Default options
            options = $.extend({}, {
                position: {
                    at: 'center center',
                    of: editor.getElement(),
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
                editor.getElement().addClass(options.baseClass + '-highlight');
                editor.getElement().addClass(options.baseClass + '-hover');
                message.position(options.position);
                message.stop().animate({ opacity: 1 });
            }

            this.hide = function() {
                editor.getElement().removeClass(options.baseClass + '-highlight');
                editor.getElement().removeClass(options.baseClass + '-hover');
                message.stop().animate({ opacity: 0 });
            }

            this.edit = function() {
                plugin.hide();
                if (!editor.isEditing()) editor.enableEditing();
                if (!editor.isToolbarVisible()) editor.showToolbar();
            }

            message.position(options.position);
            editor.getElement().bind('mouseenter.' + editor.widgetName, plugin.show);
            editor.getElement().bind('mouseleave.' + editor.widgetName, plugin.hide);
            editor.getElement().bind('click.' + editor.widgetName, plugin.edit);
            editor.bind('destroy', function() {
                message.remove();
                editor.getElement().unbind('mouseenter.' + editor.widgetName, plugin.show);
                editor.getElement().unbind('mouseleave.' + editor.widgetName, plugin.hide);
                editor.getElement().unbind('click.' + editor.widgetName, plugin.edit);
            })
        }
    });
    
})(jQuery);
