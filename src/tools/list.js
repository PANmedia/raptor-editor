function listToggle(listType, listItem, wrapper) {
    // Check whether selection is fully contained by a ul/ol. If so, unwrap parent ul/ol
    if ($(selectionGetElements()).is(listItem) &&
        $(selectionGetElements()).parent().is(listType)) {
        listUnwrapSelection(listItem);
    } else {
        listWrapSelection(listType, listItem, wrapper);
    }
}

/**
 * @return {string[]} Tags allowed within an li.
 */
function listValidChildren() {
    return [
        'a', 'abbr','acronym', 'applet', 'b', 'basefont', 'bdo', 'big', 'br', 'button', 'cite', 'code', 'dfn',
        'em', 'font', 'i', 'iframe', 'img', 'input', 'kbd', 'label', 'map', 'object', 'p', 'q', 's',  'samp',
        'select', 'small', 'span', 'strike', 'strong', 'sub', 'sup', 'textarea', 'tt', 'u', 'var'
    ];
}

/**
 * @return {string][]} Tags ol & ul are allowed within.
 */
function listValidParents() {
    return  [
        'blockquote', 'body', 'button', 'center', 'dd', 'div', 'fieldset', 'form', 'iframe', 'li',
        'noframes', 'noscript', 'object', 'td', 'th'
    ];
}

/**
 * @return {string][]} Tags blockquote is allowed within.
 */
function listValidBlockQuoteParents() {
    return [
        'body', 'center', 'dd', 'div', 'dt', 'fieldset', 'form', 'iframe', 'li', 'td', 'th'
    ];
}

/**
 * Convert tags invalid within the context of tagName.
 *
 * @param  {[type]} list          [description]
 * @param  {[type]} validChildren [description]
 * @return {[type]}               [description]
 */
function listEnforceValidChildren(list, tagName, validChildren) {
    // <strict>
    if (!typeIsElement(list)) {
        handleError('Parameter 1 for listEnforceValidChildren must be a jQuery element');
    }
    // </strict>
    list.find(tagName + ' *').each(function() {
        if (!typeIsTextNode(this)) {
            if (!elementIsValid(this, listValidChildren())) {
                $(this).replaceWith($('<p>' + this.innerHTML + '</p>'));
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
    var replacementHtml = '<' + listType + '>' + contents + '</' + listType + '>';
    var validParents = listValidParents();
    if (listType === 'blockquote') {
        listValidBlockQuoteParents();
    }
    var replacement = rangeReplaceWithinValidTags(range, replacementHtml, wrapper, validParents);

    listEnforceValidChildren($(replacement), listItem, listValidChildren());

    selectionSelectInner($(replacement).get(0));
}

/**
 * TODO
 * @param  {[type]} listItem [description]
 * @return {[type]}          [description]
 */
function listUnwrapSelection(listItem) {
    // Array containing the html contents of each of the selected li elements.
    var listElementsContent = [];
    // Array containing the selected li elements themselves.
    var listElements = [];

    // The element within which selection begins.
    var startElement = selectionGetStartElement();
    // The element within which ends.
    var endElement = selectionGetEndElement();

    // Collect the first selected list element's content
    listElementsContent.push($(startElement).html());
    listElements.push(startElement);

    // Collect the remaining list elements' content
    if ($(startElement)[0] !== $(endElement)[0]) {
        var currentElement = startElement;
        do  {
            currentElement = $(currentElement).next();
            listElementsContent.push($(currentElement).html());
            listElements.push(currentElement);
        } while($(currentElement)[0] !== $(endElement)[0]);
    }

    // Boolean values used to determine whether first / last list element of the parent is selected.
    var firstLISelected = $(startElement).prev().length === 0;
    var lastLISelected = $(endElement).next().length === 0;

    // The parent list container, e.g. the parent ul / ol
    var parentListContainer = $(startElement).parent();

    // Remove the list elements from the DOM.
    for (listElementsIndex = 0; listElementsIndex < listElements.length; listElementsIndex++) {
        $(listElements[listElementsIndex]).remove();
    }

    // Wrap list element content in p tags if the list element parent's parent is not a li.
    for (var listElementsContentIndex = 0; listElementsContentIndex < listElementsContent.length; listElementsContentIndex++) {
        if (!parentListContainer.parent().is(listItem)) {
            listElementsContent[listElementsContentIndex] = '<p>' + listElementsContent[listElementsContentIndex] + '</p>';
        }
    }

    // Every li of the list has been selected, replace the entire list
    if (firstLISelected && lastLISelected) {
        parentListContainer.replaceWith(listElementsContent.join(''));
        selectionRestore();
        var selectedElement = selectionGetElements()[0];
        selectionSelectOuter(selectedElement);
        return;
    }

    if (firstLISelected) {
        $(parentListContainer).before(listElementsContent.join(''));
    } else if (lastLISelected) {
        $(parentListContainer).after(listElementsContent.join(''));
    } else {
        selectionReplaceSplittingSelectedElement(listElementsContent.join(''));
    }
}
