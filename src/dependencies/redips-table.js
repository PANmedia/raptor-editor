/*
Copyright (c)  2008-2012, www.redips.net  All rights reserved.
Code licensed under the BSD License: http://www.redips.net/license/
http://www.redips.net/javascript/table-td-merge-split/
Version 1.1.0
May 15, 2012.
*/

/*jslint white: true, browser: true, undef: true, nomen: true, eqeqeq: true, plusplus: false, bitwise: true, regexp: true, strict: true, newcap: true, immed: true, maxerr: 14 */
/*global window: false */

/* enable strict mode */
"use strict";

// create REDIPS namespace (if is not already defined in another REDIPS package)
var REDIPS = REDIPS || {};

/**
 * @namespace
 * @description REDIPS.table is a JavaScript library which enables dynamically merging and splitting table cells.
 * @name REDIPS.table
 * @author Darko Bunic
 * @see
 * <a href="http://www.redips.net/javascript/table-td-merge-split/">Merge and split table cells with JavaScript</a>
 * @version 1.1.0
 */
REDIPS.table = (function () {
		// methods declaration
	var	onmousedown,			// method attaches onmousedown event listener to table cells
		handler_onmousedown,	// onmousedown handler
		merge,					// method merges marked cells
		merge_cells,			// method merges/deletes table cells (used by merge_h & merge_v)
		max_cols,				// method returns maximum number of columns in a table
		split,					// method splits merged cells (if cell has colspan/rowspan greater then 1)
		get_table,				// method sets reference to the table (it's used in "merge" and "split" public methods)
		mark,					// method marks table cell
		cell_init,				// method attaches "mousedown" event listener and creates "redips" property to the newly created table cell
		row,					// method adds/deletes table row
		column,					// method adds/deletes table column
		cell_list,				// method returns cell list with new coordinates
		relocate,				// relocate element nodes from source cell to the target cell
		remove_selection,		// method removes text selection
		cell_index,				// method displays cellIndex (debug mode)
		cell_ignore,			// method removes onmousedown even listener in case of active REDIPS.table.onmousedown mode

		// private properties
		tables = [],			// table collection
		td_event,				// (boolean) if set to true then cell_init will attach event listener to the table cell
		show_index,				// (boolean) show cell index

		// variables in the private scope revealed as public properties
		color = {cell: false,	// color of marked cell
				row: false,		// color of marked row
				column: false},	// color of marked column
		mark_nonempty = true;	// enable / disable marking not empty table cells.


	/**
	 * Method attaches or removes onmousedown event listener on TD elements depending on second parameter value (default is true).
	 * If third parameter is set to "classname" then tables will be selected by class name (named in first parameter).
	 * All found tables will be saved in internal array.
	 * Sending reference in this case will not be needed when calling merge or split method.
	 * Table cells marked with class name "ignore" will not have attached onmousedown event listener (in short, these table cells will be ignored).
	 * @param {String|HTMLElement} el Container Id. TD elements within container will have added onmousewdown event listener.
	 * @param {Boolean} [flag] If set to true then onmousedown event listener will be attached to every table cell.
	 * @param {String} [type] If set to "class name" then all tables with a given class name (first parameter is considered as class name) will be initialized. Default is container/table reference or container/table id.
	 * @example
	 * // activate onmousedown event listener on cells within table with id="mainTable"
	 * REDIPS.table.onmousedown('mainTable', true);
	 *
	 * // activate onmousedown event listener on cells for tables with class="blue"
	 * REDIPS.table.onmousedown('blue', true, 'classname');
	 * @public
	 * @function
	 * @name REDIPS.table#onmousedown
	 */
	onmousedown = function (el, flag, type) {
		var	td,			// collection of table cells within container
			i, t,		// loop variables
			get_tables;	// private method returns array
		// method returns array with table nodes for a DOM node
		get_tables = function (el) {
			var arr = [],	// result array
				nodes,		// node collection
				i;			// loop variable
			// collect table nodes
			nodes = el.getElementsByTagName('table');
			// open node loop and push to array
			for (i = 0; i < nodes.length; i++) {
				arr.push(nodes[i]);
			}
			// return result array
			return arr;
		};
		// save event parameter to td_event private property
		td_event = flag;
		// if third parameter is set to "classname" then select tables by given class name (first parameter is considered as class name)
		if (typeof(el) === 'string') {
			if (type === 'classname') {
				// collect all tables on the page
				tables = get_tables(document);
				// open loop
				for (i = 0; i < tables.length; i++) {
					// if class name is not found then cut out table from tables collection
					if (tables[i].className.indexOf(el) === -1) {
						tables.splice(i, 1);
						i--;
					}
				}
			}
			// first parameter is string and that should be id of container or id of a table
			else {
				// set object reference (overwrite el parameter)
				el = document.getElementById(el);
			}
		}
		// el is object
		if (el && typeof(el) === 'object') {
			// if container is already a table
			if (el.nodeName === 'TABLE') {
				tables[0] = el;
			}
			// else collect tables within container
			else {
				tables = get_tables(el);
			}
		}
		// at this point tables should contain one or more tables
		for (t = 0; t < tables.length; t++) {
			// collect table cells from the selected table
			td = tables[t].getElementsByTagName('td');
			// loop goes through every collected TD
			for (i = 0; i < td.length; i++) {
				// add or remove event listener
				cell_init(td[i]);
			}
		}
		// show cell index (if show_index public property is set to true)
		cell_index();
	};


	/**
	 * Method attaches "mousedown" event listener to the newly created table cell or removes event listener if needed.
	 * @param {HTMLElement} c Table cell element.
	 * @private
	 * @memberOf REDIPS.table#
	 */
	cell_init = function (c) {
		// if cell contains "ignore" class name then ignore this table cell
		if (c.className.indexOf('ignore') > -1) {
			return;
		}
		// if td_event is set to true then onmousedown event listener will be attached to table cells
		if (td_event === true) {
			REDIPS.event.add(c, 'mousedown', handler_onmousedown);
		}
		else {
			REDIPS.event.remove(c, 'mousedown', handler_onmousedown);

		}
	};


	/**
	 * Method removes attached onmousedown event listener.
	 * Sometimes is needed to manually ignore some cells in table after row/column were dynamically added.
	 * @param {HTMLElement|String} c Cell id or cell reference of table that should be ignored (onmousedown event listener will be removed).
	 * @public
	 * @function
	 * @name REDIPS.table#cell_ignore
	 */
	cell_ignore = function (c) {
		// if input parameter is string then overwrite it with cell reference
		if (typeof(c) === 'string') {
			c = document.getElementById(c);
		}
		// remove onmousedown event listener
		REDIPS.event.remove(c, 'mousedown', handler_onmousedown);
	};


	/**
	 * On mousedown event attached to the table cell. If left mouse button is clicked and table cell is empty then cell will be marked or cleaned.
	 * This event handler is attached to every TD element.
	 * @param {Event} e Event information.
	 * @private
	 * @memberOf REDIPS.table#
	 */
	handler_onmousedown = function (e) {
		var evt = e || window.event,
			td = evt.target || evt.srcElement,
			mouseButton,
			empty;
		// set empty flag for clicked TD element
		// http://forums.asp.net/t/1409248.aspx/1
		empty = (/^\s*$/.test(td.innerHTML)) ? true : false;
		// if "mark_nonempty" is set to false and current cell is not empty then do nothing (just return from the event handler)
		if (REDIPS.table.mark_nonempty === false && empty === false) {
			return;
		}
		// define which mouse button was pressed
		if (evt.which) {
			mouseButton = evt.which;
		}
		else {
			mouseButton = evt.button;
		}
		// if left mouse button is pressed and target cell is empty
		if (mouseButton === 1 /*&& td.childNodes.length === 0*/) {
			// if custom property "redips" doesn't exist then create custom property
			td.redips = td.redips || {};
			// cell is already marked
			if (td.redips.selected === true) {
				// return original background color and reset selected flag
				mark(false, td);
			}
			// cell is not marked
			else {
				mark(true, td);
			}
		}
	};


	/**
	 * Method merges marked table cells horizontally or vertically.
	 * @param {String} mode Merge type: h - horizontally, v - vertically. Default is "h".
	 * @param {Boolean} [clear] true - cells will be clean (without mark) after merging, false -  cells will remain marked after merging. Default is "true".
	 * @param {HTMLElement|String} [table] Table id or table reference.
	 * @public
	 * @function
	 * @name REDIPS.table#merge
	 */
	merge = function (mode, clear, table) {
		var	tbl,		// table array (loaded from tables array or from table input parameter)
			tr,			// row reference in table
			c,			// current cell
			rc1,		// row/column maximum value for first loop
			rc2,		// row/column maximum value for second loop
			marked,		// (boolean) marked flag of current cell
			span,		// (integer) rowspan/colspan value
			id,			// cell id in format "1-2", "1-4" ...
			cl,			// cell list with new coordinates
			t,			// table reference
			i, j,		// loop variables
			first = {index : -1,	// index of first cell in sequence
					span : -1};		// span value (colspan / rowspan) of first cell in sequence
		// remove text selection
		remove_selection();
		// if table input parameter is undefined then use "tables" private property (table array) or set table reference from get_table method
		tbl = (table === undefined) ? tables : get_table(table);
		// open loop for each table inside container
		for (t = 0; t < tbl.length; t++) {
			// define cell list with new coordinates
			cl = cell_list(tbl[t]);
			// define row number in current table
			tr = tbl[t].rows;
			// define maximum value for first loop (depending on mode)
			rc1 = (mode === 'v') ? max_cols(tbl[t]) : tr.length;
			// define maximum value for second loop (depending on mode)
			rc2 = (mode === 'v') ? tr.length : max_cols(tbl[t]);
			// first loop
			for (i = 0; i < rc1; i++) {
				// reset marked cell index and span value
				first.index = first.span = -1;
				// second loop
				for (j = 0; j <= rc2; j++) {
					// set cell id (depending on horizontal/verical merging)
					id = (mode === 'v') ? (j + '-' + i) : (i + '-' + j);
					// if cell with given coordinates (in form like "1-2") exists, then process this cell
					if (cl[id]) {
						// set current cell
						c = cl[id];
						// if custom property "redips" doesn't exist then create custom property
						c.redips = c.redips || {};
						// set marked flag for current cell
						marked = c ? c.redips.selected : false;
						// set opposite span value
						span = (mode === 'v') ? c.colSpan : c.rowSpan;
					}
					else {
						marked = false;
					}
					// if first marked cell in sequence is found then remember index of first marked cell and span value
					if (marked === true && first.index === -1) {
						first.index = j;
						first.span = span;
					}
					// sequence of marked cells is finished (naturally or next cell has different span value)
					else if ((marked !== true && first.index > -1) || (first.span > -1 && first.span !== span)) {
						// merge cells in a sequence (cell list, row/column, sequence start, sequence end, horizontal/vertical mode)
						merge_cells(cl, i, first.index, j, mode, clear);
						// reset marked cell index and span value
						first.index = first.span = -1;
						// if cell is selected then unmark and reset marked flag
						// reseting marked flag is needed in case for last cell in column/row (so merge_cells () outside for loop will not execute)
						if (marked === true) {
							// if clear flag is set to true (or undefined) then clear marked cell after merging
							if (clear === true || clear === undefined) {
								mark(false, c);
							}
							marked = false;
						}
					}
					// increase "j" counter for span value (needed for merging spanned cell and cell after when index is not in sequence)
					if (cl[id]) {
						j += (mode === 'v') ? c.rowSpan - 1: c.colSpan - 1;
					}
				}
				// if loop is finished and last cell is marked (needed in case when TD sequence include last cell in table row)
				if (marked === true) {
					merge_cells(cl, i, first.index, j, mode, clear);
				}
			}
		}
		// show cell index (if show_index public property is set to true)
		cell_index();
	};


	/**
	 * Method merges and deletes table cells in sequence (horizontally or vertically).
	 * @param {Object} cl Cell list (output from cell_list method)
	 * @param {Integer} idx Row/column index in which cells will be merged.
	 * @param {Integer} pos1 Cell sequence start in row/column.
	 * @param {Integer} pos2 Cell sequence end in row/column.
	 * @param {String} mode Merge type: h - horizontally, v - vertically. Default is "h".
	 * @param {Boolean} [clear] true - cells will be clean (without mark) after merging, false -  cells will remain marked after merging. Default is "true".
	 * @private
	 * @memberOf REDIPS.table#
	 */
	merge_cells = function (cl, idx, pos1, pos2, mode, clear) {
		var span = 0,	// set initial span value to 0
			id,			// cell id in format "1-2", "1-4" ...
			fc,			// reference of first cell in sequence
			c,			// reference of current cell
			i;			// loop variable
		// set reference of first cell in sequence
		fc = (mode === 'v') ? cl[pos1 + '-' + idx] : cl[idx + '-' + pos1];
		// delete table cells and sum their colspans
		for (i = pos1 + 1; i < pos2; i++) {
			// set cell id (depending on horizontal/verical merging)
			id = (mode === 'v') ? (i + '-' + idx) : (idx + '-' + i);
			// if cell with given coordinates (in form like "1-2") exists, then process this cell
			if (cl[id]) {
				// define next cell in column/row
				c = cl[id];
				// add colSpan/rowSpan value
				span += (mode === 'v') ? c.rowSpan : c.colSpan;
				// relocate content before deleting cell in merging process
				relocate(c, fc);
				// delete cell
				c.parentNode.deleteCell(c.cellIndex);
			}
		}
		// if cell exists
		if (fc !== undefined) {
			// vertical merging
			if (mode === 'v') {
				fc.rowSpan += span;			// set new rowspan value
			}
			// horizontal merging
			else {
				fc.colSpan += span;			// set new rowspan value
			}
			// if clear flag is set to true (or undefined) then set original background color and reset selected flag
			if (clear === true || clear === undefined) {
				mark(false, fc);
			}
		}
	};


	/**
	 * Method returns number of maximum columns in table (some row may contain merged cells).
	 * @param {HTMLElement|String} table TABLE element.
	 * @private
	 * @memberOf REDIPS.table#
	 */
	max_cols = function (table) {
		var	tr = table.rows,	// define number of rows in current table
			span,				// sum of colSpan values
			max = 0,			// maximum number of columns
			i, j;				// loop variable
		// if input parameter is string then overwrite it with table reference
		if (typeof(table) === 'string') {
			table = document.getElementById(table);
		}
		// open loop for each TR within table
		for (i = 0; i < tr.length; i++) {
			// reset span value
			span = 0;
			// sum colspan value for each table cell
			for (j = 0; j < tr[i].cells.length; j++) {
				span += tr[i].cells[j].colSpan || 1;
			}
			// set maximum value
			if (span > max) {
				max = span;
			}
		}
		// return maximum value
		return max;
	};


	/**
	 * Method splits marked table cell only if cell has colspan/rowspan greater then 1.
	 * @param {String} mode Split type: h - horizontally, v - vertically. Default is "h".
	 * @param {HTMLElement|String} [table] Table id or table reference.
	 * @public
	 * @function
	 * @name REDIPS.table#split
	 */
	split = function (mode, table) {
		var	tbl,	// table array (loaded from tables array or from table input parameter)
			tr,		// row reference in table
			c,		// current table cell
			cl,		// cell list with new coordinates
			rs,		// rowspan cells before
			n,		// reference of inserted table cell
			cols,	// number of columns (used in TD loop)
			max,	// maximum number of columns
			t,		// table reference
			i, j,	// loop variables
			get_rowspan;
		// method returns number of rowspan cells before current cell (in a row)
		get_rowspan = function (c, row, col) {
			var rs,
				last,
				i;
			// set rs
			rs = 0;
			// set row index of bottom row for the current cell with rowspan value
			last = row + c.rowSpan - 1;
			// go through every cell before current cell in a row
			for (i = col - 1; i >= 0; i--) {
				// if cell doesn't exist then rowspan cell exists before
				if (cl[last + '-' + i] === undefined) {
					rs++;
				}
			}
			return rs;
		};
		// remove text selection
		remove_selection();
		// if table input parameter is undefined then use "tables" private property (table array) or set table reference from get_table method
		tbl = (table === undefined) ? tables : get_table(table);
		// loop TABLE
		for (t = 0; t < tbl.length; t++) {
			// define cell list with new coordinates
			cl = cell_list(tbl[t]);
			// define maximum number of columns in table
			max = max_cols(tbl[t]);
			// define row number in current table
			tr = tbl[t].rows;
			// loop TR
			for (i = 0; i < tr.length; i++) {
				// define column number (depending on mode)
				cols = (mode === 'v') ? max : tr[i].cells.length;
				// loop TD
				for (j = 0; j < cols; j++) {
					// split vertically
					if (mode === 'v') {
						// define current table cell
						c = cl[i + '-' + j];
						// if custom property "redips" doesn't exist then create custom property
						if (c !== undefined) {
							c.redips = c.redips || {};
						}
						// if marked cell is found and rowspan property is greater then 1
						if (c !== undefined && c.redips.selected === true && c.rowSpan > 1) {
							// get rowspaned cells before current cell (in a row)
							rs = get_rowspan(c, i, j);
							// insert new cell at last position of rowspan (consider rowspan cells before)
							n = tr[i + c.rowSpan - 1].insertCell(j - rs);
							// set the same colspan value as it has current cell
							n.colSpan = c.colSpan;
							// decrease rowspan of marked cell
							c.rowSpan -= 1;
							// add "redips" property to the table cell and optionally event listener
							cell_init(n);
							// recreate cell list after vertical split (new cell is inserted)
							cl = cell_list(tbl[t]);
						}
					}
					// split horizontally
					else {
						// define current table cell
						c = tr[i].cells[j];
						// if custom property "redips" doesn't exist then create custom property
						c.redips = c.redips || {};
						// if marked cell is found and cell has colspan property greater then 1
						if (c.redips.selected === true && c.colSpan > 1) {
							// increase cols (because new cell is inserted)
							cols++;
							// insert cell after current cell
							n = tr[i].insertCell(j + 1);
							// set the same rowspan value as it has current cell
							n.rowSpan = c.rowSpan;
							// decrease colspan of marked cell
							c.colSpan -= 1;
							// add "redips" property to the table cell and optionally event listener
							cell_init(n);
						}
					}
					// return original background color and reset selected flag (if cell exists)
					if (c !== undefined) {
						mark(false, c);
					}
				}
			}
		}
		// show cell index (if show_index public property is set to true)
		cell_index();
	};


	/**
	 * Method sets reference to the table. It is used in "merge" and "split" public methods.
	 * @param {HTMLElement|String} table Table id or table reference.
	 * @return {Array} Returns empty array or array with one member (table node).
	 * @private
	 * @memberOf REDIPS.table#
	 */
	get_table = function (table) {
		// define output array
		var tbl = [];
		// input parameter should exits
		if (table !== undefined) {
			// if table parameter is string then set reference and overwrite input parameter
			if (typeof(table) === 'string') {
				table = document.getElementById(table);
			}
			// set table reference if table is not null and table is object and node is TABLE
			if (table && typeof(table) === 'object' && table.nodeName === 'TABLE') {
				tbl[0] = table;
			}
		}
		// return table reference as array
		return tbl;
	};


	/**
	 * Method adds / deletes table row. If index is omitted then index of last row will be set.
	 * @param {HTMLElement|String} table Table id or table reference.
	 * @param {String} mode Insert/delete table row
	 * @param {Integer} [index] Index where row will be inserted or deleted. Last row will be assumed if index is not defined.
	 * @return {HTMLElement} Returns reference of inserted row or NULL (in case of deleting row).
	 * @public
	 * @function
	 * @name REDIPS.table#row
	 */
	row = function (table, mode, index) {
		var	nc,			// new cell
			nr = null,	// new row
			fr,			// reference of first row
			c,			// current cell reference
			cl,			// cell list
			cols = 0,	// number of columns
			i, j, k;	// loop variables
		// remove text selection
		remove_selection();
		// if table is not object then input parameter is id and table parameter will be overwritten with table reference
		if (typeof(table) !== 'object') {
			table = document.getElementById(table);
		}
		// if index is not defined then index of the last row
		if (index === undefined) {
			index = -1;
		}
		// insert table row
		if (mode === 'insert') {
			// set reference of first row
			fr = table.rows[0];
			// define number of columns (it is colspan sum)
			for (i = 0; i < fr.cells.length; i++) {
				cols += fr.cells[i].colSpan;
			}
			// insert table row (insertRow returns reference to the newly created row)
			nr = table.insertRow(index);
			// insert table cells to the new row
			for (i = 0; i < cols; i++) {
				nc = nr.insertCell(i);
				// add "redips" property to the table cell and optionally event listener
				cell_init(nc);
			}
			// show cell index (if show_index public property is set to true)
			cell_index();
		}
		// delete table row and update rowspan for cells in upper rows if needed
		else {
			// last row should not be deleted
			if (table.rows.length === 1) {
				return;
			}
			// delete last row
			table.deleteRow(index);
			// prepare cell list
			cl = cell_list(table);
			// set new index for last row
			index = table.rows.length - 1;
			// set maximum number of columns that table has
			cols = max_cols(table);
			// open loop for each cell in last row
			for (i = 0; i < cols; i++) {
				// try to find cell in last row
				c = cl[index + '-' + i];
				// if cell doesn't exist then update colspan in upper cells
				if (c === undefined) {
					// open loop for cells up in column
					for (j = index, k = 1; j >= 0; j--, k++) {
						// try to find cell upper cell with rowspan value
						c = cl[j + '-' + i];
						// if cell is found then update rowspan value
						if (c !== undefined) {
							c.rowSpan = k;
							break;
						}
					}
				}
				// if cell in last row has rowspan greater then 1
				else if (c.rowSpan > 1) {
					c.rowSpan -= 1;
				}
				// increase loop variable "i" for colspan value
				i += c.colSpan - 1;
			}
		}
		// in case of inserting new table row method will return TR reference (otherwise it will return NULL)
		return nr;
	};


	/**
	 * Method adds / deletes table column. Last column will be assumed if index is omitted.
	 * @param {HTMLElement|String} table Table id or table reference.
	 * @param {String} mode Insert/delete table column
	 * @param {Integer} [index] Index where column will be inserted or deleted. Last column will be assumed if index is not defined.
	 * @public
	 * @function
	 * @name REDIPS.table#column
	 */
	column = function (table, mode, index) {
		var	c,		// current cell
			idx,	// cell index needed when column is deleted
			nc,		// new cell
			i;		// loop variable
		// remove text selection
		remove_selection();
		// if table is not object then input parameter is id and table parameter will be overwritten with table reference
		if (typeof(table) !== 'object') {
			table = document.getElementById(table);
		}
		// if index is not defined then index will be set to special value -1 (means to remove the very last column of a table or add column to the table end)
		if (index === undefined) {
			index = -1;
		}
		// insert table column
		if (mode === 'insert') {
			// loop iterates through each table row
			for (i = 0; i < table.rows.length; i++) {
				// insert cell
				nc = table.rows[i].insertCell(index);
				// add "redips" property to the table cell and optionally event listener
				cell_init(nc);
			}
			// show cell index (if show_index public property is set to true)
			cell_index();
		}
		// delete table column
		else {
			// set reference to the first row
			c = table.rows[0].cells;
			// test column number and prevent deleting last column
			if (c.length === 1 && (c[0].colSpan === 1 || c[0].colSpan === undefined)) {
				return;
			}
			// row loop
			for (i = 0; i < table.rows.length; i++) {
				// define cell index for last column
				if (index === -1) {
					idx = table.rows[i].cells.length - 1;
				}
				// if index is defined then use "index" value
				else {
					idx = index;
				}
				// define current cell (it can't use special value -1)
				c = table.rows[i].cells[idx];
				// if cell has colspan value then decrease colspan value
				if (c.colSpan > 1) {
					c.colSpan -= 1;
				}
				// else delete cell
				else {
					table.rows[i].deleteCell(index);
				}
				// increase loop variable "i" for rowspan value
				i += c.rowSpan - 1;
			}
		}
	};


	/**
	 * Method sets or removes mark from table cell. It can be called on several ways:
	 * with direct cell address (cell reference or cell id) or with cell coordinates (row and column).
	 * @param {Boolean} flag If set to true then TD will be marked, otherwise table cell will be cleaned.
	 * @param {HTMLElement|String} el Cell reference or id of table cell. Or it can be table reference or id of the table.
	 * @param {Integer} [row] Row of the cell.
	 * @param {Integer} [col] Column of the cell.
	 * @example
	 * // set mark to the cell with "mycell" reference
	 * REDIPS.table.mark(true, mycell);
	 *
	 * // remove mark from the cell with id "a1"
	 * REDIPS.table.mark(false, "a1");
	 *
	 * // set mark to the cell with coordinates (1,2) on table with reference "mytable"
	 * REDIPS.table.mark(true, mytable, 1, 2);
	 *
	 * // remove mark from the cell with coordinates (4,5) on table with id "t3"
	 * REDIPS.table.mark(false, "t3", 4, 5);
	 * @public
	 * @function
	 * @name REDIPS.table#mark
	 */
	mark = function (flag, el, row, col) {
		// cell list with new coordinates
		var cl;
		// first parameter "flag" should be boolean (if not, then return from method
		if (typeof(flag) !== 'boolean') {
			return;
		}
		// test type of the second parameter (it can be string or object)
		if (typeof(el) === 'string') {
			// set reference to table or table cell (overwrite input el parameter)
			el = document.getElementById(el);
		}
		// if el is not string and is not an object then return from the method
		else if (typeof(el) !== 'object') {
			return;
		}
		// at this point, el should be an object - so test if it's TD or TABLE
		if (el.nodeName === 'TABLE') {
			// prepare cell list
			cl = cell_list(el);
			// set reference to the cell (overwrite input el parameter)
			el = cl[row + '-' + col];
		}
		// if el doesn't exist (el is not set in previous step) or el is not table cell either then return from method
		if (!el || el.nodeName !== 'TD') {
			return;
		}
		// if custom property "redips" doesn't exist then create custom property
		el.redips = el.redips || {};
		// if color property is string, then TD background color will be changed (REDIPS.table.color.cell can be set to false)
		if (typeof(REDIPS.table.color.cell) === 'string') {
			// mark table cell
			if (flag === true) {
				// remember old color
				el.redips.background_old = el.style.backgroundColor;
				// set background color
				el.style.backgroundColor = REDIPS.table.color.cell;
			}
			// umark table cell
			else {
				// return original background color and reset selected flag
				el.style.backgroundColor = el.redips.background_old;
			}
		}
		// set flag (true/false) to the cell "selected" property
		el.redips.selected = flag;

	};


	/**
	 * Method removes text selection.
	 * @private
	 * @memberOf REDIPS.table#
	 */
	remove_selection = function () {
		// remove text selection (Chrome, FF, Opera, Safari)
		if (window.getSelection) {
			window.getSelection().removeAllRanges();
		}
		// IE8
		else if (document.selection && document.selection.type === "Text") {
			try {
				document.selection.empty();
			}
			catch (error) {
				// ignore error to as a workaround for bug in IE8
			}
		}
	};


	/**
	 * Determining a table cell's X and Y position/index.
	 * @see <a href="http://www.javascripttoolbox.com/temp/table_cellindex.html">http://www.javascripttoolbox.com/temp/table_cellindex.html</a>
	 * @see <a href="http://www.barryvan.com.au/2012/03/determining-a-table-cells-x-and-y-positionindex/">http://www.barryvan.com.au/2012/03/determining-a-table-cells-x-and-y-positionindex/</a>
	 * @private
	 * @memberOf REDIPS.table#
	 */
	cell_list = function (table) {
		var matrix = [],
			matrixrow,
			lookup = {},
			c,			// current cell
			ri,			// row index
			rowspan,
			colspan,
			firstAvailCol,
			tr,			// TR collection
			i, j, k, l;	// loop variables
		// set HTML collection of table rows
		tr = table.rows;
		// open loop for each TR element
		for (i = 0; i < tr.length; i++) {
			// open loop for each cell within current row
			for (j = 0; j < tr[i].cells.length; j++) {
				// define current cell
				c = tr[i].cells[j];
				// set row index
				ri = c.parentNode.rowIndex;
				// define cell rowspan and colspan values
				rowspan = c.rowSpan || 1;
				colspan = c.colSpan || 1;
				// if matrix for row index is not defined then initialize array
				matrix[ri] = matrix[ri] || [];
				// find first available column in the first row
				for (k = 0; k < matrix[ri].length + 1; k++) {
					if (typeof(matrix[ri][k]) === 'undefined') {
						firstAvailCol = k;
						break;
					}
				}
				// set cell coordinates and reference to the table cell
				lookup[ri + '-' + firstAvailCol] = c;
				for (k = ri; k < ri + rowspan; k++) {
					matrix[k] = matrix[k] || [];
					matrixrow = matrix[k];
					for (l = firstAvailCol; l < firstAvailCol + colspan; l++) {
						matrixrow[l] = 'x';
					}
				}
			}
		}
		return lookup;
	};


	/**
	 * Method relocates element nodes from source cell to the target table cell.
	 * It is used in case of merging table cells.
	 * @param {HTMLElement} from Source table cell.
	 * @param {HTMLElement} to Target table cell.
	 * @private
	 * @memberOf REDIPS.table#
	 */
	relocate = function (from, to) {
		var cn,		// number of child nodes
			i, j;	// loop variables
		// test if "from" cell is equal to "to" cell then do nothing
		if (from === to) {
			return;
		}
		// define childnodes length before loop
		cn = from.childNodes.length;
		// loop through all child nodes in table cell
		// 'j', not 'i' because NodeList objects in the DOM are live
		for (i = 0, j = 0; i < cn; i++) {
			// relocate only element nodes
			if (from.childNodes[j].nodeType === 1) {
				to.appendChild(from.childNodes[j]);
			}
			// skip text nodes, attribute nodes ...
			else {
				j++;
			}
		}
	};


	/**
	 * Method displays cellIndex for each cell in tables. It is useful in debuging process.
	 * @param {Boolean} flag If set to true then cell content will be replaced with cell index.
	 * @public
	 * @function
	 * @name REDIPS.table#cell_index
	 */
	cell_index = function (flag) {
		// if input parameter isn't set and show_index private property is'nt true, then return
		// input parameter "flag" can be undefined in case of internal calls
		if (flag === undefined && show_index !== true) {
			return;
		}
		// if input parameter is set, then save parameter to the private property show_index
		if (flag !== undefined) {
			// save flag to the show_index private parameter
			show_index = flag;
		}
		// variable declaration
		var tr,			// number of rows in a table
			c,			// current cell
			cl,			// cell list
			cols,		// maximum number of columns that table contains
			i, j, t;	// loop variables
		// open loop for each table inside container
		for (t = 0; t < tables.length; t++) {
			// define row number in current table
			tr = tables[t].rows;
			// define maximum number of columns (table row may contain merged table cells)
			cols = max_cols(tables[t]);
			// define cell list
			cl = cell_list(tables[t]);
			// open loop for each row
			for (i = 0; i < tr.length; i++) {
				// open loop for every TD element in current row
				for (j = 0; j < cols; j++) {
					// if cell exists then display cell index
					if (cl[i + '-' + j]) {
						// set reference to the current cell
						c = cl[i + '-' + j];
						// set innerHTML with cellIndex property
						c.innerHTML = (show_index) ? i + '-' + j : '';
					}
				}
			}
		}
	};


	return {
		/* public properties */
		/**
		 * color.cell defines background color for marked table cell. If not set then background color will not be changed.
		 * @type Object
		 * @name REDIPS.table#color
		 * @default null
		 * @example
		 * // set "#9BB3DA" as color for marked cell
		 * REDIPS.table.color.cell = '#9BB3DA';
		 */
		color : color,
		/**
		 * Enable / disable marking not empty table cells.
		 * @type Boolean
		 * @name REDIPS.table#mark_nonempty
		 * @default true
		 * @example
		 * // allow marking only empty cells
		 * REDIPS.table.mark_nonempty = false;
		 */
		mark_nonempty : mark_nonempty,
		/* public methods are documented in main code */
		onmousedown : onmousedown,
		mark : mark,
		merge : merge,
		split : split,
		row : row,
		column : column,
		cell_index : cell_index,
		cell_ignore : cell_ignore
	};
}());



// if REDIPS.event isn't already defined (from other REDIPS file)
if (!REDIPS.event) {
	REDIPS.event = (function () {
		var add,	// add event listener
			remove;	// remove event listener

		// http://msdn.microsoft.com/en-us/scriptjunkie/ff728624
		// http://www.javascriptrules.com/2009/07/22/cross-browser-event-listener-with-design-patterns/
		// http://www.quirksmode.org/js/events_order.html

		// add event listener
		add = function (obj, eventName, handler) {
			if (obj.addEventListener) {
				// (false) register event in bubble phase (event propagates from from target element up to the DOM root)
				obj.addEventListener(eventName, handler, false);
			}
			else if (obj.attachEvent) {
				obj.attachEvent('on' + eventName, handler);
			}
			else {
				obj['on' + eventName] = handler;
			}
		};

		// remove event listener
		remove = function (obj, eventName, handler) {
			if (obj.removeEventListener) {
				obj.removeEventListener(eventName, handler, false);
			}
			else if (obj.detachEvent) {
				obj.detachEvent('on' + eventName, handler);
			}
			else {
				obj['on' + eventName] = null;
			}
		};

		return {
			add		: add,
			remove	: remove
		}; // end of public (return statement)

	}());
}
