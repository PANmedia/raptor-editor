Raptor.registerUi(new PreviewButton({
    name: 'clearFormatting',
    action: function() {
        selectionClearFormatting(this.raptor.getElement());
        cleanEmptyElements(this.raptor.getElement(), ['a', 'b', 'i', 'sub', 'sup', 'strong', 'em', 'big', 'small', 'p']);
        cleanWrapTextNodes(this.raptor.getElement()[0], 'p');
    }
}));
