/**
 * @fileOverview DOM fragment manipulation helper functions
 * @license http://www.raptor-editor.com/license
 *
 * @author David Neilsen david@panmedia.co.nz
 * @author Michael Robinson michael@panmedia.co.nz
 */

/**
 * Convert a DOMFragment to an HTML string. Optionally wraps the string in a tag.
 * @todo type for domFragment and tag.
 * @param {type} domFragment The fragment to be converted to a HTML string.
 * @param {type} tag The tag that the string may be wrapped in.
 * @returns {String} The DOMFragment as a string, optionally wrapped in a tag.
 */
function fragmentToHtml(domFragment, tag) {
    var html = '';
    // Get all nodes in the extracted content
    for (var j = 0, l = domFragment.childNodes.length; j < l; j++) {
        var node = domFragment.childNodes.item(j);
        var content = node.nodeType === Node.TEXT_NODE ? node.nodeValue : elementOuterHtml($(node));
        if (content) {
            html += content;
        }
    }
    if (tag) {
        html = $('<' + tag + '>' + html + '</' + tag + '>');
        html.find('p').wrapInner('<' + tag + '/>');
        html.find('p > *').unwrap();
        html = $('<div/>').html(html).html();
    }
    return html;
}

/**
 * Insert a DOMFragment before an element and wraps them both in a tag.
 *
 * @public @static
 * @param {DOMFragment} domFragment This is the DOMFragment to be inserted.
 * @param {jQuerySelector|jQuery|Element} beforeElement This is the element the DOMFragment is to be inserted before.
 * @param {String} wrapperTag This is the tag to wrap the domFragment and the beforeElement in.
 */
function fragmentInsertBefore(domFragment, beforeElement, wrapperTag) {
    // Get all nodes in the extracted content
    for (var j = 0, l = domFragment.childNodes.length; j < l; j++) {
        var node = domFragment.childNodes.item(j);
        // Prepend the node before the current node
        var content = node.nodeType === Node.TEXT_NODE ? node.nodeValue : $(node).html();
        if (content) {
            $('<' + wrapperTag + '/>')
                .html($.trim(content))
                .insertBefore(beforeElement);
        }
    }
}
