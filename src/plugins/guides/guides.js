Raptor.registerUi(new PreviewButton({
    name: 'guides',
    action: function() {
        var className = this.options.baseClass + '-visible',
            element = this.raptor.getElement();
        if (element.hasClass(className)) {
            element.removeClass(className);
            aButtonInactive(this.button);
        } else {
            element.addClass(className);
            aButtonActive(this.button);
        }
    }
}));
