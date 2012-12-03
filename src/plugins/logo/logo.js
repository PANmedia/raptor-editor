Raptor.registerUi(new Button({
    name: 'logo',
    init: function() {
        var button = Button.prototype.init.apply(this, arguments);

        var data = {
            enableUi: this.raptor.options.enableUi,
            enablePlugins: this.raptor.options.enablePlugins,
            disabledPlugins: this.raptor.options.disabledPlugins,
            ui: this.options.ui,
            layout: this.options.layout,
            t: new Date().getTime()
        };

        button.find('.ui-button-icon-primary').css({
            'background-image': 'url(http://www.jquery-raptor.com/logo/VERSION?json=' + encodeURIComponent(JSON.stringify(data)) + ')'
        });
        
        return button;
    },
    action: function() {
        window.open('http://www.jquery-raptor.com/about/editors/', '_blank');
    }
}));
