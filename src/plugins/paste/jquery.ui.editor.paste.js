/**
 * @name $.editor.plugin.paste
 * @extends $.editor.plugin
 * @class Plugin that captures paste events on the element and shows a modal dialog containing different versions of what was pasted.
 * Intended to prevent horrible 'paste from word' catastrophes.
 */
$.ui.editor.registerPlugin('paste', /** @lends $.editor.plugin.paste.prototype */ {

    /**
     * @name $.editor.plugin.paste.options
     * @type {Object}
     * @namespace Default options
     * @see $.editor.plugin.paste
     */
    options: /** @lends $.editor.plugin.paste.options */  {

        /**
         * Tags that will not be stripped from pasted content.
         * @type {Array}
         */
        allowedTags: [
            'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'div', 'ul', 'ol', 'li', 'blockquote',
            'p', 'a', 'span', 'hr', 'br'
        ],

        allowedAttributes: [
            'href', 'title'
        ],

        allowedEmptyTags: [
            'hr', 'br'
        ]
    },

    /**
     * @see $.ui.editor.defaultPlugin#init
     */
    init: function(editor, options) {
        var inProgress = false;
        var dialog = false;
        var selector = '.uiWidgetEditorPasteBin';
        var plugin = this;

        // Event binding
        editor.getElement().bind('paste.' + editor.widgetName, $.proxy(function(event) {
            if (inProgress) return false;
            inProgress = true;

            selectionSave();

            // Make a contentEditable div to capture pasted text
            if ($(selector).length) $(selector).remove();
            $('<div class="uiWidgetEditorPasteBin" contenteditable="true" style="width: 1px; height: 1px; overflow: hidden; position: fixed; top: -1px;" />').appendTo('body');
            $(selector).focus();

            window.setTimeout(function() {
                var markup = $(selector).html();
                markup = plugin.filterAttributes(markup);
                markup = plugin.filterChars(markup);
                markup = plugin.stripEmpty(markup);
                markup = plugin.stripAttributes(markup);
                markup = stringStripTags(markup, plugin.options.allowedTags);

                var vars = {
                    plain: $('<div/>').html($(selector).html()).text(),
                    markup: markup,
                    html: $(selector).html()
                };

                dialog = $(editor.getTemplate('paste.dialog', vars));

                // dialog.find('.ui-editor-paste-area').bind('keyup.' + editor.widgetname, function(){
                //     plugin.updateAreas(this, dialog);
                // });

                $(dialog).dialog({
                    modal: true,
                    width: 650,
                    height: 500,
                    resizable: true,
                    title: 'Paste',
                    position: 'center',
                    show: options.dialogShowAnimation,
                    hide: options.dialogHideAnimation,
                    dialogClass: options.baseClass + ' ' + options.dialogClass,
                    buttons:
                        [
                            {
                                text: _('Insert'),
                                click: function() {
                                    var html = null;
                                    var element = $(this).find('.ui-editor-paste-area:visible');

                                    if (element.hasClass('ui-editor-paste-plain') || element.hasClass('ui-editor-paste-source')) {
                                        html = element.val();
                                    } else {
                                        html = element.html();
                                    }

                                    html = plugin.filterAttributes(html);
                                    html = plugin.filterChars(html);

                                    selectionRestore();
                                    selectionReplace(html);

                                    inProgress = false;
                                    $(this).dialog('close');
                                }
                            },
                            {
                                text: _('Cancel'),
                                click: function() {
                                    selectionRestore();
                                    inProgress = false;
                                    $(this).dialog('close');
                                }
                            }
                    ],
                    open: function() {
                        // Create fake jQuery UI tabs (to prevent hash changes)
                        var tabs = $(this).find('.ui-editor-paste-panel-tabs');
                        tabs.find('ul.ui-tabs-nav li').click(function() {
                            tabs.find('ul.ui-tabs-nav li').removeClass('ui-state-active').removeClass('ui-tabs-selected');
                            $(this).addClass('ui-state-active').addClass('ui-tabs-selected');
                            tabs.children('div').hide().eq($(this).index()).show();
                        });

                        // Set custom buttons
                        var buttons = dialog.parent().find('.ui-dialog-buttonpane');
                        buttons.find('button:eq(0)').button({icons: {primary: 'ui-icon-circle-check'}});
                        buttons.find('button:eq(1)').button({icons: {primary: 'ui-icon-circle-close'}});
                    },
                    close: function() {
                        inProgress = false;
                        $(this).dialog('destroy').remove();
                    }
                });

                $(selector).remove();

            }, 0);

            return true;
        }, this));
    },

    /**
     * Attempts to filter rubbish from content using regular expressions
     * @param  {String} content Dirty text
     * @return {String} The filtered content
     */
    filterAttributes: function(content) {
        // The filters variable is an array of of regular expression & handler pairs.
        //
        // The regular expressions attempt to strip out a lot of style data that
        // MS Word likes to insert when pasting into a contentEditable.
        // Almost all of it is junk and not good html.
        //
        // The hander is a place to put a function for match handling.
        // In most cases, it just handles it as empty string.  But the option is there
        // for more complex handling.
        var filters = [
            // Meta tags, link tags, and prefixed tags
            {regexp: /(<meta\s*[^>]*\s*>)|(<\s*link\s* href="file:[^>]*\s*>)|(<\/?\s*\w+:[^>]*\s*>)/gi, handler: ''},
            // MS class tags and comment tags.
            {regexp: /(class="Mso[^"]*")|(<!--(.|\s){1,}?-->)/gi, handler: ''},
            // Apple class tags
            {regexp: /(class="Apple-(style|converted)-[a-z]+\s?[^"]+")/, handle: ''},
            // Google doc attributes
            {regexp: /id="internal-source-marker_[^"]+"|dir="[rtl]{3}"/, handle: ''},
            // blank p tags
            {regexp: /(<p[^>]*>\s*(\&nbsp;|\u00A0)*\s*<\/p[^>]*>)|(<p[^>]*>\s*<font[^>]*>\s*(\&nbsp;|\u00A0)*\s*<\/\s*font\s*>\s<\/p[^>]*>)/ig, handler: ''},
            // Strip out styles containing mso defs and margins, as likely added in IE and are not good to have as it mangles presentation.
            {regexp: /(style="[^"]*mso-[^;][^"]*")|(style="margin:\s*[^;"]*;")/gi, handler: ''},
            // Style tags
            {regexp: /(?:<style([^>]*)>([\s\S]*?)<\/style>|<link\s+(?=[^>]*rel=['"]?stylesheet)([^>]*?href=(['"])([^>]*?)\4[^>\/]*)\/?>)/gi, handler: ''},
            // Scripts (if any)
            {regexp: /(<\s*script[^>]*>((.|\s)*?)<\\?\/\s*script\s*>)|(<\s*script\b([^<>]|\s)*>?)|(<[^>]*=(\s|)*[("|')]javascript:[^$1][(\s|.)]*[$1][^>]*>)/ig, handler: ''}
        ];

        $.each(filters, function(i, filter) {
            content = content.replace(filter.regexp, filter.handler);
        });

        return content;
    },

    /**
     * Replaces commonly-used Windows 1252 encoded chars that do not exist in ASCII or ISO-8859-1 with ISO-8859-1 cognates.
     * @param  {[type]} content [description]
     * @return {[type]}
     */
    filterChars: function(content) {
        var s = content;

        // smart single quotes and apostrophe
        s = s.replace(/[\u2018|\u2019|\u201A]/g, '\'');

        // smart double quotes
        s = s.replace(/[\u201C|\u201D|\u201E]/g, '\"');

        // ellipsis
        s = s.replace(/\u2026/g, '...');

        // dashes
        s = s.replace(/[\u2013|\u2014]/g, '-');

        // circumflex
        s = s.replace(/\u02C6/g, '^');

        // open angle bracket
        s = s.replace(/\u2039/g, '<');

        // close angle bracket
        s = s.replace(/\u203A/g, '>');

        // spaces
        s = s.replace(/[\u02DC|\u00A0]/g, ' ');

        return s;
    },

    /**
     * Strip all attributes from content (if it's an element), and every element contained within
     * Strip loop taken from <a href="http://stackoverflow.com/a/1870487/187954">Remove all attributes</a>
     * @param  {String|Element} content The string / element to be cleaned
     * @return {String} The cleaned string
     */
    stripAttributes: function(content) {
        content = $('<div/>').html(content);
        var allowedAttributes = this.options.allowedAttributes;

        $(content.find('*')).each(function() {
            // First copy the attributes to remove if we don't do this it causes problems iterating over the array
            // we're removing elements from
            var attributes = [];
            $.each(this.attributes, function(index, attribute) {
                // Do not remove allowed attributes
                if (-1 !== $.inArray(attribute.nodeName, allowedAttributes)) {
                    return;
                }
                attributes.push(attribute.nodeName);
            });

            // now remove the attributes
            for (var attributeIndex = 0; attributeIndex < attributes.length; attributeIndex++) {
                $(this).attr(attributes[attributeIndex], null);
            }
        });
        return content.html();
    },

    /**
     * Remove empty tags.
     * @param  {String} content The HTML containing empty elements to be removed
     * @return {String} The cleaned HTML
     */
    stripEmpty: function(content) {
        var wrapper = $('<div/>').html(content);
        var allowedEmptyTags = this.options.allowedEmptyTags;
        wrapper.find('*').filter(function() {
            // Do not strip elements in allowedEmptyTags
            if (-1 !== $.inArray(this.tagName.toLowerCase(), allowedEmptyTags)) {
                return false;
            }
            // If the element has at least one child element that exists in allowedEmptyTags, do not strip it
            if ($(this).find(allowedEmptyTags.join(',')).length) {
                return false;
            }
            return $.trim($(this).text()) === '';
        }).remove();
        return wrapper.html();
    },

    /**
     * Update text input content
     * @param  {Element} target The input being edited
     * @param  {Element} dialog The paste dialog
     */
    updateAreas: function(target, dialog) {
        var content = $(target).is('textarea') ? $(target).val() : $(target).html();
        if (!$(target).hasClass('ui-editor-paste-plain')) dialog.find('.ui-editor-paste-plain').val($('<div/>').html(content).text());
        if (!$(target).hasClass('ui-editor-paste-rich')) dialog.find('.ui-editor-paste-rich').html(content);
        if (!$(target).hasClass('ui-editor-paste-source')) dialog.find('.ui-editor-paste-source').html(content);
        if (!$(target).hasClass('ui-editor-paste-markup')) dialog.find('.ui-editor-paste-markup').html(this.stripAttributes(content));
    }
});