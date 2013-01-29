Raptor.registerUi(new PreviewButton({
    name: 'clearFormatting',
    action: function() {
        rangeClearFormatting(rangy.getSelection().getRangeAt(0), this.raptor.getElement());
//        selectionClearFormatting(this.raptor.getElement());
//        cleanEmptyElements(this.raptor.getElement(), ['a', 'b', 'i', 'sub', 'sup', 'stong', 'em', 'big', 'small', 'p']);
//        cleanWrapTextNodes(this.raptor.getElement()[0], 'p');
    }
}));
