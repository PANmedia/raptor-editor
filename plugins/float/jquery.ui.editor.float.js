/**
 * @fileOverview Float ui components
 * @author David Neilson david@panmedia.co.nz
 * @author Michael Robinson mike@panmedia.co.nz
 */

 $.ui.editor.registerUi({

    /**
     * Floats the selected or nearest block-level element left
     * <br/>
     * Toggles <tt>float: left</tt>
     * 
     * @name $.editor.ui.floatLeft
     * @class
     */
    floatLeft: /** @lends $.editor.ui.floatLeft.prototype */ {
        /**
         * Initialise the ui component
         * @param  {$.editor} editor The editor instance 
         * @param  {$.ui.editor.defaults} options The default editor options extended with any overrides set at initialisation
         * @return {$.editor.ui.floatLeft}
         */
        init: function(editor) {
            return editor.uiButton({
                title: _('Float Left'),
                click: function() {
                    editor.applyStyle({ 'float': 'left' });
                }
            });
        }
    },
    
    /**
     * Floats the selected or nearest block-level element right
     * <br/>
     * Toggles <tt>float: right</tt>
     * 
     * @name $.editor.ui.floatRight
     * @class
     */
    floatRight: /** @lends $.editor.ui.floatRight.prototype */ {
        /**
         * Initialise the ui component
         * @param  {$.editor} editor The editor instance 
         * @param  {$.ui.editor.defaults} options The default editor options extended with any overrides set at initialisation
         * @return {$.editor.ui.floatRight}
         */
        init: function(editor) {
            return editor.uiButton({
                title: _('Float Right'),
                click: function() {
                    editor.applyStyle({ 'float': 'right' });
                }
            });
        }
    },
    
    /**
     * Sets float none to the selected or nearest block-level element
     * <br/>
     * Toggles <tt>float: right</tt>
     * 
     * @name $.editor.ui.floatNone
     * @class
     */
    floatNone: /** @lends $.editor.ui.floatNone.prototype */ {
        /**
         * Initialise the ui component
         * @param  {$.editor} editor The editor instance 
         * @param  {$.ui.editor.defaults} options The default editor options extended with any overrides set at initialisation
         * @return {$.editor.ui.floatNone}
         */
        init: function(editor) {
            return editor.uiButton({
                title: _('Float None'),
                click: function() {
                    editor.applyStyle({ 'float': 'none' });
                }
            });
        }
    }
});