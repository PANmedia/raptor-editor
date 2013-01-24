Raptor.registerUi(new Button({
    name: 'historyRedo',
    action: function() {
        this.raptor.historyForward();
    }
}));
