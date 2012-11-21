/**
 * @fileOverview Raptorize UI component
 * @author David Neilsen david@panmedia.co.nz
 * @author Michael Robinson michael@panmedia.co.nz
 */

Raptor.registerUi({

    /**
     * @name $.editor.ui.raptorize
     * @augments Raptor.defaultUi
     * @class Raptorize your editor
     */
    raptorize: /** @lends $.editor.ui.raptorize.prototype */ {

        /**
         * @see Raptor.defaultUi#init
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
