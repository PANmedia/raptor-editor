Raptor.registerUi(new Button({
    name: 'alignRight',
    action: function() {
        selectionToggleBlockStyle({
            'text-align': 'right'
        }, this.raptor.getElement());
    }
}));
