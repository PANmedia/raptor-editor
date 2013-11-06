/**
 * @fileOverview Contains the delete column button code.
 * @license http://www.raptor-editor.com/license
 *
 * @author David Neilsen <david@panmedia.co.nz>
 * @author Michael Robinson <michael@panmedia.co.nz>
 * @author Melissa Richards <melissa@panmedia.co.nz>
 */

/**
 * Creates a table cell button to delete a row from a table.
 */
Raptor.registerUi(new TableCellButton({
    name: 'tableDeleteRow',
    applyToElement: function(cell) {
        var position = tableGetCellIndex(cell),
            table = cell.parentNode.parentNode.parentNode,
            nextCell;
        tableDeleteRow(cell.parentNode.parentNode.parentNode, position.y);
        if (tableIsEmpty(table)) {
            table.parentNode.removeChild(table);
            return;
        }
        nextCell = tableGetCellByIndex(table, position);
        if (!nextCell && position.y > 0) {
            nextCell = tableGetCellByIndex(table, {
                x: position.x,
                y: position.y - 1
            });
        }
        selectionSelectInner(nextCell);
    }
}));
