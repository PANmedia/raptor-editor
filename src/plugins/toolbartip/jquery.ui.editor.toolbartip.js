/**
 * @fileOverview Toolbar tips plugin
 * @author David Neilsen david@panmedia.co.nz
 */

/**
 * @name $.editor.plugin.toolbarTip
 * @augments $.ui.editor.defaultPlugin
 * @class Converts native tool tips to styled tool tips
 */
$.ui.editor.registerPlugin('toolbarTip', /** @lends $.editor.plugin.toolbarTip.prototype */ {

    /**
     * @see $.ui.editor.defaultPlugin#init
     */
    init: function(editor, options) {
        if ($.browser.msie) {
            return;
        }
        this.bind('show, tagTreeUpdated', function() {
            $('.ui-editor-wrapper [title]').each(function() {
                $(this).attr('data-title', $(this).attr('title'));
                $(this).removeAttr('title');
            });
        });
    }

});