function countColumns(tableElement) {
    // calculate current number of columns of a table,
    // taking into account rowspans and colspans

    var tr, td, i, j, k, cs, rs;
    var rowspanLeft = new Array();
    var tableCols = 0;
    var tableRows = tableElement.rows.length;
    i = 0;
    while (i < tableRows) {
        var tr = tableElement.rows[i];
        var j = 0;
        var k = 0;
        // Trace and adjust the cells of this row
        while (j < tr.cells.length || k < rowspanLeft.length) {
            if (rowspanLeft[k]) {
                rowspanLeft[k++]--;
            } else if (j >= tr.cells.length) {
                k++;
            } else {
                td = tr.cells[j++];
                rs = Math.max(1, parseInt(td.rowSpan));
                for (cs = Math.max(1, parseInt(td.colSpan)); cs > 0; cs--) {
                    if (rowspanLeft[k])
                        break; // Overlapping colspan and rowspan cells
                    rowspanLeft[k++] = rs - 1;
                }
            }
        }
        tableCols = Math.max(k, tableCols);
        i++;
    }
    return tableCols;
}

function resizeTable(tableElement, rCount, rStart, cCount, cStart, options) {
    // Insert or remove rows and columns in the table, taking into account
    // rowspans and colspans
    // Parameters:
    //   tableElement: DOM element representing existing table to be modified
    //   rCount:       number of rows to add (if >0) or delete (if <0)
    //   rStart:       number of row where rows should be added/deleted
    //   cCount:       number of columns to add (if >0) or delete (if <0)
    //   cStart:       number of column where columns should be added/deleted
    //   cCount
    //   cStart
    var tr, td, i, j, k, l, cs, rs;
    var rowspanLeft = [];
    var rowspanCell = [];
    var tableRows0 = tableElement.rows.length;
    var tableCols0 = countColumns(tableElement);
    var cells = [];

    if (rCount > 0) { // Prep insertion of rows
        for (i = rStart; i < rStart + rCount; i++) {
            tableElement.insertRow(i);
        }
    }
    i = 0;
    while (i < tableRows0) {
        var tr = tableElement.rows[i];
        var j = 0;
        var k = 0;
        // Trace and adjust the cells of this row
        while (k < tableCols0) {
            if (cCount > 0 && k === cStart) { // Insert columns by inserting cells
                for (l = 0; l < cCount; l++) {  // between/before existing cells
                    cells.push(insertEmptyCell(tr, j++, options.placeHolder));
                }
            }
            if (rowspanLeft[k]) {
                if (rCount < 0
                        && i === rStart - rCount && rowspanCell[k]
                        && rowspanCell[k].rowSpan == 1) {
                    // This is the first row after a series of to-be-deleted rows.
                    // Any rowspan-cells covering this row which started in the
                    // to-be-deleted rows have to be moved into this row, with
                    // rowspan adjusted. All such cells are marked td.rowSpan==1.
                    td = rowspanCell[k];
                    if (j >= tr.cells.length) {
                        tr.appendChild(td);
                    } else {
                        tr.insertBefore(td, tr.cells[j]);
                    }
                    j++;
                    rs = td.rowSpan = rowspanLeft[k];
                    for (cs = Math.max(1, parseInt(td.colSpan)); cs > 0; --cs) {
                        rowspanLeft[k++] = rs - 1;
                    }
                } else {
                    if (--rowspanLeft[k++] === 0)
                        rowspanCell[k] = null;
                    while (rowspanLeft[k] && !rowspanCell[k]) {
                        // This is a cell of a block with both rowspan and colspan>1
                        // Handle all remaining cells in this row of the block, so as to
                        // avoid inserting cells which are already covered by the block
                        --rowspanLeft[k++];
                    }
                }
            } else {
                if (j >= tr.cells.length) {
                    cells.push(insertEmptyCell(tr, j, options.placeHolder)); // append missing cell
                }
                td = tr.cells[j++];
                rs = Math.max(1, parseInt(td.rowSpan));
                if (rs > 1) {
                    rowspanCell[k] = td;
                    if (rCount < 0 && i >= rStart && i < rStart - rCount) {//row is to-be-deleted
                        td.rowSpan = 1; // Mark cell as to-be-moved-down-later
                    }
                }
                var k0 = k;
                for (cs = Math.max(1, parseInt(td.colSpan)); cs > 0; --cs) {
                    if (rowspanLeft[k]) { // Overlapping colspan and rowspan cells
                        td.colSpan -= cs; // Set adjustment into table
                        break;
                    }
                    rowspanLeft[k++] = rs - 1;
                }
                if (rCount < 0 && i >= rStart && i < rStart - rCount) {
                    // This row is to be deleted: do not insert/remove columns,
                    // but preserve row as-is so we can move cells down later on
                } else if (cCount > 0 && k > cStart && k0 < cStart) {
                    td.colSpan += cCount; // Insert columns by widening cell
                } else if (cCount < 0 && k0 < cStart - cCount && k > cStart) {
                    // Delete columns in overlap of [k0,k> and [cStart,cStart-cCount>
                    var newColSpan = Math.max(0, cStart - k0) + Math.max(0, k - (cStart - cCount));
                    if (newColSpan) {
                        // .. by reducing width of cell containing to-be-deleted columns
                        td.colSpan = newColSpan;
                    } else {
                        // .. by removing fully-encompassed cell
                        tr.deleteCell(--j);
                    }
                }
            }
        }
        if (cCount > 0 && k === cStart) { // Insert columns by appending cells to row
            for (l = 0; l < cCount; l++) {
                cells.push(insertEmptyCell(tr, j++, options.placeHolder));
            }
        }
        i++;
        if (rCount > 0 && i === rStart) {
            // Adjust rowspans present at start of inserted rows
            for (l = 0; l < tableCols0; l++) {
                if (rowspanLeft[l])
                    rowspanLeft[l] += rCount;
                if (rowspanCell[l])
                    rowspanCell[l].rowSpan += rCount;
            }
        } else if (rCount < 0 && i === rStart) {
            // Adjust rowspans present at start of to-be-deleted rows
            for (l = 0; l < rowspanCell.length; l++) {
                if (rowspanCell[l]) {
                    rowspanCell[l].rowSpan -= Math.min(-rCount, rowspanLeft[l]);
                }
            }
        }
    }
    if (rCount < 0) {
        for (i = rStart; i < rStart - rCount; i++) {
            tableElement.deleteRow(i);
        }
    }
    return cells;
}

function insertEmptyCell(row, index, placeHolder) {
    var sibling, cell;
    // Check the cell's sibling to detect header cells
    if (index > 0) {
        sibling = row.cells[index - 1];
    } else if (index < row.cells.length) {
        sibling = row.cells[index + 1];
    }

    // Header cell
    cell = row.insertCell(index);
    if (sibling && sibling.tagName === 'TH') {
        var header = document.createElement('th');
        if (placeHolder) {
            header.innerHTML = placeHolder;
        }
        $(cell).replaceWith(header)
    } else if (placeHolder) {
        cell.innerHTML = placeHolder;
    }
    return cell;
}
