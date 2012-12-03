function CSSClassApplierButton(options) {
    PreviewButton.call(this, options);
}

CSSClassApplierButton.prototype = Object.create(PreviewButton.prototype);

CSSClassApplierButton.prototype.action = function() {
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
    return this.classes || this.cssPrefix + this.name
};
