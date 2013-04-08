/**
 * @fileOverview Contains the dock to screen button code.
 * @author  David Neilsen <david@panmedia.co.nz>
 * @author  Michael Robinson <michael@panmedia.co.nz>
 * @author Melissa Richards <melissa@panmedia.co.nz>
 */

/**
 * Creates an instance of the dock to screen button for use in the Raptor UI.
 *
 * @todo des and type for the param.
 * @param {type} param
 */
Raptor.registerUi(new Button({
    name: 'dockToScreen',
    action: function() {
        this.raptor.plugins.dock.toggleDockToScreen();
    }
}));
