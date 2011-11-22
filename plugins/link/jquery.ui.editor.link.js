(function($) {
    
    var defaultOptions = {
        panelAnimation: 'fade',
        replaceTypes: false,
        customTypes: [],
        typeDataName: 'uiWidgetEditorLinkType'
    };
    
    var link = { 
        init: function(editor, options) {
            console.info('FIXME: remove dialog on destroy');
            var dialog = false;
            var plugin = this;

            options = $.extend({}, defaultOptions, options);

            this.show = function() {
                if (!dialog) {
                    dialog = $(editor.getTemplate('link.dialog', options)).appendTo('body');
                }

                var selection = rangy.saveSelection(),
                    linkDialog = dialog,
                    label, linkTypesClasses = {};

                var selectedElement = editor.getSelectedElements().first();
                var edit = selectedElement.is('a');

                var linkTypesFieldset = linkDialog.find('.' + options.baseClass + '-menu fieldset');

                var linkTypes = [
                    // Page
                    {
                        type: 'external',
                        title: _('Page on this or another website'),
                        content: editor.getTemplate('link.external', options),
                        className: options.baseClass + '-external',
                        show: function(panel, edit) {
                            if (edit) {
                                panel.find('input[name="location"]').val(selectedElement.attr('href'));
                                if (selectedElement.attr('target') === '_blank') {
                                    panel.find('input[name="blank"]').prop('checked', true);
                                }
                            }
                        },
                        attributes: function(panel) {
                            var attributes = {
                                href: panel.find('input[name="location"]').val()
                            };

                            if (panel.find('input[name="blank"]').is(':checked')) attributes.target = '_blank';

                            if (!/^(http|https|ftp):\/\/[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/i.test(attributes.href)) {
                                editor.showWarning(_('The url for the link you inserted doesn\'t look well formed'));
                            }

                            return attributes;
                        }
                    },
                    // Email
                    {
                        type: 'email',
                        title: _('Email address'),
                        content: editor.getTemplate('link.email', options),
                        className: options.baseClass + '-email',
                        show: function(panel, edit) {
                            if (edit) {
                                panel.find('input[name="email"]').val(selectedElement.attr('href').replace(/(mailto:)|(\?Subject.*)/gi, ''));
                                if (/\?Subject\=/i.test(selectedElement.attr('href'))) {
                                    panel.find('input[name="subject"]').val(decodeURIComponent(selectedElement.attr('href').replace(/(.*\?Subject=)/i, '')));
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
                linkDialog.find('.' + options.baseClass + '-menu fieldset').html('');

                if (options.replaceTypes) {
                    linkTypes = options.customTypes;
                } else {
                    $.merge(linkTypes, options.customTypes);
                }

                $(linkTypes).each(function(i, linkType) {
                    label = $(editor.getTemplate('link.label', linkType)).appendTo(linkTypesFieldset);
                    label.find('input[type="radio"]').data(options.typeDataName, this);
                    linkTypesClasses[linkType.className] = linkType.className;
                });

                linkTypesFieldset.find('input[type="radio"]').unbind('change.editor').
                        bind('change.editor', function(){
                            plugin.typeChange(edit);
                        });

                var title = edit ? _('Edit Link') : _('Insert Link');

                dialog.dialog({
                    autoOpen: false,
                    modal: true,
                    resizable: true,
                    width: 750,
                    height: 450,
                    title: title,
                    dialogClass: options.baseClass + ' ' + options.dialogClass,
                    show: editor.options.dialogShowAnimation,
                    hide: editor.options.dialogHideAnimation,
                    buttons: [
                        {
                            text: title,
                            click: function() {
                                rangy.restoreSelection(selection);

                                var data = linkDialog.find('input[type="radio"]:checked').data(options.typeDataName),
                                    attributes = data.attributes(linkDialog.find('.' + options.baseClass + '-content'), edit);

                                if (!attributes) return;

                                if (edit) {
                                    $(linkTypes).each(function() {
                                        selectedElement.removeClass(this.className);
                                    });
                                    selectedElement.addClass(data.className);
                                    selectedElement.attr(attributes);
                                } else {

                                    if (selectedElement.is('img')) {
                                        selectedElement.wrap($('a').attr(attributes).addClass(options.baseClass));
                                    } else {
                                        rangy.createCssClassApplier(options.baseClass + ' ' + data.className, {
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
                            click: function() {
                                rangy.restoreSelection(selection);
                                $(this).dialog('close');
                            }
                        }
                    ],
                    beforeopen: function() {
                        plugin.dialog.find('.' + options.baseClass + '-content').hide();
                    },
                    open: function() {
                        // Apply custom icons to the dialog buttons
                        var buttons = dialog.parent().find('.ui-dialog-buttonpane');
                        buttons.find('button:eq(0)').button({ icons: { primary: 'ui-icon-circle-check' }});
                        buttons.find('button:eq(1)').button({ icons: { primary: 'ui-icon-circle-close' }});

                        if (!linkDialog.find('input[type="radio"]:checked').length) {
                            if (!edit) {
                                linkDialog.find('input[type="radio"]:first').prop('checked', true);
                                plugin.typeChange(edit, true);
                            } else {
                                linkDialog.find('input[type="radio"]').each(function(){
                                    var radio = $(this);
                                    $(selectedElement.attr('class').split(' ')).each(function() {
                                        if (linkTypesClasses[this] && radio.hasClass(this)) {
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
                        dialog.find('.' + options.baseClass + '-content').hide();
                        $(this).dialog('destroy');
                    }
                }).dialog('open');
            }

            this.typeChange = function(edit, initial) {
                var linkTypeData = dialog.find('input[type="radio"]:checked').data(options.typeDataName),
                    panel = dialog.find('.' + options.baseClass + '-content'),
                    wrap = panel.closest('.' + options.baseClass + '-wrap'),
                    ajax = (typeof linkTypeData.ajax != 'undefined');

                initial = initial || false;

                if (ajax) wrap.addClass(options.baseClass + '-loading');

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
                                        wrap.removeClass(options.baseClass + '-loading');
                                    });
                                }   
                            });
                        }
                    });
                }
            }

            this.remove = function() {
                if (rangy.getSelection().getAllRanges().length == 1) {

                    range = rangy.getSelection().getAllRanges()[0];

                    node = range.commonAncestorContainer;
                    node = node.nodeType == 3 ? $(node).parent().get(0) : $(node).get(0);

                    if (node.nodeName.toLowerCase() == 'a') {
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

                editor.trigger('change');
            }
        } 
    }
    
    $.ui.editor.registerPlugin('link', link);
    
    $.ui.editor.registerUi({
        'link': function(editor) {
            var ui = this.ui = editor.uiButton({
                title: _('Insert Link'),
                click: function() {
                    editor.getPlugin('link').show();
                }
            });
            editor.bind('change', function() {
                if (editor.getSelectedElements().length !== 1) ui.disable();
                else ui.enable();
            });
        },
    
        'unlink': function(editor) {
            var ui = this.ui = editor.uiButton({
                title: _('Remove Link'),
                click: function() {
                    editor.getPlugin('link').remove();
                }
            });
            editor.bind('change', function() {
                if (!editor.getSelectedElements().is('a')) ui.disable();
                else ui.enable();
            });
        }
    });
    
})(jQuery);
