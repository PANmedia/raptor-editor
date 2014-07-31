/**
 * @fileOverview Contains the select menu class code.
 * @license http://www.raptor-editor.com/license
 *
 * @author David Neilsen <david@panmedia.co.nz>
 * @author Michael Robinson <michael@panmedia.co.nz>
 * @author Melissa Richards <melissa@panmedia.co.nz>
 */

/**
 * @class The select menu class.
 *
 * @constructor
 * @augments Menu
 *
 * @param {Object} options
 */
function SelectMenu(options) {
    Menu.call(this, options);
}

SelectMenu.prototype = Object.create(Menu.prototype);

SelectMenu.prototype.menuItemMouseDown = function(event) {
    // Prevent losing the selection on the editor target
    event.preventDefault();
};

SelectMenu.prototype.menuItemClick = function(event) {
    aButtonSetLabel(this.button.button, $(event.target).html());
    $(this.menu).closest('ul').hide();
    // Prevent jQuery UI focusing the menu
    return false;
};

SelectMenu.prototype.menuItemMouseEnter = function(event) {
};

SelectMenu.prototype.menuItemMouseLeave = function(event) {
};

/**
 * Prepare and return the select menu Element to be used in the Raptor UI.
 *
 * @returns {Element} The select menu.
 */
SelectMenu.prototype.getMenu = function() {
    if (!this.menu) {
        this.menu = $('<ul>')
            .addClass('raptor-ui ' + this.options.baseClass + '-menu ' + this.raptor.options.baseClass + '-menu')
            .html(this.getMenuItems())
            .css('position', 'fixed')
            .hide()
            .find('a')
            .mousedown(this.menuItemMouseDown.bind(this))
            .mouseenter(this.menuItemMouseEnter.bind(this))
            .mouseleave(this.menuItemMouseLeave.bind(this))
            .click(this.menuItemClick.bind(this))
            .end()
            .appendTo('body');
        aMenu(this.menu);
    }
    return this.menu;
};
