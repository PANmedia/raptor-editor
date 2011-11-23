(function($) {
    
    var spacer;
    
    function swapStyle(element1, element2, style) {
        for (var name in style) {
            element1.css(name, element2.css(name));
            element2.css(name, style[name]);
        }
    }
    
    $.ui.editor.registerPlugin('dock', {
        init: function() {
            if (!spacer) {
                spacer = $('<div class="' + this.options.baseClass + '-spacer"/>')
                    .prependTo('body')
                    .hide();
            }
            
            this.docked = this.persist('docked');
                
            this.bind('enabled', this.enable);
            this.bind('disabled', this.disable);
            this.bind('show', spacer.show, spacer);
            this.bind('hide', spacer.hide, spacer);
        },
        
        dock: function() {
            // Save the state of the dock
            this.docked = this.persist('docked', true);
            
            if (this.options.dockToElement) {
                this.editor.selDialog()
                    .insertBefore(this.editor.element)
                    .addClass(this.options.baseClass + '-docked-to-element');
                this.editor.element.appendTo(this.editor.selDialog());
                var style = this.editor.getComputedStyle(this.editor.element);
                swapStyle(this.editor.selDialog().wrapAll('<div/>').parent().addClass('ui-widget-content'), this.editor.element, {
                    'diaplay': 'block',
                    'float': 'none',
                    'clear': 'none',
                    'position': 'relative',
                    'margin-left': 0,
                    'margin-right': 0,
                    'margin-top': 0,
                    'margin-bottom': 0,
                    'outline': 0
                });
                //this.editor.element.addClass(this.options.baseClass + '-docked-element');
            } else {
                this.editor.selDialog().addClass(this.options.baseClass + '-docked')
            
                // Reinitialise spacer when the toolbar is visible and stoped animating
                window.setTimeout(function(dock) {
                    // Show the spacer 
                    var toolbar = dock.editor.selToolbar();
                    if (toolbar.is(':visible')) {
                        spacer.height(toolbar.outerHeight()).show();
                    }

                    // Trigger the editor resize event to adjust other plugin element positions
                    dock.editor.trigger('resize');
                }, 100, this);
            }
            
            // Change the dock button icon
            this.editor.selDialog()
                .find('.' + this.options.baseClass + '-button')
                .button({ icons: { primary: 'ui-icon-pin-w' } });
                
            // Add the header class to the editor toolbar
            this.editor.selToolbar('.' + this.editor.options.baseClass + '-inner')
                .addClass('ui-widget-header');
        },
        
        undock: function() {
            // Save the state of the dock
            this.docked = this.persist('docked', false);
            
            // Remove the header class from the editor toolbar
            this.editor.selToolbar('.' + this.editor.options.baseClass + '-inner')
                .removeClass('ui-widget-header');
                
            // Change the dock button icon
            this.editor.selDialog().removeClass(this.options.baseClass + '-docked')
                .find('.' + this.options.baseClass + '-button')
                .button({ icons: { primary: 'ui-icon-pin-s' } });
                
            // Hide the spacer 
            spacer.hide();
            
            // Trigger the editor resize event to adjust other plugin element positions
            this.editor.trigger('resize');
        },
        
        isDocked: function() {
            return this.docked;
        },
        
        enable: function() {
            if (this.persist('docked') || this.options.docked) {
                this.dock();
            } 
        },
        
        disable: function() {
            spacer.hide();
        },
        
        destory: function() {
            spacer.remove();
        }
    });
    
    $.ui.editor.registerUi({
        dock: function(editor) {
            this.ui = editor.uiButton({
                title: _('Click to dock the toolbar'),
                icon: editor.getPlugin('dock').isDocked() ? 'ui-icon-pin-w' : 'ui-icon-pin-s',
                click: function() {
                    editor.unify(function(editor) {
                        var plugin = editor.getPlugin('dock');
                        if (plugin.isDocked()) plugin.undock();
                        else plugin.dock();
                    });
                }
            });
        }
    });
    
})(jQuery);
