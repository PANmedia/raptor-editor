Raptor.registerUi(new PreviewButton({
    name: 'guides',
    action: function() {
        console.log(this.raptor.getElement().is('.raptor-ui-guides-visible'));
        this.raptor.getElement().toggleClass(this.options.baseClass + '-visible');
    }
}));
