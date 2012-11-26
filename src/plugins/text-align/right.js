Raptor.registerUi(new PreviewButton({
    name: 'alignRight',
    action: function() {
        selectionToggleBlockStyle({
            'text-align': 'right'
        }, this.raptor.getElement());
    }
}));
