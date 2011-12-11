/**
 * @fileOverview Show guides ui component
 * @author David Neilson david@panmedia.co.nz
 * @author Michael Robinson mike@panmedia.co.nz
 */

$.ui.editor.registerUi({
     /**
     * Outlines elements contained within the editing element
     * 
     * @name $.editor.ui.showGuides
     * @class
     */
    showGuides: /** @lends $.editor.ui.showGuides.prototype */ {
        /**
         * Initialise the ui component
         * @param  {$.editor} editor The editor instance 
         * @param  {$.ui.editor.defaults} options The default editor options extended with any overrides set at initialisation
         * @return {$.editor.ui.showGuides}
         */
        init: function(editor, options) {
            this.bind('destroy', function() {
                this.editor.getElement().removeClass(options.baseClass + '-visible');
            });
            return editor.uiButton({
                title: _('Show Guides'),
                icon: 'ui-icon-pencil',
                click: function() {
                    editor.getElement().toggleClass(options.baseClass + '-visible');
                }
            });
        }
    }
});
