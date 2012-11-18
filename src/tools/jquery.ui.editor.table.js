/**
 * @fileOverview Table helper functions.
 * @author David Neilsen - david@panmedia.co.nz
 */

/**
 * Create and return a new table element with the supplied number of rows/columns.
 *
 * @public @static
 * @param {int} columns
 * @param {int} rows
 * @param [options] Extra options to apply.
 * @param [options.placeHolder=""] Place holder HTML to insert into each created cell.
 * @returns {HTMLTableElement}
 */
function tableCreate(columns, rows, options) {
    options = options || {};
    var table = document.createElement('table');
    while (rows--) {
        var row = table.insertRow();
        for (var i = 0; i < columns; i++) {
            var cell = row.insertCell();
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
 * @param {int} index Position to insert the column at, starting at 0.
 * @param [options] Extra options to apply.
 * @param [options.placeHolder=""] Place holder HTML to insert into each created cell.
 * @returns {HTMLTableCellElement[]} An array of cells added to the table.
 */
function tableInsertColumn(table, index, options) {
    // TODO: Detach table from DOM for speed before adding the rows.
    options = options || {};
    var cells = [];
    for (var i = 0; i < table.rows.length; i++) {
        var cell = table.rows[i].insertCell(index);
        if (options.placeHolder) {
            cell.innerHTML = options.placeHolder;
        }
        cells.push(cell);
    }
    return cells;
}

function tableDeleteColumn() {}

/**
 * Adds a row to a table, and append as many cells as the longest row in the table.
 *
 * @param {HTMLTableElement} table
 * @param {int} index Position to insert the row at, starting at 0.
 * @param [options] Extra options to apply.
 * @param [options.placeHolder=""] Place holder HTML to insert into each created cell.
 * @returns {HTMLTableCellElement[]} An array of cells added to the table.
 */
function tableInsertRow(table, index, options) {
    // TODO: Detach table from DOM for speed before adding the rows.
    options = options || {};
    var i,
        cells = [],
        length = 0,
        row = table.insertRow(index);
    for (i = 0; i < table.rows.length; i++) {
        length = Math.max(table.rows[i].cells.length, length);
    };
    for (i = 0; i < length; i++) {
        var cell = row.insertCell(i);
        if (options.placeHolder) {
            cell.innerHTML = options.placeHolder;
        }
    }
    return cells;
}

function tableDeleteRow() {}

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
            };
        }
    }
}

function tableGetCellByIndex(table, index) {
    return table.rows[index.y].cells[index.x];
}

function tableCellsInRange(table, startIndex, endIndex) {
    var startX = Math.min(startIndex.x, endIndex.x),
        x = startX,
        y = Math.min(startIndex.y, endIndex.y),
        endX = Math.max(startIndex.x, endIndex.x),
        endY = Math.max(startIndex.y, endIndex.y),
        cells = [];
    while (y < endY) {
        while (x < endX) {
            cells.push(tableGetCellByIndex(table, {
                x: x,
                y: y
            }));
            x++;
        }
        x = startX;
        y++;
    }
    return cells;
}

function tableCanMergeCells(table, startIndex, endIndex) {}

function tableMergeCells() {}

function tableCanSplitCells() {}

function tableSplitCells() {}
