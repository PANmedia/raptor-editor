/**
 * @fileOverview Contains the click button to edit plugin code.
 * @license http://www.raptor-editor.com/license
 *
 * @author David Neilsen <david@panmedia.co.nz>
 * @author Michael Robinson <michael@panmedia.co.nz>
 * @author Melissa Richards <melissa@panmedia.co.nz>
 */

/**
 * The click button to edit plugin class.
 *
 * @constructor
 * @augments RaptorPlugin
 * @param {String} name
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
    this.raptor.addToHoverPanel(this);
};

/**
 * Enables the editing state for the selection controlled by the button and the button is hidden.
 */
ClickButtonToEditPlugin.prototype.edit = function() {
    this.raptor.enableEditing();
    this.raptor.showLayout();
};

/**
 * Selects or creates the button and returns it.
 *
 * @todo type and description for instance.
 * @param {type} instance
 * @return {jQuery} The "click to edit" button.
 */
ClickButtonToEditPlugin.prototype.getButton = function(instance) {
    var button = $(this.raptor.getTemplate('click-button-to-edit.button', this.options))
        .click(function() {
            instance.edit();
        });
        aButton(button, {
            icons: {
                primary: 'ui-icon-pencil'
            }
        });
    return button;
};

Raptor.registerPlugin(new ClickButtonToEditPlugin());
