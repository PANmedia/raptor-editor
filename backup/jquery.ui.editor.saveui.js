/**
 * @fileOverview
 * @author David Neilsen david@panmedia.co.nz
 */

/**
 * @name $.editor.ui.save
 * @augments Raptor.defaultUi
 * @class
 */
Raptor.registerUi({

    /**
     * @name $.editor.ui.save
     * @augments Raptor.defaultPlugin
     * @class The save UI component
     */
    save: {

        /**
         * @name $.editor.ui.save.options
         * @namespace Default save UI options.
         * @see $.editor.ui.save
         * @type {Object}
         */
        options: /** @lends $.editor.ui.save.options.prototype */  {
            plugin: 'saveJson'
        },

        /**
         * @see Raptor.defaultUi#init
         */
        init: function(editor, element) {
            return editor.uiButton({
                title: _('Save'),
                icon: 'ui-icon-save',
                click: function() {
                    editor.checkChange();
                    editor.getPlugin(this.options.plugin).save();
                }
            });
        }
    }
});
