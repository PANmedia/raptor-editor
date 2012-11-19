function Menu(options) {
    this.editor = null;
    this.buttonText = '';
    this.menuContent = '';
    this.menu = null;
    this.button = null;
    for (var key in options) {
        this[key] = options[key];
    }
};

Menu.prototype.init = function(editor) {
    this.editor = editor;
    this.button = $('<div>')
        .html(this.buttonText)
        .click($.proxy(this.toggle, this));
    aButton(this.button);
    return this.button;
};

Menu.prototype.getMenu = function() {
    if (!this.menu) {
        this.menu = $('<div>')
            .html(this.menuContent)
            .css('position', 'fixed')
            .hide()
            .appendTo('body');
    }
    return this.menu;
};

Menu.prototype.show = function() {
    elementPositionUnder(this.getMenu().show(), this.button);
};

Menu.prototype.hide = function() {
    this.getMenu().hide()
};

Menu.prototype.toggle = function() {
    if (this.getMenu().is(':visible')) {
        this.hide();
    } else {
        this.show();
    }
};
