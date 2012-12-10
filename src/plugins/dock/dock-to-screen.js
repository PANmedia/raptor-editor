Raptor.registerUi(new Button({
    name: 'dockToScreen',
    dockState: null,
    marker: null,

    options: {
        position: 'top',
        spacer: true
    },

    init: function() {
        var docked;
        if (this.options.persist) {
            docked = this.raptor.persist('dockToScreen');
        }
        if (typeof docked === 'undefined') {
            docked = this.options.docked;
        } else {
            docked = false
        }
        if (docked) {
            this.dock();
        }
        return Button.prototype.init.apply(this, arguments);
    },

    dock: function() {
        layout = this.raptor.getLayout().getElement();
        this.marker = $('<marker>').addClass(this.options.baseClass + '-marker').insertAfter(layout);
        this.dockState = dockToScreen(layout, {
            position: this.options.position,
            spacer: this.options.spacer
        });
    },

    undock: function() {
        layout = undockFromScreen(this.dockState);
        this.marker.replaceWith(layout);
        this.dockState = null;
    },

    action: function() {
        var layout;
        if (this.dockState) {
            this.undock();
        } else {
            this.dock();
        }
    }
}));
