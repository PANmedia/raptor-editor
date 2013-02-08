/**
 * @fileOverview Contains the unordered list button code.
 * @author  David Neilsen <david@panmedia.co.nz>
 * @author  Michael Robinson <michael@panmedia.co.nz>
 * @author Melissa Richards <melissa@panmedia.co.nz>
 */

/**
 * Creates a new instance of the preview toggle button to create unordered lists.
 *
 * @todo param details?
 * @param {type} param
 */
Raptor.registerUi(new PreviewToggleButton({
    name: 'listUnordered',
    init: function() {
        var result = PreviewToggleButton.prototype.init.apply(this, arguments);
        if (elementIsValid(this.raptor.getElement(), listValidUlOlParents)) {
            return result;
        }
        return;
    },
    action: function() {
        listToggle('ul', 'li', this.raptor.getElement());
    },
    selectionToggle: function() {
        var selection = rangy.getSelection();
        return selection.getAllRanges().length > 0 &&
            selectionGetElements(selection).closest('ul').length;
    }
}));
