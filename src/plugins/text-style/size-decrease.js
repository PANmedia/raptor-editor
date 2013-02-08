/**
 * @fileOverview Contains the text size decrease button code.
 * @author  David Neilsen <david@panmedia.co.nz>
 * @author  Michael Robinson <michael@panmedia.co.nz>
 * @author Melissa Richards <melissa@panmedia.co.nz>
 */

/**
 * Creates an instance of the preview button to apply the text size decrease class to a selection.
 *
 * @todo param stuffs?
 * @param {type} param
 */
Raptor.registerUi(new PreviewButton({
    name: 'textSizeDecrease',
    action: function() {
        selectionExpandToWord();
        selectionInverseWrapWithTagClass('small', this.options.cssPrefix + 'small', 'big', this.options.cssPrefix + 'big');
        this.raptor.getElement().find('small.' + this.options.cssPrefix + 'small:empty, big.' + this.options.cssPrefix + 'big:empty').remove();
    }
}));
