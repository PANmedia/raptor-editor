/**
 * @fileOverview Contains the text size increase button code.
 * @author  David Neilsen <david@panmedia.co.nz>
 * @author  Michael Robinson <michael@panmedia.co.nz>
 * @author Melissa Richards <melissa@panmedia.co.nz>
 */

/**
 * Creates an instance of the preview button to apply the text size increase class to a selection.
 *
 * @todo param stuffs?
 * @param {type} param
 */
Raptor.registerUi(new PreviewButton({
    name: 'textSizeIncrease',
    action: function() {
        selectionExpandToWord();
        selectionInverseWrapWithTagClass('big', this.options.cssPrefix + 'big', 'small', this.options.cssPrefix + 'small');
        this.raptor.getElement().find('small.' + this.options.cssPrefix + 'small:empty, big.' + this.options.cssPrefix + 'big:empty').remove();
    }
}));
