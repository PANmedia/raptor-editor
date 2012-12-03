function TableCellButton(options) {
    FilteredPreviewButton.call(this, options);
}

TableCellButton.prototype = Object.create(FilteredPreviewButton.prototype);

TableCellButton.prototype.getElement = function(range) {
    var cell = range.commonAncestorContainer.parentNode;
    if (cell.tagName === 'TD' ||
            cell.tagName === 'TH') {
        return cell;
    }
    return null;
};
