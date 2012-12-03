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
        action: this.show.bind(this),
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
            .addClass('ui-menu ui-widget ui-widget-content ui-corner-all ' + this.options.baseClass + '-menu ' + this.raptor.options.baseClass + '-menu')
            .html(this.menuContent)
            .css('position', 'fixed')
            .hide()
            .appendTo('body')
            .mousedown(function(event) {
                // Prevent losing the selection on the editor target
                event.preventDefault();
            });
        // Click off close event
        $('html').click(function(event) {
            if (this.button.button.has(event.target).length === 0) {
                this.menu.hide();
            }
        }.bind(this));
    }
    return this.menu;
};

Menu.prototype.show = function() {
    elementPositionUnder(this.getMenu().toggle(), this.button.button);
};
