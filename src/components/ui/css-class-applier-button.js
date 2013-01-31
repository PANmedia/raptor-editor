/**
 * @fileOverview Contains the css class applier button class code.
 * @author  David Neilsen <david@panmedia.co.nz>
 * @author  Michael Robinson <michael@panmedia.co.nz>
 * @author Melissa Richards <melissa@panmedia.co.nz>
 */

/**
 * @class the css class applier button class.
 *
 * @constructor
 * @augments PreviewToggleButton class.
 *
 * @todo param desc
 * @param {Object} options
 */
function CSSClassApplierButton(options) {
    PreviewToggleButton.call(this, options);
}

CSSClassApplierButton.prototype = Object.create(PreviewToggleButton.prototype);

/**
 * Applies the css class from the button to a selection.
 */
CSSClassApplierButton.prototype.action = function() {
    selectionExpandToWord();
    for (var i = 0, l = this.classes.length; i < l; i++) {
        var applier = rangy.createCssClassApplier(this.options.cssPrefix + this.classes[i], {
            elementTagName: this.tag || 'span'
        });
        applier.toggleSelection();
    }
    this.selectionChange();
};

/**
 * Checks if a class has been applied to a selection.
 *
 * @todo check please
 * @returns {Boolean} True if the css has been applied to the selection.
 */
CSSClassApplierButton.prototype.selectionToggle = function() {
    for (var i = 0, l = this.classes.length; i < l; i++) {
        var applier = rangy.createCssClassApplier(this.options.cssPrefix + this.classes[i], {
            elementTagName: this.tag || 'span'
        });
        if (!applier.isAppliedToSelection()) {
            return false;
        }
    }
    return true;
};
