/**
 * @fileOverview Find node parent helper function.
 * @license http://www.raptor-editor.com/license
 *
 * @author David Neilsen david@panmedia.co.nz
 * @author Michael Robinson michael@panmedia.co.nz
 */


/**
 * Find the first parent of a node that is not a text node.
 *
 * @param {Node} node
 * @returns {Node}
 */
function nodeFindParent(node) {
    while (node.nodeType === Node.TEXT_NODE) {
        node = node.parentNode;
    }
    return node;
}

function nodeFindTextNodes(node) {
    var textNodes = [], whitespace = /^\s*$/;
    for (var i = 0, l = node.childNodes.length; i < l; i++) {
        if (node.childNodes[i].nodeType == Node.TEXT_NODE) {
            if (!whitespace.test(node.childNodes[i].nodeValue)) {
                textNodes.push(node.childNodes[i]);
            }
        }
    }
    return textNodes;
}

function nodeIsChildOf(child, parent) {
     var node = child.parentNode;
     while (node != null) {
         if (node == parent) {
             return true;
         }
         node = node.parentNode;
     }
     return false;
}
