/**
 * @param  {string} listType List type, e.g. ul, ol or blockquote
 * @param  {string} listItem List item, e.g. li or p
 * @param  {Element} wrapper
 */
function listToggle(listType, listItem, wrapper) {
    console.log($(selectionGetElements()));
    // Check whether selection is fully contained by a ul/ol. If so, unwrap parent ul/ol
    var selectedElements = $(selectionGetElements());
    if (selectedElements.is(listItem) &&
        selectedElements.parent().is(listType)) {
        return listUnwrapSelection(listType, listItem, wrapper);
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
 * Wrap the selection with a list of the given type, ensuring HTML remains valid.
 *
 * @param  {string} listType
 * @param  {string} listItem
 * @param  {Element} wrapper
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
 * @param  {string} listType
 * @param  {string} listItem
 * @param  {Element} wrapper
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
