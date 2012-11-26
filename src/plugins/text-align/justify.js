Raptor.registerUi(new PreviewButton({
    name: 'alignJustify',
    action: function() {
        selectionToggleBlockStyle({
            'text-align': 'justify'
        }, this.raptor.getElement());
    }
}));
