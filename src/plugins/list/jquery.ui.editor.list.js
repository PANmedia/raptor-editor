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
                    editor.saveSelection();
                    // Check whether selection is fully contained by a ul. If so, unwrap parent ul
                    if ($(editor.getSelectedElements()).is('ul,li')) {
                        if ($(editor.getSelectedElements()).is('li')) {
                            editor.unwrapParentTag('li');
                        }
                        editor.unwrapParentTag('ul');
                        editor.restoreSelection();
                    } else {
                        var html = editor.stripTags(editor.getSelectedHtml(), this.validChildren);
                        editor.replaceSelectionWithinValidTags('<ul><li>' + html + '</li></ul>', this.validParents);

                        editor.restoreSelection();
                        var selectedElement = $(editor.getSelectedElements());
                        editor.selectInner(selectedElement.find('li:first')[0]);
                        editor.fire('selectionChange');
                    }
                }
            });
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
