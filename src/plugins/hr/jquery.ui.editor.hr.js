/**
 * @fileOverview Insert hr ui component
 * @author David Neilsen david@panmedia.co.nz
 * @author Michael Robinson michael@panmedia.co.nz
 */
 Raptor.registerUi({

    /**
     * @name $.editor.ui.hr
     * @augments Raptor.defaultUi
     * @class Shows a message at the center of an editable block,
     * informing the user that they may click to edit the block contents
     */
    hr: /** @lends $.editor.ui.hr.prototype */ {

        /**
         * @see Raptor.defaultUi#init
         */
        init: function(editor) {
            return editor.uiButton({
                title: _('Insert Horizontal Rule'),
                click: function() {
                    selectionReplace('<hr/>');
                }
            });
        }
    }
});
