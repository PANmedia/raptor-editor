/**
 * @fileOverview Cleaning helper functions.
 * @license http://www.raptor-editor.com/license
 *
 * @author David Neilsen - david@panmedia.co.nz
 * @author Michael Robinson - michael@panmedia.co.nz
 */

/**
 * Replaces elements in another elements. E.g.
 *
 * @example
 * cleanReplaceElements('.content', {
 *     'b': '<strong/>',
 *     'i': '<em/>',
 * });
 *
 * @param  {jQuery|Element|Selector} selector The element to be find and replace in.
 * @param  {Object} replacements A map of selectors to replacements. The replacement
 *   can be a jQuery object, an element, or a selector.
 */
function cleanReplaceElements(selector, replacements) {
    for (var find in replacements) {
        var replace = replacements[find];
        var i = 0;
        var found = false;
        do {
            found = $(selector).find(find);
            if (found.length) {
                found = $(found.get(0));
                var clone = $(replace).clone();
                clone.html(found.html());
                clone.attr(elementGetAttributes(found));
                found.replaceWith(clone);
            }
        } while(found.length);
    }
}

/**
 * Unwrap function. Currently just wraps jQuery.unwrap() but may be extended in future.
 *
 * @param  {jQuery|Element|Selector} selector The element to unwrap.
 */
function cleanUnwrapElements(selector) {
    $(selector).unwrap();
}

/**
 * Takes a supplied element and removes all of the empty attributes from it.
 *
 * @param {jQuery} element This is the element to remove all the empty attributes from.
 * @param {array} attributes This is an array of the elements attributes.
 */
function cleanEmptyAttributes(element, attributes) {
    // <strict>
    if (!typeIsElement(element)) {
        handleInvalidArgumentError('Paramter 1 to cleanEmptyAttributes is expected a jQuery element');
        return;
    }
    // </strict>

    for (i = 0; i < attributes.length; i++) {
        if (!$.trim(element.attr(attributes[i]))) {
            element.removeAttr(attributes[i]);
        }
        element
            .find('[' + attributes[i] + ']')
            .filter(function() {
                return $.trim($(this).attr(attributes[i])) === '';
            }).removeAttr(attributes[i]);
    }
}


/**
 * Remove comments from element.
 *
 * @param  {jQuery} parent The jQuery element to have comments removed from.
 * @return {jQuery} The modified parent.
 */
function cleanRemoveComments(parent) {
    // <strict>
    if (!typeIsElement(parent)) {
        handleInvalidArgumentError('Paramter 1 to cleanRemoveComments is expected a jQuery element');
        return;
    }
    // </strict>

    parent.contents().each(function() {
        if (this.nodeType == Node.COMMENT_NODE) {
            $(this).remove();
        }
    });
    parent.children().each(function() {
        cleanRemoveComments($(this));
    });
    return parent;
}


/**
 * Removed empty elements whose tag name matches the list of supplied tags.
 *
 * @param  {jQuery} parent The jQuery element to have empty element removed from.
 * @param  {String[]} tags The list of tags to clean.
 * @return {jQuery} The modified parent.
 */
function cleanEmptyElements(parent, tags) {
    // <strict>
    if (!typeIsElement(parent)) {
        handleInvalidArgumentError('Paramter 1 to cleanEmptyElements is expected a jQuery element');
        return;
    }
    // </strict>
    var found;
    // Need to loop incase removing an empty element, leaves another one.
    do {
        found = false;
        parent.find(tags.join(',')).each(function() {
            if ($.trim($(this).html()) === '') {
                $(this).remove();
                found = true;
            }
        });
    } while (found);
    return parent;
}

/**
 * Wraps any text nodes in the element with the supplied tag. This does not scan child elements.
 *
 * @param  {jQuery} element The jQuery element to scan for text ndoes.
 * @param  {String} tag The tag to use from wrapping the text nodes.
 */
function cleanWrapTextNodes(node, tag) {
    // <strict>
    if (!typeIsNode(node)) {
        handleInvalidArgumentError('Paramter 1 to cleanWrapTextNodes is expected a node.');
        return;
    }
    // </strict>

    var textNodes = elementFindTextNodes(node);
    for (var i = 0, l = textNodes.length; i < l; i++) {
        var clone = textNodes[i].cloneNode(),
            wrapper = document.createElement(tag);
        wrapper.appendChild(clone);
        node.insertBefore(wrapper, textNodes[i]);
        node.removeChild(textNodes[i]);
    }
}

function elementFindTextNodes(node) {
    var textNodes = [], whitespace = /^\s*$/;
    for (var i = 0, l = node.childNodes.length; i < l; i++) {
        if (node.childNodes[i].nodeType == 3) {
            if (!whitespace.test(node.childNodes[i].nodeValue)) {
                textNodes.push(node.childNodes[i]);
            }
        }
    }
    return textNodes;
}
