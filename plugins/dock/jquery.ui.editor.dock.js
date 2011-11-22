(function($) {
    
    $.ui.editor.registerPlugin('dock', {
        spacer: null,
        
        init: function() {
            this.spacer = $('<div class="' + this.options.baseClass + '-spacer"/>')
                .prependTo('body')
                .hide();
                
            this.bind('enabled', this.enable);
            this.bind('disabled', this.disable);
        },
        
        dock: function() {
            // Save the state of the dock
            this.persist('docked', true);
            
            // Change the dock button icon
            this.editor.selDialog().addClass(this.options.baseClass + '-docked')
                .find('.' + this.options.baseClass + '-button')
                .button({ icons: { primary: 'ui-icon-pin-w' } });
                
            // Add the header class to the editor toolbar
            this.editor.selToolbar('.' + this.editor.options.baseClass + '-inner')
                .addClass('ui-widget-header');
            
            // Reinitialise spacer when the toolbar is visible and stoped animating
            window.setTimeout(function(dock) {
                // Show the spacer 
                dock.spacer.height(dock.editor.selToolbar().outerHeight()).show();
                
                // Trigger the editor resize event to adjust other plugin element positions
                dock.editor.trigger('resize');
            }, 100, this);
        },
        
        undock: function() {
            // Save the state of the dock
            this.persist('docked', false);
            
            // Remove the header class from the editor toolbar
            this.editor.selToolbar('.' + this.editor.options.baseClass + '-inner')
                .removeClass('ui-widget-header');
                
            // Change the dock button icon
            this.editor.selDialog().removeClass(this.options.baseClass + '-docked')
                .find('.' + this.options.baseClass + '-button')
                .button({ icons: { primary: 'ui-icon-pin-s' } });
                
            // Hide the spacer 
            this.spacer.hide();
            
            // Trigger the editor resize event to adjust other plugin element positions
            this.editor.trigger('resize');
        },
        
        isDocked: function() {
            return this.persist('docked');
        },
        
        enable: function() {
            if (this.persist('docked') || this.options.docked) {
                this.dock();
            } 
        },
        
        disable: function() {
            this.spacer.hide();
        },
        
        destory: function() {
            this.spacer.remove();
        }
    });
    
//    $.ui.editor.registerPlugin('dock', function(editor, options) {
//        var plugin = this;
//        var persist = editor.persist('dock') || { docked: false };
//        var spacer = $('<div class="' + options.baseClass + '-spacer"/>').prependTo('body').hide();
//
//        this.dock = function() {
//            persist.docked = true;
//            editor.persist('dock', persist);
//            editor.selDialog().addClass(options.baseClass + '-docked')
//                  .find('.' + options.baseClass + '-button').button({ icons: { primary: 'ui-icon-pin-w' } });
//            editor.selToolbar('.' + editor.options.baseClass + '-inner').addClass('ui-widget-header');
//            window.setTimeout(function() {
//                spacer.height(editor.selToolbar().outerHeight()).show();
//                editor.trigger('resize');
//            }, 100);
//        }
//        
//        this.undock = function() {
//            persist.docked = false;
//            editor.persist('dock', persist);
//            editor.selToolbar('.' + editor.options.baseClass + '-inner').removeClass('ui-widget-header');
//            editor.selDialog().removeClass(options.baseClass + '-docked')
//                  .find('.' + options.baseClass + '-button').button({ icons: { primary: 'ui-icon-pin-s' } });
//            spacer.hide();
//            editor.trigger('resize');
//        }
//        
//        this.isDocked = function() {
//            return persist.docked;
//        }
//        
//        this.destroy = function() {
//            var spacer = $('.' + options.baseClass + '-spacer');
//            if (spacer.length) spacer.hide('fast');
//            delete editor;
//        }
//        
//        editor.bind('enabled', function() {
//            if (persist.docked || options.docked) {
//                plugin.dock();
//            } 
//        });
//        
//        editor.bind('disabled', function() {
//            spacer.hide();
//        });
//        
//        editor.bind('destroy', function() {
//            spacer.remove();
//        });
//    });
    
    $.ui.editor.registerUi({
        dock: function(editor) {
            this.ui = editor.uiButton({
                title: _('Click to dock the toolbar'),
                icon: editor.getPlugin('dock').isDocked() ? 'ui-icon-pin-w' : 'ui-icon-pin-s',
                click: function() {
                    var plugin = editor.getPlugin('dock');
                    if (plugin.isDocked()) plugin.undock();
                    else plugin.dock();
                }
            });
        }
    });
    
})(jQuery);
