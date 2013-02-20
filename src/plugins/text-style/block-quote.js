/**
 * @fileOverview Contains the block quote button code.
 * @author  David Neilsen <david@panmedia.co.nz>
 * @author  Michael Robinson <michael@panmedia.co.nz>
 * @author Melissa Richards <melissa@panmedia.co.nz>
 */

/**
 * Creates an instance of the preview toggle button to insert a block quote.
 *
 * @todo param stuffs?
 * @param {type} param
 */
Raptor.registerUi(new PreviewToggleButton({
    name: 'textBlockQuote',
    init: function() {
        var result = PreviewToggleButton.prototype.init.apply(this, arguments);
        if (elementIsValid(this.raptor.getElement(), listValidBlockQuoteParents)) {
            return result;
        }
        return;
    },
    action: function() {
        listToggle('blockquote', 'p', this.raptor.getElement());
    },
    selectionToggle: function() {
        return rangy.getSelection().getAllRanges().length > 0 &&
            selectionContains('blockquote', this.raptor.getElement());
    }
}));
