function listToggle(listType, wrapper) {
    // Check whether selection is fully contained by a ul/ol. If so, unwrap parent ul/ol
    if ($(selectionGetElements()).is('li')
        && $(selectionGetElements()).parent().is(listType)) {
        listUnwrapSelection();
    } else {
        listWrapSelection(listType, wrapper);
    }
};

function listWrapSelection(listType, wrapper) {
    if ($.trim(selectionGetHtml()) === '') {
        selectionSelectInner(selectionGetElements());
    }
    
    var validChildren = [
            'a', 'abbr','acronym', 'applet', 'b', 'basefont', 'bdo', 'big', 'br', 'button', 'cite', 'code', 'dfn',
            'em', 'font', 'i', 'iframe', 'img', 'input', 'kbd', 'label', 'map', 'object', 'p', 'q', 's',  'samp',
            'select', 'small', 'span', 'strike', 'strong', 'sub', 'sup', 'textarea', 'tt', 'u', 'var'
        ],
        validParents = [
            'blockquote', 'body', 'button', 'center', 'dd', 'div', 'fieldset', 'form', 'iframe', 'li',
            'noframes', 'noscript', 'object', 'td', 'th'
        ],
        selectedHtml = $('<div>').html(selectionGetHtml()),
        listElements = [];

    // Convert child block elements to list elements
    $(selectedHtml).contents().each(function() {
        var liContent;
        // Use only content of block elements
        if ('block' === elementDefaultDisplay(this.tagName)) {
            liContent = stringStripTags($(this).html(), validChildren);
        } else {
            liContent = stringStripTags(elementOuterHtml($(this)), validChildren);
        }

        // Avoid inserting blank lists
        var listElement = $('<li>' + liContent + '</li>');
        if ($.trim(listElement.text()) !== '') {
            listElements.push(elementOuterHtml(listElement));
        }
    });

    var replacementHtml = '<' + listType + '>' + listElements.join('') + '</' + listType + '>',
        selectedElementParent = $(selectionGetElements()[0]).parent(),
        editingElement = wrapper[0];

    /*
     * Replace selection if the selected element parent or the selected element is the editing element,
     * instead of splitting the editing element.
     */
    if (selectedElementParent === editingElement
        || selectionGetElements()[0] === editingElement) {
        selectionReplace(replacementHtml);
    } else {
        selectionReplaceWithinValidTags(replacementHtml, validParents);
    }

    // Select the first list element of the inserted list
    selectionSelectInner(selectedElementParent.find('li:first')[0]);
};

function listUnwrapSelection() {
    selectionSave();

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
    var firstLiSelected = $(startElement).prev().length === 0;
    var lastLiSelected = $(endElement).next().length === 0;

    // The parent list container, e.g. the parent ul / ol
    var parentListContainer = $(startElement).parent();

    // Remove the list elements from the DOM.
    for (listElementsIndex = 0; listElementsIndex < listElements.length; listElementsIndex++) {
        $(listElements[listElementsIndex]).remove();
    }

    // Wrap list element content in p tags if the list element parent's parent is not a li.
    for (var listElementsContentIndex = 0; listElementsContentIndex < listElementsContent.length; listElementsContentIndex++) {
        if (!parentListContainer.parent().is('li')) {
            listElementsContent[listElementsContentIndex] = '<p>' + listElementsContent[listElementsContentIndex] + '</p>';
        }
    }

    // Every li of the list has been selected, replace the entire list
    if (firstLiSelected && lastLiSelected) {
        parentListContainer.replaceWith(listElementsContent.join(''));
        selectionRestore();
        var selectedElement = selectionGetElements()[0];
        selectionSelectOuter(selectedElement);
        return;
    }

    if (firstLiSelected) {
        $(parentListContainer).before(listElementsContent.join(''));
    } else if (lastLiSelected) {
        $(parentListContainer).after(listElementsContent.join(''));
    } else {
        selectionReplaceSplittingSelectedElement(listElementsContent.join(''));
    }

    selectionRestore();
};
