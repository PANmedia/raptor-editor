/**
 * @fileOverview List manipulation helper functions.
 * @license http://www.raptor-editor.com/license
 *
 * @author David Neilsen david@panmedia.co.nz
 * @author Michael Robinson michael@panmedia.co.nz
 */

/**
 * Determines the appropriate list toggling action then performs it.
 *
 * @param {String} listType This is the type of list to check the selection against.
 * @param {Object} listItem This is the list item to use as the selection.
 * @param {Element} wrapper Element containing the entire action, may not be modified.
 */
function listToggle(listType, listItem, wrapper) {
    if (wrapper.html().trim() === '') {
        return;
    }
    if (!selectionExists()) {
        return;
    }
    if (listShouldConvertType(listType, listItem, wrapper)) {
        return listConvertListType(listType, listItem, wrapper);
    }
    if (listShouldUnwrap(listType, listItem)) {
        return listUnwrapSelection(listType, listItem, wrapper);
    }
    if (listShouldWrap(listType, listItem, wrapper)) {
       return listWrapSelection(listType, listItem, wrapper);
    }
}

/**
 * @param  {String} listType
 * @param  {String} listItem
 * @return {Boolean}
 */
function listShouldUnwrap(listType, listItem) {
    var selectedElements = $(selectionGetElements());
    if (selectedElements.is(listType)) {
        return true;
    }
    if (listType === 'blockquote' && !selectedElements.parent().is(listType)) {
        return false;
    }
    if (selectedElements.is(listItem) && selectedElements.parent().is(listType)) {
        return true;
    }
    if (selectedElements.parentsUntil(listType, listItem).length) {
        return true;
    }
    return false;
}

/**
 * @param  {String} listType
 * @param  {String} listItem
 * @return {Boolean}
 */
function listShouldConvertType(listType, listItem, wrapper) {
    var range = selectionRange();
    var commonAncestor = $(rangeGetCommonAncestor(range));
    if (rangeIsEmpty(range)) {
        var closestListItem = commonAncestor.closest(listItem, wrapper);
        if (closestListItem.length) {
            rangeExpandTo(range, [closestListItem]);
        } else {
            rangeExpandToParent(range);
        }
    }
    commonAncestor = $(rangeGetCommonAncestor(range));

    // Do not convert blockquotes that have partial selections
    if (listType === 'blockquote' &&
        !rangeContainsNode(range, commonAncestor.get(0))) {
        return false;
    }

    if ($(commonAncestor).is(listItem) &&
        !$(commonAncestor).parent().is(listType)) {
        return true;
    }
    return false;
}

function listShouldWrap(listType, listItem, wrapper) {
    if (listType === 'blockquote') {
        return elementIsValid(wrapper, listValidBlockQuoteParents);
    }
    return elementIsValid(wrapper, listValidUlOlParents);
}

/**
 * @type {String[]} Tags allowed within an li.
 */
var listValidLiChildren = [
    'a', 'abbr','acronym', 'applet', 'b', 'basefont', 'bdo', 'big', 'br', 'button',
    'cite', 'code', 'dfn', 'em', 'font', 'i', 'iframe', 'img', 'input', 'kbd',
    'label', 'map', 'object', 'p', 'q', 's',  'samp', 'select', 'small', 'span',
    'strike', 'strong', 'sub', 'sup', 'textarea', 'tt', 'u', 'var',
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6'
];

/**
 * @type {String][]} Tags ol & ul are allowed within.
 */
var listValidUlOlParents =  [
    'article', 'nav', 'section', 'footer', 'blockquote', 'body', 'button',
    'center', 'dd', 'div', 'fieldset', 'form', 'iframe', 'li', 'noframes',
    'noscript', 'object', 'td', 'th'
];

/**
 * @type {String][]} Tags blockquote is allowed within.
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
 * @param  {String} listItem
 * @param  {String[]} validChildren
 */
function listEnforceValidChildren(list, listItem, validChildren, removeEmpty) {
    removeEmpty = typeof removeEmpty === 'undefined' ? true : removeEmpty;
    // <strict>
    if (!typeIsElement(list)) {
        handleInvalidArgumentError('Parameter 1 for listEnforceValidChildren must be a jQuery element', list);
    }
    // </strict>
    var removeEmptyElements = function(node) {
        if ($(node).is('img') || $(node).find('img').length) {
            return;
        }
        if (!$(node).text().trim()) {
            $(node).remove();
            return true;
        }
    };

    list.find('> ' + listItem).each(function() {
        if (removeEmpty && removeEmptyElements(this)) {
            return true;
        }
        $(this).contents().each(function() {
            if (removeEmpty && removeEmptyElements(this)) {
                return true;
            }
            if (listItem === 'p') {
                if (!typeIsTextNode(this) &&
                    !elementIsValid(this, validChildren)) {
                    $(this).contents().unwrap();
                    return true;
                }
            } else {
                // Do nothing for bare text nodes
                if (typeIsTextNode(this)) {
                    return true;
                }
                // Unwrap the invalid element and remove it if empty
                if (!elementIsValid(this, validChildren)) {
                    $(this).contents().unwrap();
                    removeEmptyElements(this);
                    return true;
                }
            }
        });
    });
}

/**
 * Wraps the selected element(s) in list tags.
 *
 * @param {String} listType The type of list that the selection is to be transformed into.
 * @param {String} listItem The list item to be used in creating the list.
 * @param {Element} wrapper Element containing the entire action, may not be modified.
 */
function listWrapSelection(listType, listItem, wrapper) {
    var range = selectionRange();
    var commonAncestor = rangeGetCommonAncestor(range);

    /**
     * <wrapper>{}<p>Some content</p></wrapper>
     */
    if (rangeIsEmpty(range) && commonAncestor === wrapper.get(0)) {
        return;
    }

    // Having a <td> fully selected is a special case: without intervention
    // the surrounding <table> would be split, with a <listType> inserted between
    // the two <tables>.
    if ($(commonAncestor).is('td,th') || commonAncestor === wrapper.get(0)) {
        rangeSelectElementContent(range, commonAncestor);

    // Other cases require checking if the range contains the full text of the
    // common ancestor. In these cases the commonAncestor should be selected
    } else if (rangeContainsNodeText(range, commonAncestor)) {
        rangeSelectElement(range, $(commonAncestor));
    }

    if (rangeIsEmpty(range)) {
        range.selectNode(elementClosestBlock($(commonAncestor), wrapper).get(0));
    }

    var contents = listConvertItemsForList(fragmentToHtml(range.extractContents()), listItem);
    var validParents = listType === 'blockquote' ? listValidBlockQuoteParents : listValidUlOlParents;
    var uniqueId = elementUniqueId();
    var replacementHtml = '<' + listType + ' id="' + uniqueId + '">' + $('<div/>').html(contents).html() + '</' + listType + '>';

    rangeReplaceWithinValidTags(range, replacementHtml, wrapper, validParents);

    var replacement = $('#' + uniqueId).removeAttr('id');
    var validChildren = listType === 'blockquote' ? listValidPChildren : listValidLiChildren;
    listEnforceValidChildren(replacement, listItem, validChildren);
    if (replacement.is(listType)) {
        var child = replacement.find(' > ' + listItem);
        if (child.length === 0) {
            replacement = $(document.createElement('li')).appendTo(replacement);
        }
    }
    selectionSelectInner(replacement.get(0));
}

/**
 * Wrap non block elements in <p> tags, then in <li>'s.
 *
 * @param  {String} items HTML to be prepared.
 * @param  {String} listItem
 * @return {String} Prepared HTML.
 */
function listConvertItemsForList(items, listItem) {
    items = $('<div/>').html(items);

    if (!elementContainsBlockElement(items)) {
        // Do not double wrap p's
        if (listItem === 'p') {
            return '<' + listItem + '>' + items.html() + '</' + listItem + '>';
        }
        return '<' + listItem + '><p>' + items.html() + '</p></' + listItem + '>';
    }

    items.contents().each(function() {
        if ($(this).is('img')) {
            return true;
        }
        if (elementIsEmpty($(this))) {
            return $(this).remove();
        }
        $(this).wrap('<' + listItem + '/>');
        if (!elementIsBlock(this)) {
            $(this).wrap('<p>');
        }
    });

    return items.html();
}

/**
 * Convert the given list item to the given tag. If the listItem has children,
 * convert them and unwrap the containing list item.
 *
 * @param  {Element} listItem
 * @param  {string} listType
 * @param  {string} tag
 * @param  {string[]} validTagChildren Array of valid child tag names.
 * @return {Element|null} Result of the final conversion.
 */
function listConvertListItem(listItem, listType, tag) {
     // <strict>
    if (!typeIsElement(listItem)) {
        handleInvalidArgumentError('Parameter 1 for listConvertListItem must be a jQuery element', listItem);
    }
    // </strict>
    var listItemChildren = listItem.contents();
    if (listItemChildren.length) {
        listItemChildren.each(function() {
            if ($(this).text().trim() === '') {
                return $(this).remove();
            }
            if (typeIsTextNode(this) || !elementIsBlock(this)) {
                return $(this).wrap('<' + tag + '>');
            }
        });
        return listItem.contents().unwrap();
    } else {
        return elementChangeTag(listItem, tag);
    }
}

/**
 * Convert listItems to paragraphs and unwrap the containing listType.
 *
 * @param  {Element} list
 * @param  {string} listItem
 * @param  {string} listType
 */
function listUnwrap(list, listItem, listType) {
    // <strict>
    if (!typeIsElement(list)) {
        handleInvalidArgumentError('Parameter 1 for listUnwrap must be a jQuery element', list);
    }
    // </strict>
    var convertedItem = null;
    list.find(listItem).each(function() {
        listConvertListItem($(this), listType, 'p');
    });
    return list.contents().unwrap();
}

/**
 * Tidy lists that have been modified, including removing empty listItems and
 * removing the list if it is completely empty.
 *
 * @param  {Element} list
 * @param  {string} listType
 * @param  {string} listItem
 */
function listTidyModified(list, listType, listItem) {
    // <strict>
    if (!typeIsElement(list)) {
        handleInvalidArgumentError('Parameter 1 for listTidyModified must be a jQuery element', list);
    }
    // </strict>
    listRemoveEmptyItems(list, listType, listItem);
    listRemoveEmpty(list, listType, listItem);
}

/**
 * Remove empty listItems from within the list.
 *
 * @param  {Element} list
 * @param  {string} listType
 * @param  {string} listItem
 */
function listRemoveEmptyItems(list, listType, listItem) {
    // <strict>
    if (!typeIsElement(list)) {
        handleInvalidArgumentError('Parameter 1 for listRemoveEmptyItems must be a jQuery element', list);
    }
    // </strict>
    if (!list.is(listType)) {
        return;
    }
    list.find(listItem).each(function() {
        if ($(this).text().trim() === '') {
            $(this).remove();
        }
    });
}

/**
 * Remove list if it is of listType and empty.
 *
 * @param  {Element} list
 * @param  {string} listType
 * @param  {string} listItem
 */
function listRemoveEmpty(list, listType, listItem) {
    // <strict>
    if (!typeIsElement(list)) {
        handleInvalidArgumentError('Parameter 1 for listRemoveEmpty must be a jQuery element', list);
    }
    // </strict>
    if (!list.is(listType)) {
        return;
    }
    if (list.text().trim() === '') {
        list.remove();
    }
}

/**
 * Unwrap the list items between the range's startElement & endElement.
 *
 * @param  {RangyRange} range
 * @param  {string} listType
 * @param  {string} listItem
 * @param  {Element} wrapper
 */
function listUnwrapSelectedListItems(range, listType, listItem, wrapper) {
    var startElement = rangeGetStartElement(range);
    var endElement = rangeGetEndElement(range);
    var replacementPlaceholderId = elementUniqueId();

    rangeExpandToParent(range);
    var breakOutValidityList = listType === 'blockquote' ? listValidBlockQuoteParents : listValidPParents;
    breakOutValidityList = $.grep(breakOutValidityList, function(item) {
        return item !== 'li';
    });
    rangeReplaceWithinValidTags(range, $('<p/>').attr('id', replacementPlaceholderId), wrapper, breakOutValidityList);

    var replacementPlaceholder = $('#' + replacementPlaceholderId);

    listTidyModified(replacementPlaceholder.prev(), listType, listItem);
    listTidyModified(replacementPlaceholder.next(), listType, listItem);

    var toUnwrap = [startElement];
    if (startElement !== endElement) {
        $(startElement).nextUntil(endElement).each(function() {
            if (this === endElement) {
                return;
            }
            toUnwrap.push(this);
        });
        toUnwrap.push(endElement);
    }

    toUnwrap.reverse();

    $(toUnwrap).each(function() {
        replacementPlaceholder.after(this);
        listConvertListItem($(this), listType, 'p');
    });

    replacementPlaceholder.remove();

    return listEnforceValidChildren($(rangeGetCommonAncestor(range)), listItem, listValidLiChildren);
}

/**
 * Unwraps the selected list item(s) and puts it into <p> tags.
 *
 * @param {Object} listItem
 */
function listUnwrapSelection(listType, listItem, wrapper) {
    var range = selectionRange();
    if (rangeIsEmpty(range)) {
        rangeExpandTo(range, [listItem]);
    }

    var commonAncestor = $(rangeGetCommonAncestor(range));

    /**
     * Selection contains more than one <listItem>, or the whole <listType>
     */
    if (commonAncestor.is(listType)) {
        var startElement = rangeGetStartElement(range);
        var endElement = rangeGetEndElement(range);

        /**
         * {<listType>
         *     <listItem>list content</listItem>
         * </listType>}
         */
        if ($(endElement).is(listType) && $(startElement).is(listType)) {
            return listUnwrap(commonAncestor, listItem, listType);
        }

        /**
         * <listType>
         *     <listItem>{list content</listItem>
         *     <listItem>list content}</listItem>
         *     <listItem>list content</listItem>
         * </listType>
         */
         return listUnwrapSelectedListItems(range, listType, listItem, wrapper);
    }

    if (!commonAncestor.is(listItem)) {
        commonAncestor = commonAncestor.closest(listItem);
    }
    /**
     * <listType>
     *     <li>{list content}</li>
     * </listType>
     */
    if (!commonAncestor.prev().length && !commonAncestor.next().length) {
        return listUnwrap(commonAncestor.closest(listType), listItem, listType);
    }

    /**
     * <listType>
     *     <listItem>list content</listItem>
     *     <listItem>{list content}</listItem>
     *     <listItem>list content</listItem>
     * </listType>
     */
    if (commonAncestor.next().length && commonAncestor.prev().length) {
        return listUnwrapSelectedListItems(range, listType, listItem, wrapper);
    }

    /**
     * <listType>
     *     <listItem>{list content}</listItem>
     *     <listItem>list content</listItem>
     * </listType>
     */
    if (commonAncestor.next().length && !commonAncestor.prev().length) {
        commonAncestor.parent().before(listConvertListItem(commonAncestor, listType, 'p'));
        commonAncestor.remove();
        return;
    }

    /**
     * <listType>
     *     <listItem>list content</listItem>
     *     <listItem>{list content}</listItem>
     * </listType>
     */
    if (!commonAncestor.next().length && commonAncestor.prev().length) {
        commonAncestor.parent().after(listConvertListItem(commonAncestor, 'p', listType));
        commonAncestor.remove();
        return;
    }
}

function listConvertListType(listType, listItem, wrapper) {
    var range = selectionRange();
    if (rangeIsEmpty(range)) {
        rangeExpandTo(range, [listItem]);
    }

    var startElement = rangeGetStartElement(range);
    var endElement = rangeGetEndElement(range);
    var replacementPlaceholderId = elementUniqueId();

    rangeExpandToParent(range);
    var breakOutValidityList = $.grep(listValidPParents, function(item) {
        return item !== listItem;
    });
    rangeReplaceWithinValidTags(range, $('<p/>').attr('id', replacementPlaceholderId), wrapper, breakOutValidityList);

    var replacementPlaceholder = $('#' + replacementPlaceholderId);

    listTidyModified(replacementPlaceholder.prev(), listType, listItem);
    listTidyModified(replacementPlaceholder.next(), listType, listItem);

    var toUnwrap = [startElement];
    if (startElement !== endElement) {
        $(startElement).nextUntil(endElement).each(function() {
            if (this === endElement) {
                return;
            }
            toUnwrap.push(this);
        });
        toUnwrap.push(endElement);
    }

    toUnwrap.reverse();

    $(toUnwrap).each(function() {
        replacementPlaceholder.after(this);
    });
    replacementPlaceholder.remove();
    var convertedList = $(toUnwrap).wrap('<' + listType + '>').parent();

    return listEnforceValidChildren(convertedList, listItem, listValidLiChildren);
}

/**
 * Break the currently selected list, replacing the selection.
 *
 * @param  {String} listType
 * @param  {String} listItem
 * @param  {Element} wrapper
 * @param  {String|Element} replacement
 * @return {Element|Boolean} The replaced element, or false if replacement did not
 *                               occur.
 */
function listBreakByReplacingSelection(listType, listItem, wrapper, replacement) {
    var selectedElement = selectionGetElement();
    if (!selectedElement.closest(listItem).length) {
        return false;
    }

    var parentList = selectedElement.closest(listType);
    if (!parentList.length || wrapper.get(0) === parentList.get(0)) {
        return false;
    }

    selectionSelectToEndOfElement(selectedElement);
    selectionDelete();

    var top = $('<' + listType + '/>'),
        bottom = $('<' + listType + '/>'),
        middlePassed = false;
    parentList.children().each(function() {
        if (selectedElement.closest(listItem).get(0) === this) {
            middlePassed = true;
            top.append(this);
            return;
        }
        if (!middlePassed) {
            top.append(this);
        } else {
            bottom.append(this);
        }
    });
    parentList.replaceWith(top);
    replacement = $(replacement).appendTo($('body'));
    top.after(replacement, bottom);

    return replacement;
}

/**
 * Add a new list item below the selection. New list item contains content of original
 * list item from selection end to end of element.
 *
 * @param  {String} listType
 * @param  {String} listItem
 * @param  {Element} wrapper
 * @param  {String|Element} replacement
 * @return {Element|Boolean}
 */
function listBreakAtSelection(listType, listItem, wrapper) {
    var selectedElement = selectionGetElement();
    if (!selectedElement.closest(listItem).length) {
        return false;
    }

    selectionDelete();
    selectionSelectToEndOfElement(selectedElement);
    var html = selectionGetHtml();
    if (html.trim() === '') {
        html = '&nbsp;';
    }
    selectionDelete();

    if (selectedElement.text().trim() === '') {
        selectedElement.html('&nbsp;');
    }
    var newListItem = $('<' + listItem + '>').html(html);
    selectedElement.closest(listItem).after(newListItem);

    listEnforceValidChildren(selectedElement.closest(listType), listItem, listValidLiChildren, false);

    return newListItem;
}
