/**
 * @fileOverview Contains the clear formatting button code.
 * @author  David Neilsen <david@panmedia.co.nz>
 * @author  Michael Robinson <michael@panmedia.co.nz>
 * @author Melissa Richards <melissa@panmedia.co.nz>
 */

/**
 * Creates an instance of the preview button that clears the formatting on a selection.
 *
 * @todo des and type for the param.
 * @param {type} param
 */
Raptor.registerUi(new PreviewButton({
    name: 'clearFormatting',
    action: function() {
        selectionClearFormatting(this.raptor.getElement());
        cleanEmptyElements(this.raptor.getElement(), ['a', 'b', 'i', 'sub', 'sup', 'strong', 'em', 'big', 'small', 'p']);
        cleanWrapTextNodes(this.raptor.getElement()[0], 'p');
    }
}));
