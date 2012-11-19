function Button(overrides) {
    this.editor = null;
    this.buttonText = '';
    this.button = null;
    for (var key in overrides) {
        this[key] = overrides[key];
    }
};

Button.prototype.init = function(editor) {
    this.editor = editor;
    this.button = $('<div>')
        .html(this.buttonText)
        .click($.proxy(this.click, this))
        .mouseenter($.proxy(this.mouseEnter, this))
        .mouseleave($.proxy(this.mouseLeave, this));
    aButton(this.button);
    return this.button;
};

Button.prototype.mouseEnter = function() {
    this.editor.actionPreview(this.action.bind(this));
};

Button.prototype.mouseLeave = function() {
    this.editor.actionPreviewRemove();
};

Button.prototype.click = function() {
    this.editor.actionApply(this.action.bind(this));
};
