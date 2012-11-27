Raptor.registerUi(new TableCellButton({
    name: 'tableAddColumn',
    applyToCell: function(cell) {
        tableInsertColumn(cell.parentNode.parentNode.parentNode, tableGetCellIndex(cell).x, {
            placeHolder: '&nbsp;'
        });
    }
}));
