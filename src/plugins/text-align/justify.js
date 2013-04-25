/**
 * @fileOverview Contains the justify text button code.
 * @license http://www.raptor-editor.com/license
 *
 * @author David Neilsen <david@panmedia.co.nz>
 * @author Michael Robinson <michael@panmedia.co.nz>
 * @author Melissa Richards <melissa@panmedia.co.nz>
 */

/**
 * Creates a text align button to justify text.
 */
Raptor.registerUi(new TextAlignButton({
    name: 'alignJustify',
    getClass: function() {
        return this.options.cssPrefix + 'justify';
    }
}));
