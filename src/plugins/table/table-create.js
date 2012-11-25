
function TableMenu() {
    Menu.call(this);
    this.buttonText = 'Create Table';
}

TableMenu.prototype = new Menu();
TableMenu.prototype.constructor = TableMenu;

TableMenu.prototype.createTable = function() {
    var x = event.target.cellIndex,
        y = event.target.parentNode.rowIndex;
    this.raptor.actionApply(function() {
        
        selectionReplace(tableCreate(x + 1, y + 1, {
            placeHolder: '&nbsp;'
        }));
        // selectionReplace(tableCreate(event.target.cellIndex + 1, event.target.parentNode.rowIndex + 1));
    });
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
        .find('.' + this.options.baseClass + '-menu-hover')
        .removeClass(this.options.baseClass + '-menu-hover');
    for (var i = 0; i < cells.length; i++) {
        $(cells[i]).addClass(this.options.baseClass + '-menu-hover');
    }
};

TableMenu.prototype.getMenu = function() {
    this.menuContent = this.editor.getTemplate('table.create-menu', this.options);
    if (!this.menu) {
        var menu = Menu.prototype.getMenu.call(this)
            .on('click', 'td', this.createTable.bind(this))
            .on('mouseover', 'td', this.highLight.bind(this));
    }
    return this.menu;
}

Raptor.registerUi('tableCreate', new TableMenu());
