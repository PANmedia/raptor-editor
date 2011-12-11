/**
 * @fileOverview History ui components
 * @author David Neilson david@panmedia.co.nz
 * @author Michael Robinson mike@panmedia.co.nz
 */
        
$.ui.editor.registerUi({
    
    /**
     * Revert most recent change to element content
     * 
     * @name $.editor.ui.undo
     * @class
     */
    'undo': /** @lends $.editor.ui.undo.prototype */ {
        /**
         * Initialise the ui component
         * @param  {$.editor} editor The editor instance 
         * @param  {$.ui.editor.defaults} options The default editor options extended with any overrides set at initialisation
         * @return {$.editor.ui.undo}
         */
        init: function(editor) {
            editor.bind('change', this.change, this);
            
            return editor.uiButton({
                title: _('Step Back'),
                disabled: true,
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
     * Step forward through the stored history
     * 
     * @name $.editor.ui.redo
     * @class
     */
    'redo': /** @lends $.editor.ui.redo.prototype */ {
        /**
         * Initialise the ui component
         * @param  {$.editor} editor The editor instance 
         * @param  {$.ui.editor.defaults} options The default editor options extended with any overrides set at initialisation
         * @return {$.editor.ui.redo}
         */
        init: function(editor) {
            editor.bind('change', this.change, this);
            
            return this.ui = editor.uiButton({
                title: _('Step Forward'),
                disabled: true,
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
