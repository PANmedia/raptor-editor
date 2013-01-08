Raptor.registerUi(new PreviewButton({
    name: 'textSizeDecrease',
    action: function() {
        selectionExpandToWord();
        selectionInverseWrapWithTagClass('small', this.options.cssPrefix + 'small', 'big', this.options.cssPrefix + 'big');
        this.raptor.getElement().find('small.' + this.options.cssPrefix + 'small:empty, big.' + this.options.cssPrefix + 'big:empty').remove();
    }
}));
