/**
 * @fileOverview Contains the preview button class code.
 * @license http://www.raptor-editor.com/license
 *
 * @author David Neilsen <david@panmedia.co.nz>
 * @author Michael Robinson <michael@panmedia.co.nz>
 * @author Melissa Richards <melissa@panmedia.co.nz>
 */

/**
 * @class The preview button class.
 *
 * @constructor
 * @augments Button
 *
 * @param {Object} options
 */
function PreviewButton(options) {
    this.previewing = false;
    this.previewTimer = null;
    this.options = {
        preview: true,
        previewTimeout: 500
    };
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

PreviewButton.prototype.applyPreview = function() {
    if (this.canPreview()) {
        this.previewing = true;
        this.raptor.actionPreview(this.action.bind(this));
    }
};

PreviewButton.prototype.endPreview = function() {
    if (this.previewTimer !== null) {
        clearTimeout(this.previewTimer);
        this.previewTimer = null;
    }
    this.previewing = false;
};

/**
 * Mouse enter event that enables the preview.
 */
PreviewButton.prototype.mouseEnter = function() {
    if (this.canPreview()) {
        this.endPreview();
        if (this.options.previewTimeout !== false) {
            this.previewTimer = setTimeout(this.applyPreview.bind(this), this.options.previewTimeout)
        } else {
            this.applyPreview();
        }
    }
};

/**
 * Mouse leave event that reverts preview (if active).
 */
PreviewButton.prototype.mouseLeave = function() {
    this.endPreview();
    this.raptor.actionPreviewRestore();
};

/**
 * Click event that reverts preview (if active), and the fires the inherited button click event.
 */
PreviewButton.prototype.click = function() {
    this.endPreview();
    return Button.prototype.click.apply(this, arguments);
};

/**
 * Checks if previewing is enabled.
 *
 * @returns {Boolean}
 */
PreviewButton.prototype.canPreview = function() {
    return this.options.preview;
};

/**
 * Checks if previewing is currently active.
 *
 * @returns {Boolean}
 */
PreviewButton.prototype.isPreviewing = function() {
    return this.previewing;
};
