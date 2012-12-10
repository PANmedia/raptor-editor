Raptor.registerUi(new PreviewButton({
    name: 'alignLeft',
    action: function() {
        selectionToggleBlockClasses(this.options.cssPrefix + 'left', this.raptor.getElement());
    }
}));
