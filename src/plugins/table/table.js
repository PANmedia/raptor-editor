function TableMenu() {
    Menu.call(this);
    this.buttonText = 'Create Table';
}

TableMenu.prototype = new Menu();
TableMenu.prototype.constructor = TableMenu;

TableMenu.prototype.createTable = function() {
    var x = event.target.cellIndex,
        y = event.target.parentNode.rowIndex;
    selectionReplace(tableCreate(x + 1, y + 1));
};

TableMenu.prototype.highLight = function(event) {
    var table = $(event.target).closest('table'),
        cells = tableCellsInRange(table.get(0), {
            x: 0,
            y: 0
        }, {
            x: event.target.cellIndex,
            y: event.target.parentNode.rowIndex
        });
    table
        .find('.ui-editor-table-menu-hover')
        .removeClass('ui-editor-table-menu-hover');
    for (var i = 0; i < cells.length; i++) {
        $(cells[i]).addClass('ui-editor-table-menu-hover');
    }
};

TableMenu.prototype.getMenu = function() {
    this.menuContent = this.editor.getTemplate('table.menu');
    if (!this.menu) {
        var menu = Menu.prototype.getMenu.call(this)
            .on('click', 'td', this.createTable.bind(this))
            .on('mouseover', 'td', this.highLight.bind(this));
    }
    return this.menu;
}

$.ui.editor.registerUi('tableCreate', new TableMenu());
