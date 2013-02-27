/**
 * @fileOverview Contains the click button to edit plugin code.
 * @author David Neilsen <david@panmedia.co.nz>
 * @author Michael Robinson <michael@panmedia.co.nz>
 * @author Melissa Richards <melissa@panmedia.co.nz>
 */

var clickButtonToEditButton = null,
    clickButtonToEditInstance = null;

/**
 * @class The click button to edit plugin class.
 * @constructor
 * @augments Raptor Plugin.
 *
 * @todo des and type for name.
 * @param {type} name
 * @param {Object} overrides Options hash.
 */
function ClickButtonToEditPlugin(name, overrides) {
    RaptorPlugin.call(this, name || 'clickButtonToEdit', overrides);
}

ClickButtonToEditPlugin.prototype = Object.create(RaptorPlugin.prototype);

/**
 * Initialises the click to edit plugin.
 */
ClickButtonToEditPlugin.prototype.init = function() {
    this.raptor.getElement()
        .mouseenter(this.show.bind(this))
        .mouseleave(this.hide.bind(this));
};

/**
 * Shows the 'click button to edit' button.
 */
ClickButtonToEditPlugin.prototype.show = function() {
    if (this.raptor.isEditing()) {
        return;
    }
    this.raptor.getElement()
        .addClass(this.options.baseClass + '-hover');

    var button = this.getButton(this),
        visibleRect = elementVisibleRect(this.raptor.getElement());
    button.show().css({
        position: 'absolute',
        // Calculate offset center for the button
        top:  visibleRect.top  + ((visibleRect.height / 2) - (button.outerHeight() / 2)),
        left: visibleRect.left + ((visibleRect.width / 2)  - (button.outerWidth()  / 2))
    });
};

/**
 * Hides the 'click button to edit' button.
 *
 * @param event The mouse event to trigger the button's hide state.
 */
ClickButtonToEditPlugin.prototype.hide = function(event) {
    var button = this.getButton(this);
    if (event &&
            (event.relatedTarget === button.get(0) ||
             button.get(0) === $(event.relatedTarget).parent().get(0))) {
        return;
    }
    button.hide();
};

/**
 * Enables the editing state for the selection controlled by the button and the button is hidden.
 */
ClickButtonToEditPlugin.prototype.edit = function() {
    this.raptor.enableEditing();
    this.raptor.showLayout();
    this.getButton(this).hide();
};

/**
 * Selects or creates the button and returns it.
 *
 * @todo type and description for instance.
 * @param {type} instance
 * @return {jQuery} The "click to edit" button.
 */
ClickButtonToEditPlugin.prototype.getButton = function(instance) {
    clickButtonToEditInstance = instance;
    if (!clickButtonToEditButton) {
        clickButtonToEditButton = $(this.raptor.getTemplate('click-button-to-edit.button', this.options))
            .click(function() {
                clickButtonToEditInstance.edit();
            })
            .appendTo('body');
        aButton(clickButtonToEditButton, {
            icons: {
                primary: 'ui-icon-pencil'
            }
        });
    }
    return clickButtonToEditButton;

};

Raptor.registerPlugin(new ClickButtonToEditPlugin());
