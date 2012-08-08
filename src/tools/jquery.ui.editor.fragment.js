/**
 * @fileOverview DOM fragment manipulation helper functions
 * @author David Neilsen david@panmedia.co.nz
 * @author Michael Robinson michael@panmedia.co.nz
 */

/**
 * Convert a DOMFragment to an HTML string. Optinally wraps the tring in a tag.
 *
 */
function fragmentToHtml(domFragment, tag) {
    var html = '';
    // Get all nodes in the extracted content
    for (var j = 0, l = domFragment.childNodes.length; j < l; j++) {
        var node = domFragment.childNodes.item(j);
        var content = node.nodeType === 3 ? node.nodeValue : elementOuterHtml($(node));
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
 *
 *
 * @public @static
 * @param {DOMFragment} domFragment
 * @param {jQuerySelector|jQuery|Element} beforeElement
 * @param {String} wrapperTag
 */
function fragmentInsertBefore(domFragment, beforeElement, wrapperTag) {
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
}