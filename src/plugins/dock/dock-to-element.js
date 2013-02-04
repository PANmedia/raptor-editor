/**
 * @fileOverview Contains the dock to element button code.
 * @author  David Neilsen <david@panmedia.co.nz>
 * @author  Michael Robinson <michael@panmedia.co.nz>
 * @author Melissa Richards <melissa@panmedia.co.nz>
 */

/**
 * Creates the dock to element button for use in the raptor UI.
 * 
 * @todo not sure how to document this one.
 * @param {type} param
 */
Raptor.registerUi(new Button({
    name: 'dockToElement',
    action: function() {
        this.raptor.plugins.dock.toggleDockToElement();
        if (this.raptor.plugins.dock.dockState) {
            aButtonActive(this.button);
        } else {
            aButtonInactive(this.button);
        }
    }
}));
