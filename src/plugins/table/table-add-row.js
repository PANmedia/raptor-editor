Raptor.registerUi(new TableCellButton({
    name: 'tableAddRow',
    applyToCell: function(cell) {
        tableInsertRow(cell.parentNode.parentNode.parentNode, tableGetCellIndex(cell).x, {
            placeHolder: '&nbsp;'
        });
    }
}));
