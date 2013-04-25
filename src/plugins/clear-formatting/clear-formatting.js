/**
 * @fileOverview Contains the clear formatting button code.
 * @license http://www.raptor-editor.com/license
 *
 * @author David Neilsen <david@panmedia.co.nz>
 * @author Michael Robinson <michael@panmedia.co.nz>
 * @author Melissa Richards <melissa@panmedia.co.nz>
 */

/**
 * Creates an instance of the preview button that clears the
 * formatting on a selection.
 */
Raptor.registerUi(new PreviewButton({
    name: 'clearFormatting',
    action: function() {
        selectionClearFormatting(this.raptor.getElement().get(0));
        cleanEmptyElements(this.raptor.getElement(), [
            'a', 'b', 'i', 'sub', 'sup', 'strong', 'em', 'big', 'small', 'p'
        ]);
        cleanWrapTextNodes(this.raptor.getElement()[0], 'p');
    }
}));
