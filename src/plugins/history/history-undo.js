Raptor.registerUi(new Button({
    name: 'historyUndo',
    action: function() {
        this.raptor.historyBack();
    }
}));
