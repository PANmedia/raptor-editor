(function($) {
    
    console.info('FIXME: tagmenu');
    console.info('FIXME: tagmenu custom tooltips');
    console.info('FIXME: tagmenu check destory detaches menu');
    $.ui.editor.registerUi({
        'tag-menu': function(editor) {
            var ui = this.ui = editor.uiSelectMenu({
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
                if (ui.selectMenu.find('option[value=' + tag + ']').length) {
                    ui.val(tag);
                } else {
                    ui.val('na');
                }
            });
        }
    });
    
})(jQuery);
