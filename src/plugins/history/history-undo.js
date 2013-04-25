/**
 * @fileOverview Contains the history undo code.
 * @license http://www.raptor-editor.com/license
 *
 * @author David Neilsen <david@panmedia.co.nz>
 * @author Michael Robinson <michael@panmedia.co.nz>
 * @author Melissa Richards <melissa@panmedia.co.nz>
 */

/**
 * Creates an instance of the button class to undo an action.
 *
 * @todo param details?
 * @param {type} param
 */
Raptor.registerUi(new Button({
    name: 'historyUndo',
    hotkey: 'ctrl+z',

    action: function() {
        this.raptor.historyBack();
    },

    init: function () {
        this.raptor.bind('historyChange', this.historyChange.bind(this));
        Button.prototype.init.apply(this, arguments);
        aButtonDisable(this.button);
        return this.button;
    },

    historyChange: function() {
        if (this.raptor.present === 0) {
            aButtonDisable(this.button);
        } else {
            aButtonEnable(this.button);
        }
    }
}));
