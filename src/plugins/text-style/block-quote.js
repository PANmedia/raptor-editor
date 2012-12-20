Raptor.registerUi(new PreviewToggleButton({
    name: 'textBlockQuote',
    action: function() {
        listToggle('blockquote', 'p', this.raptor.getElement());
        this.selectionChange();
    },
    selectionToggle: function() {
        var result = true;
        selectionEachRange(function(range) {
            if ($(range.commonAnsestor).parentsUntil(this.raptor.getElement(), 'blockquote').length === 0) {
                result = false;
            }
        }.bind(this));
        return result;
    }
}));
