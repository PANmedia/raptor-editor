/**
 * @fileOverview Contains the basic font-family class code.
 * 
 * @author Nikolay Rodionov <rodi.incave@gmail.com>
 * @author David Neilsen <david@panmedia.co.nz>
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
    this.options= {
        fonts: [
            'arial',
            'palatino',
            'georgia',
            'times',
            'comic-sans',
            'impact',
            'courier'
        ]
    };
    
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

    aButtonSetLabel(button, tr('fontFamilyMenuFontDefault'));
    aButtonSetIcon(button, false);
    if (!tag) {
        return;
    }
    
    for (var fontsIndex = 0; fontsIndex < this.options.fonts.length; fontsIndex++) {
        closest = $(tag).closest('.' + this.options.cssPrefix + 'font-' + this.options.fonts[fontsIndex]);
        if (closest.length) {
            font = this.options.fonts[fontsIndex];
            break;
        }
    }
    
    if (font) {
        aButtonSetLabel(button, this.getMenu().find('[data-font="' + font + '"]').text());
        return;
    }
};

/**
 * Changes the font-family of the selection.
 *
 * @param {type} font The current font.
 */
FontFamilyMenu.prototype.changeFont = function(font) {
    selectionExpandToWord();
    if (font === 'default') {
        selectionGetElements().parents('.' + this.options.cssPrefix + 'font').addBack().each(function() {
            var classes = $(this).attr('class');
            if (classes === null || typeof classes === 'undefined') {
                return;
            }
            classes = classes.match(/(cms-font-(.*?))( |$)/ig);
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
            classes: this.options.classes || this.options.cssPrefix + 'font ' + this.options.cssPrefix + 'font-' + font,
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
};

/**
 * Applies the font change to the selection.
 *
 * @param event The mouse event to trigger the application of the font.
 */
FontFamilyMenu.prototype.menuItemClick = function(event) {
    SelectMenu.prototype.menuItemClick.apply(this, arguments);
    this.raptor.actionApply(function() {
        this.changeFont($(event.currentTarget).data('font'));
    }.bind(this));
};

/**
 * Prepare and return the menu items to be used in the Raptor UI.
 * @returns {Element} The menu items.
 */
FontFamilyMenu.prototype.getMenuItems = function() {
    var items = this.raptor.getTemplate('font-family.menu-item', {
        fontName: 'default',
        fontTitle: tr('fontFamilyMenuFontDefault')
    });
    for (var i = 0, l = this.options.fonts.length; i < l; i++) {
        items += this.raptor.getTemplate('font-family.menu-item', {
            fontName: this.options.fonts[i],
            fontTitle: tr(('fontFamilyMenuFont-' + this.options.fonts[i]).replace(/-([a-z])/g, function (matches) {
                return matches[1].toUpperCase()
            }))
        });
    }
    return items;
};

Raptor.registerUi(new FontFamilyMenu());
