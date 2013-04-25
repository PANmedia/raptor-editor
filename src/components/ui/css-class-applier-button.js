/**
 * @fileOverview Contains the CSS class applier button class code.
 * @license http://www.raptor-editor.com/license
 *
 * @author David Neilsen <david@panmedia.co.nz>
 * @author Michael Robinson <michael@panmedia.co.nz>
 * @author Melissa Richards <melissa@panmedia.co.nz>
 */

/**
 * @class The CSS class applier button.
 *
 * @constructor
 * @augments PreviewToggleButton
 * @param {Object} options
 */
function CSSClassApplierButton(options) {
    PreviewToggleButton.call(this, options);
}

CSSClassApplierButton.prototype = Object.create(PreviewToggleButton.prototype);

/**
 * Applies the class from the button to a selection.
 */
CSSClassApplierButton.prototype.action = function() {
    selectionExpandToWord();
    this.raptor.selectionConstrain();
    for (var i = 0, l = this.classes.length; i < l; i++) {
        var applier = rangy.createCssClassApplier(this.options.cssPrefix + this.classes[i], {
            elementTagName: this.tag || 'span'
        });
        applier.toggleSelection();
    }
};

/**
 * Checks whether a class has been applied to a selection.
 *
 * @returns {Boolean} True if the css has been applied to the selection, false otherwise.
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
