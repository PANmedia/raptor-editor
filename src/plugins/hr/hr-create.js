/**
 * @fileOverview Contains the hr button code.
 * @license http://www.raptor-editor.com/license
 *
 * @author David Neilsen <david@panmedia.co.nz>
 * @author Michael Robinson <michael@panmedia.co.nz>
 * @author Melissa Richards <melissa@panmedia.co.nz>
 */

/**
 * Creates an instance of the preview button to insert a hr at the selection.
 *
 * @todo param details?
 * @param {type} param
 */
Raptor.registerUi(new PreviewButton({
    name: 'hrCreate',
    action: function() {
        selectionReplace('<hr/>');
    }
}));
