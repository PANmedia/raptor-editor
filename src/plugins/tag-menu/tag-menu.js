/**
 * @fileOverview Contains the left align button code.
 * @license http://www.raptor-editor.com/license
 *
 * @author David Neilsen <david@panmedia.co.nz>
 * @author Michael Robinson <michael@panmedia.co.nz>
 * @author Melissa Richards <melissa@panmedia.co.nz>
 */

/**
 * The tag menu class.
 *
 * @constructor
 * @augments SelectMenu
 *
 * @param {Object} options Options hash.
 */
function TagMenu(options) {
    SelectMenu.call(this, {
        name: 'tagMenu'
    });
}

TagMenu.prototype = Object.create(SelectMenu.prototype);

/**
 * Initializes the tag menu.
 */
TagMenu.prototype.init = function() {
    this.raptor.bind('selectionChange', this.updateButton.bind(this));
    return SelectMenu.prototype.init.apply(this, arguments);
};

/**
 * Changes the tags on the selected element(s).
 *
 * @param {HTML} tag The new tag.
 */
TagMenu.prototype.changeTag = function(tag) {
    // Prevent injection of illegal tags
    if (typeof tag === 'undefined' || tag === 'na') {
        return;
    }

    var selectedElement = selectionGetElement(),
        limitElement = this.raptor.getElement();
    if (selectedElement && !selectedElement.is(limitElement)) {
        var cell = selectedElement.closest('td, li, #' + limitElement.attr('id'));
        if (cell.length !== 0) {
            limitElement = cell;
        }
    }
    
    selectionChangeTags(tag, [
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'p', 'div', 'pre', 'address'
    ], limitElement);
};

/**
 * Applies the tag change.
 *
 * @param event The mouse event to trigger the function.
 */
TagMenu.prototype.menuItemClick = function(event) {
    SelectMenu.prototype.menuItemClick.apply(this, arguments);
    this.raptor.actionApply(function() {
        this.changeTag($(event.currentTarget).data('value'));
    }.bind(this));
};

/**
 * Generates a preview state for a change of tag.
 *
 * @param event The mouse event to trigger the preview.
 */
TagMenu.prototype.menuItemMouseEnter = function(event) {
    this.raptor.actionPreview(function() {
        this.changeTag($(event.currentTarget).data('value'));
    }.bind(this));
};

/**
 * Restores the tag menu from it's preview state.
 *
 * @param event The mouse event to trigger the restoration of the tag menu.
 */
TagMenu.prototype.menuItemMouseLeave = function(event) {
    this.raptor.actionPreviewRestore();
};

/**
 * Updates the display of the tag menu button.
 */
TagMenu.prototype.updateButton = function() {
    var tag = selectionGetElements()[0],
        button = this.getButton().getButton();
    if (!tag) {
        return;
    }
    var tagName = tag.tagName.toLowerCase(),
        option = this.getMenu().find('[data-value=' + tagName + ']');
    if (option.length) {
        aButtonSetLabel(button, option.html());
    } else {
        aButtonSetLabel(button, _('tagMenuTagNA'));
    }
//    if (this.raptor.getElement()[0] === tag) {
//        aButtonDisable(button);
//    } else {
//        aButtonEnable(button);
//    }
};

/**
 * Prepares and returns the menu items for use in the raptor UI.
 * @returns {Element}
 */
TagMenu.prototype.getMenuItems = function() {
    return this.raptor.getTemplate('tag-menu.menu', this.options);
};

Raptor.registerUi(new TagMenu());
