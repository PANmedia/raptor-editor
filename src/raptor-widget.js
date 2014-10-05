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
 * Set to true when raptor is reloading the page after it has disabled editing.
 *
 * @type Boolean
 */
var disabledReloading = false;

/**
 * @class
 */
var RaptorWidget = {

    /**
     * @constructs RaptorWidget
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

        // Set the initial locale
        var locale = this.persist('locale') || this.options.initialLocale;
        if (locale) {
            currentLocale = locale;
        }

        var options = this.options;
        if (this.options.preset) {
            this.options = $.extend(true, {}, Raptor.globalDefaults, Raptor.presets[this.options.preset], this.options);
        } else {
            this.options = $.extend(true, {}, Raptor.globalDefaults, Raptor.defaults, this.options);
        }
        if (options.layouts && options.layouts.toolbar && options.layouts.toolbar.uiOrder) {
            this.options.layouts.toolbar.uiOrder = options.layouts.toolbar.uiOrder;
        }

        // Give the element a unique ID
        if (!this.element.attr('id')) {
            this.element.attr('id', elementUniqueId());
        }

        // Initialise properties
        this.ready = false;
        this.events = {};
        this.plugins = {};
        this.layouts = {};
        this.templates = $.extend({}, Raptor.templates);
        this.target = this.element;
        this.layout = null;
        this.previewState = null;
        this.pausedState = null;
        this.pausedScrollX = null;
        this.pausedScrollY = null;

        // True if editing is enabled
        this.enabled = false;

        // True if editing is enabled at least once
        this.initialised = false;

        // List of UI objects bound to the editor
        this.uiObjects = {};

        // List of hotkeys bound to the editor
        this.hotkeys = {};
        this.hotkeysSuspended = false;

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
        if (!isSupported()) {
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

        // Load plugins
        this.loadPlugins();

        // Stores if the current state of the content is clean
        this.dirty = false;

        // Stores the previous state of the content
        this.previousContent = null;

        // Stores the previous selection
        this.previousSelection = null;

        this.getElement().addClass('raptor-editable-block');

        this.loadLayouts();

        // Fire the ready event
        this.ready = true;
        this.fire('ready');

        // Automatically enable the editor if autoEnable is true
        if (this.options.autoEnable) {
            $(function() {
                currentInstance.enableEditing();
            });
        }
    },

    /*========================================================================*\
     * Core functions
    \*========================================================================*/

    /**
     * Attaches the editor's internal events.
     *
     * @fires RaptorWidget#resize
     */
    attach: function() {
        this.bind('change', this.historyPush);

        this.getElement().on('click.raptor', 'img', function(event) {
            selectionSelectOuter(event.target);
            this.checkSelectionChange();
        }.bind(this));
        this.getElement().on('focus.raptor', this.showLayout.bind(this));
        this.target.on('mouseup.raptor', this.checkSelectionChange.bind(this));
        this.target.on('input.raptor keyup.raptor mouseup.raptor', this.checkChangeDelayed.bind(this));

        // Unload warning
        $(window).bind('beforeunload', Raptor.unloadWarning.bind(Raptor));

        // Trigger editor resize when window is resized
        var editor = this;
        $(window).resize(function(event) {
            editor.fire('resize');
        });
    },

    /**
     * Detaches the editor's internal events.
     */
    detach: function() {
        this.unbind('change');
        this.getElement().off('click.raptor', 'img');
        this.getElement().off('focus.raptor');
        this.getElement().blur();

        this.target.off('mouseup.raptor');
        this.target.off('keyup.raptor');
    },

    /**
     * Reinitialises the editor, unbinding all events, destroys all UI and plugins
     * then recreates them.
     */
    localeChange: function() {
        if (!this.ready) {
            // If the edit is still initialising, wait until its ready
            var localeChange;
            localeChange = function() {
                // Prevent reinit getting called twice
                this.unbind('ready', localeChange);
                this.localeChange();
            };
            this.bind('ready', localeChange);
            return;
        }

        this.actionPreviewRestore();
        var visibleLayouts = [];
        for (var name in this.layouts) {
            if (this.layouts[name].isVisible()) {
                visibleLayouts.push(name);
            }
        }
        this.layoutsDestruct();
        this.events = {};
        this.plugins = {};
        this.uiObjects = {};
        this.hotkeys = {};
        this.loadPlugins();
        this.loadLayouts();
        for (var i = 0; i < visibleLayouts.length; i++) {
            this.layouts[visibleLayouts[i]].show();
        }
        this.checkSelectionChange();
    },

    /**
     * Restore focus to the element being edited.
     */
    restoreFocus: function() {
        this.getElement().focus();
    },

    /**
     * Returns the current content editable element, which will be either the
     * orignal element, or the div the orignal element was replaced with.
     * @returns {jQuery} The current content editable element
     */
    getElement: function() {
        return this.target;
    },

    getNode: function() {
        return this.target[0];
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
            .addClass(this.element.attr('class'))
            // Add custom classes
            .addClass(this.options.classes);

        var style = elementGetStyles(this.element);
        for (var i = 0; i < this.options.replaceStyle.length; i++) {
            target.css(this.options.replaceStyle[i], style[this.options.replaceStyle[i]]);
        }

        this.element.hide();
        this.bind('change', function() {
            if (this.getOriginalElement().is(':input')) {
                this.getOriginalElement().val(this.getHtml()).trigger('input');
            } else {
                this.getOriginalElement().html(this.getHtml());
            }
        });

        this.target = target;
    },

    checkSelectionChange: function() {
        // Check if the caret has changed position
        var currentSelection = rangy.serializeSelection(null, false);
        if (this.previousSelection !== currentSelection) {
            this.fire('selectionChange');
        }
        this.previousSelection = currentSelection;
    },

    checkChangeTimer: null,
    checkChangeCount: 0,
    checkChangeDelayed: function() {
        if (this.checkChangeTimer !== null) {
            clearTimeout(this.checkChangeTimer);
            this.checkChangeTimer = null;
        }
        if (this.checkChangeCount++ < 10) {
            this.checkChangeTimer = setTimeout(this.checkChange.bind(this), 200);
        } else {
            this.checkChange();
        }
    },

    /**
     * Determine whether the editing element's content has been changed.
     */
    checkChange: function() {
        this.checkChangeCount = 0;

        // Get the current content
        var currentHtml = this.getHtml();

        // Check if the dirty state has changed
        var wasDirty = this.dirty;

        // Check if the current content is different from the original content
        this.dirty = this.originalHtml !== currentHtml;

        // If the current content has changed since the last check, fire the change event
        if (this.previousHtml !== currentHtml) {
            this.previousHtml = currentHtml;
            this.fire('change', [currentHtml]);

            // If the content was changed to its original state, fire the cleaned event
            if (wasDirty !== this.dirty) {
                if (this.dirty) {
                    this.fire('dirty');
                } else {
                    this.fire('cleaned');
                }
            }

            this.checkSelectionChange();
        }
    },

    change: function() {
        this.fire('change', [
            this.getHtml()
        ]);
    },

    /*========================================================================*\
     * Destructor
    \*========================================================================*/

    /**
     * Hides the toolbar, disables editing, and fires the destroy event, and unbinds any events.
     * @public
     */
    destruct: function(reinitialising) {
        this.disableEditing();

        // Trigger destroy event, for plugins to remove them selves
        this.fire('destroy');

        // Remove all event bindings
        this.events = {};

        // Unbind all events
        this.getElement().off('.raptor');

        if (this.getOriginalElement().is(':input')) {
            this.target.remove();
            this.target = null;
            this.element.show();
        }

        this.layoutsDestruct();
    },

    /**
     * Runs destruct, then calls the UI widget destroy function.
     * @see $.
     */
//    destroy: function() {
//        this.destruct();
//        $.Widget.prototype.destroy.call(this);
//    },

    /*========================================================================*\
     * Preview functions
    \*========================================================================*/

    actionPreview: function(action) {
        this.actionPreviewRestore();
        try {
            var ranges = this.fire('selection-customise');
            if (ranges.length > 0) {
                this.previewState = actionPreview(this.previewState, this.target, function() {
                    for (var i = 0, l = ranges.length; i < l; i++) {
                        rangy.getSelection().setSingleRange(ranges[i]);
                        this.selectionConstrain();
                        action();
                    }
                }.bind(this));
            } else {
                this.selectionConstrain();
                this.previewState = actionPreview(this.previewState, this.target, action);
            }
            this.checkSelectionChange();
        } catch (exception) {
            // <strict>
            handleError(exception);
            // </strict>
        }
    },

    actionPreviewRestore: function() {
        if (this.previewState) {
            this.target = actionPreviewRestore(this.previewState, this.target);
            this.previewState = null;
            this.checkSelectionChange();
        }
    },

    actionApply: function(action) {
        this.actionPreviewRestore();
        var state = this.stateSave();
        try {
            var ranges = this.fire('selection-customise');
            if (ranges.length > 0) {
                actionApply(function() {
                    for (var i = 0, l = ranges.length; i < l; i++) {
                        rangy.getSelection().setSingleRange(ranges[i]);
                        this.selectionConstrain();
                        actionApply(action, this.history);
                    }
                }.bind(this), this.history);
            } else {
                this.selectionConstrain();
                actionApply(action, this.history);
            }
            this.checkChange();
        } catch (exception) {
            this.stateRestore(state);
            // <strict>
            handleError(exception);
            // </strict>
        }
    },

    actionUndo: function() { },

    actionRedo: function() { },

    stateSave: function() {
        this.selectionConstrain();
        return stateSave(this.target);
    },

    stateRestore: function(state) {
        // if (!this.isEditing()) {
        //     return;
        // }
        var restoredState = stateRestore(this.target, state),
            selection = rangy.getSelection();
        this.target = restoredState.element;
        if (restoredState.ranges !== null) {
            selection.setRanges(restoredState.ranges);
            selection.refresh();
        }
    },

    selectionConstrain: function() {
        selectionConstrain(this.target[0]);
    },

    pause: function() {
        if (!this.pausedState) {
            this.pausedState = this.stateSave()
            this.suspendHotkeys();
            // <jquery-ui>
            // Hack to fix when a dialog is closed, the editable element is focused, and the scroll jumps to the top
            this.pausedScrollX = window.scrollX;
            this.pausedScrollY = window.scrollY;
            // </jquery-ui>
        }
    },

    resume: function() {
        if (this.pausedState) {
            this.stateRestore(this.pausedState);
            this.pausedState = null;
            this.resumeHotkeys();
            this.restoreFocus();
            // <jquery-ui>
            window.scrollTo(this.pausedScrollX, this.pausedScrollY);
            // </jquery-ui>
        }
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
        if (!this.enabled) {
            this.fire('enabling');

            // Attach core events
            this.attach();

            this.enabled = true;

            this.getElement()
                .addClass(this.options.baseClass + '-editing')
                .addClass(this.options.classes);

            if (this.options.partialEdit) {
                this.getElement().find(this.options.partialEdit).prop('contenteditable', true);
            } else {
                this.getElement().prop('contenteditable', true);
            }

            if (!this.initialised) {
                this.initialised = true;
//                try {
//                    document.execCommand('enableInlineTableEditing', false, false);
//                    document.execCommand('styleWithCSS', true, true);
//                } catch (error) {
//                    // <strict>
//                    handleError(error);
//                    // </strict>
//                }

                for (var name in this.plugins) {
                    this.plugins[name].enable();
                }

                this.bindHotkeys();

                this.getElement().closest('form').on('submit.raptor', function() {
                    clean(this.getElement());
                    this.fire('change', [this.getHtml()]);
                }.bind(this));
            }

            clean(this.getElement());
            this.fire('enabled');
            this.showLayout();

            var selectNode = this.options.partialEdit ? this.getElement().find('[contenteditable]')[0] : this.getNode();
            switch (this.options.autoSelect) {
                case 'all': {
                    selectionSelectInner(selectNode);
                    break;
                }
                case 'start': {
                    var selectInnerNode = $(selectNode).find('*:first')[0];
                    if (!selectInnerNode) {
                        selectionSelectInner(selectNode);
                        break;
                    }
                    var range = rangy.createRange();
                    range.setStartBefore(selectInnerNode);
                    range.setEndBefore(selectInnerNode);
                    selectionSet(range);
                    break;
                }
                case 'end': {
                    var selectInnerNode = $(selectNode).find('*:last')[0];
                    if (!selectInnerNode) {
                        selectionSelectInner(selectNode);
                        break;
                    }
                    selectionSelectInner(selectInnerNode);
                    var range = rangy.createRange();
                    range.setStartAfter(selectInnerNode);
                    range.setEndAfter(selectInnerNode);
                    selectionSet(range);
                    break;
                }
            }
        }
    },

    /**
     *
     */
    disableEditing: function() {
        if (this.enabled) {
            this.detach();
            this.enabled = false;
            this.getElement()
                .prop('contenteditable', false)
                .removeClass(this.options.baseClass + '-editing')
                .removeClass(this.options.classes);
            rangy.getSelection().removeAllRanges();
            this.fire('disabled');
            if (this.options.reloadOnDisable && !disabledReloading) {
                disabledReloading = true;
                window.location.reload();
            }
        }
    },

    cancelEditing: function() {
        this.unify(function(raptor) {
            raptor.stopEditing();
        });
    },

    stopEditing: function() {
        this.fire('cancel');
        if (!this.options.reloadOnDisable) {
            this.resetHtml();
        }
        this.disableEditing();
        this.dirty = false;
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
        if (callSelf !== false) {
            callback(this);
        }
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
     * Layout
    \*========================================================================*/
    getLayout: function(type) {
        // <strict>
        if (typeof type === 'undefined') {
            handleInvalidArgumentError('Parameter 1 to getLayout is expected to be a layout type', type);
            return;
        }
        // </strict>
        return this.layouts[type];
    },

    loadLayouts: function() {
        for (var name in this.options.layouts) {
            if (typeof Raptor.layouts[name] === 'undefined') {
                // <strict>
                debug('Unknown layout type: ' + name);
                // </strict>
                continue;
            }
            this.layouts[name] = this.prepareComponent(Raptor.layouts[name], this.options.layouts[name], 'layout').instance;

            if (this.layouts[name].hotkeys) {
                this.registerHotkey(this.layouts[name].hotkeys, null, this.layouts[name]);
            }
        }
    },

    layoutsDestruct: function() {
        for (var name in this.layouts) {
            this.layouts[name].destruct();
        }
    },

    prepareComponent: function(component, componentOptions, prefix) {
        var instance = $.extend({}, component);

        var options = $.extend({}, instance.options, this.options, {
            baseClass: this.options.baseClass + '-' + prefix + '-' + stringFromCamelCase(component.name)
        }, componentOptions);

        instance.raptor = this;
        instance.options = options;
        // <strict>
        if (!instance.init) {
            handleError('Component missing init function: ' + instance.name);
        }
        // </strict>
        var init = instance.init();

        return {
            init: init,
            instance: instance
        };
    },

    /**
     * Show the layout for the current element.
     */
    showLayout: function() {
        // <debug>
        if (debugLevel >= MID) debug('Displaying layout', this.getElement());
        // </debug>

        // If unify option is set, hide all other layouts first
        this.unify(function(raptor) {
            raptor.fire('layoutHide');
        }, false);

        this.fire('layoutShow');

        this.fire('resize');
        if (typeof this.getElement().attr('tabindex') === 'undefined') {
            this.getElement().attr('tabindex', -1);
        }
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
        // <strict>
        if (!this.templates[name]) {
            handleError('Missing template: ' + name);
            return '**MISSING TEMPLATE: ' + name + '**';
        }
        // </strict>
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

            this.fire('historyChange');
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
            this.fire('historyChange');
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
            this.fire('historyChange');
        }
    },

    /*========================================================================*\
     * Hotkeys
    \*========================================================================*/

    /**
     * @param {Array|String} mixed The hotkey name or an array of hotkeys
     * @param {Object} The hotkey object or null
     */
    registerHotkey: function(mixed, action) {
        // <strict>
        if (!typeIsString(mixed)) {
            handleInvalidArgumentError('Expected argument 1 to raptor.registerHotkey to be a string');
            return;
        }
        if (this.hotkeys[mixed]) {
            handleError('Hotkey "' + mixed + '" has already been registered, and will be overwritten');
        }
        // </strict>

        this.hotkeys[mixed] = action;
    },

    bindHotkeys: function() {
        for (var keyCombination in this.hotkeys) {
            this.getElement().on('keydown.raptor', keyCombination, function(event) {
                if (this.isEditing() && !this.hotkeysSuspended) {
                    var result = this.hotkeys[event.data]();
                    if (result !== false) {
                        event.preventDefault();
                    }
                }
            }.bind(this));
        }
    },

    /**
     * Suspend hotkey functionality.
     */
    suspendHotkeys: function() {
        // <debug>
        if (debugLevel >= MID) debug('Disabling hotkeys');
        // </debug>
        this.hotkeysSuspended = true;
    },

    /**
     * Resume hotkey functionality.
     */
    resumeHotkeys: function() {
        // <debug>
        if (debugLevel >= MID) debug('Enabling hotkeys');
        // </debug>
        this.hotkeysSuspended = false;
    },

    /*========================================================================*\
     * Buttons
    \*========================================================================*/

    isUiEnabled: function(ui) {
        // Check if we are not automatically enabling UI, and if not, check if the UI was manually enabled
        if (this.options.enableUi === false &&
                typeof this.options.plugins[ui] === 'undefined' ||
                this.options.plugins[ui] === false) {
            // <debug>
            if (debugLevel >= MID) {
                debug('UI with name ' + ui + ' has been disabled ' + (
                    this.options.enableUi === false ? 'by default' : 'manually'
                ) + ' ' + $.inArray(ui, this.options.ui));
            }
            // </debug>
            return false;
        }

        // Check if we have explicitly disabled UI
        if ($.inArray(ui, this.options.disabledUi) !== -1 ||
                $.inArray(ui, this.options.disabledPlugins) !== -1) {
            // <strict>
            debug('Using disabledUi/disabledPlugins options is deprecated, use plugins: { nameOfPlugin: false } instead.');
            // </strict>
            return false;
        }

        return true;
    },

    /**
     * @deprecated
     * @param  {String} ui Name of the UI object to be returned.
     * @return {Object|null} UI object referenced by the given name.
     */
    getUi: function(ui) {
        // <strict>
        handleError('raptor.getUi() is deprecated, use raptor.getPlugin() instead.');
        // </strict>
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
        return this.uiObjects[name] || this.plugins[name];
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
            if ($.inArray(name, this.options.disabledUi) !== -1 ||
                    $.inArray(name, this.options.disabledPlugins) !== -1) {
                // <strict>
                debug('Using disabledUi/disabledPlugins options is deprecated, use plugins: { nameOfPlugin: false } instead.');
                // </strict>
                continue;
            }

            editor.plugins[name] = this.prepareComponent(Raptor.plugins[name], editor.options.plugins[name], 'plugin').instance;
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
        return this.getElement().html();
    },

    clean: function() {
        this.actionApply(function() {
            clean(this.getElement());
        }.bind(this));
    },

    /**
     * @param {String} html
     */
    setHtml: function(html) {
        this.getElement().html(html);
        this.fire('html');
        this.checkChange();
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
    saved: function(args) {
        this.setOriginalHtml(this.getHtml());
        this.dirty = false;
        this.fire('saved', args);
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
            return;
        }
        // </strict>
        var names = name.split(/,\s*/);
        for (var i = 0, l = names.length; i < l; i++) {
        	name = names[i].toLowerCase().replace(/[^a-z]/, '');
            // <debug>
            if (debugLevel > MIN) {
                debug('Binding event: ' + name);
            }
            // </debug>
            if (!this.events[name]) {
                this.events[name] = [];
            }
            this.events[name].push({
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
    	name = name.toLowerCase().replace(/[^a-z]/, '');
        // <debug>
        if (debugLevel > MIN) {
            debug('Unbinding event: ' + name);
        }
        // </debug>
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
    fire: function(name, args) {
    	name = name.toLowerCase().replace(/[^a-z]/, '');
        var result = [];

        // <debug>
        if (debugLevel === MAX) {
            debug('Firing event: ' + name);
        }
        // </debug>

        if (this.events[name]) {
            for (var i = 0, l = this.events[name].length; i < l; i++) {
                var event = this.events[name][i];
                if (typeof event !== 'undefined' &&
                        typeof event.callback !== 'undefined') {
                    var currentResult = event.callback.apply(event.context || this, args);
                    if (typeof currentResult !== 'undefined') {
                        result = result.concat(currentResult);
                    }
                }
            }
        }

        return result;
    }
};

$.widget('ui.raptor', RaptorWidget);
$.fn.raptor.Raptor = Raptor;