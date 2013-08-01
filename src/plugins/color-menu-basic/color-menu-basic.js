/**
 * @fileOverview Contains the basic colour menu class code.
 * @license http://www.raptor-editor.com/license
 *
 * @author  David Neilsen <david@panmedia.co.nz>
 * @author  Michael Robinson <michael@panmedia.co.nz>
 * @author Melissa Richards <melissa@panmedia.co.nz>
 */

/**
 * The basic colour menu class.
 *
 * @constructor
 * @augments SelectMenu
 *
 * @param {Object} options
 */
function ColorMenuBasic(options) {
    this.colors = [
        'white',
        'black',
        'grey',
        'blue',
        'red',
        'green',
        'purple',
        'orange'
    ];
    /**
     * Cache the current color so it can be reapplied to the button if the user
     * clicks the button to open the menu, hovers some colors then clicks off to
     * close it.
     *
     * @type {String}
     */
    this.currentColor = 'automatic';
    SelectMenu.call(this, {
        name: 'colorMenuBasic'
    });
}

ColorMenuBasic.prototype = Object.create(SelectMenu.prototype);

/**
 * Initialize the basic colour menu.
 *
 * @returns {Element}
 */
ColorMenuBasic.prototype.init = function() {
    this.raptor.bind('selectionChange', this.updateButton.bind(this));
    this.updateButton();
    return SelectMenu.prototype.init.apply(this, arguments);
};

/**
 * Updates the basic colour menu with the current colour.
 */
ColorMenuBasic.prototype.updateButton = function() {
    var tag = selectionGetElements()[0],
        button = this.getButton().getButton(),
        color = null,
        closest = null;

    // TODO: set automatic icon color to the color of the text
    aButtonSetLabel(button, tr('colorMenuBasicAutomatic'));
    aButtonSetIcon(button, false);
    if (!tag) {
        return;
    }
    tag = $(tag);
    for (var colorsIndex = 0; colorsIndex < this.colors.length; colorsIndex++) {
        closest = $(tag).closest('.' + this.options.cssPrefix + this.colors[colorsIndex]);
        if (closest.length) {
            color = this.colors[colorsIndex];
            break;
        }
    }
    if (color) {
        aButtonSetLabel(button, tr('colorMenuBasic' + (color.charAt(0).toUpperCase() + color.slice(1))));
        aButtonSetIcon(button, 'ui-icon-swatch');
        // FIXME: set color in an adapter friendly way
        button.find('.ui-icon').css('background-color', closest.css('color'));
        return;
    }
};

/**
 * Changes the colour of the selection.
 *
 * @param {type} color The current colour.
 */
ColorMenuBasic.prototype.changeColor = function(color, permanent) {
    if (permanent) {
        this.currentColor = color;
    }
    this.raptor.actionApply(function() {
        selectionExpandToWord();
        if (color === 'automatic') {
            selectionGetElements().parents('.' + this.options.cssPrefix + 'color').addBack().each(function() {
                var classes = $(this).attr('class');
                if (classes === null || typeof classes === 'undefined') {
                    return;
                }
                classes = classes.match(/(cms-(.*?))( |$)/ig);
                if (classes === null || typeof classes === 'undefined') {
                    return;
                }
                for (var i = 0, l = classes.length; i < l; i++) {
                    $(this).removeClass($.trim(classes[i]));
                }
            });
        } else {
            var uniqueId = elementUniqueId();
            selectionToggleWrapper('span', {
                classes: this.options.classes || this.options.cssPrefix + 'color ' + this.options.cssPrefix + color,
                attributes: {
                    id: uniqueId
                }
            });
            var element = $('#' + uniqueId);
            if (element.length) {
                selectionSelectInner(element.removeAttr('id').get(0));
                var splitNode;
                do {
                    splitNode = $('#' + uniqueId);
                    splitNode.removeAttr('id');
                } while (splitNode.length);
            }
        }
    }.bind(this));
};

/**
 * The preview state for the basic colour menu.
 *
 * @param event The mouse event which triggered the preview.
 */
ColorMenuBasic.prototype.menuItemMouseEnter = function(event) {
    this.raptor.actionPreview(function() {
        this.changeColor($(event.currentTarget).data('color'));
    }.bind(this));
};

/**
 * Restores the selection from the preview.
 *
 * @param event
 */
ColorMenuBasic.prototype.menuItemMouseLeave = function(event) {
    this.raptor.actionPreviewRestore();
    this.changeColor(this.currentColor);
};

/**
 * Applies the colour change to the selection.
 *
 * @param event The mouse event to trigger the application of the colour.
 */
ColorMenuBasic.prototype.menuItemClick = function(event) {
    SelectMenu.prototype.menuItemClick.apply(this, arguments);
    this.raptor.actionApply(function() {
        this.changeColor($(event.currentTarget).data('color'), true);
    }.bind(this));
};

/**
 * Prepare and return the menu items to be used in the Raptor UI.
 * @returns {Element} The menu items.
 */
ColorMenuBasic.prototype.getMenuItems = function() {
    return this.raptor.getTemplate('color-menu-basic.menu', this.options);
};

Raptor.registerUi(new ColorMenuBasic());
