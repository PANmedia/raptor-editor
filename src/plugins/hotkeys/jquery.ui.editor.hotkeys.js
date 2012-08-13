/**
 * @name $.editor.plugin.hotkeys
 * @extends $.editor.plugin
 * @see $.editor.plugin.hotkeys.options
 * @class Plugin that allows users to edit content using hotkeys. Extensible with custom hotkey actions.
 * @author Michael Robinson <michael@panmedia.co.nz>
 * @author David Neilsen <david@panmedia.co.nz>
 */
$.ui.editor.registerPlugin('hotkeys', /** @lends $.editor.plugin.hotkeys.prototype */ {

    /**
     * @name $.editor.plugin.hotkeys.options
     * @type {Object}
     * @namespace Default options
     * @see $.editor.plugin.hotkeys
     */
    options: /** @lends $.editor.plugin.hotkeys.options */  {
        /**
         * Array of action objects.
         * For a hotkey triggering a UI action:
         *
         * <pre>{
         *     ui: 'textBold', // Name of UI element to be triggered by this hotkey
         *     key: 'b', // Key triggering this action
         *     label: 'ctrl + b', // Label to be appended to the UI element's title attribute
         *     meta: true // True if this hotkey should be combined with CTRL / Command. Default true.
         * }</pre>
         *
         * For a hotkey triggering a custom action:
         *
         * <pre>{
         *     callback: function() { alert('triggered!'); },
         *     key: 't',
         *     label: 'ctrl + t'
         * }</pre>
         *
         * @type {Array}
         */
        actions: [
            {
                ui: 'textBold',
                key: 'b',
                label: _('ctrl + b')
            },
            {
                ui: 'textItalic',
                key: 'i',
                label: _('ctrl + i')
            },
            {
                ui: 'textUnderline',
                key: 'u',
                label: _('ctrl + u')
            },
            {
                ui: 'undo',
                key: 'z',
                label: _('ctrl + z')
            },
            {
                ui: 'redo',
                key: 'y',
                label: _('ctrl + y')
            },
            {
                ui: 'cancel',
                meta: false,
                key: 27, // Escape key code
                label: _('esc')
            },
            {
                ui: 'save',
                key: 's',
                label: _('ctrl + s')
            }
        ]
    },

    /**
     * Populated with actions indexed by character codes, to make retrieving an action from a given character code more straight-forward.
     * @type {Object}
     */
    indexedActions: {},

    /**
     * Keyup event signature to be bound to window.
     * @type {String}
     */
    keyUpEventSignature: null,

    /**
     * Keydown event signature to be bound to window.
     * @type {String}
     */
    keyDownEventSignature: null,

    /**
     * @see $.ui.editor.defaultPlugin#init
     */
    init: function(editor, options) {
        this.keyUpEventSignature = 'keyup.' + this.options.baseClass;
        this.keyDownEventSignature = 'keydown.' + this.options.baseClass;
        editor.bind('enabled', this.enabled, this);
        editor.bind('disabled', this.disabled, this);
    },

    disabled: function() {
        $(window).unbind(this.keyUpEventSignature);
        $(window).unbind(this.keyDownEventSignature);
        this.indexedActions = {};
    },

    /**
     * Prepare actions & bind key events.
     */
    enabled: function() {
        // Add actions to char code indexed array, for easier retrieval within the keyup event
        var action;
        for (var actionsIndex = 0; actionsIndex < this.options.actions.length; actionsIndex++) {
            action = this.options.actions[actionsIndex];
            this.indexedActions[this.isNumeric(action.key) ? action.key : action.key.charCodeAt(0)] = action;
            if (typeof action.ui !== 'undefined') {
                var uiObject = this.editor.getUi(action.ui);
                // Only trigger if the UI object is enabled
                if (typeof uiObject !== 'undefined') {
                    uiObject.ui.button.attr('title', uiObject.ui.title + ' (' + action.label + ')');
                }
            }
        }

        var ui = this;

        $(window).bind(this.keyDownEventSignature, function(event) {
            var action = ui.actionForKeyCombination.call(ui, event);
            if(action) {
                event.preventDefault();
            }
        });

        $(window).bind(this.keyUpEventSignature, function(event) {
            var action = ui.actionForKeyCombination.call(ui, event);
            if(action) {
                var callback = $.isFunction(action.callback) ? action.callback : function() { ui.triggerUiAction(action.ui); };
                callback.call(ui, event);
                event.preventDefault();
            }
        });
    },

    /**
     * Determine whether the current key combination is valid & return action if so.
     * @param  {Event} event The event object.
     * @return {Object|Boolean} The action for the key combination or false if the combination is not valid.
     */
    actionForKeyCombination: function(event) {

        // Translate event keycode to lower case if necessary & appropriate
        var pressedKey = event.which;
        if (pressedKey >= 65 && pressedKey <= 90) {
            var pressedKey = pressedKey + 32;
        }

        var action = this.indexedActions[pressedKey];
        if (typeof action === 'undefined') {
            return false;
        }

        var metaOk = action.meta === false || (event.ctrlKey || event.metaKey);
        if (!metaOk) {
            // Meta key is required but was not pressed
            return false;
        }

        var keyOk = false;
        if (this.isNumeric(action.key)) {
            keyOk = pressedKey === action.key;
        } else {
            keyOk = String.fromCharCode(pressedKey).toLowerCase() === action.key;
        }

        return (keyOk) ? action : false;
    },

    /**
     * Trigger the click action for the UI element identified by action.
     * @param  {String} action Name of a UI element.
     * @param  {Event} event The event triggering this function call.
     */
    triggerUiAction: function(action, event) {
        var uiObject = this.editor.getUi(action);
        if (typeof uiObject === 'undefined') {
            return;
        }
        uiObject.ui.click.apply(uiObject, event);
    },

    /**
     * @param  {mixed}  value Value to be tested
     * @return {Boolean} True if the value is numeric
     */
    isNumeric: function(value) {
        return !isNaN(value - 0);
    }
});