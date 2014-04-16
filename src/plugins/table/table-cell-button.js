/**
 * @fileOverview Contains the table cell button class code.
 * @license http://www.raptor-editor.com/license
 *
 * @author David Neilsen <david@panmedia.co.nz>
 * @author Michael Robinson <michael@panmedia.co.nz>
 * @author Melissa Richards <melissa@panmedia.co.nz>
 */

/**
 * The table cell button class.
 *
 * @constructor
 * @augments FilteredPreviewButton
 *
 * @param {Object} options Options hash.
 */
function TableCellButton(options) {
    FilteredPreviewButton.call(this, options);
}

TableCellButton.prototype = Object.create(FilteredPreviewButton.prototype);

/**
 * @todo
 *
 * @param {RangySelection} range The selection to get the cell from.
 * @returns {Element|null}
 */
TableCellButton.prototype.getElement = function(range) {
    var cell = $(range.commonAncestorContainer.parentNode).closest('td, th');
    if (cell.length && !cell.find(this.raptor.getElement()).length) {
        return cell[0];
    }
    return null;
};
