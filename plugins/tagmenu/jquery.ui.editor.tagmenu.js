(function($) {
    
    console.info('FIXME: tagmenu');
    console.info('FIXME: tagmenu custom tooltips');
    console.info('FIXME: tagmenu check destory detaches menu');
    $.ui.editor.registerUi({
        tagMenu: function(editor) {
            var menu = this.ui = editor.uiSelectMenu({
                name: 'tagMenu',
                title: _('Change HTML tag of selected element'),
                select: $(editor.getTemplate('tagmenu.menu')),
                change: function(value) {
                    editor.changeTag(value);
                }
            });
            
            editor.bind('change', function() {
                var tag = editor.getSelectedElements()[0];
                if (!tag) return;
                tag = tag.tagName.toLowerCase();
                if (menu.find('option[value=' + tag + ']').length) {
                    menu.val(tag);
                } else {
                    menu.val('na');
                }
            });
        }
    });
    
})(jQuery);
