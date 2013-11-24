/**
 * @fileOverview Contains the save class code.
 * @license http://www.raptor-editor.com/license
 *
 * @author David Neilsen <david@panmedia.co.nz>
 * @author Michael Robinson <michael@panmedia.co.nz>
 * @author Melissa Richards <melissa@panmedia.co.nz>
 */

/**
 * Creates an instance of the button class to save any changes.
 */
Raptor.registerUi(new Button({
    name: 'save',

    action: function() {
        if (this.getPlugin()) {
            this.getPlugin().save();
        } else {
            aNotify({
                text: tr('saveNotConfigured'),
                type: 'error'
            });
        }
    },

    init: function() {
        if (this.options.plugin === null) {
            return;
        }

        var result = Button.prototype.init.apply(this, arguments);

        // <strict>
        if (!this.getPlugin()) {
            handleError('Cannot find save plugin for UI.');
        }
        // </strict>

        this.raptor.bind('dirty', this.dirty.bind(this));
        this.raptor.bind('cleaned', this.clean.bind(this));
        this.clean();
        return result;
    },

    getPlugin: function() {
        return this.raptor.getPlugin(this.options.plugin);
    },

    dirty: function() {
        aButtonEnable(this.button);
    },

    clean: function() {
        aButtonDisable(this.button);
    }
}));
