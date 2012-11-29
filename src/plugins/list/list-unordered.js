Raptor.registerUi(new PreviewButton({
    name: 'listUnordered',
    action: function() {
        listToggle('ul', this.raptor.getElement());
    }
}));
