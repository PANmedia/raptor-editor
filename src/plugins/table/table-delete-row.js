Raptor.registerUi(new TableCellButton({
    name: 'tableDeleteRow',
    applyToElement: function(cell) {
        tableDeleteRow(cell.parentNode.parentNode.parentNode, tableGetCellIndex(cell).x);
    }
}));
