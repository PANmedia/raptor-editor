$(function() {
    $.widget('ui.editor', {
               
        _instances: [],
        
        options: {
            css_prefix: 'ui-editor-',
            dialog_animation: 'fade',
            replace_buttons: false,
            custom_buttons: [],
            save_uri: '/editor/save'
        },
        
        html: function(html) {
            if (typeof html == 'undefined') {
                return this._content.cleaned(this.element.html());
            }
            this._history.update.call(this);
            this.element.html(html);
            this._history.update.call(this);
            return this;
        },
        
        apply_button_icon: function(button_class, icon) {
            $('.ui-dialog-buttonpane').
                find('.' + button_class).button({
                icons: {
                    primary: 'ui-icon-' + icon
                }
            });
        },
        
        _init: function() {
            
            if(!$('.ui-widget-editor-edit').length) {
                $('body').append($('<span class="ui-widget-editor-edit ui-widget-header ui-corner-all" style="display: none;">\
                    <span class="ui-widget-editor-buttonset">\
                        <button type="button" name="edit" data-button_icon=\'{"icons\":{\"primary\":\"ui-icon-pencil\"}}\'>Edit</button>\
                        <button type="button" name="cancel"             data-button_icon=\'{\"icons\":{\"primary\":\"ui-icon-circle-close\"},\"text\":false}\'></button>\
                    </span>\
                </span>'));
            }
            
            this._edit.toolbar = $('.ui-widget-editor-edit');

            this._edit.toolbar.find('button').each(function(){
                $(this).button($(this).data('button_icon'));
            });

            this.element.bind('click mouseenter', $.proxy(this._edit.show, this));
            this.element.bind('mouseleave', $.proxy(this._edit.fade, this));
            this._edit.toolbar.bind('mouseenter', $.proxy(this._edit.fade_stop, this));
            this._edit.toolbar.bind('mouseleave', $.proxy(this._edit.fade, this));

        },
        
        _create: function() {
            this._instances.push(this);
        },
        
        _classes: {
            highlight: 'ui-widget-editor-highlight',
            hover: 'ui-widget-editor-hover',
            editing: 'ui-widget-editor-editing',
            guides: 'ui-widget-editor-guides'
        },
        
        _util: {
           
            count_objects: function(obj) {
                var i = 0;
                for (var x in obj) {
                if (obj.hasOwnProperty(x))
                    i++;
                }
                return i;
            },
            
            is_root: function(element) {
                
                if (!element) return false;
                
                var is_root = (this._util.identify(element) == this._util.identify(this.element) 
                                || element.get(0).tagName.toLowerCase() == 'body');
                                
                if (!is_root) $(element).removeAttr('id');
                
                return is_root;
            },
            
            enforce_legal_selection: function() {
                var element = this.element;
                var selection = rangy.getSelection();
                $(selection.getAllRanges()).each(function(){
                    var common_ancestor = (this.commonAncestorContainer.nodeType == 3) ? $(this.commonAncestorContainer).parent().get(0) : this.commonAncestorContainer;
                    if (!$.contains(element.get(0), common_ancestor)) selection.removeRange(this);
                });
            },
            
            identify: function(element) {
                var i = 0;
                if(typeof $(element).attr('id') == 'undefined') {
                    do { 
                        i++;
                        var id = 'uid_' + i;
                    } while($('#' + id).length > 0);            
                    $(element).attr('id', id);
                }
                return $(element).attr('id');
            }
        
        },
        
        _data: {
            
            exists: function(element, name) {
                return typeof $(element).data(name) != 'undefined';
            },
            
            names: {
                original_html: 'ui-widget-editor-original-html',
                button_tag: 'ui-widget-editor-tag',
                button_css: 'ui-widget-editor-css',
                button_custom: 'ui-widget-editor-custom'
            },
            
            clear: function(name) {
                $.removeData(this.element.get(0), name);
            }
            
        },

        _edit: {
            
            fade_timeout: false,
            toolbar: null,
            
            show: function() {
                
                this._edit.toolbar.find('button[name="cancel"]').unbind().bind('click', $.proxy(this._edit.remove, this))
                this._edit.toolbar.find('button[name="edit"]').unbind().bind('click', $.proxy(this._editor.show, this))
                
                if (!this.element.hasClass(this._classes.editing)) {
                    
                    this.element.addClass(this._classes.highlight);
                    this.element.addClass(this._classes.hover);
                    
                    var position = this.element.offset();
                    
                    if (position.top < 100) {
                        position.top += $(this.element).height() + this._edit.toolbar.height();
                    }
                    
                    if (position.left < 50) {
                        position.left += (50 - position.left);
                    }
                    
                    $(this._edit.toolbar).show().css({
                        position: 'absolute',
                        top: Math.floor(position.top),
                        left: Math.floor(position.left) + $(this.element).width() / 2 - this._edit.toolbar.width() / 2,
                        margin: - this._edit.toolbar.outerHeight() + 'px 0 0 0'
                    });
                    
                }
            },
            
            fade: function() {
                this._edit.fade_stop.call(this);
                this.element.removeClass(this._classes.hover);
                $('.' + this._classes.highlight).removeClass(this._classes.highlight);
                this._edit.fade_timeout = window.setTimeout($.proxy(function() {
                    if (!this.element.hasClass(this._classes.hover)) {
                        this._edit.toolbar.fadeOut(350);
                    } else {
                        this._edit.fade.call(this);
                    }
                }, this), 500);
            },
            
            fade_stop: function() {
                $(this._instances).each(function() {
                    if (this._edit.fade_timeout != false) {
                        window.clearTimeout(this._edit.fade_timeout);
                        this._edit.fade_timeout = false;
                    }
                });
            },
            
            remove: function() {
                this.element.removeClass(this._classes.highlight);
                this._edit.toolbar.hide();
                this._edit.fade_stop.call(this);
            }
            
        },
        
        _editor: {
            
            editing: false,
            selected_element: false,
            toolbar: false,
            initialized: false,
            
            initialize: function() {
                this._editor.toolbar = $('<div class="ui-widget-editor-toolbar">\
                                            <div class="ui-widget-editor-inner" style="display:none"></div>\
                                        </div>');
                
                this._editor.generate_buttons.call(this);
                
                this._editor.toolbar.dialog({
                    position: [5, 47],
                    resizable: false,
                    closeOnEscape: false,
                    width: 'auto',
                    height: 'auto',
                    minHeight: 'auto',
                    resize: 'auto',
                    zIndex: 32000,
                    title: 'Editor loading...',
                    show: this.options.dialog_animation,
                    hide: this.options.dialog_animation,
                    open: function(event, ui) {
                        var parent = $(this).parent();
                        parent.attr('unselectable', 'on');
                        parent.css('position', 'fixed');
                        parent.css('top', '47px');
                        parent.addClass('ui-widget-editor-dialog');
                        parent.find('.ui-dialog-titlebar-close', ui).remove();
                        parent.find('.ui-dialog-titlebar', ui).css('padding', 0);
                        $(this).css('overflow', 'hidden');
                    }
                });
                
                $(window).bind('beforeunload', $.proxy(this._actions.unload_warning, this));
                
                rangy.init();   // FIXME check for rangy here and let the user know if not found
                
                this._editor.initialized = true;
                this._editor.toolbar.find('.ui-widget-editor-inner').slideDown();
            },
                ////$('.sie_tool_bar button[name=insert_image]').live('click', Editor.file_manager.image);
                ////$('.sie_tool_bar button[name=insert_table]').live('click', Editor.insert_table);
            
            generate_buttons: function() {
               
                var buttons = [
                    {
                        save: {
                            title: 'Save',
                            icon: 'disk'
                        },
                        cancel: {
                            title: 'Cancel',
                            icon: 'cancel'
                        },
                        show_guides: {
                            title: 'Show Guides',
                            icon: 'pencil'
                        }
                    },
                    {
                        view_source: {
                            title: 'View / Edit Source',
                            icon: 'view-source',
                            classes: 'ui-editor-icon'
                        }
                    },
                    {
                        undo: {
                            title: 'Step Back',
                            icon: 'arrowreturnthick-1-w'
                        },
                        redo: {
                            title: 'Step Forward',
                            icon: 'arrowreturnthick-1-e'
                        }
                    },
                    {
                        bold: {
                            title: 'Bold',
                            tag: 'strong',
                            icon: 'bold',
                            classes: 'ui-editor-icon'
                        },
                        italic: {
                            title: 'Italic',
                            tag: 'em',
                            icon: 'italic',
                            classes: 'ui-editor-icon'
                        },
                        underline: {
                            title: 'Underline',
                            tag: 'span',
                            apply_classes: 'underline',
                            icon: 'underline',
                            classes: 'ui-editor-icon'
                        },
                        strikethrough: {
                            title: 'Strikethrough',
                            tag: 'del',
                            icon: 'strikethrough',
                            classes: 'ui-editor-icon'
                        }
                    },
                    {
                        align_left: {
                            title: 'Left-align',
                            property: 'text-align',
                            value: 'left',
                            icon: 'left-align',
                            classes: 'ui-editor-icon'
                        },
                        justify: {
                            title: 'Justify',
                            property: 'text-align',
                            value: 'justify',
                            icon: 'justify',
                            classes: 'ui-editor-icon'
                        },
                        align_center: {
                            title: 'Cener-align',
                            property: 'text-align',
                            value: 'center',
                            icon: 'center-align',
                            classes: 'ui-editor-icon'
                        },
                        align_right: {
                            title: 'Right-align',
                            property: 'text-align',
                            value: 'right',
                            icon: 'right-align',
                            classes: 'ui-editor-icon'
                        }
                    },
                    {
                        unordered_list: {
                            title: 'Unordered List',
                            tag: 'ul',
                            icon: 'unordered-list',
                            classes: 'ui-editor-icon'
                        },
                        ordered_list: {
                            title: 'Ordered List',
                            tag: 'ol',
                            icon: 'ordered-list',
                            classes: 'ui-editor-icon'
                        }
                    },
                    {
                        increasefontsize: {
                            title: 'Increase Font Size',
                            icon: 'font-up',
                            classes: 'ui-editor-icon'
                        },
                        decreasefontsize: {
                            title: 'Decrease Font Size',
                            icon: 'font-down',
                            classes: 'ui-editor-icon'
                        }
                    },
                    {
                        insert_link: {
                            title: 'Insert Link',
                            icon: 'insert-link',
                            classes: 'ui-editor-icon'
                        },
                        remove_link: {
                            title: 'Remove Link',
                            icon: 'remove-link',
                            classes: 'ui-editor-icon'
                        }
                    },
                    {
                        insert_hr: {
                            title: 'Insert Horizontal Rule',
                            icon: 'hr',
                            classes: 'ui-editor-icon'
                        },
                        blockquote: {
                            title: 'Blockquote',
                            tag: 'blockquote',
                            icon: 'blockquote',
                            classes: 'ui-editor-icon'
                        }
                    },
                    {
                        float_left: {
                            title: 'Float Left',
                            property: 'float',
                            value: 'left',
                            icon: 'float-left',
                            classes: 'ui-editor-icon'
                        },
                        float_none: {
                            title: 'Float None',
                            property: 'float',
                            value: 'none',
                            icon: 'float-none',
                            classes: 'ui-editor-icon'
                        },
                        float_right: {
                            title: 'Float Right',
                            property: 'float',
                            value: 'right',
                            icon: 'float-right',
                            classes: 'ui-editor-icon'
                        }
                    },
                    {
                    tag_menu: 'Tag Menu'
                }
                ];

                if (this.options.replace_buttons) {
                    buttons = this.options.custom_buttons;
                } else {
                    $.extend(buttons, this.options.custom_buttons);
                }
                
                this._editor.toolbar.find('.ui-widget-editor-inner').html('');
                
                // Buttons
                var links = source = files = false;
                var editor_instance = this;
                
                $.each(buttons, function() {
                    
                    if ($.isPlainObject(this)) {
                        var button_group = $('<div></div>');
                        if (editor_instance._util.count_objects(this) > 1) $(button_group).addClass('ui-widget-editor-buttonset');
                        
                        $.each(this, function(name, object) {
                            
                            var title = null;
                            var tag = false;
                            var data = {};
                            
                            if(typeof object === 'string') {
                                title = object;
                            } else {
                                title = object.title;
                                data = object;
                            }
                                
                            if (name == 'tag_menu') {
                                var tag_changer = $('<select autocomplete="off" name="tag" class="ui-editor-tag-select">\
                                    <option value="na">N/A</option>\
                                    <option value="p">Paragraph</option>\
                                    <option value="h1">Heading&nbsp;1</option>\
                                    <option value="h2">Heading&nbsp;2</option>\
                                    <option value="h3">Heading&nbsp;3</option>\
                                    <option value="div">Divider</option>\
                                </select>').appendTo(button_group).selectmenu({
                                    width: 150
                                });
                            } else {
                                
                                if (name == 'insert_link') links = true;
                                if (name == 'view_source') source = true;
                                if (name == 'insert_image') files = true;
                                
                                var button = $('<button>' + title + '</button>')
                                        .addClass('ui-widget-editor-button-' + name)
                                        .attr('title', title)
                                        .attr('name', name)
                                        .val(name)
                                        .appendTo(button_group);
                                
                                if (typeof object.classes != 'undefined') button.addClass(object.classes);
                                
                                $(button).button({
                                    icons: {
                                        primary: 'ui-icon-' + ((typeof object.icon == 'undefined') ? name : object.icon)
                                    },
                                    text: false
                                });
                                
                                if (name == 'save') $(button).button('option', 'disabled', true);
                                
                                if (!$.isEmptyObject(data)) {
                                    if (data.tag) {
                                        $(button).addClass(editor_instance._data.names.button_tag).
                                                data(editor_instance._data.names.button_tag, data);
                                    } else if (data.property) {
                                        $(button).addClass(editor_instance._data.names.button_css).
                                                data(editor_instance._data.names.button_css, data);
                                    } else {
                                        $(button).addClass(editor_instance._data.names.button_custom).
                                                data(editor_instance._data.names.button_custom, data);
                                    }
                                }
                                
                                $(button).appendTo(button_group);
                            }
                        });
                        button_group.appendTo(editor_instance._editor.toolbar.find('.ui-widget-editor-inner'));
                    }
                });
            
                if (links && !$('.ui-widget-editor-link-panel').length) {
                    $('<div style="display:none;" class="ui-widget-editor-link-panel">\
                            <div class="ui-widget-editor-link-menu">\
                                <h2>Choose a link type</h2>\
                                <fieldset>\
                                    <label>\
                                        <input type="radio" checked="checked" autocomplete="off" name="link_type" value="internal">\
                                        <span>Managed page on this website</span>\
                                    </label>\
                                    <label >\
                                        <input type="radio" autocomplete="off" name="link_type" value="external">\
                                        <span>Page on this or another website</span>\
                                    </label>\
                                    <label >\
                                        <input type="radio" autocomplete="off" name="link_type" value="email">\
                                        <span>Email address</span>\
                                    </label>\
                                    <label >\
                                        <input type="radio" value="file" name="link_type" autocomplete="off"/>\
                                        <span>File or document</span>\
                                    </label>\
                                </fieldset>\
                            </div>\
                            <div class="ui-widget-editor-link-wrap">\
                                <div class="ui-widget-editor-link-content">\
                            </div>\
                        </div>\
                    </div>').appendTo(this._editor.toolbar);
                }
            
                if (source && !$('.ui-widget-editor-view-source-panel').length) {
                    $('<div style="display:none" class="ui-widget-editor-view-source-panel">\
                            <textarea></textarea>\
                        </div>').appendTo(this._editor.toolbar);
                }
            
                //if (files) {
                    //$('<div style="display:none" class="sie-file-manager">\
                        //<div class="sie-file-manager-content"></div>\
                      //</div>').appendTo(Shinai.editor.controls);
                //}

            },
            
            show: function() {
                
                this._editor.editing = true;
                this._edit.remove.call(this);

                if (this._editor.initialized === false) {
                    this._editor.initialize.call(this);
                } else {
                    this._editor.toolbar.dialog('show');
                }
                
                this._editor.target.call(this);
            },
            
            target: function() {
                
                $('.ui-widget-editor-view-source-panel').dialog('destroy');
                
                if (!this._data.exists(this.element, this._data.names.original_html)) {
                    this.element.data(this._data.names.original_html, this.element.html());
                }
                
                // Unbind previous instances
                $(this._instances).each(function(){
                    this._editor.editing = false;
                    this.element.unbind('keyup.editor click.editor paste.editor');
                    this.element.attr('contenteditable', 'false');
                    this.element.removeClass(this._classes.editing).removeClass(this._classes.guides);
                    this._message.hide.call(this);
                });

                this._editor.generate_buttons.call(this);
                
                // Button events
                this._editor.toolbar.find('button[name="view_source"]').unbind('click.editor').
                        bind('click.editor', $.proxy(this._buttons.view_source, this));
                this._editor.toolbar.find('button[name="undo"]').unbind('click.editor').
                        bind('click.editor', $.proxy(this._history.undo, this)).
                        button('option', 'disabled', true);
                this._editor.toolbar.find('button[name="redo"]').unbind('click.editor').
                        bind('click.editor', $.proxy(this._history.redo, this)).
                        button('option', 'disabled', true);
                
                var editor_instance = this;
                this._editor.toolbar.find('.ui-widget-editor-tag').unbind('click.editor').
                        bind('click.editor', function(){
                            editor_instance._buttons.tag.call(editor_instance, this, editor_instance._data.names.button_tag);
                        });
                this._editor.toolbar.find('.ui-widget-editor-css').unbind('click.editor').
                        bind('click.editor', function(){
                            editor_instance._buttons.css.call(editor_instance, this, editor_instance._data.names.button_css);
                        });
                
                this._editor.toolbar.find('button[name="increasefontsize"], button[name="decreasefontsize"]').unbind('click.editor').
                        bind('click.editor', function(){
                            editor_instance._buttons.exec.call(editor_instance, this);
                        });
                
                this._editor.toolbar.find('button[name="insert_hr"]').unbind('click.editor').
                        bind('click.editor', $.proxy(this._buttons.hr, this));
                
                this._editor.toolbar.find('select.ui-editor-tag-select').unbind('change.editor').
                        bind('change.editor', function(){
                            editor_instance._buttons.change_tag.call(editor_instance, this);
                        });
                
                this._editor.toolbar.find('button[name=show_guides]').unbind('click.editor').
                        bind('click.editor', $.proxy(this._buttons.guides, this));
                
                this._editor.toolbar.find('button[name="insert_link"]').unbind('click.editor').
                        bind('click.editor', $.proxy(this._buttons.insert_link, this));
                //$('.sie_tool_bar button[name="remove_link"]').live('click', Editor.actions.link.remove);
                
                $('.ui-widget-editor-dialog .ui-widget-editor-element-path').die('click.editor').
                        live('click.editor', function(){
                            editor_instance._actions.select_element.call(editor_instance, this);
                        });

                this._editor.toolbar.find('button[name="save"]').unbind('click.editor').
                        bind('click.editor', $.proxy(this._actions.save, this));

                this._editor.toolbar.find('button[name="cancel"]').unbind('click.editor').
                        bind('click.editor', $.proxy(this._actions.cancel, this));
                
                this.element.addClass(this._classes.editing);
                this.element.attr('contenteditable', 'true');
                
                this.element.bind('paste.editor', $.proxy(this._actions.paste.capture, this));
                this.element.bind('keyup.editor click.editor', $.proxy(this._actions.state_change, this));
                
                this._actions.state_change.call(this);
            }
        },
        
        _buttons: {
            
            view_source: function() {
                var editor_instance = this;

                $('.ui-widget-editor-view-source-panel').dialog({
                    modal: false,
                    width: 600,
                    height: 400,
                    resizable: true,
                    title: 'View Source',
                    dialogClass: 'ui-widget-editor-dialog ui-widget-editor-view-source',
                    show: this.options.dialog_animation,
                    hide: this.options.dialog_animation,
                    buttons: [
                        {
                            text: 'Reload Source',
                            'class': 'reload-source',
                            click: function() {
                                $(this).find('textarea').val(editor_instance.html());
                            },
                        },
                        {
                            text: 'Apply Source',
                            'class': 'apply-source',
                            click: function() {
                                editor_instance.html($(this).find('textarea').val());
                            }
                        }
                    ],
                    open: function() {
                        editor_instance.apply_button_icon('reload-source', 'refresh');
                        editor_instance.apply_button_icon('apply-source', 'circle-check');

                        $(this).find('textarea').val(editor_instance.html());
                    }
                }).dialog('open');
            },
        
            tag: function(button, data_name) {
                this._history.update.call(this);
                
                var data = $(button).data(data_name);

                if(data.tag == 'ul' || data.tag == 'ol') {
                    this._buttons.list.call(this, button, data_name);
                    return;
                }
                
                var apply_classes = data.apply_classes ? data.apply_classes : data.tag;
                
                this._util.enforce_legal_selection.call(this);
                rangy.createCssClassApplier(this.options.css_prefix + apply_classes, {
                    normalize: true,
                    elementTagName: data.tag
                }).toggleSelection();
                
                this._history.update.call(this);
            },
            
            list: function(button, data_name) {
                var data = $(button).data(data_name);

                var editor_instance = this;

                var create_applier = function(tag) {
                    return rangy.createCssClassApplier(editor_instance.options.css_prefix + tag, {
                        normalize: true,
                        elementTagName: tag
                    });
                };
                
                this._util.enforce_legal_selection.call(this);
                $(rangy.getSelection().getAllRanges()).each(function(){
                    if (this.startOffset == this.endOffset) {
                        var list = $('<' + data.tag + ' class="' + this.options.css_prefix + data.tag + '">'
                                + '<li class="' + this.options.css_prefix + 'li">First list item</li></' + data.tag + '>');
                        this._content.replace_range.call(this, list, range);
                    } else {
                        create_applier(data.tag).applyToRange(this);
                        create_applier('li').applyToRange(this);
                    }
                });
            },
            
            css: function(button, data_name) {
                this._history.update.call(this);
                
                var data = $(button).data(data_name);

                if (!this._editor.selected_element || this._util.is_root.call(this, this._editor.selected_element)) {
                    this.html($('<div></div>').css(data.property, data.value).html(this.html()));
                } else {
                    if (this._editor.selected_element.css(data.property) == data.value) {
                        this._editor.selected_element.css(data.property, '');
                    } else {
                        this._editor.selected_element.css(data.property, data.value);
                    }
                }
                
                this._history.update.call(this);
            },
            
            exec: function(button) {
                this._history.update.call(this);
                try {
                    if (window.console && window.console.error) {
                        console.error('Using unstable API: editor._buttons.exec ' + $(button).attr('name'));
                    }
                    document.execCommand($(button).attr('name'), false, null);
                } catch (exception) {
                    if (window.console && window.console.error) console.error(exception);
                }
                this._history.update.call(this);
            },
            
            hr: function() {
                this._history.update.call(this);
                var css_prefix = this.options.css_prefix;
                $(rangy.getSelection().getAllRanges()).each(function(){
                    this.insertNode($('<hr class="' + css_prefix + 'hr"/>').get(0));
                });
                this._history.update.call(this);
            },
            
            change_tag: function(select) {
                tag = $(select).find(':selected').val();
                
                this._history.update.call(this);
                
                this._util.enforce_legal_selection.call(this);
                var applier = rangy.createCssClassApplier(this.options.css_prefix + tag, {
                    normalize: true,
                    elementTagName: tag
                }).toggleSelection();
                
                this._actions.refresh_selected_element.call(this);
                this._actions.update_tag_selection.call(this);
                
                this._history.update.call(this);
            },
      
            guides: function() {
                this.element.toggleClass(this._classes.guides);
            }
      
        },
        
        _actions: {
            
            state_change: function() {
                
                this._history.update.call(this);
                this._actions.update_buttons.call(this);
                
                this._actions.refresh_selected_element.call(this);
                if (this._util.is_root.call(this, this._editor.selected_element)) {
                    this._editor.selected_element = this.element;
                }
                
                this._actions.update_tag_selection.call(this);
            },
       
            refresh_selected_element: function() {
                if (rangy.getSelection().getAllRanges().length) {
                    this._editor.selected_element = $($.selectedElement().obj);
                } else {
                    this._editor.selected_element = false;
                }
            },
        
            select_element: function(select_this) {
                var current = this._editor.selected_element, i = 0;
                while (i != $(select_this).attr('name')) {
                    current = current.parent();
                    i++;
                }
                this._editor.selected_element = current;
                rangy.getSelection().selectAllChildren(current.get(0));
                this._actions.update_tag_selection.call(this);
            },
                
            update_tag_selection: function() {
                    
                var title = 'Nothing selected';

                this._util.enforce_legal_selection.call(this);
                this._actions.refresh_selected_element.call(this);
                
                if (this._editor.selected_element) {
                    
                    title = '';
                    
                    var current = this._editor.selected_element;
                    
                    if (typeof current[0] != 'undefined') {
                    
                        var tag_name = current[0].tagName.toLowerCase();

                        // Show the attribute/CSS tabs
                        $('.sie_element').show();
                        $('.sie_element > ul > li').hide();
                        $('.sie_element > div').hide();

                        $('.sie_element > ul > li, .sie_element > div').each(function() {
                            var data = $(this).meta().sie_tags;
                            if (typeof data != 'undefined') {
                                if (in_array('__ROOT__', data)) {
                                    $(this).show();
                                    $(this).show();
                                } else if (in_array(tag_name, data)) {
                                    $(this).show();
                                } else if (!in_array('__ALL__', data)){
                                    $(this).hide();
                                }
                            }
                        });

                        // Update tag drop down
                        if (this._util.is_root.call(this, current)) {
                            this._editor.toolbar.find('select.ui-editor-tag-select').val('na');
                        } else if (this._editor.toolbar.find('select.ui-editor-tag-select option[value='+tag_name+']').length) {
                            this._editor.toolbar.find('select.ui-editor-tag-select').val(tag_name);
                        } else {
                            this._editor.toolbar.find('select.ui-editor-tag-select').val('other');
                        }
                        this._editor.toolbar.find('select.ui-editor-tag-select').selectmenu();
                        
                        // Update dialog title
                        var title = '';
                        var i = 0;
                        while (true) {
                            
                            if (this._util.is_root.call(this, current)) {
                                title = '(root) ' + title;
                                break;
                            }
                            tag_name = current[0].tagName.toLowerCase();
                            title = ' &gt; <a href="javascript: // Select element" name="' + i +'" \
                                    class="ui-widget-editor-element-path">' + tag_name + '</a>' + title;
                            current = current.parent();
                            i++;
                        }
                    }
                }
                
                this._editor.toolbar.dialog({
                    title: title
                });
            },
                
            unload_warning: function() {
                if (this._content.dirty_blocks_exist()) {
                    return 'There are unsaved changes on this page. \n\
                            If you navigate away from this page you will loose your unsaved changes';
                }
            },
            
            update_buttons: function() {
                this._actions.link.update_buttons.call(this);
                this._editor.toolbar.find('button[name="save"], button[name="cancel"]').button('option', 'disabled', !this._content.dirty.call(this));
            },
            
            link: {
                update_buttons: function() {
                    var selected = false, anchor_selected = false;
                    
                    $(rangy.getSelection().getAllRanges()).each(function(){
                        if (this.startOffset != this.endOffset) selected = true;
                    });
                    
                    if (rangy.getSelection().getAllRanges().length == 1) {
                        
                        range = rangy.getSelection().getAllRanges()[0];
                        
                        node = range.commonAncestorContainer;
                        node = node.nodeType == 3 ? $(node).parent().get(0) : $(node).get(0);
                        
                        if (node.nodeName == 'A') anchor_selected = true;
                    }
                    
                    this._editor.toolbar.find('button[name="remove_link"]').button('option', 'disabled', !anchor_selected);
                    this._editor.toolbar.find('button[name="insert_link"]').button('option', 'disabled', !(selected && !anchor_selected));
                }
            },
            
            paste: {
                
                in_progress: false,
                dialog: false,
                
                capture: function(event) {
                    
                    if (this._actions.paste.in_progress) return false;
                    this._actions.paste.in_progress = true;
                    
                    var selection = rangy.saveSelection();
                    var editor_instance = this;
                    
                    if($.contains(this.element.get(0), event.target)) {
                        var paste_bin = $('#paste-bin');
                        if (!paste_bin.length) {
                            paste_bin = $('<textarea id="paste-bin"></textarea>').css({
                                width: 1,
                                height: 1,
                                opacity: 0,
                                position: 'absolute',
                                left: -9999
                            }).appendTo('body');
                        }
                        paste_bin.focus();
                        
                        window.setTimeout(function(){
                            paste_bin.paste;
                            var pasted_value = $(paste_bin).val();
                            if (!editor_instance._actions.paste.dialog) {
                                
                                editor_instance._actions.paste.dialog = dialog = $('<div class="ui-editor-paste-panel">\
                                        <div class="ui-editor-paste-panel-tabs">\
                                            <ul>\
                                                <li><a href="#ui-editor-paste-plain">Plain Text</a></li>\
                                                <li><a href="#ui-editor-paste-rich">Rich Text</a></li>\
                                                <li><a href="#ui-editor-paste-source">Source Code</a></li>\
                                            </ul>\
                                            <div id="ui-editor-paste-plain">\
                                                <textarea class="ui-editor-paste-plain">' + pasted_value + '</textarea>\
                                            </div>\
                                            <div id="ui-editor-paste-rich">\
                                                <div class="ui-editor-paste-rich" contenteditable="true">' + pasted_value + '</div>\
                                            </div>\
                                            <div id="ui-editor-paste-source">\
                                                <textarea class="ui-editor-paste-source">' + pasted_value + '</textarea>\
                                            </div>\
                                        </div>\
                                    </div>');
                                    
                            } else {
                                editor_instance._actions.paste.dialog.find('textarea').val(pasted_value);
                                editor_instance._actions.paste.dialog.find('.ui-editor-paste-rich').html(pasted_value);
                            }
                            
                            $(editor_instance._actions.paste.dialog).dialog({
                                modal: true,
                                width: 450,
                                height: 500,
                                resizable: true,
                                dialogClass: '',
                                title: 'Paste',
                                position: 'center',
                                show: editor_instance.options.dialog_animation,
                                hide: editor_instance.options.dialog_animation,
                                dialogClass: 'ui-widget-editor-dialog ui-widget-editor-paste',
                                buttons: 
                                    [
                                        {
                                            text: 'OK',
                                            'class': 'ok',
                                            click: function() {
                                                
                                                rangy.restoreSelection(selection);
                                                
                                                paste = null, element = $(dialog).find('textarea:visible, .ui-editor-paste-rich:visible');
                                                
                                                if (element.hasClass('ui-editor-paste-plain') || element.hasClass('ui-editor-paste-source')) {
                                                    html = element.val();
                                                } else if (element.hasClass('ui-editor-paste-rich')) {
                                                    html = element.html();
                                                }
                                                
                                                var pasted_content = $('<div id="ui-editor-paste-bin" style="display: none;">' + html + '</div>').appendTo('body');
                                                
                                                rangy.restoreSelection(selection);
                                                editor_instance._content.replace_selection.call(editor_instance, pasted_content.get(0).childNodes);
                                                
                                                pasted_content.remove();
                                                
                                                editor_instance._actions.paste.in_progress = false;
                                                $(this).dialog('close').dialog('destroy');
                                            }
                                        },
                                        {
                                            text: 'Cancel',
                                            'class': 'cancel',
                                            click: function() {
                                                rangy.restoreSelection(selection);
                                                editor_instance._actions.paste.in_progress = false;
                                                $(this).dialog('close').dialog('destroy');
                                            }
                                        }
                                ],
                                open: function() {
                                    $(this).find('.ui-editor-paste-panel-tabs').tabs();
                                    editor_instance.apply_button_icon('cancel', 'circle-close');
                                    editor_instance.apply_button_icon('ok', 'circle-check');
                                },
                                close: function() {
                                    editor_instance._actions.paste.in_progress = false;
                                }
                            });
                            
                            paste_bin.remove();
                            
                        }, 0);
                    }
                    
                    return true;
                }
            },
            
            save: function() {
                // If the user has provided or bound their own save function 
                // Allow them to cancel the default
                if (this._trigger('save')) {
                    
                    var editor_instance = this;
                    
                    this.message.loading.call(this, 'Saving changes...', false);

                    var error = function(response_code) {
                        editor_instance.message.error.call(editor_instance, [
                            'Failed to save content',
                            'Response code ' + response_code + ' from ' + window.location.protocol + '//' + window.location.hostname + editor_instance.options.save_uri
                        ], 10000);
                    };

                    $.ajax(this.options.save_uri, {
                        data: {
                            html: this.html(),
                            name: this.element.attr('name')
                        },
                        type: 'post',
                        statusCode: {
                            404: function() {
                                error(404);
                            },
                            500: function() {
                                error(500);
                            }
                        },
                        success: function(data) {
                            editor_instance.confirm.call(editor_instance, 'Content saved');
                            editor_instance._data.clear.call(editor_instance._data.names.original_html);
                        }
                    });
                    
                }
            },
            
            cancel: function() {
                // If the user has provided or bound their own cancel function 
                // Allow them to cancel the default
                if (this._trigger('cancel')) {
                    // confirm
                    var editor_instance = this;
                    this._dialog.confirmation.show.call(this, {
                        message: 'Are you sure you want to stop editing? All changes will be lost',
                        title: 'Confirm Cancel Editing',
                        ok: function(){
                            editor_instance._content.reset.call(editor_instance);
                            editor_instance.message.information.call(editor_instance, 'Content reverted to original', function() {
                                editor_instance.destroy();
                            });
                        }
                    });
                }
            }
    
        },

        _history: {
            
            undo: {},
            redo: {},
            
            toggle_buttons: function() {
                var id = this._util.identify(this.element);
                this._editor.toolbar.find('button[name="undo"]').button('option', 'disabled', this._history.undo[id].length == 0);
                this._editor.toolbar.find('button[name="redo"]').button('option', 'disabled', this._history.redo[id].length == 0);
            },
           
            undo: function() {
                var id = this._util.identify(this.element);
                var data = this._history.undo[id].pop();
                
                this._history.redo[id].push(data);
                this.element.html(data.content);
                
                this._history.toggle_buttons.call(this);
            },
            
            redo: function() {
                var id = this._util.identify(this.element);                
                var data = this._history.redo[id].pop();
                    
                this._history.undo[id].push(data);
                this.element.html(data.content);
            
                this._history.toggle_buttons.call(this);
            },
            
            update: function() {
                
                var current_content = this._content.cleaned(this.element.html());
                var id = this._util.identify(this.element);

                if (typeof this._history.undo[id] == 'undefined') this._history.undo[id] = [];
                if (typeof this._history.redo[id] == 'undefined') this._history.redo[id] = [];
                
                // Don't add identical content to stack
                if (this._history.undo[id].length
                        && this._history.undo[id][this._history.undo[id].length-1].content == current_content) {
                    return;
                }
                
                this._history.undo[id].push({
                    content: current_content
                });
                
                this._actions.update_tag_selection.call(this);
                
                this._history.redo[id] = [];
                this._history.toggle_buttons.call(this);
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
                this.html(this.element.data(this._data.names.original_html));
                this._data.clear.call(this, this._data.names.original_html);
                this._actions.update_buttons.call(this);
            },
                        
            dirty: function() {
                if (this._data.exists(this.element, this._data.names.original_html)) {
                    var data = this.element.data(this._data.names.original_html);
                    if (data != this.element.html()) return true;
                }
                return false;
            },
            
            dirty_blocks_exist: function() {
                var unsaved = false;
                $(this._instances).each(function(){
                    if (this._content.dirty()) unsaved = true;
                });
                return unsaved;
            },
            
            replace_selection: function(replacement) {
                var editor_instance = this;
                $(rangy.getSelection().getAllRanges()).each(function(){
                    editor_instance._content.replace_range.call(editor_instance, replacement, this);    
                });
            },
            
            replace_range: function(replacement, range) {
                this._history.update.call(this);
                
                range.deleteContents();
                if (typeof replacement.length === "undefined" || replacement.length == 1) {
                    range.insertNode($(replacement).get(0));
                } else {
                    for (i = replacement.length - 1; i >= 0; i--) {
                        range.insertNode(replacement[i].cloneNode(true));
                    }
                }
                
                this._history.update.call(this);
            },
        
        },
        
        _dialog: {
            
            confirmation: {
                
                html: false,
                
                show: function(options) {
                
                    if (typeof options.message == 'undefined') options.message = 'Are you sure?';
                    if (typeof options.title == 'undefined') options.title = 'Confirmation';
                    
                    if (!this._dialog.confirmation.html) this._dialog.confirmation.html = $('<div>' + options.message + '</div>').appendTo('body');
                    else this._dialog.confirmation.html.html(options.message);
                    
                    var editor_instance = this;
                    
                    this._dialog.confirmation.html.dialog({
                        autoOpen: false,
                        modal: true,
                        resizable: false,
                        title: options.title,
                        dialogClass: 'ui-widget-editor-dialog ui-widget-editor-confirmation',
                        show: this.options.dialog_animation,
                        hide: this.options.dialog_animation,
                        buttons: [
                            {
                                text: 'OK',
                                'class': 'ok',
                                click: function() {
                                    if ($.isFunction(options.ok)) options.ok();
                                    $(this).dialog('close');
                                },
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
                            editor_instance.apply_button_icon('ok', 'circle-check');
                            editor_instance.apply_button_icon('cancel', 'circle-close');
                        },
                        close: function() {
                            $(this).dialog('destroy');
                        }
                    }).dialog('open');

                }
            }
            
        },
        
        _message: {
            
            initialized: false,
            panel: false,
            hide_timeout: false,            
            
            types: {
                error: 'notice',
                confirm: 'check',                
                information: 'info',
                loading: 'loading'
            },
            
            initialize: function() {
                this._message.initialized = true;
                this._message.panel = $('<div class="ui-widget-editor-messages" style="display:none;clear:both">\
                                            <div>\
                                                <span class="ui-icon"></span>\
                                                <ul></ul>\
                                            </div>\
                                        </div>').appendTo(this._editor.toolbar);
            },
            
            show: function(type, messages, delay, callback) {
                                
                if (!this._message.initialized) this._message.initialize.call(this);
                if ($.isFunction(delay)) callback = delay;
                if (typeof delay == 'undefined' || $.isFunction(delay)) delay = 5000;
                if (!$.isArray(messages)) messages = [messages];
                if (this._message.hide_timeout) window.clearTimeout(this._message.hide_timeout);
                    
                var editor_instance = this;
                
                this._message.hide.call(this, function(){
                                        
                    editor_instance._message.panel.find('ul').html('').removeAttr('class').addClass('ui-widget-messages-' + type);
                    editor_instance._message.panel.find('span.ui-icon').removeAttr('class').addClass('ui-icon ui-icon-' + type);
                    
                    $(messages).each(function(){
                        editor_instance._message.panel.find('ul').append($('<li>' + this + '</li>'));
                    });
                    
                    editor_instance._message.panel.slideDown(function(){
                        if (delay) {
                            editor_instance._message.hide_timeout = window.setTimeout(function(){
                                editor_instance._message.hide.call(editor_instance, callback);
                            }, delay);
                        }
                    });
                });
            },
            
            hide: function(callback) {
                if (this._message.initialized) {
                    if (this._message.hide_timeout) window.clearTimeout(this._message.hide_timeout);
                    this._message.panel.slideUp(callback);
                }
            }
            
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
            }
            
        },
        
        destroy: function() {
            this._editor.toolbar.dialog('close');
            this._editor.editing = false;
            this.element.unbind('keyup.editor click.editor paste.editor');
            this.element.attr('contenteditable', 'false');
            this.element.removeClass(this._classes.editing).removeClass(this._classes.guides);
            this._message.hide.call(this);
        }
    
    });
});
