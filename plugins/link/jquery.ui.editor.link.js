// <debug>
if (debugLevel >= MAX) {
    info('FIXME: remove link dialog on destroy');
}
// </debug>
(function($) {

    var defaultOptions = {
        panelAnimation: 'fade',
        replaceTypes: false,
        customTypes: [],
        typeDataName: 'uiWidgetEditorLinkType',
        dialogWidth: 750,
        dialogHeight: 'auto',
        dialogMinWidth: 670
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
                    focusSelector: 'input[name="location"]',
                    init: function() {
                        this.content = this.plugin.editor.getTemplate('link.external', this.options);
                    },
                    show: function(panel, edit) {
                        if (edit) {
                            panel.find('input[name="location"]').val(this.plugin.selectedElement.attr('href'));
                            if (this.plugin.selectedElement.attr('target') === '_blank') {
                                panel.find('input[name="blank"]').attr('checked', 'checked');
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
                    focusSelector: 'input[name="email"]',
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

            var defaultLinkType = {
                type: null,
                title: null,
                content: null,
                plugin: this,
                options: options,
                attributes: null,
                init: function() {},
                show: function() {},
                focus: function() {
                    if (this.focusSelector) {
                        var input = $(this.focusSelector);
                        var value = input.val();
                        input.val('');
                        input.focus().val(value);
                    }
                }
            };

            if (options.replaceTypes) linkTypes = options.customTypes;
            else $.merge(linkTypes, options.customTypes);

            var linkType;
            var linkTypesFieldset = dialog.find('fieldset').html('');

            for (var i = 0; i < linkTypes.length; i++) {
                linkType = $.extend({}, defaultLinkType, linkTypes[i], { classes: options.baseClass + '-' + linkTypes[i].type });
                linkType.init();
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
                        width: options.dialogWidth,
                        minWidth: options.dialogMinWidth,
                        height: options.dialogHeight,
                        title: edit ? _('Edit Link') : _('Insert Link'),
                        dialogClass: options.baseClass + ' ' + options.dialogClass,
                        buttons: [
                            {
                                text: edit ? _('Update Link') : _('Insert Link'),
                                click: function() {
                                    rangy.restoreSelection(selection);

                                    var linkType = plugin.types[dialog.find('input[type="radio"]:checked').val()];
                                    var attributes = linkType.attributes(dialog.find('.' + options.baseClass + '-content'), edit);

                                    // No attributes to apply
                                    if (!attributes) return;

                                    // Prepare link to be shown in any confirm message
                                    var link = plugin.editor.outerHtml($('<a>' + (attributes.title ? attributes.title : attributes.href) + '</a>').
                                            attr($.extend({}, attributes, { target: '_blank' })));

                                    if (!edit) {
                                        editor.wrapTagWithAttribute('a', attributes, linkType.classes);
                                        editor.showConfirm(_('Added link: {{link}}', { link: link }));
                                    } else {
                                        // Remove all link type classes
                                        plugin.selectedElement[0].className = plugin.selectedElement[0].className.replace(new RegExp(options.baseClass + '-[a-zA-Z]+','g'), '');
                                        plugin.selectedElement.addClass(linkType.classes)
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

                            // Bind keyup to dialog so we can detect when user presses enter
                            $(this).unbind('keyup.' + editor.widgetName).bind('keyup.' + editor.widgetName, function(event) {
                                if (event.keyCode == 13) buttons.find('button:eq(0)').trigger('click');
                            });

                            var radios = dialog.find('.ui-editor-link-menu input[type="radio"]');
                            if (!edit) {
                                radios.first().attr('checked', 'checked');
                            } else {
                                var classes = plugin.selectedElement.attr('class').split(/\s/gi);
                                radios.each(function(){
                                    for (var i = 0; i < classes.length; i++) {
                                        if (classes[i].trim() && $(this).hasClass(classes[i])) {
                                            $(this).attr('checked', 'checked');
                                            break;
                                        }
                                    }
                                });
                            }
                            plugin.typeChange(edit, true);
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
                var linkType = this.types[dialog.find('.ui-editor-link-menu input[type="radio"]:checked').val()];
                var panel = dialog.find('.' + options.baseClass + '-content');
                var plugin = this;
                var wrap = panel.closest('.' + options.baseClass + '-wrap');
                var ajax = linkType.ajaxUri && !plugin.types[linkType.type].content;
                initial = initial || false;

                if (ajax) wrap.addClass(options.baseClass + '-loading');

                panel.hide(options.panelAnimation, function(){
                    if (!ajax) {
                        panel.html(linkType.content);
                        linkType.show(panel, edit);
                        panel.show(options.panelAnimation, $.proxy(linkType.focus, linkType));
                    } else {
                        $.ajax({
                            url: linkType.ajaxUri,
                            type: 'get',
                            success: function(data) {
                                panel.html(data);
                                plugin.types[linkType.type].content = data;
                                wrap.removeClass(options.baseClass + '-loading');
                                linkType.show(panel, edit);
                                panel.show(options.panelAnimation, $.proxy(linkType.focus, linkType));
                            }
                        });
                    }
                });
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
                if (!this.editor.getSelectedElements().length) this.ui.disable();
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
