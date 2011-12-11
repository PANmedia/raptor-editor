/**
 * @fileOverview Font size ui components
 * @author David Neilson david@panmedia.co.nz
 * @author Michael Robinson mike@panmedia.co.nz
 */

 $.ui.editor.registerUi({
    /**
     * Wraps selection with &lt;big&gt; tags or unwraps &lt;small&gt; tags from selection
     * 
     * @name $.editor.ui.fontSizeInc
     * @class
     */
    fontSizeInc: /** @lends $.editor.ui.fontSizeInc.prototype */ {
        /**
         * Initialise the ui component
         * @param  {$.editor} editor The editor instance 
         * @param  {$.ui.editor.defaults} options The default editor options extended with any overrides set at initialisation
         * @return {$.editor.ui.fontSizeInc}
         */
        init: function(editor, options) {
            return editor.uiButton({
                title: _('Increase Font Size'),
                click: function() {
                    editor.inverseWrapWithTagClass('big', options.cssPrefix + 'big', 'small', options.cssPrefix + 'small');
                }
            });
        }
    },

    /**
     * Wraps selection with &lt;small&gt; tags or unwraps &lt;big&gt; tags from selection
     * 
     * @name $.editor.ui.fontSizeDec
     * @class
     */
    fontSizeDec: /** @lends $.editor.ui.fontSizeDec.prototype */ {
        /**
         * Initialise the ui component
         * @param  {$.editor} editor The editor instance 
         * @param  {$.ui.editor.defaults} options The default editor options extended with any overrides set at initialisation
         * @return {$.editor.ui.fontSizeDec}
         */
        init: function(editor, options) {
            return editor.uiButton({
                title: _('Decrease Font Size'),
                click: function() {
                    editor.inverseWrapWithTagClass('small', options.cssPrefix + 'small', 'big', options.cssPrefix + 'big');
                }
            });
        }
    }
});

