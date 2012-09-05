/**
 * @fileOverview Float ui components
 * @author David Neilsen david@panmedia.co.nz
 * @author Michael Robinson michael@panmedia.co.nz
 */

 $.ui.editor.registerUi({

    /**
     * @name $.editor.ui.floatLeft
     * @augments $.ui.editor.defaultUi
     * @class Floats the selected or nearest block-level element left
     * <br/>
     * Toggles <tt>float: left</tt>
     */
    floatLeft: /** @lends $.editor.ui.floatLeft.prototype */ {

        /**
         * @see $.ui.editor.defaultUi#init
         */
        init: function(editor) {
            return editor.uiButton({
                title: _('Float Image Left'),
                click: function() {
                    selectionEachRange(function(range) {
                        $(range.commonAncestorContainer).find('img').css('float', 'left');
                    });
                }
            });
        }
    },

    /**
     * @name $.editor.ui.floatRight
     * @augments $.ui.editor.defaultUi
     * @class Floats the selected or nearest block-level element right
     * <br/>
     * Toggles <tt>float: right</tt>
     */
    floatRight: /** @lends $.editor.ui.floatRight.prototype */ {

        /**
         * @see $.ui.editor.defaultUi#init
         */
        init: function(editor) {
            return editor.uiButton({
                title: _('Float Image Right'),
                click: function() {
                    selectionEachRange(function(range) {
                        $(range.commonAncestorContainer).find('img').css('float', 'right');
                    });
                }
            });
        }
    },

    /**
     * @name $.editor.ui.floatNone
     * @augments $.ui.editor.defaultUi
     * @class Sets float none to the selected or nearest block-level element
     * <br/>
     * Toggles <tt>float: right</tt>
     */
    floatNone: /** @lends $.editor.ui.floatNone.prototype */ {

        /**
         * @see $.ui.editor.defaultUi#init
         */
        init: function(editor) {
            return editor.uiButton({
                title: _('Remove Image Float'),
                click: function() {
                    selectionEachRange(function(range) {
                        $(range.commonAncestorContainer).find('img').css('float', 'none');
                    });
                }
            });
        }
    }
});