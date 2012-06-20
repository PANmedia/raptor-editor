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
     * Iterates over all ranges in a selection and calls the callback for each
     * range. The selection/range offsets is updated in every iteration in in the
     * case that a range was changed or removed by a previous iteration.
     *
     * @public @static
     * @param {function} callback The function to call for each range. The first and only parameter will be the current range.
     * @param {RangySelection} [selection] A RangySelection, or by default, the current selection.
     * @param {object} [context] The context in which to call the callback, or by default, the domTools object.
     */
    eachRange: function(callback, selection, context) {
        selection = selection || rangy.getSelection();
        context = context || this;
        var range, i = 0;
        // Create a new range set every time to update range offsets
        while (range = selection.getAllRanges()[i++]) {
            callback.call(context, range);
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
     * @param {RangySelection} [selection] A RangySelection, or by default, the current selection.
     */
    getSelectedElements: function(selection) {
        var result = new jQuery();
        this.eachRange(function(range, selection) {
            result.push(this.getSelectedElement(range)[0]);
        });
        return result;
    },

    getSelectedElement: function (range) {
        var commonAncestor;
        // Check if the common ancestor container is a text node
        if (range.commonAncestorContainer.nodeType === 3) {
            // Use the parent instead
            commonAncestor = range.commonAncestorContainer.parentNode;
        } else {
            commonAncestor = range.commonAncestorContainer;
        }
        return $(commonAncestor);
    },

    unwrapParentTag: function(tag) {
        this.getSelectedElements().each(function(){
            if ($(this).is(tag)) {
                $(this).replaceWith($(this).html());
            }
        });
    },

    wrapTagWithAttribute: function(tag, attributes, classes) {
        this.eachRange(function(range) {
            var element = this.getSelectedElement(range);
            if (element.is(tag)) {
                element.attr(attributes);
            } else {
                this.toggleWrapper(tag, {
                    classes: classes,
                    attributes: attributes
                });
            }
        });
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
        this.eachRange(function(range) {
            if (this.rangeEmptyTag(range)) {
                var element = $('<' + tag + '/>')
                    .addClass(options.classes)
                    .attr(options.attributes || {})
                    .append(this.domFragmentToHtml(range.cloneContents()));
                this.replaceRange(element, range);
            } else {
                applier.toggleRange(range);
            }
        });
    },

    rangeEmptyTag: function(range) {
        var contents = range.cloneContents();
        var html = this.domFragmentToHtml(contents);
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
        document.execCommand(command, arg1, arg2);
    },

    /**
     * Creates a new elements and inserts it at the start of each range in a selection.
     *
     * @public @static
     * @param {String} tagName
     * @param {RangySelection} [selection] A RangySelection, or by default, the current selection.
     */
    insertTag: function(tagName, selection) {
        this.eachRange(function(range) {
            range.insertNode($('<' + tagName + '/>')[0]);
        }, selection);
    },

    /**
     * Creates a new elements and inserts it at the end of each range in a selection.
     *
     * @public @static
     * @param {String} tagName
     * @param {RangySelection} [selection] A RangySelection, or by default, the current selection.
     */
    insertTagAtEnd: function(tagName, selection) {
        this.eachRange(function(range) {
            range.insertNodeAtEnd($('<' + tagName + '/>')[0]);
        }, selection);
    },

    /**
     * Inserts a element at the start of each range in a selection. If the clone
     * parameter is true (default) then the each node in the element will be cloned
     * (copied). If false, then each node will be moved.
     *
     * @public @static
     * @param {jQuerySelector|jQuery|Element} element The jQuery element to insert
     * @param {boolean} [clone] Switch to indicate if the nodes chould be cloned
     * @param {RangySelection} [selection] A RangySelection, or by default, the current selection.
     */
    insertElement: function(element, clone, selection) {
        this.eachRange(function(range) {
            $(element).each(function() {
                range.insertNode(clone === false ? this : this.cloneNode(true));
            });
        }, selection);
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
    insertElementAtEnd: function(element, clone, selection) {
        this.eachRange(function(range) {
            $(element).each(function() {
                range.insertNodeAtEnd(clone === false ? this : this.cloneNode(true));
            });
        }, selection);
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
        this.eachRange(function(range) {
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
        });
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

        this.eachRange(function(range) {
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
        });

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
     * FIXME: this function needs reviewing
     * @public @static
     */
    replaceSelection: function(html, selection) {
        this.eachRange(function(range) {
            this.replaceRange(html, range);
        }, selection);
    },

    replaceRange: function(html, range) {
        var nodes = $('<div></div>').append(html)[0].childNodes;
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

    domFragmentToHtml: function(domFragment, tag) {
        var html = '';
        // Get all nodes in the extracted content
        for (var j = 0, l = domFragment.childNodes.length; j < l; j++) {
            var node = domFragment.childNodes.item(j);
            var content = node.nodeType === 3 ? node.nodeValue : this.outerHtml(node);
            if (content) {
                html += content;
            }
        }
        if (tag) {
            html = $('<' + tag + '>' + html + '</' + tag + '>');
            html.find('p').wrapInner('<' + tag + '/>');
            html.find('p > *').unwrap();
            html = $('<div></div>').html(html).html();
        }
        return html;
    },

    /**
     * Returns true if there is at least one range selected and the range is not
     * empty.
     *
     * @see isEmpty
     * @public @static
     * @param {RangySelection} [selection] A RangySelection, or by default, the current selection.
     */
    selectionExists: function(selection) {
        var selectionExists = false;
        this.eachRange(function(range) {
            if (!this.isEmpty(range)) selectionExists = true;
        }, selection);
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
     * Expands a range to to surround all of the content from its start container
     * to its end container.
     *
     * @public @static
     * @param {RangyRange} range The range to expand
     */
    expandToParent: function(range) {
        range.setStartBefore(range.startContainer);
        range.setEndAfter(range.endContainer);
    },

    changeTag: function(range, tag) {
        var contents = range.extractContents();
        this.insertDomFragmentBefore(contents, range.startContainer, tag);
        $(range.startContainer).remove();
    },

    /**
     * Behaviour similar to {@link domTools.tagSelectionWithin}, only in cases where the selection or cursor acts on text nodes only, the wrapping element will be modified.
     * @param  {String} tag Name of tag to change to or wrap selection with.
     * @param  {RangySelection} selection A RangySelection, or by default, the current selection.
     */
    tagSelection: function(tag, selection) {
        this.tagSelectionWithin(tag, null, selection);
    },

    /**
     * If selection is empty, change the tag for the element the cursor is currently within, else wrap the selection with tag.
     * @param  {String} tag Name of tag to change to or wrap selection with.
     * @param  {jQuery|null} within The element to perform changes within. If The cursor is within, or the selection contains text nodes only, the text will be wrapped with tag. If null, changes will be applied to the wrapping tag.
     * @param  {RangySelection} selection A RangySelection, or by default, the current selection.
     */
    tagSelectionWithin: function(tag, within, selection) {
        this.eachRange(function(range) {

            if (this.isEmpty(range)) {
                this.expandToParent(range);
                within = $(within)[0];
                if (typeof within !== 'undefined'
                    && range.startContainer === within
                    && range.endContainer === within) {
                    // Apply to the content of the 'within' element
                    this.wrapInner($(within), tag);
                } else {
                    // Apply to the whole element
                    this.changeTag(range, tag);
                }
            } else {
                var content = range.extractContents();
                this.replaceRange(this.domFragmentToHtml(content, tag), range);
            }
        }, selection);
    },

    /**
     * @param  {Element|jQuery} element The element to retrieve the outer HTML from.
     * @return {String} The outer HTML.
     */
    outerHtml: function(element) {
        return $(element).clone().wrap('<div></div>').parent().html();
    }
};