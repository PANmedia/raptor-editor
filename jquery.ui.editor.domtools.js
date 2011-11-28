/**
 * @fileOverview This file has contains functions for making adjustments to the 
 *      DOM based on ranges, selections, etc.
 * @author David Neilsen - david@panmedia.co.nz
 * @author Michael Robinson - michael@panmedia.co.nz
 * @version 0.2
 */

/**
 * @namespace
 */
var domTools = {
    
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
        selection = rangy.getSelection()
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
            if (this.commonAncestorContainer.nodeType == 3) {
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
        if (range.commonAncestorContainer.nodeType == 3) {
            // Use the parent instead
            commonAncestor = range.commonAncestorContainer.parentNode;
        } else {
            commonAncestor = range.commonAncestorContainer;
        }
        return $(commonAncestor);
    },
    
    wrapTagWithAttribute: function(tag, attributes) {
        this.eachRange(function(range) {
            var element = this.getSelectedElement(range);
            if (element.is(tag)) {
                element.attr(attributes);
            } else {
                this.toggleWrapper(tag, { attributes: attributes});
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
     * @param {RangySelection} [selection] A RangySelection, or by default, the current selection.
     */
    selectOuter: function(element, selection) {
        selection = selection || rangy.getSelection();
        selection.removeAllRanges();
        $(element).each(function() {
            var range = rangy.createRange();
            range.selectNodeContents(this);
            selection.addRange(range);
        }).focus();
    },  

    /**
     * FIXME: this function needs reviewing
     * @public @static
     */
    toggleWrapper: function(tag, options) {
        options = options || {};
        rangy.createCssClassApplier(options.classes || '', {
            normalize: true,
            elementTagName: tag,
            elementProperties: options.attributes || {}
        }).toggleSelection();
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
        }, selection)
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
        }, selection)
    },
    
    /**
     * Inserts a element at the start of each range in a selection. If the clone 
     * paramter is true (default) then the each node in the element will be cloned 
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
        }, selection)
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
        }, selection)
    },

    /**
     * FIXME: this function needs reviewing
     * @public @static
     */
    applyStyle: function(styles) {
        $.each(this.getSelectedElements(), function(i, element) {
            $.each(styles, function(property, value) {
                if ($(element).css(property) == value) {
                    $(element).css(property, '');
                } else {
                    $(element).css(property, value);
                }
            });
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
        };
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
        var nodes = $('<div/>').append(html)[0].childNodes;
        this.eachRange(function(range) {
            range.deleteContents();
            if (nodes.length === undefined || nodes.length == 1) {
                range.insertNode(nodes[0].cloneNode(true));
            } else {
                $.each(nodes, function(i, node) {
                    range.insertNodeAtEnd(node.cloneNode(true));
                });
            }
        }, selection);
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
            console.debug(wrapperTag);
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

    /**
     * 
     * @public @static
     * @param {RangyRange} range 
     * @param {String} tag 
     */
    changeTag: function(range, tag) {
        var contents = range.extractContents();
        this.insertDomFragmentBefore(contents, range.startContainer, tag);
        $(range.startContainer).remove();
    },
    
    /**
     *
     * @public @static
     * @param {String} tag 
     */
    tagSelection: function(tag, selection) {
        this.eachRange(function(range) {
            if (this.isEmpty(range)) {
                // Apply to the whole element 
                this.expandRangeToParent(range);
                this.changeRangeTag(range, tag);
            } else {
                // Create a range from the start of the current range, to the beginning of the start element
                var newRange = rangy.createRange();
                newRange.setStart(range.startContainer, 0);
                newRange.setEnd(range.startContainer, range.startOffset);

                // Extract the contents, and prepend it as a new node before the current node
                var precontent = newRange.extractContents();
                var parent = $(newRange.startContainer).parent();
                this.insertDomFragmentBefore(precontent, parent, parent[0].nodeName);

                // Extract the content in the selected range
                var contents = range.extractContents();
                this.insertDomFragmentBefore(contents, parent, tag);
            }
        }, selection);
    }
    
}
