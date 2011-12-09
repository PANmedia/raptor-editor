/**
 * @fileOverview Basic text styling ui components
 * @author David Neilson david@panmedia.co.nz
 * @author Michael Robinson mike@panmedia.co.nz
 */

/**
 * Wraps (or unwraps) the selection with &lt;strong&gt; tags
 * <br/>
 * Applies either {@link $.ui.editor.defaults.cssPrefix} + 'bold' or a custom class (if present) to the &lt;strong&gt; element 
 * @name $.editor.ui.textBold
 * @class
 */

/**
 * Wraps (or unwraps) the selection with &lt;em&gt; tags
 * <br/>
 * Applies either {@link $.ui.editor.defaults.cssPrefix} + 'italic' or a custom class (if present) to the &lt;em&gt; element 
 * @name $.editor.ui.textItalic
 * @class
 */

/**
 * Wraps (or unwraps) the selection with &lt;u&gt; tags
 * <br/>
 * Applies either {@link $.ui.editor.defaults.cssPrefix} + 'underline' or a custom class (if present) to the &lt;u&gt; element 
 * @name $.editor.ui.textUnderline
 * @class
 */

/**
 * Wraps (or unwraps) the selection with &lt;del&gt; tags
 * <br/>
 * Applies either {@link $.ui.editor.defaults.cssPrefix} + 'strike' or a custom class (if present) to the &lt;del&gt; element 
 * @name $.editor.ui.textStrike
 * @class
 */

/**
 * Wraps (or unwraps) the selection with &lt;sub&gt; tags
 * <br/>
 * Applies either {@link $.ui.editor.defaults.cssPrefix} + 'sub' or a custom class (if present) to the &lt;sub&gt; element 
 * @name $.editor.ui.textSub
 * @class
 */

/**
 * Wraps (or unwraps) the selection with &lt;sup&gt; tags
 * <br/>
 * Applies either {@link $.ui.editor.defaults.cssPrefix} + 'super' or a custom class (if present) to the &lt;sub&gt; element 
 * @name $.editor.ui.textSuper
 * @class
 */

$.ui.editor.registerUi({
    textBold: /** @lends $.editor.ui.textBold.prototype */ {
        /**
         * Initialise the ui component
         * @param  {$.editor} editor The editor instance 
         * @param  {$.ui.editor.defaults} options The default editor options extended with any overrides set at initialisation
         * @return {$.editor.plugin.textBold}
         */
        init: function(editor, options) {
            return this.editor.uiButton({
                title: _('Bold'),
                click: function() {
                    editor.toggleWrapper('strong', { classes: options.classes || options.cssPrefix + 'bold' });
                }
            });
        }
    },

    textItalic: /** @lends $.editor.ui.textItalic.prototype */ {
        /**
         * Initialise the ui component
         * @param  {$.editor} editor The editor instance 
         * @param  {$.ui.editor.defaults} options The default editor options extended with any overrides set at initialisation
         * @return {$.editor.plugin.textItalic}
         */
        init: function(editor, options) {
            return editor.uiButton({
                title: _('Italic'),
                click: function() {
                    editor.toggleWrapper('em', { classes: options.classes || options.cssPrefix + 'italic' });
                }
            });
        }
    },

    textUnderline: /** @lends $.editor.ui.textUnderline.prototype */ {
        /**
         * Initialise the ui component
         * @param  {$.editor} editor The editor instance 
         * @param  {$.ui.editor.defaults} options The default editor options extended with any overrides set at initialisation
         * @return {$.editor.plugin.textUnderline}
         */        
        init: function(editor, options) {
            return editor.uiButton({
                title: _('Underline'),
                click: function() {
                    editor.toggleWrapper('u', { classes: options.classes || options.cssPrefix + 'underline' });
                }
            });
        }
    },

    textStrike: /** @lends $.editor.ui.textStrike.prototype */ {
        /**
         * Initialise the ui component
         * @param  {$.editor} editor The editor instance 
         * @param  {$.ui.editor.defaults} options The default editor options extended with any overrides set at initialisation
         * @return {$.editor.plugin.textStrike}
         */        
        init: function(editor, options) {
            return editor.uiButton({
                title: _('Strikethrough'),
                click: function() {
                    editor.toggleWrapper('del', { classes: options.classes || options.cssPrefix + 'strike' });
                }
            });
        }
    },

    textSub: /** @lends $.editor.ui.textSub.prototype */ {
        /**
         * Initialise the ui component
         * @param  {$.editor} editor The editor instance 
         * @param  {$.ui.editor.defaults} options The default editor options extended with any overrides set at initialisation
         * @return {$.editor.plugin.textSub}
         */
        init: function(editor, options) {
            return editor.uiButton({
                title: _('Sub script'),
                click: function() {
                    editor.toggleWrapper('sub', { classes: options.classes || options.cssPrefix + 'sub' });
                }
            });
        }
    },

    textSuper: /** @lends $.editor.ui.textSuper.prototype */ {

        /**
         * Initialise the ui component
         * @param  {$.editor} editor The editor instance 
         * @param  {$.ui.editor.defaults} options The default editor options extended with any overrides set at initialisation
         * @return {$.editor.plugin.textSuper}
         */
        init: function(editor, options) {
            return editor.uiButton({
                title: _('Super script'),
                click: function() {
                    editor.toggleWrapper('sup', { classes: options.classes || options.cssPrefix + 'super' });
                }
            });
        }
    }
});
