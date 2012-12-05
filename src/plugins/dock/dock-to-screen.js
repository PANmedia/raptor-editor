Raptor.registerUi(new Button({
    name: 'dockToScreen',
    dockState: null,
    marker: null,
    options: {
        position: 'top',
        spacer: true
    },
    action: function() {
        var layout;
        if (this.dockState) {
            layout = undockFromScreen(this.dockState);
            this.marker.replaceWith(layout);
            this.dockState = null;
        } else {
            layout = this.raptor.getLayout().getElement();
            this.marker = $('<marker>').addClass(this.options.baseClass + '-marker').insertAfter(layout);
            this.dockState = dockToScreen(layout, {
                position: this.options.position,
                spacer: this.options.spacer
            });
        }
    }
}));
