/**
 * @fileOverview History ui components
 * @author David Neilsen david@panmedia.co.nz
 * @author Michael Robinson michael@panmedia.co.nz
 */

Raptor.registerUi({

    /**
     * @name $.editor.ui.undo
     * @augments Raptor.defaultUi
     * @class Revert most recent change to element content
     */
    undo: /** @lends $.editor.ui.undo.prototype */ {
        options: {
            disabled: true
        },

        hotkeys: {
            'ctrl+z': {
                'action': function() {
                    this.editor.historyBack();
                }
            }
        },

        /**
         * @see Raptor.defaultUi#init
         */
        init: function(editor) {
            editor.bind('change', this.change, this);

            return editor.uiButton({
                title: _('Step Back'),
                click: function() {
                    editor.historyBack();
                }
            });
        },
        change: function() {
            if (this.editor.present === 0) this.ui.disable();
            else this.ui.enable();
        }
    },

    /**
     * @name $.editor.ui.redo
     * @augments Raptor.defaultUi
     * @class Step forward through the stored history
     */
    redo: /** @lends $.editor.ui.redo.prototype */ {

        options: {
            disabled: true
        },

        hotkeys: {
            'ctrl+shift+z': {
                'action': function() {
                    this.editor.historyForward();
                }
            },
            'ctrl+y': {
                'action': function() {
                    this.editor.historyForward();
                }
            }
        },

        /**
         * @see Raptor.defaultUi#init
         */
        init: function(editor) {
            editor.bind('change', this.change, this);

            return this.ui = editor.uiButton({
                title: _('Step Forward'),
                click: function() {
                    editor.historyForward();
                }
            });
        },
        change: function() {
            if (this.editor.present === this.editor.history.length - 1) this.ui.disable();
            else this.ui.enable();
        }
    }
});
