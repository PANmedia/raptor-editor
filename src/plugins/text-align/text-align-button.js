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
                // Check if selection only contains valid children
                var children = $(range.commonAncestorContainer).find('*');
                if ($(range.commonAncestorContainer).parentsUntil(this.raptor.getElement(), '.' + this.getClass()).length === 0 &&
                        children.length !== children.filter('.' + this.getClass()).length) {
                    result = false;
                }
            }.bind(this));
            return result;
        }
    }, options));
}

TextAlignButton.prototype = Object.create(PreviewToggleButton.prototype);
