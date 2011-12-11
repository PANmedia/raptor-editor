/**
 * @fileOverview Insert hr ui component
 * @author David Neilson david@panmedia.co.nz
 * @author Michael Robinson mike@panmedia.co.nz
 */
 $.ui.editor.registerUi({

    /**
     * Shows a message at the center of an editable block,
     * informing the user that they may click to edit the block contents
     * @name $.editor.ui.hr
     * @class
     */
    hr: /** @lends $.editor.ui.hr.prototype */ {

        /**
         * Initialise the ui component
         * @param  {$.editor} editor  The editor instance
         * @return {$.editor.ui.hr}
         */
        init: function(editor) {
            return editor.uiButton({
                title: _('Insert Horizontal Rule'),
                click: function() {
                    editor.replaceSelection('<hr/>');
                }
            });
        }
    }
});
