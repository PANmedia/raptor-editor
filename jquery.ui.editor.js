console.info('TODO: use cookies when localstorage is not avalible, or chosen by option');
console.info('TODO: make a way to disable all buttons then selectivly enable ones');

/**
 *
 * Events:
 *   resize
 *     Triggers when the page, or an element is resized to allow plugins to adjust their position
 *   change
 *     Triggers when ever the element content is change, or the selection is changed
 *   ready
 *     Triggers after the editor has been initialised, (but possibly before the editor is showen and enabled)
 *   show
 *   hide
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

    function initialise() {
        // <strict>
            // Ensure rangy has been included
            if (!rangy) console.error(_('Rangy is required. This library should have been included with the file you downoaded. If not, acquire it here: http://code.google.com/p/rangy/"'));
            // Ensure dialog has been included
            if (!$.ui.dialog) console.error(_('jQuery UI Dialog is required.'));
            // Warn that no internationalizations have been loaded
            if (!plugins.i18n) console.info(_('No internationalizations have been loaded, defaulting to English'));
        // </strict>
            
        console.info('FIXME: custom tooltips');
        console.info('Check for localStorage or jquery cookie');
        
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
    var instances = [];
    
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
            // Pluing and UI option overrides
            plugins: {},
            ui: {},
            
            locale: '',
            unify: true,
            customTooltips: true,
            persistence: true,
            persistenceName: 'uiEditor',
            urlPrefix: '/jquery.ui.editor/',
            
            cssPrefix: 'cms-',
            baseClass: 'ui-editor',
            
            dialogClass: 'ui-editor-dialog',
            dialogShowAnimation: 'fade',
            dialogHideAnimation: 'fade',
            dialogPosition: [5, 47],

            uiOrder: null
        },


        /**********************************************************************\
         * Constructor
        \**********************************************************************/
        _init: function() {
            instances.push(this);
            
            // Set the options after the widget initialisation, because jQuer UI widget trys to extend the array (and breaks it)
            this.options.uiOrder = this.options.uiOrder || [
                ['dock'],
                ['save', 'cancel', 'show-guides'],
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
            
            this.setOriginalHtml(this.getHtml());
            
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
            this.trigger('ready');
            this.trigger('change');
        },

        /**********************************************************************\
         * Core functions
        \**********************************************************************/
        attach: function() {
            var editor = this;
            editor.bind('change', editor.historyPush);
            editor.bind('change', editor.updateTagTree);
            
            var change = function() {
                editor.trigger('change');
            };
            
            editor.element.bind('click.' + editor.widgetName, change);
            editor.element.bind('keyup.' + editor.widgetName, change);
            editor.bind('destroy', function() {
                editor.element.unbind('click.' + editor.widgetName, change)
                editor.element.unbind('keyup.' + editor.widgetName, change)
            })
            console.info('FIXME: click on path');
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
            // We are ready, so we can run reinit now
            this.destroy(this);
            this._init();
        },

        /**********************************************************************\
         * Destructor
        \**********************************************************************/
        destroy: function(reinit) {
            console.info('FIXME: remove instance from instances array');
            
            // Disable editing unless we are re initialising
            if (!reinit) this.disableEditing();
            
            // Destroy all UI objects
            for (var i in this.ui) {
                this.ui[i].destroy();
            }
            
            // Trigger destory event, for plugins to remove them selves
            this.trigger('destroy', false);
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
//                        this._editor.selectedElement = this.element.find(':first');
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
            this.element.focus();
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
            $.each(this.element.contents(), function() {
                var range = rangy.createRange();
                range.selectNodeContents(this);
                selection.addRange(range);
            });
            this.element.focus();
            this.trigger('change');
        },



        /**********************************************************************\
         * Persistance Functions
        \**********************************************************************/
        persist: function(key, value) {
            if (!this.options.persistence) return null;
            
            if (localStorage) {
                var storage;
                if (localStorage[this.options.persistanceName]) {
                    storage = JSON.parse(localStorage[this.options.persistanceName]);
                } else {
                    storage = {};
                }
                if (value === undefined) return storage[key];
                storage[key] = value;
                localStorage[this.options.persistanceName] = JSON.stringify(storage);
            } else {
                console.info('FIXME: use cookies');
            }
            return value;
        },
        
        /**********************************************************************\
         * Other Functions
        \**********************************************************************/
        enableEditing: function() {
            if (!this.options.enabled) {
                this.options.enabled = true;
                this.element.attr('contenteditable', true)
                            .addClass(this.options.baseClass + '-editing');
                document.execCommand('enableInlineTableEditing', false, false);
                document.execCommand('enableObjectResizing', false, false);
                document.execCommand('styleWithCSS', true, true);
                this.trigger('enabled');
            }
        },
        
        disableEditing: function() {
            if (this.options.enabled) {
                this.options.enabled = false;
                this.element.attr('contenteditable', false)
                            .removeClass(this.options.baseClass + '-editing');
                this.trigger('disabled');
            }
        },
        
        isEditing: function() {
            return this.options.enabled;
        },
        
        updateTagTree: function() {
            console.info('FIXME: updateTagTree click bindings');
            console.info('FIXME: updateTagTree should filter out duplicates');
            var title = '', 
                editor = this;
                
            // Loop all selected ranges
            $.each(rangy.getSelection().getAllRanges(), function(i, range) {
                var element;
                var list = [];
                
                // Get the selected nodes common parent
                var node = range.commonAncestorContainer;
                
                if (node.nodeType === 3) {
                    // If nodes common parent is a text node, then use its parent
                    element = $(node).parent();
                } else {
                    // Or else use the node
                    element = $(node);
                }
                
                // Loop untill we get to the root element, or the body tag
                while (element[0] && !editor.isRoot(element) && element[0].tagName.toLowerCase() != 'body') {
                    // Add the node to the list
                    list.push(element);
                    element = element.parent();
                }
                list.reverse();
                if (title) title += ' | ';
                title += '<a href="javascript: // ">' + _('root') + '</a> '
                $.each(list, function(i, element) {
                    title += '&gt; <a href="javascript: // ">' + element[0].tagName.toLowerCase() + '</a> '
                });
//                console.log(title);
            });
            if (!title) title = '<a href="javascript: // ">root</a>';
            this.selDialog('.ui-dialog-title').html(title);
        },
        
        isRoot: function(element) {
            return this.element[0] == element[0];
        },
        
        unify: function(callback) {
            callback(this);
            if (this.options.unify) {
                for (var i in instances) {
                    if (instances[i] != this) {
                        callback(instances[i]);
                    }
                }
            }
        },
    
        getComputedStyle: function(element) {
            var result = {};
            var style = window.getComputedStyle(element[0], null);
            for (var i = 0; i < style.length; i++){
                result[style[i]] = style.getPropertyValue(style[i]);
            };
            return result;
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
            editor.toolbar = $('<div class="' + editor.options.baseClass + '-toolbar"/>');
            editor.toolbar.append('<div class="' + editor.options.baseClass + '-inner"/>');
            editor.toolbar.dialog({
                position: $.isFunction(editor.options.dialogPosition) ? editor.options.dialogPosition() : editor.options.dialogPosition,
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
                show: editor.options.dialogShowAnimation,
                hide: editor.options.dialogHideAnimation,
                dragStop: function() {
                    if (editor.options.unify) {
                        var pos = editor.selDialog().position()
                        for (var i in instances) {
                            instances[i].toolbar.dialog('option', 'position', [pos.left, pos.top]);
                        }
                    }
                },
                open: function(event, ui) {
                    $(editor.toolbar).parent()
                        .find('.ui-dialog-titlebar-close', ui)
                        .remove();
                }
            });

            editor.bind('destroy', function() {
                editor.toolbar.dialog('destory').remove();
            });
        },
        
        showToolbar: function(instant) {
            if (!this.options.show) {
                // If unify option is set, hide all other toolbars first
                if (this.options.unify) {
                    for (var i in instances) {
                        instant = instant || (instances[i].options.show && instances[i].options.unify);
                    }
                    this.hideOtherToolbars(instant);
                }
                this.options.show = true;
                if (instant) {
                    this.selDialog().show();
                } 
                this.selToolbar().dialog('open');
                this.trigger('show');
                this.trigger('resize');
            }
        },
        
        hideToolbar: function(instant) {
            if (this.options.show) {
                this.options.show = false;
                if (instant) {
                    this.selDialog().hide();
                }
                this.selToolbar().dialog('close');
                this.trigger('hide');
                this.trigger('resize');
            }
        },
        
        hideOtherToolbars: function(instant) {
            for (var i in instances) {
                if (instances[i] != this) {
                    instances[i].hideToolbar(instant);
                }
            }
        },
        
        isToolbarVisible: function() {
            return this.options.show;
        },

        /**********************************************************************\
         * Template functions
        \**********************************************************************/
        getTemplate: function(name, variables) {
            var template;
            if (!this.templates[name]) {
                // Parse the URL
                var url = this.options.urlPrefix;
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
                this.trigger('change');
                this.historyEnabled = true;
            }
        },
        
        historyForward: function() {
            if (this.present < this.history.length - 1) {
                this.present++;
                this.setHtml(this.history[this.present]);
                this.historyEnabled = false;
                this.trigger('change');
                this.historyEnabled = true;
            }
        },

        /**********************************************************************\
         * Range functions
        \**********************************************************************/
        constrainSelection: function() {
            var element = this.element[0];
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
                console.info('Check for duplicate elements');
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

            this.trigger('change');
        },
        
        execCommand: function(command, arg1, arg2) {
            this.constrainSelection();
            document.execCommand(command, arg1, arg2);
            this.trigger('change');
        },
        
        insertElement: function(element) {
            element = $('<' + element + '/>')[0];
            this.constrainSelection();
            $(rangy.getSelection().getAllRanges()).each(function(i, range) {
                range.insertNode(element);
            });
            this.trigger('change');
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

            this.trigger('change');
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
            
            this.trigger('change');
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
//                    this._editor.selectedElement = this.element.find(':first');
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

            this.trigger('change');
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
            console.info('TODO: pass options to UI instance');
            var editor = this;
            // Loop the UI order option
            for (var i in this.options.uiOrder) {
                var uiSet = this.options.uiOrder[i];
                // Each element of the UI order should be an array of UI which will be grouped
                var uiGroup = $('<div/>');
                
                // Loop each UI in the array
                for (var j in uiSet) {
                    var ui = uiSet[j];
                    // Check the UI has been registered
                    if (registeredUi[ui]) {
                        var options = $.extend({}, editor.options, {
                            baseClass: editor.options.baseClass + '-ui-' + ui
                        }, options, editor.options.ui[ui])
                        
                        // Create a new instance of the UI
                        var uiObject;
                        
                        if ($.isFunction(registeredUi[ui])) {
                            // UI is a constructor
                            uiObject =  new registeredUi[ui](editor, options);
                        } else {
                            // UI is an object (extended for defaultUi)
                            uiObject = $.extend({}, registeredUi[ui]);
                            uiObject.editor = editor;
                            uiObject.options = options;
                            uiObject.ui = uiObject.init(editor, options);
                        }
                        
                        // Append the UI object to the group
                        uiObject.ui.init(ui, editor).appendTo(uiGroup);
                    }
                    // <strict>
                    else {
                        console.error(_('UI identified by key "{{ui}}" does not exist', { ui: ui }));
                    }
                    // </strict>
                }
                if (uiGroup.children().length > 1) {
                    uiGroup.addClass(editor.options.baseClass + '-buttonset');
                }
                
                // Append the UI group to the editor toolbar
                uiGroup.appendTo(editor.selToolbar('.' + editor.options.baseClass + '-inner'));
            };
        },
        
        uiButton2: {
            button: null,
            options: {},
            init: function(name, editor) {
                var ui = this;
                // Extend options overriding editor < base class < supplied options < user options
                var options = $.extend({}, editor.options, {
                    baseClass: editor.options.baseClass + '-' + name + '-button'
                }, ui.options, editor.options.ui[name])
                
                // Default title if not set in plugin
                if (!this.title) this.title = _('Unnamed Button');
                
                // Create the HTML button
                ui.button = $('<button/>').html(ui.title)
                    .addClass(options.baseClass)
                    .attr('name', name)
                    .attr('title', ui.title)
                    .val(name);

                if (options.classes) ui.button.addClass(options.classes);

                // Create the jQuery UI button
                ui.button.button({
                    icons: { primary: ui.icon || 'ui-icon-' + name },
                    disabled: options.disabled ? true : false,
                    text: false
                });
                
                // Bind the click event
                ui.button.bind('click.' + editor.widgetName, ui.click);
                
                editor.bind('destroy', function() {
                    ui.button.button('destory').remove();
                });
                
                return ui.button;
            },
            disable: function() {
                this.button.button('option', 'disabled', true);
            },
            enable: function() {
                this.button.button('option', 'disabled', false);
            },
            click: function() {
            }
        },
        
        uiButton: function(options) {
            return $.extend({}, this.uiButton2, options);
//            var editor = this;
//            return function(name) {
//                options = $.extend({}, editor.options, {
//                    baseClass: editor.options.baseClass + '-button-' + name
//                }, options, editor.options.ui[name])
//                var button = $('<button/>').html(options.title)
//                    .addClass(options.baseClass)
//                    .attr('name', name)
//                    .attr('title', options.title)
//                    .val(name);
//
//                if (options.classes) button.addClass(options.classes);
//
//                button.button({
//                    icons: { primary: 'ui-icon-' + name },
//                    disabled: options.disabled ? true : false,
//                    text: false
//                });
//
//                if (options.click) button.bind('click.' + editor.widgetName, options.click);
//
//                return button;
//            }
        },
        
        uiSelectMenu2: {
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
        },
        
        uiSelectMenu: function(options) {
            return $.extend({}, this.uiSelectMenu2, options);
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
                var plugin = plugins[name];
                
                // Create a new instance of the UI
                // UI is an object (extended for defaultUi)
                var pluginObject = $.extend({}, plugin);
                
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
            return this.cleanHtml(this.element.html());
        },
        
        setHtml: function(html) {
            this.element.html(html);
            this.trigger('change');
        },
        
        resetHtml: function() {
            this.setHtml(this.getOriginalHtml());
        },
        
        getOriginalHtml: function() {
            return this.element.data('uiWidgetEditorOriginalHtml');
        },
        
        setOriginalHtml: function(html) {
            return this.element.data('uiWidgetEditorOriginalHtml', html);
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

        trigger: function(name, global) {
            if (!this.events[name]) return;
            for (var i in this.events[name]) {
                var event = this.events[name][i];
                event.callback.call(event.context || this);
            }
            // Also trigger the global editor event, unless specified not to
            if (global !== false) {
                $.ui.editor.trigger(name);
            }
        },

        /**********************************************************************\
         * Internationalisation
        \**********************************************************************/
        getLocale: function() {
            return $.ui.editor.currentLocale;
        },
        
        setLocale: function(key) {
            if ($.ui.editor.currentLocale != key) {
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
        templates: { /* <templates/> */ },
        
        getInstances: function() {
            return instances;
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
            var editors = this.getInstances();
            for (var i in editors) {
                if (editors[i].isDirty()) return true;
            }
            return false;
        },
        
        unloadWarning: function() {
            if (this.isDirty()) {
                return _('\nThere are unsaved changes on this page. \nIf you navigate away from this page you will lose your unsaved changes');
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
                value = this.editor.persist(key, value);
                return value;
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
            construct: function(editor, options) {
                this.bind('destory', this.destory);
                this.init();
            },
            persist: function(key, value) {
                value = this.editor.persist(key, value);
                return value;
            },
            bind: function(name, callback, context) {
                if (!this.bindings[name]) this.bindings[name] = [];
                this.bindings[name].push(callback);
                this.editor.bind(name, callback, context || this);
            },
            unbind: function(name, callback, context) {
                unbind(this.events[name], callback);
                this.editor.unbind(name, callback, context || this);
            },
            trigger: function(name) {
                this.editor.trigger(name);
            }, 
            destory: function() {
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

        trigger: function(name) {
            // <debug>
            console.info('Calling jquery-ui-editor global/static event: ' + name);
            // </debug>
            if (!events[name]) return;
            for (var i in events[name]) {
                events[name][i].call(this);
            }
        },
        
        /**********************************************************************\
         * Persistance
        \**********************************************************************/
        persist: function(key, value) {
            if (!this.options.persistence) return null;
            
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
        console.info(_('UI loaded: {{ui}} ', {ui: result.join(', ')}));
        
        result = [];
        for (key in plugins) result.push(key);
        console.info(_('Plugins loaded: {{plugins}} ', {plugins: result.join(', ')}));

        // <debug>
        result = [];
        for (var key in $.ui.editor.translations) result.push(key);
        console.info(_('Locales loaded: {{translations}} ', {translations: result.join(', ')}));
        // </debug>
    });
    
})();
