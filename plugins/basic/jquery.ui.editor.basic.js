/**
 * @name $.editor.ui.text-bold
 * @class
 */

/**
 * @name $.editor.ui.text-italic
 * @class
 */

/**
 * @name $.editor.ui.text-underline
 * @class
 */

/**
 * @name $.editor.ui.text-strike
 * @class
 */

/**
 * @name $.editor.ui.text-sub
 * @class
 */

/**
 * @name $.editor.ui.text-super
 * @class
 */

$.ui.editor.registerUi({
    textBold: /** @lends $.editor.ui.text-bold.prototype */ {
        init: function(editor, options) {
            return this.editor.uiButton({
                title: _('Bold'),
                click: function() {
                    editor.toggleWrapper('strong', { classes: options.classes || options.cssPrefix + 'bold' });
                }
            });
        }
    },
    textItalic: /** @lends $.editor.ui.text-italic.prototype */ {
        init: function(editor, options) {
            return editor.uiButton({
                title: _('Italic'),
                click: function() {
                    editor.toggleWrapper('em', { classes: options.classes || options.cssPrefix + 'italic' });
                }
            });
        }
    },
    textUnderline: /** @lends $.editor.ui.text-underline.prototype */ {
        init: function(editor, options) {
            return editor.uiButton({
                title: _('Underline'),
                click: function() {
                    editor.toggleWrapper('u', { classes: options.classes || options.cssPrefix + 'underline' });
                }
            });
        }
    },
    textStrike: /** @lends $.editor.ui.text-strike.prototype */ {
        init: function(editor, options) {
            return editor.uiButton({
                title: _('Strikethrough'),
                click: function() {
                    editor.toggleWrapper('del', { classes: options.classes || options.cssPrefix + 'strike' });
                }
            });
        }
    },
    textSub: /** @lends $.editor.ui.text-sub.prototype */ {
        init: function(editor, options) {
            return editor.uiButton({
                title: _('Sub script'),
                click: function() {
                    editor.toggleWrapper('sub', { classes: options.classes || options.cssPrefix + 'sub' });
                }
            });
        }
    },
    textSuper: /** @lends $.editor.ui.text-super.prototype */ {
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
