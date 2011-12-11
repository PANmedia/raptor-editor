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
    floatRight: /** @lends $.editor.ui.floatLeft.prototype */ {
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