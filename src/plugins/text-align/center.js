Raptor.registerUi(new PreviewButton({
    name: 'alignCenter',
    action: function() {
        selectionToggleBlockStyle({
            'text-align': 'center'
        }, this.raptor.getElement());
    }
}));
