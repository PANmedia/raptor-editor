function TableMenu(options) {
    Menu.call(this, {
        name: 'tableCreate'
    });
}

TableMenu.prototype = Object.create(Menu.prototype);

TableMenu.prototype.createTable = function(event) {
    this.raptor.actionApply(function() {
        selectionReplace(tableCreate(event.target.cellIndex + 1, event.target.parentNode.rowIndex + 1, {
            placeHolder: '&nbsp;'
        }));
    });
};

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
        selectionReplace(tableCreate(event.target.cellIndex + 1, event.target.parentNode.rowIndex + 1, {
            placeHolder: '&nbsp;'
        }));
    });
};

TableMenu.prototype.highlightRemove = function(event) {
    this.menuTable
        .find('.' + this.options.baseClass + '-menu-hover')
        .removeClass(this.options.baseClass + '-menu-hover');
    this.raptor.actionPreviewRestore();
};

TableMenu.prototype.getMenu = function() {
    if (!this.menu) {
        this.menuContent = this.editor.getTemplate('table.create-menu', this.options);
        Menu.prototype.getMenu.call(this)
            .on('click', 'td', this.createTable.bind(this))
            .on('mouseenter', 'td', this.highlight.bind(this))
            .mouseleave(this.highlightRemove.bind(this));
        this.menuTable = this.menu.find('table:eq(0)');
    }
    return this.menu;
}

Raptor.registerUi(new TableMenu());
