/**
 * @fileOverview Blockquote ui component
 * @author David Neilson david@panmedia.co.nz
 * @author Michael Robinson mike@panmedia.co.nz
 */

 /**
  * Wraps (or unwraps) selection in &lt;blockquote&gt; tags
  * <br/>
  * Applies either {@link $.ui.editor.defaults.cssPrefix} + 'blockquote' or a custom class (if present) to the &lt;blockquote&gt; element 
  * @name $.editor.ui.quoteBlock
  * @class
  */
 $.ui.editor.registerUi({
    quoteBlock: /** @lends $.editor.ui.quoteBlock.prototype */ {
        /**
         * Initialise the ui component
         * @param  {$.editor} editor The editor instance 
         * @param  {$.ui.editor.defaults} options The default editor options extended with any overrides set at initialisation
         * @return {$.editor.plugin.quoteBlock}
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
