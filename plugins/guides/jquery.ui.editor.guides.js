/**
 * @fileOverview Show guides ui component
 * @author David Neilson david@panmedia.co.nz
 * @author Michael Robinson mike@panmedia.co.nz
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
