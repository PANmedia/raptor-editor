function TagTreePlugin(name, overrides) {
    RaptorPlugin.call(this, name || 'tagTree', overrides);
}

TagTreePlugin.prototype = Object.create(RaptorPlugin.prototype);

TagTreePlugin.prototype.init = function(raptor) {
    this.raptor = raptor;
};

TagTreePlugin.prototype.enable = function() {
    this.raptor.bind('selectionChange', this.update.bind(this));
};

TagTreePlugin.prototype.update = function() {
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
        if (!this.raptor.isRoot(element) && !$.contains(this.raptor.getElement().get(0), element.get(0))) {
            element = this.raptor.getElement();
        }

        var list = [];
        lists.push(list);
        // Loop until we get to the root element, or the body tag
        while (element[0] && !this.raptor.isRoot(element) && element[0].tagName.toLowerCase() !== 'body') {
            // Add the node to the list
            list.push(element);
            element = element.parent();
        }
        list.reverse();

        if (title) title += ' | ';
        title += this.raptor.getTemplate('tag-tree.root');
        for (var j = 0; j < list.length; j++) {
            title += this.raptor.getTemplate('tag-tree.tag', {
                element: list[j][0].tagName.toLowerCase(),
                // Create a data attribute with the index to the range, and element (so [0,0] will be the first range/first element)
                data: '[' + i + ',' + j + ']'
            });
        }
        i++;
    }, null, this);

    if (!title) {
        title = this.raptor.getTemplate('tag-tree.root');
    }
    this.raptor.getLayout().path
        .html(title)
        .find('a')
        .click(function(event) {
            // Get the range/element data attribute
            var i = $(event.target).data('ui-editor-selection');
            if (i) {
                // Get the element from the list array
                selectionSelectOuter(lists[i[0]][i[1]]);
                this.update();
            } else {
                selectionSelectOuter(this.raptor.getElement());
            }
        }.bind(this));
};

Raptor.registerPlugin(new TagTreePlugin());
