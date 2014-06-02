/**
 * @class Raptor
 */
var Raptor =  {

    globalDefaults: {},
    defaults: {},

    /** @property {boolean} enableHotkeys True to enable hotkeys */
    enableHotkeys: true,

    /** @property {Object} hotkeys Custom hotkeys */
    hotkeys: {},

    /**
     * Plugins added via Raptor.registerPlugin
     * @property {Object} plugins
     */
    plugins: {},

    /**
     * UI added via Raptor.registerUi
     * @property {Object} ui
     */
    ui: {},

    /**
     * Layouts added via Raptor.registerLayout
     * @property {Object} layouts
     */
    layouts: {},

    /**
     * Presets added via Raptor.registerPreset
     * @property {Object} presets
     */
    presets: {},

    hoverPanels: {},

    /**
     * @property {Raptor[]} instances
     */
    instances: [],

    /**
     * @returns {Raptor[]}
     */
    getInstances: function() {
        return this.instances;
    },

    eachInstance: function(callback) {
        for (var i = 0; i < this.instances.length; i++) {
            callback.call(this.instances[i], this.instances[i]);
        }
    },

    /*========================================================================*\
     * Templates
    \*========================================================================*/
    /**
     * @property {String} urlPrefix
     */
    urlPrefix: '/raptor/',

    /**
     * @param {String} name
     * @returns {String}
     */
    getTemplate: function(name, urlPrefix) {
        var template;
        if (!this.templates[name]) {
            // Parse the URL
            var url = urlPrefix || this.urlPrefix;
            var split = name.split('.');
            if (split.length === 1) {
                // URL is for and editor core template
                url += 'templates/' + split[0] + '.html';
            } else {
                // URL is for a plugin template
                url += 'plugins/' + split[0] + '/templates/' + split.splice(1).join('/') + '.html';
            }

            // Request the template
            $.ajax({
                url: url,
                type: 'GET',
                async: false,
                // <debug>
                cache: false,
                // </debug>
                // 15 seconds
                timeout: 15000,
                error: function() {
                    template = null;
                },
                success: function(data) {
                    template = data;
                }
            });
            // Cache the template
            this.templates[name] = template;
        } else {
            template = this.templates[name];
        }
        return template;
    },

    /*========================================================================*\
     * Helpers
    \*========================================================================*/

    /**
     * @returns {boolean}
     */
    isDirty: function() {
        var instances = this.getInstances();
        for (var i = 0; i < instances.length; i++) {
            if (instances[i].isDirty()) return true;
        }
        return false;
    },

    /**
     *
     */
    unloadWarning: function() {
        var instances = this.getInstances();
        for (var i = 0; i < instances.length; i++) {
            if (instances[i].isDirty() &&
                    instances[i].isEditing() &&
                    instances[i].options.unloadWarning) {
                return tr('navigateAway');
            }
        }
    },

    /*========================================================================*\
     * Plugins and UI
    \*========================================================================*/

    /**
     * Registers a new UI component, overriding any previous UI components registered with the same name.
     *
     * @param {String} name
     * @param {Object} ui
     */
    registerUi: function(ui) {
        // <strict>
        if (typeof ui !== 'object') {
            handleError(tr('errorUINotObject', {
                ui: ui
            }));
            return;
        } else if (typeof ui.name !== 'string') {
            handleError(tr('errorUINoName', {
                ui: ui
            }));
            return;
        } else if (this.ui[ui.name]) {
            handleError(tr('errorUIOverride', {
                name: ui.name
            }));
        }
        // </strict>
        this.ui[ui.name] = ui;
    },

    /**
     * Registers a new layout, overriding any previous layout registered with the same name.
     *
     * @param {String} name
     * @param {Object} layout
     */
    registerLayout: function(layout) {
        // <strict>
        if (typeof layout !== 'object') {
            handleError('Layout "' + layout + '" is invalid (must be an object)');
            return;
        } else if (typeof layout.name !== 'string') {
            handleError('Layout "'+ layout + '" is invalid (must have a name property)');
            return;
        } else if (this.layouts[layout.name]) {
            handleError('Layout "' + layout.name + '" has already been registered, and will be overwritten');
        }
        // </strict>

        this.layouts[layout.name] = layout;
    },

    registerPlugin: function(plugin) {
        // <strict>
        if (typeof plugin !== 'object') {
            handleError('Plugin "' + plugin + '" is invalid (must be an object)');
            return;
        } else if (typeof plugin.name !== 'string') {
            handleError('Plugin "'+ plugin + '" is invalid (must have a name property)');
            return;
        } else if (this.plugins[plugin.name]) {
            handleError('Plugin "' + plugin.name + '" has already been registered, and will be overwritten');
        }
        // </strict>

        this.plugins[plugin.name] = plugin;
    },

    registerPreset: function(preset, setDefault) {
        // <strict>
        if (typeof preset !== 'object') {
            handleError('Preset "' + preset + '" is invalid (must be an object)');
            return;
        } else if (typeof preset.name !== 'string') {
            handleError('Preset "'+ preset + '" is invalid (must have a name property)');
            return;
        } else if (this.presets[preset.name]) {
            handleError('Preset "' + preset.name + '" has already been registered, and will be overwritten');
        }
        // </strict>

        this.presets[preset.name] = preset;
        if (setDefault) {
            this.defaults = preset;
        }
    },

    /*========================================================================*\
     * Persistance
    \*========================================================================*/
    /**
     * @param {String} key
     * @param {mixed} value
     * @param {String} namespace
     */
    persist: function(key, value, namespace) {
        key = namespace ? namespace + '.' + key : key;
        if (value === undefined) {
            return persistGet(key);
        }
        return persistSet(key, value);
    }

};
