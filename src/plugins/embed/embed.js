var embedDialog = null,
    embedInstance = null;

Raptor.registerUi(new Button({
    name: 'embed',
    state: null,

    action: function() {
        this.state = this.raptor.stateSave();
        aDialogOpen(this.getDialog(this));
    },

    embedObject: function(object) {
        this.raptor.stateRestore(this.state);
        this.raptor.actionApply(function() {
            selectionReplace(object);
        });
    },

    getDialog: function(instance) {
        embedInstance = instance;
        if (!embedDialog) {
            embedDialog = $('<div>').html(this.editor.getTemplate('embed.dialog', this.options));
            aDialog(embedDialog, {
                modal: true,
                width: 600,
                height: 400,
                resizable: true,
                autoOpen: false,
                title: _('embedDialogTitle'),
                dialogClass: this.options.baseClass + '-dialog',
                buttons: [
                    {
                        text: _('embedDialogOKButton'),
                        click: function() {
                            embedInstance.embedObject(embedDialog.find('textarea').val());
                            embedDialog.dialog('close');
                        },
                        icons: {
                            primary: 'ui-icon-circle-check'
                        }
                    },
                    {
                        text: _('embedDialogCancelButton'),
                        click: function() {
                            ui.hide();
                        },
                        icons: {
                            primary: 'ui-icon-circle-close'
                        }
                    }
                ]
            });

            embedDialog.find('textarea').change(function(event) {
                embedDialog.find('.' + this.options.baseClass + '-preview').html($(event.target).val());
            }.bind(this));

            // Create fake jQuery UI tabs (to prevent hash changes)
            var tabs = embedDialog.find('.' + this.options.baseClass + '-panel-tabs');
            tabs.find('li')
                .click(function() {
                    tabs.find('ul li').removeClass('ui-state-active').removeClass('ui-tabs-selected');
                    $(this).addClass('ui-state-active').addClass('ui-tabs-selected');
                    tabs.children('div').hide().eq($(this).index()).show();
                });
        }
        return embedDialog;
    }
}));
