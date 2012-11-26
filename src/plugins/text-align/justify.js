Raptor.registerUi('alignJustify', new Button({
    action: function() {
        selectionToggleBlockStyle({
            'text-align': 'justify'
        }, this.raptor.getElement());
    }
}));
