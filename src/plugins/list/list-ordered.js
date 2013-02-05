Raptor.registerUi(new PreviewToggleButton({
    name: 'listOrdered',
    init: function() {
        var result = PreviewToggleButton.prototype.init.apply(this, arguments);
        if (elementIsValid(this.raptor.getElement(), listValidUlOlParents)) {
            return result;
        }
        return;
    },
    action: function() {
        listToggle('ol', 'li', this.raptor.getElement());
    },
    selectionToggle: function() {
        var selection = rangy.getSelection();
        return selection.getAllRanges().length > 0 &&
            (selectionGetElements(selection).is('ol,li') || selectionContains('li', this.raptor.getElement()));
    }
}));
