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
            if (this.button.button.has(event.target).length === 0 &&
                    !this.button.button.is(event.target)) {
                this.menu.hide();
            }
        }.bind(this));
    }
    return this.menu;
};
