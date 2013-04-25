/**
 * @fileOverview Debug functions.
 * @author David Neilsen david@panmedia.co.nz
 * @author Michael Robinson michael@panmedia.co.nz
 */

Raptor.registerUi({

    debugReinit: /** @lends $.editor.ui.debugReinit.prototype */ {

        /**
         * @see Raptor.defaultUi#init
         */
        init: function(editor, options) {
            return this.editor.uiButton({
                title: _('Reinitialise'),
                icon: 'ui-icon-reload',
                click: function() {
                    editor.reinit();
                }
            });
        }
    },

    debugDestroy: /** @lends $.editor.ui.debugDestroy.prototype */ {

        /**
         * @see Raptor.defaultUi#init
         */
        init: function(editor, options) {
            return editor.uiButton({
                title: _('Destroy'),
                icon: 'ui-icon-close',
                click: function() {
                    editor.destroy();
                }
            });
        }
    }

});
