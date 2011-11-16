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
        
        $(window).bind('beforeunload', $.proxy($.ui.editor.unloadWarning, $.ui.editor));
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
    
    _ = function(string, variables) {
        if (plugins.i18n) {
            return plugins.i18n.translate(string, variables);
        } else if (!variables) {
            return string;
        } else {
            $.each(variables, function(key, value) {
                string = string.replace('<*' + key + '*>', value);
            });
            return string;
        }
    };

    // Instance definition
    $.widget('ui.editor', {

//        _instances: [],

        _events: {},

        // Options start here. Plugins may add options via $.ui.editor.addOption
        options: {
            cssPrefix: 'ui-editor-',
            customTooltips: true,
            persistence: true,

            toolbarPosition: [5, 47],
            //function() {
                //return [
                    //this.element.offset().top,
                    //this.element.offset().left
                //];
            //},
            toolbarSaveIndividualPositions: false,

            beginEditingClass: '',
            beginEditingContent: 'Click to begin editing',
            beginEditingPositionAt: 'center center',
            beginEditingPositionMy: 'center center',
            beginEditingPositionUsing: function(position) {
                $(this).css({
                    position: 'absolute',
                    top: position.top,
                    left: position.left
                });
            },

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
            titleTags: true
        },

        _init: function() {
            instances.push(this);
            
            this.toolbar = null; 
            this.plugins = {}; 
            this.ui = {}; 
            
            this.setOriginalHtml(this.getHtml());
            this.enableEditing();
            
            this.loadToolbar();
            this.updateTagTree();
            this.attach();
            
            this.loadPlugins();
            this.loadUi();


            console.info('FIXME: custom tooltips');
            console.info('FIXME: persistance');
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
//        _util: {
//            count_objects: function(obj) {
//                var i = 0,
//                    x = null;
//                for (x in obj) {
//                    if (obj.hasOwnProperty(x)) i++;
//                }
//                return i;
//            },
//
//            isRoot: function(element) {
//
//                var isRoot = (this._util.identify(element) == this._util.identify(this.element)
//                                || element.get(0).tagName.toLowerCase() == 'body');
//
//                if (!isRoot) $(element).removeAttr('id');
//
//                return isRoot;
//            },
//
//            identify: function(element) {
//                var i = 0,
//                    uid = null;
//                if(typeof $(element).attr('id') == 'undefined') {
//                    do {
//                        i++;
//                        id = 'uid_' + i;
//                    } while($('#' + id).length > 0);
//                    $(element).attr('id', id);
//                }
//                return $(element).attr('id');
//            },
//
//            valid_url: function(url) {
//                return /^(http|https|ftp):\/\/[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/i.test(url);
//            }
//
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
//            editing: false,
//            selectedElement: false,
//            toolbar: false,
//            initialized: false,
//
//            initialize: function() {
//                console.error('init');
//                this._editor.toolbar = $('<div class="ui-widget-editor-toolbar">\
//                                            <div class="ui-widget-editor-inner" style="display:none"></div>\
//                                        </div>//');
//
////                this._editor.generateButtons.call(this);
//
//                var editorInstance = this;
//
//                this._editor.toolbar.dialog({
//                    position: ($.isFunction(this.options.toolbarPosition) ? this.options.toolbarPosition.call(this) : this.options.toolbarPosition),
//                    resizable: false,
//                    closeOnEscape: false,
//                    width: 'auto',
//                    height: 'auto',
//                    minHeight: 'auto',
//                    resize: 'auto',
//                    zIndex: 32000,
//                    title: _('Editor loading...'),
//                    autoOpen: false,
//                    dialogClass: this.options.dialogClass,
//                    show: this.options.dialogShowAnimation,
//                    hide: this.options.dialogHideAnimation,
//                    open: function(event, ui) {
//                        $(this).css('overflow', 'hidden');
//                        var parent = $(this).parent();
//                        parent.css('position', 'fixed')
//                            .attr('unselectable', 'on')
//                            .find('.ui-dialog-titlebar-close', ui)
//                            .remove();
//                    }
//                });
//
//                $(window).bind('beforeunload', $.proxy(this._actions.unloadWarning, this));
//
//                // Fire plugin initialize events
//                console.info('FIXME: Fire plugin initialize events');
////                $.each(this._plugins, function(name) {
////                    if ($.isFunction(this.initialize)) {
////                        this.initialize.apply(this, [editorInstance, editorInstance.options.plugins[name] || {}]);
////                    }
////                });
//
//                rangy.init();
//                this._editor.toolbar.dialog().dialog('open');
//
//                this._editor.initialized = true;
//                this._editor.toolbar.find('.ui-widget-editor-inner').slideDown();
//            },
//
////            generateButtons: function() {
////                console.error('gen buttons');
////                var editorInstance = this,
////                    buttonOrder = null, button = null, object = null;
////
////                this._editor.toolbar.find('.ui-widget-editor-inner').html('');
////
////                buttonOrder = [
////                    ['dock'],
////                    ['save', 'cancel', 'showGuides'],
////                    ['viewSource'],
////                    ['undo', 'redo'],
////                    ['alignLeft', 'center', 'justify', 'alignRight'],
////                    ['bold', 'italic', 'underline', 'strikethrough'],
////                    ['unorderedList', 'orderedList'],
////                    ['hr', 'blockquote'],
////                    ['increaseFontSize', 'decreaseFontSize'],
////                    ['addEditLink', 'removeLink'],
////                    ['floatLeft', 'floatNone', 'floatRight'],
////                    ['tagMenu'],
////                    ['i18n']
////                ];
////
////                if (this.options.buttonOrder) buttonOrder = this.options.buttonOrder;
////
////                $.each(buttonOrder, function() {
////
////                    button_group = $('<div></div>');
////
////                    if (editorInstance._util.count_objects(this) > 1) $(button_group).addClass('ui-widget-editor-buttonset');
////
////                    $.each(this, function(index, value) {
////                        if (typeof buttons[value] != 'undefined') {
////                            var object = buttons[value];
////                            if ($.isFunction(object.initialize)) {
////                                object.initialize.call(editorInstance, object, button_group);
////                            } else {
////                                var title = _(object.title);
////                                button = $('<button>' + title + '</button>')
////                                    .addClass('ui-widget-editor-button-' + value)
////                                    .attr('name', value)
////                                    .attr('title', value)
////                                    .val(value)
////                                    .data(editorInstance._data.names.button, object)
////                                    .appendTo(button_group);
////
////                                if (typeof object.classes != 'undefined') button.addClass(object.classes);
////
////                                button.button({
////                                    icons: object.icons,
////                                    disabled: (typeof object.disabled == 'undefined' ? false : object.disabled),
////                                    text: false
////                                });
////
////                                if (editorInstance.options.customTooltips) {
////                                    button.tipTip({
////                                        content: title
////                                    }).removeAttr('title');
////                                }
////
////                                $(button).appendTo(button_group);
////                            }
////                        }
////                        // <strict>
////                        else {
////                            console.error(_('Button identified by key "<*button*>" does not exist', { button: value }));
////                        }
////                        // </strict>
////                    });
////                    button_group.appendTo(editorInstance._editor.toolbar.find('.ui-widget-editor-inner'));
////                });
////
////            },
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
//            applyStyle: function(styles) {
//                
//
//                if (!this._editor.selectedElement || this._util.isRoot.call(this, this._editor.selectedElement)) {
//                    this.html($('<div></div>').css(styles).html(this.html()));
//                } else {
//                    var editorInstance = this;
//                    $.each(styles, function(property, value) {
//                        if (editorInstance._editor.selectedElement.css(property) == value) {
//                            editorInstance._editor.selectedElement.css(property, '');
//                        } else {
//                            editorInstance._editor.selectedElement.css(property, value);
//                        }
//                    });
//                }
//
//                this.trigger('change');
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
//            enforceLegality: function() {
//
//                var element = this.element,
//                    selection = rangy.getSelection(),
//                    commonAncestor;
//
//                $(selection.getAllRanges()).each(function(){
//                    if (this.commonAncestorContainer.nodeType == 3) commonAncestor = $(this.commonAncestorContainer).parent().get(0)
//                    else commonAncestor = this.commonAncestorContainer;
//                    if (!$.contains(element.get(0), commonAncestor)) selection.removeRange(this);
//                });
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
//            selectElement: function(select_this) {
//                this._editor.selectedElement = $(select_this);
//                rangy.getSelection().selectAllChildren($(select_this).get(0));
//                this.element.focus();
//                this._actions.updateTitleTagList.call(this);
//            },
//
//            selectAll: function() {
//                var selection = rangy.getSelection(),
//                    range = null;
//                selection.removeAllRanges();
//                $.each(this.element.contents(), function() {
//                    range = rangy.createRange();
//                    range.selectNodeContents(this);
//                    selection.addRange(range);
//                });
//                this.element.focus();
//                this.trigger('change');
//            }
//        },
//
//        _actions: {
//
//            beforeStateChange: function() {
//                console.info('FIXME: beforeStateChange');
////                $.each(this._plugins, function() {
////                    if ($.isFunction(this.beforeStateChange)) {
////                        this.beforeStateChange.call(this);
////                    }
////                });
//            },
//
//            stateChange: function() {
//                this._actions.refreshSelectedElement.call(this);
//                this._actions.updateTitleTagList.call(this);
//
//                var editorInstance = this,
//                    data = null;
//
//                // Trigger button & plugin state change handlers
//                this._editor.toolbar.find('button, select').each(function() {
//                    data = $(this).data(editorInstance._data.names.button);
//                    if ($.isFunction(data.change)) {
//                        data.stateChange.call(editorInstance, this);
//                    }
//                });
//
//                console.info('FIXME: stateChange');
////                $.each(this._plugins, function() {
////                    if ($.isFunction(this.stateChange)) {
////                        this.stateChange.call(editorInstance);
////                    };
////                });
//                
//                this.trigger('change');
//            },
//
//            refreshSelectedElement: function() {
//                try {
//                    this._editor.selectedElement = $($.selectedElement().obj);
//                } catch(e) {
//                    this._editor.selectedElement = this.element;
//                }
//            },
//
//            updateTitleTagList: function() {
//
//                var title = this.options.titleDefault,
//                    current = null, tagName = null, tagMenu = null,
//                    i = 0;
//
//                if (this.options.titleTags) {
//
//                    this._selection.enforceLegality.call(this);
//                    this._actions.refreshSelectedElement.call(this);
//
//                    if (this._editor.selectedElement) {
//
//                        var current = this._editor.selectedElement,
//                            editorInstance = this;
//
//                        if (typeof current[0] != 'undefined') {
//
//                            console.info('FIXME: updateTitleTagList');
////                            $.each(this._plugins, function() {
////                                if ($.isFunction(this.titleTagList)) {
////                                    this.titleTagList.call(editorInstance, current);
////                                };
////                            });
//
//                            title = '';
//
//                            while (true) {  // Update dialog title
//
//                                if (this._util.isRoot.call(this, current)) {
//                                    title = '<a href="javascript: // ' + _('Select all') + '" name="root" \
//                                        class="ui-widget-editor-element-path" title="//' + _('Click to select all editable content') + '">root</a>' + title;
//                                    break;
//                                }
//
//                                tagName = current[0].tagName.toLowerCase();
//                                title = ' &gt; <a href="javascript: // ' + _('Select element') + '" name="' + i +'" \
//                                        class="ui-widget-editor-element-path" title="//' + _('Click to select the contents of this &quot;<*tagName*>&quot; element', { tagName: tagName.toUpperCase()}) + '">' + tagName + '</a>' + title;
//                                current = current.parent();
//                                i++;
//                            }
//                        }
//                    }
//                }
//
//                this._editor.toolbar.dialog({
//                    title: title
//                });
//
//                if (this.options.customTooltips) this._editor.toolbar.parent().find('.ui-widget-editor-element-path').tipTip();
//            },
//
//            unloadWarning: function() {
//                if (this._content.dirtyBlocksExist.call(this)) {
//                    return _('\nThere are unsaved changes on this page. \nIf you navigate away from this page you will loose your unsaved changes');
//                }
//            }
//
//        },
//
//        _content: {
//            cleaned: function(html) {
//                var content = $('<div></div>').html(html);
//
//                content.find('.rangySelectionBoundary').each(function(){
//                    $(this).remove();
//                });
//
//                return content.html();
//            },
//
//            reset: function() {
//                this.html(this.element.data(this._data.names.originalHtml));
//                this._data.clear.call(this, this._data.names.originalHtml);
//                this.trigger('change');
//            },
//
//            dirty: function() {
//                if (this._data.exists(this.element, this._data.names.originalHtml)) {
//                    var data = this.element.data(this._data.names.originalHtml);
//                    if (data != this.element.html()) return true;
//                }
//                return false;
//            },
//
//            dirtyBlocksExist: function() {
//                var unsaved = false;
//                $(this._instances).each(function(){
//                    if (this._content.dirty.call(this)) {
//                        unsaved = true;
//                        return;
//                    }
//                });
//                return unsaved;
//            },
//
//            destroy: function() {
//                $(this._instances).each(function() {
//                    this._content.reset.call(this);
//                    this.element.unbind('keyup.editor click.editor');
//                    this.element.attr('contenteditable', 'false');
//                    this.element.removeClass(this._classes.editing);
//                });
//            }
//        },
//
//        _dialog: {
//
//            confirmation: {
//
//                html: false,
//
//                show: function(options) {
//
//                    if (typeof options.message == 'undefined') options.message = _('Are you sure?');
//                    if (typeof options.title == 'undefined') options.title = _('Confirmation');
//
//                    if (!this._dialog.confirmation.html) this._dialog.confirmation.html = $('<div>' + options.message + '</div>').appendTo('body');
//                    else this._dialog.confirmation.html.html(options.message);
//
//                    var editorInstance = this;
//
//                    this._dialog.confirmation.html.dialog({
//                        autoOpen: false,
//                        modal: true,
//                        resizable: false,
//                        title: options.title,
//                        dialogClass: this.options.dialogClass + ' ui-widget-editor-confirmation',
//                        show: this.options.dialogShowAnimation,
//                        hide: this.options.dialogHideAnimation,
//                        buttons: [
//                            {
//                                text: _('OK'),
//                                'class': 'ok',
//                                click: function() {
//                                    if ($.isFunction(options.ok)) options.ok();
//                                    $(this).dialog('close');
//                                }
//                            },
//                            {
//                                text: _('Cancel'),
//                                'class': 'cancel',
//                                click: function() {
//                                    if ($.isFunction(options.cancel)) options.cancel();
//                                    $(this).dialog('close');
//                                }
//                            }
//                        ],
//                        open: function() {
//                            editorInstance._dialog.applyButtonIcon('ok', 'circle-check');
//                            editorInstance._dialog.applyButtonIcon('cancel', 'circle-close');
//                        },
//                        close: function() {
//                            $(this).dialog('destroy');
//                        }
//                    }).dialog('open');
//
//                }
//
//            },
//
//            alert: {
//
//                html: false,
//
//                show: function(options) {
//
//                    var editorInstance = this;
//
//                    if (!this._dialog.alert.html) this._dialog.alert.html = $('<div>' + options.message + '</div>').appendTo('body');
//                    else this._dialog.alert.html.html(options.message);
//
//                    this._dialog.alert.html.dialog({
//                        autoOpen: false,
//                        modal: true,
//                        resizable: false,
//                        title: options.title,
//                        width: 'auto',
//                        dialogClass: this.options.dialogClass + ' ui-widget-editor-alert',
//                        show: this.options.dialogShowAnimation,
//                        hide: this.options.dialogHideAnimation,
//                        buttons: [
//                            {
//                                text: 'OK',
//                                'class': 'ok',
//                                click: function() {
//                                    $(this).dialog('close');
//                                }
//                            }
//                        ],
//                        open: function() {
//                            editorInstance._dialog.applyButtonIcon('ok', 'circle-check');
//                        },
//                        close: function() {
//                            $(this).dialog('destroy');
//                        }
//                    }).dialog('open');
//                }
//            },
//
//            applyButtonIcon: function(buttonClass, icon) {
//                $('.ui-dialog-buttonpane').
//                    find('.' + buttonClass).button({
//                    icons: {
//                        primary: 'ui-icon-' + icon
//                    }
//                });
//            }
//
//        },
//
//        _message: {
//
//            initialized: false,
//            panel: false,
//            hideTimeout: false,
//
//            types: {
//                error: 'notice',
//                confirm: 'check',
//                information: 'info',
//                warning: 'alert',
//                loading: 'loading'
//            },
//
//            initialize: function() {
//                this._message.panel = $('.ui-widget-editor-messages');
//                if (!this._message.panel.length) {
//                    this._message.panel = $('<div class="ui-widget-editor-messages" style="display:none;clear:both">\
//                                                <div>\
//                                                    <span class="ui-icon"></span>\
//                                                    <ul></ul>\
//                                                </div>\
//                                            </div>//').appendTo(this._editor.toolbar);
//                }
//                this._message.initialized = true;
//            },
//
//            show: function(type, messages, callback) {
//                var delay = 5000;
//                if (!this._message.initialized) this._message.initialize.call(this);
//                if ($.isFunction(delay)) callback = delay;
//                if (typeof delay == 'undefined' || $.isFunction(delay)) delay = 5000;
//                if (!$.isArray(messages)) messages = [messages];
//                if (this._message.hideTimeout) window.clearTimeout(this._message.hideTimeout);
//
//                var editorInstance = this;
//
//                this._message.hide.call(this, function(){
//
//                    editorInstance._message.panel.find('ul').html('').removeAttr('class').addClass('ui-widget-messages-' + type);
//                    editorInstance._message.panel.find('span.ui-icon').removeAttr('class').addClass('ui-icon ui-icon-' + type);
//
//                    $(messages).each(function(){
//                        editorInstance._message.panel.find('ul').append($('<li>' + this + '</li>'));
//                    });
//
//                    editorInstance._message.panel.slideDown(function(){
//                        if (delay) {
//                            editorInstance._message.hideTimeout = window.setTimeout(function(){
//                                editorInstance._message.hide.call(editorInstance, callback);
//                            }, delay);
//                        }
//                    });
//                });
//            },
//
//            hide: function(callback) {
//                if (this._message.initialized && this._message.panel) {
//                    if (this._message.hideTimeout) window.clearTimeout(this._message.hideTimeout);
//                    this._message.panel.slideUp(callback);
//                }
//            },
//
//            destroy: function() {
//                this._message.initialized = false;
//                if (this._message.panel) this._message.panel.remove();
//            }
//        },
//
//        html: function(html) {
//            if (typeof html == 'undefined') {
//                return this._content.cleaned(this.element.html());
//            }
//            
//            this.element.html(html);
//            this.trigger('change');
//            return this;
//        },


        /**********************************************************************\
         * Other Functions
        \**********************************************************************/
        persist: function(key, value) {
            if (localStorage) {
                var storage;
                if (localStorage.uiWidgetEditor) {
                    storage = JSON.parse(localStorage.uiWidgetEditor);
                } else {
                    storage = {};
                }
                console.log(storage);
                if (value === undefined) return storage[key];
                storage[key] = value;
                console.log(storage);
                console.log(key);
                console.log(value);
                localStorage.uiWidgetEditor = JSON.stringify(storage);
            } else {
                console.info('FIXME: use cookies');
            }
        },
        
        /**********************************************************************\
         * Other Functions
        \**********************************************************************/
        enableEditing: function() {
            this.element.prop('contenteditable', true);
            document.execCommand('enableInlineTableEditing', false, false);
            document.execCommand('enableObjectResizing', false, false);
            document.execCommand('styleWithCSS', true, true);
        },
        
        attach: function() {
            var editor = this;
            this.element.bind('click.' + this.widgetName, function() {
                editor.trigger('change');
            });
            this.element.bind('keyup.' + this.widgetName, function() {
                editor.trigger('change');
            });
            editor.bind('change', this.updateTagTree);
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
                while (!editor.isRoot(element) && element[0].tagName.toLowerCase() != 'body') {
                    // Add the node to the list
                    list.push(element);
                    element = element.parent();
                }
                list.reverse();
                if (title) title += ' | ';
                title += '<a href="javascript: // ">root</a> '
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
        showLoading: function(messages, callback) {
            this._message.show.call(this, this._message.types.loading, messages, callback);
        },
        
        showInfo: function(messages, callback) {
            this._message.show.call(this, this._message.types.information, messages, callback);
        },
        
        showError: function(messages, callback) {
            this._message.show.call(this, this._message.types.error, messages, callback);
        },
        
        showConfirm: function(messages, callback) {
            this._message.show.call(this, this._message.types.confirm, messages, callback);
        },
        
        showWarning: function(messages, callback) {
            this._message.show.call(this, this._message.types.warning, messages, callback);
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
                
                this.toolbar.dialog().dialog('open');
                this.toolbar.find('.ui-widget-editor-inner').slideDown();
            }
                $('.ui-widget-editor-dialog .ui-widget-editor-element-path').die('click.editor').
                        live('click.editor', function(){
                            var current = editorInstance._editor.selectedElement,
                                i = 0;
                            if ($(this).attr('name') != 'root') {
                                while (i != $(this).attr('name')) {
                                    current = current.parent();
                                    i++;
                                }
                                editorInstance._selection.selectElement.call(editorInstance, current);
                            } else {
                                editorInstance._selection.selectAll.call(editorInstance);
                            }
                        });

        },

        /**********************************************************************\
         * Range functions
        \**********************************************************************/
        constrainSelection: function() {
            var element = this.element;
            var commonAncestor;

            $(rangy.getSelection().getAllRanges()).each(function(){
                if (this.commonAncestorContainer.nodeType == 3) {
                    commonAncestor = $(this.commonAncestorContainer).parent().get(0)
                } else {
                    commonAncestor = this.commonAncestorContainer;
                }
                if (!$.contains(element.get(0), commonAncestor)) selection.removeRange(this);
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
            if (!options) options = {};

            var classes = options.classes ? options.classes : tag;

            this.constrainSelection();

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
            var editor = this;
            this.constrainSelection();
            $.each(editor.getSelectedElements(), function(i, element) {
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
                    for (var j = nodes.length - 1; i >= 0; i--) {
                        range.insertNode(nodes[i].cloneNode(true));
                    }
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
                        //console.error(_('UI identified by key "<*ui*>" does not exist', { ui: ui }));
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
        
        getHtml: function() {
            return this.element.html();
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
            if (!this._events[name]) this._events[name] = [];
            this._events[name].push(callback);
        },

        unbind: function(callback) {
            $.each(this._events, function(name, events) {
                for (var i = 0; i < events.length; i++) {
                    if (events[i] == callback) {
                        events.splice(i,1);
                    }
                }
            });
        },

        trigger: function(name) {
            var editor = this;
            if (this._events[name]) {
                $.each(this._events[name], function() {
                    this.call(editor);
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
                if (editors[i]) return true;
            }
            return false;
        },
        
        addButton: function(name, button) {
        },
        
        registerUi: function(uiSet) {
            $.each(uiSet, function(name, ui) {
                // <strict>
                if (registeredUi[name]) {
                    console.error(_('UI "<*name*>" has already been registered, and will be overwritten', {name: name}));
                }
                // </strict>

                registeredUi[name] = ui;

                // <debug>
                console.log(_('UI <*name*> added', {name: name}), ui);
                // </debug>
            });
        },

        addPlugin: function(name, plugin) {
            // <strict>
            if (plugins[name]) console.error(_('Plugin "<*pluginName*>" has already been registered, and will be overwritten', {pluginName: name}));
            // </strict>

            plugins[name] = plugin;

            // <debug>
            console.log(_('Plugin <*pluginName*> added', {pluginName: name}), plugin);
            // </debug>
        },

        addOptions: function(name, options) {
            // <strict>
            if ($.ui.editor.prototype.options.name) console.error(_('"<*optionKey*>" option key already exists, and will be overwritten', {optionKey: name}));
            // </strict>
            if (!$.ui.editor.prototype.options['plugins']) $.ui.editor.prototype.options['plugins'] = {};
            $.ui.editor.prototype.options['plugins'][name] = options;
            // <debug>
            console.log(_('Options <*optionKey*> added', {optionKey: name}), options);
            // </debug>
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
    });
})();
