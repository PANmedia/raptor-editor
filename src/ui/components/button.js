function Button(overrides) {
    this.preview = true;
    for (var key in overrides) {
        this[key] = overrides[key];
    }
};

Button.prototype.init = function(raptor) {
    this.raptor = raptor;
    this.button = $('<div>')
        .html(this.text)
        .click(this.click.bind(this))
        .mouseenter(this.mouseEnter.bind(this))
        .mouseleave(this.mouseLeave.bind(this));
    aButton(this.button, {
        icon: this.getIcon(),
        title: this.getTitle(),
    });
    return this.button;
};

Button.prototype.getTitle = function() {
    return this.title || _(this.name + 'Title');
};

Button.prototype.getIcon = function() {
    return this.icon || 'ui-icon-' + stringCamelCaseConvert(this.name);
};

Button.prototype.mouseEnter = function() {
    if (this.preview) {
        this.raptor.actionPreview(this.action.bind(this));
    }
};

Button.prototype.mouseLeave = function() {
    if (this.preview) {
        this.raptor.actionPreviewRestore();
    }
};

Button.prototype.click = function() {
    this.raptor.actionApply(this.action.bind(this));
};
