function HistoryUndoButton(options) {
    Button.call(this, options);
}

HistoryUndoButton.prototype = Object.create(Button.prototype);

HistoryUndoButton.prototype.init = function() {
    this.raptor.bind('historychange', this.historyChange.bind(this));
    return Button.prototype.init.apply(this, arguments);
};

Raptor.registerUi(new HistoryUndoButton({
    name: 'historyUndo',
    action: function() {
        this.raptor.historyBack();
    },
    getButton: function() {
        var button = Button.prototype.getButton.call(this);
        aButtonDisable(button);
        return button;
    },
    historyChange: function() {
        if (this.raptor.present === 0) {
            aButtonDisable(this.button);
        } else {
            aButtonEnable(this.button);
        }
    }
}));
