Raptor.registerUi('tableAddColumn', new Button({
    name: 'addRow',
    action: function() {
        selectionEachRange(function(range) {
            var cell = range.commonAncestorContainer.parentNode;
            if (cell.tagName === 'TD' ||
                    cell.tagName === 'TH') {
                var index = tableGetCellIndex(cell);
                tableInsertColumn(cell.parentNode.parentNode.parentNode, index.x, {
                    placeHolder: '&nbsp;'
                });
            }
        });
    }
}));
