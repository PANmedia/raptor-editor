/**
 *
 * @author David Neilsen - david@panmedia.co.nz
 * @author Michael Robinson - michael@panmedia.co.nz
 * @version 0.1
 * @requires jQuery
 * @requires jQuery UI
 * @requires Rangy
 */

$.widget('ui.editor',
    /**
     * @lends $.editor.prototype
     */
    {

    /**
     * Constructor
     */
    _init: function() {
        // Add the editor instance to the global list of instances
        if ($.inArray(this, $.ui.editor.instances) === -1) {
            $.ui.editor.instances.push(this);
        }

        var currentInstance = this;
        // <strict>
        // Check for nested editors
        $.ui.editor.eachInstance(function(instance) {
            if (currentInstance != instance &&
                    currentInstance.element.closest(instance.element).length) {
                handleError('Nesting editors is unsupported', currentInstance.element, instance.element);
            }
        });
        // </strict>

        this.options = $.extend({}, $.ui.editor.defaults, this.options);

        // Give the element a unique ID
        if (!this.element.attr('id')) {
            this.element.attr('id', this.getUniqueId());
        }

        // Initialise properties
        this.ready = false;
        this.events = {};
        this.ui = {};
        this.plugins = {};
        this.templates = $.extend({}, $.ui.editor.templates);
        this.target = null;
        this.layout = null;

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

        // Clone the DOM tools functions
        this.cloneDomTools();

        // Store the original HTML
        this.setOriginalHtml(this.element.is(':input') ? this.element.val() : this.element.html());

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
        setLocale(locale);

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
        this.bind('selectionChange', this.updateTagTree);
        this.bind('show', this.updateTagTree);

        var change = $.proxy(this.checkChange, this);

        this.getElement().find('img').bind('click.' + this.widgetName, $.proxy(function(event){
            selectionSelectOuter(event.target);
        }, this));

        this.getElement().bind('mouseup.' + this.widgetName, change);
        this.getElement().bind('keyup.' + this.widgetName, change);

        // Unload warning
        $(window).bind('beforeunload', $.proxy($.ui.editor.unloadWarning, $.ui.editor));

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
        return this.target ? this.target : this.element;
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
        if (this.target) return;

        // Create the replacement div
        var target = $('<div/>')
            // Set the HTML of the div to the HTML of the original element, or if the original element was an input, use its value instead
            .html(this.element.val())
            // Insert the div before the original element
            .insertBefore(this.element)
            // Give the div a unique ID
            .attr('id', this.getUniqueId())
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

    /**
     * Clones all of the DOM tools functions, and constrains the selection before
     * calling.
     */
    cloneDomTools: function() {
        for (var i in this.options.domTools) {
            if (!this[i]) {
                this[i] = (function(i) {
                    return function() {
                        selectionConstrain(this.getElement());
                        var html = this.getHtml();
                        var result = this.options.domTools[i].apply(this.options.domTools, arguments);
                        if (html !== this.getHtml()) {
                            // <debug>
                            if (debugLevel >= MID) {
                                debug('Dom tools function (' + i + ') changed content, firing change.');
                            }
                            // </debug>
                            this.change();
                        }
                        return result;
                    };
                })(i);
            }
        }
    },

    /**
     * Determine whether the editing element's content has been changed.
     */
    checkChange: function() {
        // Check if the caret has changed position
        var currentSelection = rangy.serializeSelection();
        if (this.previousSelection !== currentSelection) {
            this.fire('selectionChange');
        }
        this.previousSelection = currentSelection;

        // Get the current content
        var currentHtml = this.getCleanHtml();

        // Check if the dirty state has changed
        var wasDirty = this.dirty;

        // Check if the current content is different from the original content
        this.dirty = this.getOriginalHtml() !== currentHtml;

        // If the current content has changed since the last check, fire the change event
        if (this.previousHtml !== currentHtml) {
            this.previousHtml = currentHtml;
            this.change();

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

    preview: null,
    actionPreview: function(action) {
        if (this.preview) {
            this.actionPreviewRemove();
        }
        this.preview = this.getHtml();
        action();
    },

    actionPreviewRemove: function() {
        if (this.preview) {
            this.setHtml(this.preview);
        }
    },

    actionApply: function(action) {

    },

    actionUndo: function() {

    },

    actionRedo: function() {

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
        return $.ui.editor.persist(key, value, this.options.namespace);
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
            this.enabled = true;
            this.getElement().addClass(this.options.baseClass + '-editing');

            if (this.options.partialEdit) {
                this.getElement().find(this.options.partialEdit).attr('contenteditable', true);
            } else {
                this.getElement().attr('contenteditable', true);
            }

            this.execCommand('enableInlineTableEditing', false, false);
            this.execCommand('styleWithCSS', true, true);

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

    /**
     *
     * @returns {boolean}
     */
    isEditing: function() {
        return this.enabled;
    },

    /**
     *
     */
    updateTagTree: function() {
        /*
        if (!this.isEditing()) return;

        var editor = this;
        var title = '';

        // An array of ranges (by index), each with a list of elements in the range
        var lists = [];
        var i = 0;

        // Loop all selected ranges
        selectionEachRange(function(range) {
            // Get the selected nodes common parent
            var node = range.commonAncestorContainer;

            var element;
            if (node.nodeType === 3) {
                // If nodes common parent is a text node, then use its parent
                element = $(node).parent();
            } else {
                // Or else use the node
                element = $(node);
            }

            // Ensure the element is the editing element or a child of the editing element
            if (!editor.isRoot(element) && !$.contains(editor.getElement().get(0), element.get(0))) {
                element = editor.getElement();
            }

            var list = [];
            lists.push(list);
            // Loop until we get to the root element, or the body tag
            while (element[0] && !editor.isRoot(element) && element[0].tagName.toLowerCase() !== 'body') {
                // Add the node to the list
                list.push(element);
                element = element.parent();
            }
            list.reverse();

            if (title) title += ' | ';
            title += this.getTemplate('root');
            for (var j = 0; j < list.length; j++) {
                title += this.getTemplate('tag', {
                    element: list[j][0].tagName.toLowerCase(),
                    // Create a data attribute with the index to the range, and element (so [0,0] will be the first range/first element)
                    data: '[' + i + ',' + j + ']'
                });
            }
            i++;
        }, null, this);

        if (!title) title = this.getTemplate('root');
        this.path
            .html(title)
            .find('a')
            .click(function() {
                // Get the range/element data attribute
                var i = $(this).data('ui-editor-selection');
                if (i) {
                    // Get the element from the list array
                    selectionSelectOuter(lists[i[0]][i[1]]);
                    editor.updateTagTree();
                } else {
                    selectionSelectOuter(editor.getElement());
                }
            });

        this.fire('tagTreeUpdated');
        */
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
            $.ui.editor.eachInstance(function(instance) {
                if (instance === currentInstance) {
                    return;
                }
                if (instance.options.unify) {
                    callback(instance);
                }
            });
        }
    },

    /**
     * @returns {String}
     */
    getUniqueId: function() {
        return $.ui.editor.getUniqueId();
    },

    /*========================================================================*\
     * Messages
    \*========================================================================*/

    /**
     *
     */
    loadMessages: function() {
        this.messages = $(this.getTemplate('messages')).appendTo(this.wrapper);
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
                this.element.stop().slideUp($.proxy(function() {
                    if ($.isFunction(options.hide)) {
                        options.hide.call(this);
                    }
                    this.element.remove();
                }, this));
            }
        };

        messageObject.element =
            $(this.getTemplate('message', {
                type: type,
                message: message
            }))
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
    loadLayout: function() {
        if (!this.layout) {
            this.layout = $.extend({}, raptor.layouts[this.options.layout.type]);
            this.layout.editor = this;
            this.layout.options = $.extend(true, {}, this.options, this.layout.options, this.options.layout.options);
            this.layout.init(this, this.layout.options);
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
        var template;
        if (!this.templates[name]) {
            template = $.ui.editor.getTemplate(name, this.options.urlPrefix);
        } else {
            template = this.templates[name];
        }
        // Translate template
        template = template.replace(/_\(['"]{1}(.*?)['"]{1}\)/g, function(match, string) {
            string = string.replace(/\\(.?)/g, function (s, slash) {
                switch (slash) {
                    case '\\':return '\\';
                    case '0':return '\u0000';
                    case '':return '';
                    default:return slash;
                }
            });
            return _(string);
        });
        // Replace variables
        variables = $.extend({}, this.options, variables || {});
        variables = this.getTemplateVars(variables);
        template = template.replace(/\{\{(.*?)\}\}/g, function(match, variable) {
            return variables[variable];
        });
        return template;
    },

    /**
     * @param {Object} variables
     * @param {String} prefix
     */
    getTemplateVars: function(variables, prefix, depth) {
        prefix = prefix ? prefix + '.' : '';
        var maxDepth = 5;
        if (!depth) depth = 1;
        var result = {};
        for (var name in variables) {
            if (typeof variables[name] === 'object' && depth < maxDepth) {
                var inner = this.getTemplateVars(variables[name], prefix + name, ++depth);
                for (var innerName in inner) {
                    result[innerName] = inner[innerName];
                }
            } else {
                result[prefix + name] = variables[name];
            }
        }
        return result;
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
        if (html !== this.historyPeak()) {
            // Reset the future on change
            if (this.present !== this.history.length - 1) {
                this.history = this.history.splice(0, this.present + 1);
            }

            // Add new HTML to the history
            this.history.push(this.getHtml());

            // Mark the persent as the end of the history
            this.present = this.history.length - 1;
        }
    },

    /**
     * @returns {String|null}
     */
    historyPeak: function() {
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

    /*
    loadUi: function() {
        // Loop the UI order option
        for (var i = 0, l = this.options.uiOrder.length; i < l; i++) {
            var uiSet = this.options.uiOrder[i];
            // Each element of the UI order should be an array of UI which will be grouped
            var uiGroup = $('<div/>');

            // Loop each UI in the array
            for (var j = 0, ll = uiSet.length; j < ll; j++) {

                if (!this.uiEnabled(uiSet[j])) continue;

                var baseClass = uiSet[j].replace(/([A-Z])/g, function(match) {
                    return '-' + match.toLowerCase();
                });

                // Check the UI has been registered
                if ($.ui.editor.ui[uiSet[j]]) {
                    // Clone the UI object (which should be extended from the defaultUi object)
                    var uiObject = $.extend({}, $.ui.editor.ui[uiSet[j]]);

                    var options = $.extend(true, {}, this.options, {
                        baseClass: this.options.baseClass + '-ui-' + baseClass
                    }, uiObject.options, this.options.ui[uiSet[j]]);

                    uiObject.editor = this;
                    uiObject.options = options;
                    uiObject.ui = uiObject.init(this, options);

                    // Bind hotkeys
                    if (uiObject.hotkeys) {
                        if (!hotkeys) {
                            // <strict>
                            handleError(_('jQuery hotkey plugin (https://github.com/jeresig/jquery.hotkeys) is not present. Hotkeys are disabled.'));
                            // </strict>
                        } else {
                            this.registerHotkey(uiObject.hotkeys, null, uiObject);
                            // Add hotkeys to title
                            uiObject.ui.title += ' (' + $.map(uiObject.hotkeys, function(value, index) {
                                    return index;
                                })[0] + ')';
                        }
                    }

                    // Append the UI object to the group
                    uiObject.ui.init(uiSet[j], this, options, uiObject).appendTo(uiGroup);

                    // Add the UI object to the editors list
                    this.uiObjects[uiSet[j]] = uiObject;
                }
                // <strict>
                else {
                    handleError(_('UI identified by key "{{ui}}" does not exist', {ui: uiSet[j]}));
                }
                // </strict>
            }

            uiGroup
                .addClass('ui-buttonset')
                .addClass(this.options.baseClass + '-buttonset');

            // Append the UI group to the editor toolbar
            if (uiGroup.children().length > 0) {
                uiGroup.appendTo(this.toolbar);
            }
        }
        $('<div/>').css('clear', 'both').appendTo(this.toolbar);
    },
*/
    /**
     * @param {Object} options
     */
    uiButton: function(options) {
        return $.extend({
            button: null,
            options: {},
            init: function(name, editor, options, object) {
                var baseClass = name.replace(/([A-Z])/g, function(match) {
                    return '-' + match.toLowerCase();
                });
                // Extend options overriding editor < base class < supplied options < user options
                options = $.extend({}, editor.options, {
                    baseClass: editor.options.baseClass + '-' + baseClass + '-button'
                }, this.options, editor.options.ui[name]);
                // Default title if not set in plugin
                if (!this.title) this.title = _('Unnamed Button');

                // Create the HTML button
                this.button = $('<div/>')
                    .html(this.label || this.title)
                    .addClass(options.baseClass)
                    .attr('name', name)
                    .attr('title', this.title)
                    .val(name);

                if (options.classes) this.button.addClass(options.classes);

                // Prevent losing the selection on the mouse down
                this.button.bind('mousedown.' + object.editor.widgetName, function(e) {
                    e.preventDefault();
                });

                // Bind the click event
                var button = this;
                this.button.bind('mouseup.' + object.editor.widgetName, function(e) {
                    // Prevent losing the selection on the mouse up
                    e.preventDefault();
                    // Call the click event function
                    button.click.apply(object, arguments);
                    editor.checkChange();
                });

                editor.bind('destroy', $.proxy(function() {
                    this.button.button('destroy').remove();
                }, this));

                // Create the jQuery UI button
                this.button.button({
                    icons: {
                        primary: this.icon || 'ui-icon-' + baseClass
                    },
                    disabled: options.disabled ? true : false,
                    text: this.text || false,
                    label: this.label || null
                });

                this.ready.call(object);

                return this.button;
            },
            disable: function() {
                this.button.button('option', 'disabled', true);
            },
            enable: function() {
                this.button.button('option', 'disabled', false);
            },
            ready: function() {},
            click: function() {}
        }, options);
    },

    /**
     * @param {Object} options
     */
    uiSelectMenu: function(options) {
        return $.extend({
            // HTML select
            select: null,

            // HTML replacements
            selectMenu: null,
            button: null,
            menu: null,

            // Options passed but the plugin
            options: {},

            init: function(name, editor) {
                var ui = this;

                // Disable HTML select to prevent submission of select values
                ui.select.attr('disabled', 'disabled');

                var baseClass = name.replace(/([A-Z])/g, function(match) {
                    return '-' + match.toLowerCase();
                });

                // Extend options overriding editor < base class < supplied options < user options
                var options = $.extend({}, editor.options, {
                    baseClass: editor.options.baseClass + baseClass + '-select-menu'
                }, ui.options, editor.options.ui[name]);

                // Default title if not set in plugin
                if (!ui.title) ui.title = _('Unnamed Select Menu');

                ui.wrapper =  $('<div class="ui-editor-selectmenu-wrapper"/>')
                    .append(ui.select.hide())
                    .addClass(ui.select.attr('class'));

                ui.selectMenu = $('<div class="ui-editor-selectmenu"/>')
                    .appendTo(ui.wrapper);

                ui.menu = $('<div class="ui-editor-selectmenu-menu ui-widget-content ui-corner-bottom ui-corner-tr"/>')
                    .appendTo(ui.wrapper);

                ui.select.find('option, .ui-editor-selectmenu-option').each(function() {
                    var option = $('<div/>')
                        .addClass('ui-editor-selectmenu-menu-item')
                        .addClass('ui-corner-all')
                        .html($(this).html())
                        .appendTo(ui.menu)
                        .bind('mouseenter.' + editor.widgetName, function() {
                            $(this).addClass('ui-state-focus');
                        })
                        .bind('mouseleave.' + editor.widgetName, function() {
                            $(this).removeClass('ui-state-focus');
                        })
                        .bind('mousedown.' + editor.widgetName, function() {
                            // Prevent losing focus on editable region
                            return false;
                        })
                        .bind('click.' + editor.widgetName, function() {
                            var option = ui.select.find('option, .ui-editor-selectmenu-option').eq($(this).index());
                            var value = option.attr('value') || option.val();
                            ui.select.val(value);
                            ui.update();
                            ui.wrapper.removeClass('ui-editor-selectmenu-visible');
                            ui.button.addClass('ui-corner-all')
                                  .removeClass('ui-corner-top');
                            ui.change(value);
                            return false;
                        });
                });


                var text = $('<div/>')
                    .addClass('ui-editor-selectmenu-text');
                var icon = $('<div/>')
                    .addClass('ui-icon ui-icon-triangle-1-s');
                ui.button = $('<div/>')
                    .addClass('ui-editor-selectmenu-button ui-editor-selectmenu-button ui-button ui-state-default')
                    .attr('title', ui.title)
                    .append(text)
                    .append(icon)
                    .prependTo(ui.selectMenu);
                ui.button
                    .bind('mousedown.' + editor.widgetName, function() {
                        // Prevent losing focus on editable region
                        return false;
                    })
                    .bind('click.' + editor.widgetName, function() {
                        // Do not fire click event when disabled
                        if ($(this).hasClass('ui-state-disabled')) {
                            return;
                        }
                        if (parseInt(ui.menu.css('min-width'), 10) < ui.button.outerWidth() + 10) {
                            ui.menu.css('min-width', ui.button.outerWidth() + 10);
                        }
                        ui.wrapper.toggleClass('ui-editor-selectmenu-visible');
                        return false;
                    })
                    .bind('mouseenter.' + editor.widgetName, function() {
                        if (!$(this).hasClass('ui-state-disabled')) {
                            $(this).addClass('ui-state-hover', $(this).hasClass('ui-state-disabled'));
                        }
                    })
                    .bind('mouseleave.' + editor.widgetName, function() {
                        $(this).removeClass('ui-state-hover');
                    });

                var selected = ui.select.find('option[value=' + this.select.val() + '], .ui-editor-selectmenu-option[value=' + this.select.val() + ']').html() ||
                    ui.select.find('option, .ui-editor-selectmenu-option').first().html();
                ui.button.find('.ui-editor-selectmenu-text').html(selected);

                return ui.wrapper;
            },
            update: function(value) {
                var selected = this.select.find('option[value=' + this.select.val() + '], .ui-editor-selectmenu-option[value=' + this.select.val() + ']').html();
                this.button.find('.ui-editor-selectmenu-text').html(selected);
            },
            val: function() {
                var result = this.select.val.apply(this.select, arguments);
                this.update();
                return result;
            },
            change: function() {
            }
        }, options);
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
        if (!this.options.plugins) this.options.plugins = {};
        for (var name in $.ui.editor.plugins) {
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
            var pluginObject = $.extend({}, $.ui.editor.plugins[name]);

            var baseClass = name.replace(/([A-Z])/g, function(match) {
                return '-' + match.toLowerCase();
            });

            var options = $.extend(true, {}, editor.options, {
                baseClass: editor.options.baseClass + '-' + baseClass
            }, pluginObject.options, editor.options.plugins[name]);

            pluginObject.editor = editor;
            pluginObject.options = options;
            pluginObject.init(editor, options);

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
        var content = this.getElement().html();

        // Remove saved rangy ranges
        content = $('<div/>').html(content);
        content.find('.rangySelectionBoundary').remove();
        content = content.html();

        return content;
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
    save: function() {
        var html = this.getCleanHtml();
        this.fire('save');
        this.setOriginalHtml(html);
        this.fire('saved');
        this.fire('cleaned');
        return html;
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
        if (!$.isFunction(callback)) handleError('Must bind a valid callback, ' + name + ' was a ' + typeof callback);
        // </strict>
        var events = this.events;
        $.each(name.split(','), function(i, name) {
            name = $.trim(name);
            if (!events[name]) events[name] = [];
            events[name].push({
                context: context,
                callback: callback
            });
        });
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
        if (!sub) this.fire('before:' + name, global, true);

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
            $.ui.editor.fire(name);
        }

        // Fire after sub-event
        if (!sub) this.fire('after:' + name, global, true);
    }

});

$.extend($.ui.editor, raptor);
