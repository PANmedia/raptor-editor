function Button(overrides) {
    this.raptor = null;
    this.options = {};
    this.button = null;
    this.buttonText = '';
    for (var key in overrides) {
        this[key] = overrides[key];
    }
};

Button.prototype.init = function(raptor) {
    this.setOptions();
    this.raptor = raptor;
    this.button = $('<div>')
        .html(this.text)
        .click($.proxy(this.click, this))
        .mouseenter($.proxy(this.mouseEnter, this))
        .mouseleave($.proxy(this.mouseLeave, this));
    aButton(this.button, this.options);
    return this.button;
};
            
Button.prototype.setOptions = function() {
    this.options.title = _(this.name + '-title');
    this.options.icon = 'ui-icon-' + this.name;
};

Button.prototype.mouseEnter = function() {
    this.raptor.actionPreview(this.action.bind(this));
};

Button.prototype.mouseLeave = function() {
    this.raptor.actionPreviewRestore();
};

Button.prototype.click = function() {
    this.raptor.actionApply(this.action.bind(this));
};
