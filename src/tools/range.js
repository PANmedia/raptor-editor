/**
 * @fileOverview Range manipulation helper functions.
 * @author David Neilsen david@panmedia.co.nz
 * @author Michael Robinson michael@panmedia.co.nz
 */

/**
 * Expands a range to to surround all of the content from its start container
 * to its end container.
 *
 * @public @static
 * @param {RangyRange} range The range to expand.
 */
function rangeExpandToParent(range) {
    range.setStartBefore(range.startContainer);
    range.setEndAfter(range.endContainer);
}

/**
 * While there are common ancestors, check to see if they match an element.
 * @todo Not sure of return
 * @param {RangyRange} range The range to expand.
 * @param {array} elements An array of elements to check the current range against.
 * @returns {unresolved}
 */
function rangeExpandTo(range, elements) {
    do {
        rangeExpandToParent(range);
        for (var i = 0, l = elements.length; i < l; i++) {
            if ($(range.commonAncestorContainer).is(elements[i])) {
                return;
            }
        }
    } while (range.commonAncestorContainer);
}

/**
 * Replaces the content of range with the given html.
 *
 * @param  {jQuery|String} html The html to use when replacing range.
 * @param  {RangyRange} range The range to replace.
 * @return {Node[]} Array of new nodes inserted.
 */
function rangeReplace(range, html) {
    var result = [],
        nodes = $('<div/>').append(html)[0].childNodes;
    range.deleteContents();
    if (nodes.length === undefined || nodes.length === 1) {
        range.insertNode(nodes[0].cloneNode(true));
    } else {
        $.each(nodes, function(i, node) {
            result.unshift(node.cloneNode(true));
            range.insertNodeAtEnd(result[0]);
        });
    }
    return result;
}

/**
 * Emptys a supplied range of all the html tags.
 * @todo check decription please and not sure what it returns.
 * @param {RangyRange} range This is the range to remove tags from.
 * @returns {unresolved}
 */
function rangeEmptyTag(range) {
    var contents = range.cloneContents();
    var html = fragmentToHtml(contents);
    if (typeof html === 'string') {
        html = html.replace(/([ #;&,.+*~\':"!^$[\]()=>|\/@])/g,'\\$1');
    }
    return elementIsEmpty(html);
}

/**
 * Returns a single selected ranges common ancestor.
 * Works for single ranges only.
 *
 * @param {RangyRange} selection
 * @return {Element} The selected range's common ancestor.
 */
function rangeGetCommonAncestor(selection) {
    selection = selection || rangy.getSelection();

    var commonAncestor;
    $(selection.getAllRanges()).each(function(i, range){
        if (this.commonAncestorContainer.nodeType === Node.TEXT_NODE) {
            commonAncestor = $(range.commonAncestorContainer).parent()[0];
        } else {
            commonAncestor = range.commonAncestorContainer;
        }
    });

    return commonAncestor;
}

/**
 * Returns true if the supplied range is empty (has a length of 0)
 *
 * @public @static
 * @param {RangyRange} range The range to check if it is empty
 */
function rangeIsEmpty(range) {
    return range.startOffset === range.endOffset &&
           range.startContainer === range.endContainer;
}

function rangeIsContainedBy(range, node) {
    var nodeRange = range.cloneRange();
    nodeRange.selectNodeContents(node);
    return nodeRange.containsRange(range);
}

//function rangesToggleWrapper(ranges, tag, options) {
//    var applier = rangy.createCssClassApplier(options.classes || '', {
//        normalize: true,
//        elementTagName: tag,
//        elementProperties: options.attributes || {},
//        ignoreWhiteSpace: false
//    });
//    applier.applyToRanges(ranges);
//}
//
//function rangeToggleWrapper(range, tag, options) {
//    options = options || {};
//    var applier = rangy.createCssClassApplier(options.classes || '', {
//        normalize: true,
//        elementTagName: tag,
//        elementProperties: options.attributes || {}
//    });
//    if (rangeEmptyTag(range)) {
//        var element = $('<' + tag + '/>')
//            .addClass(options.classes)
//            .attr(options.attributes || {})
//            .append(fragmentToHtml(range.cloneContents()));
//        rangeReplace(element, range);
//    } else {
//        applier.toggleRange(range);
//    }
//}

/**
 * Removes the white space at the start and the end of the selection.
 *
 * @param {RangyRange} range This is the range of selected text.
 */
function rangeTrim(range) {
    var selectedText = range.text();

    // Trim start
    var match = /^\s+/.exec(selectedText);
    if (match) {
        range.moveStart('character', match[0].length);
    }

    // Trim end
    match = /\s+$/.exec(selectedText);
    if (match) {
        range.moveEnd('character', -match[0].length);
    }
}

/**
 * Serializes supplied ranges.
 * @todo not sure of the description for rootNode.
 * @param {RangyRange} ranges This is the set of ranges to be serialized.
 * @param {Node} rootNode
 * @returns {String} A string of the serialized ranges separated by '|'.
 */
function rangeSerialize(ranges, rootNode) {
    var serializedRanges = [];
    for (var i = 0, l = ranges.length; i < l; i++) {
        serializedRanges[i] = rangy.serializeRange(ranges[i], true);
    }
    return serializedRanges.join('|');
}

/**
 * Deseralizes supplied ranges.
 *
 * @param {string} serialized This is the already serailized range to be deserialized.
 * @returns {Array} An array of deserialized ranges.
 */
function rangeDeserialize(serialized) {
    var serializedRanges = serialized.split("|"),
        ranges = [];
    for (var i = 0, l = serializedRanges.length; i < l; i++) {
        ranges[i] = rangy.deserializeRange(serializedRanges[i]);
    }
    return ranges;
}