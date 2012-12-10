Raptor.registerUi(new PreviewButton({
    name: 'alignJustify',
    action: function() {
        selectionToggleBlockClasses(this.options.cssPrefix + 'justify', this.raptor.getElement());
    }
}));
