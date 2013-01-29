Raptor.registerUi(new DialogButton({
    name: 'embed',
    state: null,
    dialogOptions: {
        width: 600,
        height: 400
    },

    applyAction: function(dialog) {
        this.raptor.actionApply(function() {
            selectionReplace(dialog.find('textarea').val());
        });
    },

    getDialogTemplate: function() {
        var template = $('<div>').html(this.raptor.getTemplate('embed.dialog', this.options));

        template.find('textarea').change(function(event) {
            template.find('.' + this.options.baseClass + '-preview').html($(event.target).val());
        }.bind(this));

        // Create fake jQuery UI tabs (to prevent hash changes)
        var tabs = template.find('.' + this.options.baseClass + '-panel-tabs');
        tabs.find('li')
            .click(function() {
                tabs.find('ul li').removeClass('ui-state-active').removeClass('ui-tabs-selected');
                $(this).addClass('ui-state-active').addClass('ui-tabs-selected');
                tabs.children('div').hide().eq($(this).index()).show();
            });
        return template;
    }
}));
