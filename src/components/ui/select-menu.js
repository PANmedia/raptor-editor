function SelectMenu(options) {
    Menu.call(this, options);
}

SelectMenu.prototype = Object.create(Menu.prototype);

SelectMenu.prototype.getMenu = function() {
    if (!this.menu) {
        this.menu = $('<ul>')
            .addClass(this.options.baseClass + '-menu ' + this.raptor.options.baseClass + '-menu')
            .html(this.getMenuItems())
            .css('position', 'fixed')
            .hide()
            .mousedown(function(event) {
                // Prevent losing the selection on the editor target
                event.preventDefault();
            })
            .on('click', 'a', function(event) {
                aButtonSetLabel(this.button.button, $(event.target).html());
                // Prevent jQuery UI focusing the menu
                return false;
            }.bind(this))
            .appendTo('body');
        aMenu(this.menu);
    }
    return this.menu;
};
