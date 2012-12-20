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
            selectionEachRange(function(range) {
                if ($(range.commonAnsestor).parentsUntil(this.raptor.getElement(), '.' + this.getClass()).length === 0) {
                    result = false;
                }
            }.bind(this));
            return result;
        }
    }, options));
}

TextAlignButton.prototype = Object.create(PreviewToggleButton.prototype);
