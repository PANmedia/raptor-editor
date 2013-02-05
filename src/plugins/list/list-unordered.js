Raptor.registerUi(new PreviewToggleButton({
    name: 'listUnordered',
    init: function() {
        var result = PreviewToggleButton.prototype.init.apply(this, arguments);
        if (elementIsValid(this.raptor.getElement(), listValidUlOlParents)) {
            return result;
        }
        return;
    },
    action: function() {
        listToggle('ul', 'li', this.raptor.getElement());
    },
    selectionToggle: function() {
        var selection = rangy.getSelection();
        return selection.getAllRanges().length > 0 &&
            selectionGetElements(selection).closest('ul').length;
    }
}));
