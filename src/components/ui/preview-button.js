/**
 * @fileOverview Contains the preview button class code.
 * @license http://www.raptor-editor.com/license
 *
 * @author David Neilsen <david@panmedia.co.nz>
 * @author Michael Robinson <michael@panmedia.co.nz>
 * @author Melissa Richards <melissa@panmedia.co.nz>
 */

/**
 * @class the preview button class.
 *
 * @constructor
 * @augments {Button}
 *
 * @param {Object} options
 */
function PreviewButton(options) {
    this.previewing = false;
    Button.call(this, options);
}

PreviewButton.prototype = Object.create(Button.prototype);

/**
 * Prepare and return the preview button Element to be used in the Raptor UI.
 *
 * @returns {Element}
 */
PreviewButton.prototype.getButton = function() {
    if (!this.button) {
        this.button = Button.prototype.getButton.call(this)
            .mouseenter(this.mouseEnter.bind(this))
            .mouseleave(this.mouseLeave.bind(this));
    }
    return this.button;
};

/**
 * Sets the mouse enter function to enable the preview.
 */
PreviewButton.prototype.mouseEnter = function() {
    if (this.canPreview()) {
        this.previewing = true;
        this.raptor.actionPreview(this.action.bind(this));
    }
};

/**
 * Sets the mouse leave function to disable the preview.
 */
PreviewButton.prototype.mouseLeave = function() {
    this.raptor.actionPreviewRestore();
    this.previewing = false;
};

/**
 * Sets the click function to disable the preview and apply the style.
 *
 * @returns {Element}
 */
PreviewButton.prototype.click = function() {
    this.previewing = false;
    return Button.prototype.click.apply(this, arguments);
};

/**
 * Checks if the Element is able to generate a preview.
 *
 * @todo check as i guessed this.
 * @returns {Boolean} True if preview available.
 */
PreviewButton.prototype.canPreview = function() {
    return this.preview;
};
/**
 * Checks if the Element is in it's preview state.
 *
 * @todo check as i guessed this.
 * @returns {Boolean} True if in previewing state.
 */
PreviewButton.prototype.isPreviewing = function() {
    return this.previewing;
};
