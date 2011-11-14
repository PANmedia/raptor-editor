(function($) {
    $.ui.editor.addOptions('unsavedEditWarning', {
        content: 'This block contains unsaved changes',
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
        dataName: 'ui-widget-editor-unsaved-edits'
    });
    
    $.ui.editor.addPlugin('unsavedEditWarning', {
        
        stateChange: function() {
            if (this._content.dirty.call(this)) {
                this._plugins.unsavedEditWarning.show.call(this);
            } else {
                this._plugins.unsavedEditWarning.hide.call(this);
            }
        },
        
        show: function() {
            var warning = false,
                editorInstance = this,
                options = this.options.plugins.unsavedEditWarning;
                
            if (!this._data.exists(this.element, options.dataName)) {
                var warning = $('<div title="' + options.content + '" class="ui-widget-editor-warning ' 
                                + options.contentClass 
                                + '" style="display:none;">\
                                    <span class="ui-icon ui-icon-alert"></span>\
                                </div>').hover(function() {
                    $(this).stop().animate({ opacity: 1 });
                }, function() {
                    $(this).stop().animate({ opacity: options.contentIdleOpacity });
                }).appendTo('body');
                
                if (editorInstance.options.customTooltips) {
                    warning.tipTip({ 
                        delay: 100,
                        defaultPosition: options.contentTooltipPosition,
                        maxWidth: options.contentTooltipMaxWidth
                    });
                }
                this.element.data(options.dataName, warning);
            } else {
                var warning = this.element.data(options.dataName);
            }
            warning.position({
                at: options.positionAt,
                of: this.element,
                my: options.positionMy,
                using: options.contentPositionUsing
            })
            if (!warning.is(':visible') && !warning.is(':animated')) {
                warning.show(options.animation, function(){
                    $(this).animate({ opacity: options.contentIdleOpacity });
                });
            }
        },
        
        hide: function() {
            var options = this.options.plugins.unsavedEditWarning;
             if (this._data.exists(this.element, options.dataName)) {
                var warning = $(this.element.data(options.dataName));
                if (warning.is(':visible') && !warning.is(':animated')) warning.hide(options.animation);
             }
        }
    });
    
})(jQuery);
