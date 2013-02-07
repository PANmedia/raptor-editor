/**
 * @fileOverview Contains the delete column button code.
 * @author  David Neilsen <david@panmedia.co.nz>
 * @author  Michael Robinson <michael@panmedia.co.nz>
 * @author Melissa Richards <melissa@panmedia.co.nz>
 */

/**
 * Creates a table cell button to delete a column from a table.
 *
 * @todo
 * @param {type} param
 */

Raptor.registerUi(new TableCellButton({
    name: 'tableDeleteColumn',
    applyToElement: function(cell) {
        tableDeleteColumn(cell.parentNode.parentNode.parentNode, tableGetCellIndex(cell).x);
    }
}));
