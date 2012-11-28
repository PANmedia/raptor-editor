Raptor.registerUi(new Button({
    name: 'dockToElement',
    dockState: null,
    marker: null,
    options: {
        position: 'top',
        spacer: true
    },
    action: function() {
        var element;
        if (this.dockState) {
            element = undockFromElement(this.dockState);
            this.marker.replaceWith(element);
            this.dockState = null;
        } else {
            element = this.raptor.getElement();
            this.marker = $('<marker>').addClass(this.options.baseClass + '-marker').insertAfter(element);
            this.dockState = dockToElement(this.raptor.getLayout().getElement(), element, {
                position: this.options.position,
                spacer: this.options.spacer,
            });
        }
    }
}));
