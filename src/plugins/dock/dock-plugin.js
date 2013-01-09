
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
 * @return {Object} Resulting dock state
 */
DockPlugin.prototype.toggleDockToElement = function() {
    if (this.dockState) {
        this.dockToElement();
    } else {
        this.undockFromElement();
    }
};

/**
 * @return {Object} Resulting dock state
 */
DockPlugin.prototype.dockToElement = function() {
    this.marker.replaceWith(undockFromElement(this.dockState));
    this.dockState = null;
};

/**
 * @return {Object} Resulting dock state
 */
DockPlugin.prototype.undockFromElement = function() {
    var element = this.raptor.getElement();
    this.marker = $('<marker>').addClass(this.options.baseClass + '-marker').insertAfter(element);
    this.dockState = dockToElement(this.raptor.getLayout().getElement(), element, {
        position: this.options.position,
        spacer: this.options.spacer
    });
};

/**
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
        spacer: this.options.spacer,
        under: this.options.under
    });
};

/**
 * @return {Object} Resulting dock state
 */
DockPlugin.prototype.undockFromScreen = function() {
    var layoutElement = undockFromScreen(this.dockState);
    this.marker.replaceWith(layoutElement);
    this.raptor.getLayout().enableDragging();
    this.dockState = null;
    layoutElement.css({ backgroundColor: 'red' });
};

Raptor.registerPlugin(new DockPlugin());
