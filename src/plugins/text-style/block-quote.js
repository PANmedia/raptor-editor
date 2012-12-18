Raptor.registerUi(new PreviewToggleButton({
    name: 'textBlockQuote',
    action: function() {
        listToggle('blockquote', 'p', this.raptor.getElement());
        this.selectionChange();
    },
    selectionToggle: function() {
        var result = true;
        selectionEachBlock(function(block) {
            if ($(block).parentsUntil(this.raptor.getElement(), 'blockquote').length === 0) {
                result = false;
            }
        }.bind(this), this.raptor.getElement());
        return result;
    }
}));
