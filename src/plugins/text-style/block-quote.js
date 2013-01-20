Raptor.registerUi(new PreviewToggleButton({
    name: 'textBlockQuote',
    action: function() {
        listToggle('blockquote', 'p', this.raptor.getElement());
        this.selectionChange();
    },
    selectionToggle: function() {
        var elements = selectionFindWrappingAndInnerElements('blockquote', this.raptor.getElement());
        return elements.length > 0;
    }
}));
