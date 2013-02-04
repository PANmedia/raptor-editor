/**
 * @fileOverview Contains the basic colour menu class code.
 * @author  David Neilsen <david@panmedia.co.nz>
 * @author  Michael Robinson <michael@panmedia.co.nz>
 * @author Melissa Richards <melissa@panmedia.co.nz>
 */

/**
 * @class The basic colour menu class.
 * @constructor
 * @augments SelectMenu
 *
 * @param {Object} options
 * @returns {ColorMenuBasic}
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
    aButtonSetLabel(button, _('colorMenuBasicAutomatic'));
    aButtonSetIcon(button, false);
    if (!tag) {
        return;
    }
    tag = $(tag);
    for (var i = 0, l = this.colors.length; i < l; i++) {
        closest = $(tag).closest('.' + this.options.cssPrefix + this.colors[i]);
        if (closest.length) {
            color = this.colors[i];
            break;
        }
    }
    if (color) {
        aButtonSetLabel(button, _('colorMenuBasic' + (color.charAt(0).toUpperCase() + color.slice(1))));
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
ColorMenuBasic.prototype.changeColor = function(color) {
    this.raptor.actionApply(function() {
        if (color === 'automatic') {
            selectionGetElements().parents('.' + this.options.cssPrefix + 'color').andSelf().each(function() {
                var classes = $(this).attr('class');
                if (classes) {
                    classes = classes.match(/(cms-(.*?))( |$)/ig);
                    for (var i = 0, l = classes.length; i < l; i++) {
                        $(this).removeClass($.trim(classes[i]));
                    }
                }
            });
        } else {
            selectionToggleWrapper('span', {
                classes: this.options.classes || this.options.cssPrefix + 'color ' + this.options.cssPrefix + color
            });
        }
//        var applier = rangy.createCssClassApplier('cms-' + color, {
//            elementTagName: 'span'
//        });
//        applier.toggleSelection(this.raptor.getSelection());
    }.bind(this));
};

/**
 * The preview state for the basic colour menu.
 *
 * @param event The mouse event to trigger the preview.
 */
ColorMenuBasic.prototype.preview = function(event) {
    this.raptor.actionPreview(function() {
        this.changeColor($(event.currentTarget).data('color'));
    }.bind(this));
};

/**
 * Restores the selection from the preview.
 */
ColorMenuBasic.prototype.previewRestore = function() {
    this.raptor.actionPreviewRestore();
};

/**
 * Applies the colour change to the selection.
 *
 * @param event The mouse event to trigger the application of the colour.
 */
ColorMenuBasic.prototype.apply = function(event) {
    this.raptor.actionApply(function() {
        this.changeColor($(event.currentTarget).data('color'));
    }.bind(this));
};

//ColorMenuBasic.prototype.getButton = function() {
//    if (!this.button) {
//        this.button = new Button({
//            name: this.name,
//            action: this.show.bind(this),
//            preview: false,
//            options: this.options,
//            text: true,
//            icon: false,
//            label: _('colorMenuBasicAutomatic'),
//            raptor: this.raptor
//        });
//    }
//    return this.button;
//};

/**
 * Prepare and return the menu items to be used in the Raptor UI.
 * @returns {Element} The menu items.
 */
ColorMenuBasic.prototype.getMenuItems = function() {
    return $(this.raptor.getTemplate('color-menu-basic.menu', this.options))
        .click(this.apply.bind(this))
        .mouseenter(this.preview.bind(this))
        .mouseleave(this.previewRestore.bind(this));
};

Raptor.registerUi(new ColorMenuBasic());
