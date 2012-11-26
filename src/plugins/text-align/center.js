Raptor.registerUi('alignCenter', new Button({
    action: function() {
        selectionToggleBlockStyle({
            'text-align': 'center'
        }, this.raptor.getElement());
    }
}));
