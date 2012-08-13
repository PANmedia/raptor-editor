/**
 * @fileOverview Link insertion plugin & ui component
 * @author David Neilsen david@panmedia.co.nz
 * @author Michael Robinson michael@panmedia.co.nz
 */

/**
 * @name $.editor.plugin.link
 * @augments $.ui.editor.defaultPlugin
 * @see  $.editor.ui.link
 * @see  $.editor.ui.unlink
 * @class Allow the user to wrap the selection with a link or insert a new link
 */
 $.ui.editor.registerPlugin('link', /** @lends $.editor.plugin.link.prototype */ {
    visible: null,
    dialog: null,
    types: {},

    /**
     * Array of default link types
     * @type {Array}
     */
    defaultLinkTypes: [

        /**
         * @name $.editor.plugin.link.defaultLinkTypes.page
         * @class
         * @extends $.editor.plugin.link.baseLinkType
         */
        /** @lends $.editor.plugin.link.defaultLinkTypes.page.prototype */ {

            /**
             * @see $.editor.plugin.link.baseLinkType#type
             */
            type: 'external',

            /**
             * @see $.editor.plugin.link.baseLinkType#title
             */
            title: _('Page on this or another website'),

            /**
             * @see $.editor.plugin.link.baseLinkType#focusSelector
             */
            focusSelector: 'input[name="location"]',

            /**
             * @see $.editor.plugin.link.baseLinkType#init
             */
            init: function() {
                this.content = this.plugin.editor.getTemplate('link.external', this.options);
                return this;
            },

            /**
             * @see $.editor.plugin.link.baseLinkType#show
             */
            show: function(panel, edit) {

                var link = this;
                panel.find('input[name="location"]').bind('keyup', function(){
                    link.validate(panel);
                });

                if (edit) {
                    panel.find('input[name="location"]').val(this.plugin.selectedElement.attr('href')).
                        trigger('keyup');

                    if (this.plugin.selectedElement.attr('target') === '_blank') {
                        panel.find('input[name="blank"]').attr('checked', 'checked');
                    }

                }

                return this;
            },

            /**
             * @see $.editor.plugin.link.baseLinkType#attributes
             */
            attributes: function(panel) {
                var attributes = {
                    href: panel.find('input[name="location"]').val()
                };

                if (panel.find('input[name="blank"]').is(':checked')) attributes.target = '_blank';

                if (!this.options.regexLink.test(attributes.href)) {
                    this.plugin.editor.showWarning(_('The url for the link you inserted doesn\'t look well formed'));
                }

                return attributes;
            },

            /**
             * @return {Boolean} True if the link is valid
             */
            validate: function(panel) {

                var href = panel.find('input[name="location"]').val();
                var errorMessageSelector = '.' + this.options.baseClass + '-error-message-url';
                var isValid = true;

                if (!this.options.regexLink.test(href)) {
                    if (!panel.find(errorMessageSelector).size()) {
                        panel.find('input[name="location"]').after(this.plugin.editor.getTemplate('link.error', $.extend({}, this.options, {
                            messageClass: this.options.baseClass + '-error-message-url',
                            message: _('The URL does not look well formed')
                        })));
                    }
                    panel.find(errorMessageSelector).not(':visible').show();
                    isValid = false;
                } else {
                    panel.find(errorMessageSelector).has(':visible').hide();
                }

                return isValid;
            }
        },

        /**
         * @name $.editor.plugin.link.defaultLinkTypes.email
         * @class
         * @extends $.editor.plugin.link.baseLinkType
         */
        /** @lends $.editor.plugin.link.defaultLinkTypes.email.prototype */  {

            /**
             * @see $.editor.plugin.link.baseLinkType#type
             */
            type: 'email',

            /**
             * @see $.editor.plugin.link.baseLinkType#title
             */
            title: _('Email address'),

            /**
             * @see $.editor.plugin.link.baseLinkType#focusSelector
             */
            focusSelector: 'input[name="email"]',

            /**
             * @see $.editor.plugin.link.baseLinkType#init
             */
            init: function() {
                this.content = this.plugin.editor.getTemplate('link.email', this.options);
                return this;
            },

            /**
             * @see $.editor.plugin.link.baseLinkType#show
             */
            show: function(panel, edit) {

                var email = this;
                panel.find('input[name="email"]').bind('keyup', function(){
                    email.validate(panel);
                });

                if (edit) {
                    panel.find('input[name="email"]').val(this.plugin.selectedElement.attr('href').replace(/(mailto:)|(\?Subject.*)/gi, '')).
                        trigger('keyup');
                    if (/\?Subject\=/i.test(this.plugin.selectedElement.attr('href'))) {
                        panel.find('input[name="subject"]').val(decodeURIComponent(this.plugin.selectedElement.attr('href').replace(/(.*\?Subject=)/i, '')));
                    }
                }

                return this;
            },

            /**
             * @see $.editor.plugin.link.baseLinkType#attributes
             */
            attributes: function(panel) {
                var attributes = {
                    href: 'mailto:' + panel.find('input[name="email"]').val()
                }, subject = panel.find('input[name="subject"]').val();

                if (subject) attributes.href = attributes.href + '?Subject=' + encodeURIComponent(subject);

                return attributes;
            },

            /**
             * @return {Boolean} True if the link is valid
             */
            validate: function(panel) {

                var email = panel.find('input[name="email"]').val();
                var errorMessageSelector = '.' + this.options.baseClass + '-error-message-email';
                var isValid = true;
                if (!this.options.regexEmail.test(email)) {
                    if (!panel.find(errorMessageSelector).size()) {
                        panel.find('input[name="email"]').after(this.plugin.editor.getTemplate('link.error', $.extend({}, this.options, {
                            messageClass: this.options.baseClass + '-error-message-email',
                            message: _('The email address does not look well formed')
                        })));
                    }
                    panel.find(errorMessageSelector).not(':visible').show();
                    isValid = false;
                } else {
                    panel.find(errorMessageSelector).has(':visible').hide();
                }

                return isValid;
            }
        },

        /**
         * @name $.editor.plugin.link.defaultLinkTypes.fileUrl
         * @class
         * @extends $.editor.plugin.link.baseLinkType
         */
        /** @lends $.editor.plugin.link.defaultLinkTypes.fileUrl.prototype */ {

            /**
             * @see $.editor.plugin.link.baseLinkType#type
             */
            type: 'fileUrl',

            /**
             * @see $.editor.plugin.link.baseLinkType#title
             */
            title: _('Document or other file'),

            /**
             * @see $.editor.plugin.link.baseLinkType#focusSelector
             */
            focusSelector: 'input[name="location"]',

            /**
             * @see $.editor.plugin.link.baseLinkType#init
             */
            init: function() {
                this.content = this.plugin.editor.getTemplate('link.file-url', this.options);
                return this;
            },

            /**
             * @see $.editor.plugin.link.baseLinkType#show
             */
            show: function(panel, edit) {

                var link = this;
                panel.find('input[name="location"]').bind('keyup', function(){
                    link.validate(panel);
                });

                if (edit) {
                    panel.find('input[name="location"]').val(this.plugin.selectedElement.attr('href')).
                        trigger('click');
                    if (this.plugin.selectedElement.attr('target') === '_blank') {
                        panel.find('input[name="blank"]').attr('checked', 'checked');
                    }
                }

                return this;
            },

            /**
             * @see $.editor.plugin.link.baseLinkType#attributes
             */
            attributes: function(panel) {
                var attributes = {
                    href: panel.find('input[name="location"]').val()
                };

                if (panel.find('input[name="blank"]').is(':checked')) attributes.target = '_blank';

                if (!this.options.regexLink.test(attributes.href)) {
                    this.plugin.editor.showWarning(_('The url for the file you inserted doesn\'t look well formed'));
                }

                return attributes;
            },

            /**
             * @return {Boolean} True if the link is valid
             */
            validate: function(panel) {

                var href = panel.find('input[name="location"]').val();
                var errorMessageSelector = '.' + this.options.baseClass + '-error-message-file-url';
                var isValid = true;

                if (!this.options.regexLink.test(href)) {
                    if (!panel.find(errorMessageSelector).size()) {
                        panel.find('input[name="location"]').after(this.plugin.editor.getTemplate('link.error', $.extend({}, this.options, {
                            messageClass: this.options.baseClass + '-error-message-file-url',
                            message: _('The URL does not look well formed')
                        })));
                    }
                    panel.find(errorMessageSelector).not(':visible').show();
                    isValid = false;
                } else {
                    panel.find(errorMessageSelector).has(':visible').hide();
                }

                return isValid;
            }
        }

    ],

    /**
     * @see $.ui.editor.defaultPlugin#init
     */
    init: function(editor, options) {

        this.options = $.extend({}, {
            panelAnimation: 'fade',
            replaceTypes: false,
            customTypes: [],
            typeDataName: 'uiWidgetEditorLinkType',
            dialogWidth: 750,
            dialogHeight: 'auto',
            dialogMinWidth: 670,
            regexLink: /^(http|https|ftp):\/\/[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/i,
            regexEmail: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
        }, options);

        editor.bind('save', this.repairLinks, this);
        editor.bind('cancel', this.cancel, this);
    },

    /**
     * Initialise the link types
     * @param  {Boolean} edit True if the user is editing an existing anchor
     */
    initTypes: function(edit) {

        this.types = {};

        /**
         * @name $.editor.plugin.link.baseLinkType
         * @class Default {@link $.editor.plugin.link} type
         * @see $.editor.plugin.link
         */
        var baseLinkType = /** @lends $.editor.plugin.link.baseLinkType.prototype */ {

            /**
             * Name of the link type
             * @type {String}
             */
            type: null,

            /**
             * Title of the link type.
             * Used in the link panel's radio button
             */
            title: null,

            /**
             * Content intended for use in the {@link $.editor.plugin.link} dialog's panel
             */
            content: null,

            /**
             * Reference to the instance of {@link $.editor.plugin.link}
             */
            plugin: this,

            /**
             * Reference to {@link $.editor.plugin.link#options}
             */
            options: this.options,

            /**
             * Function returning the attributes to be applied to the selection
             */
            attributes: function() {},

            /**
             * Initialise the link type
             */
            init: function() {
                return this;
            },

            /**
             * Any actions (binding, population of inputs) required before the {@link $.editor.plugin.link} dialog's panel for this link type is made visible
             */
            show: function() {},

            /**
             * Function determining whether this link type's radio button should be selected
             * @param  {Object} link The selected element
             * @return {Boolean} True if the selection represents a link of this type
             */
            editing: function(link) {
                if (link.attr('class')) {
                    var classes = this.classes.split(/\s/gi);
                    for (var i = 0; i < classes.length; i++) {
                        if (classes[i].trim() && $(link).hasClass(classes[i])) {
                            return true;
                        }
                    }
                }
                return false;
            },

            /**
             * CSS selector for the input that the {@link $.editor.plugin.link.baseLinkType.focus} function should use
             * @type {String}
             */
            focusSelector: null,

            /**
             * Any actions required after this link type's content is made visible
             * @private
             */
            focus: function() {
                if (this.focusSelector) {
                    var input = $(this.focusSelector);
                    var value = input.val();
                    input.val('');
                    input.focus().val(value);
                }
            }
        };

        var linkTypes = null;

        if (this.options.replaceTypes) linkTypes = this.options.customTypes;
        else linkTypes = $.merge(this.defaultLinkTypes, this.options.customTypes);

        var link;
        for (var i = 0; i < linkTypes.length; i++) {
            link = $.extend({}, baseLinkType, linkTypes[i], { classes: this.options.baseClass + '-' + linkTypes[i].type }).init();
            this.types[link.type] = link;
        }
    },

    /**
     * Show the link control dialog
     */
    show: function() {
        if (!this.visible) {

            selectionSave();

            this.selectedElement = selectionGetElements().first();
            var edit = this.selectedElement.is('a');
            var options = this.options;
            var plugin = this;

            this.dialog = $(this.editor.getTemplate('link.dialog', options)).appendTo('body');

            var dialog = this.dialog;

            this.initTypes();

            // Add link type radio buttons
            var linkTypesFieldset = this.dialog.find('fieldset');
            for (var type in this.types) {
                $(this.editor.getTemplate('link.label', this.types[type])).appendTo(linkTypesFieldset);
            }

            linkTypesFieldset.find('input[type="radio"]').bind('change.' + this.editor.widgetName, function(){
                plugin.typeChange(plugin.types[$(this).val()], edit);
            });

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
                            selectionRestore();
                            if (plugin.apply(edit)) {
                                $(this).dialog('close');
                            }
                        }
                    },
                    {
                        text: _('Cancel'),
                        click: function() {
                            $(this).dialog('close');
                        }
                    }
                ],
                beforeopen: function() {
                    plugin.dialog.find('.' + plugin.options.baseClass + '-content').hide();
                },
                open: function() {
                    plugin.visible = true;

                    // Apply custom icons to the dialog buttons
                    var buttons = dialog.parent().find('.ui-dialog-buttonpane');
                    buttons.find('button:eq(0)').button({ icons: { primary: 'ui-icon-circle-check' }});
                    buttons.find('button:eq(1)').button({ icons: { primary: 'ui-icon-circle-close' }});

                    var radios = dialog.find('.ui-editor-link-menu input[type="radio"]');
                    radios.first().attr('checked', 'checked');

                    var changedType = false;
                    if (edit) {
                        for(var type in plugin.types) {
                            if (changedType = plugin.types[type].editing(plugin.selectedElement)) {
                                radios.filter('[value="' + type + '"]').attr('checked', 'checked');
                                plugin.typeChange(plugin.types[type], edit);
                                break;
                            }
                        }
                    }

                    if (!edit || edit && !changedType) {
                        plugin.typeChange(plugin.types[radios.filter(':checked').val()], edit);
                    }

                    // Bind keyup to dialog so we can detect when user presses enter
                    $(this).unbind('keyup.' + plugin.editor.widgetName).bind('keyup.' + plugin.editor.widgetName, function(event) {
                        if (event.keyCode == 13) {
                            // Check for and trigger validation - only allow enter to trigger insert if validation not present or successful
                            var linkType = plugin.types[radios.filter(':checked').val()];
                            if (!$.isFunction(linkType.validate) || linkType.validate(plugin.dialog.find('.' + plugin.options.baseClass + '-content'))) {
                                buttons.find('button:eq(0)').trigger('click');
                            }
                        }
                    });
                },
                close: function() {
                    selectionRestore();
                    plugin.visible = false;
                    dialog.find('.' + options.baseClass + '-content').hide();
                    $(this).dialog('destroy');
                }
            }).dialog('open');
        }
    },

    /**
     * Apply the link attributes to the selection
     * @param  {Boolean} edit True if this is an edit
     * @return {Boolean} True if the application was successful
     */
    apply: function(edit) {
        var linkType = this.types[this.dialog.find('input[type="radio"]:checked').val()];

        var attributes = linkType.attributes(this.dialog.find('.' + this.options.baseClass + '-content'), edit);

        // No attributes to apply
        if (!attributes) {
            return true;
        }

        selectionRestore();

        // Prepare link to be shown in any confirm message
        var link = elementOuterHtml($('<a>' + (attributes.title ? attributes.title : attributes.href) + '</a>').
                attr($.extend({}, attributes, { target: '_blank' })));

        if (!edit) {
            selectionWrapTagWithAttribute('a', $.extend(attributes, { id: this.editor.getUniqueId() }), linkType.classes);
            this.editor.showConfirm(_('Added link: {{link}}', { link: link }));
            this.selectedElement = $('#' + attributes.id).removeAttr('id');
        } else {
            // Remove all link type classes
            this.selectedElement[0].className = this.selectedElement[0].className.replace(new RegExp(this.options.baseClass + '-[a-zA-Z]+','g'), '');
            this.selectedElement.addClass(linkType.classes)
                    .attr(attributes);
            this.editor.showConfirm(_('Updated link: {{link}}', { link: link }));
        }

        this.selectedElement.data(this.options.baseClass + '-href', attributes.href);

        selectionSelectOuter(this.selectedElement);
        selectionSave();

        return true;
    },

    /**
     * Update the link control panel's content depending on which radio button is selected
     * @param  {Boolean} edit    True if the user is editing a link
     */
    typeChange: function(linkType, edit) {
        var panel = this.dialog.find('.' + this.options.baseClass + '-content');
        var wrap = panel.closest('.' + this.options.baseClass + '-wrap');
        var ajax = linkType.ajaxUri && !this.types[linkType.type].content;

        if (ajax) wrap.addClass(this.options.baseClass + '-loading');

        var plugin = this;

        panel.hide(this.options.panelAnimation, function(){
            if (!ajax) {
                panel.html(linkType.content);
                linkType.show(panel, edit);
                panel.show(plugin.options.panelAnimation, $.proxy(linkType.focus, linkType));
            } else {
                $.ajax({
                    url: linkType.ajaxUri,
                    type: 'get',
                    success: function(data) {
                        panel.html(data);
                        plugin.types[linkType.type].content = data;
                        wrap.removeClass(plugin.options.baseClass + '-loading');
                        linkType.show(panel, edit);
                        panel.show(plugin.options.panelAnimation, $.proxy(linkType.focus, linkType));
                    }
                });
            }
        });
    },

    /**
     * Remove the link tags from the selection. Expand to the commonAncestor if the user has selected only a portion of an anchor
     */
    remove: function() {
        this.editor.unwrapParentTag('a');
    },

    /**
     * Replace the href for links with their data version, if stored.
     * This is an attempt to workaround browsers that "helpfully" convert relative & root-relative links to their absolute forms.
     */
    repairLinks: function() {
        var ui = this;
        this.editor.getElement().find('a[class^="' + this.options.baseClass + '"]').each(function(){
            if ($(this).data(ui.options.baseClass + '-href')) {
                $(this).attr('href', $(this).data(ui.options.baseClass + '-href'));
            }
        });
    },

    /**
     * Tidy up after the user has canceled editing
     */
    cancel: function() {
        if (this.dialog) $(this.dialog.dialog('close'));
    }

});

$.ui.editor.registerUi({

    /**
     * @name $.editor.ui.link
     * @augments $.ui.editor.defaultUi
     * @see $.ui.editor.defaultUi.unlink
     * @see  $.editor.plugin.link
     * @class Button initiating the insert link plugin
     */
    link: /** @lends $.editor.ui.link.prototype */ {

        hotkeys: {
            'ctrl+l': {
                'action': function() {
                    this.editor.getPlugin('link').show();
                },
                restoreSelection: false
            }
        },

        /**
         * @see $.ui.editor.defaultUi#init
         */
        init: function(editor) {
            editor.bind('selectionChange', this.change, this);

            return editor.uiButton({
                title: _('Insert Link'),
                click: function() {
                    editor.getPlugin('link').show();
                }
            });
        },

        change: function() {
            if (!selectionGetElements().length) this.ui.disable();
            else this.ui.enable();
        }
    },

    /**
     * @name $.editor.ui.unlink
     * @augments $.ui.editor.defaultUi
     * @see $.ui.editor.defaultUi.link
     * @see  $.editor.plugin.link
     * @class Button allowing the user to unlink text
     */
    unlink: /** @lends $.editor.ui.unlink.prototype */ {

        hotkeys: {
            'ctrl+shift+l': {
                'action': function() {
                    this.ui.click();
                },
                restoreSelection: false
            }
        },

        /**
         * @see $.ui.editor.defaultUi#init
         */
        init: function(editor) {
            editor.bind('selectionChange', this.change, this);
            editor.bind('show', this.change, this);

            return editor.uiButton({
                title: _('Remove Link'),
                click: function() {
                    editor.getPlugin('link').remove();
                }
            });
        },

        /**
         * Enable UI component only when an anchor is selected
         */
        change: function() {
            if (!selectionGetElements().is('a')) this.ui.disable();
            else this.ui.enable();
        }
    }
});
