/**
 * @fileOverview Contains the click button to edit code.
 * @license http://www.raptor-editor.com/license
 *
 * @author David Neilsen <david@panmedia.co.nz>
 * @author Michael Robinson <michael@panmedia.co.nz>
 * @author Melissa Richards <melissa@panmedia.co.nz>
 */
Raptor.registerUi(new Button({
    name: 'clickButtonToEdit',
    text: _('clickButtonToEditText'),

    action: function() {
        this.raptor.enableEditing();
    }
}));
