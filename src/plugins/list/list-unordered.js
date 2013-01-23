Raptor.registerUi(new PreviewButton({
    name: 'listUnordered',
    action: function() {
        listToggle('ul', 'li', this.raptor.getElement());
    }
}));
