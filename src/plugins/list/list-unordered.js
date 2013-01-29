Raptor.registerUi(new PreviewButton({
    name: 'listUnordered',
    init: function() {
        var result = SelectMenu.prototype.init.call(this);
        if (elementIsValid(this.raptor.getElement(), listValidParents())) {
            this.raptor.bind('selectionChange', this.updateButton.bind(this));
            return result;
        }
        return;
    },
    action: function() {
        listToggle('ul', 'li', this.raptor.getElement());
    }
}));
