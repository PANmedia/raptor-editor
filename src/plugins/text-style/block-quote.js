/**
 * @fileOverview Contains the block quote button code.
 * @license http://www.raptor-editor.com/license
 *
 * @author David Neilsen <david@panmedia.co.nz>
 * @author Michael Robinson <michael@panmedia.co.nz>
 * @author Melissa Richards <melissa@panmedia.co.nz>
 */

/**
 * Creates an instance of the preview toggle button to insert a block quote.
 */
Raptor.registerUi(new Button({
    name: 'textBlockQuote',
    action: function() {
        document.execCommand('formatBlock', false, '<blockquote>');
    }
}));
