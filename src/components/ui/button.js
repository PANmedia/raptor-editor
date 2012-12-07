function Button(overrides) {
    this.preview = true;
    this.text = false;
    this.label = null;
    this.icon = null;
    for (var key in overrides) {
        this[key] = overrides[key];
    }
};

Button.prototype.init = function() {
    return this.getButton();
};

Button.prototype.getButton = function() {
    if (!this.button) {
        this.button = $('<div>')
            .html(this.text)
            .addClass(this.options.baseClass)
            .attr('title', this.getTitle())
            .click(this.click.bind(this));
        aButton(this.button, {
            icons: {
                primary: this.getIcon()
            },
            text: this.text,
            label: this.label
        });
    }
    return this.button;
}

Button.prototype.getTitle = function() {
    return this.title || _(this.name + 'Title');
};

Button.prototype.getIcon = function() {
    if (this.icon === null) {
        return 'ui-icon-' + stringCamelCaseConvert(this.name)
    }
    return this.icon;
};

// FIXME: this probably should not nest actions
Button.prototype.click = function() {
    this.raptor.actionApply(this.action.bind(this));
};
