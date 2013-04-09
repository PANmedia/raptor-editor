/**
 * @fileOverview Contains the core button class code.
 * @license http://www.raptor-editor.com/license
 *
 * @author David Neilsen <david@panmedia.co.nz>
 * @author Michael Robinson <michael@panmedia.co.nz>
 * @author Melissa Richards <melissa@panmedia.co.nz>
 */

/**
 * The toggle button class.
 *
 * @constructor
 * @augments Button
 *
 * @param {Object} options
 */
function ToggleButton(options) {
    this.disable = false;
    Button.call(this, options);
}

ToggleButton.prototype = Object.create(Button.prototype);

/**
 * Initialize the toggle button.
 *
 * @returns {Element}
 */
ToggleButton.prototype.init = function() {
    this.raptor.bind('selectionChange', this.selectionChange.bind(this));
    return Button.prototype.init.apply(this, arguments);
};

/**
 * Changes the state of the button depending on whether it is active or not.
 */
ToggleButton.prototype.selectionChange = function() {
    if (this.selectionToggle()) {
        aButtonActive(this.button);
        if (this.disable) {
            aButtonEnable(this.button);
        }
    } else {
        aButtonInactive(this.button);
        if (this.disable) {
            aButtonDisable(this.button);
        }
    }
};
