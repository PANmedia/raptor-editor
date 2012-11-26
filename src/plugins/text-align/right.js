Raptor.registerUi('alignRight', new Button({
    action: function() {
        selectionToggleBlockStyle({
            'text-align': 'right'
        }, this.raptor.getElement());
    }
}));
