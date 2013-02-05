function TextAlignButton(options) {
    PreviewToggleButton.call(this, $.extend({
        action: function() {
            selectionToggleBlockClasses([
                this.getClass()
            ], [
                this.options.cssPrefix + 'center',
                this.options.cssPrefix + 'left',
                this.options.cssPrefix + 'right',
                this.options.cssPrefix + 'justify'
            ], this.raptor.getElement());
            this.selectionChange();
        },
        selectionToggle: function() {
            return rangy.getSelection().getAllRanges().length > 0 &&
                selectionContains('.' + this.getClass(), this.raptor.getElement());
        }
    }, options));
}

TextAlignButton.prototype = Object.create(PreviewToggleButton.prototype);
