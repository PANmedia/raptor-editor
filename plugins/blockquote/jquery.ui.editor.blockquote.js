/**
 * @fileOverview Blockquote ui component
 * @author David Neilson david@panmedia.co.nz
 * @author Michael Robinson mike@panmedia.co.nz
 */

 $.ui.editor.registerUi({
   /**
    * @name $.editor.ui.quoteBlock
    * @augments $.ui.editor.defaultUi
    * @class Wraps (or unwraps) selection in &lt;blockquote&gt; tags
    * <br/>
    * Applies either {@link $.ui.editor.defaults.cssPrefix} + 'blockquote' or a custom class (if present) to the &lt;blockquote&gt; element
    */
    quoteBlock: /** @lends $.editor.ui.quoteBlock.prototype */ {
        
        /**
         * @see $.ui.editor.defaultUi#init
         */
        init: function(editor, options) {
            return editor.uiButton({
                title: _('Blockquote'),
                click: function() {
                    editor.toggleWrapper('blockquote', { classes: options.classes || options.cssPrefix + 'blockquote' });
                }
            });
        }
    }
});
