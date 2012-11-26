Raptor.registerUi(new Button({
    name: 'alignJustify',
    action: function() {
        selectionToggleBlockStyle({
            'text-align': 'justify'
        }, this.raptor.getElement());
    }
}));
