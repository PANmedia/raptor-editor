Raptor.registerUi(new Button({
    name: 'textBlockQuote',
    action: function() {
        selectionToggleWrapper('blockquote', { 
            classes: this.options.classes || this.options.cssPrefix + 'blockquote' 
        });
    }
}));
