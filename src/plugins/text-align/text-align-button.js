/**
 * @fileOverview Contains the text align button class code.
 * @license http://www.raptor-editor.com/license
 *
 * @author David Neilsen <david@panmedia.co.nz>
 * @author Michael Robinson <michael@panmedia.co.nz>
 * @author Melissa Richards <melissa@panmedia.co.nz>
 */

/**
 * The text align button class.
 *
 * @constructor
 * @augments PreviewToggleButton
 *
 * @param {Object} options Options hash.
 */
function TextAlignButton(options) {
    PreviewToggleButton.call(this, options);
}

TextAlignButton.prototype = Object.create(PreviewToggleButton.prototype);

TextAlignButton.prototype.action = function() {
    selectionToggleBlockClasses([
        this.getClass()
    ], [
        this.options.cssPrefix + 'center',
        this.options.cssPrefix + 'left',
        this.options.cssPrefix + 'right',
        this.options.cssPrefix + 'justify'
    ], this.raptor.getElement(), 'span');
    this.selectionChange();
};

TextAlignButton.prototype.selectionToggle = function() {
    return rangy.getSelection().getAllRanges().length > 0 &&
        selectionContains('.' + this.getClass(), this.raptor.getElement());
};