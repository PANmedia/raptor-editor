document.addEventListener('DOMContentLoaded', function() {
    // Initialise rangy
    if (!rangy.initialized) {
        rangy.init();
    }

    // Add helper method to rangy
    if (typeof rangy.rangePrototype.insertNodeAtEnd !== 'function') {
        rangy.rangePrototype.insertNodeAtEnd = function(node) {
            var range = this.cloneRange();
            range.collapse(false);
            range.insertNode(node);
            range.detach();
            this.setEndAfter(node);
        };
    }
});
