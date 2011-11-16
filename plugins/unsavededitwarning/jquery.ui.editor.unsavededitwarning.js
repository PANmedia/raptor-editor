(function() {
    var defaultOptions = {
        content: _('This block contains unsaved changes'),
        contentTooltipPosition: 'bottom',
        contentTooltipMaxWidth: 'auto',
        contentClass: '',
        animation: 'fade',
        positionAt: 'right bottom',
        positionMy: 'right bottom',
        contentIdleOpacity: 0.5,
        contentPositionUsing: function(position) {
            $(this).css({
                position: 'absolute',
                top: position.top,
                left: position.left
            });
        },
        dataName: 'uiWidgetEditorUnsavedEdits'
    };
    
    var unsavedEditWarning = function(editor, options) {
        var element = null;
        options = $.extend(defaultOptions, options);
        this.test = editor.element;
        
        editor.bind('change', $.proxy(function() {
            if (editor.isDirty()) this.show();
            else this.hide();
        }, this));

        this.show = function() {
            var warning = this.warning();
            this.reposition();
            if (!warning.is(':visible') && !warning.is(':animated')) {
                warning.show(options.animation, function() {
                    $(this).animate({opacity: options.contentIdleOpacity});
                });
            }
        }

        this.hide = function() {
            var warning = this.warning();
            if (warning.is(':visible') && !warning.is(':animated')) {
                warning.hide(options.animation);
            }
        }

        this.warning = function() {
            if (!element) {
                element = $('<div title="' + options.content + '" class="ui-widget-editor-warning ' + options.contentClass + '" style="display:none;">' +
                                 '<span class="ui-icon ui-icon-alert"></span>' +
                             '</div>');
                element.appendTo('body')
                element.hover(function() {
                    $(this).stop().animate({opacity: 1});
                }, function() {
                    $(this).stop().animate({opacity: options.contentIdleOpacity});
                });
            }
            return element;
        }

        this.reposition = function() {
            this.warning().position({
                at: options.positionAt,
                of: editor.element,
                my: options.positionMy,
                using: options.contentPositionUsing
            });
        }
    };
    
    $.ui.editor.bind('resize', function() {
        $.each(this.getInstances(), function() {
            this.getPlugin('unsavedEditWarning').reposition();
        });
    });
        
    $.ui.editor.addPlugin('unsavedEditWarning', unsavedEditWarning);
    
})();
