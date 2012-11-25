this.bind('selectionChange', this.updateTagTree);
this.bind('show', this.updateTagTree);

var tagTree = {
    /**
     *
     */
    updateTagTree: function() {
        /*
        if (!this.isEditing()) return;

        var editor = this;
        var title = '';

        // An array of ranges (by index), each with a list of elements in the range
        var lists = [];
        var i = 0;

        // Loop all selected ranges
        selectionEachRange(function(range) {
            // Get the selected nodes common parent
            var node = range.commonAncestorContainer;

            var element;
            if (node.nodeType === 3) {
                // If nodes common parent is a text node, then use its parent
                element = $(node).parent();
            } else {
                // Or else use the node
                element = $(node);
            }

            // Ensure the element is the editing element or a child of the editing element
            if (!editor.isRoot(element) && !$.contains(editor.getElement().get(0), element.get(0))) {
                element = editor.getElement();
            }

            var list = [];
            lists.push(list);
            // Loop until we get to the root element, or the body tag
            while (element[0] && !editor.isRoot(element) && element[0].tagName.toLowerCase() !== 'body') {
                // Add the node to the list
                list.push(element);
                element = element.parent();
            }
            list.reverse();

            if (title) title += ' | ';
            title += this.getTemplate('root');
            for (var j = 0; j < list.length; j++) {
                title += this.getTemplate('tag', {
                    element: list[j][0].tagName.toLowerCase(),
                    // Create a data attribute with the index to the range, and element (so [0,0] will be the first range/first element)
                    data: '[' + i + ',' + j + ']'
                });
            }
            i++;
        }, null, this);

        if (!title) title = this.getTemplate('root');
        this.path
            .html(title)
            .find('a')
            .click(function() {
                // Get the range/element data attribute
                var i = $(this).data('ui-editor-selection');
                if (i) {
                    // Get the element from the list array
                    selectionSelectOuter(lists[i[0]][i[1]]);
                    editor.updateTagTree();
                } else {
                    selectionSelectOuter(editor.getElement());
                }
            });

        this.fire('tagTreeUpdated');
        */
    }
};
