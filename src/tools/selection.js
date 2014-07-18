/**
 * @fileOverview Selection manipulation helper functions.
 * @license http://www.raptor-editor.com/license
 *
 * @author David Neilsen david@panmedia.co.nz
 * @author Michael Robinson michael@panmedia.co.nz
 */

/**
 * @type {Boolean|Object} current saved selection.
 */
var savedSelection = false;

/**
 * Save selection wrapper, preventing plugins / UI from accessing rangy directly.
 * @todo check desc and type for overwrite.
 * @param {Boolean} overwrite True if selection is able to be overwritten.
 */
function selectionSave(overwrite) {
    if (savedSelection && !overwrite) return;
    savedSelection = rangy.saveSelection();
}

/**
 * Restore selection wrapper, preventing plugins / UI from accessing rangy directly.
 */
function selectionRestore() {
    if (savedSelection) {
        rangy.restoreSelection(savedSelection);
        savedSelection = false;
    }
}

/**
 * Reset saved selection.
 */
function selectionDestroy() {
    if (savedSelection) {
        rangy.removeMarkers(savedSelection);
    }
    savedSelection = false;
}

/**
 * Returns whether the selection is saved.
 *
 * @returns {Boolean} True if there is a saved selection.
 */
function selectionSaved() {
    return savedSelection !== false;
}

/**
 * Iterates over all ranges in a selection and calls the callback for each
 * range. The selection/range offsets is updated in every iteration in in the
 * case that a range was changed or removed by a previous iteration.
 *
 * @public @static
 * @param {function} callback The function to call for each range. The first and only parameter will be the current range.
 * @param {RangySelection} [selection] A RangySelection, or by default, the current selection.
 * @param {object} [context] The context in which to call the callback.
 */
function selectionEachRange(callback, selection, context) {
    selection = selection || rangy.getSelection();
    var range, i = 0;
    // Create a new range set every time to update range offsets
    while (range = selection.getAllRanges()[i++]) {
        callback.call(context, range);
    }
}

/**
 * Replaces the current selection with the specified range.
 *
 * @param {RangySelection} mixed The specified range to replace the current range.
 */
function selectionSet(mixed) {
    rangy.getSelection().setSingleRange(mixed);
}

/**
 * Replaces the given selection (or the current selection if selection is not
 * supplied) with the given html or node.
 *
 * @public @static
 * @param  {Node|String} html The html or node to replace the selection with.
 * @param  {RangySelection|null} selection The selection to replace, or null to replace the current selection.
 * @return {Node[]} Array of new nodes inserted.
 */
function selectionReplace(html, selection) {
    var newNodes = [];
    selectionEachRange(function(range) {
        newNodes = newNodes.concat(rangeReplace(range, html));
    }, selection, this);
    return newNodes;
}

/**
 * Selects all the contents of the supplied element, excluding the element itself.
 *
 * @public @static
 * @param {jQuerySelector|jQuery|Element} element
 * @param {RangySelection} [selection] A RangySelection, or by default, the current selection.
 */
 /*
function selectionSelectInner(element, selection) {
    selection = selection || rangy.getSelection();
    selection.removeAllRanges();
    $(element).focus().contents().each(function() {
        var range = rangy.createRange();
        range.selectNodeContents(this);
        selection.addRange(range);
    });
}
*/
/**
 * Selects all the contents of the supplied node, excluding the node itself.
 *
 * @public @static
 * @param {Node} node
 * @param {RangySelection} [selection] A RangySelection, or by default, the current selection.
 */
function selectionSelectInner(node, selection) {
    // <strict>
    if (!typeIsNode(node)) {
        handleInvalidArgumentError('Parameter 1 to selectionSelectInner is expected a Node', node);
        return;
    }
    // </strict>
    selection = selection || rangy.getSelection();
    var range = rangy.createRange();
    range.selectNodeContents(node);
    selection.setSingleRange(range);
}

/**
 * Selects all the contents of the supplied node, including the node itself.
 *
 * @public @static
 * @param {Node} node
 * @param {RangySelection} [selection] A RangySelection, or null to use the current selection.
 */
function selectionSelectOuter(node, selection) {
    // <strict>
    if (!typeIsNode(node)) {
        handleInvalidArgumentError('Parameter 1 to selectionSelectOuter must be a node', node);
        return;
    }
    // </strict>
    var range = rangy.createRange();
    range.selectNode(node);
    rangy.getSelection().setSingleRange(range);
}

/**
 * Move selection to the start or end of element.
 *
 * @param  {jQuerySelector|jQuery|Element} element The subject element.
 * @param  {RangySelection|null} selection A RangySelection, or null to use the current selection.
 * @param {Boolean} start True to select the start of the element.
 */
function selectionSelectEdge(element, selection, start) {
    selection = selection || rangy.getSelection();
    selection.removeAllRanges();

    $(element).each(function() {
        var range = rangy.createRange();
        range.selectNodeContents(this);
        range.collapse(start);
        selection.addRange(range);
    });
}

/**
 * Move selection to the end of element.
 *
 * @param  {jQuerySelector|jQuery|Element} element The subject element.
 * @param  {RangySelection|null} selection A RangySelection, or null to use the current selection.
 */
function selectionSelectEnd(element, selection) {
    selectionSelectEdge(element, selection, false);
}

/**
 * Move selection to the start of element.
 *
 * @param  {jQuerySelector|jQuery|Element} element The subject element.
 * @param  {RangySelection|null} selection A RangySelection, or null to use the current selection.
 */
function selectionSelectStart(element, selection) {
    selectionSelectEdge(element, selection, true);
}

/**
 * Extend selection to the end of element.
 *
 * @param  {Element} element
 * @param  {RangySelection|null} selection
 */
function selectionSelectToEndOfElement(element, selection) {
    // <strict>
    if (!typeIsElement(element)) {
        handleInvalidArgumentError('Parameter 1 to selectionSelectToEndOfElement is expected to be Element', element);
        return;
    }
    // </strict>
    selection = selection || rangy.getSelection();
    var range = selectionRange();
    selection.removeAllRanges();
    range.setEndAfter(element.get(0));
    selection.addRange(range);
}

/**
 * Gets the HTML from a selection. If no selection is supplied then current selection will be used.
 *
 * @param  {RangySelection|null} selection Selection to get html from or null to use current selection.
 * @return {string} The html content of the selection.
 */
function selectionGetHtml(selection) {
    selection = selection || rangy.getSelection();
    return selection.toHtml();
}

/**
 * Gets the closest common ancestor container to the given or current selection that isn't a text node.
 * @todo check please
 *
 * @param {RangySelection} range The selection to get the element from.
 * @returns {jQuery} The common ancestor container that isn't a text node.
 */
function selectionGetElement(range, selection) {
    selection = selection || rangy.getSelection();
    if (!selectionExists()) {
        return new jQuery;
    }
    var range = selectionRange(),
        commonAncestor;
    // Check if the common ancestor container is a text node
    if (range.commonAncestorContainer.nodeType === Node.TEXT_NODE) {
        // Use the parent instead
        commonAncestor = range.commonAncestorContainer.parentNode;
    } else {
        commonAncestor = range.commonAncestorContainer;
    }
    return $(commonAncestor);
}

/**
 * Gets all elements within and including the selection's common ancestor that contain a selection (excluding text nodes) and
 * returns them as a jQuery array.
 *
 * @public @static
 * @param {RangySelection|null} A RangySelection, or by default, the current selection.
 */
function selectionGetElements(selection) {
    var result = new jQuery();
    selectionEachRange(function(range) {
        result.push(selectionGetElement(range)[0]);
    }, selection, this);
    return result;
}

/**
 * Gets the start element of a selection.
 * @todo check the type of the return...i guessed and i have a feeling i might be wrong.
 * @returns {jQuery|Object} If the anchor node is a text node then the parent of the anchor node is returned, otherwise the anchor node is returned.
 */
function selectionGetStartElement() {
    var selection = rangy.getSelection();
    if (selection.anchorNode === null) {
        return null;
    }
    if (selection.isBackwards()) {
        return selection.focusNode.nodeType === Node.TEXT_NODE ? $(selection.focusNode.parentElement) : $(selection.focusNode);
    }
    if (!selection.anchorNode) console.trace();
    return selection.anchorNode.nodeType === Node.TEXT_NODE ? $(selection.anchorNode.parentElement) : $(selection.anchorNode);
}

/**
 * Gets the end element of the selection.
 * @returns {jQuery|Object} If the focus node is a text node then the parent of the focus node is returned, otherwise the focus node is returned.
 */
function selectionGetEndElement() {
    var selection = rangy.getSelection();
    if (selection.anchorNode === null) {
        return null;
    }
    if (selection.isBackwards()) {
        return selection.anchorNode.nodeType === Node.TEXT_NODE ? $(selection.anchorNode.parentElement) : $(selection.anchorNode);
    }
    return selection.focusNode.nodeType === Node.TEXT_NODE ? $(selection.focusNode.parentElement) : $(selection.focusNode);
}

/**
 * Checks to see if the selection is at the end of the element.
 *
 * @returns {Boolean} True if the node immediately after the selection ends does not exist or is empty,
 *                      false if the whole nodes' text is not selected or it doesn't fit the criteria for the true clause.
 */
function selectionAtEndOfElement() {
    var selection = rangy.getSelection();
    var focusNode = selection.isBackwards() ? selection.anchorNode : selection.focusNode;
    var focusOffset = selection.isBackwards() ? selection.focusOffset : selection.anchorOffset;
    if (focusOffset !== focusNode.textContent.length) {
        return false;
    }
    var previous = focusNode.nextSibling;
    if (!previous || $(previous).html() === '') {
        return true;
    } else {
        return false;
    }
}

/**
 * Checks to see if the selection is at the start of the element.
 *
 * @returns {Boolean} True if the node immediately before the selection starts does not exist or is empty,
 *                      false if the whole nodes' text is not selected or it doesn't fit the criteria for the true clause.
 */
function selectionAtStartOfElement() {
    var selection = rangy.getSelection();
    var anchorNode = selection.isBackwards() ? selection.focusNode : selection.anchorNode;
    if (selection.isBackwards() ? selection.focusOffset : selection.anchorOffset !== 0) {
        return false;
    }
    var previous = anchorNode.previousSibling;
    if (!previous || $(previous).html() === '') {
        return true;
    } else {
        return false;
    }
}

/**
 * Checks to see if the selection is empty.
 * @returns {Boolean} Returns true if the selection is empty.
 */
function selectionIsEmpty() {
    return rangy.getSelection().toHtml() === '';
}

/**
 * FIXME: this function needs reviewing.
 *
 * This should toggle an inline style, and normalise any overlapping tags, or adjacent (ignoring white space) tags.
 * @todo apparently this needs fixing and i'm not sure what it returns.
 * @public @static
 *
 * @param {String} tag This is the tag to be toggled.
 * @param {Array} options These are any additional properties to add to the element.
 * @returns {selectionToggleWrapper}
 */
function selectionToggleWrapper(tag, options) {
    options = options || {};
    var applier = rangy.createCssClassApplier(options.classes || '', {
        normalize: true,
        elementTagName: tag,
        elementProperties: options.attributes || {}
    });
    selectionEachRange(function(range) {
        if (rangeEmptyTag(range)) {
            var element = $('<' + tag + '/>')
                .addClass(options.classes)
                .attr(options.attributes || {})
                .append(fragmentToHtml(range.cloneContents()));
            rangeReplace(range, element[0]);
        } else {
            applier.toggleRange(range);
        }
    }, null, this);
}

/**
 * @todo method description and check types
 *
 * @param {String} tag The tag for the selection to be wrapped in.
 * @param {String} attributes The attributes to be added to the selection.
 * @param {String} classes The classes to be added to the selection
 */
function selectionWrapTagWithAttribute(tag, attributes, classes) {
    selectionEachRange(function(range) {
        var element = selectionGetElement(range);
        if (element.is(tag)) {
            element.attr(attributes);
        } else {
            selectionToggleWrapper(tag, {
                classes: classes,
                attributes: attributes
            });
        }
    }, null, this);
}

/**
 * Check if there is a current selection.
 *
 * @public @static
 * @returns {Boolean} Returns true if there is at least one range selected.
 */
function selectionExists() {
    return rangy.getSelection().rangeCount !== 0;
}

/**
 * Gets the first range in the current selection. In strict mode if no selection
 * exists an error occurs.
 *
 * @public @static
 * @returns {RangyRange} Returns true if there is at least one range selected.
 */
function selectionRange() {
    // <strict>
    if (!selectionExists()) {
        handleError('Tried to get selection range when there is no selection');
    }
    // </strict>
    return rangy.getSelection().getRangeAt(0);
}

/**
 * Split the selection container and insert the given html between the two elements created.
 * @param  {jQuery|Element|string} html The html to replace selection with.
 * @param  {RangySelection|null} selection The selection to replace, or null for the current selection.
 * @returns {Object} The selection container with it's new content added.
 */
function selectionReplaceSplittingSelectedElement(html, selection) {
    selection = selection || rangy.getSelection();

    var selectionRange = selectionRange();
    var selectedElement = selectionGetElements()[0];

    // Select from start of selected element to start of selection
    var startRange = rangy.createRange();
    startRange.setStartBefore(selectedElement);
    startRange.setEnd(selectionRange.startContainer, selectionRange.startOffset);
    var startFragment = startRange.cloneContents();

    // Select from end of selected element to end of selection
    var endRange = rangy.createRange();
    endRange.setStart(selectionRange.endContainer, selectionRange.endOffset);
    endRange.setEndAfter(selectedElement);
    var endFragment = endRange.cloneContents();

    // Replace the start element's html with the content that was not selected, append html & end element's html
    var replacement = elementOuterHtml($(fragmentToHtml(startFragment)));
    replacement += elementOuterHtml($(html).attr('data-replacement', true));
    replacement += elementOuterHtml($(fragmentToHtml(endFragment)));

    replacement = $(replacement);

    $(selectedElement).replaceWith(replacement);
    return replacement.parent().find('[data-replacement]').removeAttr('data-replacement');
}

/**
 * Replace current selection with given html, ensuring that selection container is split at
 * the start & end of the selection in cases where the selection starts / ends within an invalid element.
 *
 * @param  {jQuery|Element|string} html The html to replace current selection with.
 * @param  {Array} validTagNames An array of tag names for tags that the given html may be inserted into without having the selection container split.
 * @param  {RangySeleciton|null} selection The selection to replace, or null for the current selection.
 * @returns {Object} The replaced selection if everything is valid or the selection container with it's new content added.
 */
function selectionReplaceWithinValidTags(html, validTagNames, selection) {
    selection = selection || rangy.getSelection();

    if (!selectionExists()) {
        return;
    }

    var startElement = selectionGetStartElement()[0];
    var endElement = selectionGetEndElement()[0];
    var selectedElement = selectionGetElements()[0];

    var selectedElementValid = elementIsValid(selectedElement, validTagNames);
    var startElementValid = elementIsValid(startElement, validTagNames);
    var endElementValid = elementIsValid(endElement, validTagNames);

    // The html may be inserted within the selected element & selection start / end.
    if (selectedElementValid && startElementValid && endElementValid) {
        return selectionReplace(html);
    }

    // Context is invalid. Split containing element and insert list in between.
    return selectionReplaceSplittingSelectedElement(html, selection);
}

/**
 * Toggles style(s) on the first block level parent element of each range in a selection
 *
 * @public @static
 * @param {Object} styles styles to apply
 * @param {jQuerySelector|jQuery|Element} limit The parent limit element.
 * If there is no block level elements before the limit, then the limit content
 * element will be wrapped with a "div"
 */
function selectionToggleBlockStyle(styles, limit) {
    selectionEachRange(function(range) {
        var parent = $(range.commonAncestorContainer);
        while (parent.length && parent[0] !== limit[0] && (
                parent[0].nodeType === Node.TEXT_NODE || parent.css('display') === 'inline')) {
            parent = parent.parent();
        }
        if (parent[0] === limit[0]) {
            // Only apply block style if the limit element is a block
            if (limit.css('display') !== 'inline') {
                // Wrap the HTML inside the limit element
                elementWrapInner(limit, 'div');
                // Set the parent to the wrapper
                parent = limit.children().first();
            }
        }
        // Apply the style to the parent
        elementToggleStyle(parent, styles);
    }, null, this);
}

/**
 * Iterates throught each block in the selection and calls the callback function.
 *
 * @todo revise blockContainer parameter!
 * @param {function} callback The function to be called on each block in the selection.
 * @param {jQuery} limitElement The element to stop searching for block elements at.
 * @param {undefined|Sring} blockContainer Thia parameter is unused for some reason.
 */
function selectionEachBlock(callback, limitElement, blockContainer) {
    // <strict>
    if (!$.isFunction(callback)) {
        handleInvalidArgumentError('Paramter 1 to selectionEachBlock is expected to be a function', callback);
        return;
    }
    if (!(limitElement instanceof jQuery)) {
        handleInvalidArgumentError('Paramter 2 to selectionEachBlock is expected a jQuery element', limitElement);
        return;
    }
    if (typeof blockContainer !== 'undefined' && typeof blockContainer !== 'string') {
        handleInvalidArgumentError('Paramter 3 to selectionEachBlock is expected be undefined or a string', blockContainer);
        return;
    }
    // </strict>
    selectionEachRange(function(range) {
        // Loop range parents until a block element is found, or the limit element is reached
        var startBlock = elementClosestBlock($(range.startContainer), limitElement),
            endBlock = elementClosestBlock($(range.endContainer), limitElement),
            blocks;
        if (!startBlock || !endBlock) {
            // Wrap the HTML inside the limit element
            callback(elementWrapInner(limitElement, blockContainer).get(0));
        } else {
            if (startBlock.is(endBlock)) {
                blocks = startBlock;
            } else if (startBlock && endBlock) {
                blocks = startBlock.nextUntil(endBlock).andSelf().add(endBlock);
            }
            for (var i = 0, l = blocks.length; i < l; i++) {
                callback(blocks[i]);
            }
        }
    });
}

/**
 * Add or removes a set of classes to the closest block elements in a selection.
 * If the `limitElement` is closer than a block element, then a new
 * `blockContainer` element wrapped around the selection.
 *
 * If any block in the selected text has not got the class applied to it, then
 * the class will be applied to all blocks.
 *
 * @todo revise blockContainer parameter!
 * @param {string[]} addClasses This is a set of classes to be added.
 * @param {string[]} removeClasses This is a set of classes to be removed.
 * @param {jQuery} limitElement The element to stop searching for block elements at.
 * @param {undefined|String} blockContainer Thia parameter is unused for some reason.
 */
function selectionToggleBlockClasses(addClasses, removeClasses, limitElement, blockContainer) {
    // <strict>
    if (!$.isArray(addClasses)) {
        handleInvalidArgumentError('Paramter 1 to selectionToggleBlockClasses is expected to be an array of classes', addClasses);
        return;
    }
    if (!$.isArray(removeClasses)) {
        handleInvalidArgumentError('Paramter 2 to selectionToggleBlockClasses is expected to be an array of classes', removeClasses);
        return;
    }
    if (!(limitElement instanceof jQuery)) {
        handleInvalidArgumentError('Paramter 3 to selectionToggleBlockClasses is expected a jQuery element', limitElement);
        return;
    }
    if (typeof blockContainer !== 'undefined' && typeof blockContainer !== 'string') {
        handleInvalidArgumentError('Paramter 4 to selectionToggleBlockClasses is expected be undefined or a string', blockContainer);
        return;
    }
    // </strict>

    var apply = false,
        blocks = new jQuery();

    selectionEachBlock(function(block) {
        blocks.push(block);
        if (!apply) {
            for (var i = 0, l = addClasses.length; i < l; i++) {
                if (!$(block).hasClass(addClasses[i])) {
                    apply = true;
                }
            }
        }
    }, limitElement, blockContainer);

    $(blocks).removeClass(removeClasses.join(' '));
    if (apply) {
        $(blocks).addClass(addClasses.join(' '));
    } else {
        $(blocks).removeClass(addClasses.join(' '));
    }
}

/**
 * Removes all ranges from a selection that are not contained within the
 * supplied element.
 *
 * @public @static
 * @param {jQuerySelector|jQuery|Element} element The element to exclude the removal of ranges.
 * @param {RangySelection} [selection] The selection from which to remove the ranges.
 */
function selectionConstrain(node, selection) {
    // <strict>
    if (!typeIsNode(node)) {
        handleInvalidArgumentError('Parameter 1 to selectionConstrain must be a node', node);
        return;
    }
    // </strict>
    selection = selection || rangy.getSelection();
    var ranges = selection.getAllRanges(),
        newRanges = [];
    for (var i = 0, l = ranges.length; i < l; i++) {
        var newRange = ranges[i].cloneRange();
        if (ranges[i].startContainer !== node &&
                !nodeIsChildOf(ranges[i].startContainer, node)) {
            newRange.setStart(node, 0);
        }
        if (ranges[i].endContainer !== node &&
                !nodeIsChildOf(ranges[i].endContainer, node)) {
            newRange.setEnd(node, node.childNodes.length);
        }
        newRanges.push(newRange);
    }
    selection.setRanges(newRanges);
}

/**
 * Clears the formatting on a supplied selection.
 *
 * @param {Node} limitNode The containing element.
 * @param {RangySelection} [selection] The selection to have it's formatting cleared.
 */
function selectionClearFormatting(limitNode, selection) {
    // <strict>
    if (limitNode && !typeIsNode(limitNode)) {
        handleInvalidArgumentError('Parameter 1 to selectionClearFormatting must be a node', limitNode);
        return;
    }
    // </strict>

    limitNode = limitNode || document.body;
    selection = selection || rangy.getSelection();
    if (selectionExists()) {
        // Create a copy of the selection range to work with
        var range = selectionRange().cloneRange();

        // Get the selected content
        var content = range.extractContents();

        // Expand the range to the parent if there is no selected content
        // and the range's ancestor is not the limitNode
        if (fragmentToHtml(content) === '') {
            rangeSelectElementContent(range, range.commonAncestorContainer);
            selection.setSingleRange(range);
            content = range.extractContents();
        }

        content = $('<div/>').append(fragmentToHtml(content)).html().replace(/(<\/?.*?>)/gi, function(match) {
            if (match.match(/^<(img|object|param|embed|iframe)/) !== null) {
                return match;
            }
            return '';
        });

        // Get the containing element
        var parent = range.commonAncestorContainer;
        while (parent && parent.parentNode !== limitNode) {
            parent = parent.parentNode;
        }

        if (parent) {
            // Place the end of the range after the paragraph
            range.setEndAfter(parent);

            // Extract the contents of the paragraph after the caret into a fragment
            var contentAfterRangeStart = range.extractContents();

            // Collapse the range immediately after the paragraph
            range.collapseAfter(parent);

            // Insert the content
            range.insertNode(contentAfterRangeStart);

            // Move the caret to the insertion point
            range.collapseAfter(parent);
        }
        content = $.parseHTML(content);
        if (content !== null) {
            $(content.reverse()).each(function() {
                if ($(this).is('img')) {
                    range.insertNode($(this).removeAttr('width height class style').get(0));
                    return;
                }
                range.insertNode(this);
            });
        }
    }
}

/**
 * Replaces specified tags and classes on a selection.
 *
 * @todo check descriptions and types please
 * @param {String} tag1 This is the tag to appear on the selection at the end of the method.
 * @param {jQuery} class1 This is the class to appear on the selection at the end of the method.
 * @param {String} tag2 This is the current tag on the selection, which is to be replaced.
 * @param {jQuery} class2 This is the current class on the selection, which is to be replaced.
 */
function selectionInverseWrapWithTagClass(tag1, class1, tag2, class2) {
    selectionSave();
    // Assign a temporary tag name (to fool rangy)
    var id = 'domTools' + Math.ceil(Math.random() * 10000000);

    selectionEachRange(function(range) {
        var applier2 = rangy.createCssClassApplier(class2, {
            elementTagName: tag2
        });

        // Check if tag 2 is applied to range
        if (applier2.isAppliedToRange(range)) {
            // Remove tag 2 to range
            applier2.toggleSelection();
        } else {
            // Apply tag 1 to range
            rangy.createCssClassApplier(class1, {
                elementTagName: id
            }).toggleSelection();
        }
    }, null, this);

    // Replace the temporary tag with the correct tag
    $(id).each(function() {
        $(this).replaceWith($('<' + tag1 + '/>').addClass(class1).html($(this).html()));
    });

    selectionRestore();
}

/**
 * Expands the user selection to encase a whole word.
 */
function selectionExpandToWord() {
    var selection = window.getSelection(),
        range = selection.getRangeAt(0);
    if (!range ||
            range.startContainer !== range.endContainer ||
            range.startOffset !== range.endOffset) {
        return;
    }
    var start = range.startOffset,
        end = range.startOffset;
    while (range.startContainer.data[start - 1] &&
            !range.startContainer.data[start - 1].match(/\s/)) {
        start--;
    }
    while (range.startContainer.data[end] &&
            !range.startContainer.data[end].match(/\s/)) {
        end++;
    }
    range.setStart(range.startContainer, start);
    range.setEnd(range.startContainer, end);
    selection.removeAllRanges();
    selection.addRange(range);
}

/**
 * Expands the user selection to contain the supplied selector, stopping at the specified limit element.
 *
 * @param {jQuerySelector} selector The selector to expand the selection to.
 * @param {jQuerySelector} limit The element to stop at.
 * @param {boolean} outer If true, then the outer most matched element (by the
 *   selector) is wrapped. Otherwise the first matched element is wrapped.
 */
function selectionExpandTo(selector, limit, outer) {
    var ranges = rangy.getSelection().getAllRanges();
    for (var i = 0, l = ranges.length; i < l; i++) {
        // Start container
        var element = $(nodeFindParent(ranges[i].startContainer));
        if (outer || (!element.is(selector) && !element.is(limit))) {
            element = element.parentsUntil(limit, selector);
        }
        if (outer) {
            element = element.last();
        } else {
            element = element.first();
        }
        if (element.length === 1 && !element.is(limit)) {
            ranges[i].setStart(element[0], 0);
        }

        // End container
        element = $(nodeFindParent(ranges[i].endContainer));
        if (outer || (!element.is(selector) && !element.is(limit))) {
            element = element.parentsUntil(limit, selector);
        }
        if (outer) {
            element = element.last();
        } else {
            element = element.first();
        }
        if (element.length === 1 && !element.is(limit)) {
            ranges[i].setEnd(element[0], element[0].childNodes.length);
        }
    }
    rangy.getSelection().setRanges(ranges);
}

/**
 * Trims an entire selection as per rangeTrim.
 *
 * @see rangeTrim
 */
function selectionTrim() {
    if (selectionExists()) {
        var range = selectionRange();
        rangeTrim(range);
        selectionSet(range);
    }
}

/**
 * Finds the inner elements and the wrapping tags for a selector.
 *
 * @param {string} selector A jQuery selector to match the wrapping/inner element against.
 * @param {jQuery} limitElement The element to stop searching at.
 * @returns {jQuery}
 */
function selectionFindWrappingAndInnerElements(selector, limitElement) {
    var result = new jQuery();
    selectionEachRange(function(range) {
        var startNode = range.startContainer;
        while (startNode.nodeType === Node.TEXT_NODE) {
            startNode = startNode.parentNode;
        }

        var endNode = range.endContainer;
        while (endNode.nodeType === Node.TEXT_NODE) {
            endNode = endNode.parentNode;
        }

        var filter = function() {
            if (!limitElement.is(this)) {
                result.push(this);
            }
        };

        do {
            $(startNode).filter(selector).each(filter);

            if (!limitElement.is(startNode) && result.length === 0) {
                $(startNode).parentsUntil(limitElement, selector).each(filter);
            }

            $(startNode).find(selector).each(filter);

            if ($(endNode).is(startNode)) {
                break;
            }

            startNode = $(startNode).next();
        } while (startNode.length > 0 && $(startNode).prevAll().has(endNode).length === 0);
    });
    return result;
}

/**
 * Changes the tags on a selection.
 *
 * @param {String} changeTo The tag to be changed to.
 * @param {String} changeFrom The tag to be changed from.
 * @param {jQuery} limitElement The element to stop changing the tags at.
 */
function selectionChangeTags(changeTo, changeFrom, limitElement) {
    var elements = selectionFindWrappingAndInnerElements(changeFrom.join(','), limitElement);
    if (elements.length) {
        selectionSave();
        elementChangeTag(elements, changeTo);
        selectionRestore();
    } else {
        var limitNode = limitElement.get(0);
        if (limitNode.innerHTML.trim()) {
            selectionSave();
            limitNode.innerHTML = '<' + changeTo + '>' + limitNode.innerHTML + '</' + changeTo + '>';
            selectionRestore();
        } else {
            limitNode.innerHTML = '<' + changeTo + '>&nbsp;</' + changeTo + '>';
            selectionSelectInner(limitNode.childNodes[0]);
        }
    }
}

/**
 * Checks that the selecton only contains valid children.
 *
 * @param {String} selector A string containing a selector expression to match the current set of elements against.
 * @param {jQuery} limit The element to stop changing the tags at.
 * @returns {Boolean} True if the selection contains valid children.
 */
function selectionContains(selector, limit) {
    var result = true;
    selectionEachRange(function(range) {
        // Check if selection only contains valid children
        var children = $(range.commonAncestorContainer).find('*');
        if ($(range.commonAncestorContainer).parentsUntil(limit, selector).length === 0 &&
                (children.length === 0 || children.length !== children.filter(selector).length)) {
            result = false;
        }
    });
    return result;
}

function selectionDelete(selection) {
    selection = selection || rangy.getSelection();
    selection.deleteFromDocument();
}
