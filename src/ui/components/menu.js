function Menu(options) {
    this.raptor = null;
    this.menu = null;
    this.menuContent = '';
    for (var key in options) {
        this[key] = options[key];
    }
};

Menu.prototype.init = function(raptor) {
    this.setOptions();
    this.raptor = raptor;
    this.button = new Button({
        name: this.name,
        action: this.toggle.bind(this),
        preview: false,
        options: this.options
    });
    return this.button.init(raptor);
};
            
Menu.prototype.setOptions = function() {
    this.options.title = _(this.name + 'Title');
    this.options.icon = 'ui-icon-' + this.name;
    this.options.text = _(this.name + 'Text');
};

Menu.prototype.getMenu = function() {
    if (!this.menu) {
        this.menu = $('<div>')
            .addClass('ui-menu ui-widget ui-widget-content ui-corner-all')
            .html(this.menuContent)
            .css('position', 'fixed')
            .hide()
            .appendTo('body')
            .mousedown(function(event) {
                event.preventDefault();
            });
    }
    return this.menu;
};

Menu.prototype.show = function() {
    elementPositionUnder(this.getMenu().show(), this.button.button);
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
