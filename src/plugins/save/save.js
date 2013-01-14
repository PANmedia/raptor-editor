Raptor.registerUi(new Button({
    name: 'save',

    action: function() {
        this.getPlugin().save();
    },

    init: function() {
        var result = Button.prototype.init.apply(this, arguments);

        // <strict>
        if (!this.getPlugin()) {
            handleError('Cannot find save plugin for UI.');
        }
        // </strict>

        this.raptor.bind('dirty', this.dirty.bind(this));
        this.raptor.bind('cleaned', this.clean.bind(this));
        this.clean();
        return result;
    },

    getPlugin: function() {
        return this.raptor.getPlugin(this.options.plugin);
    },

    dirty: function() {
        aButtonEnable(this.button);
    },

    clean: function() {
        aButtonDisable(this.button);
    }
}));
