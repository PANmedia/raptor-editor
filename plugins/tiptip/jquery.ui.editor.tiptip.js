(function($) {
    
    $.ui.editor.registerPlugin('tiptip', {
        
        options: {
            delay: 400,
            fadeIn: 200,
            fadeOut: 200,
            defaultPosition: 'top'
        },
        
        currentLocale: null,
        
        init: function(editor, options) {
            var tiptip = this;
            
            editor.bind('change', function() {
                // Only apply tiptip if it hasn't yet been applied, or the locale has been changed
                if (tiptip.currentLocale != options.locale) {
                    // <strict>
                    // Ensure jQuery has been included
                    if (!$.isFunction($.fn.tipTip)) {
                        console.error(_('jquery.ui.editor.tiptip requires TipTip. '));
                        return;
                    }
                    // </strict>
                    $.merge(editor.selToolbar('[title]'), editor.selTitle('[title]')).each(function() {
                        $(this).tipTip({
                            maxWidth: 'auto',
                            delay: options.delay,
                            fadeIn: options.fadeIn,
                            fadeOut: options.fadeOut,
                            defaultPosition: options.defaultPosition
                        });
                    });
                    this.currentLocale = options.locale;
                }
            });
        }
    });

})(jQuery);
