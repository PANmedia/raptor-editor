Raptor.registerUi(new PreviewButton({
    name: 'listOrdered',
    action: function() {
        listToggle('ol', this.raptor.getElement());
    }
}));
