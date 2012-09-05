/**
 * @fileOverview Show guides ui component
 * @author David Neilsen david@panmedia.co.nz
 * @author Michael Robinson michael@panmedia.co.nz
 */

$.ui.editor.registerUi({

     /**
     * @name $.editor.ui.showGuides
     * @augments $.ui.editor.defaultUi
     * @class Outlines elements contained within the editing element
     */
    showGuides: /** @lends $.editor.ui.showGuides.prototype */ {

        /**
         * @see $.ui.editor.defaultUi#init
         */
        init: function(editor, options) {

            editor.bind('cancel', this.cancel, this);
            editor.bind('destroy', this.cancel, this);

            return editor.uiButton({
                title: _('Show Guides'),
                icon: 'ui-icon-pencil',
                click: function() {
                    editor.getElement().toggleClass(options.baseClass + '-visible');
                }
            });
        },

        cancel: function() {
            this.editor.getElement().removeClass(this.options.baseClass + '-visible');
        }
    }
});
