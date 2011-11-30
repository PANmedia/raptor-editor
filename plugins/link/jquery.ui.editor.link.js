// <debug>
console.info('FIXME: remove link dialog on destroy');
// </debug>
(function($) {
    
    var defaultOptions = {
        panelAnimation: 'fade',
        replaceTypes: false,
        customTypes: [],
        typeDataName: 'uiWidgetEditorLinkType'
    };
    
    var link = { 
        visible: null,
        types: {},

        prepareLinkTypes: function(options, dialog, edit) {
            var linkTypes = [
                // Page
                {
                    type: 'external',
                    title: _('Page on this or another website'),
                    init: function() {
                        this.content = this.plugin.editor.getTemplate('link.external', this.options);
                    },
                    show: function(panel, edit, selectedElement) {
                        if (edit) {
                            panel.find('input[name="location"]').val(this.plugin.selectedElement.attr('href'));
                            if (this.plugin.selectedElement.attr('target') === '_blank') {
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
                            this.plugin.editor.showWarning(_('The url for the link you inserted doesn\'t look well formed'));
                        }

                        return attributes;
                    }
                },
                // Email
                {
                    type: 'email',
                    title: _('Email address'),
                    init: function() {
                        this.content = this.plugin.editor.getTemplate('link.email', this.options);
                    },
                    show: function(panel, edit) {
                        if (edit) {
                            panel.find('input[name="email"]').val(this.plugin.selectedElement.attr('href').replace(/(mailto:)|(\?Subject.*)/gi, ''));
                            if (/\?Subject\=/i.test(this.plugin.selectedElement.attr('href'))) {
                                panel.find('input[name="subject"]').val(decodeURIComponent(this.plugin.selectedElement.attr('href').replace(/(.*\?Subject=)/i, '')));
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
            
            defaultLinkType = {
                type: null,
                title: null,
                content: null,
                init: null,
                show: null,
                attributes: null,
                plugin: this,
                options: options
            };

            if (options.replaceTypes) linkTypes = options.customTypes;
            else $.merge(linkTypes, options.customTypes);

            var linkType;
            var linkTypesFieldset = dialog.find('fieldset').html('');                    

            for (var i = 0; i < linkTypes.length; i++) {
                linkType = $.extend({}, defaultLinkType, linkTypes[i], { className: options.baseClass + '-' + linkTypes[i].type });                
                if ($.isFunction(linkType.init)) linkType.init();
                this.types[linkType.type] = linkType;
                $(this.editor.getTemplate('link.label', linkType)).appendTo(linkTypesFieldset);
            }
            
            var plugin = this;
            linkTypesFieldset.find('input[type="radio"]').unbind('change.' + this.editor.widgetName).
                bind('change.' + this.editor.widgetName, function(){
                    plugin.typeChange(edit);
                });
        },

        init: function(editor, options) {
            var dialog = false;
            var plugin = this;

            options = $.extend({}, defaultOptions, options);

            this.show = function() {
                if (!this.visible) {
                    var selection = rangy.saveSelection();
                    this.selectedElement = editor.getSelectedElements().first();
                    var edit = this.selectedElement.is('a');

                    if (!dialog) dialog = $(editor.getTemplate('link.dialog', options)).appendTo('body');
                    
                    this.prepareLinkTypes(options, dialog, edit);
                    
                    dialog.dialog({
                        autoOpen: false,
                        modal: true,
                        resizable: true,
                        width: 750,
                        height: 450,
                        title: edit ? _('Edit Link') : _('Insert Link'),
                        dialogClass: options.baseClass + ' ' + options.dialogClass,
                        buttons: [
                            {
                                text: edit ? _('Update Link') : _('Insert Link'),
                                click: function() {
                                    rangy.restoreSelection(selection);

                                    var linkType = plugin.types[dialog.find('input[type="radio"]:checked').val()];
                                    var attributes = linkType.attributes(dialog.find('.' + options.baseClass + '-content'), edit);

                                    if (!attributes) return;

                                    var link = plugin.editor.outerHtml($('<a>' + (attributes.title ? attributes.title : attributes.href) + '</a>').attr($.extend({}, attributes, { target: '_blank' })));
                                    if (!edit) {
                                        attributes['className'] = linkType.className;
                                        editor.wrapTagWithAttribute('a', $.extend(attributes, { className: linkType.className}));
                                        editor.showConfirm(_('Added link: {{link}}', { link: link }));
                                    } else {
                                        // Remove all link type classes
                                        plugin.selectedElement[0].className = plugin.selectedElement[0].className.replace(new RegExp(options.baseClass + '-[a-zA-Z]+','g'), '');
                                        plugin.selectedElement.addClass(linkType.className)
                                            .attr(attributes);
                                        editor.showConfirm(_('Updated link: {{link}}', { link: link }));                                        
                                    }

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
                            plugin.visible = true;

                            // Apply custom icons to the dialog buttons
                            var buttons = dialog.parent().find('.ui-dialog-buttonpane');
                            buttons.find('button:eq(0)').button({ icons: { primary: 'ui-icon-circle-check' }});
                            buttons.find('button:eq(1)').button({ icons: { primary: 'ui-icon-circle-close' }});

                            if (!edit) {
                                dialog.find('input[type="radio"]:first').prop('checked', true);
                                plugin.typeChange(edit, true);
                            } else {
                                dialog.find('input[type="radio"]').each(function(){
                                    var radio = $(this);
                                    $(plugin.selectedElement.attr('class').split(' ')).each(function() {
                                        if (radio.hasClass(this)) {
                                            radio.prop('checked', true);
                                            plugin.typeChange(edit, true);
                                            return;
                                        }
                                    });
                                });
                            }
                        },
                        close: function() {
                            plugin.visible = false;
                            dialog.find('.' + options.baseClass + '-content').hide();
                            $(this).dialog('destroy');
                        }
                    }).dialog('open');
                }
            }

            this.typeChange = function(edit, initial) {
                var linkType = plugin.types[dialog.find('input[type="radio"]:checked').val()];
                var panel = dialog.find('.' + options.baseClass + '-content');
                var wrap = panel.closest('.' + options.baseClass + '-wrap');

                initial = initial || false;
                
                if (linkType.ajax) wrap.addClass(options.baseClass + '-loading');

                // This is the first showing of the panel, don't animate
                // if (initial) {
                //     panel.html(linkType.content);
                //     panel.show();
                //     if ($.isFunction(linkType.show)) linkType.show(panel, edit);
                // } else {            
                    panel.hide(options.panelAnimation, function(){
                        if (!linkType.ajax) {
                            panel.html(linkType.content);
                            if ($.isFunction(linkType.show)) linkType.show(panel, edit);
                            panel.html(linkType.content).show(options.panelAnimation);
                        } else {
                            $.ajax({
                                url: linkType.ajax.uri,
                                type: ((typeof linkType.ajax.type != 'undefined') ? 'get' : linkType.ajax.type),
                                success: function(data) {
                                    panel.html(data);
                                    if ($.isFunction(linkType.show)) linkType.show(panel, edit);
                                    panel.show(options.panelAnimation, function(){
                                        wrap.removeClass(options.baseClass + '-loading');
                                    });
                                }   
                            });
                        }
                    });
                // }
            }

            this.remove = function() {
                this.editor.unwrapParentTag('a');
            }
        } 
    }
    
    $.ui.editor.registerPlugin('link', link);
    
    $.ui.editor.registerUi({
        link: {
            init: function(editor) {
                editor.bind('change', this.change, this);
                
                return editor.uiButton({
                    title: _('Insert Link'),
                    click: function() {
                        editor.getPlugin('link').show();
                    }
                });
            },
            change: function() {
                if (this.editor.getSelectedElements().length !== 1) this.ui.disable();
                else this.ui.enable();
            }
        },
    
        unlink: {
            init: function(editor) {
                editor.bind('change', this.change, this);
                
                return editor.uiButton({
                    title: _('Remove Link'),
                    click: function() {
                        editor.getPlugin('link').remove();
                    }
                });
            },
            change: function() {
                if (!this.editor.getSelectedElements().is('a')) this.ui.disable();
                else this.ui.enable();
            }
        }
    });
    
})(jQuery);
