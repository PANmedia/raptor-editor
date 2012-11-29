function FilteredPreviewButton(options) {
    Button.call(this, options);
}

FilteredPreviewButton.prototype = Object.create(PreviewButton.prototype);

FilteredPreviewButton.prototype.init = function(raptor) {
    var result = PreviewButton.prototype.init.call(this, raptor);
    this.raptor.bind('selectionChange', this.selectionChange.bind(this))
    return result;  
};

FilteredPreviewButton.prototype.selectionChange = function() {
    aButton(this.button, {
        disabled: !this.isEnabled()
    });
};

FilteredPreviewButton.prototype.canPreview = function() {
    return PreviewButton.prototype.canPreview.call(this) && this.isEnabled();
};

FilteredPreviewButton.prototype.isEnabled = function() {
    var result = false;
    selectionEachRange(function(range) {
        if (this.getElement(range)) {
            result = true;
        }
    }.bind(this));
    return result;
}

FilteredPreviewButton.prototype.action = function() {
    selectionEachRange(function(range) {
        var element = this.getElement(range);
        if (element) {
            this.applyToElement(element);
        }
    }.bind(this));
};
