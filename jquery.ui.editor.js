var _;

(function() {
    
    // <strict>
    // Ensure jQuery has been included
    if (!$) console.error(_('jQuery is required'));
    // Ensure jQuery UI has been included
    if (!$.ui) console.error(_('jQuery UI is required'));
    // </strict>

    function initialize() {
        // <strict>
            // Ensure rangy has been included
            if (!rangy) console.error(_('Rangy is required. This library should have been included with the file you downoaded. If not, acquire it here: http://code.google.com/p/rangy/"'));
            // Ensure dialog has been included
            if (!$.ui.dialog) console.error(_('jQuery UI Dialog is required.'));
            // Warn that no internationalizations have been loaded
            if (!plugins.i18n) console.debug(_('No internationalizations have been loaded, defaulting to English'));
        // </strict>
            
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
    
    // Private functions
    
    // Private variables
    var instances = [];
    var templates = {};
    
    // Events added via $.ui.editor.bind
    var events = {};

    // Plugins added via $.ui.editor.addPlugin
    var plugins = {};

    // UI added via $.ui.editor.registerUi
    var registeredUi = {};
    
    // Internationalisation function
    _ = function(string, variables) {
//        return 'XXXXXXXX';
        if (plugins.i18n) {
            return plugins.i18n.translate(string, variables);
        } else if (!variables) {
            return string;
        } else {
            $.each(variables, function(key, value) {
                string = string.replace('{{' + key + '}}', value);
            });
            return string;
        }
    };

    // Instance definition
    $.widget('ui.editor', {

        // Options start here. Plugins may add options via $.ui.editor.addOption
        options: {
            cssPrefix: 'ui-editor-',
            customTooltips: true,
            persistence: true,

            toolbarPosition: [5, 47],
            toolbarSaveIndividualPositions: false,

            targetAnimationOutlineColour: 'rgb(134, 213, 124)',
            targetAnimationOutlineWidth: 1,
            targetAnimationBackgroundColour: 'rgb(241, 250, 239)',
            targetAnimation: function() {
                var originalOutlineColour = this.element.css('outline-color'),
                    originalOutlineWidth = this.element.css('outline-width'),
                    originalBackgroundColour = this.element.css('background-color'),
                    editorInstance = this;

                this.element.stop().animate({
                    outlineColor: this.options.targetAnimationOutlineColour,
                    outlineWidth: this.options.targetAnimationOutlineWidth,
                    backgroundColor: this.options.targetAnimationBackgroundColour
                }, function() {
                    editorInstance.element.animate({
                        outlineColor: originalOutlineColour,
                        outlineWidth: originalOutlineWidth,
                        backgroundColor: originalBackgroundColour
                    });
                });
            },

            dialogShowAnimation: 'fade',
            dialogHideAnimation: 'fade',
            dialogClass: 'ui-widget-editor-dialog',

            uiOrder: [
                ['dock'],
                ['save', 'cancel', 'showGuides'],
                ['viewSource'],
                ['undo', 'redo'],
                ['alignLeft', 'center', 'justify', 'alignRight'],
                ['bold', 'italic', 'underline', 'strikethrough'],
                ['unorderedList', 'orderedList'],
                ['hr', 'blockquote'],
                ['increaseFontSize', 'decreaseFontSize'],
                ['link', 'unlink'],
                ['floatLeft', 'floatNone', 'floatRight'],
                ['tagMenu'],
                ['i18n']
            ],

            titleVisible: true,
            titleDefault: 'jQuery UI Editor Controls',
            titleTags: true,
            
            urlPrefix: '/jquery.ui.editor/'
        },

        _init: function() {
            instances.push(this);
            
            // Undo stack, redo pointer
            this.history = []; 
            this.present = 0; 
            this.historyEnabled = true; 
            
            
            this.events = {}; 
            this.toolbar = null; 
            this.plugins = {}; 
            this.ui = {}; 
            this.templates = {}; 
            
            this.setOriginalHtml(this.getHtml());
            
            this.loadToolbar();
            this.loadMessages();
            this.updateTagTree();
            this.attach();
            
            this.loadPlugins();
            this.loadUi();
            
            this.trigger('change');

            console.info('FIXME: custom tooltips');
//            // <debug>
//            if (!jQuery.cookie) console.error(_('jQuery cookie has not been loaded - persistence functions will not be available'));
//            // </debug>
//            if (this.options.customTooltips && !$.isFunction($.fn.tipTip)) {
//                this.options.customTooltips = false;
//                // <strict>
//                console.error(_('Custom tooltips was requested but tipTip has not been loaded. This library should have been in the file you downloaded. If not, acquire it here: http://code.drewwilson.com/entry/tiptip-jquery-plugin'));
//                // </strict>
//            }
//            if (!jQuery.cookie) this.options.persistence = false;

//            this._clickToEdit.initialize.call(this);
        },

//        _create: function() {
//            this._instances.push(this);
//        },

//        _classes: {
//            highlight: 'ui-widget-editor-highlight',
//            hover: 'ui-widget-editor-hover',
//            editing: 'ui-widget-editor-editing'
//        },
//
//        _data: {
//
//            exists: function(element, name) {
//                return typeof $(element).data(name) != 'undefined';
//            },
//
//            names: {
//                originalHtml: 'uiWidgetEditorOriginalHtml',
//                button: 'uiWidgetButton',
//                toolbarPosition: 'uiWidgetEditorToolbarPosition'
//            },
//
//            clear: function(name) {
//                $.removeData(this.element.get(0), name);
//            }
//
//        },

//        _clickToEdit: {
//            message: false,
//
//            initialize: function() {
//                this.element.bind('mouseenter.target', $.proxy(this._clickToEdit.show, this));
//                this.element.bind('mouseleave.target', $.proxy(this._clickToEdit.hide, this));
//                this.element.bind('click.target', $.proxy(this._editor.show, this));
//            },
//
//            show: function() {
//                if (!this.element.hasClass(this._classes.editing)) {
//
//                    $(this._instances).each(function() {
//                        this.element.removeClass(this._classes.highlight);
//                        this.element.removeClass(this._classes.hover);
//                        this._clickToEdit.hide.call(this);
//                    });
//
//                    if (!this._clickToEdit.message) {
//                        this._clickToEdit.message = $('<div class="ui-widget-editor-edit '
//                                                        + this.options.beginEditingClass
//                                                        + '" style="opacity: 0;">\
//                                                        + _(this.options.beginEditingContent) + '\
//                                                        </div>').appendTo('body');
//                    }
//
//                    this.element.addClass(this._classes.highlight);
//                    this.element.addClass(this._classes.hover);
//
//                    this._clickToEdit.message.position({
//                        at: this.options.beginEditingPositionAt,
//                        my: this.options.beginEditingPositionMy,
//                        of: this.element,
//                        using: this.options.beginEditingPositionUsing
//                    }).stop().animate({ opacity: 1 });
//                }
//            },
//
//            hide: function() {
//                this.element.removeClass(this._classes.highlight);
//                this.element.removeClass(this._classes.hover);
//                if (this._clickToEdit.message) this._clickToEdit.message.stop().animate({ opacity: 0 });
//            }
//        },

//        _editor: {
//
//
//            show: function() {
//                this._editor.editing = true;
////                this._clickToEdit.hide.call(this);
//
//                if (this._editor.initialized === false) {
//                    if (this._editor.initialize.call(this) === false) return;
//                } else {
//                    this._editor.toolbar.dialog('show');
//                }
//                if(!this.element.hasClass(this._classes.editing)) {
//                    this._editor.attach.call(this);
//                }
//            },
//
//            attach: function() {
////                if (!this._data.exists(this.element, this._data.names.originalHtml)) {
////                    this.element.data(this._data.names.originalHtml, this.element.html());
////                }
//
//                var editorInstance = this,
//                    position = false;
//
//                // If the instance should remember its toolbar position and reset it when the element is attached
//                if (this.options.toolbarSaveIndividualPositions) {
//                    // Make sure the toolbar isn't repositioned if the user has manually moved it
//                    if (this._data.exists(this.element, this._data.names.toolbarPosition)) {
//                        position = this.element.data(this._data.names.toolbarPosition);
//                    } else {
//                        position = ($.isFunction(this.options.toolbarPosition) ? this.options.toolbarPosition.call(this) : this.options.toolbarPosition);
//                    }
//                    this._editor.toolbar.dialog().dialog('option', 'position', position);
//                    this._editor.toolbar.dialog().dialog('option', 'dragStop', function() {
//                        editorInstance.element.data(editorInstance._data.names.toolbarPosition, $(this).dialog().dialog('option', 'position'));
//                    });
//                }
//
//                if (!this.options.titleVisible) this._editor.toolbar.dialog().parent().find('.ui-dialog-titlebar').hide();
//                else this._editor.toolbar.dialog().parent().find('.ui-dialog-titlebar').show()
//
//                // Unbind previous instances
//                $(this._instances).each(function(){
//                    var iteratingEditorInstance = this;
//                    this._editor.toolbar.find('button').each(function() {
//                        var data = $(this).data(editorInstance._data.names.button);
//                        if ($.isFunction(data.destroy)) {
//                            data.destroy.call(iteratingEditorInstance, this);
//                        }
//                    });
//                    // Fire detachment events
//                    console.info('FIXME: Fire detachment events');
////                    $.each(this._plugins, function() {
////                        if ($.isFunction(this.detach)) {
////                            this.detach.call(editorInstance);
////                        }
////                    });
//                    iteratingEditorInstance._editor.editing = false;
//                    iteratingEditorInstance.element.unbind('keyup.editor click.editor');
//                    iteratingEditorInstance.element.attr('contenteditable', 'false');
//                    iteratingEditorInstance.element.removeClass(iteratingEditorInstance._classes.editing);
//                    iteratingEditorInstance._message.hide.call(iteratingEditorInstance);
//                });
//
////                this._editor.generateButtons.call(this);
//
//                this._editor.toolbar.find('button').each(function() {
//                    var data = $(this).data(editorInstance._data.names.button);
//                    if ($.isFunction(data.click)) {
//                        $(this).unbind('click.editor').bind('click.editor', function(event) {
//                            data.click.call(editorInstance, event, this);
//                        });
//                    }
//                });
//
//                $('.ui-widget-editor-dialog .ui-widget-editor-element-path').die('click.editor').
//                        live('click.editor', function(){
//                            var current = editorInstance._editor.selectedElement,
//                                i = 0;
//                            if ($(this).attr('name') != 'root') {
//                                while (i != $(this).attr('name')) {
//                                    current = current.parent();
//                                    i++;
//                                }
//                                editorInstance._selection.selectElement.call(editorInstance, current);
//                            } else {
//                                editorInstance._selection.selectAll.call(editorInstance);
//                            }
//                        });
//
//                this.element.addClass(this._classes.editing);
//                this.element.attr('contenteditable', 'true');
//                document.execCommand('enableInlineTableEditing', false, false);
//                document.execCommand('enableObjectResizing', false, false);
//                document.execCommand('styleWithCSS', true, true);
//
//                // Fire attachment events
//                console.info('FIXME: Fire attachment events');
////                $.each(this._plugins, function() {
////                    if ($.isFunction(this.attach)) {
////                        this.attach.call(editorInstance);
////                    }
////                });
//                this.element.bind('keyup.editor click.editor', $.proxy(function(event) {
//                    if (!event.ctrlKey) {
//                        this.trigger('change');
//                    }
//                    return true;
//                }, this));
//
//                this.trigger('change');
//                if (this.options.targetAnimation && $.isFunction(this.options.targetAnimation)) this.options.targetAnimation.call(this);
//                this.element.focus();
//            },
//
//            destroy: function() {
//                this._editor.toolbar.dialog('close');
//                this._editor.editing = false;
//                this._editor.initialized = false;
//            }
//        },

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
//            exists: function() {
//                this._selection.enforceLegality.call(this);
//                var all_ranges = rangy.getSelection().getAllRanges(),
//                    range;
//                if (!all_ranges.length) return false;
//
//                if (all_ranges.length > 1) {
//                    return true;
//                } else {
//                    range = all_ranges[0];
//                    return range.startOffset != range.endOffset;
//                }
//            },
//
        selectElement: function(select_this) {
            this._editor.selectedElement = $(select_this);
            rangy.getSelection().selectAllChildren($(select_this).get(0));
            this.element.focus();
            this._actions.updateTitleTagList.call(this);
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
         * Other Functions
        \**********************************************************************/
        enableEditing: function() {
            this.element.attr('contenteditable', true)
                        .addClass('ui-widget-editor-editing');
            document.execCommand('enableInlineTableEditing', false, false);
            document.execCommand('enableObjectResizing', false, false);
            document.execCommand('styleWithCSS', true, true);
            this.trigger('enabled');
        },
        
        disableEditing: function() {
            this.element.attr('contenteditable', false)
                        .removeClass('ui-widget-editor-editing');
            this.trigger('disabled');
        },
        
        isEditing: function() {
            return this.element[0].isContentEditable;
        },
        
        attach: function() {
            var editor = this;
            editor.bind('change', this.historyPush);
            editor.bind('change', this.updateTagTree);
            this.element.bind('click.' + this.widgetName, function() {
                editor.trigger('change');
            });
            this.element.bind('keyup.' + this.widgetName, function() {
                editor.trigger('change');
            });
            console.log(this.selDialog('.ui-dialog-titlebar a'));
            this.selDialog('.ui-dialog-titlebar a')
                    .die('click.' + this.widgetName)
                    .live('click.' + this.widgetName, function() {
                        console.log($(this));
                    });
        },
        
        updateTagTree: function() {
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
                message = $(editor.getTemplate('message', {
                    type: type,
                    message: message
                }));
                message.hide();
                message.appendTo(editor.selMessages());
                message.slideDown().delay(5000).slideUp(function() { message.remove(); });
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
            if (!this.toolbar) {
                this.toolbar = $('<div class="ui-widget-editor-toolbar"/>');
                this.toolbar.append('<div class="ui-widget-editor-inner"/>');
                this.toolbar.dialog({
                    position: $.isFunction(this.options.toolbarPosition) ? this.options.toolbarPosition() : this.options.toolbarPosition,
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
                    show: this.options.dialogShowAnimation,
                    hide: this.options.dialogHideAnimation,
                    open: function(event, ui) {
                        $(this).css('overflow', 'hidden');
                        $(this).parent()
                            .css('position', 'fixed')
                            .prop('unselectable', true)
                            .find('.ui-dialog-titlebar-close', ui)
                            .remove();
                    }
                });
            }
        },
        
        showToolbar: function() {
            this.toolbar.dialog().dialog('open');
        },
        
        hideToolbar: function() {
            this.toolbar.dialog().dialog('close');
        },

        /**********************************************************************\
         * Template functions
        \**********************************************************************/
        getTemplate: function(name, variables) {
            var template;
            if (!templates[name]) {
                // Parse the URL
                var url = this.options.urlPrefix;
                name = name.split('.');
                if (name.length == 1) {
                    // URL is for and editor core template
                    url += 'templates/' + name[0] + '.html';
                } else {
                    // URL is for a plugin template
                    url += 'plugins/' + name[0] + '/templates/' + name.splice(1).join('/') + '.html';
                }
                // Request the template
                $.ajax({
                    url: url,
                    type: 'GET',
                    async: false,
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
                templates[name] = template;
            } else {
                template = templates[name];
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
            template = template.replace(/{{(.*?)}}/g, function(match, variable) {
                return variables[variable];
            });
            return template;
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
            var messages = this.selToolbar().find('.ui-widget-editor-messages');
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
            // Loop the button order option
            $.each(this.options.uiOrder, function(i, uiSet) {
                // Each element of the button order should be an array of UI which will be grouped
                var uiGroup = $('<div/>');
                
                // Loop each UI in the array
                $.each(uiSet, function(j, ui) {
                    // Check the UI has been registered
                    if (registeredUi[ui]) {
                        // Create a new instace of the UI
                        var buttonObject = new registeredUi[ui](editor);
                        // Append the UI object to the group
                        buttonObject.ui.appendTo(uiGroup);
                    }
                    // <strict>
                    else {
                        //console.error(_('UI identified by key "{{ui}}" does not exist', { ui: ui }));
                    }
                    // </strict>
                });
                if (uiGroup.children().length > 1) uiGroup.addClass('ui-widget-editor-buttonset');
                
                // Append the UI group to the editor toolbar
                uiGroup.appendTo(editor.selToolbar('.ui-widget-editor-inner'));
            });
        },
        
        uiButton: function(options) {
            var button = $('<button>' + options.title + '</button>')
                .addClass('ui-widget-editor-button-' + options.name)
                .attr('name', options.name)
                .attr('title', options.name)
                .val(options.name);

            if (options.classes) button.addClass(options.classes);

            button.button({
                icons: options.icons,
                disabled: options.disabled ? true : false,
                text: false
            });
            
            if (options.click) button.bind('click.' + this.widgetName, options.click);
            
            return button;
        },        

        /**********************************************************************\
         * Plugins
        \**********************************************************************/
        getPlugin: function(name) {
            return this.plugins[name];
        },
        
        loadPlugins: function() {
            if (!this.options.plugins) this.options.plugins = {};
            $.each(plugins, $.proxy(function(name, plugin) {
                // <strict>
                if (!$.isFunction(plugin)) console.error('JQuery UI Editor plugins must be objects with constructors, ' + name + ' is a ' + typeof plugin);
                // </strict>
                this.plugins[name] = new plugin(this, this.options.plugins[name] || {});
            }, this));
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
            return this.element.html(html);
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
         * Destructor
        \**********************************************************************/
        destroy: function() {
            var editorInstance = this;
            editorInstance._editor.toolbar.find('button').each(function() {
                var data = $(this).data(editorInstance._data.names.button);
                if ($.isFunction(data.destroy)) {
                    data.destroy.call(editorInstance, this);
                }
            });

            this._editor.destroy.call(this);
            this._message.destroy.call(this);
            this._content.destroy.call(this);

            console.info('FIXME: destroy');
//            $.each(this._plugins, function() {
//                if ($.isFunction(this.destroy)) {
//                    this.destroy.call(editorInstance, this);
//                };
//            });
        },

        /**********************************************************************\
         * Event handling
        \**********************************************************************/
        bind: function(name, callback) {
            // <strict>
            if (!$.isFunction(callback)) console.error('Must bind a valid callback, ' + name + ' was a ' + typeof callback);
            // </strict>
            if (!this.events[name]) this.events[name] = [];
            this.events[name].push(callback);
        },

        unbind: function(callback) {
            $.each(this.events, function(name, events) {
                for (var i = 0; i < events.length; i++) {
                    if (events[i] == callback) {
                        events.splice(i,1);
                    }
                }
            });
        },

        trigger: function(name) {
            var editor = this;
            if (this.events[name]) {
                $.each(this.events[name], function(i, event) {
                    event.call(editor);
                });
            }
            $.ui.editor.trigger(name);
        }

    });

    // Global static definition
    $.extend($.ui.editor, {
        getUniqueId: function() {
            var id = 'ui-widget-editor-uid-' + new Date().getTime() + '-' + Math.floor(Math.random() * 100000);
            while ($('#' + id).length) {
                id = 'ui-widget-editor-uid-' + new Date().getTime() + '-' + Math.floor(Math.random() * 100000);
            }
            return id;
        },
        
        getInstances: function() {
            return instances;
        },
        
        isDirty: function() {
            var editors = this.getInstances();
            for (var i in editors) {
                if (editors[i].isDirty()) return true;
            }
            return false;
        },
        
        addButton: function(name, button) {
        },
        
        registerUi: function(uiSet) {
            $.each(uiSet, function(name, ui) {
                // <strict>
                if (registeredUi[name]) {
                    console.error(_('UI "{{name}}" has already been registered, and will be overwritten', {name: name}));
                }
                // </strict>

                registeredUi[name] = ui;
            });
        },

        addPlugin: function(name, plugin) {
            // <strict>
            if (plugins[name]) console.error(_('Plugin "{{pluginName}}" has already been registered, and will be overwritten', {pluginName: name}));
            // </strict>

            plugins[name] = plugin;
        },

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
            var editor = this;
            // <debug>
            console.info('Calling jquery-ui-editor global/static event: ' + name);
            // </debug>
            if (!events[name]) return;
            $.each(events[name], function() {
                this.call(editor);
            })
        },
        
        unloadWarning: function() {
            if (this.isDirty()) {
                return _('\nThere are unsaved changes on this page. \nIf you navigate away from this page you will lose your unsaved changes');
            }
        }
    });

    $(function() {
        initialize();
        // <debug>
        var result = [];
        for (var key in registeredUi) result.push(key);
        console.log(_('UI loaded: {{ui}} ', {ui: result.join(', ')}));
        
        result = [];
        for (key in plugins) result.push(key);
        console.log(_('Plugins loaded: {{plugins}} ', {plugins: result.join(', ')}));
        // </debug>
    });
})();
