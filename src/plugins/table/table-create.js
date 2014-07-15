/**
 * @fileOverview Contains the table menu class code.
 * @license http://www.raptor-editor.com/license
 *
 * @author David Neilsen <david@panmedia.co.nz>
 * @author Michael Robinson <michael@panmedia.co.nz>
 * @author Melissa Richards <melissa@panmedia.co.nz>
 */

/**
 * The table menu class.
 *
 * @constructor
 * @augments Menu
 *
 * @param {Object} options Options hash.
 */
function TableMenu(options) {
    Menu.call(this, {
        name: 'tableCreate'
    });
}

TableMenu.prototype = Object.create(Menu.prototype);

/**
 * Creates the menu table.
 *
 * @param event The mouse event to create the table.
 */
TableMenu.prototype.createTable = function(event) {
    this.raptor.actionApply(function() {
        var table = tableCreate(event.target.cellIndex + 1, event.target.parentNode.rowIndex + 1, {
            placeHolder: '&nbsp;'
        });
        table.className = this.options.cssPrefix + 'table';
        selectionReplace(table);
    }.bind(this));
};

/**
 * Highlights the cells inside the table menu.
 *
 * @param event The mouse event to trigger the function.
 */
TableMenu.prototype.highlight = function(event) {
    var cells = tableCellsInRange(this.menuTable.get(0), {
            x: 0,
            y: 0
        }, {
            x: event.target.cellIndex,
            y: event.target.parentNode.rowIndex
        });

    // highlight cells in menu
    this.highlightRemove(event);
    $(cells).addClass(this.options.baseClass + '-menu-hover');

    // Preview create
    this.raptor.actionPreview(function() {
        var table = tableCreate(event.target.cellIndex + 1, event.target.parentNode.rowIndex + 1, {
            placeHolder: '&nbsp;'
        });
        table.className = this.options.cssPrefix + 'table';
        selectionReplace(table);
    }.bind(this));
};

/**
 * Removes the highlight from the table menu.
 *
 * @param event The mouse event to trigger the function.
 */
TableMenu.prototype.highlightRemove = function(event) {
    this.menuTable
        .find('.' + this.options.baseClass + '-menu-hover')
        .removeClass(this.options.baseClass + '-menu-hover');
    this.raptor.actionPreviewRestore();
};

/**
 * Prepares and returns the menu for use in the Raptor UI.
 * @returns {Element}
 */
TableMenu.prototype.getMenu = function() {
    if (!this.menu) {
        this.menuContent = this.raptor.getTemplate('table.create-menu', this.options);
        Menu.prototype.getMenu.call(this)
            .on('click', 'td', this.createTable.bind(this))
            .on('mouseenter', 'td', this.highlight.bind(this))
            .mouseleave(this.highlightRemove.bind(this));
        this.menuTable = this.menu.find('table:eq(0)');
    }
    return this.menu;
};

Raptor.registerUi(new TableMenu());
