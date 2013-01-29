/**
 * @fileOverview List manipulation helper functions.
 * @author David Neilsen david@panmedia.co.nz
 * @author Michael Robinson michael@panmedia.co.nz
 */

/**
 * Checks whether the selection is fully encased by ul or ol tags, if it is then unwrap the parent ul/ol.
 * @todo can't work out what wrapper is.
 * @param {String} listType This is the type of list to check the selection against.
 * @param {Object} listItem This is the list item to use as the selection.
 * @param {Array} wrapper An array of something i can't work out.
 */
function listToggle(listType, listItem, wrapper) {
    // Check whether selection is fully contained by a ul/ol. If so, unwrap parent ul/ol
    var selectedElements = $(selectionGetElements());
    if ($(selectionGetElements()).is(listItem)
        && $(selectionGetElements()).parent().is(listType)) {
        listWrapSelection(listType, listItem, wrapper);
    }

    if (selectedElements.is(listType)) {
        return listUnwrapSelection(listType, listItem, wrapper);
    }

    listWrapSelection(listType, listItem, wrapper);
}

/**
 * @return {string[]} Tags allowed within an li.
 */
var listValidLiChildren = [
    'a', 'abbr','acronym', 'applet', 'b', 'basefont', 'bdo', 'big', 'br', 'button',
    'cite', 'code', 'dfn', 'em', 'font', 'i', 'iframe', 'img', 'input', 'kbd',
    'label', 'map', 'object', 'p', 'q', 's',  'samp', 'select', 'small', 'span',
    'strike', 'strong', 'sub', 'sup', 'textarea', 'tt', 'u', 'var'
];

/**
 * @var {string][]} Tags ol & ul are allowed within.
 */
var listValidUlOlParents =  [
    'blockquote', 'body', 'button', 'center', 'dd', 'div', 'fieldset', 'form',
    'iframe', 'li', 'noframes', 'noscript', 'object', 'td', 'th'
];

/**
 * @return {string][]} Tags blockquote is allowed within.
 */
var listValidBlockQuoteParents = [
    'body', 'center', 'dd', 'div', 'dt', 'fieldset', 'form', 'iframe', 'li', 'td', 'th'
];

 var listValidPChildren = [
    'a', 'abbr', 'acronym', 'applet', 'b', 'basefont', 'bdo', 'big', 'br',
    'button', 'cite', 'code', 'dfn', 'em', 'font', 'i', 'iframe', 'img',
    'input', 'kbd', 'label', 'map', 'object', 'q', 's', 'samp', 'script',
    'select', 'small', 'span', 'strike', 'strong', 'sub', 'sup', 'textarea',
    'u'
];

var listValidPParents = [
    'address', 'blockquote', 'body', 'button', 'center', 'dd', 'div', 'fieldset',
    'form', 'iframe', 'li', 'noframes', 'noscript', 'object', 'td', 'th'
];

/**
 * Convert tags invalid within the context of listItem.
 *
 * @param  {Element} list
 * @param  {string} listItem
 * @param  {string[]} validChildren
 */
function listEnforceValidChildren(list, listItem, validChildren) {
    // <strict>
    if (!typeIsElement(list)) {
        handleError('Parameter 1 for listEnforceValidChildren must be a jQuery element');
    }
    // </strict>
    list.find(listItem + ' *').each(function() {
        if (!typeIsTextNode(this)) {
            if (!elementIsValid(this, listValidLiChildren)) {
                elementChangeTag($(this), 'p');
            }
        }
    });
}

/**
 * Wraps the selected element(s) in list tags.
 *
 * @todo not sure what wrapper is.
 * @param {String} listType The type of list that the selection is to be transformed into.
 * @param {String} listItem The list item to be used in creating the list.
 * @param {Array} wrapper An array of something i can't work out.
 */
function listWrapSelection(listType, listItem, wrapper) {
    var range = rangy.getSelection().getRangeAt(0);
    if (rangeIsEmpty(range)) {
        range.selectNode(elementClosestBlock($(range.commonAncestorContainer), wrapper).get(0));
    }
    var contents = fragmentToHtml(range.extractContents());
    if (!$(contents).is(listItem)) {
        contents = '<' + listItem + '>' + contents + '</' + listItem + '>';
    }
    var validParents = listType === 'blockquote' ? listValidLiParents : listValidBlockQuoteParents;
    var replacementHtml = '<' + listType + '>' + contents + '</' + listType + '>';
    var replacement = rangeReplaceWithinValidTags(range, replacementHtml, wrapper, validParents);

    listEnforceValidChildren($(replacement), listItem, listValidLiChildren);

    selectionSelectInner($(replacement).get(0));
}

function listConvertListItem(listItem, tag, validTagChildren) {
    // <strict>
    if (!typeIsElement(listItem)) {
        handleError('Parameter 1 of listUnwrapListItem must be a jQuery element');
    }
    // </strict>

    var listItemChildren = listItem.children();

    if (listItemChildren.length) {
        listItemChildren.each(function() {
            if (!elementIsBlock(this)) {
                elementChangeTag(this, tag);
            }
        });
        return listItem.html();
    } else {
        return elementChangeTag(listItem, tag);
    }
}

function listUnwrap(list, listItem) {
    list.find(listItem).each(function() {
        $(this).replaceWith(listConvertListItem($(this), 'p', listValidPChildren));
    });
    list.contents().unwrap();
}

/**
 * Unwraps the selected list item(s) and puts it into <p> tags.
 *
 * @param {Object} listItem
 */
function listUnwrapSelection(listType, listItem, wrapper) {
    var range = rangy.getSelection().getRangeAt(0);
    if (rangeIsEmpty(range)) {
        range = rangeExpandTo(range, [listItem]);
    }

    var commonAncestor = $(rangeGetCommonAncestor(range));

    /**
     * {<ul>
     *     <li>list content</li>
     * </ul>}
     */
    if (commonAncestor.is(listType)) {
        return listUnwrap(commonAncestor, listType);
    }

    if (!commonAncestor.is(listItem)) {
        commonAncestor = commonAncestor.closest(listItem);
    }

    /**
     * <ul>
     *     <li>{list content}</li>
     * </ul>
     */
    if (!commonAncestor.prev().length && !commonAncestor.next().length) {
        return listUnwrap(commonAncestor.closest(listType), listItem);
    }

    /**
     * <ul>
     *     <li>list content</li>
     *     <li>{list content}</li>
     *     <li>list content</li>
     * </ul>
     */
    if (commonAncestor.next().length && commonAncestor.prev().length) {
        rangeSelectElement(range, commonAncestor);
        var replacement = listConvertListItem(commonAncestor, 'p', listValidPChildren);
        return rangeReplaceWithinValidTags(range, replacement, wrapper, listValidPParents);
    }

    /**
     * <ul>
     *     <li>{list content}</li>
     *     <li>list content</li>
     * </ul>
     */
    if (commonAncestor.next().length && !commonAncestor.prev().length) {
        commonAncestor.parent().before(listConvertListItem(commonAncestor, 'p', listValidPChildren));
        commonAncestor.remove();
        return;
    }

    /**
     * <ul>
     *     <li>list content</li>
     *     <li>{list content}</li>
     * </ul>
     */
    if (!commonAncestor.next().length && commonAncestor.prev().length) {
        commonAncestor.parent().after(listConvertListItem(commonAncestor, 'p', listValidPChildren));
        commonAncestor.remove();
        return;
    }
}
