/**
 * @fileOverview Clean plugin & ui component
 * @author David Neilson david@panmedia.co.nz
 * @author Michael Robinson mike@panmedia.co.nz
 */

 /**
  * @name $.editor.plugin.clean
  * @augments $.ui.editor.defaultPlugin
  * @class Strips empty tags and unwanted attributes from editing element
  */
  $.ui.editor.registerPlugin('clean', /** @lends $.editor.plugin.clean.prototype */ {
    
    /**
     * Attributes to be stripped, empty tags to be removed & attributes to be removed if empty
     * @type {Object}
     */
    options: {

        /**
         * Attributes to be completely removed
         * @type {Array}
         */
        stripAttrs: ['_moz_dirty'],
        
        /**
         * Attribute contents to be stripped
         * @type {Object}
         */
        stripAttrContent: {
            type: '_moz'
        },
        
        /**
         * Tags to be removed if empty
         * @type {Array}
         */
        stripEmptyTags: [
            'h1', 'h2', 'h3', 'h4', 'h5',  'h6',
            'p', 'b', 'i', 'u', 'strong', 'em',
            'big', 'small', 'div', 'span'
        ],
        

        /**
         * Attributes to be removed if empty
         * @type {Array}
         */
        stripEmptyAttrs: [
            'class', 'id', 'style'
        ]
    },
    
    /**
     * Binds {@link $.editor.plugin.clean#clean} to the change event
     * @see $.ui.editor.defaultPlugin#init
     */
    init: function(editor, options) {
        editor.bind('change', this.clean, this);
    },
      
    /**
     * Removes empty tags and unwanted attributes from the element
     */  
    clean: function() {
        var i;
        for (i = 0; i < this.options.stripAttrs.length; i++) {
            this.editor.getElement()
                .find('[' + this.options.stripAttrs[i] + ']')
                .removeAttr(this.options.stripAttrs[i]);
        }
        for (i = 0; i < this.options.stripAttrContent.length; i++) {
            this.editor.getElement()
                .find('[' + i + '="' + this.options.stripAttrs[i] + '"]')
                .removeAttr(this.options.stripAttrs[i]);
        }
        for (i = 0; i < this.options.stripEmptyTags.length; i++) {
            this.editor.getElement()
                .find(this.options.stripEmptyTags[i])
                .filter(function() {
                    return $.trim($(this).html()) === '';
                })
                .remove();
        }
        for (i = 0; i < this.options.stripEmptyAttrs.length; i++) {
            var attr = this.options.stripEmptyAttrs[i];
            this.editor.getElement()
                .find('[' + this.options.stripEmptyAttrs[i] + ']')
                .filter(function() {
                    return $.trim($(this).attr(attr)) === '';
                }).removeAttr(this.options.stripEmptyAttrs[i]);
        }
    }
});

$.ui.editor.registerUi({
    /**
      * @name $.editor.ui.clean
      * @augments $.ui.editor.defaultUi
      * @class UI component that calls {@link $.editor.plugin.clean#clean} when clicked
      */
    clean: /** @lends $.editor.ui.clean.prototype */ {
        
        /**
         * @see $.ui.editor.defaultUi#init
         */
        init: function(editor) {
            return editor.uiButton({
                title: _('Remove unnecessary markup from editor content'),
                click: function() {
                    editor.getPlugin('clean').clean();
                }
            });
        }
    }
});
