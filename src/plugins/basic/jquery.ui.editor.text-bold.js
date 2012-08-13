$.ui.editor.registerUi('textBold', new Button({
    options: {
        title: _('Bold'),
        tag: 'strong',
        classes: null
    },
    init: function() {
        this.parent.init.apply(this, arguments);
        if (this.options.classes === null) {
            this.options.classes = this.options.cssPrefix + 'bold';
        }
    },
    action: function() {
        selectionToggleWrapper('strong', { 
            classes: this.options.classes
        });
    }
}));
