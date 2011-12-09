/**
 * @fileOverview Text alignment ui components
 * @author David Neilson david@panmedia.co.nz
 * @author Michael Robinson mike@panmedia.co.nz
 */

/**
 * Aligns text left within the selected or nearest block-level element.
 * <br/>
 * <br/>
 * Toggles <tt>text-align: left</tt>
 * 
 * @name $.editor.ui.alignLeft
 * @class
 */

 /**
 * Justifies text within the selected or nearest block-level element.
 * <br/>
 * <br/>
 * Toggles <tt>text-align: justify</tt>
 * 
 * @name $.editor.ui.alignJustify
 * @class
 */

 /**
 * Centers text within the selected or nearest block-level element.
 * <br/>
 * <br/>
 * Toggles: <tt>text-align: center</tt>
 * 
 * @name $.editor.ui.alignCenter
 * @class
 */

 /**
 * Aligns text right within the selected or nearest block-level element.
 * <br/>
 * <br/>
 * Toggles <tt>text-align: right</tt>
 * 
 * @name $.editor.ui.alignRight
 * @class
 */

$.ui.editor.registerUi({
    alignLeft: /** @lends $.editor.ui.alignLeft.prototype */ {
        /**
         * Initialise the ui component
         * @param  {$.editor} editor The editor instance 
         * @return {$.editor.ui.alignLeft}
         */
        init: function(editor) {
            return editor.uiButton({
                title: _('Left Align'),
                click: function() {
                    editor.toggleBlockStyle({
                        'text-align': 'left'
                    }, editor.getElement());
                }
            });
        }
    },

    alignJustify: /** @lends $.editor.ui.alignJustify.prototype */ {
        /**
         * Initialise the ui component
         * @param  {$.editor} editor The editor instance 
         * @return {$.editor.ui.alignJustify}
         */
        init: function(editor) {
            return editor.uiButton({
                title: _('Justify'),
                click: function() {
                    editor.toggleBlockStyle({
                        'text-align': 'justify'
                    }, editor.getElement());
                }
            });
        }
    },

    alignCenter: /** @lends $.editor.ui.alignCenter.prototype */  {
        /**
         * Initialise the ui component
         * @param  {$.editor} editor The editor instance 
         * @return {$.editor.ui.alignCenter}
         */
        init: function(editor) {
            return editor.uiButton({
                title: _('Center Align'),
                click: function() {
                    editor.toggleBlockStyle({
                        'text-align': 'center'
                    }, editor.getElement());
                }
            });
        }
    },

    alignRight: /** @lends $.editor.ui.alignRight.prototype */  {
        /**
         * Initialise the ui component
         * @param  {$.editor} editor The editor instance 
         * @return {$.editor.ui.alignRight}
         */        
        init: function(editor) {
            return editor.uiButton({
                title: _('Right Align'),
                click: function() {
                    editor.toggleBlockStyle({
                        'text-align': 'right'
                    }, editor.getElement());
                }
            });
        }
    }
});
