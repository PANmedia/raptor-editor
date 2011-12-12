/**
 * @fileOverview Dock plugin
 * @author David Neilson david@panmedia.co.nz
 * @author Michael Robinson mike@panmedia.co.nz
 */

/**
 * @name $.editor.plugin.dock
 * @augments $.editor.plugin
 * @see  $.editor.ui.dock
 * @class Allow the user to dock / undock the toolbar from the document body or editing element
 */
$.ui.editor.registerPlugin('dock', /** @lends $.editor.plugin.dock.prototype */ {

    topSpacer: null,
    bottomSpacer: null,
    
    options: {
        docked: false,
        dockToElement: false,
        dockUnder: false
    },
    
    /**
     * @see $.editor.plugin#init
     */   
    init: function(editor) {
        if (!this.topSpacer) {
            this.topSpacer = $('<div class="' + this.options.baseClass + '-top-spacer"/>')
                .prependTo('body')
                .hide();
        }
        if (!this.bottomSpacer) {
            this.bottomSpacer = $('<div class="' + this.options.baseClass + '-bottom-spacer"/>')
                .appendTo('body')
                .hide();
        }
        
        this.docked = false;
            
        this.bind('enabled', this.enable);
        this.bind('disabled', this.disable);
        this.bind('show', this.topSpacer.show, this.topSpacer);
        this.bind('hide', this.topSpacer.hide, this.topSpacer);
        this.bind('show', this.bottomSpacer.show, this.bottomSpacer);
        this.bind('hide', this.bottomSpacer.hide, this.bottomSpacer);
        this.bind('destroy', this.destroy, this);
        
        if (!this.options.dockToElement) {
            this.bind('change', this.change, this);
        }
    },
    
    /**
     * Change CSS styles between two values
     * @param  {Object} to    Map of CSS styles to change to
     * @param  {Object} from  Map of CSS styles to change from
     * @param  {Object} style Map of styles to perform changes within
     * @return {Object} Map of styles that were changed
     */ 
    swapStyle: function(to, from, style) {
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
    },

    /**
     * Set CSS styles to given values
     * @param  {Object} to    Map of CSS styles to change to
     * @param  {Object} style Map of CSS styles to change within
     */
    revertStyle: function(to, style) {
        for (var name in style) {
            to.css(name, style[name]);
        }
    },

    /**
     * Dock the toolbar to the editing element
     */
    dockToElement: function() {
        this.editor.selDialog()
            .insertBefore(this.editor.getElement())
            .addClass(this.options.baseClass + '-docked-to-element');

        var wrapper = this.editor.selDialog()
            .wrapAll('<div/>')
            .parent()
            .addClass(this.options.baseClass + '-docked-to-element-wrapper')
            .addClass('ui-widget-content');

        this.previousStyle = this.swapStyle(wrapper, this.editor.getElement(), {
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
    
    /**
     * Dock the toolbar to the document body
     */
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
    
    /**
     * Dock toolbar to element or body
     */
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
    
    /**
     * Undock toolbar from editing element
     */
    undockFromElement: function() {
        var wrapper = this.editor.selDialog().parent();
        
        this.editor.getElement()
            .insertAfter(wrapper)
            .removeClass(this.options.baseClass + '-docked-element');
        this.editor.selDialog()
            .appendTo('body')
            .removeClass(this.options.baseClass + '-docked-to-element');
            
        this.revertStyle(this.editor.getElement(), this.previousStyle);
        
        this.editor.dialog('option', 'position', this.editor.dialog('option', 'position'));
        
        wrapper.remove();
    },
    
    /**
     * Undock toolbar from document body
     */
    undockFromBody: function() {
        this.editor.selToolbar().css('top', this.top);
        
        // Remove the docked class
        this.editor.selDialog()
            .removeClass(this.options.baseClass + '-docked')
        
        // Hide the spacers
        this.topSpacer.hide();
        this.bottomSpacer.hide();
    },
    
    /**
     * Undock toolbar 
     */
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
            
        if (this.options.dockToElement) this.undockFromElement();
        else this.undockFromBody();

        // Trigger the editor resize event to adjust other plugin element positions
        this.editor.fire('resize');
    },
    
    /**
     * @return {Boolean} True if the toolbar is docked to the editing element or document body
     */
    isDocked: function() {
        return this.docked;
    },
    
    /**
     * @return {String} Title text for the dock ui button, differing depending on docked state
     */
    getTitle: function() {
        return this.isDocked() ? _('Click to detach the toolbar') : _('Click to dock the toolbar');
    },

    /**
     * When the editor is enabled, if persistent storage or options indicate that the toolbar should be docked, dock the toolbar
     */
    enable: function() {
        if (this.persist('docked') || this.options.docked) {
            this.dock();
        } 
    },
    
    /**
     * Hide the top and bottom spacers when editing is disabled
     */
    disable: function() {
        this.topSpacer.hide();
        this.bottomSpacer.hide();
    },
    
    /**
     * If the toolbar is docked and the element is being edited, reinitialise spacer(s) when the toolbar is visible and stopped animating and trigger the resize event
     */
    change: function() {
        if (this.isDocked() && this.editor.isEditing()) {
            var plugin = this;
            // Reinitialise spacer(s) when the toolbar is visible and stopped animating
            window.setTimeout(function(dock) {
                // Show the spacer(s)
                var toolbar = dock.editor.selToolbar();
                if (toolbar.is(':visible')) {
                    plugin.topSpacer.height(toolbar.outerHeight()).show();
                    // Show the bottom spacer only when not docked to an element
                    if(!dock.options.dockToElement) {
                        plugin.bottomSpacer.height(dock.editor.selTitle().outerHeight()).show();
                    }
                }

                // Trigger the editor resize event to adjust other plugin element positions
                dock.editor.fire('resize');
            }, 1, this);
        }
    },

    /**
     * Undock the toolbar
     */
    destroy: function() {
        this.destroying = true;
        this.undock();
    }
});

$.ui.editor.registerUi({
    
    /**
     * @name $.editor.ui.dock
     * @augments $.editor.ui
     * @see  $.editor.plugin.dock
     * @class Interface for the user to dock / undock the toolbar using the {@link $.editor.plugin.dock} plugin
     */
    dock: /** @lends $.editor.ui.dock.prototype */ {
        
        /**
         * @see $.editor.ui#init
         */
        init: function(editor) {
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
