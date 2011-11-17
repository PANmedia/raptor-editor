(function($) {
    
    var tagMenu = function(editor, options) {
        this.titleTagList = function(current) {
            var tagMenu = editor._editor.toolbar.find('select.ui-editor-tag-select'),
                tagName = current[0].tagName.toLowerCase();
                        
            if (editor._util.isRoot.call(editor, current)) {
                tagMenu.val('na');
            } else if (tagMenu.find('option[value=' + tagName + ']').length) {
                tagMenu.val(tagName);
            } else {
                tagMenu.val('other');
            }
            if ($.ui.selectmenu) tagMenu.selectmenu();
        }
    }
    
    $.ui.editor.addPlugin('tagMenu', tagMenu);
    
    console.info('FIXME: tagmenu');
    $.ui.editor.registerUi({
        tagMenu: function(editor) {
            this.ui = $(editor.getTemplate('tagmenu.menu'));
            this.ui.bind('change.' + editor.widgetName, function() {
                var tag = $(this).find(':selected').val();
                if (tag == 'na') return false
                else editor.changeTag(tag);
                $.ui.editor.trigger('resize');
            });
                
            console.info('FIXME: jquery ui select menu only works if the element is visible');
//            if ($.ui.selectmenu) {
//                this.ui.selectmenu({
//                    width: 150
//                });
//            }
            // <strict> 
//            else {
//                console.error(_('jQuery UI selectmenu not found. This library should have been included in the file you downloaded. If not, acquire it here: https://github.com/fnagel/jquery-ui'));
//            }
            // </strict>

            console.info('FIXME: tagmenu customer tooltips');
//            if (editor.options.customTooltips) {
//                button_group.find('.ui-selectmenu').tipTip({
//                    content: _('Change HTML tag of selected element'),
//                    maxWidth: 'auto'
//                });
//            }
//            editor.bind('change', function() {
//                if ($.ui.selectmenu) {
//                    var menu = $('.ui-editor-tag-select');
//                    if (editor.isRoot(editor.getSelectedElements().eq(0))) {
//                        menu.selectmenu('disable');
//                    } else {
//                        menu.selectmenu('enable');
//                    }
//                }
//            });
//            console.info('FIXME check change get fired');
//            this.change = function() {
//                if ($.ui.selectmenu) {
//                    var menu = $('.ui-editor-tag-select');
//                    if (this._util.isRoot.call(this, this._editor.selectedElement)) menu.selectmenu('disable');
//                    else menu.selectmenu('enable');
//                }
//            }
            console.info('FIXME check destory get fired');
            this.destroy = function() {
                if ($.ui.selectmenu) $('.ui-editor-tag-select').selectmenu('destroy');
            }
        }
    });
    
})(jQuery);
