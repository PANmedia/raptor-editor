function TableMenu(options) {
    Menu.call(this, {
        name: 'tableCreate'
    });
}

TableMenu.prototype = Object.create(Menu.prototype);

TableMenu.prototype.createTable = function() {
    this.raptor.actionApply(function() {
        selectionReplace(tableCreate(event.target.cellIndex + 1, event.target.parentNode.rowIndex + 1, {
            placeHolder: '&nbsp;'
        }));
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
    if (!this.menu) {
        this.menuContent = this.editor.getTemplate('table.create-menu', this.options);
        var menu = Menu.prototype.getMenu.call(this)
            .on('click', 'td', this.createTable.bind(this))
            .on('mouseover', 'td', this.highLight.bind(this));
    }
    return this.menu;
}

Raptor.registerUi(new TableMenu());
