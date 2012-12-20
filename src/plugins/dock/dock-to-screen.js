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
            docked = false;
        }
        if (docked) {
            this.raptor.bind('layoutShow', function() {
                this.dock();
            }.bind(this));
        }
        return Button.prototype.init.apply(this, arguments);
    },

    dock: function() {
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
    },

    undock: function() {
        var layoutElement = undockFromScreen(this.dockState);
        this.marker.replaceWith(layoutElement);
        this.raptor.getLayout().enableDragging();
        this.dockState = null;
    },

    action: function() {
        if (this.dockState) {
            this.undock();
        } else {
            this.dock();
        }
    }
}));
