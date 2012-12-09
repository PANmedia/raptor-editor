Raptor.registerUi(new PreviewButton({
    name: 'alignRight',
    action: function() {
        selectionToggleBlockClasses(this.options.cssPrefix + 'right', this.raptor.getElement());
    }
}));
