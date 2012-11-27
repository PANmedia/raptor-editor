Raptor.registerUi(new PreviewButton({
    name: 'textSizeDecrease',
    action: function() {
        selectionInverseWrapWithTagClass('small', this.options.cssPrefix + 'small', 'big', this.options.cssPrefix + 'big');
    }
}));
