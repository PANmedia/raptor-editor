/**
 * @fileOverview Contains the superscript button code.
 * @license http://www.raptor-editor.com/license
 *
 * @author David Neilsen <david@panmedia.co.nz>
 * @author Michael Robinson <michael@panmedia.co.nz>
 * @author Melissa Richards <melissa@panmedia.co.nz>
 */

/**
 * Creates an instance of the CSS applier button to apply the superscript class
 * to a selection.
 */
Raptor.registerUi(new CSSClassApplierButton({
    name: 'textSuper',
    tag: 'sup',
    classes: ['sup']
}));
