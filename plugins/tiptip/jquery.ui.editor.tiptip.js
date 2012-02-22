/**
 * @fileOverview Tiptip plugin
 * @author David Neilson david@panmedia.co.nz
 * @author Michael Robinson mike@panmedia.co.nz
 */

/**
 * @name $.editor.plugin.tiptip
 * @augments $.ui.editor.defaultPlugin 
 * @see  http://code.drewwilson.com/entry/tiptip-jquery-plugin
 * @class Converts native tooltips to 'tipTips'
 */
$.ui.editor.registerPlugin('tiptip', /** @lends $.editor.plugin.tiptip.prototype */ {

    /**
     * Tiptip options
     * @name $.editor.plugin.tiptip.options
     * @namespace Default tiptip options
     * @see $.editor.plugin.tiptip
     * @type {Object}
     */
    options: {
        
        /**
         * Delay between user hovering the element and the tooltip being displayed
         * @default  300
         * @type {Number} Time in milliseconds
         */
        delay: 250,

        /**
         * Fade in animation time
         * @default 200
         * @type {Number} Time in milliseconds
         */
        fadeIn: 250,

        /**
         * Fade out animation time
         * @default  200
         * @type {Number} Time in milliseconds
         */
        fadeOut: 200
    },

    /**
     * Keep a track of the current locale - if this changes then the tiptips need to be regenerated
     * @type {String}
     */
    currentLocale: null,

    /**
     * Keep a track of whether the editor is docked or not - if this changes then the tiptips need to be regenerated
     * @type {Boolean}
     */
    wasDocked: false,

    /**
     * @see $.ui.editor.defaultPlugin#init
     */
    init: function(editor, options) {
        
        // <strict>    
        // Ensure tipTip has been included
        if (!$.isFunction($.fn.tipTip)) {
            handleError(_('jquery.ui.editor.tiptip requires TipTip. '));
            return;
        }
        // </strict>
        if (editor.getPlugin('unsavedEditWarning')) editor.bind('change', this.rebuildUnsavedEditWarning, this);
        editor.bind('resize', this.rebuildUi, this);
        editor.bind('dock', this.rebuildUi, this);
        editor.bind('tagTreeUpdated', this.rebuildTagTree, this);
    },

    /**
     * Rebuild tiptip tooltips if the editor has been docked / undocked or the locale has been changed since last resize
     */
    rebuildUi: function() {

        // Only apply tiptip to the core elements if it hasn't yet been applied, 
        // or the locale has been changed or the editor docked / undocked
        if (this.currentLocale != this.options.locale || this.isDocked() != this.wasDocked) {

            var ui = this;
            // Apply tiptip to all children of the relevant elements that either have a title attribute or the required class
            this.editor.selToolbar('[title], .' + this.options.baseClass + '-tiptip').each(function() {
                $(this).tipTip(ui.tipTipOptions()).addClass(ui.options.baseClass + '-tiptip');
            });

            this.rebuildTagTree();

            this.wasDocked = this.isDocked();
            this.currentLocale = this.options.locale;
        }
    },

    /**
     * Apply tipTip to all relevant title bar elements
     */
    rebuildTagTree: function() {
        var ui = this;
        this.editor.selTitle('[title], .' + this.options.baseClass + '-tiptip').each(function() {
            $(this).tipTip(ui.tipTipOptions(true)).addClass(ui.options.baseClass + '-tiptip');
        })
    },

    /**
     * Check for title attribute on unsaved edit warnings and tipTip-ize it
     */
    rebuildUnsavedEditWarning: function() {
        // Unsaved edit warnings could be added / removed on change, so we should check for them each time
        $('body div.ui-editor-unsaved-edit-warning-warning[title]').tipTip($.extend(this.tipTipOptions(), { 
            defaultPosition: 'right' 
        }));
    },

    /**
     * Prepare and return the tipTip options
     * @param  {Boolean} tagTree whether these options are to be applied to tag tree tipTips
     * @return {Object}
     */
    tipTipOptions: function(tagTree) {
        var options = {
            maxWidth: 'auto',
            delay: this.options.delay,
            fadeIn: this.options.fadeIn,
            fadeOut: this.options.fadeOut
        };

        if (tagTree) options.defaultPosition = 'top';
        else options.defaultPosition = this.isDocked() ? 'bottom' : 'top';

        return options;
    },

    /**
     * Determine whether the editor toolbar is is docked
     * @return {Boolean} True if the editor toolbar is docked
     */
    isDocked: function() {
        // Need to check for the docking plugin, and if so whether the editor has been docked / undocked
        return this.editor.getPlugin('dock') ? this.editor.getPlugin('dock').isDocked() : false;
    }
});
