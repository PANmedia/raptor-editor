/**
 * @fileOverview Blockquote ui component
 * @author David Neilson david@panmedia.co.nz
 * @author Michael Robinson mike@panmedia.co.nz
 */

 $.ui.editor.registerUi({
   /**
    * @name $.editor.ui.quoteBlock
    * @augments $.editor.ui
    * @class Wraps (or unwraps) selection in &lt;blockquote&gt; tags
    * <br/>
    * Applies either {@link $.ui.editor.defaults.cssPrefix} + 'blockquote' or a custom class (if present) to the &lt;blockquote&gt; element 
    */
    quoteBlock: /** @lends $.editor.ui.quoteBlock.prototype */ {
        
        /**
         * @see $.editor.ui#init
         */
        init: function(editor) {
            return editor.uiButton({
                title: _('Blockquote'),
                click: function() {
                    editor.toggleWrapper('blockquote', { classes: options.classes || options.cssPrefix + 'blockquote' });
                }
            });
        }
    }
});
