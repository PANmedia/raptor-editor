/**
 * @fileOverview Click to edit plugin
 * @author David Neilson david@panmedia.co.nz
 * @author Michael Robinson mike@panmedia.co.nz
 */

 /**
  * Shows a message at the center of an editable block,
  * informing the user that they may click to edit the block contents
  * @name $.editor.plugin.clickToEdit
  * @class
  */
$.ui.editor.registerPlugin('clickToEdit', /** @lends $.editor.plugin.clickToEdit.prototype */ {
    
    /**
     * Initialise the plugin
     * @param  {$.editor} editor  The editor instance
     * @param  {$.ui.editor.defaults} options The default editor options extended with any overrides set at initialisation
     */
    init: function(editor, options) {
        var plugin = this;
        var message = $(editor.getTemplate('clicktoedit.message', options)).appendTo('body');

        // Default options
        options = $.extend({}, {
            position: {
                at: 'center center',
                of: editor.getElement(),
                my: 'center center',
                using: function(position) {
                    $(this).css({
                        position: 'absolute',
                        top: position.top,
                        left: position.left
                    });
                }
            }
        }, options);
        
        /**
         * Show the click to edit message
         */
        this.show = function() {
            if (editor.isEditing()) return;
            editor.getElement().addClass(options.baseClass + '-highlight');
            editor.getElement().addClass(options.baseClass + '-hover');
            message.position(options.position);
            message.stop().animate({ opacity: 1 });
        }

        /**
         * Hide the click to edit message
         */
        this.hide = function() {
            editor.getElement().removeClass(options.baseClass + '-highlight');
            editor.getElement().removeClass(options.baseClass + '-hover');
            message.stop().animate({ opacity: 0 });
        }

        /**
         * Hide the click to edit message and show toolbar
         */
        this.edit = function() {
            plugin.hide();
            if (!editor.isEditing()) editor.enableEditing();
            if (!editor.isToolbarVisible()) editor.showToolbar();
        }

        message.position(options.position);

        // Prevent obscuring links
        editor.getElement().find('a').bind('mouseenter.' + editor.widgetName, plugin.hide);
        editor.getElement().find('a').bind('mouseleave.' + editor.widgetName, plugin.show);

        editor.getElement().bind('mouseenter.' + editor.widgetName, plugin.show);
        editor.getElement().bind('mouseleave.' + editor.widgetName, plugin.hide);
        editor.getElement().bind('click.' + editor.widgetName, function(event) {
            // Prevent disabling links
            if (!$(event.target).is('a') && !$(event.target).parents('a').length) {
                plugin.edit();
            }
        });
        editor.bind('destroy', function() {
            message.remove();
            editor.getElement().unbind('mouseenter.' + editor.widgetName, plugin.show);
            editor.getElement().unbind('mouseleave.' + editor.widgetName, plugin.hide);
            editor.getElement().unbind('click.' + editor.widgetName, plugin.edit);
        })
    }
});