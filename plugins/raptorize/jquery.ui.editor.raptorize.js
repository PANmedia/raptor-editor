/**
 * @fileOverview Raptorize UI component
 * @author David Neilson david@panmedia.co.nz
 * @author Michael Robinson mike@panmedia.co.nz
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
            var button = editor.uiButton({
                title: _('Raptorize'),
                click: function() {
                }
            });
            editor.bind('ready', function() {
                button.button.raptorize();
            })
            return button;
        }
    }

});
