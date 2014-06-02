/**
 * @fileOverview Contains the close panel code.
 * @license http://www.raptor-editor.com/license
 *
 * @author David Neilsen <david@panmedia.co.nz>
 */
Raptor.registerUi(new Button({
    name: 'close',

    click: function() {
        this.layout.close();
    }
}));
