var linkDialog = null
    linkDialogInstance = null;

Raptor.registerUi(new Button({
    name: 'linkCreate',
    state: null,

    action: function() {
        this.state = this.raptor.stateSave();
        aDialogOpen(this.getDialog(this));
    },

    applyLink: function(attributes) {
        this.raptor.stateRestore(this.state);
        this.raptor.actionApply(function() {
            var applier = rangy.createApplier({
                tag: 'a',
                attributes: attributes
            });
            applier.applyToSelection();
        });
    },

    getDialog: function(instance) {
        linkDialogInstance = instance;
        if (!linkDialog) {
            linkDialog = $(this.raptor.getTemplate('link.dialog', this.options));

            var menu = linkDialog.find('[data-menu]'),
                content = linkDialog.find('[data-content]'),
                linkTypes = [
                    new LinkTypeInternal(this.raptor),
                    new LinkTypeExternal(this.raptor),
                    new LinkTypeEmail(this.raptor)
                ];

            for (var i = 0, l = linkTypes.length; i < l; i++) {
                $(this.raptor.getTemplate('link.label', linkTypes[i]))
                    .click(function() {
                        content.children('div').hide();
                        content.children('div:eq(' + $(this).index() + ')').show();
                    })
                    .find(':radio')
                        .val(i)
                    .end()
                    .appendTo(menu);
                $('<div>')
                    .append(linkTypes[i].getContent())
                    .hide()
                    .appendTo(content);
            }
            menu.find(':radio:first').prop('checked', true);
            content.children('div:first').show();

            aDialog(linkDialog, {
                modal: true,
                resizable: true,
                autoOpen: false,
                title: _('linkDialogTitle'),
                dialogClass: this.options.dialogClass,
                width: 850,
                buttons: [
                    {
                        text: _('linkDialogOKButton'),
                        click: function() {
                            var index = menu.find(':radio:checked').val(),
                                linkType = linkTypes[index],
                                attributes = linkType.getAttributes(content.children('div:eq(' + index + ')'));
                            if (attributes !== false) {
                                aDialogClose(linkDialog);
                                linkDialogInstance.applyLink(attributes);
                            }
                        }.bind(this),
                        icons: {
                            primary: 'ui-icon-circle-check'
                        }
                    },
                    {
                        text: _('linkDialogCancelButton'),
                        click: function() {
                            aDialogClose(linkDialog);
                        },
                        icons: {
                            primary: 'ui-icon-circle-close'
                        }
                    }
                ]
            });
        }
        return linkDialog;
    }
}));
