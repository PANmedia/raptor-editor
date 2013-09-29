/**
 * @fileOverview Contains the basic font-family class code.
 * 
 *
 * @author  Nikolay Rodionov <rodi.incave@gmail.com>
*/

/**
 * The basic font-family class.
 *
 * @constructor
 * @augments SelectMenu
 *
 * @param {Object} options
 */
function FontFamilyMenu(options) {
    this.fonts = [
        'default',
        'arial',
        'palatino',
        'georgia',
        'times',
        'comicSMS',
        'impact',
        'courier'
    ];
    /**
     * Cache the current font so it can be reapplied to the button if the user
     * clicks the button to open the menu, hovers some fonts then clicks off to
     * close it.
     *
     * @type {String}
     */
    this.currentFont = 'default';
    SelectMenu.call(this, {
        name: 'fontFamilyMenu'
    });
}

FontFamilyMenu.prototype = Object.create(SelectMenu.prototype);

/**
 * Initialize the basic font menu.
 *
 * @returns {Element}
 */
FontFamilyMenu.prototype.init = function() {
    this.raptor.bind('selectionChange', this.updateButton.bind(this));
    this.updateButton();
    return SelectMenu.prototype.init.apply(this, arguments);
};

/**
 * Updates the basic font menu with the current font.
 */
FontFamilyMenu.prototype.updateButton = function() {
    var tag = selectionGetElements()[0],
        button = this.getButton().getButton(),
        font = null,
        closest = null;

    aButtonSetLabel(button, _('Default'));
    aButtonSetIcon(button, false);
    if (!tag) {
        return;
    }
    tag = $(tag);
    for (var fontsIndex = 0; fontsIndex < this.fonts.length; fontsIndex++) {
        closest = $(tag).closest('.' + this.options.cssPrefix + this.fonts[fontsIndex]);
        if (closest.length) {
            font = this.fonts[fontsIndex];
            break;
        }
    }
    if (font) {
        aButtonSetLabel(button, _((font.charAt(0).toUpperCase() + font.slice(1))));
        return;
    }
};

/**
 * Changes the font-family of the selection.
 *
 * @param {type} font The current font.
 */
FontFamilyMenu.prototype.changeFont = function(font, permanent) {
    if (permanent) {
        this.currentFont = font;
        console.log(this.currentFont);
    }
    this.raptor.actionApply(function() {
        selectionExpandToWord();
        if (font === 'default') {
            selectionGetElements().parents('.' + this.options.cssPrefix + 'font').addBack().each(function() {
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
                classes: this.options.classes || this.options.cssPrefix + 'font ' + this.options.cssPrefix + font,
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
 * The preview state for the basic font menu.
 *
 * @param event The mouse event which triggered the preview.
 */
FontFamilyMenu.prototype.menuItemMouseEnter = function(event) {
    this.raptor.actionPreview(function() {
        this.changeFont($(event.currentTarget).data('font'));
    }.bind(this));
};

/**
 * Restores the selection from the preview.
 *
 * @param event
 */
FontFamilyMenu.prototype.menuItemMouseLeave = function(event) {
    this.raptor.actionPreviewRestore();
    this.changeFont(this.currentFont);
};

/**
 * Applies the font change to the selection.
 *
 * @param event The mouse event to trigger the application of the font.
 */
FontFamilyMenu.prototype.menuItemClick = function(event) {
    SelectMenu.prototype.menuItemClick.apply(this, arguments);
    this.raptor.actionApply(function() {
        this.changeFont($(event.currentTarget).data('font'), true);
    }.bind(this));
};

/**
 * Prepare and return the menu items to be used in the Raptor UI.
 * @returns {Element} The menu items.
 */
FontFamilyMenu.prototype.getMenuItems = function() {
    return this.raptor.getTemplate('font-family.menu', this.options);
};

Raptor.registerUi(new FontFamilyMenu());
