/**
 * @fileOverview Contains the underline button code.
 * @license http://www.raptor-editor.com/license
 *
 * @author David Neilsen <david@panmedia.co.nz>
 * @author Michael Robinson <michael@panmedia.co.nz>
 * @author Melissa Richards <melissa@panmedia.co.nz>
 */

/**
 * Creates an instance of the CSS applier button to apply the underline class to a selection.
 */
Raptor.registerUi(new CSSClassApplierButton({
    name: 'textUnderline',
    hotkey: 'ctrl+u',
    tag: 'u',
    classes: ['underline']
}));
