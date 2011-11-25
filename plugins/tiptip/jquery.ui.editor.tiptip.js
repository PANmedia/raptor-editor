(function($) {
    
    $.ui.editor.registerPlugin('tiptip', {
        
        options: {
            delay: 400,
            fadeIn: 200,
            fadeOut: 200
        },
        
        currentLocale: null,
        
        init: function(editor, options) {
            var tiptip = this;
            
            editor.bind('change', function() {
                var tipTipOptions = {
                    maxWidth: 'auto',
                    delay: options.delay,
                    fadeIn: options.fadeIn,
                    fadeOut: options.fadeOut
                };
                // Only apply tiptip to the core elements if it hasn't yet been applied, or the locale has been changed
                if (tiptip.currentLocale != options.locale) {
                    // <strict>
                    // Ensure jQuery has been included
                    if (!$.isFunction($.fn.tipTip)) {
                        handleError(_('jquery.ui.editor.tiptip requires TipTip. '));
                        return;
                    }
                    // </strict>
                    $.merge(editor.selToolbar('[title]'), editor.selTitle('[title]')).each(function() {
                        $(this).tipTip($.extend(tipTipOptions, { defaultPosition: 'top' }));
                    });
                    this.currentLocale = options.locale;
                }
                // Unsaved edit warnings could be added / removed on change, so we should check for them each time
                $('body div.ui-editor-unsaved-edit-warning-warning[title]').tipTip($.extend(tipTipOptions, { defaultPosition: 'right' }));
            });
        }
    });

})(jQuery);
