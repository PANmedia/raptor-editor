/**
 * @fileOverview View source UI component
 * @author David Neilson david@panmedia.co.nz
 * @author Michael Robinson michael@panmedia.co.nz
 */
 $.ui.editor.registerUi({

    /**
     * @name $.editor.ui.viewSource
     * @augments $.ui.editor.defaultUi
     * @class Shows a dialog containing the element's markup, allowing the user to edit the source directly
     */
    viewSource: /** @lends $.editor.ui.viewSource.prototype */ {

        /**
         * Reference to the view source dialog
         * @type {Object}
         */
        dialog: null,

        /**
         * @see $.ui.editor.defaultUi#init
         */
        init: function(editor, options) {
            editor.bind('hide', this.hide, this);

            return editor.uiButton({
                title: _('View / Edit Source'),
                click: function() {
                    this.show();
                }
            });
        },

        /**
         * Hide, destroy & remove the view source dialog. Enable the button.
         */
        hide: function() {
            if (this.dialog) $(this.dialog).dialog('destroy').remove();
            this.dialog = null;
            $(this.ui.button).button('option', 'disabled', false);
        },

        /**
         * Show the view source dialog. Disable the button.
         */
        show: function() {
            if (!this.dialog) {
                $(this.ui.button).button('option', 'disabled', true);
                var ui = this;
                this.dialog = $(this.editor.getTemplate('viewsource.dialog'));
                this.dialog.dialog({
                    modal: false,
                    width: 600,
                    height: 400,
                    resizable: true,
                    title: _('View Source'),
                    autoOpen: true,
                    dialogClass: ui.options.baseClass + ' ' + ui.options.dialogClass,
                    buttons: [
                        {
                            text: _('Apply Source'),
                            click: function() {
                                ui.editor.setHtml($(this).find('textarea').val());
                            }
                        },
                        {
                            text: _('Close'),
                            click: function() {
                                ui.hide();
                            }
                        }
                    ],
                    open: function() {
                        var buttons = $(this).parent().find('.ui-dialog-buttonpane');
                        buttons.find('button:eq(0)').button({ icons: { primary: 'ui-icon-circle-check' }});
                        buttons.find('button:eq(1)').button({ icons: { primary: 'ui-icon-circle-close' }});

                        $(this).find('textarea').val($.trim(ui.editor.getHtml()));
                    },
                    close: function() {
                        ui.hide();
                    }
                });
            }
        }
    }
});