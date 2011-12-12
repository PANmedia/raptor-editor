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
         * @default  400
         * @type {Number} Time in milliseconds
         */
        delay: 400,

        /**
         * Fade in animation time
         * @default 200
         * @type {Number} Time in milliseconds
         */
        fadeIn: 200,

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
    docked: false,

    /**
     * @see $.ui.editor.defaultPlugin#init
     */
    init: function(editor, options) {
        editor.bind('resize', this.resize, this);
    },

    /**
     * Rebuild tiptip tooltips if the editor has been docked / undocked or the locale has been changed since last resize
     */
    resize: function() {

        // Need to check for the docking plugin, and if so whether the editor has been docked / undocked
        var docked = this.editor.getPlugin('dock') ? this.editor.getPlugin('dock').isDocked() : false;

        // Only apply tiptip to the core elements if it hasn't yet been applied, 
        // or the locale has been changed or the editor docked / undocked
        if (this.currentLocale != this.options.locale || docked != this.docked) {
            // <strict>
            // Ensure jQuery has been included
            if (!$.isFunction($.fn.tipTip)) {
                handleError(_('jquery.ui.editor.tiptip requires TipTip. '));
                return;
            }
            // </strict>
            var tipTipOptions = {
                maxWidth: 'auto',
                delay: this.options.delay,
                fadeIn: this.options.fadeIn,
                fadeOut: this.options.fadeOut,
                defaultPosition: docked ? 'bottom' : 'top' 
            };

            var ui = this;
            // Apply tiptip to all children of the relevant elements that either have a title attribute or the required class
            var elements = $.merge(this.editor.selToolbar('[title], .' + this.options.baseClass + '-tiptip'), 
                            this.editor.selTitle('[title], .' + this.options.baseClass + '-tiptip'));

            elements.each(function() {
                $(this).tipTip(tipTipOptions).addClass(ui.options.baseClass + '-tiptip');
            });

            this.docked = docked;
            this.currentLocale = this.options.locale;
        }
        // Unsaved edit warnings could be added / removed on change, so we should check for them each time
        $('body div.ui-editor-unsaved-edit-warning-warning[title]').tipTip($.extend(tipTipOptions, { defaultPosition: 'right' }));
    }
});
