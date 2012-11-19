var raptor = /** @lends $.ui.editor */ {

    // <expose>
    elementRemoveComments: elementRemoveComments,
    elementRemoveAttributes: elementRemoveAttributes,
    elementBringToTop: elementBringToTop,
    elementOuterHtml: elementOuterHtml,
    elementOuterText: elementOuterText,
    elementIsBlock: elementIsBlock,
    elementDefaultDisplay: elementDefaultDisplay,
    elementIsValid: elementIsValid,
    elementGetStyles: elementGetStyles,
    elementWrapInner: elementWrapInner,
    elementToggleStyle: elementToggleStyle,
    elementSwapStyles: elementSwapStyles,
    fragmentToHtml: fragmentToHtml,
    fragmentInsertBefore: fragmentInsertBefore,
    rangeExpandToParent: rangeExpandToParent,
    rangeGetCommonAncestor: rangeGetCommonAncestor,
    rangeIsEmpty: rangeIsEmpty,
    selectionSave: selectionSave,
    selectionRestore: selectionRestore,
    selectionDestroy: selectionDestroy,
    selectionEachRange: selectionEachRange,
    selectionReplace: selectionReplace,
    selectionSelectInner: selectionSelectInner,
    selectionSelectOuter: selectionSelectOuter,
    selectionSelectEdge: selectionSelectEdge,
    selectionSelectEnd: selectionSelectEnd,
    selectionSelectStart: selectionSelectStart,
    selectionGetHtml: selectionGetHtml,
    selectionGetElements: selectionGetElements,
    selectionToggleWrapper: selectionToggleWrapper,
    selectionExists: selectionExists,
    selectionReplaceSplittingSelectedElement: selectionReplaceSplittingSelectedElement,
    selectionReplaceWithinValidTags: selectionReplaceWithinValidTags,
    selectionToggleBlockStyle: selectionToggleBlockStyle,
    stringStripTags: stringStripTags,
    typeIsNumber: typeIsNumber,
    // </expose>

    /**
     * Default options for Raptor.
     *
     * @namespace Default options for Raptor.
     */
    defaults: {
        /**
         * @type Object Default layout to use.
         */
        layout: null,

        /**
         * Plugins option overrides.
         *
         * @type Object
         */
        plugins: {},

        /**
         * UI option overrides.
         *
         * @type Object
         */
        ui: {},

        /**
         * Default events to bind.
         *
         * @type Object
         */
        bind: {},

        /**
         * @deprecated
         * @type {Object}
         */
        domTools: domTools,

        /**
         * Namespace used for persistence to prevent conflicting with other stored values.
         *
         * @type String
         */
        namespace: null,

        /**
         * Switch to indicated that some events should be automatically applied to all editors that are 'unified'
         * @type boolean
         */
        unify: true,

        /**
         * Switch to indicate weather or not to stored persistent values, if set to false the persist function will always return null
         * @type boolean
         */
        persistence: true,

        /**
         * The name to store persistent values under
         * @type String
         */
        persistenceName: 'uiEditor',

        /**
         * Switch to indicate weather or not to a warning should pop up when the user navigates aways from the page and there are unsaved changes
         * @type boolean
         */
        unloadWarning: true,

        /**
         * Switch to automatically enabled editing on the element
         * @type boolean
         */
        autoEnable: false,

        /**
         * Only enable editing on certian parts of the element
         * @type {jQuerySelector}
         */
        partialEdit: false,

        /**
         * Switch to specify if the editor should automatically enable all plugins, if set to false, only the plugins specified in the 'plugins' option object will be enabled
         * @type boolean
         */
        enablePlugins: true,

        /**
         * An array of explicitly disabled plugins
         * @type String[]
         */
        disabledPlugins: [],

        /**
         * And array of arrays denoting the order and grouping of UI elements in the toolbar
         * @type String[]
         */
        uiOrder: null,

        /**
         * Switch to specify if the editor should automatically enable all UI, if set to false, only the UI specified in the {@link $.ui.editor.defaults.ui} option object will be enabled
         * @type boolean
         */
        enableUi: true,

        /**
         * An array of explicitly disabled UI elements
         * @type String[]
         */
        disabledUi: [],

        /**
         * Default message options
         * @type Object
         */
        message: {
            delay: 5000
        },

        /**
         * Switch to indicate that the element the editor is being applied to should be replaced with a div (useful for textareas), the value/html of the replaced element will be automatically updated when the editor element is changed
         * @type boolean
         */
        replace: false,

        /**
         * A list of styles that will be copied from the replaced element and applied to the editor replacement element
         * @type String[]
         */
        replaceStyle: [
            'display', 'position', 'float', 'width',
            'padding-left', 'padding-right', 'padding-top', 'padding-bottom',
            'margin-left', 'margin-right', 'margin-top', 'margin-bottom'
        ],

        /**
         *
         * @type String
         */
        baseClass: 'ui-editor',

        /**
         * CSS class prefix that is prepended to inserted elements classes. E.g. "cms-bold"
         * @type String
         */
        cssPrefix: 'cms-',

        draggable: true
    },

    /** @type {Boolean} True to enable hotkeys */
    enableHotkeys: true,

    /** @type {Object} Custom hotkeys */
    hotkeys: {},

    /**
     * Events added via $.ui.editor.bind
     * @property {Object} events
     */
    events: {},

    /**
     * Plugins added via $.ui.editor.registerPlugin
     * @property {Object} plugins
     */
    plugins: {},

    /**
     * UI added via $.ui.editor.registerUi
     * @property {Object} ui
     */
    ui: {},

    /**
     * Layouts added via $.ui.editor.registerLayout
     * @property {Object} layouts
     */
    layouts: {},

    /**
     * Presets added via $.ui.editor.registerPreset
     * @property {Object} presets
     */
    presets: {},

    /**
     * @property {$.ui.editor[]} instances
     */
    instances: [],

    /**
     * @returns {$.ui.editor[]}
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
     * @property {Object} templates
     */
    templates: { /* <templates/> */ },

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
     * @returns {String}
     */
    getUniqueId: function() {
        var id = $.ui.editor.defaults.baseClass + '-uid-' + new Date().getTime() + '-' + Math.floor(Math.random() * 100000);
        while ($('#' + id).length) {
            id = $.ui.editor.defaults.baseClass + '-uid-' + new Date().getTime() + '-' + Math.floor(Math.random() * 100000);
        }
        return id;
    },

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
                return _('\nThere are unsaved changes on this page. \nIf you navigate away from this page you will lose your unsaved changes');
            }
        }
    },

    /*========================================================================*\
     * Plugins as UI
    \*========================================================================*/

    /**
     * @name $.ui.editor.defaultUi
     * @class The default UI component
     * @property {Object} defaultUi
     */
    defaultUi: /** @lends $.ui.editor.defaultUi.prototype */ {
        ui: null,

        /**
         * The {@link $.ui.editor} instance
         * @type {Object}
         */
        editor: null,

        /**
         * @type {Object}
         */
        options: null,

        /**
         * Initialise & return an instance of this UI component
         * @param  {$.editor} editor  The editor instance
         * @param  {$.ui.editor.defaults} options The default editor options extended with any overrides set at initialisation
         * @return {Object} An instance of the ui component
         */
        init: function(editor, options) {},

        /**
         * @param  {String} key   The key
         * @param  {[String|Object|int|float]} value A value to be stored
         * @return {String|Object|int|float} The stored value
         */
        persist: function(key, value) {
            return this.editor.persist(key, value);
        },

        /**
         * @param  {String}   name
         * @param  {Function} callback
         * @param  {String}   context
         */
        bind: function(name, callback, context) {
            this.editor.bind(name, callback, context || this);
        },

        /**
         * @param  {String}   name
         * @param  {Function} callback
         * @param  {Object}   context
         */
        unbind: function(name, callback, context) {
            this.editor.unbind(name, callback, context || this);
        }
    },

    /**
     * Registers a new UI component, overriding any previous UI components registered with the same name.
     *
     * @param {String} name
     * @param {Object} ui
     */
    registerUi: function(name, ui) {
        // <strict>
        if (this.ui[name]) {
            // handleError(_('UI "{{name}}" has already been registered, and will be overwritten', {name: name}));
        }
        // </strict>
        this.ui[name] = $.extend({}, this.defaultUi, ui);
    },

    /**
     * Registers a new layout, overriding any previous layout registered with the same name.
     *
     * @param {String} name
     * @param {Object} layout
     */
    registerLayout: function(name, layout) {
        // <strict>
        if (this.ui[name]) {
            handleError(_('Layout "{{name}}" has already been registered, and will be overwritten', {name: name}));
        }
        // </strict>
        this.layouts[name] = layout;
    },

    /**
     * Registers a new preset, overriding any previous preset registered with the same name.
     *
     * @param {String} name
     * @param {Object} preset
     */
    registerPreset: function(name, preset) {
        // <strict>
        if (this.ui[name]) {
            handleError(_('Preset "{{name}}" has already been registered, and will be overwritten', {name: name}));
        }
        // </strict>
        this.presets[name] = preset;
    },

    /**
     * @name $.ui.editor.defaultPlugin
     * @class The default plugin
     * @property {Object} defaultPlugin
     */
    defaultPlugin: /** @lends $.ui.editor.defaultPlugin.prototype */ {

        /**
         * The {@link $.ui.editor} instance
         * @type {Object}
         */
        editor: null,

        /**
         * @type {Object}
         */
        options: null,

        /**
         * Initialise & return an instance of this plugin
         * @param  {$.editor} editor  The editor instance
         * @param  {$.ui.editor.defaults} options The default editor options extended with any overrides set at initialisation
         * @return {Object} An instance of the ui component
         */
        init: function(editor, options) {},

        /**
         * @param  {String} key   The key
         * @param  {[String|Object|int|float]} value A value to be stored
         * @return {String|Object|int|float} The stored value
         */
        persist: function(key, value) {
            return this.editor.persist(key, value);
        },

        /**
         * @param  {String}   name
         * @param  {Function} callback
         * @param  {String}   context
         */
        bind: function(name, callback, context) {
            this.editor.bind(name, callback, context || this);
        },

        /**
         * @param  {String}   name
         * @param  {Function} callback
         * @param  {Object}   context
         */
        unbind: function(name, callback, context) {
            this.editor.unbind(name, callback, context || this);
        }
    },

    /**
     *
     * @param {Object|String} mixed
     * @param {Object} [plugin]
     */
    registerPlugin: function(mixed, plugin) {
        // Allow array objects, and single plugins
        if (typeof(mixed) === 'string') {
            // <strict>
            if (this.plugins[mixed]) {
                handleError(_('Plugin "{{pluginName}}" has already been registered, and will be overwritten', {pluginName: mixed}));
            }
            // </strict>

            this.plugins[mixed] = $.extend({}, this.defaultPlugin, plugin);
        } else {
            for (var name in mixed) {
                this.registerPlugin(name, mixed[name]);
            }
        }
    },

    /*========================================================================*\
     * Events
    \*========================================================================*/

    /**
     * @param {String} name
     * @param {function} callback
     */
    bind: function(name, callback) {
        if (!this.events[name]) this.events[name] = [];
        this.events[name].push(callback);
    },

    /**
     * @param {function} callback
     */
    unbind: function(callback) {
        $.each(this.events, function(name) {
            for (var i = 0; i < this.length; i++) {
                if (this[i] === callback) {
                    this.events[name].splice(i,1);
                }
            }
        });
    },

    /**
     * @param {String} name
     */
    fire: function(name) {
        // <debug>
        if (debugLevel > MAX) {
            debug('Firing global/static event: ' + name);
        }
        // </debug>
        if (!this.events[name]) return;
        for (var i = 0, l = this.events[name].length; i < l; i++) {
            this.events[name][i].call(this);
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
        if (localStorage) {
            var storage;
            if (localStorage.uiWidgetEditor) {
                storage = JSON.parse(localStorage.uiWidgetEditor);
            } else {
                storage = {};
            }
            if (value === undefined) return storage[key];
            storage[key] = value;
            localStorage.uiWidgetEditor = JSON.stringify(storage);
        }

        return value;
    }

};
