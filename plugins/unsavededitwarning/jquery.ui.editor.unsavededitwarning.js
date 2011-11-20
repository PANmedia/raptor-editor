(function() {
        
    $.ui.editor.registerPlugin('unsaved-edit-warning', function(editor, options) {
        var plugin = this;
        var warning = $(editor.getTemplate('unsavededitwarning.warning'))
                .hide()
                .appendTo('body')
                .hover(function() {
                    $(this).stop().animate({opacity: 1});
                }, function() {
                    $(this).stop().animate({opacity: options.contentIdleOpacity});
                });
        
        // Default options
        options = $.extend({}, {
            contentTooltipPosition: 'bottom',
            contentTooltipMaxWidth: 'auto',
            contentClass: '',
            animation: 'fade',
            position: {
                collision: 'right bottom',
                at: 'right bottom',
                of: editor.element,
                my: 'right bottom',
                using: function(position) {
                    $(this).css({
                        position: 'absolute',
                        top: position.top,
                        left: position.left
                    });
                }
            },
            contentIdleOpacity: 0.5,
            dataName: 'uiWidgetEditorUnsavedEdits'
        }, options);

        this.show = function() {
            this.reposition();
            if (!warning.is(':visible') && !warning.is(':animated')) {
                warning.show(options.animation, function() {
                    $(this).animate({opacity: options.contentIdleOpacity});
                });
            }
        }

        this.hide = function() {
            if (warning.is(':visible') && !warning.is(':animated')) {
                warning.hide(options.animation);
            }
        }

        this.reposition = function() {
            warning.position(options.position);
        }
        
        editor.bind('change', function() {
            if (editor.isDirty()) plugin.show();
            else plugin.hide();
        });
        
        editor.bind('destroy', function() {
            warning.remove();
        })
    });

    $.ui.editor.bind('resize', function() {
        $.each(this.getInstances(), function() {
            var plugin = this.getPlugin('unsavedEditWarning');
            if (plugin) {
                plugin.reposition();
            }
        });
    });
    
})();
