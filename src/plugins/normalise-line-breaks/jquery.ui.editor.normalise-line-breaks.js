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
        return: '<p><br/></p>',

        /**
         * @type {Array} Array of tag names within which the return HTML is valid.
         */
        returnValidTags: [
            'address', 'blockquote', 'body', 'button', 'center', 'dd',
            'div', 'fieldset', 'form', 'iframe', 'li', 'noframes',
            'noscript', 'object', 'td', 'th'
        ],


        /**
         * @type {String} The tag to insert when user presses shift enter.
         */
        shiftReturn: '<br/>',

        /**
         * @type {Array} Array of tag names within which the shiftReturn HTML is valid.
         */
        shiftReturnValidTags: [
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
                this.insertBreak(this.options.return, this.options.returnValidTags);
            },
            restoreSelection: false
        },
        'return+shift': {
            'action': function() {
                this.insertBreak(this.options.shiftReturn, this.options.shiftReturnValidTags);
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
        var breakId = this.options.widgetName + '-return-break';
        var returnHtml = $(breakHtml).attr('id', breakId);
        selectionReplaceWithinValidTags(returnHtml, breakValidTags);
        selectionSelectEnd($('#' + breakId).removeAttr('id'));
    }

});
