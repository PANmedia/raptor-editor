/**
 *
 * @author David Neilsen - david@panmedia.co.nz
 * @author Michael Robinson - michael@panmedia.co.nz
 * @version 0.1
 * @requires jQuery
 * @requires jQuery UI
 * @requires Rangy
 */

/**
 * @lends $.editor.prototype
 */
var RaptorWidget = {

    /**
     * Constructor
     */
    _init: function() {
        // Prevent double initialisation
        if (this.element.attr('data-raptor-initialised')) {
            // <debug>
            if (debugLevel >= MID) {
                debug('Raptor already initialised, attempted to reinitialise on: ', this.element);
            }
            // </debug>
            return;
        }
        this.element.attr('data-raptor-initialised', true);

        // Add the editor instance to the global list of instances
        if ($.inArray(this, Raptor.instances) === -1) {
            Raptor.instances.push(this);
        }

        var currentInstance = this;
        // <strict>
        // Check for nested editors
        Raptor.eachInstance(function(instance) {
            if (currentInstance != instance &&
                    currentInstance.element.closest(instance.element).length) {
                handleError('Nesting editors is unsupported', currentInstance.element, instance.element);
            }
        });
        // </strict>

        this.options = $.extend({}, Raptor.defaults, this.options);

        // Give the element a unique ID
        if (!this.element.attr('id')) {
            this.element.attr('id', elementUniqueId());
        }

        // Initialise properties
        this.ready = false;
        this.events = {};
        this.ui = {};
        this.plugins = {};
        this.templates = $.extend({}, Raptor.templates);
        this.target = this.element;
        this.layout = null;
        this.previewState = null;

        // True if editing is enabled
        this.enabled = false;

        // True if the layout has been loaded and displayed
        this.visible = false;

        // List of UI objects bound to the editor
        this.uiObjects = {};

        // List of hotkeys bound to the editor
        this.hotkeys = {};
        // If hotkeys are enabled, register any custom hotkeys provided by the user
        if (this.options.enableHotkeys) {
            this.registerHotkey(this.hotkeys);
        }

        // Bind default events
        for (var name in this.options.bind) {
            this.bind(name, this.options.bind[name]);
        }

        // Undo stack, redo pointer
        this.history = [];
        this.present = 0;
        this.historyEnabled = true;

        // Check for browser support
        if (!isSupported(this)) {
            // @todo If element isn't a textarea, replace it with one
            return;
        }

        // Store the original HTML
        this.setOriginalHtml(this.element.is(':input') ? this.element.val() : this.element.html());
        this.historyPush(this.getOriginalHtml());

        // Replace textareas/inputs with a div
        if (this.element.is(':input')) {
            this.replaceOriginal();
        }

        // Attach core events
        this.attach();

        // Load plugins
        this.loadPlugins();

        // Stores if the current state of the content is clean
        this.dirty = false;

        // Stores the previous state of the content
        this.previousContent = null;

        // Stores the previous selection
        this.previousSelection = null;

        // Set the initial locale
        var locale = this.persist('locale') || this.options.initialLocale;
        if (locale) {
            setLocale(locale);
        }

        // Fire the ready event
        this.ready = true;
        this.fire('ready');

        // Automatically enable the editor if autoEnable is true
        if (this.options.autoEnable) {
            $(function() {
                currentInstance.enableEditing();
                currentInstance.showLayout();
            });
        }
    },

    /*========================================================================*\
     * Core functions
    \*========================================================================*/

    /**
     * Attaches the editors internal events.
     */
    attach: function() {
        this.bind('change', this.historyPush);

        this.getElement().find('img').bind('click.' + this.widgetName, function(event){
            selectionSelectOuter(event.target);
        }.bind(this));

        this.target.bind('mouseup.' + this.widgetName, this.checkSelectionChange.bind(this));
        this.target.bind('keyup.' + this.widgetName, this.checkChange.bind(this));

        // Unload warning
        $(window).bind('beforeunload', Raptor.unloadWarning.bind(Raptor));

        // Trigger editor resize when window is resized
        var editor = this;
        $(window).resize(function(event) {
            editor.fire('resize');
        });
    },

    /**
     * Reinitialises the editor, unbinding all events, destroys all UI and plugins
     * then recreates them.
     */
    reinit: function() {
        if (!this.ready) {
            // If the edit is still initialising, wait until its ready
            var reinit;
            reinit = function() {
                // Prevent reinit getting called twice
                this.unbind('ready', reinit);
                this.reinit();
            };
            this.bind('ready', reinit);
            return;
        }
        // <debug>
        debug('Reinitialising editor', this.getElement());
        // </debug>

        // Store the state of the editor
        var enabled = this.enabled,
            visible = this.visible;

        // We are ready, so we can run reinit now
        this.destruct(true);
        this._init();

        // Restore the editor state
        if (enabled) {
            this.enableEditing();
        }

        if (visible) {
            this.showLayout();
        }
    },

    /**
     * Returns the current content editable element, which will be either the
     * orignal element, or the div the orignal element was replaced with.
     * @returns {jQuery} The current content editable element
     */
    getElement: function() {
        return this.target;
    },

    /**
     *
     */
    getOriginalElement: function() {
        return this.element;
    },

    /**
     * Replaces the original element with a content editable div. Typically used
     * to replace a textarea.
     */
    replaceOriginal: function() {
        if (!this.target.is(':input')) return;

        // Create the replacement div
        var target = $('<div/>')
            // Set the HTML of the div to the HTML of the original element, or if the original element was an input, use its value instead
            .html(this.element.val())
            // Insert the div before the original element
            .insertBefore(this.element)
            // Give the div a unique ID
            .attr('id', elementUniqueId())
            // Copy the original elements class(es) to the replacement div
            .addClass(this.element.attr('class'));

        var style = elementGetStyles(this.element);
        for (var i = 0; i < this.options.replaceStyle.length; i++) {
            target.css(this.options.replaceStyle[i], style[this.options.replaceStyle[i]]);
        }

        this.element.hide();
        this.bind('change', function() {
            if (this.getOriginalElement().is(':input')) {
                this.getOriginalElement().val(this.getHtml());
            } else {
                this.getOriginalElement().html(this.getHtml());
            }
        });

        this.target = target;
    },

    checkSelectionChange: function() {
        // Check if the caret has changed position
        var currentSelection = rangy.serializeSelection();
        if (this.previousSelection !== currentSelection) {
            this.fire('selectionChange');
        }
        this.previousSelection = currentSelection;
    },

    /**
     * Determine whether the editing element's content has been changed.
     */
    checkChange: function() {
        // Get the current content
        var currentHtml = this.getHtml();

        // Check if the dirty state has changed
        var wasDirty = this.dirty;

        // Check if the current content is different from the original content
        this.dirty = this.originalHtml !== currentHtml;

        // If the current content has changed since the last check, fire the change event
        if (this.previousHtml !== currentHtml) {
            this.previousHtml = currentHtml;
            this.fire('change');

            // If the content was changed to its original state, fire the cleaned event
            if (wasDirty !== this.dirty) {
                if (this.dirty) {
                    this.fire('dirty');
                } else {
                    this.fire('cleaned');
                }
            }
        }
    },

    change: function() {
        this.fire('change');
    },

    /*========================================================================*\
     * Destructor
    \*========================================================================*/

    /**
     * Hides the toolbar, disables editing, and fires the destroy event, and unbinds any events.
     * @public
     */
    destruct: function(reinitialising) {
        if (!reinitialising) {
            this.hideToolbar();
        }

        this.disableEditing();

        // Trigger destroy event, for plugins to remove them selves
        this.fire('destroy', false);

        // Remove all event bindings
        this.events = {};

        // Unbind all events
        this.getElement().unbind('.' + this.widgetName);

        if (this.getOriginalElement().is(':input')) {
            this.target.remove();
            this.target = null;
            this.element.show();
        }

        // Remove the layout
        if (this.layout) {
            this.layout.destruct();
        }
    },

    /**
     * Runs destruct, then calls the UI widget destroy function.
     * @see $.
     */
    destroy: function() {
        this.destruct();
        $.Widget.prototype.destroy.call(this);
    },

    /*========================================================================*\
     * Preview functions
    \*========================================================================*/

    actionPreview: function(action) {
        this.actionPreviewRestore();
        selectionConstrain(this.target);
        this.previewState = actionPreview(this.previewState, this.target, action);
    },

    actionPreviewRestore: function() {
        if (this.previewState) {
            this.target = actionPreviewRestore(this.previewState, this.target);
            this.previewState = null;
        }
    },

    actionApply: function(action) {
        this.actionPreviewRestore();
        selectionConstrain(this.target);
        actionApply(action, this.history);
        this.checkChange();
    },

    actionUndo: function() {

    },

    actionRedo: function() {

    },

    stateSave: function() {
        selectionConstrain(this.target);
        return stateSave(this.target);
    },

    stateRestore: function(state) {
        var restoredState = stateRestore(this.target, state),
            selection = rangy.getSelection();
        this.target = restoredState.element;
        selection.setRanges(restoredState.ranges);
        selection.refresh();
    },

    /*========================================================================*\
     * Persistance Functions
    \*========================================================================*/

    /**
     * @param {String} key
     * @param {mixed} [value]
     * @returns {mixed}
     */
    persist: function(key, value) {
        if (!this.options.persistence) return null;
        return Raptor.persist(key, value, this.options.namespace);
    },

    /*========================================================================*\
     * Other Functions
    \*========================================================================*/

    /**
     *
     */
    enableEditing: function() {
        this.loadLayout();

        if (!this.enabled) {
            this.fire('enabling');
            this.enabled = true;
            this.getElement().addClass(this.options.baseClass + '-editing');

            if (this.options.partialEdit) {
                this.getElement().find(this.options.partialEdit).attr('contenteditable', true);
            } else {
                this.getElement().attr('contenteditable', true);
            }

            try {
                document.execCommand('enableInlineTableEditing', false, false);
                document.execCommand('styleWithCSS', true, true);
            } catch (error) {
                // <strict>
                handleError(error);
                // </strict>
            }

            for (var name in this.plugins) {
                this.plugins[name].enable();
            }

            this.bindHotkeys();

            this.fire('enabled');
            this.fire('resize');
        }
    },

    /**
     *
     */
    disableEditing: function() {
        if (this.enabled) {
            this.enabled = false;
            this.getElement().attr('contenteditable', false)
                        .removeClass(this.options.baseClass + '-editing');
            rangy.getSelection().removeAllRanges();
            this.fire('disabled');
        }
    },

    cancelEditing: function() {
        this.fire('cancel');
        this.resetHtml();
        this.hideLayout();
        this.disableEditing();
        selectionDestroy();
    },

    /**
     *
     * @returns {boolean}
     */
    isEditing: function() {
        return this.enabled;
    },

    /**
     * @param {jQuerySelector|jQuery|Element} element
     * @returns {boolean}
     */
    isRoot: function(element) {
        return this.getElement()[0] === $(element)[0];
    },

    /**
     * @param {function} callback
     * @param {boolean} [callSelf]
     */
    unify: function(callback, callSelf) {
        if (callSelf !== false) callback(this);
        if (this.options.unify) {
            var currentInstance = this;
            Raptor.eachInstance(function(instance) {
                if (instance === currentInstance) {
                    return;
                }
                if (instance.options.unify) {
                    callback(instance);
                }
            });
        }
    },

    /*========================================================================*\
     * Messages
    \*========================================================================*/

    /**
     *
     */
    loadMessages: function() {
        this.messages = $(this.getTemplate('messages', this.options)).appendTo(this.getLayout().getElement());
    },

    /**
     * @param {String} type
     * @param {String[]} messages
     */
    showMessage: function(type, message, options) {
        options = $.extend({}, this.options.message, options);

        var messageObject;
        messageObject = {
            timer: null,
            editor: this,
            show: function() {
                this.element.slideDown();
                this.timer = window.setTimeout(function() {
                    this.timer = null;
                    messageObject.hide();
                }, options.delay, this);
            },
            hide: function() {
                if (this.timer) {
                    window.clearTimeout(this.timer);
                    this.timer = null;
                }
                this.element.stop().slideUp(function() {
                    if ($.isFunction(options.hide)) {
                        options.hide.call(this);
                    }
                    this.element.remove();
                }.bind(this));
            }
        };

        messageObject.element =
            $(this.getTemplate('message', $.extend(this.options, {
                type: type,
                message: message
            })))
            .hide()
            .appendTo(this.messages)
            .find('.ui-editor-message-close')
                .click(function() {
                    messageObject.hide();
                })
            .end();

        messageObject.show();

        return messageObject;
    },

    /**
     * @param {String[]} messages
     */
    showLoading: function(message, options) {
        return this.showMessage('clock', message, options);
    },

    /**
     * @param {String[]} messages
     */
    showInfo: function(message, options) {
        return this.showMessage('info', message, options);
    },

    /**
     * @param {String[]} messages
     */
    showError: function(message, options) {
        return this.showMessage('circle-close', message, options);
    },

    /**
     * @param {String[]} messages
     */
    showConfirm: function(message, options) {
        return this.showMessage('circle-check', message, options);
    },

    /**
     * @param {String[]} messages
     */
    showWarning: function(message, options) {
        return this.showMessage('alert', message, options);
    },

    /*========================================================================*\
     * Layout
    \*========================================================================*/
    getLayout: function() {
        return this.layout;
    },

    loadLayout: function() {
        if (!this.layout) {
            this.layout = $.extend({}, Raptor.layouts[this.options.layout.type]);
            this.layout.raptor = this;
            this.layout.options = $.extend({}, this.options, this.layout.options, this.options.layout.options);
            this.layout.init();
        }
    },

    /**
     * Show the layout for the current element.
     * @param  {Range} [range] a native range to select after the layout has been shown
     */
    showLayout: function(range) {
        this.loadLayout();

        if (!this.visible) {
            // <debug>
            if (debugLevel >= MID) debug('Displaying layout', this.getElement());
            // </debug>

            // If unify option is set, hide all other layouts first
            if (this.options.unify) {
                this.hideOtherLayouts(true);
            }

            // Store the visible state
            this.visible = true;

            this.layout.show();

            this.fire('resize');
            if (typeof this.getElement().attr('tabindex') === 'undefined') {
                this.getElement().attr('tabindex', -1);
            }

            if (range) {
                if (range.select) { // IE
                    range.select();
                } else { // Others
                    var selection = window.getSelection();
                    selection.removeAllRanges();
                    selection.addRange(range);
                }
            }

            var editor = this;
            $(function() {
                editor.fire('show');
                editor.getElement().focus();
                editor.fire('selectionChange');
            });
        }
    },

    /**
     *
     */
    hideLayout: function() {
        if (this.layout) {
            this.visible = false;
            this.layout.hide();
            this.fire('hide');
            this.fire('resize');
        }
    },

    /**
     * @param {boolean} [instant]
     */
    hideOtherLayouts: function(instant) {
        this.unify(function(editor) {
            editor.hideLayout(instant);
        }, false);
    },

    /**
     *
     * @returns {boolean}
     */
    isVisible: function() {
        return this.visible;
    },

    /*========================================================================*\
     * Template functions
    \*========================================================================*/

    /**
     * @param {String} name
     * @param {Object} variables
     */
    getTemplate: function(name, variables) {
        if (!this.templates[name]) {
            this.templates[name] = templateGet(name, this.options.urlPrefix);
        }
        return templateConvertTokens(this.templates[name], variables);
    },

    /*========================================================================*\
     * History functions
    \*========================================================================*/

    /**
     *
     */
    historyPush: function() {
        if (!this.historyEnabled) return;
        var html = this.getHtml();
        if (html !== this.historyPeek()) {
            // Reset the future on change
            if (this.present !== this.history.length - 1) {
                this.history = this.history.splice(0, this.present + 1);
            }

            // Add new HTML to the history
            this.history.push(this.getHtml());

            // Mark the persent as the end of the history
            this.present = this.history.length - 1;

            this.fire('historychange');
        }
    },

    /**
     * @returns {String|null}
     */
    historyPeek: function() {
        if (!this.history.length) return null;
        return this.history[this.present];
    },

    /**
     *
     */
    historyBack: function() {
        if (this.present > 0) {
            this.present--;
            this.setHtml(this.history[this.present]);
            this.historyEnabled = false;
            this.change();
            this.historyEnabled = true;
            this.fire('historychange');
        }
    },

    /**
     *
     */
    historyForward: function() {
        if (this.present < this.history.length - 1) {
            this.present++;
            this.setHtml(this.history[this.present]);
            this.historyEnabled = false;
            this.change();
            this.historyEnabled = true;
            this.fire('historychange');
        }
    },

    /*========================================================================*\
     * Hotkeys
    \*========================================================================*/

    /**
     * @param {Array|String} mixed The hotkey name or an array of hotkeys
     * @param {Object} The hotkey object or null
     */
    registerHotkey: function(mixed, actionData, context) {
        // Allow array objects, and single plugins
        if (typeof(mixed) === 'string') {

            // <strict>
            if (this.hotkeys[mixed]) {
                handleError(_('Hotkey "{{hotkey}}" has already been registered, and will be overwritten', {hotkey: mixed}));
            }
            // </strict>

            this.hotkeys[mixed] = $.extend({}, {
                context: context,
                restoreSelection: true
            }, actionData);

        } else {
            for (var name in mixed) {
                this.registerHotkey(name, mixed[name], context);
            }
        }
    },

    bindHotkeys: function() {
        for (var keyCombination in this.hotkeys) {
            var editor = this,
                force = this.hotkeys[keyCombination].force || false;

            if (!this.options.enableHotkeys && !force) {
                continue;
            }

            this.getElement().bind('keydown.' + this.widgetName, keyCombination, function(event) {
                selectionSave();
                var object = editor.hotkeys[event.data];
                // Returning true from action will allow event bubbling
                if (object.action.call(object.context) !== true) {
                    event.preventDefault();
                }
                if (object.restoreSelection) {
                    selectionRestore();
                }
                editor.checkChange();
            });
        }
    },

    /*========================================================================*\
     * Buttons
    \*========================================================================*/

    isUiEnabled: function(ui) {
        // Check if we are not automatically enabling UI, and if not, check if the UI was manually enabled
        if (this.options.enableUi === false &&
                typeof this.options.ui[ui] === 'undefined' ||
                this.options.ui[ui] === false) {
            // <debug>
            if (debugLevel >= MID) {
                debug('UI with name ' + ui + ' has been disabled ' + (
                    this.options.enableUi === false ? 'by default' : 'manually'
                ) + $.inArray(ui, this.options.ui));
            }
            // </debug>
            return false;
        }

        // Check if we have explicitly disabled UI
        if ($.inArray(ui, this.options.disabledUi) !== -1) {
            return false;
        }

        return true;
    },

    /**
     * @param  {String} ui Name of the UI object to be returned.
     * @return {Object|null} UI object referenced by the given name.
     */
    getUi: function(ui) {
        return this.uiObjects[ui];
    },

    /*========================================================================*\
     * Plugins
    \*========================================================================*/
    /**
     * @param {String} name
     * @return {Object|undefined} plugin
     */
    getPlugin: function(name) {
        return this.plugins[name];
    },

    /**
     *
     */
    loadPlugins: function() {
        var editor = this;

        if (!this.options.plugins) {
            this.options.plugins = {};
        }

        for (var name in Raptor.plugins) {
            // Check if we are not automaticly enabling plugins, and if not, check if the plugin was manually enabled
            if (this.options.enablePlugins === false &&
                    typeof this.options.plugins[name] === 'undefined' ||
                    this.options.plugins[name] === false) {
                // <debug>
                if (debugLevel >= MID) {
                    debug('Not loading plugin ' + name);
                }
                // </debug>
                continue;
            }

            // Check if we have explicitly disabled the plugin
            if ($.inArray(name, this.options.disabledPlugins) !== -1) continue;

            // Clone the plugin object (which should be extended from the defaultPlugin object)
            var pluginObject = $.extend({}, Raptor.plugins[name]);

            var baseClass = name.replace(/([A-Z])/g, function(match) {
                return '-' + match.toLowerCase();
            });

            var options = $.extend({}, editor.options, {
                baseClass: editor.options.baseClass + '-' + baseClass
            }, pluginObject.options, editor.options.plugins[name]);

            pluginObject.raptor = this;
            pluginObject.options = options;
            pluginObject.init();

            if (pluginObject.hotkeys) {
                this.registerHotkey(pluginObject.hotkeys, null, pluginObject);
            }

            editor.plugins[name] = pluginObject;
        }
    },

    /*========================================================================*\
     * Content accessors
    \*========================================================================*/

    /**
     * @returns {boolean}
     */
    isDirty: function() {
        return this.dirty;
    },

    /**
     * @returns {String}
     */
    getHtml: function() {
        return this.target.html();
    },

    getCleanHtml: function() {
        this.fire('clean');
        var content = this.getElement().html();
        this.fire('restore');

        // Remove saved rangy ranges
        content = $('<div/>').html(content);
        content.find('.rangySelectionBoundary').remove();
        content = content.html();

        return content;
    },

    /**
     * @param {String} html
     */
    setHtml: function(html) {
        this.getElement().html(html);
        this.fire('html');
        this.change();
    },

    /**
     *
     */
    resetHtml: function() {
        this.setHtml(this.getOriginalHtml());
        this.fire('cleaned');
    },

    /**
     * @returns {String}
     */
    getOriginalHtml: function() {
        return this.originalHtml;
    },

    /**
     *
     */
    saved: function() {
        this.setOriginalHtml(this.getHtml());
        this.dirty = false;
        this.fire('saved');
        this.fire('cleaned');
    },

    /**
     * @param {String} html
     */
    setOriginalHtml: function(html) {
        this.originalHtml = html;
    },

    /*========================================================================*\
     * Event handling
    \*========================================================================*/
    /**
     * @param {String} name
     * @param {function} callback
     * @param {Object} [context]
     */
    bind: function(name, callback, context) {
        // <strict>
        if (!$.isFunction(callback)) {
            handleError('Must bind a valid callback, ' + name + ' was a ' + typeof callback);
        }
        // </strict>
        var names = name.split(/,\s*/);
        for (var i = 0, l = names.length; i < l; i++) {
            if (!this.events[names[i]]) {
                this.events[names[i]] = [];
            }
            this.events[names[i]].push({
                context: context,
                callback: callback
            });
        }
    },

    /**
     * @param {String} name
     * @param {function} callback
     * @param {Object} [context]
     */
    unbind: function(name, callback, context) {
        for (var i = 0, l = this.events[name].length; i < l; i++) {
            if (this.events[name][i] &&
                this.events[name][i].callback === callback &&
                this.events[name][i].context === context) {
                this.events[name].splice(i, 1);
            }
        }
    },

    /**
     * @param {String} name
     * @param {boolean} [global]
     * @param {boolean} [sub]
     */
    fire: function(name, global, sub) {
        // Fire before sub-event
        if (!sub) {
            this.fire('before:' + name, global, true);
        }

        // <debug>
        if (debugLevel === MAX) {
            if (!name.match(/^before:/) && !name.match(/^after:/)) {
                debug('Firing event: ' + name);
            }
        } else if (debugLevel > MAX) {
            debug('Firing event: ' + name, this.getElement());
        }
        // </debug>

        if (this.events[name]) {
            for (var i = 0, l = this.events[name].length; i < l; i++) {
                var event = this.events[name][i];
                if (typeof event.callback !== 'undefined') {
                    event.callback.call(event.context || this);
                }
            }
        }

        // Also trigger the global editor event, unless specified not to
        if (global !== false) {
            Raptor.fire(name);
        }

        // Fire after sub-event
        if (!sub) {
            this.fire('after:' + name, global, true);
        }
    }
};

$.widget('ui.raptor', RaptorWidget);
