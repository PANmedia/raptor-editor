/**
 * @fileOverview Blockquote ui component
 * @author David Neilsen david@panmedia.co.nz
 * @author Michael Robinson michael@panmedia.co.nz
 */

 Raptor.registerUi({
   /**
    * @name $.editor.ui.quoteBlock
    * @augments Raptor.defaultUi
    * @class Wraps (or unwraps) selection in &lt;blockquote&gt; tags
    * <br/>
    * Applies either {@link Raptor.defaults.cssPrefix} + 'blockquote' or a custom class (if present) to the &lt;blockquote&gt; element
    */
    quoteBlock: /** @lends $.editor.ui.quoteBlock.prototype */ {

        /**
         * @see Raptor.defaultUi#init
         */
        init: function(editor, options) {
            return editor.uiButton({
                title: _('Blockquote'),
                icon: 'ui-icon-quote',
                click: function() {
                    selectionToggleWrapper('blockquote', { classes: options.classes || options.cssPrefix + 'blockquote' });
                }
            });
        }
    }
});
