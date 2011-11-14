(function($) {
    $.ui.editor.addOptions({
        unsavedEditWarningContent: 'This block contains unsaved changes',
        unsavedEditWarningContentTooltipPosition: 'bottom',
        unsavedEditWarningContentTooltipMaxWidth: 'auto',
        unsavedEditWarningContentClass: '',
        unsavedEditWarningAnimation: 'fade',
        unsavedEditWarningPositionAt: 'right bottom',
        unsavedEditWarningPositionMy: 'right bottom',
        unsavedEditWarningContentIdleOpacity: 0.5,
        unsavedEditWarningContentPositionUsing: function(position) {
            $(this).css({
                position: 'absolute',
                top: position.top,
                left: position.left
            });
        }
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
                editorInstance = this;
            if (!this._data.exists(this.element, this._data.names.unsavedEditsWarning)) {
                var warning = $('<div title="' + this.options.unsavedEditWarningContent + '" class="ui-widget-editor-warning ' 
                                + this.options.unsavedEditWarningContentClass 
                                + '" style="display:none;">\
                                    <span class="ui-icon ui-icon-alert"></span>\
                                </div>').hover(function() {
                    $(this).stop().animate({ opacity: 1 });
                }, function() {
                    $(this).stop().animate({ opacity: editorInstance.options.unsavedEditWarningContentIdleOpacity });
                }).appendTo('body');
                
                if (editorInstance.options.customTooltips) {
                    warning.tipTip({ 
                        delay: 100,
                        defaultPosition: this.options.unsavedEditWarningContentTooltipPosition,
                        maxWidth: this.options.unsavedEditWarningContentTooltipMaxWidth
                    });
                }
                this.element.data(this._data.names.unsavedEditsWarning, warning);
            } else {
                var warning = this.element.data(this._data.names.unsavedEditsWarning);
            }
            warning.position({
                at: this.options.unsavedEditWarningPositionAt,
                of: this.element,
                my: this.options.unsavedEditWarningPositionMy,
                using: this.options.unsavedEditWarningContentPositionUsing
            })
            if (!warning.is(':visible') && !warning.is(':animated')) {
                warning.show(this.options.unsavedEditWarningAnimation, function(){
                    $(this).animate({ opacity: editorInstance.options.unsavedEditWarningContentIdleOpacity });
                });
            }
        },
        
        hide: function() {
             if (this._data.exists(this.element, this._data.names.unsavedEditsWarning)) {
                var warning = $(this.element.data(this._data.names.unsavedEditsWarning));
                if (warning.is(':visible') && !warning.is(':animated')) warning.hide(this.options.unsavedEditWarningAnimation);
             }
        }
    });
    
})(jQuery);
