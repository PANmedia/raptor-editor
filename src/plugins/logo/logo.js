Raptor.registerUi(new Button({
    name: 'logo',
    init: function() {
        var button = Button.prototype.init.apply(this, arguments);

        button.find('.ui-button-icon-primary').css({
            'background-image': 'url(http://www.raptor-editor.com/logo/VERSION?json=' +
                encodeURIComponent(JSON.stringify(this.raptor.options)) + ')'
        });

        return button;
    },
    action: function() {
        window.open('http://www.raptor-editor.com/about/VERSION', '_blank');
    }
}));
