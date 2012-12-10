function CSSClassApplierButton(options) {
    PreviewButton.call(this, options);
}

CSSClassApplierButton.prototype = Object.create(PreviewButton.prototype);

CSSClassApplierButton.prototype.action = function() {
    // Test for 0 length selection
    var ranges = rangy.getSelection().getAllRanges();
    if (ranges.length === 1) {
        if (ranges[0].toString() === '') {
            rangy.getSelection().expand('word');
        }
    }

    for (var i = 0, l = this.classes.length; i < l; i++) {
        var applier = rangy.createCssClassApplier(this.options.cssPrefix + this.classes[i], {
            elementTagName: this.tag || 'span'
        });
        applier.toggleSelection();
    }
};
