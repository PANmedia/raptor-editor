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

                selectionDestroy();

                var selectionEmpty = selectionIsEmpty();
                var selectionIsAtStart = selectionAtStartOfElement();
                var selectionIsAtEnd = selectionAtEndOfElement();

                var breakId = this.options.baseClass + '-enter-break';
                var breakElement = $(this.options.enter).attr('id', breakId);

                selectionReplaceWithinValidTags(breakElement, this.options.enterValidTags);

                breakElement = $('#' + breakId).removeAttr('id');
                if (selectionEmpty) {
                    if (selectionIsAtStart) {
                        selectionSelectStart(breakElement.next());
                    } else if(selectionIsAtEnd) {
                        selectionSelectStart(breakElement);
                    } else {
                        selectionSelectStart(breakElement.next());
                        var previousSibling = breakElement.prev();
                        if (previousSibling && $.trim(previousSibling.html()) !== '' && elementOuterHtml(previousSibling) !== this.options.enter) {
                            breakElement.remove();
                        }
                    }
                } else {
                    selectionSelectStart(breakElement.next());
                    breakElement.remove();
                }
            },
            restoreSelection: false
        },
        'return+shift': {
            'action': function() {
                selectionDestroy();

                var breakId = this.options.baseClass + '-enter-break';

                var breakElement = $(breakHtml)
                                .attr('id', breakId)
                                .appendTo('body');

                if (this.options.shiftEnterValidTags) {
                    selectionReplaceWithinValidTags(this.options.shiftEnter, this.options.shiftEnterValidTags);
                } else {
                    selectionReplace(breakElement);
                }

                var select = $('#' + breakId).removeAttr('id').next();

                selectionSelectStart(select);
            },
            restoreSelection: false
        }
    }
});
