function Button(overrides) {
    this.preview = true;
    for (var key in overrides) {
        this[key] = overrides[key];
    }
};

Button.prototype.init = function(raptor) {
    this.raptor = raptor;
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
            text: false
        });
    }
    return this.button;
}

Button.prototype.getTitle = function() {
    return this.title || _(this.name + 'Title');
};

Button.prototype.getIcon = function() {
    return this.icon || 'ui-icon-' + stringCamelCaseConvert(this.name);
};

Button.prototype.click = function() {
    this.raptor.actionApply(this.action.bind(this));
};
