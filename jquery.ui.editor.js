(function($, window, rangy, undefined) {
 
    $.widget('ui.editor', {
               
        _instances: [],

        _plugins: { },

        // Allow buttons to be extended using $.ui.editor.prototype
        _buttons: {
            addEditLink: {
                title: 'Insert Link',
                icons: {
                    primary: 'ui-icon-insert-link'
                },
                classes: 'ui-editor-icon',
                click: function() {
                    this._actions.link.show.call(this);
                },
                stateChange: function(button) {
                    $(button).button('option', 'disabled', !(this._selection.exists.call(this) || this._editor.selectedElement.is('a')));
                }
            },
            removeLink: {
                title: 'Remove Link',
                icons: {
                    primary: 'ui-icon-remove-link'
                },
                classes: 'ui-editor-icon',
                click: function() {
                    this._actions.link.remove.call(this);
                },
                stateChange: function(button) {
                    $(button).button('option', 'disabled', !this._editor.selectedElement.is('a'));
                }
            },
            blockquote: {
                title: 'Blockquote',
                icons: {
                    primary: 'ui-icon-blockquote'
                },
                classes: 'ui-editor-icon',
                click: function() {
                    this._selection.wrapWithTag.call(this, 'blockquote');
                }
            },
            tagMenu: {
                title: 'Tag Menu',
                initialize: function(object, button_group) {
                    var editorInstance = this;
                    $('<select autocomplete="off" name="tag" class="ui-editor-tag-select">\
                        <option value="na">N/A</option>\
                        <option value="p">Paragraph</option>\
                        <option value="h1">Heading&nbsp;1</option>\
                        <option value="h2">Heading&nbsp;2</option>\
                        <option value="h3">Heading&nbsp;3</option>\
                        <option value="div">Divider</option>\
                    </select>').appendTo(button_group).data(editorInstance._data.names.button, object).bind('change.editor', function(){
                            var tag = $(this).find(':selected').val();
                            if (tag == 'na') return false
                            else editorInstance._selection.changeTag.call(editorInstance, tag);
                        }).selectmenu({
                        width: 150
                    });

                    if (this.options.customTooltips) {
                        button_group.find('.ui-selectmenu').tipTip({
                            content: 'Change HTML tag of selected element',
                            maxWidth: 'auto'
                        });
                    }
                },
                stateChange: function() {
                    var menu = $('.ui-editor-tag-select');
                    if (this._util.isRoot.call(this, this._editor.selectedElement)) menu.selectmenu('disable');
                    else menu.selectmenu('enable');
                },
                destroy: function() {
                    $('.ui-editor-tag-select').selectmenu('destroy');
                }
            }
        },

        // Options start here
        options: {
                     
            cssPrefix: 'ui-editor-',
            customTooltips: true,
            
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
            
            customButtons: {},
            buttonOrder: false,
            
            unsavedEditWarning: true,
            unsavedEditWarningContent: 'This block contains unsaved changes',
            unsavedEditWarningContentTooltipPosition: 'bottom',
            unsavedEditWarningContentTooltipMaxWidth: 'auto',
            unsavedEditWarningContentClass: '',
            unsavedEditWarningAnimation: 'fade',
            unsavedEditWarningPositionAt: 'right bottom',
            unsavedEditWarningPositionMy: 'right bottom',
            unsavedEditWarningContentIdleOpacity: 0.5,
            unsavedEditWarningContentPositionUsing: function(position) {
                $(this).css({
                    position: 'absolute',
                    top: position.top,
                    left: position.left
                });
            },
            
            titleVisible: true,
            titleDefault: 'jQuery UI Editor Controls',
            titleTags: true,
                        
            linkPanelAnimation: 'fade',
            linkReplaceTypes: false,
            linkCustomTypes: []
        },
        
        _init: function() {
            if (typeof rangy == 'undefined') {
                this._util.exception('The rangy library is required but could not be found');
            }
            if (this.options.customTooltips && !$.isFunction($.fn.tipTip)) {
                this.options.customTooltips = false;
                this._util.exception('Custom tooltips was requested but tipTip (http://code.drewwilson.com/entry/tiptip-jquery-plugin) wasn\'t found.\nCustom tooltips disabled');
            }
            this._clickToEdit.initialize.call(this);
        },
        
        _create: function() {
            this._instances.push(this);
        },
        
        _classes: {
            highlight: 'ui-widget-editor-highlight',
            hover: 'ui-widget-editor-hover',
            editing: 'ui-widget-editor-editing'
        },
        
        _util: {
           
            count_objects: function(obj) {
                var i = 0,
                    x = null;
                for (x in obj) {
                    if (obj.hasOwnProperty(x)) i++;
                }
                return i;
            },
            
            isRoot: function(element) {
         
                var isRoot = (this._util.identify(element) == this._util.identify(this.element) 
                                || element.get(0).tagName.toLowerCase() == 'body');
                                
                if (!isRoot) $(element).removeAttr('id');
                
                return isRoot;
            },
            
            identify: function(element) {
                var i = 0,
                    uid = null;
                if(typeof $(element).attr('id') == 'undefined') {
                    do { 
                        i++;
                        id = 'uid_' + i;
                    } while($('#' + id).length > 0);            
                    $(element).attr('id', id);
                }
                return $(element).attr('id');
            },
            
            valid_url: function(url) {
                return /^(http|https|ftp):\/\/[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/i.test(url);
            },
        
            exception: function(message) {
                if (window.console && window.console.error) window.console.error(message);
            }
        },
        
        _data: {
            
            exists: function(element, name) {
                return typeof $(element).data(name) != 'undefined';
            },
            
            names: {
                originalHtml: 'ui-widget-editor-original-html',
                button: 'ui-widget-button',
                linkType: 'ui-widget-editor-link-type',
                unsavedEditsWarning: 'ui-widget-editor-unsaved-edits',
                toolbarPosition: 'ui-widget-editor-toolbar-position'
            },
            
            clear: function(name) {
                $.removeData(this.element.get(0), name);
            }
            
        },

        _clickToEdit: {
            
            message: false,
            
            initialize: function() {
                this.element.bind('mouseenter.target', $.proxy(this._clickToEdit.show, this));
                this.element.bind('mouseleave.target', $.proxy(this._clickToEdit.hide, this));
                this.element.bind('click.target', $.proxy(this._editor.show, this));
            },
            
            show: function() {
                if (!this.element.hasClass(this._classes.editing)) {
                    
                    $(this._instances).each(function() {
                        this.element.removeClass(this._classes.highlight);
                        this.element.removeClass(this._classes.hover);
                        this._clickToEdit.hide.call(this);
                    });
                    
                    if (!this._clickToEdit.message) {
                        this._clickToEdit.message = $('<div class="ui-widget-editor-edit ' 
                                                        + this.options.beginEditingClass 
                                                        + '" style="opacity: 0;">\
                                                            ' + this.options.beginEditingContent + '\
                                                        </div>').appendTo('body');
                    }

                    this.element.addClass(this._classes.highlight);
                    this.element.addClass(this._classes.hover);
                    
                    this._clickToEdit.message.position({
                        at: this.options.beginEditingPositionAt,
                        my: this.options.beginEditingPositionMy,
                        of: this.element,
                        using: this.options.beginEditingPositionUsing
                    }).stop().animate({ opacity: 1 });
                }
            },
            
            hide: function() {
                this.element.removeClass(this._classes.highlight);
                this.element.removeClass(this._classes.hover);
                if (this._clickToEdit.message) this._clickToEdit.message.stop().animate({ opacity: 0 });
            }
        },
        
        _editor: {
            
            editing: false,
            selectedElement: false,
            toolbar: false,
            initialized: false,
            
            initialize: function() {
                this._editor.toolbar = $('<div class="ui-widget-editor-toolbar">\
                                            <div class="ui-widget-editor-inner" style="display:none"></div>\
                                        </div>');
                
                this._editor.generateButtons.call(this);
                
                var editorInstance = this;
                
                this._editor.toolbar.dialog({
                    position: ($.isFunction(this.options.toolbarPosition) ? this.options.toolbarPosition.call(this) : this.options.toolbarPosition),
                    resizable: false,
                    closeOnEscape: false,
                    width: 'auto',
                    height: 'auto',
                    minHeight: 'auto',
                    resize: 'auto',
                    zIndex: 32000,
                    title: 'Editor loading...',
                    autoOpen: false,
                    dialogClass: this.options.dialogClass,
                    show: this.options.dialogShowAnimation,
                    hide: this.options.dialogHideAnimation,
                    open: function(event, ui) {
                        $(this).css('overflow', 'hidden');
                        var parent = $(this).parent();
                        parent.css('position', 'fixed')
                            .attr('unselectable', 'on')
                            .find('.ui-dialog-titlebar-close', ui)
                            .remove();
                    }
                });
                
                $(window).bind('beforeunload', $.proxy(this._actions.unloadWarning, this));
                
                if (typeof rangy == 'undefined') {
                    this._dialog.alert.show.call(this, {
                        title: 'Required Library Not Found', 
                        message: '<p><span class="ui-icon ui-icon-alert" style="float:left; margin:2px 7px 0px 0px;"></span>The rangy library is required but could not be found. </p>\
                                    <p>Rangy should have been included in the jQuery UI Editor package you downloaded.<br/>\
                                    If not it may be acquired here: <a href="http://code.google.com/p/rangy/" title="A cross-browser JavaScript range and selection library">Rangy</a></p>\
                                    <p>jQuery UI Editor will not be loaded.</p>'
                    });
                    return false;
                } else {
                    rangy.init();
                    this._editor.toolbar.dialog().dialog('open');
                }
             
                this._editor.initialized = true;
                this._editor.toolbar.find('.ui-widget-editor-inner').slideDown();
            },

            generateButtons: function() {
                
                var editorInstance = this,
                    buttons = this._buttons,
                    buttonOrder = null, button = null, object = null;

                $.extend(buttons, this.options.customButtons);
                
                this._editor.toolbar.find('.ui-widget-editor-inner').html('');

                buttonOrder = [
                    ['save', 'cancel', 'showGuides'],
                    ['viewSource'],
                    ['undo', 'redo'],
                    ['alignLeft', 'center', 'justify', 'alignRight'],
                    ['bold', 'italic', 'underline', 'strikethrough'],
                    ['unorderedList', 'orderedList'],
                    ['hr', 'blockquote'],
                    ['increaseFontSize', 'decreaseFontSize'],
                    ['addEditLink', 'removeLink'],
                    ['floatLeft', 'floatNone', 'floatRight'],
                    ['tagMenu']
                ];
                
                if (this.options.buttonOrder) buttonOrder = this.options.buttonOrder;

                $.each(buttonOrder, function() {
                    
                    button_group = $('<div></div>');
                        
                    if (editorInstance._util.count_objects(this) > 1) $(button_group).addClass('ui-widget-editor-buttonset');
                    
                    $.each(this, function(index, value) {
                        if (typeof buttons[value] == 'undefined') {
                            if (window.console && window.console.error) window.console.error('Button identified by key "' + value + '" does not exist');
                        } else {
                            object = buttons[value];
                            if ($.isFunction(object.initialize)) {
                                object.initialize.call(editorInstance, object, button_group);
                            } else {
                                button = $('<button>' + object.title + '</button>')
                                    .addClass('ui-widget-editor-button-' + value)
                                    .attr('name', value)
                                    .attr('title', value)
                                    .val(value)
                                    .data(editorInstance._data.names.button, object)
                                    .appendTo(button_group);
                            
                                if (typeof object.classes != 'undefined') button.addClass(object.classes);
                            
                                button.button({
                                    icons: object.icons, 
                                    disabled: (typeof object.disabled == 'undefined' ? false : object.disabled),
                                    text: false 
                                });
                                
                                if (editorInstance.options.customTooltips) {
                                    button.tipTip({
                                        content: object.title
                                    }).removeAttr('title');
                                }

                                $(button).appendTo(button_group);
                            }
                        }
                    });
                    button_group.appendTo(editorInstance._editor.toolbar.find('.ui-widget-editor-inner'));
                });

            },
            
            show: function() {
                
                this._editor.editing = true;
                this._clickToEdit.hide.call(this);

                if (this._editor.initialized === false) {
                    if (this._editor.initialize.call(this) === false) return;
                } else {
                    this._editor.toolbar.dialog('show');
                }
                if(!this.element.hasClass(this._classes.editing)) {
                    this._editor.attach.call(this);
                }
            },
            
            attach: function() {
                
                if (!this._data.exists(this.element, this._data.names.originalHtml)) {
                    this.element.data(this._data.names.originalHtml, this.element.html());
                }
                
                var editorInstance = this,
                    position = false;
                
                // If the instance should remember its toolbar position and reset it when the element is attached
                if (this.options.toolbarSaveIndividualPositions) {                
                    // Make sure the toolbar isn't repositioned if the user has manually moved it
                    if (this._data.exists(this.element, this._data.names.toolbarPosition)) {
                        position = this.element.data(this._data.names.toolbarPosition);
                    } else {
                        position = ($.isFunction(this.options.toolbarPosition) ? this.options.toolbarPosition.call(this) : this.options.toolbarPosition);
                    }
                    this._editor.toolbar.dialog().dialog('option', 'position', position);
                    this._editor.toolbar.dialog().dialog('option', 'dragStop', function() {
                        editorInstance.element.data(editorInstance._data.names.toolbarPosition, $(this).dialog().dialog('option', 'position'));
                    });
                }
            
                if (!this.options.titleVisible) this._editor.toolbar.dialog().parent().find('.ui-dialog-titlebar').hide();
                else this._editor.toolbar.dialog().parent().find('.ui-dialog-titlebar').show()
                
                // Unbind previous instances
                $(this._instances).each(function(){
                    var iteratingEditorInstance = this;
                    this._editor.toolbar.find('button').each(function() {
                        var data = $(this).data(editorInstance._data.names.button);
                        if ($.isFunction(data.destroy)) {
                            data.destroy.call(iteratingEditorInstance, this);
                        }
                    });
                    // Fire detachment events
                    $.each(this._plugins, function() {
                        if ($.isFunction(this.detach)) {
                            this.detach.call(editorInstance);
                        }
                    });
                    iteratingEditorInstance._editor.editing = false;
                    iteratingEditorInstance.element.unbind('keyup.editor click.editor');
                    iteratingEditorInstance.element.attr('contenteditable', 'false');
                    iteratingEditorInstance.element.removeClass(iteratingEditorInstance._classes.editing);
                    iteratingEditorInstance._message.hide.call(iteratingEditorInstance);
                });

                this._editor.generateButtons.call(this);
                
                this._editor.toolbar.find('button').each(function() {
                    var data = $(this).data(editorInstance._data.names.button);
                    if ($.isFunction(data.click)) {
                        $(this).unbind('click.editor').bind('click.editor', function(event) {
                            data.click.call(editorInstance, event, this);
                        });
                    }
                });

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
                
                this.element.addClass(this._classes.editing);
                this.element.attr('contenteditable', 'true');
                
                // Fire attachment events
                $.each(this._plugins, function() {
                    if ($.isFunction(this.attach)) {
                        this.attach.call(editorInstance);
                    }
                });
                this.element.bind('keyup.editor click.editor', function(event) {
                    if (!event.ctrlKey) {
                        editorInstance._actions.stateChange.call(editorInstance);
                    }
                    return true;
                });
                
                this._actions.stateChange.call(this);
                if (this.options.targetAnimation && $.isFunction(this.options.targetAnimation)) this.options.targetAnimation.call(this);
                this.element.focus();
            },
            
            destroy: function() {
                this._editor.toolbar.dialog('close');
                this._editor.editing = false;
                this._editor.initialized = false;
            }
        },
        
        _selection: {
        
            wrapWithTag: function(tag, options) {
                this._actions.beforeStateChange.call(this);
                
                if (typeof options == 'undefined') options = {};
                
                if(tag == 'ul' || tag == 'ol') {
                    this._selection.wrapWithList.call(this, tag, options);
                    return;
                }
                
                var classes = typeof options.classes != 'undefined' ? options.classes : tag;

                this._selection.enforceLegality.call(this);
                rangy.createCssClassApplier(this.options.cssPrefix + classes, {
                    normalize: true,
                    elementTagName: tag
                }).toggleSelection();
                
                this._actions.stateChange.call(this);
            },
            
            wrapWithList: function(tag, options) {
                this._actions.beforeStateChange.call(this);
                if (typeof options == 'undefined') options = {};
                
                var editorInstance = this,
                    create_applier = function(tag) {
                        return rangy.createCssClassApplier(editorInstance.options.cssPrefix + tag, {
                            normalize: true,
                            elementTagName: tag
                        });
                    };
                
                this._selection.enforceLegality.call(this);
                $(rangy.getSelection().getAllRanges()).each(function(){
                    if (this.startOffset == this.endOffset) {
                        var list = $('<' + tag + ' class="' + editorInstance.options.cssPrefix + tag + '">'
                                + '<li class="' + editorInstance.options.cssPrefix + 'li">First list item</li></' + tag + '>');
                        editorInstance._content.replaceRange.call(editorInstance, list, this);
                        editorInstance._selection.selectElement.call(editorInstance, list.find('li:first'));
                    } else {
                        create_applier(tag).applyToRange(this);
                        create_applier('li').applyToRange(this);
                    }
                });
                this._actions.stateChange.call(this);
            },
            
            replaceWithTag: function(tag, options) {
                if (typeof options == 'undefined') options = {};
                this._selection.enforceLegality.call(this);
                
                var classes = this.options.cssPrefix + ' ' + tag;
                classes += (typeof options.classes != 'undefined') ? ' ' + options.classes : '';
                
                this._selection.replace.call(this, $('<' + tag + ' class="' + classes + '"/>'));
            },
            
            insertTag: function(tag, options) {
                if (typeof options == 'undefined') options = {};

                this._selection.enforceLegality.call(this);
                
                var classes = this.options.cssPrefix + ' ' + tag;
                classes += (typeof options.classes != 'undefined') ? ' ' + options.classes : '';
                
                this._selection.insert.call(this, $('<' + tag + ' class="' + classes + '"/>'));
            },
            
            applyStyle: function(styles) {
                this._actions.beforeStateChange.call(this);
                
                if (!this._editor.selectedElement || this._util.isRoot.call(this, this._editor.selectedElement)) {
                    this.html($('<div></div>').css(styles).html(this.html()));
                } else {
                    var editorInstance = this;
                    $.each(styles, function(property, value) {
                        if (editorInstance._editor.selectedElement.css(property) == value) {
                            editorInstance._editor.selectedElement.css(property, '');
                        } else {
                            editorInstance._editor.selectedElement.css(property, value);
                        }
                    });
                }
                
                this._actions.stateChange.call(this);
            },
            
            replace: function(replacement) {
                var editorInstance = this;
                $(rangy.getSelection().getAllRanges()).each(function(){
                    editorInstance._selection.replaceRange.call(editorInstance, replacement, this);    
                });
            },
            
            replaceRange: function(replacement, range) {
                this._actions.beforeStateChange.call(this);
                
                range.deleteContents();
                if (typeof replacement.length === "undefined" || replacement.length == 1) {
                    range.insertNode(replacement[0].cloneNode(true));
                } else {
                    for (i = replacement.length - 1; i >= 0; i--) {
                        range.insertNode(replacement[i].cloneNode(true));
                    }
                }
                
                this._actions.stateChange.call(this);
            },
            
            insert: function(insert) {
                this._actions.beforeStateChange.call(this);
                $(rangy.getSelection().getAllRanges()).each(function(){
                    this.insertNode($(insert).get(0));
                });
                this._actions.stateChange.call(this);
            },
            
            changeTag: function(tag, options) {
                if (typeof options == 'undefined') options = {};
                
                this._actions.beforeStateChange.call(this);
                
                var applier = new_element = null;
                
                if (this._selection.exists.call(this)) {
                    
                    applier = rangy.createCssClassApplier(this.options.cssPrefix + tag, {
                        normalize: true,
                        elementTagName: tag
                    }).toggleSelection();    
                                            
                } else {
                    if (this._util.isRoot.call(this, this._editor.selectedElement)) {
                        this._editor.selectedElement = this.element.find(':first');
                    }
                    new_element = $('<' + tag + '>' + this._editor.selectedElement.html() + '</' + tag + '>');
                    
                    if (typeof this._editor.selectedElement.attr('class') != 'undefined') {
                        new_element.addClass(this._editor.selectedElement.attr('class'));
                    }
                    if (typeof this._editor.selectedElement.attr('style') != 'undefined') {
                        new_element.css(this._editor.selectedElement.attr('style'));
                    }
                    $(this._editor.selectedElement).replaceWith(new_element);
                }
                
                this._actions.refreshSelectedElement.call(this);
                this._actions.updateTitleTagList.call(this);
                
                this._actions.stateChange.call(this);
            },
            
            enforceLegality: function() {
                
                var element = this.element,
                    selection = rangy.getSelection(),
                    commonAncestor;
                    
                $(selection.getAllRanges()).each(function(){
                    if (this.commonAncestorContainer.nodeType == 3) commonAncestor = $(this.commonAncestorContainer).parent().get(0) 
                    else commonAncestor = this.commonAncestorContainer;
                    if (!$.contains(element.get(0), commonAncestor)) selection.removeRange(this);
                });
            },
            
            exists: function() {
                this._selection.enforceLegality.call(this);
                var all_ranges = rangy.getSelection().getAllRanges(),
                    range;
                if (!all_ranges.length) return false;
                
                if (all_ranges.length > 1) {
                    return true;
                } else {
                    range = all_ranges[0];
                    return range.startOffset != range.endOffset;
                }
            },

            selectElement: function(select_this) {
                this._editor.selectedElement = $(select_this);
                rangy.getSelection().selectAllChildren($(select_this).get(0));
                this.element.focus();
                this._actions.updateTitleTagList.call(this);
            },
            
            selectAll: function() {
                var selection = rangy.getSelection(),
                    range = null;
                selection.removeAllRanges();
                $.each(this.element.contents(), function() {
                    range = rangy.createRange();
                    range.selectNodeContents(this);
                    selection.addRange(range);
                });
                this.element.focus();
                this._actions.updateTitleTagList.call(this);
            }
            
        },
        
        _actions: {
            
            beforeStateChange: function() {
                $.each(this._plugins, function() {
                    if ($.isFunction(this.beforeStateChange)) {
                        this.beforeStateChange.call(this);
                    }
                });
            },
            
            stateChange: function() {
                
                if (!this._data.exists(this.element, this._data.names.originalHtml)) {
                    this.element.data(this._data.names.originalHtml, this.html.call(this));
                }
                
                this._content.unsavedEditWarning.toggle.call(this);
                this._actions.refreshSelectedElement.call(this);
                this._actions.updateTitleTagList.call(this);

                // Trigger buttons' state change handlers
                var editorInstance = this,
                    data = null;
                this._editor.toolbar.find('button, select').each(function() {
                    data = $(this).data(editorInstance._data.names.button);
                    if ($.isFunction(data.stateChange)) {
                        data.stateChange.call(editorInstance, this);
                    }
                });
                
                $.each(this._plugins, function() {
                    if ($.isFunction(this.stateChange)) {
                        this.stateChange.call(editorInstance);
                    };
                });
            },
       
            refreshSelectedElement: function() {
                try {
                    this._editor.selectedElement = $($.selectedElement().obj);
                } catch(e) {
                    this._editor.selectedElement = this.element;
                }
            },
        
            updateTitleTagList: function() {
                
                var title = this.options.titleDefault,
                    current = null, tagName = null, tagMenu = null,
                    i = 0;
                
                if (this.options.titleTags) {

                    this._selection.enforceLegality.call(this);
                    this._actions.refreshSelectedElement.call(this);
                    
                    if (this._editor.selectedElement) {
                       
                        current = this._editor.selectedElement;
                        
                        if (typeof current[0] != 'undefined') {
                        
                            tagName = current[0].tagName.toLowerCase();

                            // Update tag drop down
                            tagMenu = this._editor.toolbar.find('select.ui-editor-tag-select');
                            if (tagMenu.length) {                   
                                if (this._util.isRoot.call(this, current)) {
                                    tagMenu.val('na');
                                } else if (tagMenu.find('option[value=' + tagName + ']').length) {
                                    tagMenu.val(tagName);
                                } else {
                                    tagMenu.val('other');
                                }
                                tagMenu.selectmenu();
                            }
                            
                            title = '';
                            
                            // Update dialog title
                            while (true) {
                                
                                if (this._util.isRoot.call(this, current)) {
                                    title = '<a href="javascript: // Select all" name="root" \
                                        class="ui-widget-editor-element-path" title="Click to select all editable content">root</a>' + title;
                                    break;
                                }
                                
                                tagName = current[0].tagName.toLowerCase();
                                title = ' &gt; <a href="javascript: // Select element" name="' + i +'" \
                                        class="ui-widget-editor-element-path" title="Click to select the contents of this &quot;' + tagName.toUpperCase() + '&quot; element">' + tagName + '</a>' + title;
                                current = current.parent();
                                i++;
                            }
                        }
                    }
                }
                
                this._editor.toolbar.dialog({
                    title: title
                });
                
                if (this.options.customTooltips) this._editor.toolbar.parent().find('.ui-widget-editor-element-path').tipTip();
            },
                
            unloadWarning: function() {
                if (this._content.dirtyBlocksExist.call(this)) {
                    return '\nThere are unsaved changes on this page. \nIf you navigate away from this page you will loose your unsaved changes';
                }
            },

            link: {
                
                dialog: false,
                
                show: function() {
                    if (!this._actions.link.dialog) {
                        this._actions.link.dialog = $('<div style="display:none" class="ui-widget-editor-link-panel">\
                                                            <div class="ui-widget-editor-link-menu">\
                                                                <p>Choose a link type:</p>\
                                                                <fieldset></fieldset>\
                                                            </div>\
                                                            <div class="ui-widget-editor-link-wrap">\
                                                                <div class="ui-widget-editor-link-content"></div>\
                                                            </div>\
                                                        </div>').appendTo('body');
                    }
                    
                    this._actions.beforeStateChange.call(this);
                    
                    var editorInstance = this, 
                        selection = rangy.saveSelection(),
                        linkDialog = this._actions.link.dialog,
                        link_types_fieldset = linkDialog.find('.ui-widget-editor-link-menu fieldset'),
                        edit = this._editor.selectedElement.is('a'),
                        label,
                        link_types_classes = {},
                        link_types = [
                        // Page
                        {
                            type: 'external',
                            title: 'Page on this or another website',
                            content: '<h2>Link to a page on this or another website</h2>\
                                        <fieldset>\
                                            <label for="ui-widget-editor-link-external-href">Location</label>\
                                            <input id="ui-widget-editor-link-external-href" value="http://" name="location" class="ui-widget-editor-external-href" type="text">\
                                        </fieldset>\
                                        <h2>New window</h2>\
                                        <fieldset>\
                                            <label for="ui-widget-editor-link-external-target">\
                                                <input id="ui-widget-editor-link-external-target" name="blank" type="checkbox">\
                                                Check this box to have the link open in a new browser window</label>\
                                        </fieldset>\
                                        <h2>Not sure what to put in the box above?</h2>\
                                        <ol>\
                                            <li>Find the page on the web you want to link to</li>\
                                            <li>Copy the web address from your browser\'s address bar and paste it into the box above</li>\
                                        </ol>',
                            class_name: 'ui-widget-editor-link-external',
                            show: function(panel, edit) {
                                if (edit) {
                                    var a = this._editor.selectedElement;
                                    panel.find('input[name="location"]').val(a.attr('href'));
                                    if (a.attr('target') == '_blank') panel.find('input[name="target"]').prop('checked', true);
                                }
                            },
                            attributes: function(panel) {
                                var attributes = {
                                    href: panel.find('input[name="location"]').val()
                                };
                                
                                if (panel.find('input[name="blank"]').is(':checked')) attributes.target = '_blank';
                                
                                if (!this._util.valid_url(attributes.href)) {
                                    this.message.warning.call(this, 'The url for the link you inserted doesn\'t look well formed', 7000);
                                }
                                
                                return attributes;
                            }
                        },
                        // Email
                        {
                            type: 'email',
                            title: 'Email address',
                            content: '<h2>Link to an email address</h2>\
                                        <fieldset class="ui-widget-editor-link-email">\
                                            <label for="ui-widget-editor-link-email">Email</label>\
                                            <input id=ui-widget-editor-link-email" name="email" type="text"/>\
                                        </fieldset>\
                                        <fieldset class="ui-widget-editor-link-email">\
                                            <label for="ui-widget-editor-link-email-subject">Subject (optional)</label>\
                                            <input id="ui-widget-editor-link-email-subject" name="subject" type="text"/>\
                                        </fieldset>',
                            class_name: 'ui-widget-editor-link-email',
                            show: function(panel, edit) {
                                if (edit) {
                                    var a = this._editor.selectedElement;
                                    panel.find('input[name="email"]').val(a.attr('href').replace(/(mailto:)|(\?Subject.*)/gi, ''));
                                    if (/\?Subject\=/i.test(a.attr('href'))) {
                                        panel.find('input[name="subject"]').val(decodeURIComponent(a.attr('href').replace(/(.*\?Subject=)/i, '')));
                                    }
                                }
                            },
                            attributes: function(panel) {
                                var attributes = {
                                    href: 'mailto:' + panel.find('input[name="email"]').val()
                                }, subject = panel.find('input[name="subject"]').val();

                                if (subject) attributes.href = attributes.href + '?Subject=' + encodeURIComponent(subject);
                                
                                return attributes;
                            }
                        }
                    ];
                
                    // Remove & add custom radios
                    linkDialog.find('.ui-widget-editor-link-menu fieldset').html('');
                    
                    if (this.options.linkReplaceTypes) {
                        link_types = this.options.linkCustomTypes;
                    } else {
                        $.merge(link_types, this.options.linkCustomTypes);
                    }
                    
                    $(link_types).each(function() {
                        label = $('<label>\
                                        <input class="' + this.class_name + '" type="radio" value="' + this.type + '" name="link_type" autocomplete="off"/>\
                                        <span>' + this.title + '</span>\
                                    </label>').appendTo(link_types_fieldset);
                        label.find('input[type="radio"]').data(editorInstance._data.linkType, this);
                        link_types_classes[this.class_name] = this.class_name;
                    });
                    
                    link_types_fieldset.find('input[type="radio"]').unbind('change.editor').
                            bind('change.editor', function(){
                                editorInstance._actions.link.typeChange.call(editorInstance, edit);
                            });
                    
                    var title = (edit ? 'Edit' : 'Insert') + ' Link';
                    
                    this._actions.link.dialog.dialog({
                        autoOpen: false,
                        modal: true,
                        resizable: true,
                        width: 750,
                        height: 450,
                        title: title,
                        dialogClass: this.options.dialogClass + ' ui-widget-editor-link',
                        show: this.options.dialogShowAnimation,
                        hide: this.options.dialogHideAnimation,
                        buttons: [
                            {
                                text: title,
                                'class': 'insert',
                                click: function() {
                                    
                                    rangy.restoreSelection(selection);
                                    
                                    var data = linkDialog.find('input[type="radio"]:checked').data(editorInstance._data.linkType),
                                        attributes = data.attributes.call(editorInstance, linkDialog.find('.ui-widget-editor-link-content'), edit),
                                        a = null;
                                    
                                    if (!attributes) return;
                                    
                                    if (edit) {
                                        a = editorInstance._editor.selectedElement;
                                        $(link_types).each(function() {
                                            a.removeClass(this.class_name);
                                        });
                                        a.addClass(data.class_name);
                                        a.attr(attributes);
                                    } else {
                                    
                                        if (editorInstance._editor.selectedElement.is('img')) {
                                            editorInstance._editor.selectedElement.wrap($('a').attr(attributes).addClass('ui-widget-editor-link'));
                                        } else {
                                            rangy.createCssClassApplier('ui-widget-editor-link ' + data.class_name, {
                                                normalize: true,
                                                elementTagName: 'a',
                                                elementProperties: attributes
                                            }).applyToSelection();
                                        }
                                    }
                                    
                                    editorInstance._actions.stateChange.call(editorInstance);
                                    $(this).dialog('close');
                                }
                            },
                            {
                                text: 'Cancel',
                                'class': 'cancel',
                                click: function() {
                                    rangy.restoreSelection(selection);
                                    $(this).dialog('close');
                                }
                            }
                        ],
                        beforeopen: function() {
                            editorInstance._actions.link.dialog.find('.ui-widget-editor-link-content').hide();
                        },
                        open: function() {
                            editorInstance._dialog.applyButtonIcon('insert', 'circle-check');
                            editorInstance._dialog.applyButtonIcon('cancel', 'circle-close');
                            
                            if (!linkDialog.find('input[type="radio"]:checked').length) {
                                if (!edit) {
                                    linkDialog.find('input[type="radio"]:first').prop('checked', true);
                                    editorInstance._actions.link.typeChange.call(editorInstance, edit, true);
                                } else {
                                    linkDialog.find('input[type="radio"]').each(function(){
                                        var radio = $(this);
                                        $(editorInstance._editor.selectedElement.attr('class').split(' ')).each(function() {
                                            if (link_types_classes[this] && radio.hasClass(this)) {
                                                radio.prop('checked', true);
                                                editorInstance._actions.link.typeChange.call(editorInstance, edit, true);
                                                return;
                                            }
                                        });
                                    });
                                }
                            }
                        },
                        close: function() {
                            editorInstance._actions.link.dialog.find('.ui-widget-editor-link-content').hide();
                            $(this).dialog('destroy');
                        }
                    }).dialog('open');
                },
                
                typeChange: function(edit, initial) {
                    
                    var linkTypeData = this._actions.link.dialog.find('input[type="radio"]:checked').data(this._data.linkType),
                        panel = this._actions.link.dialog.find('.ui-widget-editor-link-content'),
                        wrap = panel.closest('.ui-widget-editor-link-wrap'),
                        ajax = (typeof linkTypeData.ajax != 'undefined'),
                        editorInstance = this,
                        initial = (typeof initial == 'undefined') ? false : initial;
                
                    if (ajax) wrap.addClass('ui-widget-editor-loading');
                    
                    if (initial) {
                        panel.html(linkTypeData.content);
                        panel.show();
                        if ($.isFunction(linkTypeData.show)) linkTypeData.show.call(editorInstance, panel, edit);
                    } else {                  
                        panel.hide(this.options.linkPanelAnimation, function(){
                            if (!ajax) {
                                panel.html(linkTypeData.content);
                                if ($.isFunction(linkTypeData.show)) linkTypeData.show.call(editorInstance, panel, edit);
                                panel.html(linkTypeData.content).show(editorInstance.options.linkPanelAnimation);
                            } else {
                                $.ajax({
                                    url: linkTypeData.ajax.uri,
                                    type: ((typeof linkTypeData.ajax.type != 'undefined') ? 'get' : linkTypeData.ajax.type),
                                    success: function(data) {
                                        panel.html(data);
                                        if ($.isFunction(linkTypeData.show)) linkTypeData.show.call(editorInstance, panel, edit);
                                        panel.show(editorInstance.options.linkPanelAnimation, function(){
                                            wrap.removeClass('ui-widget-editor-loading');
                                        });
                                    }   
                                });
                            }
                        });
                    }
                },
                
                remove: function() {
                    this._actions.beforeStateChange.call(this);

                    if (rangy.getSelection().getAllRanges().length == 1) {
                        
                        range = rangy.getSelection().getAllRanges()[0];
                        
                        node = range.commonAncestorContainer;
                        node = node.nodeType == 3 ? $(node).parent().get(0) : $(node).get(0);
                        
                        if (node.nodeName == 'A') {
                            range.selectNode(node);
                            var children = [];
                            
                            $(node.childNodes).each(function(){
                                children.push(this.cloneNode(true));
                            });
                            
                            range.deleteContents();
                            
                            $(children).each(function(){
                                range.insertNode(this);
                            });
                        }
                    }
                    
                    this._actions.stateChange.call(this);
                }

            }
        },
     
      _content: {

            cleaned: function(html) {
                var content = $('<div></div>').html(html);
               
                content.find('.rangySelectionBoundary').each(function(){
                    $(this).remove();
                });
                
                return content.html();
            },
            
            reset: function() {
                this.html(this.element.data(this._data.names.originalHtml));
                this._data.clear.call(this, this._data.names.originalHtml);
                this._content.unsavedEditWarning.hide.call(this);
            },
                        
            dirty: function() {
                if (this._data.exists(this.element, this._data.names.originalHtml)) {
                    var data = this.element.data(this._data.names.originalHtml);
                    if (data != this.element.html()) return true;
                }
                return false;
            },
            
            dirtyBlocksExist: function() {
                var unsaved = false;
                $(this._instances).each(function(){
                    if (this._content.dirty.call(this)) {
                        unsaved = true;
                        return;
                    }
                });
                return unsaved;
            },
            
            unsavedEditWarning: {
          
                toggle: function() {
                    if (this.options.unsavedEditWarning) {
                        if (this._content.dirty.call(this)) {
                            this._content.unsavedEditWarning.show.call(this);
                        } else {
                            this._content.unsavedEditWarning.hide.call(this);
                        }
                    }
                },
                
                show: function() {
                    var warning = false,
                        editorInstance = this;
                    if (!this._data.exists(this.element, this._data.names.unsavedEditsWarning)) {
                        var warning = $('<div title="' + this.options.unsavedEditWarningContent + '" class="ui-widget-editor-warning ' 
                                        + this.options.unsavedEditWarningContentClass 
                                        + '" style="display:none;">\
                                            <span class="ui-icon ui-icon-alert"></span>\
                                        </div>').hover(function() {
                            $(this).stop().animate({ opacity: 1 });
                        }, function() {
                            $(this).stop().animate({ opacity: editorInstance.options.unsavedEditWarningContentIdleOpacity });
                        }).appendTo('body');
                        
                        if (editorInstance.options.customTooltips) {
                            warning.tipTip({ 
                                delay: 100,
                                defaultPosition: this.options.unsavedEditWarningContentTooltipPosition,
                                maxWidth: this.options.unsavedEditWarningContentTooltipMaxWidth
                            });
                        }
                        this.element.data(this._data.names.unsavedEditsWarning, warning);
                    } else {
                        var warning = this.element.data(this._data.names.unsavedEditsWarning);
                    }
                    warning.position({
                        at: this.options.unsavedEditWarningPositionAt,
                        of: this.element,
                        my: this.options.unsavedEditWarningPositionMy,
                        using: this.options.unsavedEditWarningContentPositionUsing
                    })
                    if (!warning.is(':visible') && !warning.is(':animated')) {
                        warning.show(this.options.unsavedEditWarningAnimation, function(){
                            $(this).animate({ opacity: editorInstance.options.unsavedEditWarningContentIdleOpacity });
                        });
                    }
                },
                hide: function() {
                     if (this._data.exists(this.element, this._data.names.unsavedEditsWarning)) {
                        var warning = $(this.element.data(this._data.names.unsavedEditsWarning));
                        if (warning.is(':visible') && !warning.is(':animated')) warning.hide(this.options.unsavedEditWarningAnimation);
                     }
                }
            },
            
            destroy: function() {
                $(this._instances).each(function() {
                    this._content.reset.call(this);
                    this.element.unbind('keyup.editor click.editor paste.editor');
                    this.element.attr('contenteditable', 'false');
                    this.element.removeClass(this._classes.editing);
                });
            }
        },
        
        _dialog: {
            
            confirmation: {
                
                html: false,
                
                show: function(options) {
                
                    if (typeof options.message == 'undefined') options.message = 'Are you sure?';
                    if (typeof options.title == 'undefined') options.title = 'Confirmation';
                    
                    if (!this._dialog.confirmation.html) this._dialog.confirmation.html = $('<div>' + options.message + '</div>').appendTo('body');
                    else this._dialog.confirmation.html.html(options.message);
                    
                    var editorInstance = this;
                    
                    this._dialog.confirmation.html.dialog({
                        autoOpen: false,
                        modal: true,
                        resizable: false,
                        title: options.title,
                        dialogClass: this.options.dialogClass + ' ui-widget-editor-confirmation',
                        show: this.options.dialogShowAnimation,
                        hide: this.options.dialogHideAnimation,
                        buttons: [
                            {
                                text: 'OK',
                                'class': 'ok',
                                click: function() {
                                    if ($.isFunction(options.ok)) options.ok();
                                    $(this).dialog('close');
                                }
                            },
                            {
                                text: 'Cancel',
                                'class': 'cancel',
                                click: function() {
                                    if ($.isFunction(options.cancel)) options.cancel();
                                    $(this).dialog('close');
                                }
                            }
                        ],
                        open: function() {
                            editorInstance._dialog.applyButtonIcon('ok', 'circle-check');
                            editorInstance._dialog.applyButtonIcon('cancel', 'circle-close');
                        },
                        close: function() {
                            $(this).dialog('destroy');
                        }
                    }).dialog('open');

                }
            
            },
            
            alert: {
                
                html: false,
                
                show: function(options) {
                    
                    var editorInstance = this;
                    
                    if (!this._dialog.alert.html) this._dialog.alert.html = $('<div>' + options.message + '</div>').appendTo('body');
                    else this._dialog.alert.html.html(options.message);
                      
                    this._dialog.alert.html.dialog({
                        autoOpen: false,
                        modal: true,
                        resizable: false,
                        title: options.title,
                        width: 'auto',
                        dialogClass: this.options.dialogClass + ' ui-widget-editor-alert',
                        show: this.options.dialogShowAnimation,
                        hide: this.options.dialogHideAnimation,
                        buttons: [
                            {
                                text: 'OK',
                                'class': 'ok',
                                click: function() {
                                    $(this).dialog('close');
                                }
                            }
                        ],
                        open: function() {
                            editorInstance._dialog.applyButtonIcon('ok', 'circle-check');
                        },
                        close: function() {
                            $(this).dialog('destroy');
                        }
                    }).dialog('open');
                }  
                
            },
            
            applyButtonIcon: function(buttonClass, icon) {
                $('.ui-dialog-buttonpane').
                    find('.' + buttonClass).button({
                    icons: {
                        primary: 'ui-icon-' + icon
                    }
                });
            }
            
        },
        
        _message: {
            
            initialized: false,
            panel: false,
            hideTimeout: false,            
            
            types: {
                error: 'notice',
                confirm: 'check',                
                information: 'info',
                warning: 'alert',
                loading: 'loading'
            },
            
            initialize: function() {
                this._message.panel = $('.ui-widget-editor-messages');
                if (!this._message.panel.length) {
                    this._message.panel = $('<div class="ui-widget-editor-messages" style="display:none;clear:both">\
                                                <div>\
                                                    <span class="ui-icon"></span>\
                                                    <ul></ul>\
                                                </div>\
                                            </div>').appendTo(this._editor.toolbar);
                }
                this._message.initialized = true;
            },
            
            show: function(type, messages, delay, callback) {
                                
                if (!this._message.initialized) this._message.initialize.call(this);
                if ($.isFunction(delay)) callback = delay;
                if (typeof delay == 'undefined' || $.isFunction(delay)) delay = 5000;
                if (!$.isArray(messages)) messages = [messages];
                if (this._message.hideTimeout) window.clearTimeout(this._message.hideTimeout);
                    
                var editorInstance = this;
                
                this._message.hide.call(this, function(){
                                        
                    editorInstance._message.panel.find('ul').html('').removeAttr('class').addClass('ui-widget-messages-' + type);
                    editorInstance._message.panel.find('span.ui-icon').removeAttr('class').addClass('ui-icon ui-icon-' + type);
                    
                    $(messages).each(function(){
                        editorInstance._message.panel.find('ul').append($('<li>' + this + '</li>'));
                    });
                    
                    editorInstance._message.panel.slideDown(function(){
                        if (delay) {
                            editorInstance._message.hideTimeout = window.setTimeout(function(){
                                editorInstance._message.hide.call(editorInstance, callback);
                            }, delay);
                        }
                    });
                });
            },
            
            hide: function(callback) {
                if (this._message.initialized && this._message.panel) {
                    if (this._message.hideTimeout) window.clearTimeout(this._message.hideTimeout);
                    this._message.panel.slideUp(callback);
                }
            },
            
            destroy: function() {
                this._message.initialized = false;
                if (this._message.panel) this._message.panel.remove();
            }
        },

        html: function(html) {
            if (typeof html == 'undefined') {
                return this._content.cleaned(this.element.html());
            }
            this._actions.beforeStateChange.call(this);
            this.element.html(html);
            this._actions.stateChange.call(this);
            return this;
        },

        message: {
            
            loading: function(messages, delay, callback) {
                this._message.show.call(this, this._message.types.loading, messages, delay, callback);
            },
            
            information: function(messages, delay, callback) {
                this._message.show.call(this, this._message.types.information, messages, delay, callback);
            },
            
            confirm: function(messages, delay, callback) {
                this._message.show.call(this, this._message.types.confirm, messages, delay, callback);
            },
            
            error: function(messages, delay, callback) {
                this._message.show.call(this, this._message.types.error, messages, delay, callback);
            },
            
            warning: function(messages, delay, callback) {
                this._message.show.call(this, this._message.types.warning, messages, delay, callback);
            }
            
        },
        
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
            
            $.each(this._plugins, function() {
                if ($.isFunction(this.destroy)) {
                    this.destroy.call(editorInstance, this);
                };
            });
        }
        
    });
    
    $.ui.editor.addButton = function(name, button) {
        $.ui.editor.prototype._buttons[name] = button;
    };
    
    $.ui.editor.addPlugin = function(name, plugin) {
        $.ui.editor.prototype._plugins[name] = plugin;
    };
    
    $.ui.editor.addOptions = function(options) {
        $.extend($.ui.editor.prototype.options, options);
    };
    
})(jQuery, window, rangy);
