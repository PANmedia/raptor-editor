(function($) {
    
    var topSpacer;
    var bottomSpacer;
    
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
        options: {
            docked: false,
            dockToElement: false,
            dockUnder: false
        },
        
        init: function(editor) {
            if (!topSpacer) {
                topSpacer = $('<div class="' + this.options.baseClass + '-top-spacer"/>')
                    .prependTo('body')
                    .hide();
            }
            if (!bottomSpacer) {
                bottomSpacer = $('<div class="' + this.options.baseClass + '-bottom-spacer"/>')
                    .appendTo('body')
                    .hide();
            }
            
            this.docked = false;
                
            this.bind('enabled', this.enable);
            this.bind('disabled', this.disable);
            this.bind('show', topSpacer.show, topSpacer);
            this.bind('hide', topSpacer.hide, topSpacer);
            this.bind('show', bottomSpacer.show, bottomSpacer);
            this.bind('hide', bottomSpacer.hide, bottomSpacer);
            this.bind('destroy', this.destroy, this);
            
            if (!this.options.dockToElement) {
                this.bind('change', this.change, this);
            }
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
            var top = 0;
            if ($(this.options.dockUnder).length) {
                top = $(this.options.dockUnder).outerHeight();
            }
            
            this.top = this.editor.selToolbar().css('top');
            this.editor.selToolbar()
                .css('top', top);
            
            this.editor.selDialog()
                .addClass(this.options.baseClass + '-docked');
                
            this.editor.change();
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
            
            // Change the dock button icon & title
            this.editor.selDialog()
                .find('.' + this.options.baseClass + '-button')
                .button({icons: {primary: 'ui-icon-pin-w'}})
                .attr('title', this.getTitle());
                
            // Add the header class to the editor toolbar
            this.editor.selToolbar('.' + this.editor.options.baseClass + '-inner')
                .addClass('ui-widget-header');

            this.editor.fire('resize');
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
            this.editor.selToolbar().css('top', this.top);
            
            // Remove the docked class
            this.editor.selDialog()
                .removeClass(this.options.baseClass + '-docked')
            
            // Hide the spacers
            topSpacer.hide();
            bottomSpacer.hide();
        },
        
        undock: function() {
            if (!this.docked) return;
            
            // Save the state of the dock
            this.docked = this.destroying ? false : this.persist('docked', false);
            
            // Remove the header class from the editor toolbar
            this.editor.selToolbar('.' + this.editor.options.baseClass + '-inner')
                .removeClass('ui-widget-header');
                
            // Change the dock button icon & title
            this.editor.selDialog()
                .find('.' + this.options.baseClass + '-button')
                .button({icons: {primary: 'ui-icon-pin-s'}})
                .attr('title', this.getTitle());
                
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
        
        getTitle: function() {
            return this.isDocked() ? _('Click to detach the toolbar') : _('Click to dock the toolbar');
        },

        enable: function() {
            if (this.persist('docked') || this.options.docked) {
                this.dock();
            } 
        },
        
        disable: function() {
            topSpacer.hide();
            bottomSpacer.hide();
        },
        
        change: function() {
            if (this.isDocked() && this.editor.isEditing()) {
                // Reinitialise spacer(s) when the toolbar is visible and stopped animating
                window.setTimeout(function(dock) {
                    // Show the spacer(s)
                    var toolbar = dock.editor.selToolbar();
                    if (toolbar.is(':visible')) {
                        topSpacer.height(toolbar.outerHeight()).show();
                        // Show the bottom spacer only when not docked to an element
                        if(!dock.options.dockToElement) {
                            bottomSpacer.height(dock.editor.selTitle().outerHeight()).show();
                        }
                    }

                    // Trigger the editor resize event to adjust other plugin element positions
                    dock.editor.fire('resize');
                }, 1, this);
            }
        },
        
        destroy: function() {
            this.destroying = true;
            this.undock();
        }
    });
    
    $.ui.editor.registerUi({
        dock:  {
            init: function(editor, element) {
                return editor.uiButton({
                    title: editor.getPlugin('dock').getTitle(),
                    icon: editor.getPlugin('dock').isDocked() ? 'ui-icon-pin-w' : 'ui-icon-pin-s',
                    click: function() {
                        // Toggle dock on current editor
                        var plugin = editor.getPlugin('dock');
                        if (plugin.isDocked()) plugin.undock();
                        else plugin.dock();

                        // Set (un)docked on all unified editors
                        editor.unify(function(editor) {
                            if (plugin.isDocked()) editor.getPlugin('dock').dock();
                            else editor.getPlugin('dock').undock();
                        });
                    }
                });
            }
        }
    });
    
})(jQuery);
