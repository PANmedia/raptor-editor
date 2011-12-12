/**
 * @fileOverview Float ui components
 * @author David Neilson david@panmedia.co.nz
 * @author Michael Robinson mike@panmedia.co.nz
 */

 $.ui.editor.registerUi({

    /**
     * @name $.editor.ui.floatLeft
     * @augments $.editor.ui
     * @class Floats the selected or nearest block-level element left
     * <br/>
     * Toggles <tt>float: left</tt>
     */
    floatLeft: /** @lends $.editor.ui.floatLeft.prototype */ {
        
        /**
         * @see $.editor.ui#init
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
     * @name $.editor.ui.floatRight
     * @augments $.editor.ui
     * @class Floats the selected or nearest block-level element right
     * <br/>
     * Toggles <tt>float: right</tt>
     */
    floatRight: /** @lends $.editor.ui.floatRight.prototype */ {
        
        /**
         * @see $.editor.ui#init
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
     * @name $.editor.ui.floatNone
     * @augments $.editor.ui
     * @class Sets float none to the selected or nearest block-level element
     * <br/>
     * Toggles <tt>float: right</tt>
     */
    floatNone: /** @lends $.editor.ui.floatNone.prototype */ {
        
        /**
         * @see $.editor.ui#init
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