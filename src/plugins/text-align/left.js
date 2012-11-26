Raptor.registerUi('alignLeft', new Button({
    action: function() {
        selectionToggleBlockStyle({
            'text-align': 'left'
        }, this.raptor.getElement());
    }
}));
