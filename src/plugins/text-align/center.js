Raptor.registerUi(new PreviewButton({
    name: 'alignCenter',
    action: function() {
        selectionToggleBlockClasses(this.options.cssPrefix + 'center', this.raptor.getElement());
    }
}));
