/**
 * @fileOverview UI Component for a tag-change select menu
 * @author David Neilson david@panmedia.co.nz
 * @author Michael Robinson mike@panmedia.co.nz
 */

$.ui.editor.registerUi({
    
    tagMenu: {
    
        /**
         * @see $.ui.editor.defaultUi#init
         */
        init: function(editor) {
            editor.bind('change', this.change, this);

            return editor.uiSelectMenu({
                name: 'tagMenu',
                title: _('Change HTML tag of selected element'),
                select: $(editor.getTemplate('tagmenu.menu')),
                change: function(value) {
                    editor.tagSelection(value);
                }
            });
        },

        /**
         * Content changed event
         */
        change: function() {
            var tag = this.editor.getSelectedElements()[0];
            if (!tag) return;
            tag = tag.tagName.toLowerCase();
            if (this.ui.selectMenu.find('option[value=' + tag + ']').length) {
                this.ui.val(tag);
            } else {
                this.ui.val('na');
            }
        }
    }
});
