/**
 * @name $.editor.plugin.normaliseLineBreaks
 * @augments $.ui.editor.defaultPlugin
 * @class Automaticly wraps content inside an editable element with a specified tag if it is empty.
 */
$.ui.editor.registerPlugin('normaliseLineBreaks', /** @lends $.editor.plugin.normaliseLineBreaks.prototype */ {

    /**
     * @name $.editor.plugin.normaliseLineBreaks.options
     * @type {Object}
     * @namespace Default options
     * @see $.editor.plugin.normaliseLineBreaks
     */
    options: /** @lends $.editor.plugin.normaliseLineBreaks.options */  {

        /**
         * @type {String} The tag to insert when user presses enter
         */
        enter: '<p><br/></p>',

        /**
         * @type {Array} Array of tag names within which the return HTML is valid.
         */
        enterValidTags: [
            'address', 'blockquote', 'body', 'button', 'center', 'dd',
            'div', 'fieldset', 'form', 'iframe', 'li', 'noframes',
            'noscript', 'object', 'td', 'th'
        ],

        /**
         * @type {String} The tag to insert when user presses shift enter.
         */
        shiftEnter: '<br/>',

        /**
         * @type {Array} Array of tag names within which the shiftReturn HTML is valid.
         */
        shiftEnterValidTags: [
            'a', 'abbr', 'acronym', 'address', 'applet', 'b', 'bdo',
            'big', 'blockquote', 'body', 'button', 'caption', 'center',
            'cite', 'code', 'dd', 'del', 'dfn', 'div', 'dt', 'em',
            'fieldset', 'font', 'form', 'h1', 'h2', 'h3', 'h4', 'h5',
            'h6', 'i', 'iframe', 'ins', 'kbd', 'label', 'legend', 'li',
            'noframes', 'noscript', 'object', 'p', 'pres', 'q', 's',
            'samp', 'small', 'span', 'strike', 'strong', 'sub', 'sup',
            'td', 'th', 'tt', 'u', 'var'
        ]
    },

    hotkeys: {
        'return': {
            'action': function() {
                this.insertBreak(this.options.enter, this.options.enterValidTags);
            },
            restoreSelection: false
        },
        'return+shift': {
            'action': function() {
                this.insertBreak(this.options.shiftEnter, this.options.shiftEnterValidTags);
            },
            restoreSelection: false
        }
    },

    /**
     * Replace selection with given breakHtml
     * @param  {String} breakHtml The HTML to replace selection with.
     * @param  {Array} breakValidTags Array of tag names within which the replaceHtml is valid.
     */
    insertBreak: function(breakHtml, breakValidTags) {
        var breakId = this.options.baseClass + '-enter-break';

        var breakElement = $(breakHtml)
                        .attr('id', breakId)
                        .appendTo('body');

        if (breakValidTags) {
            selectionReplaceWithinValidTags(breakElement, breakValidTags);
        } else {
            selectionReplace(breakElement);
        }

        var select = $('#' + breakId).removeAttr('id').next();

        selectionSelectStart(select);

        this.editor.checkChange();
    }

});
