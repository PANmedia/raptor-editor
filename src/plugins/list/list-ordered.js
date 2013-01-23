Raptor.registerUi(new PreviewButton({
    name: 'listOrdered',
    action: function() {
        listToggle('ol', 'li', this.raptor.getElement());
    }
}));
