Raptor.registerUi(new Button({
    name: 'alignLeft',
    action: function() {
        selectionToggleBlockStyle({
            'text-align': 'left'
        }, this.raptor.getElement());
    }
}));
