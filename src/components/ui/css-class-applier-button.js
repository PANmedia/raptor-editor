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

    this.getApplier().toggleSelection();
};

CSSClassApplierButton.prototype.getApplier = function() {
    if (!this.applier) {
        this.applier = rangy.createCssClassApplier(this.getClass(), {
            elementTagName: this.getTag()
        });
    }
    return this.applier;
};

CSSClassApplierButton.prototype.getTag = function() {
    return this.tag || 'span';
};

CSSClassApplierButton.prototype.getClass = function() {
    return this.options.cssPrefix + this.class
};
