Raptor.registerUi(new PreviewButton({
    name: 'alignCenter',
    action: function() {
        selectionToggleBlockClass(this.options.cssPrefix + 'center', this.raptor.getElement());
    }
}));
