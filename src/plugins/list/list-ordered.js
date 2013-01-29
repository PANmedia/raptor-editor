Raptor.registerUi(new PreviewButton({
    name: 'listOrdered',
    init: function() {
        var result = Button.prototype.init.apply(this, arguments);
        if (elementIsValid(this.raptor.getElement(), listValidUlOlParents)) {
            return result;
        }
        return;
    },
    action: function() {
        listToggle('ol', 'li', this.raptor.getElement());
    }
}));
