function CSSClassApplierButton(options) {
    PreviewToggleButton.call(this, options);
}

CSSClassApplierButton.prototype = Object.create(PreviewToggleButton.prototype);

CSSClassApplierButton.prototype.action = function() {
    selectionExpandToWord();
    for (var i = 0, l = this.classes.length; i < l; i++) {
        var applier = rangy.createCssClassApplier(this.options.cssPrefix + this.classes[i], {
            elementTagName: this.tag || 'span'
        });
        applier.toggleSelection();
    }
    this.selectionChange();
};

CSSClassApplierButton.prototype.selectionToggle = function() {
    for (var i = 0, l = this.classes.length; i < l; i++) {
        var applier = rangy.createCssClassApplier(this.options.cssPrefix + this.classes[i], {
            elementTagName: this.tag || 'span'
        });
        if (!applier.isAppliedToSelection()) {
            return false;
        }
    }
    return true;
};
