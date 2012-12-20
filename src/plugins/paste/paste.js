var pasteInProgress = false,
    pasteDialog = null,
    pasteInstance = null;

function PastePlugin(name, overrides) {
    this.options = {
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
    };

    RaptorPlugin.call(this, name || 'paste', overrides);
}

PastePlugin.prototype = Object.create(RaptorPlugin.prototype);

PastePlugin.prototype.enable = function() {
    this.raptor.getElement().bind('paste.' + this.raptor.widgetName, this.caputrePaste.bind(this));
};

PastePlugin.prototype.caputrePaste = function() {
    if (pasteInProgress) {
        return false;
    }
    this.state = this.raptor.stateSave();
    pasteInProgress = true;

    //selectionSave();

    // Make a contentEditable div to capture pasted text
    if ($('.raptorPasteBin').length) {
        $('.raptorPasteBin').remove();
    }
    $('<div class="raptorPasteBin" contenteditable="true" style="width: 1px; height: 1px; overflow: hidden; position: fixed; top: -1px;" />').appendTo('body');
    $('.raptorPasteBin').focus();

    window.setTimeout(this.showPasteDialog.bind(this), 0);

    return true;
};

PastePlugin.prototype.showPasteDialog = function() {
    aDialogOpen(this.getDialog(this));
};

PastePlugin.prototype.pasteContent = function(html) {
    console.log(this.state);
    this.raptor.stateRestore(this.state);
    this.raptor.actionApply(function() {
        html = this.filterAttributes(html);
        html = this.filterChars(html);
        selectionReplace(html);
        pasteInProgress = false;
    }.bind(this));
};

PastePlugin.prototype.getDialog = function(instance) {
    pasteInstance = instance;
    if (!pasteDialog) {
        pasteDialog = $('<div>').html(this.raptor.getTemplate('paste.dialog', this.options));
        aDialog(pasteDialog, {
            modal: true,
            resizable: true,
            autoOpen: false,
            width: 600,
            height: 400,
            title: _('pasteDialogTitle'),
            dialogClass: this.options.baseClass + '-dialog',
            buttons: [
                {
                    text: _('pasteDialogOKButton'),
                    click: function() {
                        var html = null,
                            element = pasteDialog.find('.' + this.options.baseClass + '-area:visible');

                        if (element.hasClass(this.options.baseClass + '-plain') || element.hasClass(this.options.baseClass + '-source')) {
                            html = element.val();
                        } else {
                            html = element.html();
                        }
                        pasteInstance.pasteContent(html);
                        aDialogClose(pasteDialog);
                    }.bind(this),
                    icons: {
                        primary: 'ui-icon-circle-check'
                    }
                },
                {
                    text: _('pasteDialogCancelButton'),
                    click: function() {
                        aDialogClose(pasteDialog);
                    },
                    icons: {
                        primary: 'ui-icon-circle-close'
                    }
                }
            ]
        });

        // Create fake jQuery UI tabs (to prevent hash changes)
        var tabs = pasteDialog.find('.' + this.options.baseClass + '-panel-tabs');
        tabs.find('li')
            .click(function() {
                tabs.find('ul li').removeClass('ui-state-active').removeClass('ui-tabs-selected');
                $(this).addClass('ui-state-active').addClass('ui-tabs-selected');
                tabs.children('div').hide().eq($(this).index()).show();
            });
    }
    this.updateAreas();
    return pasteDialog;
};

/**
 * Attempts to filter rubbish from content using regular expressions
 * @param  {String} content Dirty text
 * @return {String} The filtered content
 */
PastePlugin.prototype.filterAttributes = function(content) {
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
};

/**
 * Replaces commonly-used Windows 1252 encoded chars that do not exist in ASCII or ISO-8859-1 with ISO-8859-1 cognates.
 * @param  {[type]} content [description]
 * @return {[type]}
 */
PastePlugin.prototype.filterChars = function(content) {
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
};

/**
 * Strip all attributes from content (if it's an element), and every element contained within
 * Strip loop taken from <a href="http://stackoverflow.com/a/1870487/187954">Remove all attributes</a>
 * @param  {String|Element} content The string / element to be cleaned
 * @return {String} The cleaned string
 */
PastePlugin.prototype.stripAttributes = function(content) {
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
};

/**
 * Remove empty tags.
 * @param  {String} content The HTML containing empty elements to be removed
 * @return {String} The cleaned HTML
 */
PastePlugin.prototype.stripEmpty = function(content) {
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
};

/**
 * Update text input content
 * @param  {Element} target The input being edited
 * @param  {Element} dialog The paste dialog
 */
PastePlugin.prototype.updateAreas = function() {
    var markup = $('.raptorPasteBin').html();
    markup = this.filterAttributes(markup);
    markup = this.filterChars(markup);
    markup = this.stripEmpty(markup);
    markup = this.stripAttributes(markup);
    markup = stringStripTags(markup, this.options.allowedTags);

    var plain = $('<div/>').html($('.raptorPasteBin').html()).text();
    var html = $('.raptorPasteBin').html();

    pasteDialog.find('.' + this.options.baseClass + '-plain').val($('<div/>').html(plain).text());
    pasteDialog.find('.' + this.options.baseClass + '-rich').html(markup);
    pasteDialog.find('.' + this.options.baseClass + '-source').html(html);
    pasteDialog.find('.' + this.options.baseClass + '-markup').html(this.stripAttributes(html));
};

Raptor.registerPlugin(new PastePlugin());

