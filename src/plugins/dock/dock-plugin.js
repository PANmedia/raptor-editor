/**
 * @fileOverview Contains the dock plugin class code.
 * @author  David Neilsen <david@panmedia.co.nz>
 * @author  Michael Robinson <michael@panmedia.co.nz>
 * @author Melissa Richards <melissa@panmedia.co.nz>
 */

/**
 * @class The dock plugin class.
 * @constructor
 * @augments Raptor plugin.
 *
 * @todo not sure of desc for the params
 * @param {String} name
 * @param {Object} overrides
 */
function DockPlugin(name, overrides) {
    this.options = {
        dockToElement: false,
        docked: false,
        position: 'top',
        spacer: true,
        persist: false
    };
    this.dockState = false;
    this.marker = false;

    RaptorPlugin.call(this, name || 'dock', overrides);
}

DockPlugin.prototype = Object.create(RaptorPlugin.prototype);

/**
 * Initialize the dock plugin.
 */
DockPlugin.prototype.init = function() {
    var docked;
    if (this.options.persist) {
        docked = this.raptor.persist('dock');
    }
    if (typeof docked === 'undefined') {
        docked = this.options.docked;
    } else {
        docked = false;
    }
    if (docked) {
        this.raptor.bind('layoutReady', function() {
            this.toggleState();
        }.bind(this));
        this.raptor.bind('layoutHide', function() {
            if (this.dockState && this.dockState.spacer) {
                this.dockState.spacer.hide();
            }
        }.bind(this));
        this.raptor.bind('layoutShow', function() {
            if (this.dockState && this.dockState.spacer) {
                this.dockState.spacer.show();
            }
        }.bind(this));
        this.raptor.bind('layoutDestroy', function() {
            if (this.dockState) {
                this.toggleState();
            }
        }.bind(this));
    }
};

/**
 * Switch between docked / undocked, depending on options.
 *
 * @return {Object} Resulting dock state
 */
DockPlugin.prototype.toggleState = function() {
    if (this.options.dockToElement) {
        return this.toggleDockToElement();
    }
    return this.toggleDockToScreen();
};

/**
 * Gets the dock state on toggle dock to element.
 *
 * @return {Object} Resulting dock state
 */
DockPlugin.prototype.toggleDockToElement = function() {
    if (this.dockState) {
        this.undockFromElement();
    } else {
        this.dockToElement();
    }
};

/**
 * Gets the dock state on dock to element.
 *
 * @return {Object} Resulting dock state
 */
DockPlugin.prototype.dockToElement = function() {
    var element = this.raptor.getElement(),
        layoutElement = this.raptor.getLayout().getElement();
    this.marker = $('<marker>').addClass(this.options.baseClass + '-marker').insertAfter(layoutElement);
    this.raptor.getLayout().getElement().addClass(this.options.baseClass + '-docked-to-element');
    this.dockState = dockToElement(this.raptor.getLayout().getElement(), element, {
        position: this.options.position,
        spacer: false
    });
};

/**
 * Gets the dock state on undocking from an element.
 *
 * @return {Object} Resulting dock state
 */
DockPlugin.prototype.undockFromElement = function() {
    this.marker.replaceWith(undockFromElement(this.dockState));
    this.dockState = null;
    this.raptor.getLayout().getElement().removeClass(this.options.baseClass + '-docked-to-element');
};

/**
 * Gets the dock state on toggle dock to screen.
 *
 * @return {Object} Resulting dock state
 */
DockPlugin.prototype.toggleDockToScreen = function() {
    if (this.dockState) {
        this.undockFromScreen();
    } else {
        this.dockToScreen();
    }
};

/**
 * Gets the dock state on dock to screen.
 *
 * @return {Object} Resulting dock state
 */
DockPlugin.prototype.dockToScreen = function() {
    var layout = this.raptor.getLayout(),
        layoutElement = layout.getElement();
    this.marker = $('<marker>').addClass(this.options.baseClass + '-marker').insertAfter(layoutElement);
    layoutElement.addClass(this.options.baseClass + '-docked');
    layout.disableDragging();
    this.dockState = dockToScreen(layoutElement, {
        position: this.options.position,
        spacer: true,
        under: this.options.under
    });
};

/**
 * Gets the dock state on undocking from the screen.
 *
 * @return {Object} Resulting dock state
 */
DockPlugin.prototype.undockFromScreen = function() {
    var layoutElement = undockFromScreen(this.dockState);
    this.marker.replaceWith(layoutElement);
    this.raptor.getLayout().enableDragging();
    this.dockState = null;
    layoutElement.removeClass(this.options.baseClass + '-docked');
};

Raptor.registerPlugin(new DockPlugin());
