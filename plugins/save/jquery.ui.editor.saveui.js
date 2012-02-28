/**
 * @fileOverview
 * @author David Neilson david@panmedia.co.nz
 */

/**
 * @name $.editor.ui.save
 * @augments $.ui.editor.defaultUi
 * @class
 */
$.ui.editor.registerUi({

    /**
     * @name $.editor.ui.save
     * @augments $.ui.editor.defaultPlugin
     * @class The save UI component
     */
    save: {

        options: {
            plugin: 'saveJson'
        },
        init: function() {
            console.log(this);
        },
        /**
         * @see $.ui.editor.defaultUi#init
         */
        init: function(editor, element) {
            return editor.uiButton({
                title: _('Save'),
                icon: 'ui-icon-disk',
                click: function() {
                    editor.getPlugin(this.options.plugin).save();
                }
            });
        }
    }
});
