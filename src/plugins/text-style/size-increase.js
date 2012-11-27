Raptor.registerUi(new PreviewButton({
    name: 'textSizeDecrease',
    action: function() {
        selectionInverseWrapWithTagClass('big', this.options.cssPrefix + 'big', 'small', this.options.cssPrefix + 'small');
    }
}));
