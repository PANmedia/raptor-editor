/**
 * @fileOverview Cancel plugin & ui component
 * @author David Neilsen david@panmedia.co.nz
 * @author Michael Robinson michael@panmedia.co.nz
 */

 /**
  * @name $.editor.ui.cancel
  * @augments $.ui.editor.defaultUi
  * @class Cancels editing
  */
$.ui.editor.registerUi({
    cancel: /** @lends $.editor.ui.cancel.prototype */ {

        hotkeys: {
            'ctrl+k': {
                'action': function() {
                    this.ui.click();
                }
            }
        },

        /**
         * @see $.ui.editor.defaultUi#init
         */
        init: function(editor) {
            return editor.uiButton({
                name: 'cancel',
                title: _('Cancel'),
                icons: { primary: 'ui-icon-cancel' },
                dialog: null,
                click: function() {
                    this.confirm();
                }
            });
        },

        /**
         * If the editor is dirty, inform the user that to cancel editing will discard their unsaved changes.
         * If the user accepts of if the editor is not dirty, cancel editing.
         */
        confirm: function() {
            var plugin = this.editor.getPlugin('cancel');
            var editor = this.editor;
            if (!editor.isDirty()) {
                plugin.cancel();
            } else {
                if (!this.dialog) this.dialog = $(editor.getTemplate('cancel.dialog'));
                this.dialog.dialog({
                    modal: true,
                    resizable: false,
                    title: _('Confirm Cancel Editing'),
                    dialogClass: editor.options.dialogClass + ' ' + editor.options.baseClass,
                    show: editor.options.dialogShowAnimation,
                    hide: editor.options.dialogHideAnimation,
                    buttons: [
                        {
                            text: _('OK'),
                            click: function() {
                                plugin.cancel();
                                $(this).dialog('close');
                            }
                        },
                        {
                            text: _('Cancel'),
                            click: function() {
                                $(this).dialog('close');
                            }
                        }
                    ],
                    open: function() {
                        // Apply custom icons to the dialog buttons
                        var buttons = $(this).parent().find('.ui-dialog-buttonpane');
                        buttons.find('button:eq(0)').button({ icons: { primary: 'ui-icon-circle-check' }});
                        buttons.find('button:eq(1)').button({ icons: { primary: 'ui-icon-circle-close' }});
                    },
                    close: function() {
                        $(this).dialog('destroy').remove();
                    }
                });
            }
        }

    }
});

$.ui.editor.registerPlugin({
  /**
    * @name $.editor.plugin.cancel
    * @augments $.ui.editor.defaultPlugin
    * @class Plugin providing cancel functionality
    */
   cancel: /** @lends $.editor.plugin.cancel.prototype */ {

        /**
         * Cancel editing
         * by resetting the editor's html its pre-intitialisation state, hiding the toolbar and disabling editing on the element
         */
        cancel: function() {
            this.editor.unify(function(editor) {
                editor.fire('cancel');
                editor.resetHtml();
                editor.hideToolbar();
                editor.disableEditing();
            });
        }
   }
});
