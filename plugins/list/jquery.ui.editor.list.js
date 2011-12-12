/**
 * @fileOverview UI Components for inserting ordered and unordered lists
 * @author David Neilson david@panmedia.co.nz
 * @author Michael Robinson mike@panmedia.co.nz
 */

$.ui.editor.registerUi({
    listUnordered: {

        /**
         * @see $.editor.ui#init
         */
        init: function(editor) {
            return editor.uiButton({
                title: _('Unordered List'),
                click: function() {
                    if (!editor.selectionExists(rangy.getSelection())) {
                        editor.insertElement('<ul><li>First list item</li></ul>');
                    } else {
                        editor.toggleWrapper('ul');
                        editor.toggleWrapper('li');
                    }
                }
            });
        }
    },
    listOrdered: {

        /**
         * @see $.editor.ui#init
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
