/**
 * @fileOverview Dock plugin
 * @author David Neilsen david@panmedia.co.nz
 * @author Michael Robinson michael@panmedia.co.nz
 */

/**
 * @name $.editor.plugin.dock
 * @augments $.ui.editor.defaultPlugin
 * @see  $.editor.ui.dock
 * @class Allow the user to dock / undock the toolbar from the document body or editing element
 */
$.ui.editor.registerPlugin('dock', /** @lends $.editor.plugin.dock.prototype */ {

    enabled: false,
    docked: false,
    topSpacer: null,
    bottomSpacer: null,

    options: {
        docked: false,
        dockToElement: false,
        dockUnder: false,
        persist: true,
        persistID: null
    },

    /**
     * @see $.ui.editor.defaultPlugin#init
     */
    init: function(editor) {
        this.bind('show', this.show);
        this.bind('hide', this.hide);
        this.bind('disabled', this.disable);
        this.bind('destroy', this.destroy, this);
    },

    show: function() {
        if (!this.enabled) {
            // When the editor is enabled, if persistent storage or options indicate that the toolbar should be docked, dock the toolbar
            if (this.loadState() || this.options.docked) {
                this.dock();
            }
            this.enabled = true;
        } else if (this.isDocked()) {
            this.showSpacers();
        }
    },

    hide: function() {
        this.hideSpacers();
        this.editor.toolbar
            .css('width', 'auto');
    },

    showSpacers: function() {
        if (this.options.dockToElement || !this.editor.toolbar.is(':visible')) {
            return;
        }

        this.topSpacer = $('<div/>')
            .addClass(this.options.baseClass + '-top-spacer')
            .height(this.editor.toolbar.outerHeight())
            .prependTo('body');

        this.bottomSpacer = $('<div/>')
            .addClass(this.options.baseClass + '-bottom-spacer')
            .height(this.editor.path.outerHeight())
            .appendTo('body');

        // Fire resize event to trigger plugins (like unsaved edit warning) to reposition
        this.editor.fire('resize');
    },

    hideSpacers: function() {
        if (this.topSpacer) {
            this.topSpacer.remove();
            this.topSpacer = null;
        }
        if (this.bottomSpacer) {
            this.bottomSpacer.remove();
            this.bottomSpacer = null;
        }

        // Fire resize event to trigger plugins (like unsaved edit warning) to reposition
        this.editor.fire('resize');
    },


    /**
     * Change CSS styles between two values.
     *
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
            // Save the original style to revert the swap
            result[name] = from.css(name);
            // Apply the reset to the 'from' element'
            from.css(name, style[name]);
        }
        return result;
    },

    /**
     * Set CSS styles to given values.
     *
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
        var plugin = this;

        // <debug>
        if (debugLevel >= MID) debug('Dock to element', plugin.editor.getElement());
        // </debug>

        // Needs to be in the ready event because we cant insert to the DOM before ready (if auto enabling, before ready)
//        $(function() {
//            var element = plugin.editor.getElement()
//                .addClass(plugin.options.baseClass + '-docked-element');
//            plugin.editor.wrapper
//                .addClass(plugin.options.baseClass + '-docked-to-element')
//                .insertBefore(plugin.editor.getElement())
//                .append(element);
//        });

        var wrapper = $('<div/>')
            .insertBefore(this.editor.getElement())
            .addClass(this.options.baseClass + '-docked-to-element-wrapper');

        this.editor.wrapper
            .appendTo(wrapper);

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

//        plugin.editor.wrapper.css('display', '');

        wrapper.css('width', wrapper.width() +
            parseInt(this.editor.getElement().css('padding-left'), 10) +
            parseInt(this.editor.getElement().css('padding-right'), 10));/* +
            parseInt(this.editor.getElement().css('border-right-width')) +
            parseInt(this.editor.getElement().css('border-left-width')));*/

        this.editor.getElement()
            .appendTo(this.editor.wrapper)
            .addClass(this.options.baseClass + '-docked-element');
    },

    /**
     * Undock toolbar from editing element
     */
    undockFromElement: function() {
        // <debug>
        if (debugLevel >= MID) debug('Undock from element', this.editor.getElement());
        // </debug>

//        var wrapper = this.editor.wrapper.parent();

        this.editor.getElement()
            .insertAfter(this.editor.wrapper)
            .removeClass(this.options.baseClass + '-docked-element');

        this.editor.wrapper
            .appendTo('body')
            .removeClass(this.options.baseClass + '-docked-to-element');

//        this.revertStyle(this.editor.getElement(), this.previousStyle);

//        this.editor.dialog('option', 'position', this.editor.dialog('option', 'position'));

//        wrapper.remove();
    },

    /**
     * Dock the toolbar to the document body (top of the screen)
     */
    dockToBody: function() {
        // <debug>
        if (debugLevel >= MID) debug('Dock to body');
        // </debug>

        var top = 0;
        if ($(this.options.dockUnder).length) {
            top = $(this.options.dockUnder).outerHeight();
        }

        this.top = this.editor.toolbarWrapper.css('top');
        this.editor.toolbarWrapper.css('top', top);
        this.editor.wrapper.addClass(this.options.baseClass + '-docked');

        // Position message wrapper below the toolbar
        this.editor.messages.css('top', top + this.editor.toolbar.outerHeight());
    },

    /**
     * Undock toolbar from document body
     */
    undockFromBody: function() {
        // <debug>
        if (debugLevel >= MID) debug('Undock from body');
        // </debug>

        this.editor.toolbarWrapper.css('top', this.top);
        // Remove the docked class
        this.editor.wrapper.removeClass(this.options.baseClass + '-docked');

        this.hideSpacers();
    },

    /**
     * Dock toolbar to element or body
     */
    dock: function() {
        if (this.docked) return;

        // Save the state of the dock
        this.docked = this.saveState(true);

        if (this.options.dockToElement) {
            this.dockToElement();
        } else {
            this.dockToBody();
        }

        // Change the dock button icon & title
        var button = this.editor.wrapper
            .find('.' + this.options.baseClass + '-button')
            .button({icons: {primary: 'ui-icon-pin-w'}});

        if (button.attr('title')) {
            button.attr('title', this.getTitle());
        } else {
            button.attr('data-title', this.getTitle());
        }

        // Add the header class to the editor toolbar
        this.editor.toolbar.find('.' + this.editor.options.baseClass + '-inner')
            .addClass('ui-widget-header');

        this.showSpacers();
    },

    /**
     * Undock toolbar
     */
    undock: function() {
        if (!this.docked) return;

        // Save the state of the dock
        this.docked = this.destroying ? false : this.saveState(false);

        // Remove the header class from the editor toolbar
        this.editor.toolbar.find('.' + this.editor.options.baseClass + '-inner')
            .removeClass('ui-widget-header');

        // Change the dock button icon & title
        var button = this.editor.wrapper
            .find('.' + this.options.baseClass + '-button')
            .button({icons: {primary: 'ui-icon-pin-s'}});

        if (button.attr('title')) {
            button.attr('title', this.getTitle());
        } else {
            button.attr('data-title', this.getTitle());
        }

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

    saveState: function(state) {
        if (!this.persist) {
            return;
        }
        if (this.persistID) {
            this.persist('docked:' + this.persistID, state);
        } else {
            this.persist('docked', state);
        }
        return state;
    },

    loadState: function() {
        if (!this.persist) {
            return null;
        }
        if (this.persistID) {
            return this.persist('docked:' + this.persistID);
        }
        return this.persist('docked');
    },

    /**
     * Hide the top and bottom spacers when editing is disabled
     */
    disable: function() {
        this.hideSpacers();
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
     * @augments $.ui.editor.defaultUi
     * @see  $.editor.plugin.dock
     * @class Interface for the user to dock / undock the toolbar using the {@link $.editor.plugin.dock} plugin
     */
    dock: /** @lends $.editor.ui.dock.prototype */ {

        hotkeys: {
            'ctrl+d': {
                'action': function() {
                    this.ui.click();
                }
            }
        },

        /**
         * @see $.ui.editor.defaultUi#init
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
