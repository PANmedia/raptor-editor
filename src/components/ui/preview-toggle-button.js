function PreviewToggleButton(options) {
    Button.call(this, options);
}

PreviewToggleButton.prototype = Object.create(PreviewButton.prototype);

PreviewToggleButton.prototype.init = function() {
    this.raptor.bind('selectionChange', this.selectionChange.bind(this));
    return PreviewButton.prototype.init.apply(this, arguments);
};

PreviewToggleButton.prototype.selectionChange = function() {
    if (this.selectionToggle()) {
        if (!this.isPreviewing()) {
            aButtonActive(this.button);
        }
    } else {
        aButtonInactive(this.button);
    }
};
