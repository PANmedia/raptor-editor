/**
 * Save UI plugin.
 *
 * Provides the save button UI that is enabled/disabled when the editable blocks is dirty/clean.
 * The UI will either call another plugin, or a callback when clicked.
 *
 * @plugin Button save
 * @license http://www.raptor-editor.com/license
 *
 * @author David Neilsen <david@panmedia.co.nz>
 * @author Michael Robinson <michael@panmedia.co.nz>
 * @author Melissa Richards <melissa@panmedia.co.nz>
 */
Raptor.registerUi(new Button({
    name: 'save',
    hotkey: 'ctrl+s',

    options: {
        /**
         * Name of plugin to call when save UI is clicked. Typically `saveJson` or `saveRest`
         * @option {string} plugin
         */
        plugin: null,

        /**
         * Callback to call when save UI is clicked. The callback an plugin options are mutually exclusive.
         * @option {function} callback
         */
        callback: null
    },

    action: function() {
        if (this.getCallback()) {
            this.getCallback().call(this);
        } else if (this.getPlugin()) {
            this.getPlugin().save();
        } else {
            aNotify({
                text: tr('saveNotConfigured'),
                type: 'error'
            });
        }
    },

    init: function() {
        var result = Button.prototype.init.apply(this, arguments);

        // <strict>
        if (!this.getPlugin() &&
                !this.getCallback()) {
            handleError('Cannot find save plugin or callback for UI.');
        }
        // </strict>

        if (this.options.checkDirty !== false) {
            this.raptor.bind('dirty', this.dirty.bind(this));
            this.raptor.bind('cleaned', this.clean.bind(this));
            this.clean();
        }
        return result;
    },

    getPlugin: function() {
        if (!this.options.plugin) {
            return null;
        }
        return this.raptor.getPlugin(this.options.plugin);
    },

    getCallback: function() {
        return this.options.callback;
    },

    dirty: function() {
        aButtonEnable(this.button);
    },

    clean: function() {
        aButtonDisable(this.button);
    }
}));
