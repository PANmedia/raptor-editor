function ToggleButton(options) {
    this.disable = false;
    Button.call(this, options);
}

ToggleButton.prototype = Object.create(Button.prototype);

ToggleButton.prototype.init = function() {
    this.raptor.bind('selectionChange', this.selectionChange.bind(this));
    return Button.prototype.init.apply(this, arguments);
};

ToggleButton.prototype.selectionChange = function() {
    if (this.selectionToggle()) {
        aButtonActive(this.button);
        if (this.disable) {
            aButtonEnable(this.button);
        }
    } else {
        aButtonInactive(this.button);
        if (this.disable) {
            aButtonDisable(this.button);
        }
    }
};
