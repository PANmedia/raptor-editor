/**
 * @fileOverview
 * @author David Neilsen david@panmedia.co.nz
 */

$.ui.editor.registerUi({

    /**
     * @name $.editor.ui.clearFormatting
     * @augments $.ui.editor.defaultUi
     * @class Removes all formatting (wrapping tags) from the selected text.
     */
    clearFormatting: /** @lends $.editor.ui.clearFormatting.prototype */ {

        /**
         * @see $.ui.editor.defaultUi#init
         */
        init: function(editor, options) {
            return this.editor.uiButton({
                title: _('Clear Formatting'),
                click: function() {
                    var sel = rangy.getSelection();
                    if (sel.rangeCount > 0) {
                        // Create a copy of the selection range to work with
                        var range = sel.getRangeAt(0).cloneRange();

                        // Get the selected content
                        var content = range.extractContents();

                        // Expand the range to the parent if there is no selected content
                        if (fragmentToHtml(content) == '') {
                            editor.expandToParent(range);
                            sel.setSingleRange(range);
                            content = range.extractContents();
                        }

                        content = $('<div/>').append(fragmentToHtml(content)).text();

                        // Get the containing element
                        var parent = range.commonAncestorContainer;
                        while (parent && parent.parentNode != editor.getElement().get(0)) {
                            parent = parent.parentNode;
                        }

                        if (parent) {
                            // Place the end of the range after the paragraph
                            range.setEndAfter(parent);

                            // Extract the contents of the paragraph after the caret into a fragment
                            var contentAfterRangeStart = range.extractContents();

                            // Collapse the range immediately after the paragraph
                            range.collapseAfter(parent);

                            // Insert the content
                            range.insertNode(contentAfterRangeStart);

                            // Move the caret to the insertion point
                            range.collapseAfter(parent);
                            range.insertNode(document.createTextNode(content));
                        } else {
                            range.insertNode(document.createTextNode(content));
                        }
                    }


/**
 * If a entire heading is selected, replace it with a p
 *
 * If part of a heading is selected, remove all inline styles, and disallowed tags from the selection.
 *
 * If content inside a p remove all inline styles, and disallowed tags from the selection.
 *
 * If the selection starts in a heading, then ends in another element, convert all headings to a p.
 *
 */

//                    selectionEachRange(function(range) {
//                        if (range.collapsed) {
//                            // Expand to parent
//                            rangeExpandTo(range, [editor.getElement(), 'p, h1, h2, h3, h4, h5, h6']);
//                        }
//
//                        if (rangeIsWholeElement(range)) {
//
//                        }
//
//                        if (range.endOffset === 0) {
//                            range.setEndBefore(range.endContainer);
//                            console.log(range.endContainer);
//                        }
//                        range.refresh();
//                        console.log(range);
//
////                        console.log(range);
////                        console.log(range.toHtml(), range.toString());
////                        console.log($(range.commonAncestorContainer).html(), $(range.commonAncestorContainer).text());
////                        console.log($(range.toHtml()));
////                        range.splitBoundaries();
////                        console.log(range);
////                        var nodes = range.getNodes([3]);
////                        console.log(nodes);
////                        for (var i = nodes.length - 1; i >= 0; i--) {
////                            console.log(nodes[i]);
////                            console.log($.trim(nodes[i].nodeValue) === '');
////                            //console.log(nodes[i].nodeValue, $.trim(nodes[i].nodeValue));
////                        }
//                        selectionSet(range);
//                    });

                    editor.checkChange();
                }
            });
        }
    }

});
