function _(string, variables) {
    if ($.ui.editor.prototype._plugins.i18n) {
        return $.ui.editor.prototype._plugins.i18n.translate(string, variables);
    } else if (!variables) {
        return string;
    } else {
        $.each(variables, function(key, value) {
            string = string.replace('<*' + key + '*>', value);
        });
        return string;
    }
};

(function() {

    // Private variables
    var events = {};

    // Instance definition
    $.widget('ui.editor', {

        _instances: [],

        _events: {},

        // Plugins added via $.ui.editor.addPlugin
        _plugins: { },

        // Buttons added via $.ui.editor.addButton
        _buttons: { },

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

            buttonOrder: false,

            titleVisible: true,
            titleDefault: 'jQuery UI Editor Controls',
            titleTags: true
        },

        _init: function() {
            // <strict>
            // Ensure jQuery has been included
            if (!$) console.error(_('jQuery is required'));
            // Ensure rangy has been included
            if (!rangy) console.error(_('Rangy is required. This library should have been included with the file you downoaded. If not, acquire it here: http://code.google.com/p/rangy/"'));
            // Ensure dialog has been included
            if (!$.ui.dialog) console.error(_('jQuery UI Dialog is required.'));
            // Warn that no internationalizations have been loaded
            if (!$.ui.editor.prototype._plugins.i18n) console.debug(_('No internationalizations have been loaded, defaulting to English'));
            // </strict>

            // <debug>
            if (!jQuery.cookie) console.error(_('jQuery cookie has not been loaded - persistence functions will not be available'));
            // </debug>

            if (this.options.customTooltips && !$.isFunction($.fn.tipTip)) {
                this.options.customTooltips = false;
                // <strict>
                console.error(_('Custom tooltips was requested but tipTip has not been loaded. This library should have been in the file you downloaded. If not, acquire it here: http://code.drewwilson.com/entry/tiptip-jquery-plugin'));
                // </strict>
            }
            if (!jQuery.cookie) this.options.persistence = false;

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
            }

        },

        _data: {

            exists: function(element, name) {
                return typeof $(element).data(name) != 'undefined';
            },

            names: {
                originalHtml: 'ui-widget-editor-original-html',
                button: 'ui-widget-button',
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
                                                            ' + _(this.options.beginEditingContent) + '\
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
                    title: _('Editor loading...'),
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

                // Fire plugin initialize events
                $.each(this._plugins, function(name) {
                    if ($.isFunction(this.initialize)) {
                        this.initialize.apply(this, [editorInstance, editorInstance.options.plugins[name] || {}]);
                    }
                });

                rangy.init();
                this._editor.toolbar.dialog().dialog('open');

                this._editor.initialized = true;
                this._editor.toolbar.find('.ui-widget-editor-inner').slideDown();
            },

            generateButtons: function() {

                var editorInstance = this,
                    buttonOrder = null, button = null, object = null;

                this._editor.toolbar.find('.ui-widget-editor-inner').html('');

                buttonOrder = [
                    ['dock'],
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
                    ['tagMenu'],
                    ['i18n']
                ];

                if (this.options.buttonOrder) buttonOrder = this.options.buttonOrder;

                $.each(buttonOrder, function() {

                    button_group = $('<div></div>');

                    if (editorInstance._util.count_objects(this) > 1) $(button_group).addClass('ui-widget-editor-buttonset');

                    $.each(this, function(index, value) {
                        if (typeof editorInstance._buttons[value] != 'undefined') {
                            object = editorInstance._buttons[value];
                            if ($.isFunction(object.initialize)) {
                                object.initialize.call(editorInstance, object, button_group);
                            } else {
                                var title = _(object.title);
                                button = $('<button>' + title + '</button>')
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
                                        content: title
                                    }).removeAttr('title');
                                }

                                $(button).appendTo(button_group);
                            }
                        }
                        // <strict>
                        else {
                            console.error(_('Button identified by key "<*button*>" does not exist', { button: value }));
                        }
                        // </strict>
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
                document.execCommand('enableInlineTableEditing', false, false);
                document.execCommand('enableObjectResizing', false, false);
                document.execCommand('styleWithCSS', true, true);

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
                                + '<li class="' + editorInstance.options.cssPrefix + 'li">' + _('First list item') + '</li></' + tag + '>');
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
                this._actions.stateChange.call(this);
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

                this._actions.refreshSelectedElement.call(this);
                this._actions.updateTitleTagList.call(this);

                var editorInstance = this,
                    data = null;

                // Trigger button & plugin state change handlers
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

                        var current = this._editor.selectedElement,
                            editorInstance = this;

                        if (typeof current[0] != 'undefined') {

                            $.each(this._plugins, function() {
                                if ($.isFunction(this.titleTagList)) {
                                    this.titleTagList.call(editorInstance, current);
                                };
                            });

                            title = '';

                            while (true) {  // Update dialog title

                                if (this._util.isRoot.call(this, current)) {
                                    title = '<a href="javascript: // ' + _('Select all') + '" name="root" \
                                        class="ui-widget-editor-element-path" title="' + _('Click to select all editable content') + '">root</a>' + title;
                                    break;
                                }

                                tagName = current[0].tagName.toLowerCase();
                                title = ' &gt; <a href="javascript: // ' + _('Select element') + '" name="' + i +'" \
                                        class="ui-widget-editor-element-path" title="' + _('Click to select the contents of this &quot;<*tagName*>&quot; element', { tagName: tagName.toUpperCase()}) + '">' + tagName + '</a>' + title;
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
                    return _('\nThere are unsaved changes on this page. \nIf you navigate away from this page you will loose your unsaved changes');
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
                this._actions.stateChange.call(this);
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

            destroy: function() {
                $(this._instances).each(function() {
                    this._content.reset.call(this);
                    this.element.unbind('keyup.editor click.editor');
                    this.element.attr('contenteditable', 'false');
                    this.element.removeClass(this._classes.editing);
                });
            }
        },

        _dialog: {

            confirmation: {

                html: false,

                show: function(options) {

                    if (typeof options.message == 'undefined') options.message = _('Are you sure?');
                    if (typeof options.title == 'undefined') options.title = _('Confirmation');

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
                                text: _('OK'),
                                'class': 'ok',
                                click: function() {
                                    if ($.isFunction(options.ok)) options.ok();
                                    $(this).dialog('close');
                                }
                            },
                            {
                                text: _('Cancel'),
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
        },

        bind: function(name, callback) {
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
            if (this._events[name]) {
                $.each(this._events[name], function() {
                    this();
                });
            }
            $.ui.editor.trigger(name);
        }

    });

    // Global static definition
    $.extend($.ui.editor, {
        addButton: function(name, button) {
            // <strict>
            if ($.ui.editor.prototype._buttons[name]) {
                console.error(_('Button "<*buttonName*>" has already been registered, and will be overwritten', {buttonName: name}));
            }
            // </strict>

            $.ui.editor.prototype._buttons[name] = button;

            // <debug>
            console.log(_('Button <*buttonName*> added', {buttonName: name}), button);
            // </debug>
        },

        addPlugin: function(name, plugin) {
            // <strict>
            if ($.ui.editor.prototype._plugins[name]) console.error(_('Plugin "<*pluginName*>" has already been registered, and will be overwritten', {pluginName: name}));
            // </strict>

            $.ui.editor.prototype._plugins[name] = plugin;

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
            // <debug>
            'Calling'
            // </debug>
            if (!events[name]) return;
            $.each(events[name], function() {
                this();
            })
        }
    });

})();
