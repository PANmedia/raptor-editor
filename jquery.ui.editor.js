console.info('TODO: use cookies when local storage is not available, or chosen by option');
console.info('TODO: make a way to disable all buttons then selectivity enable ones');
console.info('TODO: allow buttons to flow to multiple lines if tool bar is constrained in width');
console.info('TODO: locale switches should affect all instances');
console.info('FIXME: remove editor instance from instances array on destroy');
console.info('FIXME: custom tool tips');
console.info('FIXME: Check for localStorage or use jQuery cookie');
console.info('FIXME: updateTagTree click bindings');
console.info('FIXME: updateTagTree should filter out duplicates');
console.info('FIXME: Check for duplicate elements in getSelectedElements');

/**
 *
 * Events:
 *   resize
 *     Triggers when the page, or an element is resized to allow plugins to adjust their position
 *   change
 *     Triggers when ever the element content is change, or the selection is changed
 *   ready
 *     Triggers after the editor has been initialised, (but possibly before the editor is shown and enabled)
 *   show
 *     Triggers when the toolbar/dialog is shown
 *   hide
 *     Triggers when the toolbar/dialog is hidden
 *   enabled
 *     Triggers when the editing is enabled on the element
 *   disabled
 *     Triggers when the editing is disabled on the element
 *
 */

var _;

(function() {
    
    // <strict>
    
    // Ensure jQuery has been included
    if (!$) console.error(_('jQuery is required'));
    
    // Ensure jQuery UI has been included
    if (!$.ui) console.error(_('jQuery UI is required'));
    
    // </strict>
    
    // <debug>
    var MIN = 100;
    var MID = 500;
    var MAX = 1000;
    var debugLevel = MIN;
    // </debug>

    function initialise() {
        // <strict>
            // Ensure rangy has been included
            if (!rangy) console.error(_('Rangy is required. This library should have been included with the file you downloaded. If not, acquire it here: http://code.google.com/p/rangy/"'));
            // Ensure dialog has been included
            if (!$.ui.dialog) console.error(_('jQuery UI Dialog is required.'));
            // Ensure dialog has been included
            if (!$.ui.position) console.error(_('jQuery UI Position is required.'));
            // Warn that no internationalizations have been loaded
            //if (!plugins.i18n) console.info(_('No internationalizations have been loaded, defaulting to English'));
        // </strict>
        
//            // <debug>
//            if (!jQuery.cookie) console.error(_('jQuery cookie has not been loaded - persistence functions will not be available'));
//            // </debug>
//            if (this.options.customTooltips && !$.isFunction($.fn.tipTip)) {
//                this.options.customTooltips = false;
//                // <strict>
//                console.error(_('Custom tooltips was requested but tipTip has not been loaded. This library should have been in the file you downloaded. If not, acquire it here: http://code.drewwilson.com/entry/tiptip-jquery-plugin'));
//                // </strict>
//            }
        
        rangy.init();
        if (!$.isFunction(rangy.rangePrototype.insertNodeAtEnd)) {
            rangy.rangePrototype.insertNodeAtEnd = function(node) {
                var range = this.cloneRange();
                range.collapse(false);
                range.insertNode(node);
                range.detach();
                this.setEndAfter(node);
            };
        }
        
        $(window).bind('beforeunload', $.proxy($.ui.editor.unloadWarning, $.ui.editor));
    }
    
    function unbind(events, callback) {
        for (var i in events) {
            if (events[i] === callback) {
                events.splice(i, 1);
            }
        }
    }
    
    // Private functions
    
    // Private variables
    
    // Events added via $.ui.editor.bind
    var events = {};

    // Plugins added via $.ui.editor.addPlugin
    var plugins = {};

    // UI added via $.ui.editor.registerUi
    var registeredUi = {};
    
    /**************************************************************************\
     * Editor class instance definition
    \**************************************************************************/
    $.widget('ui.editor', {

        /**********************************************************************\
         * Default options
        \**********************************************************************/
        options: {
            // Plugin and UI option overrides
            plugins: {},
            ui: {},
            
            // Namespace used to persistence to prevent conflicting stored values
            namespace: null,
            
            // The current locale of the editor
            locale: '',
            
            // Switch to indicated that some events should be automatically applied to all editors that are 'unified'
            unify: true,

            // Switch to indicate weather or not to stored persistent values, if set to false the persist function will always return null
            persistence: true,
            
            // The name to store persistent values under
            persistenceName: 'uiEditor',
            
            // Switch to indicate weather or not to a warning should pop up when the user navigates aways from the page and there are unsaved changes
            unloadWarning: true,
            
            // Switch to automatically enabled editing on the element
            autoEnable: false,
            
            // Switch to specify if the editor should automatically enable all plugins, if set to false, only the plugins specified in the 'plugins' option object will be enabled
            enablePlugins: true,
            
            // An array of explicitly disabled plugins
            disabledPlugins: [],
            
            // And array of arrays denoting the order and grouping of UI elements in the toolbar
            uiOrder: null,
            
            // Switch to specify if the editor should automatically enable all UI, if set to false, only the UI specified in the 'ui' option object will be enabled
            enableUi: true,
            
            // An array of explicitly disabled UI elements
            disabledUi: [],
            
            // Switch to indicate that the element the editor is being applied to should be replaced with a div (useful for textareas), the value/html of the replaced element will be automatically updated when the editor element is changed
            replace: false,
            
            // A list of styles that will be copied from the replaced element and applied to the editor replacement element
            replaceStyle: [
                'display', 'position', 'float', 'width',
                'padding-left', 'padding-right', 'padding-top', 'padding-bottom',
                'margin-left', 'margin-right', 'margin-top', 'margin-bottom'
            ],
            
            cssPrefix: 'cms-',
            baseClass: 'ui-editor',
            
            dialogClass: 'ui-editor-dialog',
            dialogPosition: [5, 47]

        },


        /**********************************************************************\
         * Constructor
        \**********************************************************************/
        _init: function() {
            $.ui.editor.instances.push(this);
            
            // Set the options after the widget initialisation, because jQuery UI widget tries to extend the array (and breaks it)
            this.options.uiOrder = this.options.uiOrder || [
                ['save', 'cancel'], 
                ['dock', 'show-guides', 'clean'],
                ['view-source'],
                ['undo', 'redo'],
                ['align-left', 'align-center', 'align-justify', 'align-right'],
                ['text-bold', 'text-italic', 'text-underline', 'text-strike'],
                ['list-unordered', 'list-ordered'],
                ['hr', 'quote-block'],
                ['font-size-inc', 'font-size-dec'],
                ['link', 'unlink'],
                ['float-left', 'float-none', 'float-right'],
                ['tag-menu'],
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
            
            // Undo stack, redo pointer
            this.history = []; 
            this.present = 0; 
            this.historyEnabled = true; 
            
            this.setOriginalHtml(this.element.is(':input') ? this.element.val() : this.element.html());
            
            // Replace the original element with a div (if specified)
            if (this.options.replace) {
                this.replaceOrignal();
                this.options.replace = false;
            }
            
            this.loadToolbar();
            this.loadMessages();
            this.updateTagTree();
            this.attach();
            
            this.loadPlugins();
            this.loadUi();
            
            if (this.options.show) {
                this.showToolbar(); 
            }
            
            if (this.options.enabled) {
                this.enableEditing(); 
            }
            
            this.ready = true;
            this.fire('ready');
            this.fire('change');
            
            if (this.options.autoEnable) {
                this.enableEditing();
                this.showToolbar();
            }
        },

        /**********************************************************************\
         * Core functions
        \**********************************************************************/
        attach: function() {
            var editor = this;
            editor.bind('change', editor.historyPush);
            editor.bind('change', editor.updateTagTree);
            
            var change = function() {
                editor.fire('change');
            };
            
            editor.getElement().bind('click.' + editor.widgetName, change);
            editor.getElement().bind('keyup.' + editor.widgetName, change);
            editor.bind('destroy', function() {
                editor.getElement().unbind('click.' + editor.widgetName, change)
                editor.getElement().unbind('keyup.' + editor.widgetName, change)
            })
//            console.log(this.selDialog('.ui-dialog-titlebar a'));
//            this.selDialog('.ui-dialog-titlebar a')
//                    .die('click.' + this.widgetName)
//                    .live('click.' + this.widgetName, function() {
//                        console.log($(this));
//                    });
        },
        
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
            console.info('Reinitialising editor');
            // </debug>
            // We are ready, so we can run reinit now
            this.reiniting = true;
            this.destruct(true);
            this._init();
            this.reiniting = false;
        },
        
        getElement: function() {
            return this.target ? this.target : this.element;
        },
        
        replaceOrignal: function() {
            if (this.target) return;
            
            var target = $('<div/>')
                .html(this.element.is(':input') ? this.element.val() : this.element.html())
                .insertBefore(this.element)
                .attr('id', this.getUniqueId());
                
            var style = this.getStyles(this.element);
            for (var i in this.options.replaceStyle) {
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

        /**********************************************************************\
         * Destructor
        \**********************************************************************/
        destruct: function(reinit) {
            // Disable editing unless we are re initialising
            if (!this.reiniting) {
                this.hideToolbar();
                this.disableEditing();
            }
            
            // Trigger destory event, for plugins to remove them selves
            this.fire('destroy', false);
            
            // Remove all event bindings
            this.events = {};
        },

//        _selection: {
//
//            wrapWithTag: function(tag, options) {
//                if (typeof options == 'undefined') options = {};
//
//                if(tag == 'ul' || tag == 'ol') {
//                    this._selection.wrapWithList.call(this, tag, options);
//                    return;
//                }
//
//                var classes = typeof options.classes != 'undefined' ? options.classes : tag;
//
//                this._selection.enforceLegality.call(this);
//
//                rangy.createCssClassApplier(this.options.cssPrefix + classes, {
//                    normalize: true,
//                    elementTagName: tag
//                }).toggleSelection();
//
//                this.trigger('change');
//            },
//
//            wrapWithList: function(tag, options) {
//                if (typeof options == 'undefined') options = {};
//
//                var editorInstance = this,
//                    create_applier = function(tag) {
//                        return rangy.createCssClassApplier(editorInstance.options.cssPrefix + tag, {
//                            normalize: true,
//                            elementTagName: tag
//                        });
//                    };
//
//                this._selection.enforceLegality.call(this);
//                $(rangy.getSelection().getAllRanges()).each(function(){
//                    if (this.startOffset == this.endOffset) {
//                        var list = $('<' + tag + ' class="' + editorInstance.options.cssPrefix + tag + '">'
//                                + '<li class="' + editorInstance.options.cssPrefix + 'li">' + _('First list item') + '</li></' + tag + '>');
//                        editorInstance._content.replaceRange.call(editorInstance, list, this);
//                        editorInstance._selection.selectElement.call(editorInstance, list.find('li:first'));
//                    } else {
//                        create_applier(tag).applyToRange(this);
//                        create_applier('li').applyToRange(this);
//                    }
//                });
//                this.trigger('change');
//            },
//
//            replaceWithTag: function(tag, options) {
//                if (typeof options == 'undefined') options = {};
//                this._selection.enforceLegality.call(this);
//
//                var classes = this.options.cssPrefix + ' ' + tag;
//                classes += (typeof options.classes != 'undefined') ? ' ' + options.classes : '';
//
//                this._selection.replace.call(this, $('<' + tag + ' class="' + classes + '"/>'));
//            },
//
//            insertTag: function(tag, options) {
//                if (typeof options == 'undefined') options = {};
//
//                this._selection.enforceLegality.call(this);
//
//                var classes = this.options.cssPrefix + ' ' + tag;
//                classes += (typeof options.classes != 'undefined') ? ' ' + options.classes : '';
//
//                this._selection.insert.call(this, $('<' + tag + ' class="' + classes + '"/>'));
//            },
//
//            replace: function(replacement) {
//                var editorInstance = this;
//                $(rangy.getSelection().getAllRanges()).each(function(){
//                    editorInstance._selection.replaceRange.call(editorInstance, replacement, this);
//                });
//            },
//
//            replaceRange: function(replacement, range) {
//                
//
//                range.deleteContents();
//                if (typeof replacement.length === "undefined" || replacement.length == 1) {
//                    range.insertNode(replacement[0].cloneNode(true));
//                } else {
//                    for (i = replacement.length - 1; i >= 0; i--) {
//                        range.insertNode(replacement[i].cloneNode(true));
//                    }
//                }
//
//                this.trigger('change');
//            },
//
//            insert: function(insert) {
//                
//                $(rangy.getSelection().getAllRanges()).each(function(){
//                    this.insertNode($(insert).get(0));
//                });
//                this.trigger('change');
//            },
//
//            changeTag: function(tag, options) {
//                if (typeof options == 'undefined') options = {};
//
//                
//
//                var applier = new_element = null;
//
//                if (this._selection.exists.call(this)) {
//
//                    applier = rangy.createCssClassApplier(this.options.cssPrefix + tag, {
//                        normalize: true,
//                        elementTagName: tag
//                    }).toggleSelection();
//
//                } else {
//                    if (this._util.isRoot.call(this, this._editor.selectedElement)) {
//                        this._editor.selectedElement = this.getElement().find(':first');
//                    }
//                    new_element = $('<' + tag + '>' + this._editor.selectedElement.html() + '</' + tag + '>');
//
//                    if (typeof this._editor.selectedElement.attr('class') != 'undefined') {
//                        new_element.addClass(this._editor.selectedElement.attr('class'));
//                    }
//                    if (typeof this._editor.selectedElement.attr('style') != 'undefined') {
//                        new_element.css(this._editor.selectedElement.attr('style'));
//                    }
//                    $(this._editor.selectedElement).replaceWith(new_element);
//                }
//
//                this._actions.refreshSelectedElement.call(this);
//                this._actions.updateTitleTagList.call(this);
//
//                this.trigger('change');
//            },
//
        selectionExists: function() {
            this.constrainSelection();
            var ranges = rangy.getSelection().getAllRanges();
            if (!ranges.length) return false;

            if (ranges.length > 1) {
                return true;
            } else {
                return ranges[0].startOffset != ranges[0].endOffset;
            }
        },
        
        selectElement: function(element) {
            rangy.getSelection().selectAllChildren($(element)[0]);
            this.getElement().focus();
        },
        
//        selectElement: function(element) {
//            var selection = rangy.getSelection();
//            selection.removeAllRanges();
//            
//            $(element).each(function() {
//                var range = rangy.createRange();
//                range.selectNodeContents(this);
//                selection.addRange(range);
//            });
//            
//            $(element).focus();
//            this.trigger('change');
//        },

        selectAll: function() {
            var selection = rangy.getSelection();
            selection.removeAllRanges();
            $.each(this.getElement().contents(), function() {
                var range = rangy.createRange();
                range.selectNodeContents(this);
                selection.addRange(range);
            });
            this.getElement().focus();
            this.fire('change');
        },



        /**********************************************************************\
         * Persistance Functions
        \**********************************************************************/
        persist: function(key, value) {
            if (!this.options.persistence) return null;
            return $.ui.editor.persist(key, value, this.options.namespace);
        },
        
        /**********************************************************************\
         * Other Functions
        \**********************************************************************/
        enableEditing: function() {
            if (!this.options.enabled || this.reiniting) {
                this.options.enabled = true;
                this.getElement().attr('contenteditable', true)
                            .addClass(this.options.baseClass + '-editing');
                document.execCommand('enableInlineTableEditing', false, false);
                document.execCommand('enableObjectResizing', false, false);
                document.execCommand('styleWithCSS', true, true);
                this.fire('enabled');
                this.fire('resize');
                this.fire('change');
            }
        },
        
        disableEditing: function() {
            if (this.options.enabled) {
                this.options.enabled = false;
                this.getElement().attr('contenteditable', false)
                            .removeClass(this.options.baseClass + '-editing');
                this.fire('disabled');
            }
        },
        
        isEditing: function() {
            return this.options.enabled;
        },
        
        updateTagTree: function() {
            var editor = this;
            var title = '';
            
            // An array of ranges (by index), each with a list of elements in the range
            var lists = []; 
                
            // Loop all selected ranges
            var ranges = rangy.getSelection().getAllRanges();
            for (var i in ranges) {
                // Get the selected nodes common parent
                var node = ranges[i].commonAncestorContainer;
                
                var element;
                if (node.nodeType === 3) {
                    // If nodes common parent is a text node, then use its parent
                    element = $(node).parent();
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
                for (var j in list) {
                    title += this.getTemplate('tag', {
                        element: list[j][0].tagName.toLowerCase(),
                        // Create a data attribute with the index to the range, and element (so [0,0] will be the first range/first element)
                        data: '[' + i + ',' + j + ']'
                    });
                }
            }
            if (!title) title = this.getTemplate('root');
            this.selDialog('.ui-dialog-title')
                .html(title)
                .find('a')
                .click(function() {
                    // Get the range/element data attribute
                    var i = $(this).data('ui-editor-selection');
                    if (i) {
                        // Get the element from the list array
                        editor.selectElement(lists[i[0]][i[1]]);
                        editor.updateTagTree();
                    } else {
                        editor.selectElement(editor.getElement());
                    }
                });
        },
        
        isRoot: function(element) {
            return this.getElement()[0] == element[0];
        },
        
        unify: function(callback, callSelf) {
            if (callSelf !== false) callback(this);
            if (this.options.unify) {
                for (var i in $.ui.editor.getInstances()) {
                    if ($.ui.editor.getInstances()[i] != this &&
                            $.ui.editor.getInstances()[i].options.unify) {
                        callback($.ui.editor.getInstances()[i]);
                    }
                }
            }
        },
    
        getStyles: function(element) {
            var result = {};
            var style = window.getComputedStyle(element[0], null);
            for (var i in style){
                result[style[i]] = style.getPropertyValue(style[i]);
            };
            return result;
        },
    
        swapStyles: function(element1, element2, style) {
            for (var name in style) {
                element1.css(name, element2.css(name));
                element2.css(name, style[name]);
            }
        },
        
        getUniqueId: function() {
            return $.ui.editor.getUniqueId();
        },

        /**********************************************************************\
         * Messages
        \**********************************************************************/
        loadMessages: function() {
            $(this.getTemplate('messages')).appendTo(this.selToolbar());
        },
        
        showMessage: function(type, messages) {
            if (!$.isArray(messages)) messages = [messages];

            var editor = this;
            $.each(messages, function(i, message) {
                var message = $(editor.getTemplate('message', {
                    type: type,
                    message: message
                }))
                message
                    .hide()
                    .appendTo(editor.selMessages())
                    .slideDown()
                    .delay(5000)
                    .slideUp(function() { 
                        message.remove(); 
                    })
                    .find('.ui-editor-message-close')
                    .click(function() { 
                        message.stop().slideUp(function() { 
                            message.remove(); 
                        }) 
                    });
            });
        },
        
        showLoading: function(messages) {
            this.showMessage('clock', messages);
        },
        
        showInfo: function(messages) {
            this.showMessage('info', messages);
        },
        
        showError: function(messages) {
            this.showMessage('circle-close', messages);
        },
        
        showConfirm: function(messages) {
            this.showMessage('circle-check', messages);
        },
        
        showWarning: function(messages) {
            this.showMessage('alert', messages);
        },
        

        /**********************************************************************\
         * Toolbar
        \**********************************************************************/
        loadToolbar: function() {
            var editor = this;
            var pos = this.persist('position') || editor.options.dialogPosition;
            
            editor.toolbar = $('<div class="' + editor.options.baseClass + '-toolbar"/>');
            editor.toolbar.append('<div class="' + editor.options.baseClass + '-inner"/>');
            
            editor.toolbar.dialog({
                position: pos,
                resizable: false,
                closeOnEscape: false,
                width: 'auto',
                height: 'auto',
                minHeight: 'auto',
                resize: 'auto',
                zIndex: 32000,
                title: _('Editor loading...'),
                autoOpen: false,
                dialogClass: editor.options.dialogClass,
                dragStop: function() {
                    var pos = editor.selDialog().position()
                    editor.unify(function(editor) {
                        editor.reposition(pos.top, pos.left)
                    });
                },
                open: function(event, ui) {
                    $(editor.toolbar).parent()
                        .find('.ui-dialog-titlebar-close', ui)
                        .remove();
                }
            });
            
            editor.bind('destroy', function() {
                editor.toolbar.dialog('destory')
                if (!editor.reiniting) {
                    editor.toolbar.remove();
                }
            });
        },
        
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
        
        hideOtherToolbars: function(instant) {
            for (var i in $.ui.editor.getInstances()) {
                if ($.ui.editor.getInstances()[i] != this) {
                    $.ui.editor.getInstances()[i].hideToolbar(instant);
                }
            }
        },
        
        isToolbarVisible: function() {
            return this.options.show;
        },
        
        dialog: function() {
            return this.toolbar.dialog.apply(this.toolbar, arguments);
        },
        
        reposition: function(top, left) {
            this.selToolbar().dialog('option', 'position', [left, top]);
            this.persist('position', [left, top]);
        },

        /**********************************************************************\
         * Template functions
        \**********************************************************************/
        getTemplate: function(name, variables) {
            var template;
            if (!this.templates[name]) {
                template = $.ui.editor.getTemplate(name);
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
        
        getTemplateVars: function(variables, prefix) {
            prefix = prefix ? prefix + '.' : '';
            var result = {};
            for (var name in variables) {
                if (typeof variables[name] == 'object') {
                    var inner = this.getTemplateVars(variables[name], prefix + name);
                    for (var innerName in inner) {
                        result[innerName] = inner[innerName];
                    }
                } else {
                    result[prefix + name] = variables[name];
                }
            }
            return result;
        },

        /**********************************************************************\
         * History functions
        \**********************************************************************/
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
        
        historyPeak: function() {
            if (!this.history.length) return null;
            return this.history[this.present];
        },
        
        historyBack: function() {
            if (this.present > 0) {
                this.present--;
                this.setHtml(this.history[this.present]);
                this.historyEnabled = false;
                this.fire('change');
                this.historyEnabled = true;
            }
        },
        
        historyForward: function() {
            if (this.present < this.history.length - 1) {
                this.present++;
                this.setHtml(this.history[this.present]);
                this.historyEnabled = false;
                this.fire('change');
                this.historyEnabled = true;
            }
        },

        /**********************************************************************\
         * Range functions
        \**********************************************************************/
        constrainSelection: function() {
            var element = this.getElement()[0];
            var commonAncestor;
            var selection = rangy.getSelection();

            $(selection.getAllRanges()).each(function(i, range){
                if (this.commonAncestorContainer.nodeType == 3) {
                    commonAncestor = $(range.commonAncestorContainer).parent().get(0)
                } else {
                    commonAncestor = range.commonAncestorContainer;
                }
                if (element !== commonAncestor && !$.contains(element, commonAncestor)) {
                    selection.removeRange(range);
                }
            });
        },
        
        getSelectedElements: function() {
            var result = new jQuery();
            this.constrainSelection();
            $(rangy.getSelection().getAllRanges()).each(function() {
                var commonAncestor;
                if (this.commonAncestorContainer.nodeType == 3) {
                    commonAncestor = $(this.commonAncestorContainer).parent().get(0)
                } else {
                    commonAncestor = this.commonAncestorContainer;
                }
                result.push(commonAncestor);
            });
            return result;
        },
        
        toggleWrapper: function(tag, options) {
            this.constrainSelection();
            
            if (!options) options = {};
            var classes = options.classes ? options.classes : tag;

            rangy.createCssClassApplier(this.options.cssPrefix + classes, {
                normalize: true,
                elementTagName: tag
            }).toggleSelection();

            this.fire('change');
        },
        
        execCommand: function(command, arg1, arg2) {
            this.constrainSelection();
            document.execCommand(command, arg1, arg2);
            this.fire('change');
        },
        
        insertElement: function(element) {
            element = $('<' + element + '/>')[0];
            this.constrainSelection();
            $(rangy.getSelection().getAllRanges()).each(function(i, range) {
                range.insertNode(element);
            });
            this.fire('change');
        },
        
        applyStyle: function(styles) {
            this.constrainSelection();
            $.each(this.getSelectedElements(), function(i, element) {
                $.each(styles, function(property, value) {
                    if ($(element).css(property) == value) {
                        $(element).css(property, '');
                    } else {
                        $(element).css(property, value);
                    }
                });
            });

            this.fire('change');
        },
        
        replaceSelection: function(html) {
            var nodes = $('<div/>').append(html)[0].childNodes;
            $(rangy.getSelection().getAllRanges()).each(function(i, range) {
                range.deleteContents();
                if (nodes.length === undefined || nodes.length == 1) {
                    range.insertNode(nodes[0].cloneNode(true));
                } else {
                    $.each(nodes, function(i, node) {
                        range.insertNodeAtEnd(node.cloneNode(true));
                    });
                }
            });
            
            this.fire('change');
        },
        
        changeTag: function(tag) {
            console.info('TODO: Review editor.changeTag function')

//            var new_element = null;

            $.each(rangy.getSelection().getAllRanges(), function() {
                console.log(this);
            });
//            if (this.selectionExists()) {
//                rangy.createCssClassApplier(this.options.cssPrefix + tag, {
//                    normalize: true,
//                    elementTagName: tag
//                }).toggleSelection();
//            } else {
////                if (this._util.isRoot.call(this, this._editor.selectedElement)) {
//                    this._editor.selectedElement = this.getElement().find(':first');
//                }
//                new_element = $('<' + tag + '>' + this._editor.selectedElement.html() + '</' + tag + '>');
//
//                if (typeof this._editor.selectedElement.attr('class') != 'undefined') {
//                    new_element.addClass(this._editor.selectedElement.attr('class'));
//                }
//                if (typeof this._editor.selectedElement.attr('style') != 'undefined') {
//                    new_element.css(this._editor.selectedElement.attr('style'));
//                }
//                $(this._editor.selectedElement).replaceWith(new_element);
//            }

            this.fire('change');
        },
        
        /**********************************************************************\
         * Selectors
        \**********************************************************************/
        selToolbar: function(find) {
            if (find) {
                return this.toolbar.find(find);
            }
            return this.toolbar;
        },
        
        selTitle: function(find) {
            var titlebar = this.selDialog('.ui-dialog-titlebar');
            if (find) {
                return titlebar.find(find);
            }
            return titlebar;
        },
        
        selDialog: function(find) {
            var dialog = this.selToolbar().parent();
            if (find) {
                return dialog.find(find);
            }
            return dialog;
        },
        
        selMessages: function(find) {
            var messages = this.selToolbar().find('.' + this.options.baseClass + '-messages');
            if (find) {
                return messages.find(find);
            }
            return messages;
        },
        

        /**********************************************************************\
         * Buttons
        \**********************************************************************/
        loadUi: function() {
            var editor = this;
            // Loop the UI order option
            for (var i in this.options.uiOrder) {
                var uiSet = this.options.uiOrder[i];
                // Each element of the UI order should be an array of UI which will be grouped
                var uiGroup = $('<div/>');
                
                // Loop each UI in the array
                for (var j in uiSet) {
                    // Check if we are not automaticly enabling UI, and if not, check if the UI was manually enabled
                    if (!this.options.enableUi &&
                            !this.options.ui[uiSet[j]]) continue;
                        
                    // Check if we have explicitly disabled UI 
                    if ($.inArray(uiSet[j], this.options.disabledUi) !== -1) continue;
                    
                    // Check the UI has been registered
                    if (registeredUi[uiSet[j]]) {
                        var options = $.extend({}, editor.options, {
                            baseClass: editor.options.baseClass + '-ui-' + uiSet[j]
                        }, options, editor.options.ui[uiSet[j]])
                        
                        
                        // Clone the UI object (which should be extended from the defaultUi object)
                        var uiObject = $.extend({}, registeredUi[uiSet[j]]);
                        uiObject.editor = editor;
                        uiObject.options = options;
                        uiObject.ui = uiObject.init(editor, options);
                        
                        // Append the UI object to the group
                        uiObject.ui.init(uiSet[j], editor, options, uiObject).appendTo(uiGroup);
                    }
                    // <strict>
                    else {
                        console.error(_('UI identified by key "{{ui}}" does not exist', { ui: ui }));
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
        
        uiButton: function(options) {
            return $.extend({
                button: null,
                options: {},
                init: function(name, editor, options, object) {
                    // Extend options overriding editor < base class < supplied options < user options
                    var options = $.extend({}, editor.options, {
                        baseClass: editor.options.baseClass + '-' + name + '-button'
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
                        icons: { primary: this.icon || 'ui-icon-' + name },
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

                    // Extend options overriding editor < base class < supplied options < user options
                    var options = $.extend({}, editor.options, {
                        baseClass: editor.options.baseClass + '-button-' + name
                    }, ui.options, editor.options.ui[name])

                    // Default title if not set in plugin
                    if (!this.title) this.title = _('Unnamed Select Menu');

                    ui.selectMenu = $('<div class="ui-editor-selectmenu"/>')
                        .attr('title', this.title);

                    ui.selectMenu.append(this.select.hide());
                    ui.menu = $('<div class="ui-editor-selectmenu-menu ui-widget-content ui-corner-bottom ui-corner-tr"/>').hide().appendTo(this.selectMenu);
                    ui.select.find('option').each(function() {
                        var option = $('<div class="ui-editor-selectmenu-menu-item ui-corner-all"/>')
                            .html($(this).html())
                            .appendTo(ui.menu)
                            .bind('mouseenter.' + editor.widgetName, function() { $(this).addClass('ui-state-focus') })
                            .bind('mouseleave.' + editor.widgetName, function() { $(this).removeClass('ui-state-focus') })
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

                    ui.button = $('<div class="ui-editor-selectmenu-button"/>')
                      .button({ icons: { secondary: 'ui-icon-triangle-1-s' } })
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

        /**********************************************************************\
         * Plugins
        \**********************************************************************/
        getPlugin: function(name) {
            return this.plugins[name];
        },
        
        loadPlugins: function() {
            var editor = this;
            if (!this.options.plugins) this.options.plugins = {};
            for (var name in plugins) {
                // Check if we are not automaticly enabling plugins, and if not, check if the plugin was manually enabled
                if (!this.options.enablePlugins &&
                        !this.options.plugins[name]) continue;
                    
                // Check if we have explicitly disabled the plugin
                if ($.inArray(name, this.options.disabledPlugins) !== -1) continue;
                    
                // Clone the plugin object (which should be extended from the defaultPlugin object)
                var pluginObject = $.extend({}, plugins[name]);
                
                var options = $.extend({}, editor.options, {
                    baseClass: editor.options.baseClass + '-' + name
                }, pluginObject.options, editor.options.plugins[name]);
                
                pluginObject.editor = editor;
                pluginObject.options = options;
                pluginObject.init(editor, options);
                
                editor.plugins[name] = pluginObject;
            };
        },
        

        /**********************************************************************\
         * Content accessors
        \**********************************************************************/
        isDirty: function() {
            return this.getOriginalHtml() != this.getHtml();
        },
        
        cleanHtml: function(html) {
            var content = $('<div/>').html(html);
            content.find('.rangySelectionBoundary').remove();
            return content.html();
        },
        
        getHtml: function() {
            return this.cleanHtml(this.getElement().html());
        },
        
        setHtml: function(html) {
            this.getElement().html(html);
            this.fire('change');
        },
        
        resetHtml: function() {
            this.setHtml(this.getOriginalHtml());
        },
        
        getOriginalHtml: function() {
            return this.getElement().data('uiWidgetEditorOriginalHtml');
        },
        
        setOriginalHtml: function(html) {
            return this.getElement().data('uiWidgetEditorOriginalHtml', html);
        },

        /**********************************************************************\
         * Event handling
        \**********************************************************************/
        bind: function(name, callback, context) {
            // <strict>
            if (!$.isFunction(callback)) console.error('Must bind a valid callback, ' + name + ' was a ' + typeof callback);
            // </strict>
            if (!this.events[name]) this.events[name] = [];
            this.events[name].push({
                context: context,
                callback: callback
            });
        },

        unbind: function(callback) {
            for (var name in this.events) {
                var events = this.events[name];
                for (var i = 0; i < events.length; i++) {
                    if (events[i] == callback) {
                        events.splice(i,1);
                    }
                }
            }
        },

        fire: function(name, global) {
            if (this.events[name]) {
                for (var i in this.events[name]) {
                    var event = this.events[name][i];
                    event.callback.call(event.context || this);
                }
            }
            // Also trigger the global editor event, unless specified not to
            if (global !== false) {
                $.ui.editor.fire(name);
            }
        },

        /**********************************************************************\
         * Internationalisation
        \**********************************************************************/
        getLocale: function() {
            return $.ui.editor.currentLocale;
        },
        
        setLocale: function(key) {
            if ($.ui.editor.currentLocale !== key) {
                $.ui.editor.currentLocale = key;
                this.reinit();
            }
        },
        
        getLocales: function() {
            return $.ui.editor.locales;
        },
        
        getLocaleName: function(key) {
            return $.ui.editor.localeNames[key];
        }

    });

    /**************************************************************************\
     * Global static class definition
    \**************************************************************************/
    $.extend($.ui.editor, {
        instances: [],
        
        getInstances: function() {
            return this.instances;
        },
        
        /**********************************************************************\
         * Templates
        \**********************************************************************/
        urlPrefix: '/jquery.ui.editor/',
        templates: { /* <templates/> */ },
        
        getTemplate: function(name) {
            var template;
            if (!this.templates[name]) {
                // Parse the URL
                var url = this.urlPrefix;
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
        
        /**********************************************************************\
         * Helpers
        \**********************************************************************/
        getUniqueId: function() {
            var id = $.ui.editor.prototype.options.baseClass + '-uid-' + new Date().getTime() + '-' + Math.floor(Math.random() * 100000);
            while ($('#' + id).length) {
                id = $.ui.editor.prototype.options.baseClass + '-uid-' + new Date().getTime() + '-' + Math.floor(Math.random() * 100000);
            }
            return id;
        },
        
        isDirty: function() {
            var instances = this.getInstances();
            for (var i in instances) {
                if (instances[i].isDirty()) return true;
            }
            return false;
        },
        
        unloadWarning: function() {
            var instances = this.getInstances();
            for (var i in instances) {
                if (instances[i].isDirty() && 
                        instances[i].isEditing() && 
                        instances[i].options.unloadWarning) {
                    return _('\nThere are unsaved changes on this page. \nIf you navigate away from this page you will lose your unsaved changes');
                }
            }
        },
        
        /**********************************************************************\
         * Plugins as UI
        \**********************************************************************/
        defaultUi: {
            ui: null,
            editor: null,
            options: null,
            init: function(editor, options) {},
            persist: function(key, value) {
                return this.editor.persist(key, value);
            }
        },
        
        registerUi: function(uiSet) {
            for (var name in uiSet) {
                // <strict>
                if (registeredUi[name]) {
                    console.error(_('UI "{{name}}" has already been registered, and will be overwritten', {name: name}));
                }
                // </strict>
                registeredUi[name] = $.isFunction(uiSet[name]) ? uiSet[name] : $.extend({}, this.defaultUi, uiSet[name]);
            };
        },

        defaultPlugin: {
            editor: null,
            options: null,
            bindings: {},
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
        
        registerPlugin: function(name, plugin) {
            // <strict>
            if (plugins[name]) console.error(_('Plugin "{{pluginName}}" has already been registered, and will be overwritten', {pluginName: name}));
            // </strict>

            plugins[name] = $.isFunction(plugin) ? plugin : $.extend({}, this.defaultPlugin, plugin);
        },

        /**********************************************************************\
         * Events
        \**********************************************************************/
        bind: function(name, callback) {
            if (!events[name]) events[name] = [];
            events[name].push(callback);
        },

        unbind: function(callback) {
            $.each(events, function(name) {
                for (var i = 0; i < this.length; i++) {
                    if (this[i] == callback) {
                        events[name].splice(i,1);
                    }
                }
            });
        },

        fire: function(name) {
            // <debug>
            if (debugLevel === MAX) console.info('Calling jquery-ui-editor global/static event: ' + name);
            // </debug>
            if (!events[name]) return;
            for (var i in events[name]) {
                events[name][i].call(this);
            }
        },
        
        /**********************************************************************\
         * Persistance
        \**********************************************************************/
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
            } else {
                console.info('FIXME: use cookies');
            }
            
            return value;
        },
        
        /**********************************************************************\
         * Internationalisation
        \**********************************************************************/
        currentLocale: null,
        locales: {},
        localeNames: {},
        
        registerLocale: function(name, nativeName, strings) {
            // <strict>
            if (this.locales[name]) {
                console.error(_('Locale "{{localeName}}" has already been registered, and will be overwritten', { localeName: name }));
            }
            // </strict>

            this.locales[name] = strings;
            this.localeNames[name] = nativeName;
            if (!this.currentLocale) this.currentLocale = name;
        },
        
        translate: function(string) {
              if (this.currentLocale && this.locales[this.currentLocale]
                    && this.locales[this.currentLocale][string]) {
                string = this.locales[this.currentLocale][string];
            }
            return string;
        }
        
    });
    
    // Internationalisation function
    _ = function(string, variables) {
        string = $.ui.editor.translate(string);
        if (!variables) {
            return string;
        } else {
            $.each(variables, function(key, value) {
                string = string.replace('{{' + key + '}}', value);
            });
            return string;
        }
    };
    
    // jQuery ready event
    $(function() {
        initialise();
        // <debug>
        var result = [];
        for (var key in registeredUi) result.push(key);
        if (debugLevel >= MID) console.info(_('UI loaded: {{ui}} ', {ui: result.join(', ')}));
        
        result = [];
        for (key in plugins) result.push(key);
        if (debugLevel >= MID) console.info(_('Plugins loaded: {{plugins}} ', {plugins: result.join(', ')}));

        // <debug>
        result = [];
        for (var key in $.ui.editor.translations) result.push(key);
        if (debugLevel >= MID) console.info(_('Locales loaded: {{translations}} ', {translations: result.join(', ')}));
        // </debug>
    });
    
    // Select menu close event (triggered when clicked off)
    $('html').click(function(event) {
        var parent = $(event.target).parents('.ui-editor-selectmenu');
        $('.ui-editor-selectmenu-menu').each(function() {
            if ($(this).parent()[0] != parent[0]) {
                $(this).hide();
                $(this).parent().find('.ui-editor-selectmenu-button')
                    .removeClass('ui-corner-top');
            }
        });
    });
    
})();
