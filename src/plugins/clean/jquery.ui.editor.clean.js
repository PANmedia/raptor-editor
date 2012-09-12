/**
 * @fileOverview Clean plugin & ui component
 * @author David Neilsen david@panmedia.co.nz
 * @author Michael Robinson michael@panmedia.co.nz
 */

 /**
  * @name $.editor.plugin.clean
  * @augments $.ui.editor.defaultPlugin
  * @class Strips empty tags and unwanted attributes from editing element
  */
  $.ui.editor.registerPlugin('clean', /** @lends $.editor.plugin.clean.prototype */ {

    /** @type {Object} Attributes to be stripped, empty tags to be removed & attributes to be removed if empty */
    options: {

        /** @type {Array} Attributes to be completely removed */
        stripAttrs: ['_moz_dirty'],

        /** @type {Object} Attribute contents to be stripped */
        stripAttrContent: {
            type: '_moz'
        },

        /** @type {String[]} Tags to be removed if empty */
        stripEmptyTags: [
            'span', 'h1', 'h2', 'h3', 'h4', 'h5',  'h6',
            'p', 'b', 'i', 'u', 'strong', 'em',
            'big', 'small', 'div'
        ],

        /** @type {String[]} Attributes to be removed if empty */
        stripEmptyAttrs: [
            'class', 'id', 'style'
        ],

        /** @type {Object[]} Tag attributes to remove the domain part of a URL from. */
        stripDomains: [
            {selector: 'a', attributes: ['href']},
            {selector: 'img', attributes: ['src']}
        ]
    },

    /**
     * Binds {@link $.editor.plugin.clean#clean} to the change event
     * @see $.ui.editor.defaultPlugin#init
     */
    init: function(editor, options) {
        editor.bind('change', this.clean, this);
    },

    /**
     * Removes empty tags and unwanted attributes from the element
     */
    clean: function() {
        var i;
        var editor = this.editor;
        for (i = 0; i < this.options.stripAttrs.length; i++) {
            editor.getElement()
                .find('[' + this.options.stripAttrs[i] + ']')
                .removeAttr(this.options.stripAttrs[i]);
        }
        for (i = 0; i < this.options.stripAttrContent.length; i++) {
            editor.getElement()
                .find('[' + i + '="' + this.options.stripAttrs[i] + '"]')
                .removeAttr(this.options.stripAttrs[i]);
        }
        for (i = 0; i < this.options.stripEmptyTags.length; i++) {
            editor.getElement()
                .find(this.options.stripEmptyTags[i])
                .filter(function() {
                    // Do not remove ignored elements. Inserter is responsible for these.
                    if ($(this).hasClass(editor.options.supplementaryClass)) {
                        return false;
                    }
                    // Do not clear selection markers if the editor is using it
                    if ($(this).hasClass('rangySelectionBoundary') && selectionSaved()) {
                        return false;
                    }
                    // Finally, remove empty elements
                    if ($.trim($(this).html()) === '') {
                        return true;
                    }
                })
                .remove();
        }
        for (i = 0; i < this.options.stripEmptyAttrs.length; i++) {
            var attr = this.options.stripEmptyAttrs[i];
            editor.getElement()
                .find('[' + this.options.stripEmptyAttrs[i] + ']')
                .filter(function() {
                    return $.trim($(this).attr(attr)) === '';
                }).removeAttr(this.options.stripEmptyAttrs[i]);
        }

        // Strip domains
        var origin = window.location.protocol + '//' + window.location.host,
            protocolDomain = '//' + window.location.host;
        for (i = 0; i < this.options.stripDomains.length; i++) {
            var def = this.options.stripDomains[i];

            // Clean only elements within the editing element
            this.editor.getElement().find(def.selector).each(function() {
                for (var j = 0; j < def.attributes.length; j++) {
                    var attr = $(this).attr(def.attributes[j]);
                    // Do not continue if there are no attributes
                    if (typeof attr === 'undefined') {
                        continue;
                    }
                    if (attr.indexOf(origin) === 0) {
                        $(this).attr(def.attributes[j], attr.substr(origin.length));
                    } else if (attr.indexOf(protocolDomain) === 0) {
                        $(this).attr(def.attributes[j], attr.substr(protocolDomain.length));
                    }
                }
            });
        }

        // Ensure ul, ol content is wrapped in li's
        this.editor.getElement().find('ul, ol').each(function() {
            $(this).find(' > :not(li)').each(function() {
                if (elementDefaultDisplay($(this).attr('tag'))) {
                    $(this).replaceWith($('<li>' + $(this).html() + '</li>').appendTo('body'));
                } else {
                    $(this).wrap($('<li>'));
                }
            });
        });
    }
});

$.ui.editor.registerUi({
    /**
      * @name $.editor.ui.clean
      * @augments $.ui.editor.defaultUi
      * @class UI component that calls {@link $.editor.plugin.clean#clean} when clicked
      */
    clean: /** @lends $.editor.ui.clean.prototype */ {

        /**
         * @see $.ui.editor.defaultUi#init
         */
        init: function(editor) {
            return editor.uiButton({
                title: _('Remove unnecessary markup from editor content'),
                click: function() {
                    editor.getPlugin('clean').clean();
                }
            });
        }
    }
});
