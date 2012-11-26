Raptor.registerUi(new Button({
    name: 'alignCenter',
    action: function() {
        selectionToggleBlockStyle({
            'text-align': 'center'
        }, this.raptor.getElement());
    }
}));
