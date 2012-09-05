/**
 * @fileOverview Raptorize UI component
 * @author David Neilsen david@panmedia.co.nz
 * @author Michael Robinson michael@panmedia.co.nz
 */

$.ui.editor.registerUi({

    /**
     * @name $.editor.ui.raptorize
     * @augments $.ui.editor.defaultUi
     * @class Raptorize your editor
     */
    raptorize: /** @lends $.editor.ui.raptorize.prototype */ {

        /**
         * @see $.ui.editor.defaultUi#init
         */
        init: function(editor) {
            var ui = editor.uiButton({
                title: _('Raptorize'),
                ready: function() {
                    if (!ui.button.raptorize) {
                        // <strict>
                        handleError(_('Raptorize plugin requires the raptorize dependency - https://github.com/PANmedia/jQuery-Raptor-Dependencies'));
                        // </strict>
                        return;
                    }
                    ui.button.raptorize();
                }
            });
            return ui;
        }
    }

});
