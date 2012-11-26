Raptor.registerUi('textBlockQuote', new Button({
    name: 'block-quote',
    action: function() {
        selectionToggleWrapper('blockquote', { 
            classes: this.options.classes || this.options.cssPrefix + 'blockquote' 
        });
    }
}));
