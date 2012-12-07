Raptor.registerUi(new PreviewButton({
    name: 'alignRight',
    action: function() {
        selectionToggleBlockClass(this.options.cssPrefix + 'right', this.raptor.getElement());
    }
}));
