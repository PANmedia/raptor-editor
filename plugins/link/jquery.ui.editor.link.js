(function($) {
    
    var defaultOptions = {
        panelAnimation: 'fade',
        replaceTypes: false,
        customTypes: [],
        typeDataName: 'uiWidgetEditorLinkType'
    };
    
    var link = function(editor, options) {
        var dialog = false;
        var plugin = this;
        
        options = $.extend({}, defaultOptions, options);
        
        this.show = function() {
            if (!dialog) {
                dialog = $('<div style="display:none" class="ui-widget-editor-link-panel">\
                                                    <div class="ui-widget-editor-link-menu">\
                                                        <p>' + _('Choose a link type:') + '</p>\
                                                        <fieldset></fieldset>\
                                                    </div>\
                                                    <div class="ui-widget-editor-link-wrap">\
                                                        <div class="ui-widget-editor-link-content"></div>\
                                                    </div>\
                                                </div>').appendTo('body');
            }
            
            editor._actions.beforeStateChange.call(this);
            
            var selection = rangy.saveSelection(),
                linkDialog = dialog,
                edit = editor._editor.selectedElement.is('a'),
                label, link_types_classes = {};
            
            var link_types_fieldset = linkDialog.find('.ui-widget-editor-link-menu fieldset');
            
            var link_types = [
                // Page
                {
                    type: 'external',
                    title: _('Page on this or another website'),
                    content: '<h2>' + _('Link to a page on this or another website') + '</h2>\
                                <fieldset>\
                                    <label for="ui-widget-editor-link-external-href">Location</label>\
                                    <input id="ui-widget-editor-link-external-href" value="http://" name="location" class="ui-widget-editor-external-href" type="text" placeholder="' + _('Enter your URL') + '>\
                                </fieldset>\
                                <h2>New window</h2>\
                                <fieldset>\
                                    <label for="ui-widget-editor-link-external-target">\
                                        <input id="ui-widget-editor-link-external-target" name="blank" type="checkbox">\
                                        ' + _('Check this box to have the link open in a new browser window') + '</label>\
                                </fieldset>\
                                <h2>' + _('Not sure what to put in the box above?') + '</h2>\
                                <ol>\
                                    <li>' + _('Find the page on the web you want to link to') + '</li>\
                                    <li>' + _('Copy the web address from your browser\'s address bar and paste it into the box above') + '</li>\
                                </ol>',
                    class_name: 'ui-widget-editor-link-external',
                    show: function(panel, edit) {
                        if (edit) {
                            var a = editor._editor.selectedElement;
                            panel.find('input[name="location"]').val(a.attr('href'));
                            if (a.attr('target') == '_blank') panel.find('input[name="blank"]').prop('checked', true);
                        }
                    },
                    attributes: function(panel) {
                        var attributes = {
                            href: panel.find('input[name="location"]').val()
                        };
                        
                        if (panel.find('input[name="blank"]').is(':checked')) attributes.target = '_blank';
                        
                        if (!editor._util.valid_url(attributes.href)) {
                            editor.showWarning(_('The url for the link you inserted doesn\'t look well formed'));
                        }
                        
                        return attributes;
                    }
                },
                // Email
                {
                    type: 'email',
                    title: _('Email address'),
                    content: '<h2>' + _('Link to an email address') +'</h2>\
                                <fieldset class="ui-widget-editor-link-email">\
                                    <label for="ui-widget-editor-link-email">Email</label>\
                                    <input id=ui-widget-editor-link-email" name="email" type="text" placeholder="' + _('Enter email address') + '"/>\
                                </fieldset>\
                                <fieldset class="ui-widget-editor-link-email">\
                                    <label for="ui-widget-editor-link-email-subject">' + _('Subject (optional)') + '</label>\
                                    <input id="ui-widget-editor-link-email-subject" name="subject" type="text" placeholder="' + _('Enter subject') + '"/>\
                                </fieldset>',
                    class_name: 'ui-widget-editor-link-email',
                    show: function(panel, edit) {
                        if (edit) {
                            var a = editor._editor.selectedElement;
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
            
            if (options.replaceTypes) {
                link_types = options.customTypes;
            } else {
                $.merge(link_types, options.customTypes);
            }
            
            $(link_types).each(function() {
                label = $('<label>\
                                <input class="' + this.class_name + '" type="radio" value="' + this.type + '" name="link_type" autocomplete="off"/>\
                                <span>' + this.title + '</span>\
                            </label>').appendTo(link_types_fieldset);
                label.find('input[type="radio"]').data(options.typeDataName, this);
                link_types_classes[this.class_name] = this.class_name;
            });
            
            link_types_fieldset.find('input[type="radio"]').unbind('change.editor').
                    bind('change.editor', function(){
                        plugin.typeChange(edit);
                    });
            
            var title = (edit ? 'Edit' : 'Insert') + ' Link';
            
            dialog.dialog({
                autoOpen: false,
                modal: true,
                resizable: true,
                width: 750,
                height: 450,
                title: title,
                dialogClass: editor.options.dialogClass + ' ui-widget-editor-link',
                show: editor.options.dialogShowAnimation,
                hide: editor.options.dialogHideAnimation,
                buttons: [
                    {
                        text: title,
                        'class': 'insert',
                        click: function() {
                            rangy.restoreSelection(selection);
                            
                            var data = linkDialog.find('input[type="radio"]:checked').data(options.typeDataName),
                                attributes = data.attributes(linkDialog.find('.ui-widget-editor-link-content'), edit),
                                a = null;
                                
                            if (!attributes) return;
                            
                            if (edit) {
                                a = editor._editor.selectedElement;
                                $(link_types).each(function() {
                                    a.removeClass(this.class_name);
                                });
                                a.addClass(data.class_name);
                                a.attr(attributes);
                            } else {
                            
                                if (editor._editor.selectedElement.is('img')) {
                                    editor._editor.selectedElement.wrap($('a').attr(attributes).addClass('ui-widget-editor-link'));
                                } else {
                                    rangy.createCssClassApplier('ui-widget-editor-link ' + data.class_name, {
                                        normalize: true,
                                        elementTagName: 'a',
                                        elementProperties: attributes
                                    }).applyToSelection();
                                }
                            }
                            
                            editor.trigger('stateChange');
                            $(this).dialog('close');
                        }
                    },
                    {
                        text: _('Cancel'),
                        'class': 'cancel',
                        click: function() {
                            rangy.restoreSelection(selection);
                            $(this).dialog('close');
                        }
                    }
                ],
                beforeopen: function() {
                    plugin.dialog.find('.ui-widget-editor-link-content').hide();
                },
                open: function() {
                    editor._dialog.applyButtonIcon('insert', 'circle-check');
                    editor._dialog.applyButtonIcon('cancel', 'circle-close');
                    
                    if (!linkDialog.find('input[type="radio"]:checked').length) {
                        if (!edit) {
                            linkDialog.find('input[type="radio"]:first').prop('checked', true);
                            plugin.typeChange(edit, true);
                        } else {
                            linkDialog.find('input[type="radio"]').each(function(){
                                var radio = $(this);
                                $(editor._editor.selectedElement.attr('class').split(' ')).each(function() {
                                    if (link_types_classes[this] && radio.hasClass(this)) {
                                        radio.prop('checked', true);
                                        plugin.typeChange(edit, true);
                                        return;
                                    }
                                });
                            });
                        }
                    }
                },
                close: function() {
                    dialog.find('.ui-widget-editor-link-content').hide();
                    $(this).dialog('destroy');
                }
            }).dialog('open');
        }
        
        this.typeChange = function(edit, initial) {
            var linkTypeData = dialog.find('input[type="radio"]:checked').data(options.typeDataName),
                panel = dialog.find('.ui-widget-editor-link-content'),
                wrap = panel.closest('.ui-widget-editor-link-wrap'),
                ajax = (typeof linkTypeData.ajax != 'undefined'),
                initial = (typeof initial == 'undefined') ? false : initial;
        
            if (ajax) wrap.addClass('ui-widget-editor-loading');
            
            if (initial) {
                panel.html(linkTypeData.content);
                panel.show();
                if ($.isFunction(linkTypeData.show)) linkTypeData.show(panel, edit);
            } else {                  
                panel.hide(options.panelAnimation, function(){
                    if (!ajax) {
                        panel.html(linkTypeData.content);
                        if ($.isFunction(linkTypeData.show)) linkTypeData.show(panel, edit);
                        panel.html(linkTypeData.content).show(options.panelAnimation);
                    } else {
                        $.ajax({
                            url: linkTypeData.ajax.uri,
                            type: ((typeof linkTypeData.ajax.type != 'undefined') ? 'get' : linkTypeData.ajax.type),
                            success: function(data) {
                                panel.html(data);
                                if ($.isFunction(linkTypeData.show)) linkTypeData.show(panel, edit);
                                panel.show(options.panelAnimation, function(){
                                    wrap.removeClass('ui-widget-editor-loading');
                                });
                            }   
                        });
                    }
                });
            }
        }
        
        this.remove = function() {
            editor._actions.beforeStateChange.call(this);

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
            
            editor._actions.stateChange.call(this);
        }
    }
    
    $.ui.editor.addPlugin('link', link);
    
    $.ui.editor.addButton('addEditLink', function(editor) {
        this.title = _('Insert Link');
        this.icons = {
            primary: 'ui-icon-insert-link'
        };
        this.classes = 'ui-editor-icon';
        this.click = function() {
            editor.getPlugin('link').show();
        }
        this.stateChange = function(button) {
            $(button).button('option', 'disabled', !(this._selection.exists.call(this) || this._editor.selectedElement.is('a')));
        }
    });
    
    $.ui.editor.addButton('removeLink', function(editor) {
        this.title = _('Remove Link');
        this.icons = {
            primary: 'ui-icon-remove-link'
        };
        this.classes = 'ui-editor-icon';
        this.click = function() {
            editor.getPlugin('link').remove();
        }
        this.stateChange = function(button) {
            $(button).button('option', 'disabled', !this._editor.selectedElement.is('a'));
        }
    });
    
})(jQuery);
