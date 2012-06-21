/**
 * @fileOverview UI Components for inserting ordered and unordered lists
 * @author David Neilsen david@panmedia.co.nz
 * @author Michael Robinson michael@panmedia.co.nz
 */

$.ui.editor.registerUi({

    /**
     * @name $.editor.ui.listUnordered
     * @augments $.ui.editor.defaultUi
     * @class Wraps the selection with a &lt;ul&gt;, then a &lt;li&gt;
     */
    listUnordered: /** @lends $.editor.ui.listUnordered.prototype */ {

        /**
         * Tag names for elements that are allowed to contain ul/ol elements.
         * @type {Array}
         */
        validParents: [
            'blockquote', 'body', 'button', 'center', 'dd', 'div', 'fieldset', 'form', 'iframe', 'li',
            'noframes', 'noscript', 'object', 'td', 'th'
        ],

        /**
         * Tag names for elements that may be contained by li elements.
         * @type {Array}
         */
        validChildren: [
            'a', 'abbr','acronym', 'applet', 'b', 'basefont', 'bdo', 'big', 'br', 'button', 'cite', 'code', 'dfn',
            'em', 'font', 'i', 'iframe', 'img', 'input', 'kbd', 'label', 'map', 'object', 'p', 'q', 's',  'samp',
            'script', 'select', 'small', 'span', 'strike', 'strong', 'sub', 'sup', 'textarea', 'tt', 'u', 'var'
        ],

        /**
         * @see $.ui.editor.defaultUi#init
         */
        init: function(editor) {
            return editor.uiButton({
                title: _('Unordered List'),
                click: function() {

                    var startElement = editor.getSelectionStartElement()[0];
                    var endElement = editor.getSelectionEndElement()[0];
                    var startElement = editor.getSelectedElements()[0];

                    // If common ancestor & anchor & focus are allowed, replace selection
                    var selectedElementValid = this.isValid(selectedElement);
                    var startElementValid = this.isValid(startElement);
                    var endElementValid = this.isValid(endElement);

                    if (selectedElementValid && startElementValid && endElementValid) {
                        editor.toggleWrapper('ul');
                        editor.toggleWrapper('li');
                        return;
                    }

                    // Else
                    // Find nearest allowed element for anchor & focus
                    // var validStart = editor.
                    //  Clone it.
                    //  Original: Select from start of selection to end of allowed element
                    //  Original: delete contents
                    //  Clone: Select from end of seleciton to start of allowed element
                    //  Clone: delete contents
                    //  Insert list after original, insert clone after list
                }
            });
        },

        isValid: function(element) {
            return -1 !== $.inArray(element, this.validParents);
        }
    },

    /**
     * @name $.editor.ui.listOrdered
     * @augments $.ui.editor.defaultUi
     * @class Wraps the selection with a &lt;ol&gt;, then a &lt;li&gt;
     */
    listOrdered: /** @lends $.editor.ui.listOrdered.prototype */ {

        /**
         * @see $.ui.editor.defaultUi#init
         */
        init: function(editor) {
            return editor.uiButton({
                title: _('Ordered List'),
                click: function() {
                    if (!editor.selectionExists(rangy.getSelection())) {
                        editor.insertElement('<ol><li>First list item</li></ol>');
                    } else {
                        editor.toggleWrapper('ol');
                        editor.toggleWrapper('li');
                    }
                }
            });
        }
    }
});
