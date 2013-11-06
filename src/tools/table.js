/**
 * @fileOverview Table helper functions.
 * @license http://www.raptor-editor.com/license
 *
 * @author David Neilsen - david@panmedia.co.nz
 */

/**
 * Create and return a new table element with the supplied number of rows/columns.
 *
 * @public @static
 * @param {int} columns The number of columns to add to the table.
 * @param {int} rows The number of rows to add to the table.
 * @param [options] Extra options to apply.
 * @param [options.placeHolder=""] Place holder HTML to insert into each created cell.
 * @returns {HTMLTableElement}
 */
function tableCreate(columns, rows, options) {
    options = options || {};
    var table = document.createElement('table');
    while (rows--) {
        var row = table.insertRow(0);
        for (var i = 0; i < columns; i++) {
            var cell = row.insertCell(0);
            if (options.placeHolder) {
                cell.innerHTML = options.placeHolder;
            }
        }
    }
    return table;
}

/**
 * Adds a column to a table.
 *
 * @param {HTMLTableElement} table
 * @param {int[]} index Position to insert the column at, starting at 0.
 * @param [options] Extra options to apply.
 * @param [options.placeHolder=""] Place holder HTML to insert into each created cell.
 * @returns {HTMLTableCellElement[]} An array of cells added to the table.
 */
function tableInsertColumn(table, index, options) {
    return resizeTable(table, 0, 0, 1, index, options || {});
}
/**
 * Removes a column from a table.
 *
 * @param {HTMLTableElement} table
 * @param {int} index Position to remove the column at, starting at 0.
 */
function tableDeleteColumn(table, index) {
    resizeTable(table, 0, 0, -1, index);
}

/**
 * Adds a row to a table, and append as many cells as the longest row in the table.
 *
 * @param {HTMLTableElement} table
 * @param {int[]} index Position to insert the row at, starting at 0.
 * @param [options] Extra options to apply.
 * @param [options.placeHolder=""] Place holder HTML to insert into each created cell.
 * @returns {HTMLTableCellElement[]} An array of cells added to the table.
 */
function tableInsertRow(table, index, options) {
    var googTable = new GoogTable(table);
    return googTable.insertRow(index, options);
}

/**
 * Removes a row from a table.
 *
 * @param {HTMLTableElement} table The table to remove the row from.
 * @param {int} index Position to remove the row at, starting at 0.
 */
function tableDeleteRow(table, index) {
    resizeTable(table, -1, index, 0, 0);
}

/**
 * Return the x/y position of a table cell, taking into consideration the column/row span.
 *
 * @param {HTMLTableCellElement} cell The table cell to get the index for.
 * @returns {tableGetCellIndex.Anonym$0}
 */
function tableGetCellIndex(cell) {
    var x, y, tx, ty,
        matrix = [],
        rows = cell.parentNode.parentNode.parentNode.tBodies[0].rows;
    for (var r = 0; r < rows.length; r++) {
        y = rows[r].sectionRowIndex;
        y = r;
        for (var c = 0; c < rows[r].cells.length; c++) {
            x = c;
            while (matrix[y] && matrix[y][x]) {
                // Skip already occupied cells in current row
                x++;
            }
            for (tx = x; tx < x + (rows[r].cells[c].colSpan || 1); ++tx) {
                // Mark matrix elements occupied by current cell with true
                for (ty = y; ty < y + (rows[r].cells[c].rowSpan || 1); ++ty) {
                    if (!matrix[ty]) {
                        // Fill missing rows
                        matrix[ty] = [];
                    }
                    matrix[ty][tx] = true;
                }
            }
            if (cell === rows[r].cells[c]) {
                return {
                    x: x,
                    y: y
                };
            }
        }
    }
}

/**
 * Gets a table cell by a given index.
 *
 * @param {HTMLTableElement} table This is the table to get the cell from.
 * @param {int} index This is the index to find the cell.
 * @returns {HTMLTableCellElement|null} The cell at the specified index.
 */
function tableGetCellByIndex(table, index) {
    var rows = table.tBodies[0].rows;
    for (var r = 0; r < rows.length; r++) {
        for (var c = 0; c < rows[r].cells.length; c++) {
            var currentIndex = tableGetCellIndex(rows[r].cells[c]);
            if (currentIndex.x === index.x &&
                    currentIndex.y === index.y) {
                return rows[r].cells[c];
            }
        }
    }
    return null;
}

/**
 * Returns an array of cells found within the supplied indexes.
 *
 * @param {HTMLTableElement} table
 * @param {int} startIndex This is the index to start searching at.
 * @param {int} endIndex This is the index to stop searching at.
 * @returns {Array} An array of the cells in the range supplied.
 */
function tableCellsInRange(table, startIndex, endIndex) {
    var startX = Math.min(startIndex.x, endIndex.x),
        x = startX,
        y = Math.min(startIndex.y, endIndex.y),
        endX = Math.max(startIndex.x, endIndex.x),
        endY = Math.max(startIndex.y, endIndex.y),
        cells = [];
    while (y <= endY) {
        while (x <= endX) {
            var cell = tableGetCellByIndex(table, {
                x: x,
                y: y
            });
            if (cell !== null) {
                cells.push(cell);
            }
            x++;
        }
        x = startX;
        y++;
    }
    return cells;
}

/**
 * Checks if the cells selected can be merged.
 *
 * @param {HTMLTableElement} table The table to check the selection with.
 * @param {int} startX Selection's start x position.
 * @param {int} startY Selection's start y position.
 * @param {int} endX Selection's end x position.
 * @param {int} endY Selection's end y position.
 */
function tableCanMergeCells(table, startX, startY, endX, endY) {
}

/**
 * Merges the selected cells of a table.
 *
 * @param {HTMLTableElement} table This is the table that is going to have cells merged.
 * @param {int} startX This is the X coordinate to start merging the cells at.
 * @param {int} startY This is the Y coordinate to start merging the cells at.
 * @param {int} endX This is the X coordinate to stop merging the cells at.
 * @param {int} endY This is the Y coordinate to stop merging the cells at.
 */
function tableMergeCells(table, startX, startY, endX, endY) {
    var googTable = new GoogTable(table);
    googTable.mergeCells(startX, startY, endX, endY);
}

/**
 * Checks if the cell at the given index can be split.
 *
 * @param {HTMLTableElement} table Table to check the seleciton with.
 * @param {int} x The X coordinate of the cell to be checked.
 * @param {int} y Ths Y coordinate of the cell to be checked.
 */
function tableCanSplitCells(table, x, y) {
}

/**
 * Splits the selected cell of a table.
 *
 * @param {HTMLTableElement} table The table to find the cell to be split on.
 * @param {int} x The X coordinate of the cell to be split.
 * @param {int} y The Y coordinate of the cell to be split.
 */
function tableSplitCells(table, x, y) {
    var googTable = new GoogTable(table);
    googTable.splitCell(x, y);
}


function tableIsEmpty(table) {
    for (var i = 0, l = table.rows.length; i < l; i++) {
        if (table.rows[i].cells.length > 0) {
            return false;
        }
    }
    return true;
}