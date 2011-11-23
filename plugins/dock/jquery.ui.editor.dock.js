(function($) {
    
    var spacer;
    
    function swapStyle(to, from, style) {
        var result = {};
        for (var name in style) {
            // Apply the style from the 'form' element to the 'to' element
            to.css(name, from.css(name));
            // Save the orignal style to revert the swap
            result[name] = from.css(name);
            // Apply the reset to the 'from' element'
            from.css(name, style[name]);
        }
        return result;
    }
    
    function revertStyle(to, style) {
        for (var name in style) {
            to.css(name, style[name]);
        }
    }
    
    $.ui.editor.registerPlugin('dock', {
        init: function() {
            if (!spacer) {
                spacer = $('<div class="' + this.options.baseClass + '-spacer"/>')
                    .prependTo('body')
                    .hide();
            }
            
            this.docked = false;
                
            this.bind('enabled', this.enable);
            this.bind('disabled', this.disable);
            this.bind('show', spacer.show, spacer);
            this.bind('hide', spacer.hide, spacer);
            this.bind('destroy', this.undock, this);
        },
        
        dockToElement: function() {
            this.editor.selDialog()
                .insertBefore(this.editor.getElement())
                .addClass(this.options.baseClass + '-docked-to-element');

            var wrapper = this.editor.selDialog()
                .wrapAll('<div/>')
                .parent()
                .addClass(this.options.baseClass + '-docked-to-element-wrapper')
                .addClass('ui-widget-content');

            this.revertStyle = swapStyle(wrapper, this.editor.getElement(), {
                'display': 'block',
                'float': 'none',
                'clear': 'none',
                'position': 'static',
                'margin-left': 0,
                'margin-right': 0,
                'margin-top': 0,
                'margin-bottom': 0,
                'outline': 0,
                'width': 'auto'
            });

            wrapper.css('width', wrapper.width() + 
                parseInt(this.editor.getElement().css('padding-left')) +
                parseInt(this.editor.getElement().css('padding-right'))/* +
                parseInt(this.editor.getElement().css('border-right-width')) +
                parseInt(this.editor.getElement().css('border-left-width'))*/);
            
            this.editor.getElement()
                .appendTo(this.editor.selDialog())
                .addClass(this.options.baseClass + '-docked-element');
        },
        
        dockToBody: function() {
            this.editor.selDialog().addClass(this.options.baseClass + '-docked')
            // Reinitialise spacer when the toolbar is visible and stoped animating
            window.setTimeout(function(dock) {
                // Show the spacer 
                var toolbar = dock.editor.selToolbar();
                if (toolbar.is(':visible')) {
                    spacer.height(toolbar.outerHeight()).show();
                }

                // Trigger the editor resize event to adjust other plugin element positions
                dock.editor.fire('resize');
            }, 1, this);
        },
        
        dock: function() {
            if (this.docked) return;
            
            // Save the state of the dock
            this.docked = this.persist('docked', true);
            
            if (this.options.dockToElement) {
                this.dockToElement();
            } else {
                this.dockToBody();
            }
            
            // Change the dock button icon
            this.editor.selDialog()
                .find('.' + this.options.baseClass + '-button')
                .button({icons: {primary: 'ui-icon-pin-w'}});
                
            // Add the header class to the editor toolbar
            this.editor.selToolbar('.' + this.editor.options.baseClass + '-inner')
                .addClass('ui-widget-header');
        },
        
        undockFromElement: function() {
            var wrapper = this.editor.selDialog().parent();
            
            this.editor.getElement()
                .insertAfter(wrapper)
                .removeClass(this.options.baseClass + '-docked-element');
            this.editor.selDialog()
                .appendTo('body')
                .removeClass(this.options.baseClass + '-docked-to-element');
                
            revertStyle(this.editor.getElement(), this.revertStyle);
            
            this.editor.dialog('option', 'position', this.editor.dialog('option', 'position'));
            
            wrapper.remove();
        },
        
        undockFromBody: function() {
            // Remove the docked class
            this.editor.selDialog()
                .removeClass(this.options.baseClass + '-docked')
            
            // Hide the spacer 
            spacer.hide();
        },
        
        undock: function() {
            if (!this.docked) return;
            
            // Save the state of the dock
            this.docked = this.persist('docked', false);
            
            // Remove the header class from the editor toolbar
            this.editor.selToolbar('.' + this.editor.options.baseClass + '-inner')
                .removeClass('ui-widget-header');
                
            // Change the dock button icon
            this.editor.selDialog()
                .find('.' + this.options.baseClass + '-button')
                .button({icons: {primary: 'ui-icon-pin-s'}});
                
            if (this.options.dockToElement) {
                this.undockFromElement();
            } else {
                this.undockFromBody();
            }
            
            // Trigger the editor resize event to adjust other plugin element positions
            this.editor.fire('resize');
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
