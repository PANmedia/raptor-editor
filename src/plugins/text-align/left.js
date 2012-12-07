Raptor.registerUi(new PreviewButton({
    name: 'alignLeft',
    action: function() {
        selectionToggleBlockClass(this.options.cssPrefix + 'left', this.raptor.getElement());
    }
}));
