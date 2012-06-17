/**
 * @name $.editor.plugin.emptyElement
 * @augments $.ui.editor.defaultPlugin
 * @class Automaticly wraps content inside an editable element with a specified tag if it is empty.
 */
$.ui.editor.registerPlugin('emptyElement', /** @lends $.editor.plugin.emptyElement.prototype */ {

    options: {
        tag: '<p/>'
    },

    /**
     * @see $.ui.editor.defaultPlugin#init
     */
    init: function(editor, options) {
        this.bind('change', this.change)
    },

    change: function() {
        var plugin = this;
        this.textNodes(this.editor.getElement()).each(function() {
            $(this).wrap($(plugin.options.tag));
        });
    },

    /**
     * Returns the text nodes of an element (not including child elements), filtering
     * out blank (white space only) nodes.
     *
     * @param {jQuerySelector|jQuery|Element} element
     * @returns {jQuery}
     */
    textNodes: function(element) {
        return $(element).contents().filter(function() {
            return this.nodeType == 3 && $.trim(this.nodeValue).length;
        });
    }

});
