/**
 * @fileOverview Basic text styling ui components
 * @author David Neilsen david@panmedia.co.nz
 * @author Michael Robinson michael@panmedia.co.nz
 */

Raptor.registerUi({

    /**
     * @name $.editor.ui.textBold
     * @augments Raptor.defaultUi
     * @class Wraps (or unwraps) the selection with &lt;strong&gt; tags
     * <br/>
     * Applies either {@link Raptor.defaults.cssPrefix} + 'bold' or a custom class (if present) to the &lt;strong&gt; element
     */
    textBold: /** @lends $.editor.ui.textBold.prototype */ {

        hotkeys: {
            'ctrl+b': {
                'action': function() {
                    this.ui.click();
                }
            }
        },

        /**
         * @see Raptor.defaultUi#init
         */
        init: function(editor, options) {
            return this.editor.uiButton({
                title: _('Bold'),
                click: function() {
                    selectionToggleWrapper('strong', { classes: options.classes || options.cssPrefix + 'bold' });
                }
            });
        }
    },

    /**
     * @name $.editor.ui.textItalic
     * @augments Raptor.defaultUi
     * @class Wraps (or unwraps) the selection with &lt;em&gt; tags
     * <br/>
     * Applies either {@link Raptor.defaults.cssPrefix} + 'italic' or a custom class (if present) to the &lt;em&gt; element
     */
    textItalic: /** @lends $.editor.ui.textItalic.prototype */ {

        hotkeys: {
            'ctrl+i': {
                'action': function() {
                    this.ui.click();
                }
            }
        },

        /**
         * @see Raptor.defaultUi#init
         */
        init: function(editor, options) {
            return editor.uiButton({
                title: _('Italic'),
                click: function() {
                    selectionToggleWrapper('em', { classes: options.classes || options.cssPrefix + 'italic' });
                }
            });
        }
    },

    /**
     * @name $.editor.ui.textUnderline
     * @augments Raptor.defaultUi
     * @class Wraps (or unwraps) the selection with &lt;u&gt; tags
     * <br/>
     * Applies either {@link Raptor.defaults.cssPrefix} + 'underline' or a custom class (if present) to the &lt;u&gt; element
     */
    textUnderline: /** @lends $.editor.ui.textUnderline.prototype */ {

        hotkeys: {
            'ctrl+u': {
                'action': function() {
                    this.ui.click();
                }
            }
        },

        /**
         * @see Raptor.defaultUi#init
         */
        init: function(editor, options) {
            return editor.uiButton({
                title: _('Underline'),
                click: function() {
                    selectionToggleWrapper('u', { classes: options.classes || options.cssPrefix + 'underline' });
                }
            });
        }
    },

    /**
     * @name $.editor.ui.textStrike
     * @augments Raptor.defaultUi
     * @class  Wraps (or unwraps) the selection with &lt;del&gt; tags
     * <br/>
     * Applies either {@link Raptor.defaults.cssPrefix} + 'strike' or a custom class (if present) to the &lt;del&gt; element
     */
    textStrike: /** @lends $.editor.ui.textStrike.prototype */ {

        hotkeys: {
            'ctrl+k': {
                'action': function() {
                    this.ui.click();
                }
            }
        },

        /**
         * @see Raptor.defaultUi#init
         */
        init: function(editor, options) {
            return editor.uiButton({
                title: _('Strikethrough'),
                click: function() {
                    selectionToggleWrapper('del', { classes: options.classes || options.cssPrefix + 'strike' });
                }
            });
        }
    },

    /**
     * @name $.editor.ui.textSub
     * @augments Raptor.defaultUi
     * @class Wraps (or unwraps) the selection with &lt;sub&gt; tags
     * <br/>
     * Applies either {@link Raptor.defaults.cssPrefix} + 'sub' or a custom class (if present) to the &lt;sub&gt; element
     */
    textSub: /** @lends $.editor.ui.textSub.prototype */ {

        /**
         * @see Raptor.defaultUi#init
         */
        init: function(editor, options) {
            return editor.uiButton({
                title: _('Sub script'),
                click: function() {
                    selectionToggleWrapper('sub', { classes: options.classes || options.cssPrefix + 'sub' });
                }
            });
        }
    },

    /**
     * @name $.editor.ui.textSuper
     * @augments Raptor.defaultUi
     * @class Wraps (or unwraps) the selection with &lt;sup&gt; tags
     * <br/>
     * Applies either {@link Raptor.defaults.cssPrefix} + 'super' or a custom class (if present) to the &lt;sub&gt; element
     */
    textSuper: /** @lends $.editor.ui.textSuper.prototype */ {

        /**
         * @see Raptor.defaultUi#init
         */
        init: function(editor, options) {
            return editor.uiButton({
                title: _('Super script'),
                click: function() {
                    selectionToggleWrapper('sup', { classes: options.classes || options.cssPrefix + 'super' });
                }
            });
        }
    }
});
