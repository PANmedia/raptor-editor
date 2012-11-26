function PreviewButton(options) {
    Button.call(this, options);
}

PreviewButton.prototype = Object.create(Button.prototype);

PreviewButton.prototype.getButton = function() {
    if (!this.button) {
        this.button = Button.prototype.getButton.call(this)
            .mouseenter(this.mouseEnter.bind(this))
            .mouseleave(this.mouseLeave.bind(this));
    }
    return this.button;
};

PreviewButton.prototype.mouseEnter = function() {
    if (this.preview) {
        this.raptor.actionPreview(this.action.bind(this));
    }
};

PreviewButton.prototype.mouseLeave = function() {
    if (this.preview) {
        this.raptor.actionPreviewRestore();
    }
};
