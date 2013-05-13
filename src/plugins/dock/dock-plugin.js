/**
 * @fileOverview Contains the dock plugin class code.
 * @license http://www.raptor-editor.com/license
 *
 * @author David Neilsen <david@panmedia.co.nz>
 * @author Michael Robinson <michael@panmedia.co.nz>
 * @author Melissa Richards <melissa@panmedia.co.nz>
 */

/**
 * The dock plugin class.
 *
 * @constructor
 * @augments RaptorPlugin
 *
 * @param {String} name
 * @param {Object} overrides
 */
function DockPlugin(name, overrides) {
    this.options = {
        dockToElement: false,
        docked: false,
        position: 'top',
        spacer: true,
        persist: true
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
        docked = this.raptor.persist('docked');
    }
    if (typeof docked === 'undefined') {
        docked = this.options.docked;
    }
    if (typeof docked === 'undefined') {
        docked = false;
    }
    if (docked) {
        this.raptor.bind('toolbarReady', function() {
            if (docked) {
                this.toggleState();
            }
        }.bind(this));
        this.raptor.bind('toolbarHide', function() {
            if (this.dockState && this.dockState.spacer) {
                this.dockState.spacer.hide();
            }
        }.bind(this));
        this.raptor.bind('toolbarShow', function() {
            if (this.dockState && this.dockState.spacer) {
                this.dockState.spacer.show();
            }
        }.bind(this));
        this.raptor.bind('toolbarDestroy', function() {
            if (this.dockState && this.dockState.spacer) {
                this.dockState.spacer.remove();
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
        if (typeof this.dockState.dockedTo !== 'undefined') {
            this.undockFromElement();
        } else {
            this.undockFromScreen();
            this.dockToElement();
        }
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
        layoutElement = this.raptor.getLayout('toolbar').getElement();
    this.marker = $('<marker>').addClass(this.options.baseClass + '-marker').insertAfter(layoutElement);
    this.raptor.getLayout('toolbar').getElement().addClass(this.options.baseClass + '-docked-to-element');
    this.dockState = dockToElement(this.raptor.getLayout('toolbar').getElement(), element, {
        position: this.options.position,
        spacer: false,
        wrapperClass: this.options.baseClass + '-inline-wrapper'
    });
    this.activateButton(this.raptor.getUi('dockToElement'));
};

/**
 * Gets the dock state on undocking from an element.
 *
 * @return {Object} Resulting dock state
 */
DockPlugin.prototype.undockFromElement = function() {
    this.marker.replaceWith(undockFromElement(this.dockState));
    this.dockState = null;
    this.raptor.getLayout('toolbar').getElement().removeClass(this.options.baseClass + '-docked-to-element');
    this.deactivateButton(this.raptor.getUi('dockToElement'));
};

/**
 * Gets the dock state on toggle dock to screen.
 *
 * @return {Object} Resulting dock state
 */
DockPlugin.prototype.toggleDockToScreen = function() {
    if (this.dockState) {
        if (typeof this.dockState.dockedTo !== 'undefined') {
            this.undockFromElement();
            this.dockToScreen();
        } else {
            this.undockFromScreen();
        }
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
    this.raptor.unify(function(raptor) {
        var dock = raptor.getPlugin('dock');
        if (!dock.dockState) {
            var layout = dock.raptor.getLayout('toolbar');
            if (layout.isReady()) {
                raptor.persist('docked', true);
                var layoutElement = layout.getElement();
                dock.marker = $('<marker>').addClass(dock.options.baseClass + '-marker')
                                    .insertAfter(layoutElement);
                layoutElement.addClass(dock.options.baseClass + '-docked');
                layout.disableDragging();
                dock.dockState = dockToScreen(layoutElement, {
                    position: dock.options.position,
                    spacer: true,
                    under: dock.options.under
                });
                if (!layout.isVisible()) {
                    dock.dockState.spacer.hide();
                }
                dock.activateButton(dock.raptor.getUi('dockToScreen'));
            }
        }
    });
};

/**
 * Gets the dock state on undocking from the screen.
 *
 * @return {Object} Resulting dock state
 */
DockPlugin.prototype.undockFromScreen = function() {
    this.raptor.unify(function(raptor) {
        var dock = raptor.getPlugin('dock');
        if (dock.dockState) {
            raptor.persist('docked', false);
            var layout = dock.raptor.getLayout('toolbar'),
                layoutElement = undockFromScreen(dock.dockState);
            dock.marker.replaceWith(layoutElement);
            layout.enableDragging();
            layout.constrainPosition();
            dock.dockState = null;
            layoutElement.removeClass(dock.options.baseClass + '-docked');
            dock.deactivateButton(dock.raptor.getUi('dockToScreen'));
        }
    });
};

DockPlugin.prototype.deactivateButton = function(ui) {
    if (typeof ui !== 'undefined' &&
            typeof ui.button !== 'undefined') {
        aButtonInactive(ui.button);
    }
};

DockPlugin.prototype.activateButton = function(ui) {
    if (typeof ui !== 'undefined' &&
            typeof ui.button !== 'undefined') {
        aButtonActive(ui.button);
    }
};

Raptor.registerPlugin(new DockPlugin());
