(function($) {
    
    $.ui.editor.registerPlugin('tiptip', {
        
        options: {
            delay: 400,
            fadeIn: 200,
            fadeOut: 200
        },
        
        currentLocale: null,
        docked: false,

        init: function(editor, options) {
            var ui = this;
            
            editor.bind('resize', function() {

                // Need to check for the docking plugin, and if so whether the editor has been docked / undocked
                var docked = this.getPlugin('dock') ? this.getPlugin('dock').isDocked() : false;

                // Only apply tiptip to the core elements if it hasn't yet been applied, 
                // or the locale has been changed or the editor docked / undocked
                if (ui.currentLocale != options.locale || docked != ui.docked) {
                    // <strict>
                    // Ensure jQuery has been included
                    if (!$.isFunction($.fn.tipTip)) {
                        handleError(_('jquery.ui.editor.tiptip requires TipTip. '));
                        return;
                    }
                    // </strict>
                    var tipTipOptions = {
                        maxWidth: 'auto',
                        delay: options.delay,
                        fadeIn: options.fadeIn,
                        fadeOut: options.fadeOut,
                        defaultPosition: docked ? 'bottom' : 'top' 
                    };

                    // Apply tiptip to all children of the relevant elements that either have a title attribute or the required class
                    $.merge(editor.selToolbar('[title], .' + options.baseClass + '-tiptip'), editor.selTitle('[title], .' + options.baseClass + '-tiptip')).each(function() {
                        $(this).tipTip(tipTipOptions).addClass(options.baseClass + '-tiptip');
                    });
                    ui.docked = docked;
                    ui.currentLocale = options.locale;
                }
                // Unsaved edit warnings could be added / removed on change, so we should check for them each time
                $('body div.ui-editor-unsaved-edit-warning-warning[title]').tipTip($.extend(tipTipOptions, { defaultPosition: 'right' }));
            });
        }
    });

})(jQuery);
