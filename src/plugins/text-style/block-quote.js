Raptor.registerUi('textBlockQuote', new Button({
    action: function() {
        selectionToggleWrapper('blockquote', { 
            classes: this.options.classes || this.options.cssPrefix + 'blockquote' 
        });
    }
}));
