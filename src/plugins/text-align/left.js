Raptor.registerUi(new PreviewButton({
    name: 'alignLeft',
    action: function() {
        selectionToggleBlockStyle({
            'text-align': 'left'
        }, this.raptor.getElement());
    }
}));
