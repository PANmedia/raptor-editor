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
        $.ui.editor.instances.push(this);

        this.options = $.extend({}, $.ui.editor.defaults, this.options);

        // Set the options after the widget initialisation, because jQuery UI widget tries to extend the array (and breaks it)
        this.options.uiOrder = this.options.uiOrder || [
            ['save', 'cancel'],
            ['dock', 'showGuides', 'clean'],
            ['viewSource'],
            ['undo', 'redo'],
            ['alignLeft', 'alignCenter', 'alignJustify', 'alignRight'],
            ['textBold', 'textItalic', 'textUnderline', 'textStrike'],
            ['textSuper', 'textSub'],
            ['listUnordered', 'listOrdered'],
            ['hr', 'quoteBlock'],
            ['fontSizeInc', 'fontSizeDec'],
            ['link', 'unlink'],
            ['floatLeft', 'floatNone', 'floatRight'],
            ['tagMenu'],
            ['i18n']
        ];

        // Give the element a unique ID
        if (!this.element.attr('id')) {
            this.element.attr('id', this.getUniqueId());
        }

        this.reiniting = this.reiniting || false;
        this.ready = false;
        this.toolbar = null;
        this.events = {};
        this.ui = {};
        this.plugins = {};
        this.templates = $.extend({}, $.ui.editor.templates);
        this.changeTimer = null;

        // Undo stack, redo pointer
        this.history = [];
        this.present = 0;
        this.historyEnabled = true;

        // Clone the DOM tools functions
        this.cloneDomTools();

        this.setOriginalHtml(this.element.is(':input') ? this.element.val() : this.element.html());

        // Replace the original element with a div (if specified)
        if (this.options.replace) {
            this.replaceOriginal();
            this.options.replace = false;
        }

        this.loadToolbar();
        this.loadMessages();
        this.attach();

        this.loadPlugins();
        this.loadUi();

        if (this.options.show) {
            this.showToolbar();
        }

        if (this.options.enabled) {
            this.enableEditing();
        }

        // Unload warning
        $(window).bind('beforeunload', $.proxy($.ui.editor.unloadWarning, $.ui.editor));

        this.ready = true;
        this.fire('ready');

        if (this.options.autoEnable) {
            this.enableEditing();
            this.showToolbar();
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
        this.bind('change', this.updateTagTree);

        var change = $.proxy(function() {
            this.change();
        }, this);

        this.getElement().find('img').bind('click.' + this.widgetName, $.proxy(function(event){
            this.selectOuter(event.target);
        }, this));
        this.getElement().bind('click.' + this.widgetName, change);
        this.getElement().bind('keyup.' + this.widgetName, change);
        this.bind('destroy', function() {
            this.getElement().unbind('click.' + this.widgetName, change)
            this.getElement().unbind('keyup.' + this.widgetName, change)
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
            }
            this.bind('ready', reinit);
            return;
        }
        // <debug>
        info('Reinitialising editor');
        // </debug>
        // We are ready, so we can run reinit now
        this.reiniting = true;
        this.destruct(true);
        this._init();
        this.reiniting = false;
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
            .html(this.element.is(':input') ? this.element.val() : this.element.html())
            // Insert the div before the origianl element
            .insertBefore(this.element)
            // Give the div a unique ID
            .attr('id', this.getUniqueId())
            // Copy the origianl elements class(es) to the replacement div
            .attr('class', this.element.attr('class'));

        var style = this.getStyles(this.element);
        for (var i = 0; i < this.options.replaceStyle.length; i++) {
            target.css(this.options.replaceStyle[i], style[this.options.replaceStyle[i]]);
        }

        this.element.hide();
        this.bind('change', function() {
            if (this.element.is(':input')) {
                this.element.val(this.getHtml());
            } else {
                this.element.html(this.getHtml());
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
                        this.options.domTools.constrainSelection(this.getElement());
                        var html = this.getHtml();
                        var result = this.options.domTools[i].apply(this.options.domTools, arguments);
                        if (html != this.getHtml()) this.change();
                        return result;
                    }
                })(i);
            }
        }
    },

    change: function() {
        if (this.changeTimer !== null) window.clearTimeout(this.changeTimer);
        this.changeTimer = window.setTimeout(function(editor) {
            editor.fire('change');
            editor.changeTimer = null;
        }, 50, this);
    },

    /*========================================================================*\
     * Destructor
    \*========================================================================*/

    /**
     * Hides the toolbar, disables editing, and fires the destroy event.
     * @public
     * @param {boolean} Indicates the the editor is just reinitialising and
     * should not hide the toolbar, or disable editing.
     */
    destruct: function(reinit) {
        // Disable editing unless we are re initialising
        if (!reinit) {
            this.hideToolbar();
            this.disableEditing();
        }

        // Trigger destory event, for plugins to remove them selves
        this.fire('destroy', false);

        // Remove all event bindings
        this.events = {};
    },

    /**
     * Unbinds all namespaced events from the element then calls the UI widget
     * destroy function
     */
    destroy: function() {
        this.destruct();
        this.getElement().unbind('.' + this.widgetName);
        $.Widget.prototype.destroy.call(this);
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
        if (!this.options.enabled || this.reiniting) {
            this.options.enabled = true;
            this.getElement().attr('contenteditable', true)
                        .addClass(this.options.baseClass + '-editing');
            document.execCommand('enableInlineTableEditing', false, false);
            // Re-enabled for now so user knows they've selected an image
            // document.execCommand('enableObjectResizing', false, false);
            document.execCommand('styleWithCSS', true, true);
            this.fire('enabled');
            this.fire('resize');
            this.change();
        }
    },

    /**
     *
     */
    disableEditing: function() {
        if (this.options.enabled) {
            this.options.enabled = false;
            this.getElement().attr('contenteditable', false)
                        .removeClass(this.options.baseClass + '-editing');
            this.fire('disabled');
        }
    },

    /**
     *
     * @returns {boolean}
     */
    isEditing: function() {
        return this.options.enabled;
    },

    /**
     *
     */
    updateTagTree: function() {
        if (!this.isEditing()) return;

        var editor = this;
        var title = '';

        // An array of ranges (by index), each with a list of elements in the range
        var lists = [];
        var i = 0;

        // Loop all selected ranges
        this.eachRange(function(range) {
            // Get the selected nodes common parent
            var node = range.commonAncestorContainer;

            var element;
            if (node.nodeType === 3) {
                // If nodes common parent is a text node, then use its parent
                element = $(node).parent();
            // } else if(this.rangeEmptyTag(range)) {
            //     element = $(this.domFragmentToHtml(range.cloneContents()));
            } else {
                // Or else use the node
                element = $(node);
            }

            var list = [];
            lists.push(list);
            // Loop untill we get to the root element, or the body tag
            while (element[0] && !editor.isRoot(element) && element[0].tagName.toLowerCase() != 'body') {
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
        this.selDialog('.ui-dialog-title')
            .html(title)
            .find('a')
            .click(function() {
                // Get the range/element data attribute
                var i = $(this).data('ui-editor-selection');
                if (i) {
                    // Get the element from the list array
                    editor.selectOuter(lists[i[0]][i[1]]);
                    editor.updateTagTree();
                } else {
                    editor.selectOuter(editor.getElement());
                }
            });
    },

    /**
     * @param {jQuerySelector|jQuery|Element} element
     * @returns {boolean}
     */
    isRoot: function(element) {
        return this.getElement()[0] == $(element)[0];
    },

    /**
     * @param {function} callback
     * @param {boolean} [callSelf]
     */
    unify: function(callback, callSelf) {
        if (callSelf !== false) callback(this);
        if (this.options.unify) {
            var instances = $.ui.editor.getInstances();
            for (var i = 0; i < instances.length; i++) {
                if (instances[i] != this &&
                        instances[i].options.unify) {
                    callback(instances[i]);
                }
            }
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
        $(this.getTemplate('messages')).appendTo(this.selToolbar());
    },

    /**
     * @param {String} type
     * @param {String[]} messages
     */
    showMessage: function(type, message, options) {
        options = $.extend({}, this.options.message, options);

        var messageObject = {
            timer: null,
            editor: this,
            show: function() {
                this.element.slideDown();
                this.timer = window.setTimeout(function(messageObject) {
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
            .appendTo(this.selMessages())
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
     * Toolbar
    \*========================================================================*/
    /**
     *
     */
    loadToolbar: function() {
        this.toolbar = $('<div class="' + this.options.baseClass + '-toolbar"/>');
        this.toolbar.append('<div class="' + this.options.baseClass + '-inner"/>');

        this.toolbar.dialog({
            resizable: false,
            closeOnEscape: false,
            width: 'auto',
            height: 'auto',
            minHeight: 'auto',
            resize: 'auto',
            zIndex: 32000,
            title: _('Editor loading...'),
            autoOpen: false,
            dialogClass: this.options.dialogClass,
            dragStop: $.proxy(function() {
                var pos = this.persist('position', [
                    this.selDialog().css('top'),
                    this.selDialog().css('left')
                ]);
                this.selDialog().css({
                    top: Math.abs(pos[0]),
                    left: Math.abs(pos[1])
                });
            }, this),
            open: $.proxy(function(event, ui) {
                $(this.toolbar).parent()
                    .css('position', 'fixed')
                    .find('.ui-dialog-titlebar-close', ui)
                    .remove();

                var pos = this.persist('position') || this.options.dialogPosition;

                if (parseInt(pos[0]) + this.selDialog().outerHeight() > $(window).height()) {
                    pos[0] = $(window).height() - this.selDialog().outerHeight();
                }
                if (parseInt(pos[1]) + this.selDialog().outerWidth() > $(window).width()) {
                    pos[1] = $(window).width() - this.selDialog().outerWidth();
                }

                this.selDialog().css({
                    top: Math.abs(pos[0]),
                    left: Math.abs(pos[1])
                });
            }, this)
        });

        this.bind('after:destroy', $.proxy(function() {
            this.toolbar.dialog('destroy').remove();
        }, this));
    },

    /**
     * @param {boolean} [instant]
     */
    showToolbar: function(instant) {
        if (!this.options.show || this.reiniting) {
            // If unify option is set, hide all other toolbars first
            if (this.options.unify) {
                var otherEnabled = false;
                this.unify(function(editor) {
                    otherEnabled = otherEnabled || editor.options.show;
                });
                if (otherEnabled) {
                    this.unify(function(editor) {
                        editor.hideToolbar(true);
                    });
                }
            }
            this.options.show = true;
            if (instant) {
                this.selDialog().show();
            }
            this.selToolbar().dialog('open');
            this.fire('show');
            this.fire('resize');
        }
    },

    /**
     * @param {boolean} [instant]
     */
    hideToolbar: function(instant) {
        if (this.options.show) {
            this.options.show = false;
            if (instant) {
                this.selDialog().hide();
            }
            this.selToolbar().dialog('close');
            this.fire('hide');
            this.fire('resize');
        }
    },

    /**
     * @param {boolean} [instant]
     */
    hideOtherToolbars: function(instant) {
        this.unify(function(editor) {
            editor.hideToolbar(instant);
        }, false);
    },

    /**
     * @returns {boolean}
     */
    isToolbarVisible: function() {
        return this.options.show;
    },

    /**
     * @returns {$.ui.dialog}
     */
    dialog: function() {
        return this.toolbar.dialog.apply(this.toolbar, arguments);
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
        template = template.replace(/_\('(.*?)'\)/g, function(match, string) {
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
        template = template.replace(/{{(.*?)}}/g, function(match, variable) {
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
            if (typeof variables[name] == 'object' && depth < maxDepth) {
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
        if (html != this.historyPeak()) {
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
     * Selectors
    \*========================================================================*/
    /**
     * @param {jQuerySelector|jQuery|Element} [find]
     * @returns {jQuery}
     */
    selToolbar: function(find) {
        if (find) {
            return this.toolbar.find(find);
        }
        return this.toolbar;
    },

    /**
     * @param {jQuerySelector|jQuery|Element} [find]
     * @returns {jQuery}
     */
    selTitle: function(find) {
        var titlebar = this.selDialog('.ui-dialog-titlebar');
        if (find) {
            return titlebar.find(find);
        }
        return titlebar;
    },

    /**
     * @param {jQuerySelector|jQuery|Element} [find]
     * @returns {jQuery}
     */
    selDialog: function(find) {
        var dialog = this.selToolbar().parent();
        if (find) {
            return dialog.find(find);
        }
        return dialog;
    },

    /**
     * @param {jQuerySelector|jQuery|Element} [find]
     * @returns {jQuery}
     */
    selMessages: function(find) {
        var messages = this.selToolbar().find('.' + this.options.baseClass + '-messages');
        if (find) {
            return messages.find(find);
        }
        return messages;
    },

    /*========================================================================*\
     * Buttons
    \*========================================================================*/

    /**
     *
     */
    loadUi: function() {
        var editor = this;
        // Loop the UI order option
        for (var i = 0; i < this.options.uiOrder.length; i++) {
            var uiSet = this.options.uiOrder[i];
            // Each element of the UI order should be an array of UI which will be grouped
            var uiGroup = $('<div/>');

            // Loop each UI in the array
            for (var j = 0; j < uiSet.length; j++) {
                // Check if we are not automaticly enabling UI, and if not, check if the UI was manually enabled
                if (!this.options.enableUi &&
                        !this.options.ui[uiSet[j]]) continue;

                // Check if we have explicitly disabled UI
                if ($.inArray(uiSet[j], this.options.disabledUi) !== -1) continue;

                var baseClass = uiSet[j].replace(/([A-Z])/g, function(match) {
                    return '-' + match.toLowerCase();
                });

                // Check the UI has been registered
                if ($.ui.editor.ui[uiSet[j]]) {
                    var options = $.extend({}, editor.options, {
                        baseClass: editor.options.baseClass + '-ui-' + baseClass
                    }, editor.options.ui[uiSet[j]])

                    // Clone the UI object (which should be extended from the defaultUi object)
                    var uiObject = $.extend({}, $.ui.editor.ui[uiSet[j]]);
                    uiObject.editor = editor;
                    uiObject.options = options;
                    uiObject.ui = uiObject.init(editor, options);

                    // Append the UI object to the group
                    uiObject.ui.init(uiSet[j], editor, options, uiObject).appendTo(uiGroup);
                }
                // <strict>
                else {
                    handleError(_('UI identified by key "{{ui}}" does not exist', {ui: uiSet[j]}));
                }
                // </strict>
            }

            uiGroup.addClass(editor.options.baseClass + '-group');

            if (uiGroup.children().length > 1) {
                uiGroup.addClass(editor.options.baseClass + '-buttonset');
            }

            // Append the UI group to the editor toolbar
            if (uiGroup.children().length > 0) {
                uiGroup.appendTo(editor.selToolbar('.' + editor.options.baseClass + '-inner'));
            }
        };
        $('<div/>').addClass('ui-helper-clearfix').appendTo(editor.selToolbar('.' + editor.options.baseClass + '-inner'));
    },

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
                var options = $.extend({}, editor.options, {
                    baseClass: editor.options.baseClass + '-' + baseClass + '-button'
                }, this.options, editor.options.ui[name])
                // Default title if not set in plugin
                if (!this.title) this.title = _('Unnamed Button');

                // Create the HTML button
                this.button = $('<button/>')
                    .html(this.title)
                    .addClass(options.baseClass)
                    .attr('name', name)
                    .attr('title', this.title)
                    .attr('type', 'button')
                    .val(name);

                if (options.classes) this.button.addClass(options.classes);

                // Bind the click event
                this.button.bind('click.' + object.editor.widgetName, $.proxy(this.click, object));

                editor.bind('destroy', $.proxy(function() {
                    this.button.button('destory').remove();
                }, this));

                // Create the jQuery UI button
                this.button.button({
                    icons: {primary: this.icon || 'ui-icon-' + baseClass},
                    disabled: options.disabled ? true : false,
                    text: false
                });

                return this.button;
            },
            disable: function() {
                this.button.button('option', 'disabled', true);
            },
            enable: function() {
                this.button.button('option', 'disabled', false);
            },
            click: function() {
            }
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

                var baseClass = name.replace(/([A-Z])/g, function(match) {
                    return '-' + match.toLowerCase();
                });

                // Extend options overriding editor < base class < supplied options < user options
                var options = $.extend({}, editor.options, {
                    baseClass: editor.options.baseClass + baseClass + '-select-menu'
                }, ui.options, editor.options.ui[name])

                // Default title if not set in plugin
                if (!this.title) this.title = _('Unnamed Select Menu');

                ui.selectMenu = $('<div class="ui-editor-selectmenu"/>');

                ui.selectMenu.append(this.select.hide());
                ui.menu = $('<div class="ui-editor-selectmenu-menu ui-widget-content ui-corner-bottom ui-corner-tr"/>').hide().appendTo(this.selectMenu);
                ui.select.find('option').each(function() {
                    var option = $('<button/>')
                        .addClass('ui-editor-selectmenu-menu-item')
                        .addClass('ui-corner-all')
                        .html($(this).html())
                        .appendTo(ui.menu)
                        .bind('mouseenter.' + editor.widgetName, function() {$(this).addClass('ui-state-focus')})
                        .bind('mouseleave.' + editor.widgetName, function() {$(this).removeClass('ui-state-focus')})
                        .bind('click.' + editor.widgetName, function() {
                            var option = ui.select.find('option').eq($(this).index());
                            ui.select.val(option.val());
                            ui.update();
                            ui.menu.stop().hide();
                            ui.button.addClass('ui-corner-all')
                                  .removeClass('ui-corner-top');
                            ui.change(ui.select.val());
                        });
                });

                ui.button = $('<button/>')
                    .addClass('ui-editor-selectmenu-button')
                    .attr('title', this.title)
                    .button({icons: {secondary: 'ui-icon-triangle-1-s'}})
                    .prependTo(this.selectMenu);

                var click = function() {
                    if (!ui.menu.is(':animated')) {
                        if (ui.menu.is(':visible')) {
                            ui.menu.stop().slideUp(function() {
                                ui.button.addClass('ui-corner-all')
                                         .removeClass('ui-corner-top');
                            });
                        } else {
                            ui.menu.css('min-width', ui.button.width() + 10);
                            ui.menu.stop().slideDown();
                            ui.button.removeClass('ui-corner-all')
                                     .addClass('ui-corner-top');
                        }
                    }
                };

                ui.button.bind('click.' + editor.widgetName, click);

                var selected = ui.select.find('option[value=' + ui.select.val() + ']').html();
                ui.button.find('.ui-button-text').html(selected);

                editor.bind('destroy', function() {
                    ui.selectMenu.remove();
                });

                return this.selectMenu;
            },
            update: function() {
                var selected = this.select.find('option[value=' + this.select.val() + ']').html();
                this.button.find('.ui-button-text').html(selected);
            },
            val: function() {
                var result = this.select.val.apply(this.select, arguments);
                this.update();
                return result;
            },
            change: function(value) {

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
            if (!this.options.enablePlugins &&
                    !this.options.plugins[name]) continue;

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

            editor.plugins[name] = pluginObject;
        };
    },

    /*========================================================================*\
     * Content accessors
    \*========================================================================*/

    /**
     * @returns {boolean}
     */
    isDirty: function() {
        return this.getOriginalHtml() != this.getHtml();
    },

    /**
     * @param {String} html
     * @returns {String}
     */
    cleanHtml: function(html) {
        var content = $('<div/>').html(html);
        content.find('.rangySelectionBoundary').remove();
        return content.html();
    },

    /**
     * @returns {String}
     */
    getHtml: function() {
        return this.cleanHtml(this.getElement().html());
    },

    /**
     * @param {String} html
     */
    setHtml: function(html) {
        this.getElement().html(html);
        this.change();
    },

    /**
     *
     */
    resetHtml: function() {
        this.setHtml(this.getOriginalHtml());
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
        this.fire('save');
        this.setOriginalHtml(this.getHtml());
        this.fire('saved');
        this.fire('change');
        return this.getHtml();
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
        if (!this.events[name]) this.events[name] = [];
        this.events[name].push({
            context: context,
            callback: callback
        });
    },

    /**
     * @param {String} name
     * @param {function} callback
     * @param {Object} [context]
     */
    unbind: function(name, callback, context) {
        for (var i = 0, l = this.events[name].length; i < l; i++) {
            if (this.events[name][i].callback === callback &&
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
        if (debugLevel >= MAX) debug('Firing event: ' + name, this.getElement());
        // </debug>

        if (this.events[name]) {
            for (var i = 0, l = this.events[name].length; i < l; i++) {
                var event = this.events[name][i];
                event.callback.call(event.context || this);
            }
        }
        // Also trigger the global editor event, unless specified not to
        if (global !== false) {
            $.ui.editor.fire(name);
        }

        // Fire after sub-event
        if (!sub) this.fire('after:' + name, global, true);
    },

    /*========================================================================*\
     * Internationalisation
    \*========================================================================*/
    /**
     * @returns {String}
     */
    getLocale: function() {
        return $.ui.editor.currentLocale;
    },

    /**
     * @param {String} key
     */
    setLocale: function(key) {
        if ($.ui.editor.currentLocale !== key) {
            $.ui.editor.currentLocale = key;
            this.reinit();
        }
    },

    /**
     * @returns {String[]}
     */
    getLocales: function() {
        return $.ui.editor.locales;
    },

    /**
     * @param {String} key
     * @returns {String}
     */
    getLocaleName: function(key) {
        return $.ui.editor.localeNames[key];
    }

});

/*============================================================================*\
 * Global static class definition
\*============================================================================*/
$.extend($.ui.editor,
    /** @lends $.ui.editor */
    {

    /**
     * Default options for the jQuery UI Editor
     * @namespace Default settings for the jQuery UI Editor
     */
    defaults: {
        /**
         * Plugins option overrides
         * @type Object
         */
        plugins: {},

        /**
         * UI option overrides
         * @type Object
         */
        ui: {},

        /**
         *
         * @type Object
         */
        domTools: domTools,

        /**
         * Namespace used to persistence to prevent conflicting stored values
         * @type String
         */
        namespace: null,

        /**
         * The current locale of the editor
         * @type String
         */
        locale: '',

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
         * Switch to specify if the editor should automatically enable all UI, if set to false, only the UI specified in the 'ui' option object will be enabled
         * @type boolean
         */
        enableUi: true,

        /**
         * An array of explicitly disabled UI elements
         * @type String[]
         */
        disabledUi: [],

        /**
         * Default message opttions
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
         *
         * @type String
         */
        dialogClass: 'ui-editor-dialog',

        /**
         *
         * @type int[2]
         */
        dialogPosition: [5, 47],

        /**
         * CSS class prefix that is prepended to inserted elements classes. E.g. "cms-bold"
         * @type String
         */
        cssPrefix: 'cms-'
    },

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
     * @property {$.ui.editor[]} instances
     */
    instances: [],

    /**
     * @returns {$.ui.editor[]}
     */
    getInstances: function() {
        return this.instances;
    },

    /*========================================================================*\
     * Templates
    \*========================================================================*/
    /**
     * @property {String} urlPrefix
     */
    urlPrefix: '/jquery.ui.editor/',

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
            if (split.length == 1) {
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
     * @property {Object} defaultUi
     */
    defaultUi: {
        ui: null,
        editor: null,
        options: null,
        init: function(editor, options) {},
        persist: function(key, value) {
            return this.editor.persist(key, value);
        },
        bind: function(name, callback, context) {
            this.editor.bind(name, callback, context || this);
        },
        unbind: function(name, callback, context) {
            this.editor.unbind(name, callback, context || this);
        }
    },

    /**
     *
     * @param {Object|String} mixed
     * @param {Object} [ui]
     */
    registerUi: function(mixed, ui) {
        // Allow array objects, and single plugins
        if (typeof(mixed) === 'string') {
            // <strict>
            if (this.ui[mixed]) {
                handleError(_('UI "{{name}}" has already been registered, and will be overwritten', {name: mixed}));
            }
            // </strict>
            this.ui[mixed] = $.extend({}, this.defaultUi, ui);
        } else {
            for (var name in mixed) {
                this.registerUi(name, mixed[name]);
            }
        }
    },

    /**
     * @property {Object} defaultPlugin
     */
    defaultPlugin: {
        editor: null,
        options: null,
        init: function(editor, options) {},
        persist: function(key, value) {
            return this.editor.persist(key, value);
        },
        bind: function(name, callback, context) {
            this.editor.bind(name, callback, context || this);
        },
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
            if (this.plugins[mixed]) handleError(_('Plugin "{{pluginName}}" has already been registered, and will be overwritten', {pluginName: mixed}));
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
                if (this[i] == callback) {
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
        if (debugLevel >= MAX) debug('Firing global/static event: ' + name);
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
        } else if (!$.cookie) {
            info('FIXME: use cookies');
        }

        return value;
    },

    /*========================================================================*\
     * Internationalisation
    \*========================================================================*/
    /**
     * @property {String|null} currentLocale
     */
    currentLocale: null,

    /**
     * @property {Object} locales
     */
    locales: {},

    /**
     * @property {Object} localeNames
     */
    localeNames: {},

    /**
     * @param {String} name
     * @param {String} nativeName
     * @param {Object} String
     */
    registerLocale: function(name, nativeName, strings) {
        // <strict>
        if (this.locales[name]) {
            handleError(_('Locale "{{localeName}}" has already been registered, and will be overwritten', {localeName: name}));
        }
        // </strict>

        this.locales[name] = strings;
        this.localeNames[name] = nativeName;
        if (!this.currentLocale) this.currentLocale = name;
    },

    /**
     * @param {String} string
     * @returns {String}
     */
    translate: function(string) {
          if (this.currentLocale && this.locales[this.currentLocale]
                && this.locales[this.currentLocale][string]) {
            string = this.locales[this.currentLocale][string];
        }
        return string;
    }

});
