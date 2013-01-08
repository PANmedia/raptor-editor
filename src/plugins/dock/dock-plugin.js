
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

DockPlugin.prototype.toggleState = function() {
    if (this.options.dockToElement) {
        return this.toggleDockToElement();
    }
    return this.toggleDockToScreen();
};

DockPlugin.prototype.toggleDockToElement = function() {
    if (this.dockState) {
        this.dockToElement();
    } else {
        this.undockFromElement();
    }
};

DockPlugin.prototype.dockToElement = function() {
    this.marker.replaceWith(undockFromElement(this.dockState));
    this.dockState = null;
};

DockPlugin.prototype.undockFromElement = function() {
    var element = this.raptor.getElement();
    this.marker = $('<marker>').addClass(this.options.baseClass + '-marker').insertAfter(element);
    this.dockState = dockToElement(this.raptor.getLayout().getElement(), element, {
        position: this.options.position,
        spacer: this.options.spacer
    });
};

DockPlugin.prototype.toggleDockToScreen = function() {
    if (this.dockState) {
        this.dockToScreen();
    } else {
        this.undockFromScreen();
    }
};

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

DockPlugin.prototype.undockFromScreen = function() {
    var layoutElement = undockFromScreen(this.dockState);
    this.marker.replaceWith(layoutElement);
    this.raptor.getLayout().enableDragging();
    this.dockState = null;
};

Raptor.registerPlugin(new DockPlugin());
