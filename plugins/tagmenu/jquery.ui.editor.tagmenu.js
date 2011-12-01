// <debug>
if (debugLevel >= MAX) {
    info('FIXME: tagmenu check destroy detaches menu');
}
// </debug>

$.ui.editor.registerUi({
    'tag-menu': {
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
