/**
 * @name $.editor.plugin.hotkeys
 * @extends $.editor.plugin
 * @class Plugin that captures hotkeys events on the element and shows a modal dialog containing different versions of what was hotkeysd.
 * Intended to prevent horrible 'hotkeys from word' catastophes.
 * @author Michael Robinson <michael@panmedia.co.nz>
 * @author David Neilsen <david@panmedia.co.nz>
 */
$.ui.editor.registerPlugin('hotkeys', /** @lends $.editor.plugin.hotkeys.prototype */ {

    ui: [],

    options: {
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
            },
            // Example of hotkey that uses a custom callback
            {
                callback: function() {
                    alert('Pressed!');
                },
                key: 'm'
            }
        ]
    },

    indexedActions: {},

    /**
     * @see $.ui.editor.defaultPlugin#init
     */
    init: function(editor, options) {

        editor.bind('enabled', this.bind, this);
    },

    /**
     * Bind hotkeys to present plugins.
     */
    bind: function() {
        // Add actions to char code indexed array, for easier retrieval within the keyup event
        var action;
        for (var actionsIndex = 0; actionsIndex < this.options.actions.length; actionsIndex++) {
            action = this.options.actions[actionsIndex];
            this.indexedActions[this.isNumeric(action.key) ? action.key : action.key.charCodeAt(0)] = action;

            if (typeof action.ui !== 'undefined') {
                var uiObject = this.editor.getUi(action.ui);
                uiObject.ui.button.attr('title', uiObject.ui.title + ' (' + action.label + ')');
            }
        }

        var ui = this;
        $(window).bind('keydown.hotkey', function(event) {

            // Translate event keycode to lower case if necessary & appropriate
            var pressedKey = event.which;
            if (pressedKey >= 65 && pressedKey <= 90) {
                var pressedKey = pressedKey + 32;
            }

            var action = ui.indexedActions[pressedKey];
            if (typeof action === 'undefined') {
                return true;
            }

            var keyOk = false;
            if (ui.isNumeric(action.key)) {
                keyOk = pressedKey === action.key;
            } else {
                keyOk = String.fromCharCode(pressedKey).toLowerCase() === action.key;
            }

            var metaOk = action.meta === false || (event.ctrlKey || event.metaKey);
            if(metaOk && keyOk) {
                var callback = $.isFunction(action.callback) ? action.callback : function() { ui.process(action.ui); };
                callback.call(ui, event);
                event.preventDefault();
            }
        });
    },

    /**
     * [process description]
     * @param  {[type]} action [description]
     * @param  {[type]} event  [description]
     * @return {[type]}        [description]
     */
    process: function(action, event) {
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