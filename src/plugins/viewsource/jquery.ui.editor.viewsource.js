/**
 * @fileOverview View source UI component
 * @author David Neilsen david@panmedia.co.nz
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
         * @see $.ui.editor.defaultUi#init
         */
        init: function(editor, options) {
//            editor.bind('hide', this.hide, this);

            return editor.uiButton({
                title: _('View / Edit Source'),
                click: function() {
                    this.show();
                }
            });
        },

        /**
         * Show the view source dialog. Disable the button.
         */
        show: function() {
            var ui = this;

            var dialog = $(this.editor.getTemplate('viewsource.dialog', {
                baseClass: ui.options.baseClass,
                source: ui.editor.getHtml()
            }));

            var button = this.ui.button;
            $(button).button('option', 'disabled', true);

            dialog.dialog({
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
                            var html = $(this).find('textarea').val();
                            ui.editor.setHtml(html);
                            $(this).find('textarea').val(ui.editor.getHtml());
                        }
                    },
                    {
                        text: _('Close'),
                        click: function() {
                            $(this).dialog('close');
                        }
                    }
                ],
                open: function() {
                    var buttons = $(this).parent().find('.ui-dialog-buttonpane');
                    buttons.find('button:eq(0)').button({ icons: { primary: 'ui-icon-circle-check' }});
                    buttons.find('button:eq(1)').button({ icons: { primary: 'ui-icon-circle-close' }});
                },
                close: function() {
                    $(this).dialog('destroy').remove();
                    $(button).button('option', 'disabled', false);
                    ui.editor.checkChange();
                }
            });
        }
    }
});