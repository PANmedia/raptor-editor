function TagMenu(options) {
    SelectMenu.call(this, {
        name: 'tagMenu'
    });
}

TagMenu.prototype = Object.create(SelectMenu.prototype);

TagMenu.prototype.apply = function(event) {
};

TagMenu.prototype.preview = function(event) {
};

TagMenu.prototype.previewRestore = function(event) {
};

TagMenu.prototype.getMenuItems = function() {
    if (!this.menuItems) {
        this.menuItems = this.editor.getTemplate('tag-menu.menu', this.options);
    }
    
};

TagMenu.prototype.getMenu = function() {
    if (!this.menu) {
        this.menuContent = this.editor.getTemplate('tag-menu.menu', this.options);
        console.log(this.menuContent = $(this.menuContent).menu());
        SelectMenu.prototype.getMenu.call(this)
            .on('click', 'li', this.apply.bind(this))
            .on('mouseenter', 'li', this.preview.bind(this))
            .mouseleave(this.previewRestore.bind(this));
    }
    return this.menu;
}

Raptor.registerUi(new TagMenu());
