/**
 * @fileOverview UI components & plugin for inserting ordered and unordered lists
 * @author David Neilsen david@panmedia.co.nz
 * @author Michael Robinson michael@panmedia.co.nz
 */
$.ui.editor.registerPlugin('list', /** @lends $.editor.plugin.list.prototype */ {

    /**
     * @name $.editor.plugin.list.options
     * @type {Object}
     * @namespace Default options
     * @see $.editor.plugin.list
     */
    options: /** @lends $.editor.plugin.list.options */  { },

    /**
     * Tag names for elements that are allowed to contain ul/ol elements.
     * @type {Array}
     */
    validParents: [
        'blockquote', 'body', 'button', 'center', 'dd', 'div', 'fieldset', 'form', 'iframe', 'li',
        'noframes', 'noscript', 'object', 'td', 'th'
    ],

    /**
     * Tag names for elements that may be contained by li elements.
     * @type {Array}
     */
    validChildren: [
        'a', 'abbr','acronym', 'applet', 'b', 'basefont', 'bdo', 'big', 'br', 'button', 'cite', 'code', 'dfn',
        'em', 'font', 'i', 'iframe', 'img', 'input', 'kbd', 'label', 'map', 'object', 'p', 'q', 's',  'samp',
        'select', 'small', 'span', 'strike', 'strong', 'sub', 'sup', 'textarea', 'tt', 'u', 'var'
    ],

    /**
     * Toggle listType depending on the current selection.
     * This function fires both the selectionChange & change events when the action is complete.
     * @param  {string} listType One of ul or ol.
     */
    toggleList: function(listType) {

        // Check whether selection is fully contained by a ul/ol. If so, unwrap parent ul/ol
        if ($(selectionGetElements()).is('li')
            && $(selectionGetElements()).parent().is(listType)) {
            this.unwrapList();
        } else {
            this.wrapList(listType);
        }

        this.editor.fire('selectionChange');
        this.editor.fire('change');
    },

    /**
     * Extract the contents of all selected li elements.
     * If the list element's parent is not a li, then wrap the content of each li in a p, else leave them unwrapped.
     */
    unwrapList: function() {
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
        this.editor.checkChange();
    },

    /**
     * Wrap the selection with the given listType.
     * @param  {string} listType One of ul or ol.
     */
    wrapList: function(listType) {
        this.editor.constrainSelection(this.editor.getElement());
        if ($.trim(selectionGetHtml()) === '') {
            selectionSelectInner(selectionGetElements());
        }

        var selectedHtml = $('<div>').html(selectionGetHtml());

        var listElements = [];
        var plugin = this;

        // Convert child block elements to list elements
        $(selectedHtml).contents().each(function() {
            var liContent;
            // Use only content of block elements
            if ('block' === elementDefaultDisplay(this.tagName)) {
                liContent = stringStripTags($(this).html(), plugin.validChildren);
            } else {
                liContent = stringStripTags(elementOuterHtml($(this)), plugin.validChildren);
            }

            // Avoid inserting blank lists
            var listElement = $('<li>' + liContent + '</li>');
            if ($.trim(listElement.text()) !== '') {
                listElements.push(elementOuterHtml(listElement));
            }
        });

        var replacementClass = this.options.baseClass + '-selection';
        var replacementHtml = '<' + listType + ' class="' + replacementClass + '">' + listElements.join('') + '</' + listType + '>';

        // Selection must be restored before it may be replaced.
        selectionRestore();

        var selectedElementParent = $(selectionGetElements()[0]).parent();
        var editingElement = this.editor.getElement()[0];

        /*
         * Replace selection if the selected element parent or the selected element is the editing element,
         * instead of splitting the editing element.
         */
        if (selectedElementParent === editingElement
            || selectionGetElements()[0] === editingElement) {
            selectionReplace(replacementHtml);
        } else {
            selectionReplaceWithinValidTags(replacementHtml, this.validParents);
        }

        // Select the first list element of the inserted list
        var selectedElement = $(this.editor.getElement().find('.' + replacementClass).removeClass(replacementClass));
        selectionSelectInner(selectedElement.find('li:first')[0]);
        this.editor.checkChange();
    },

    /**
     * Toggle the givent ui's button state depending on whether the current selection is within the context of listType.
     * @param  {string} listType A tagname for a list type.
     * @param  {object} ui The ui owning the button whose state is to be toggled.
     */
    toggleButtonState: function(listType, ui) {

        var toggleState = function(on) {
            ui.button.toggleClass('ui-state-highlight', on).toggleClass('ui-state-default', !on);
        };

        var selectionStart = selectionGetStartElement();
        if (selectionStart === null || !selectionStart.length) {
            selectionStart = this.editor.getElement();
        }

        var selectionEnd = selectionGetEndElement();
        if (selectionEnd === null || !selectionEnd.length) {
            selectionEnd = this.editor.getElement();
        }

        var start = selectionStart[0];
        var end = selectionEnd[0];

        // If the start & end are a UL or OL, and they're the same node:
        if ($(start).is(listType) && $(end).is(listType) && start === end) {
            return toggleState(true);
        }

        var shareParentListType = $(start).parentsUntil(elementSelector, listType).first()
                                    && $(end).parentsUntil(elementSelector, listType).first();

        var elementSelector = '#' + this.editor.getElement().attr('id');
        var startIsLiOrInside = $(start).is(listType + ' > li') || $(start).parentsUntil(elementSelector, listType + ' > li').length;
        var endIsLiOrInside = $(end).is(listType + ' > li') || $(end).parentsUntil(elementSelector, listType + ' > li').length;

        // If the start & end elements are LI's or inside LI's, and they are enclosed by the same UL:
        if (startIsLiOrInside && endIsLiOrInside && shareParentListType) {

            var sharedParentList = $(rangeGetCommonAncestor());
            if (!sharedParentList.is(listType)) {
                sharedParentList = $(sharedParentList).parentsUntil(elementSelector, listType).first();
            }
            var childLists = sharedParentList.find('ul, ol');
            if (!childLists.length) {
                return toggleState(true);
            }
            for (var childListIndex = 0; childListIndex < childLists.length; childListIndex++) {
                if ($.contains(childLists[childListIndex], start) && $.contains(childLists[childListIndex], end)) {
                    return toggleState(false);
                }
            }

            return toggleState(true);
        }

        return toggleState(false);
    }
});

$.ui.editor.registerUi({

    /**
     * @name $.editor.ui.listUnordered
     * @augments $.ui.editor.defaultUi
     * @class Wraps the selection with a &lt;ul&gt;, then a &lt;li&gt;
     */
    listUnordered: /** @lends $.editor.ui.listUnordered.prototype */ {

        /**
         * @see $.ui.editor.defaultUi#init
         */
        init: function(editor) {
            var ui = editor.uiButton({
                title: _('Unordered List'),
                click: function() {
                    editor.getPlugin('list').toggleList('ul');
                }
            });

            editor.bind('selectionChange', function() {
                editor.getPlugin('list').toggleButtonState('ul', ui);
            });

            return ui;
        }
    },

    /**
     * @name $.editor.ui.listOrdered
     * @augments $.ui.editor.defaultUi
     * @class Wraps the selection with a &lt;ol&gt;, then a &lt;li&gt;
     */
    listOrdered: /** @lends $.editor.ui.listOrdered.prototype */ {

        /**
         * @see $.ui.editor.defaultUi#init
         */
        init: function(editor) {
            var ui = editor.uiButton({
                title: _('Ordered List'),
                click: function() {
                    editor.getPlugin('list').toggleList('ol');
                }
            });

            editor.bind('selectionChange', function() {
                editor.getPlugin('list').toggleButtonState('ol', ui);
            });

            return ui;
        }
    }
});
