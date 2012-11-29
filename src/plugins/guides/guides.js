Raptor.registerUi(new PreviewButton({
    name: 'guides',
    action: function() {
        this.raptor.getElement().toggleClass(this.options.baseClass + '-visible');
    }
}));
