/**
 * @fileOverview This file has contains functions for making adjustments to the
 *      DOM based on ranges, selections, etc.
 * @author David Neilsen - david@panmedia.co.nz
 * @author Michael Robinson - michael@panmedia.co.nz
 * @version 0.2
 */

/**
 * Functions attached to the editor object during editor initialisation. Usage example:
 * <pre>editor.saveSelection();
// Perform actions that could remove focus from editing element
editor.restoreSelection();
editor.replaceSelection('&lt;p&gt;Replace selection with this&lt;/p&gt;');</pre>
 * @namespace
 */
var domTools = {

    /**
     * @type {Boolean|Object} current saved selection.
     */
    savedSelection: false,

    /**
     * Save selection wrapper, preventing plugins / UI from accessing rangy directly.
     */
    saveSelection: function() {
        this.savedSelection = rangy.saveSelection();
    },

    /**
     * Restore selection wrapper, preventing plugins / UI from accessing rangy directly.
     */
    restoreSelection: function() {
        if (this.savedSelection) {
            rangy.restoreSelection(this.savedSelection);
            this.savedSelection = false;
        }
    },

    /**
     * Removes all ranges from a selection that are not contained within the
     * supplied element.
     *
     * @public @static
     * @param {jQuerySelector|jQuery|Element} element
     * @param {RangySelection} [selection]
     */
    constrainSelection: function(element, selection) {
        element = $(element)[0];
        selection = selection || rangy.getSelection();

        var commonAncestor;
        $(selection.getAllRanges()).each(function(i, range){
            if (this.commonAncestorContainer.nodeType === 3) {
                commonAncestor = $(range.commonAncestorContainer).parent()[0];
            } else {
                commonAncestor = range.commonAncestorContainer;
            }
            if (element !== commonAncestor && !$.contains(element, commonAncestor)) {
                selection.removeRange(range);
            }
        });
    },

    /**
     * Gets all elements that contain a selection (excluding text nodes) and
     * returns them as a jQuery array.
     *
     * @public @static
     * @param {RangySelection} [sel] A RangySelection, or by default, the current selection.
     */
    getSelectedElements: function(sel) {
        var result = new jQuery();
        selectionEachRange(function(range) {
            result.push(this.getSelectedElement(range)[0]);
        }, sel, this);
        return result;
    },

    getSelectedElement: function (range) {
        var commonAncestor;

        range = range || rangy.getSelection().getRangeAt(0);

        // Check if the common ancestor container is a text node
        if (range.commonAncestorContainer.nodeType === 3) {
            // Use the parent instead
            commonAncestor = range.commonAncestorContainer.parentNode;
        } else {
            commonAncestor = range.commonAncestorContainer;
        }
        return $(commonAncestor);
    },

    /**
     * @param  {RangySelection|null} selection Selection to get html from or null to use current selection.
     * @return {string} The html content of the selection.
     */
    getSelectedHtml: function(selection) {
        selection = selection || rangy.getSelection();
        return selection.toHtml();
    },

    getSelectionStartElement: function() {
        var selection = rangy.getSelection();
        if (selection.isBackwards()) {
            return selection.focusNode.nodeType === 3 ? $(selection.focusNode.parentElement) : $(selection.focusNode);
        }
        return selection.anchorNode.nodeType === 3 ? $(selection.anchorNode.parentElement) : $(selection.anchorNode);
    },

    getSelectionEndElement: function() {
        var selection = rangy.getSelection();
        if (selection.isBackwards()) {
            return selection.anchorNode.nodeType === 3 ? $(selection.anchorNode.parentElement) : $(selection.anchorNode);
        }
        return selection.focusNode.nodeType === 3 ? $(selection.focusNode.parentElement) : $(selection.focusNode);
    },

    unwrapParentTag: function(tag) {
        this.getSelectedElements().each(function(){
            if ($(this).is(tag)) {
                $(this).replaceWith($(this).html());
            }
        });
    },

    wrapTagWithAttribute: function(tag, attributes, classes) {
        selectionEachRange(function(range) {
            var element = this.getSelectedElement(range);
            if (element.is(tag)) {
                element.attr(attributes);
            } else {
                this.toggleWrapper(tag, {
                    classes: classes,
                    attributes: attributes
                });
            }
        }, null, this);
    },

    /**
     * Selects all the contents of the supplied element, excluding the element itself.
     *
     * @public @static
     * @param {jQuerySelector|jQuery|Element} element
     * @param {RangySelection} [selection] A RangySelection, or by default, the current selection.
     */
    selectInner: function(element, selection) {
        selection = selection || rangy.getSelection();
        selection.removeAllRanges();
        $(element).focus().contents().each(function() {
            var range = rangy.createRange();
            range.selectNodeContents(this);
            selection.addRange(range);
        });
    },

    /**
     * Selects all the contents of the supplied element, including the element itself.
     *
     * @public @static
     * @param {jQuerySelector|jQuery|Element} element
     * @param {RangySelection} [selection] A RangySelection, or null to use the current selection.
     */
    selectOuter: function(element, selection) {
        selection = selection || rangy.getSelection();
        selection.removeAllRanges();
        $(element).each(function() {
            var range = rangy.createRange();
            range.selectNode(this);
            selection.addRange(range);
        }).focus();
    },

    /**
     * Move selection to the end of element.
     *
     * @param  {jQuerySelector|jQuery|Element} element The subject element.
     * @param  {RangySelection|null} selection A RangySelection, or null to use the current selection.
     */
    selectEnd: function(element, selection) {
        selection = selection || rangy.getSelection();
        selection.removeAllRanges();

        $(element).each(function() {
            var range = rangy.createRange();
            range.selectNodeContents(this);
            range.collapse();
            selection.addRange(range);
        });
    },

    /**
     * FIXME: this function needs reviewing
     *
     * This should toggle an inline style, and normalise any overlapping tags, or adjacent (ignoring white space) tags.
     *
     * @public @static
     */
    toggleWrapper: function(tag, options) {
        options = options || {};
        var applier = rangy.createCssClassApplier(options.classes || '', {
            normalize: true,
            elementTagName: tag,
            elementProperties: options.attributes || {}
        });
        selectionEachRange(function(range) {
            if (this.rangeEmptyTag(range)) {
                var element = $('<' + tag + '/>')
                    .addClass(options.classes)
                    .attr(options.attributes || {})
                    .append(fragmentToHtml(range.cloneContents()));
                this.replaceRange(element, range);
            } else {
                applier.toggleRange(range);
            }
        }, null, this);
    },

    rangeEmptyTag: function(range) {
        var contents = range.cloneContents();
        var html = fragmentToHtml(contents);
        if (typeof html === 'string') {
            html = html.replace(/([ #;&,.+*~\':"!^$[\]()=>|\/@])/g,'\\$1');
        }
        if ($(html).is(':empty')) return true;
        return false;
    },

    /**
     * Wrapper function for document.execCommand().
     * @public @static
     */
    execCommand: function(command, arg1, arg2) {
        try {
            document.execCommand(command, arg1, arg2);
        } catch (exception) { }
    },

    /**
     * Creates a new elements and inserts it at the start of each range in a selection.
     *
     * @public @static
     * @param {String} tagName
     * @param {RangySelection} [sel] A RangySelection, or by default, the current selection.
     */
    insertTag: function(tagName, sel) {
        selectionEachRange(function(range) {
            range.insertNode($('<' + tagName + '/>')[0]);
        }, sel, this);
    },

    /**
     * Creates a new elements and inserts it at the end of each range in a selection.
     *
     * @public @static
     * @param {String} tagName
     * @param {RangySelection} [sel] A RangySelection, or by default, the current selection.
     */
    insertTagAtEnd: function(tagName, sel) {
        selectionEachRange(function(range) {
            range.insertNodeAtEnd($('<' + tagName + '/>')[0]);
        }, sel, this);
    },

    /**
     * Inserts a element at the start of each range in a selection. If the clone
     * parameter is true (default) then the each node in the element will be cloned
     * (copied). If false, then each node will be moved.
     *
     * @public @static
     * @param {jQuerySelector|jQuery|Element} element The jQuery element to insert
     * @param {boolean} [clone] Switch to indicate if the nodes chould be cloned
     * @param {RangySelection} [sel] A RangySelection, or by default, the current selection.
     */
    insertElement: function(element, clone, sel) {
        selectionEachRange(function(range) {
            $(element).each(function() {
                range.insertNode(clone === false ? this : this.cloneNode(true));
            });
        }, sel, this);
    },

    /**
     * Inserts a element at the end of each range in a selection. If the clone
     * paramter is true (default) then the each node in the element will be cloned
     * (copied). If false, then each node will be moved.
     *
     * @public @static
     * @param {jQuerySelector|jQuery|Element} element The jQuery element to insert
     * @param {boolean} [clone] Switch to indicate if the nodes chould be cloned
     * @param {RangySelection} [selection] A RangySelection, or by default, the current selection.
     */
    insertElementAtEnd: function(element, clone, sel) {
        selectionEachRange(function(range) {
            $(element).each(function() {
                range.insertNodeAtEnd(clone === false ? this : this.cloneNode(true));
            });
        }, sel, this);
    },

    /**
     * Toggles style(s) on the first block level parent element of each range in a selection
     *
     * @public @static
     * @param {Object} styles styles to apply
     * @param {jQuerySelector|jQuery|Element} limit The parent limit element.
     * If there is no block level elements before the limit, then the limit content
     * element will be wrapped with a "div"
     */
    toggleBlockStyle: function(styles, limit) {
        selectionEachRange(function(range) {
            var parent = $(range.commonAncestorContainer);
            while (parent.length && parent[0] !== limit[0] && (
                    parent[0].nodeType === 3 || parent.css('display') === 'inline')) {
                parent = parent.parent();
            }
            if (parent[0] === limit[0]) {
                // Only apply block style if the limit element is a block
                if (limit.css('display') !== 'inline') {
                    // Wrap the HTML inside the limit element
                    this.wrapInner(limit, 'div');
                    // Set the parent to the wrapper
                    parent = limit.children().first();
                }
            }
            // Apply the style to the parent
            this.toggleStyle(parent, styles);
        }, null, this);
    },

    /**
     * Wraps the inner content of an element with a tag
     *
     * @public @static
     * @param {jQuerySelector|jQuery|Element} element The element(s) to wrap
     * @param {String} tag The wrapper tag name
     */
    wrapInner: function(element, tag) {
        this.saveSelection();
        $(element).each(function() {
            var wrapper = $('<' + tag + '/>').html($(this).html());
            element.html(wrapper);
        });
        this.restoreSelection();
    },

    /**
     *
     */
    inverseWrapWithTagClass: function(tag1, class1, tag2, class2) {
        this.saveSelection();
        // Assign a temporary tag name (to fool rangy)
        var id = 'domTools' + Math.ceil(Math.random() * 10000000);

        selectionEachRange(function(range) {
            var applier2 = rangy.createCssClassApplier(class2, {
                elementTagName: tag2
            });

            // Check if tag 2 is applied to range
            if (applier2.isAppliedToRange(range)) {
                // Remove tag 2 to range
                applier2.toggleSelection();
            } else {
                // Apply tag 1 to range
                rangy.createCssClassApplier(class1, {
                    elementTagName: id
                }).toggleSelection();
            }
        }, null, this);

        // Replace the temparay tag with the correct tag
        $(id).each(function() {
            $(this).replaceWith($('<' + tag1 + '/>').addClass(class1).html($(this).html()));
        });

        this.restoreSelection();
    },

    /**
     * FIXME: this function needs reviewing
     * @public @static
     * @param {jQuerySelector|jQuery|Element} element The jQuery element to insert
     */
    toggleStyle: function(element, styles) {
        $.each(styles, function(property, value) {
            if ($(element).css(property) === value) {
                $(element).css(property, '');
            } else {
                $(element).css(property, value);
            }
        });
    },

    /**
     * FIXME: this function needs reviewing
     * @param {jQuerySelector|jQuery|Element} element
     */
    getStyles: function(element) {
        var result = {};
        var style = window.getComputedStyle(element[0], null);
        for (var i = 0; i < style.length; i++) {
            result[style.item(i)] = style.getPropertyValue(style.item(i));
        }
        return result;
    },

    /**
     * @public @static
     * @param {jQuerySelector|jQuery|Element} element1
     * @param {jQuerySelector|jQuery|Element} element2
     * @param {Object} style
     */
    swapStyles: function(element1, element2, style) {
        for (var name in style) {
            element1.css(name, element2.css(name));
            element2.css(name, style[name]);
        }
    },

    /**
     * Replace current selection with given html, ensuring that selection container is split at
     * the start & end of the selection in cases where the selection starts / ends within an invalid element.
     * @param  {jQuery|Element|string} html The html to replace current selection with.
     * @param  {Array} validTagNames An array of tag names for tags that the given html may be inserted into without having the selection container split.
     * @param  {RangySeleciton|null} selection The selection to replace, or null for the current selection.
     */
    replaceSelectionWithinValidTags: function(html, validTagNames, selection) {
        selection = selection || rangy.getSelection();

        var startElement = this.getSelectionStartElement()[0];
        var endElement = this.getSelectionEndElement()[0];
        var selectedElement = this.getSelectedElements()[0];

        var selectedElementValid = this.isElementValid(selectedElement, validTagNames);
        var startElementValid = this.isElementValid(startElement, validTagNames);
        var endElementValid = this.isElementValid(endElement, validTagNames);

        // The html may be inserted within the selected element & selection start / end.
        if (selectedElementValid && startElementValid && endElementValid) {
            this.replaceSelection(html);
            return;
        }

        // Context is invalid. Split containing element and insert list in between.
        this.replaceSelectionSplittingSelectedElement(html, selection);
        return;
    },

    /**
     * Split the selection container and insert the given html between the two elements created.
     * @param  {jQuery|Element|string} html The html to replace selection with.
     * @param  {RangySelection|null} selection The selection to replace, or null for the current selection.
     */
    replaceSelectionSplittingSelectedElement: function(html, selection) {
        selection = selection || rangy.getSelection();

        var selectionRange = selection.getRangeAt(0);
        var selectedElement = this.getSelectedElements()[0];

        // Select from start of selected element to start of selection
        var startRange = rangy.createRange();
        startRange.setStartBefore(selectedElement);
        startRange.setEnd(selectionRange.startContainer, selectionRange.startOffset);
        var startFragment = startRange.cloneContents();

        // Select from end of selected element to end of selection
        var endRange = rangy.createRange();
        endRange.setStart(selectionRange.endContainer, selectionRange.endOffset);
        endRange.setEndAfter(selectedElement);
        var endFragment = endRange.cloneContents();

        // Replace the start element's html with the content that was not selected, append html & end element's html
        var replacement = elementOuterHtml($(fragmentToHtml(startFragment)));
        replacement += elementOuterHtml($(html));
        replacement += elementOuterHtml($(fragmentToHtml(endFragment)));

        $(selectedElement).replaceWith($(replacement));
    },

    /**
     * FIXME: this function needs reviewing
     * @public @static
     */
    replaceSelection: function(html, sel) {
        selectionEachRange(function(range) {
            this.replaceRange(html, range);
        }, sel, this);
    },

    replaceRange: function(html, range) {
        var nodes = $('<div/>').append(html)[0].childNodes;
        range.deleteContents();
        if (nodes.length === undefined || nodes.length === 1) {
            range.insertNode(nodes[0].cloneNode(true));
        } else {
            $.each(nodes, function(i, node) {
                range.insertNodeAtEnd(node.cloneNode(true));
            });
        }
    },

    /**
     *
     *
     * @public @static
     * @param {DOMFragment} domFragment
     * @param {jQuerySelector|jQuery|Element} beforeElement
     * @param {String} wrapperTag
     */
    insertDomFragmentBefore: function(domFragment, beforeElement, wrapperTag) {
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
    },

    /**
     * Returns true if there is at least one range selected and the range is not
     * empty.
     *
     * @see isEmpty
     * @public @static
     * @param {RangySelection} [selection] A RangySelection, or by default, the current selection.
     */
    selectionExists: function(sel) {
        var selectionExists = false;
        selectionEachRange(function(range) {
            if (!this.isEmpty(range)) selectionExists = true;
        }, sel, this);
        return selectionExists;
    },

    /**
     * Returns true if the supplied range is empty (has a length of 0)
     *
     * @public @static
     * @param {RangyRange} range The range to check if it is empty
     */
    isEmpty: function(range) {
        return range.startOffset === range.endOffset &&
               range.startContainer === range.endContainer;
    },

    /**
     * Check that the given element is one of the the given tags
     * @param  {jQuery|Element} element The element to be tested.
     * @param  {Array}  validTagNames An array of valid tag names.
     * @return {Boolean} True if the given element is one of the give valid tags.
     */
    isElementValid: function(element, validTags) {
        return -1 !== $.inArray($(element)[0].tagName.toLowerCase(), validTags);
    },

    /**
     * Modification of strip_tags from PHP JS - http://phpjs.org/functions/strip_tags:535.
     * @param  {string} content HTML containing tags to be stripped
     * @param {Array} allowedTags Array of tags that should not be stripped
     * @return {string} HTML with all tags not present allowedTags array.
     */
    stripTags: function(content, allowedTags) {
        // making sure the allowed arg is a string containing only tags in lowercase (<a><b><c>)
        allowed = [];
        for (var allowedTagsIndex = 0; allowedTagsIndex < allowedTags.length; allowedTagsIndex++) {
            if (allowedTags[allowedTagsIndex].match(/[a-z][a-z0-9]{0,}/g)) {
                allowed.push(allowedTags[allowedTagsIndex]);
            }
        }
        // making sure the allowed arg is a string containing only tags in lowercase (<a><b><c>)
        var tags = /<\/?([a-z][a-z0-9]*)\b[^>]*\/?>/gi,
            commentsAndPhpTags = /<!--[\s\S]*?-->|<\?(?:php)?[\s\S]*?\?>/gi;

        return content.replace(commentsAndPhpTags, '').replace(tags, function ($0, $1) {
            return allowed.indexOf($1.toLowerCase()) > -1 ? $0 : '';
        });
    }
};