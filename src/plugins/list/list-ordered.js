/**
 * @fileOverview Contains the ordered list button code.
 * @license http://www.raptor-editor.com/license
 *
 * @author David Neilsen <david@panmedia.co.nz>
 * @author Michael Robinson <michael@panmedia.co.nz>
 * @author Melissa Richards <melissa@panmedia.co.nz>
 */

/**
 * Creates a new instance of the preview toggle button to create ordered lists.
 */
Raptor.registerUi(new Button({
    name: 'listOrdered',
    action: function() {
        document.execCommand('insertOrderedList');
    }
}));
