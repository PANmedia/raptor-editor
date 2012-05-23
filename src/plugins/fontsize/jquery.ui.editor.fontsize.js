/**
 * @fileOverview Font size ui components
 * @author David Neilsen david@panmedia.co.nz
 * @author Michael Robinson michael@panmedia.co.nz
 */

 $.ui.editor.registerUi({

    /**
     * @name $.editor.ui.fontSizeInc
     * @augments $.ui.editor.defaultUi
     * @class Wraps selection with &lt;big&gt; tags or unwraps &lt;small&gt; tags from selection
     */
    fontSizeInc: /** @lends $.editor.ui.fontSizeInc.prototype */ {

        /**
         * @see $.ui.editor.defaultUi#init
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
     * @name $.editor.ui.fontSizeDec
     * @augments $.ui.editor.defaultUi
     * @class Wraps selection with &lt;small&gt; tags or unwraps &lt;big&gt; tags from selection
     */
    fontSizeDec: /** @lends $.editor.ui.fontSizeDec.prototype */ {

        /**
         * @see $.ui.editor.defaultUi#init
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
