Raptor.registerUi('textBold', new Button({
    name: 'bold',
    title: _('bold'),
    hotkey: 'ctrl+b',
    applier: null,
    options: {
        tag: null,
        classes: null,
        cssPrefix: null
    },

    action: function() {
        var ranges = this.raptor.getRanges();
        this.getApplier().toggleRanges(ranges);
    },

    getApplier: function() {
        if (this.applier === null) {
            this.applier = rangy.createCssClassApplier(this.getClass(), {
                elementTagName: this.getTag()
            });
        }
        return this.applier;
    },

    getTag: function() {
        return this.options.tag || 'strong';
    },

    getClass: function() {
        return this.options.classes || this.options.cssPrefix + 'bold'
    }
}));
