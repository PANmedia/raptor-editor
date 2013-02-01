Raptor.registerUi(new Button({
    name: 'historyUndo',
    hotkey: 'ctrl+z',

    action: function() {
        this.raptor.historyBack();
    },

    init: function () {
        this.raptor.bind('historyChange', this.historyChange.bind(this));
        Button.prototype.init.apply(this, arguments);
        aButtonDisable(this.butotn);
        return this.button;
    },

    historyChange: function() {
        if (this.raptor.present === 0) {
            aButtonDisable(this.button);
        } else {
            aButtonEnable(this.button);
        }
    }
}));
