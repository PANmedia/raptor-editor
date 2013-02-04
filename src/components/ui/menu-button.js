/**
 * @fileOverview Contains the menu button class code.
 * @author  David Neilsen <david@panmedia.co.nz>
 * @author  Michael Robinson <michael@panmedia.co.nz>
 * @author Melissa Richards <melissa@panmedia.co.nz>
 */

/**
 * @class The menu button class.
 * @constructor
 * @augments button
 *
 * @param {type} menu The menu to create the menu button for.
 * @param {Object} options Any extra options to refine the creation of the menu button.
 * @returns {MenuButton}
 */
function MenuButton(menu, options) {
    this.menu = menu;
    this.name = menu.name;
    this.raptor = menu.raptor;
    this.options = menu.options;
    Button.call(this, options);
}

MenuButton.prototype = Object.create(Button.prototype);

/**
 * Shows the menu on a click event.
 *
 * @param {type} event The click event.
 */
MenuButton.prototype.click = function(event) {
    if (this.menu.getMenu().is(':visible')) {
        $('.raptor-menu').hide();
    } else {
        this.menu.show();
    }
    event.preventDefault();
};
