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
            .appendTo('body');
        aMenu(this.menu);
        // Click off close event
        $('html').click(function(event) {
            if (this.button.button.has(event.target).length === 0) {
                this.menu.hide();
            }
        }.bind(this));
    }
    return this.menu;
};