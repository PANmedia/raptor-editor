Raptor.registerUi(new Button({
    name: 'historyRedo',
    hotkey: ['ctrl+y', 'ctrl+shift+z'],

    action: function() {
        this.raptor.historyForward();
    },

    init: function () {
        this.raptor.bind('historyChange', this.historyChange.bind(this));
        Button.prototype.init.apply(this, arguments);
        aButtonDisable(this.butotn);
        return this.button;
    },

    historyChange: function() {
        if (this.raptor.present < this.raptor.history.length - 1) {
            aButtonEnable(this.button);
        } else {
            aButtonDisable(this.button);
        }
    }
}));
