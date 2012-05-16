/**
 * @fileOverview embed UI component
 * @author David Neilsen david@panmedia.co.nz
 * @author Michael Robinson michael@panmedia.co.nz
 */
 $.ui.editor.registerUi({

    /**
     * @name $.editor.ui.embed
     * @augments $.ui.editor.defaultUi
     * @class Shows a dialog containing the element's markup, allowing the user to edit the source directly
     */
    embed: /** @lends $.editor.ui.embed.prototype */ {

        /**
         * Reference to the embed dialog
         * @type {Object}
         */
        dialog: null,

        /**
         * @see $.ui.editor.defaultUi#init
         */
        init: function(editor, options) {
            editor.bind('hide', this.hide, this);
            return editor.uiButton({
                icon: 'ui-icon-youtube',
                title: _('Embed object'),
                click: function() {
                    this.show();
                }
            });
        },

        /**
         * Hide, destroy & remove the embed dialog. Enable the button.
         */
        hide: function() {
            if (this.dialog) $(this.dialog).dialog('destroy').remove();
            this.dialog = null;
            $(this.ui.button).button('option', 'disabled', false);
        },

        /**
         * Show the embed dialog. Disable the button.
         */
        show: function() {
            if (!this.dialog) {
                $(this.ui.button).button('option', 'disabled', true);
                var ui = this;
                var selection = rangy.saveSelection();

                this.dialog = $(this.editor.getTemplate('embed.dialog'));
                this.dialog.dialog({
                    modal: false,
                    width: 600,
                    height: 400,
                    resizable: true,
                    title: _('embed'),
                    autoOpen: true,
                    dialogClass: ui.options.baseClass + ' ' + ui.options.dialogClass,
                    buttons: [
                        {
                            text: _('Embed Object'),
                            click: function() {
                                rangy.restoreSelection(selection);
                                ui.editor.replaceSelection($(this).find('textarea').val());
                                $(this).dialog('close');
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
                    },
                    close: function() {
                        ui.hide();
                    }
                });
            }
        }
    }
});