Raptor.registerUi(new PreviewButton({
    name: 'alignJustify',
    action: function() {
        selectionToggleBlockClass(this.options.cssPrefix + 'justify', this.raptor.getElement());
    }
}));
