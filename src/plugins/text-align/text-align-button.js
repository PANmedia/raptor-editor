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
            var result = true;
            selectionEachBlock(function(block) {
                if (!$(block).hasClass(this.getClass())) {
                    result = false;
                }
            }.bind(this), this.raptor.getElement());
            return result;
        }
    }, options));
}

TextAlignButton.prototype = Object.create(PreviewToggleButton.prototype);
