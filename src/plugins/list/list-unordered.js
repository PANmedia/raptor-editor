Raptor.registerUi(new PreviewButton({
    name: 'listUnordered',
    init: function() {
        var result = Button.prototype.init.apply(this, arguments);
        if (elementIsValid(this.raptor.getElement(), listValidUlOlParents)) {
            return result;
        }
        return;
    },
    action: function() {
        listToggle('ul', 'li', this.raptor.getElement());
    }
}));
