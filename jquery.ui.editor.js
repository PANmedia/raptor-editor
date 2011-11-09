$(function() {
    $.widget('ui.editor', {
               
        _instances: [],
        
        options: {
            css_prefix: 'ui-editor-',
            dialog_animation: 'fade',
            replace_buttons: false,
            custom_buttons: {},
            unsaved_edit_warning: true,
            unsaved_edit_warning_animation: 'fade',
            button_order: false,
            save_uri: '/editor/save',
            link_panel_animation: 'fade',
            link_replace_types: false,
            link_custom_types: []
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
            editing: 'ui-widget-editor-editing'
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
         
                var is_root = (this._util.identify(element) == this._util.identify(this.element) 
                                || element.get(0).tagName.toLowerCase() == 'body');
                                
                if (!is_root) $(element).removeAttr('id');
                
                return is_root;
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
                original_html: 'ui-widget-editor-original-html',
                button: 'ui-widget-button',
                link_type: 'ui-widget-editor-link-type',
                unsaved_edits_warning: 'ui-widget-editor-unsaved-edits'
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

            generate_buttons: function() {
               
                var buttons = {
                    save: {
                        title: 'Save',
                        icons: {
                            primary: 'ui-icon-disk'
                        },
                        disabled: true,
                        click: function(event, button) {
                            // If the user has provided or bound their own save function 
                            // Allow them to cancel the default
                            if (this._trigger('save')) {
                                
                                this.message.loading.call(this, 'Saving changes...', false);

                                var error = function(response_code) {
                                    editor.message.error.call(editor, [
                                        'Failed to save content',
                                        'Response code ' + response_code + ' from ' + window.location.protocol + '//' + window.location.hostname + editor.options.save_uri
                                    ], 10000);
                                };
                                
                                var editor = this;
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
                                        editor.confirm.call(editor, 'Content saved');
                                        editor._data.clear.call(editor._data.names.original_html);
                                    }
                                });
                                
                            }
                        },
                        state_change: function(button) {
                            $(button).button('option', 'disabled', !this._content.dirty.call(this));
                        }
                    },
                    cancel: {
                        title: 'Cancel',
                        icons: {
                            primary: 'ui-icon-cancel'
                        },
                        click: function(event, button) {
                            // If the user has provided or bound their own cancel function 
                            // Allow them to cancel the default
                            if (this._trigger('cancel')) {
                                // confirm
                                var editor_instance = this;
                                this._dialog.confirmation.show.call(this, {
                                    message: 'Are you sure you want to stop editing? <br/><br/>All changes will be lost!',
                                    title: 'Confirm Cancel Editing',
                                    ok: function(){
                                        editor_instance._content.reset.call(editor_instance);
                                        editor_instance.destroy();
                                    }
                                });
                            }
                        }
                    },
                    show_guides: {
                        title: 'Show Guides',
                        icons: {
                            primary: 'ui-icon-pencil'
                        },
                        click: function() {
                            this.element.toggleClass('ui-widget-editor-guides');
                        },
                        destroy: function() {
                            this.element.removeClass('ui-widget-editor-guides');
                        }
                    },
                    view_source: {
                        title: 'View / Edit Source',
                        icons: {
                            primary: 'ui-icon-view-source'
                        },
                        classes: 'ui-editor-icon ui-widget-editor-button-view-source',
                        click: function() {
                            var editor_instance = this,
                                dialog = $('.ui-widget-editor-dialog-view-source');
                            
                            if (!dialog.length) {
                                dialog = $('<div style="display:none" class="ui-widget-editor-dialog-view-source">\
                                                <textarea></textarea>\
                                            </div>').appendTo(this._editor.toolbar);
                            }

                            dialog.dialog({
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
                                    editor_instance._dialog.apply_button_icon('reload-source', 'refresh');
                                    editor_instance._dialog.apply_button_icon('apply-source', 'circle-check');

                                    $(this).find('textarea').val(editor_instance.html());
                                },
                                close: function() {
                                    $(this).dialog('destroy');
                                }
                            }).dialog('open');
                        },
                        destroy: function() {
                            var dialog = $('.ui-widget-editor-dialog-view-source');
                            if (dialog.length) dialog.dialog('close');
                        }
                    },
                    undo: {
                        title: 'Step Back',
                        icons: {
                            primary: 'ui-icon-arrowreturnthick-1-w'
                        },
                        disabled: true,
                        click: function() {
                            this._history.undo.call(this);
                        },
                        state_change: function(button) {
                            this._history.toggle_buttons.call(this);
                        }
                    },
                    redo: {
                        title: 'Step Forward',
                        icons: {
                            primary: 'ui-icon-arrowreturnthick-1-e'
                        },
                        disabled: true,
                        click: function() {
                            this._history.redo.call(this);
                        },
                        state_change: function(button) {
                            this._history.toggle_buttons.call(this);
                        }
                    },
                    bold: {
                        title: 'Bold',
                        icons: {
                            primary: 'ui-icon-bold'
                        },
                        classes: 'ui-editor-icon',
                        click: function() {
                            this._selection.wrap_with_tag.call(this, 'strong');
                        }
                    },
                    italic: {
                        title: 'Italic',
                        icons: {
                            primary: 'ui-icon-italic'
                        },
                        classes: 'ui-editor-icon',
                        click: function() {
                            this._selection.wrap_with_tag.call(this, 'em');
                        }
                    },
                    underline: {
                        title: 'Underline',
                        icons: {
                            primary: 'ui-icon-underline'
                        },
                        classes: 'ui-editor-icon',
                        click: function() {
                            this._selection.wrap_with_tag.call(this, 'span', { classes: 'underline' });
                        }
                    },
                    strikethrough: {
                        title: 'Strikethrough',
                        icons: {
                            primary: 'ui-icon-strikethrough'
                        },
                        classes: 'ui-editor-icon',
                        click: function() {
                            this._selection.wrap_with_tag.call(this, 'del');
                        }
                    },
                    align_left: {
                        title: 'Left-align',
                        icons: {
                            primary: 'ui-icon-left-align'
                        },
                        classes: 'ui-editor-icon',
                        click: function() {
                            this._selection.apply_styles.call(this, { 'text-align': 'left' });
                        }
                    },
                    justify: {
                        title: 'Justify',
                        icons: {
                            primary: 'ui-icon-justify'
                        },
                        classes: 'ui-editor-icon',
                        click: function() {
                            this._selection.apply_styles.call(this, { 'text-align': 'justify' });
                        }                            
                    },
                    center: {
                        title: 'Center-align',
                        icons: {
                            primary: 'ui-icon-center-align'
                        },
                        classes: 'ui-editor-icon',
                        click: function() {
                            this._selection.apply_styles.call(this, { 'text-align': 'center' });
                        }
                    },
                    align_right: {
                        title: 'Right-align',
                        icons: {
                            primary: 'ui-icon-right-align'
                        },
                        classes: 'ui-editor-icon',
                        click: function() {
                            this._selection.apply_styles.call(this, { 'text-align': 'right' });
                        }
                    },
                    unordered_list: {
                        title: 'Unordered List',
                        icons: {
                            primary: 'ui-icon-unordered-list'
                        },
                        classes: 'ui-editor-icon',
                        click: function() {
                            this._selection.wrap_with_tag.call(this, 'ul');
                        }
                    },
                    ordered_list: {
                        title: 'Ordered List',
                        icons: {
                            primary: 'ui-icon-ordered-list'
                        },
                        classes: 'ui-editor-icon',
                        click: function() {
                            this._selection.wrap_with_tag.call(this, 'ol');
                        }
                    },
                    //increasefontsize: {
                        //title: 'Increase Font Size',
                        //icon: 'font-up',
                        //classes: 'ui-editor-icon'
                    //},
                    //decreasefontsize: {
                        //title: 'Decrease Font Size',
                        //icon: 'font-down',
                        //classes: 'ui-editor-icon'
                    //}
                    add_edit_link: {
                        title: 'Insert Link',
                        icons: {
                            primary: 'ui-icon-insert-link'
                        },
                        classes: 'ui-editor-icon',
                        click: function() {
                            this._actions.link.show.call(this);
                        },
                        state_change: function(button) {
                            $(button).button('option', 'disabled', !(this._selection.exists.call(this) || this._editor.selected_element.is('a')));
                        }
                    },
                    remove_link: {
                        title: 'Remove Link',
                        icons: {
                            primary: 'ui-icon-remove-link'
                        },
                        classes: 'ui-editor-icon',
                        click: function() {
                            this._actions.link.remove.call(this);
                        },
                        state_change: function(button) {
                            $(button).button('option', 'disabled', !this._editor.selected_element.is('a'));
                        }
                    },
                    hr: {
                        title: 'Insert Horizontal Rule',
                        icons: {
                            primary: 'ui-icon-hr'
                        },
                        classes: 'ui-editor-icon',
                        click: function() {
                            this._selection.insert_tag.call(this, 'hr');
                        }
                    },
                    blockquote: {
                        title: 'Blockquote',
                        icons: {
                            primary: 'ui-icon-blockquote'
                        },
                        classes: 'ui-editor-icon',
                        click: function() {
                            this._selection.wrap_with_tag.call(this, 'blockquote');
                        }
                    },
                    float_left: {
                        title: 'Float Left',
                        icons: {
                            primary: 'ui-icon-float-left'
                        },
                        classes: 'ui-editor-icon',
                        click: function() {
                            this._selection.apply_styles.call(this, { 'float': 'left' });
                        }
                    },
                    float_none: {
                        title: 'Float None',
                        icons: {
                            primary: 'ui-icon-float-none'
                        },
                        classes: 'ui-editor-icon',
                        click: function() {
                            this._selection.apply_styles.call(this, { 'float': 'none' });
                        }
                    },
                    float_right: {
                        title: 'Float Right',
                        icons: {
                            primary: 'ui-icon-float-right'
                        },
                        classes: 'ui-editor-icon',
                        click: function() {
                            this._selection.apply_styles.call(this, { 'float': 'right' });
                        }
                    },
                    tag_menu: {
                        title: 'Tag Menu',
                        initialize: function(object, button_group) {
                            var editor_instance = this;
                            $('<select autocomplete="off" name="tag" class="ui-editor-tag-select">\
                                <option value="na">N/A</option>\
                                <option value="p">Paragraph</option>\
                                <option value="h1">Heading&nbsp;1</option>\
                                <option value="h2">Heading&nbsp;2</option>\
                                <option value="h3">Heading&nbsp;3</option>\
                                <option value="div">Divider</option>\
                            </select>').appendTo(button_group).data(editor_instance._data.names.button, object).bind('change.editor', function(){
                                    var tag = $(this).find(':selected').val();
                                    if (tag == 'na') return false
                                    else editor_instance._selection.change_tag.call(editor_instance, tag);
                                }).selectmenu({
                                width: 150
                            });
                        },
                        state_change: function() {
                            var menu = $('.ui-editor-tag-select');
                            if (this._util.is_root.call(this, this._editor.selected_element)) menu.selectmenu('disable');
                            else menu.selectmenu('enable');
                        },
                        destroy: function() {
                            $('.ui-editor-tag-select').selectmenu('destroy');
                        }
                    }
                };

                $.extend(buttons, this.options.custom_buttons);
                
                this._editor.toolbar.find('.ui-widget-editor-inner').html('');

                var button_order = [
                    ['save', 'cancel', 'show_guides'],
                    ['view_source'],
                    ['undo', 'redo'],
                    ['align_left', 'center', 'justify', 'align_right'],
                    ['bold', 'italic', 'underline', 'strikethrough'],
                    ['unordered_list', 'ordered_list'],
                    ['hr', 'blockquote'],
                    ['add_edit_link', 'remove_link'],
                    ['float_left', 'float_none', 'float_right'],
                    ['tag_menu']
                ];
                
                if (this.options.button_order) button_order = this.options.button_order;
                
                // Buttons
                var links = source = files = false, 
                    editor_instance = this;
                
                $.each(button_order, function() {
                    
                    var button_group = $('<div></div>');
                    if (editor_instance._util.count_objects(this) > 1) $(button_group).addClass('ui-widget-editor-buttonset');
                    
                    $.each(this, function(index, value) {
                        if (typeof buttons[value] == 'undefined') {
                            if (window.console && window.console.error) window.console.error('Button identified by ' + value + ' does not exist');
                        } else {
                            var object = buttons[value];
                            if ($.isFunction(object.initialize)) {
                                object.initialize.call(editor_instance, object, button_group);
                            } else {
                                var button = $('<button>' + object.title + '</button>')
                                    .addClass('ui-widget-editor-button-' + name)
                                    .attr('title', object.title)
                                    .attr('name', value)
                                    .val(name)
                                    .data(editor_instance._data.names.button, object)
                                    .appendTo(button_group);
                            
                                if (typeof object.classes != 'undefined') button.addClass(object.classes);
                            
                                $(button).button({
                                    icons: object.icons, 
                                    disabled: (typeof object.disabled == 'undefined' ? false : object.disabled),
                                    text: false 
                                });

                                $(button).appendTo(button_group);
                            }
                        }
                    });
                    button_group.appendTo(editor_instance._editor.toolbar.find('.ui-widget-editor-inner'));
                });

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
                
                if (!this._data.exists(this.element, this._data.names.original_html)) {
                    this.element.data(this._data.names.original_html, this.element.html());
                }
                
                var editor_instance = this;
                // Unbind previous instances
                $(this._instances).each(function(){
                    var iterating_editor_instance = this;
                    this._editor.toolbar.find('button').each(function() {
                        var data = $(this).data(editor_instance._data.names.button);
                        if ($.isFunction(data.destroy)) {
                            data.destroy.call(iterating_editor_instance, this);
                        }
                    });
                    iterating_editor_instance._editor.editing = false;
                    iterating_editor_instance.element.unbind('keyup.editor click.editor paste.editor');
                    iterating_editor_instance.element.attr('contenteditable', 'false');
                    iterating_editor_instance.element.removeClass(iterating_editor_instance._classes.editing);
                    iterating_editor_instance._message.hide.call(iterating_editor_instance);
                });

                this._editor.generate_buttons.call(this);
                
                this._editor.toolbar.find('button').each(function() {
                    var data = $(this).data(editor_instance._data.names.button);
                    if ($.isFunction(data.click)) {
                        $(this).unbind('click.editor').bind('click.editor', function(event) {
                            data.click.call(editor_instance, event, this);
                        });
                    }
                });
                
                //this._editor.toolbar.find('button[name="increasefontsize"], button[name="decreasefontsize"]').unbind('click.editor').
                        //bind('click.editor', function(){
                            //editor_instance._buttons.exec.call(editor_instance, this);
                        //});
 
                $('.ui-widget-editor-dialog .ui-widget-editor-element-path').die('click.editor').
                        live('click.editor', function(){
                            var current = editor_instance._editor.selected_element, i = 0;
                            while (i != $(this).attr('name')) {
                                current = current.parent();
                                i++;
                            }
                            editor_instance._editor.selected_element = current;
                            rangy.getSelection().selectAllChildren(current.get(0));
                            editor_instance._actions.update_title_tag_list.call(editor_instance);
                        });
                
                this.element.addClass(this._classes.editing);
                this.element.attr('contenteditable', 'true');
                
                this.element.bind('paste.editor', $.proxy(this._actions.paste.capture, this));
                this.element.bind('keyup.editor click.editor', $.proxy(this._actions.state_change, this));
                
                this._actions.state_change.call(this);
            }
        },
        
        _selection: {
        
            wrap_with_tag: function(tag, options) {
                this._history.update.call(this);
                
                if (typeof options == 'undefined') options = {};
                
                if(tag == 'ul' || tag == 'ol') {
                    this._selection.wrap_with_list.call(this, tag, options);
                    return;
                }
                
                var classes = typeof options.classes != 'undefined' ? options.classes : tag;

                this._selection.enforce_legality.call(this);
                rangy.createCssClassApplier(this.options.css_prefix + classes, {
                    normalize: true,
                    elementTagName: tag
                }).toggleSelection();
                
                this._actions.state_change.call(this);
            },
            
            wrap_with_list: function(tag, options) {
                this._history.update.call(this);
                if (typeof options == 'undefined') options = {};
                
                var editor_instance = this,
                    create_applier = function(tag) {
                        return rangy.createCssClassApplier(editor_instance.options.css_prefix + tag, {
                            normalize: true,
                            elementTagName: tag
                        });
                    };
                
                this._selection.enforce_legality.call(this);
                $(rangy.getSelection().getAllRanges()).each(function(){
                    if (this.startOffset == this.endOffset) {
                        var list = $('<' + tag + ' class="' + editor_instance.options.css_prefix + tag + '">'
                                + '<li class="' + editor_instance.options.css_prefix + 'li">First list item</li></' + tag + '>');
                        editor_instance._content.replace_range.call(editor_instance, list, this);
                        editor_instance._selection.select_element.call(editor_instance, list.find('li:first'));
                    } else {
                        create_applier(tag).applyToRange(this);
                        create_applier('li').applyToRange(this);
                    }
                });
                this._actions.state_change.call(this);
            },
            
            replace_with_tag: function(tag, options) {
                if (typeof options == 'undefined') options = {};
                this._selection.enforce_legality.call(this);
                
                var classes = this.options.css_prefix + ' ' + tag;
                classes += (typeof options.classes != 'undefined') ? ' ' + options.classes : '';
                
                this._selection.replace.call(this, $('<' + tag + ' class="' + classes + '"/>'));
            },
            
            insert_tag: function(tag, options) {
                if (typeof options == 'undefined') options = {};

                this._selection.enforce_legality.call(this);
                
                var classes = this.options.css_prefix + ' ' + tag;
                classes += (typeof options.classes != 'undefined') ? ' ' + options.classes : '';
                
                this._selection.insert.call(this, $('<' + tag + ' class="' + classes + '"/>'));
            },
            
            apply_styles: function(styles) {
                this._history.update.call(this);
                
                if (!this._editor.selected_element || this._util.is_root.call(this, this._editor.selected_element)) {
                    this.html($('<div></div>').css(styles).html(this.html()));
                } else {
                    var editor_instance = this;
                    $.each(styles, function(property, value) {
                        if (editor_instance._editor.selected_element.css(property) == value) {
                            editor_instance._editor.selected_element.css(property, '');
                        } else {
                            editor_instance._editor.selected_element.css(property, value);
                        }
                    });
                }
                
                this._actions.state_change.call(this);
            },
            
            replace: function(replacement) {
                var editor_instance = this;
                $(rangy.getSelection().getAllRanges()).each(function(){
                    editor_instance._selection.replace_range.call(editor_instance, replacement, this);    
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
            
            insert: function(insert) {
                this._history.update.call(this);
                $(rangy.getSelection().getAllRanges()).each(function(){
                    this.insertNode($(insert).get(0));
                });
                this._actions.state_change.call(this);
            },
            
            change_tag: function(tag, options) {
                if (typeof options == 'undefined') options = {};
                
                this._history.update.call(this);
                    
                if (this._selection.exists.call(this)) {
                    
                    var applier = rangy.createCssClassApplier(this.options.css_prefix + tag, {
                        normalize: true,
                        elementTagName: tag
                    }).toggleSelection();    
                                            
                } else {
                    if (this._util.is_root.call(this, this._editor.selected_element)) {
                        this._editor.selected_element = this.element.find(':first');
                    }
                    var new_element = $('<' + tag + '>' + this._editor.selected_element.html() + '</' + tag + '>');
                    
                    if (typeof this._editor.selected_element.attr('class') != 'undefined') {
                        new_element.addClass(this._editor.selected_element.attr('class'));
                    }
                    if (typeof this._editor.selected_element.attr('style') != 'undefined') {
                        new_element.css(this._editor.selected_element.attr('style'));
                    }
                    $(this._editor.selected_element).replaceWith(new_element);
                }
                
                this._actions.refresh_selected_element.call(this);
                this._actions.update_title_tag_list.call(this);
                
                this._actions.state_change.call(this);
            },
            
            enforce_legality: function() {
                var element = this.element;
                var selection = rangy.getSelection();
                $(selection.getAllRanges()).each(function(){
                    var common_ancestor = null;
                    if (this.commonAncestorContainer.nodeType == 3) common_ancestor = $(this.commonAncestorContainer).parent().get(0) 
                    else common_ancestor = this.commonAncestorContainer;
                    if (!$.contains(element.get(0), common_ancestor)) selection.removeRange(this);
                });
            },
            
            exists: function() {
                this._selection.enforce_legality.call(this);
                var all_ranges = rangy.getSelection().getAllRanges();
                if (!all_ranges.length) return false;
                
                if (all_ranges.length > 1) {
                    return true;
                } else {
                    var range = all_ranges[0];
                    return range.startOffset != range.endOffset;
                }
            },

            select_element: function(select_this) {
                this._editor.selected_element = $(select_this);
                rangy.getSelection().selectAllChildren($(select_this).get(0));
                this._actions.update_title_tag_list.call(this);
                this.element.focus();
            }
            
        },
        
        _actions: {
            
            state_change: function() {
                
                if (!this._data.exists(this.element, this._data.names.original_html)) {
                    this.element.data(this._data.names.original_html, this.html.call(this));
                }
                
                this._content.toggle_unsaved_edit_warning.call(this);
                this._actions.refresh_selected_element.call(this);
                this._actions.update_title_tag_list.call(this);
                this._history.update.call(this);

                // Trigger buttons' state change handlers
                var editor_instance = this;
                this._editor.toolbar.find('button, select').each(function() {
                    var data = $(this).data(editor_instance._data.names.button);
                    if ($.isFunction(data.state_change)) {
                        data.state_change.call(editor_instance, this);
                    }
                });
            },
       
            refresh_selected_element: function() {
                try {
                    this._editor.selected_element = $($.selectedElement().obj);
                } catch(e) {
                    this._editor.selected_element = this.element;
                }
            },
        
            update_title_tag_list: function() {
                    
                var title = 'Nothing selected';

                this._selection.enforce_legality.call(this);
                this._actions.refresh_selected_element.call(this);
                
                if (this._editor.selected_element) {
                    
                    title = '';
                    
                    var current = this._editor.selected_element;
                    
                    if (typeof current[0] != 'undefined') {
                    
                        var tag_name = current[0].tagName.toLowerCase();

                        // Update tag drop down
                        var tag_menu = this._editor.toolbar.find('select.ui-editor-tag-select');
                        if (this._editor.toolbar.find('tag_menu.ui-editor-tag-select').length) {
                            
                            if (this._util.is_root.call(this, current)) {
                                tag_menu.val('na');
                            } else if (tag_menu.find('option[value=' + tag_name + ']').length) {
                                tag_menu.val(tag_name);
                            } else {
                                tag_menu.val('other');
                            }
                            tag_menu.selectmenu();
                        }
                        
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
                if (this._content.dirty_blocks_exist.call(this)) {
                    return 'There are unsaved changes on this page. \n\
                            If you navigate away from this page you will loose your unsaved changes';
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
                    
                    this._history.update.call(this);                    
                    
                    var selection = rangy.saveSelection(),
                        link_dialog = this._actions.link.dialog;
                    
                    // Remove & add custom radios
                    link_dialog.find('.ui-widget-editor-link-menu fieldset').html('');
                    
                    var editor_instance = this, 
                        link_types_fieldset = link_dialog.find('.ui-widget-editor-link-menu fieldset'),
                        edit = this._editor.selected_element.is('a'),
                        link_types_classes = {},
                        link_types = [
                        // Page
                        {
                            type: 'external',
                            title: 'Page on this or another website',
                            content: '<h2>Link to a page on this or another website</h2>\
                                        <fieldset>\
                                            <label>Location</label>\
                                            <input value="http://" name="location" type="text">\
                                        </fieldset>\
                                        <h2>New window</h2>\
                                        <fieldset>\
                                            <input name="blank" type="checkbox">\
                                            <label>Check this box to have the link open in a new browser window</label>\
                                        </fieldset>\
                                        <h2>Not sure what to put in the box above?</h2>\
                                        <ol>\
                                            <li>Find the page on the web you want to link to</li>\
                                            <li>Copy the web address from your browser\'s address bar and paste it into the box above</li>\
                                        </ol>',
                            class_name: 'ui-widget-editor-link-external',
                            show: function(panel, edit) {
                                if (edit) {
                                    var a = this._editor.selected_element;
                                    panel.find('input[name="location"]').val(a.attr('href'));
                                    if (a.attr('target') == '_blank') panel.find('input[name="target"]').prop('checked', true);
                                }
                            },
                            attributes: function(panel) {
                                var attributes = {
                                    href: panel.find('input[name="location"]').val(),
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
                                        <fieldset>\
                                            <label>Email</label>\
                                            <input name="email" type="text"/>\
                                        </fieldset>\
                                        <fieldset>\
                                            <label>Subject (optional)</label>\
                                            <input name="subject" type="text"/>\
                                        </fieldset>',
                            class_name: 'ui-widget-editor-link-email',
                            show: function(panel, edit) {
                                if (edit) {
                                    var a = this._editor.selected_element;
                                    panel.find('input[name="email"]').val(a.attr('href').replace(/(mailto:)|(\?Subject.*)/gi, ''));
                                    if (/\?Subject\=/i.test(a.attr('href'))) {
                                        panel.find('input[name="subject"]').val(decodeURIComponent(a.attr('href').replace(/(.*\?Subject=)/i, '')));
                                    }
                                }
                            },
                            attributes: function(panel) {
                                var attributes = {
                                    href: 'mailto:' + panel.find('input[name="email"]').val()
                                };
                                
                                var subject = panel.find('input[name="subject"]').val();

                                if (subject) attributes.href = attributes.href + '?Subject=' + encodeURIComponent(subject);
                                
                                return attributes;
                            }
                        }
                    ];
                
                    if (this.options.link_replace_types) {
                        link_types = this.options.link_custom_types;
                    } else {
                        $.merge(link_types, this.options.link_custom_types);
                    }
                    
                    $(link_types).each(function() {
                        var label = $('<label>\
                                        <input class="' + this.class_name + '" type="radio" value="' + this.type + '" name="link_type" autocomplete="off"/>\
                                        <span>' + this.title + '</span>\
                                    </label>').appendTo(link_types_fieldset);
                        label.find('input[type="radio"]').data(editor_instance._data.names.link_type, this);
                        link_types_classes[this.class_name] = this.class_name;
                    });
                    
                    link_types_fieldset.find('input[type="radio"]').unbind('change.editor').
                            bind('change.editor', function(){
                                editor_instance._actions.link.type_change.call(editor_instance, edit);
                            });
                    
                    var title = (edit ? 'Edit' : 'Insert') + ' Link';
                    
                    this._actions.link.dialog.dialog({
                        autoOpen: false,
                        modal: true,
                        resizable: true,
                        width: 750,
                        height: 450,
                        title: title,
                        dialogClass: 'ui-widget-editor-dialog ui-widget-editor-link',
                        show: this.options.dialog_animation,
                        hide: this.options.dialog_animation,
                        buttons: [
                            {
                                text: title,
                                'class': 'insert',
                                click: function() {
                                    
                                    rangy.restoreSelection(selection);
                                    
                                    var data = link_dialog.find('input[type="radio"]:checked').data(editor_instance._data.names.link_type);

                                    var attributes = data.attributes.call(editor_instance, link_dialog.find('.ui-widget-editor-link-content'), edit);
                                    
                                    if (!attributes) return;
                                    
                                    if (edit) {
                                        var a = editor_instance._editor.selected_element;
                                        $(link_types).each(function() {
                                            a.removeClass(this.class_name);
                                        });
                                        a.addClass(data.class_name);
                                        a.attr(attributes);
                                    } else {
                                    
                                        if (editor_instance._editor.selected_element.is('img')) {
                                            editor_instance._editor.selected_element.wrap($('a').attr(attributes).addClass('ui-widget-editor-link'));
                                        } else {
                                            rangy.createCssClassApplier('ui-widget-editor-link ' + data.class_name, {
                                                normalize: true,
                                                elementTagName: 'a',
                                                elementProperties: attributes
                                            }).applyToSelection();
                                        }
                                    }
                                    
                                    editor_instance._actions.state_change.call(editor_instance);
                                    $(this).dialog('close');
                                },
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
                            editor_instance._actions.link.dialog.find('.ui-widget-editor-link-content').hide();
                        },
                        open: function() {
                            editor_instance._dialog.apply_button_icon('insert', 'circle-check');
                            editor_instance._dialog.apply_button_icon('cancel', 'circle-close');
                            
                            if (!link_dialog.find('input[type="radio"]:checked').length) {
                                if (!edit) {
                                   link_dialog.find('input[type="radio"]:first').trigger('click');
                                } else {
                                    link_dialog.find('input[type="radio"]').each(function(){
                                        var radio = $(this);
                                        $(editor_instance._editor.selected_element.attr('class').split(' ')).each(function() {
                                            if (link_types_classes[this] && radio.hasClass(this)) {
                                                radio.prop('checked', true);
                                                editor_instance._actions.link.type_change.call(editor_instance, edit, true);
                                                return;
                                            }
                                        });
                                    });
                                }
                            }
                        },
                        close: function() {
                            editor_instance._actions.link.dialog.find('.ui-widget-editor-link-content').hide();
                            $(this).dialog('destroy');
                        }
                    }).dialog('open');
                },
                
                type_change: function(edit, initial) {
                    
                    var link_type_data = this._actions.link.dialog.find('input[type="radio"]:checked').data(this._data.names.link_type),
                        panel = this._actions.link.dialog.find('.ui-widget-editor-link-content'),
                        wrap = panel.closest('.ui-widget-editor-link-wrap'),
                        ajax = (typeof link_type_data.ajax != 'undefined'),
                        editor_instance = this,
                        initial = (typeof initial != 'undefined') ? initial : false;
                
                    if (ajax) wrap.addClass('ui-widget-editor-loading');
                    
                    if (initial) {
                        panel.html(link_type_data.content).show();
                        if ($.isFunction(link_type_data.show)) link_type_data.show.call(editor_instance, panel, edit);
                    } else {                  
                        panel.hide(this.options.link_panel_animation, function(){
                            if (!ajax) {
                                panel.html(link_type_data.content);
                                if ($.isFunction(link_type_data.show)) link_type_data.show.call(editor_instance, panel, edit);
                                panel.html(link_type_data.content).show(editor_instance.options.link_panel_animation);
                            } else {
                                $.ajax({
                                    url: link_type_data.ajax.uri,
                                    type: ((typeof link_type_data.ajax.type != 'undefined') ? 'get' : link_type_data.ajax.type),
                                    success: function(data) {
                                        panel.html(data);
                                        if ($.isFunction(link_type_data.show)) link_type_data.show.call(editor_instance, panel, edit);
                                        panel.show(editor_instance.options.link_panel_animation, function(){
                                            wrap.removeClass('ui-widget-editor-loading');
                                        });
                                    }   
                                });
                            }
                        });
                    }
                },
                
                remove: function() {
                    this._history.update.call(this);

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
                    
                    this._history.update.call(this);
                },

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
                                                editor_instance._selection.replace.call(editor_instance, pasted_content.get(0).childNodes);
                                                
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
                                    editor_instance._dialog.apply_button_icon('cancel', 'circle-close');
                                    editor_instance._dialog.apply_button_icon('ok', 'circle-check');
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

        },

        _history: {
            
            undo: {},
            redo: {},
            
            toggle_buttons: function() {
                var id = this._util.identify(this.element);
                this._editor.toolbar.find('button[name="undo"]').button('option', 'disabled', this._history.undo[id].length == 0);
                this._editor.toolbar.find('button[name="redo"]').button('option', 'disabled', this._history.redo[id].length == 0);
                this._content.toggle_unsaved_edit_warning.call(this);
            },
            
            clear: function(all) {
                var id = this._util.identify(this.element);

                if (typeof all != 'undefined' && all) {
                    this._history.undo = {};
                    this._history.redo = {};
                } else {
                    this._history.undo[id] = [];
                    this._history.redo[id] = [];
                }
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
                this._history.redo[id] = [];
                
                // Don't add identical content to stack
                if (this._history.undo[id].length
                        && this._history.undo[id][this._history.undo[id].length-1].content == current_content) {
                    return;
                }
                
                this._history.undo[id].push({
                    content: current_content
                });
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
                this._history.clear.call(this, true);
                this._content.toggle_unsaved_edit_warning.call(this);
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
                    if (this._content.dirty.call(this)) {
                        unsaved = true;
                        return;
                    }
                });
                return unsaved;
            },
            
            toggle_unsaved_edit_warning: function() {
                if (this.options.unsaved_edit_warning) {
                    if (this._data.exists(this.element, this._data.names.original_html) 
                        && this.element.data(this._data.names.original_html) != this.html.call(this)) {
                        
                        var warning = false;
                        if (!this._data.exists(this.element, this._data.names.unsaved_edits_warning)) {
                            var warning = $('<div class="ui-widget-editor-warning" style="display:none">\
                                                <span class="ui-icon ui-icon-alert"></span>\
                                                <ul class="ui-widget-messages-alert">\
                                                    <li>Unsaved edits exist</li>\
                                                </ul>\
                                            </div>').css({
                                position: 'absolute',
                                top: this.element.height(),
                                left: this.element.offset().left
                                }).appendTo('body');
                            this.element.data(this._data.names.unsaved_edits_warning, warning);
                        } else {
                            var warning = this.element.data(this._data.names.unsaved_edits_warning);
                        }
                        if (!warning.is(':visible')) warning.show(this.options.unsaved_edit_warning_animation);
                    } else {
                         if (this._data.exists(this.element, this._data.names.unsaved_edits_warning)) {
                            var warning = $(this.element.data(this._data.names.unsaved_edits_warning));
                            if (warning.is(':visible')) warning.hide(this.options.unsaved_edit_warning_animation);
                         }
                    }
                }
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
                            editor_instance._dialog.apply_button_icon('ok', 'circle-check');
                            editor_instance._dialog.apply_button_icon('cancel', 'circle-close');
                        },
                        close: function() {
                            $(this).dialog('destroy');
                        }
                    }).dialog('open');

                }
            },
            
            apply_button_icon: function(button_class, icon) {
                $('.ui-dialog-buttonpane').
                    find('.' + button_class).button({
                    icons: {
                        primary: 'ui-icon-' + icon
                    }
                });
            },
            
        },
        
        _message: {
            
            initialized: false,
            panel: false,
            hide_timeout: false,            
            
            types: {
                error: 'notice',
                confirm: 'check',                
                information: 'info',
                warning: 'alert',
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
    
        html: function(html) {
            if (typeof html == 'undefined') {
                return this._content.cleaned(this.element.html());
            }
            this._history.update.call(this);
            this.element.html(html);
            this._history.update.call(this);
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
            this._editor.toolbar.dialog('close');
            this._editor.editing = false;
            this.element.unbind('keyup.editor click.editor paste.editor');
            this.element.attr('contenteditable', 'false');
            this.element.removeClass(this._classes.editing);
            this._message.hide.call(this);
    
            $(this.instances).each(function() {
                this._content.reset.call(this);
            });

            // Trigger buttons' destroy handlers
            var editor_instance = this;
            editor_instance._editor.toolbar.find('button').each(function() {
                var data = $(this).data(editor_instance._data.names.button);
                if ($.isFunction(data.destroy)) {
                    data.destroy.call(editor_instance, this);
                }
            });
        }
    
    });
});
