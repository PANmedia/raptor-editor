/**
 * @fileOverview Contains the filtered preview button class code.
 * @license http://www.raptor-editor.com/license
 *
 * @author David Neilsen <david@panmedia.co.nz>
 * @author Michael Robinson <michael@panmedia.co.nz>
 * @author Melissa Richards <melissa@panmedia.co.nz>
 */

/**
 * @class the filtered preview button class.
 *
 * @constructor
 * @augments PreviewButton
 *
 * @param {Object} options
 */
function FilteredPreviewButton(options) {
    Button.call(this, options);
}

FilteredPreviewButton.prototype = Object.create(PreviewButton.prototype);

/**
 * Initialize the filtered preview button.
 *
 * @returns {Element} result
 */
FilteredPreviewButton.prototype.init = function() {
    var result = PreviewButton.prototype.init.apply(this, arguments);
    this.raptor.bind('selectionChange', this.selectionChange.bind(this));
    return result;
};

/**
 * Toggles the button's disabled state.
 */
FilteredPreviewButton.prototype.selectionChange = function() {
    if (this.isEnabled()) {
        aButtonEnable(this.button);
    } else {
        aButtonDisable(this.button);
    }
};

// <strict>
/**
 * Get the element according to the button's filtereing strategy.
 * @throws {Error} If this function is not overridden.
 * @param  {RangyRange} range
 * @return {Element} The filtered element.
 */
FilteredPreviewButton.prototype.getElement = function(range) {
    throw new Error('Expected child class to override FilteredPreviewButton.getElement');
};
// </strict>


/**
 * @returns {Boolean} True if preview available and if the button is enabled, false otherwise.
 */
FilteredPreviewButton.prototype.canPreview = function() {
    return PreviewButton.prototype.canPreview.call(this) && this.isEnabled();
};

/**
 * @returns {Boolean} True if button is enabled, false otherwise.
 */
FilteredPreviewButton.prototype.isEnabled = function() {
    var range = rangeGet();
    if (range) {
        return !!this.getElement(range);
    }
    return !!this.previewing;
};

/**
 * Perform the button's action.
 */
FilteredPreviewButton.prototype.action = function() {
    selectionEachRange(function(range) {
        var element = this.getElement(range);
        if (element) {
            this.applyToElement(element);
        }
    }.bind(this));
};
