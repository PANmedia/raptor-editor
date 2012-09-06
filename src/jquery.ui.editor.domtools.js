/**
 * @fileOverview This file has contains functions for making adjustments to the
 *      DOM based on ranges, selections, etc.
 * @author David Neilsen - david@panmedia.co.nz
 * @author Michael Robinson - michael@panmedia.co.nz
 * @version 0.2
 */

/**
 * Functions attached to the editor object during editor initialisation. Usage example:
 * <pre>selectionSave();
// Perform actions that could remove focus from editing element
selectionRestore();
selectionReplace('&lt;p&gt;Replace selection with this&lt;/p&gt;');</pre>
 * @namespace
 */
var domTools = {

    unwrapParentTag: function(tag) {
        selectionGetElements().each(function(){
            if ($(this).is(tag)) {
                $(this).replaceWith($(this).html());
            }
        });
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
     *
     */
    inverseWrapWithTagClass: function(tag1, class1, tag2, class2) {
        selectionSave();
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

        selectionRestore();
    }

};
