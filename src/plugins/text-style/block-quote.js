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
    action: function() {
        listToggle('blockquote', 'p', this.raptor.getElement());
        this.selectionChange();
    },
    selectionToggle: function() {
        return rangy.getSelection().getAllRanges().length > 0 &&
            selectionContains('blockquote', this.raptor.getElement());
    }
}));
