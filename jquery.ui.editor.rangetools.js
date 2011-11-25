/**
 * @fileOverview This file has contains functions for making adjustments to the 
 *      DOM based on ranges, selections, etc.
 * @author David Neilsen - david@panmedia.co.nz
 * @author Michael Robinson - michael@panmedia.co.nz
 * @version 0.1
 */

/**
 * @namespace
 */
var domTools = {
    
    /**
     * @public
     * @static
     * @param {DOMFragment} domFragment 
     * @param {jQuerySelector|jQuery|Element} beforeElement 
     * @param {String} wrapperTag
     */
    insertDomFragmentBefore: function(domFragment, beforeElement, wrapperTag) {
        // Get all nodes in the extracted content
        for (var j = 0, l = domFragment.childNodes.length; j < l; j++) {
            var node = domFragment.childNodes.item(j);
            // Prepend the node before the current node
            var content = node.nodeType === 3 ? node.nodeValue : $(node).html();
            if (content) {
                $('<' + wrapperTag + '/>')
                    .html($.trim(content))
                    .insertBefore(beforeElement);
            }
        }
    },
    
    /**
     * Returns true if the supplied range is empty (has a length of 0)
     * @public
     * @static
     * @param {RangyRange} range The range to check if it is empty
     */
    isEmpty: function(range) {
        return range.startOffset === range.endOffset && 
               range.startContainer === range.endContainer;
    },

    
    /**
     * Expands a range to to surround all of the content from its start container
     *      to its end container.
     * @public
     * @static
     * @param {RangyRange} range The range to expand
     */
    expandToParent: function(range) {
        range.setStartBefore(range.startContainer);
        range.setEndAfter(range.endContainer);
    },


    /**
     * 
     * @public
     * @static
     * @param {RangyRange} range 
     * @param {String} tag 
     */
    changeTag: function(range, tag) {
        var contents = range.extractContents();
        this.insertDomFragmentBefore(contents, range.startContainer, tag);
        $(range.startContainer).remove();
    },
    
    
    /**
     * @public
     * @static
     * @param {String} tag 
     */
    tagSelection: function(tag) {
        for (var i in rangy.getSelection().getAllRanges()) {
            // Create a new range set every time to update range offsets
            var ranges = rangy.getSelection().getAllRanges();

            if (this.rangeIsEmpty(ranges[i])) {
                // Apply to the whole element 
                this.expandRangeToParent(ranges[i]);
                this.changeRangeTag(ranges[i], tag);
            } else {
                // Create a range from the start of the current range, to the beginning of the start element
                var range = rangy.createRange();
                range.setStart(ranges[i].startContainer, 0);
                range.setEnd(ranges[i].startContainer, ranges[i].startOffset);

                // Extract the contents, and prepend it as a new node before the current node
                var precontent = range.extractContents();
                var parent = $(range.startContainer).parent();
                this.insertDomFragmentBefore(precontent, parent[0].nodeName, parent);

                // Extract the content in the selected range
                var contents = ranges[i].extractContents();
                this.insertDomFragmentBefore(contents, tag, parent);
            }
        }

        this.fire('change');
    }
    
}
