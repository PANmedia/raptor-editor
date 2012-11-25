function CSSClassApplierButton(options) {
    this.applier = null;
    Button.call(this, options);
}

CSSClassApplierButton.prototype = new Button();
CSSClassApplierButton.prototype.constructor = CSSClassApplierButton;

CSSClassApplierButton.prototype.action = function() {
    this.getApplier().toggleSelection(this.raptor.getSelection());
};

CSSClassApplierButton.prototype.getApplier = function() {
    if (this.applier === null) {
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
