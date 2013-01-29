function HistoryRedoButton(options) {
    Button.call(this, options);
}

HistoryRedoButton.prototype = Object.create(Button.prototype);

HistoryRedoButton.prototype.init = function() {
    this.raptor.bind('historychange', this.historyChange.bind(this));
    return Button.prototype.init.apply(this, arguments);
};

Raptor.registerUi(new HistoryRedoButton({
    name: 'historyRedo',
    action: function() {
        this.raptor.historyForward();
    },
    getButton: function() {
        var button = Button.prototype.getButton.call(this);
        aButtonDisable(button);
        return button;
    },
    historyChange: function() {
        if (this.raptor.present < this.raptor.history.length - 1) {
            aButtonEnable(this.button);
        } else {
            aButtonDisable(this.button);
        }
    }
}));
