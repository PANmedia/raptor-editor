(function($) {
    
    $.ui.editor.addPlugin('tagMenu', {
        titleTagList: function(current) {
            var tagMenu = this._editor.toolbar.find('select.ui-editor-tag-select'),
                tagName = current[0].tagName.toLowerCase();
                        
            if (this._util.isRoot.call(this, current)) {
                tagMenu.val('na');
            } else if (tagMenu.find('option[value=' + tagName + ']').length) {
                tagMenu.val(tagName);
            } else {
                tagMenu.val('other');
            }
            tagMenu.selectmenu();
        }
    });
    
    $.ui.editor.addButton('tagMenu', {
        title: 'Tag Menu',
        initialize: function(object, button_group) {
            var editorInstance = this;
            $('<select autocomplete="off" name="tag" class="ui-editor-tag-select">\
                <option value="na">N/A</option>\
                <option value="p">Paragraph</option>\
                <option value="h1">Heading&nbsp;1</option>\
                <option value="h2">Heading&nbsp;2</option>\
                <option value="h3">Heading&nbsp;3</option>\
                <option value="div">Divider</option>\
            </select>').appendTo(button_group).data(editorInstance._data.names.button, object).bind('change.editor', function(){
                    var tag = $(this).find(':selected').val();
                    if (tag == 'na') return false
                    else editorInstance._selection.changeTag.call(editorInstance, tag);
                }).selectmenu({
                width: 150
            });

            if (this.options.customTooltips) {
                button_group.find('.ui-selectmenu').tipTip({
                    content: 'Change HTML tag of selected element',
                    maxWidth: 'auto'
                });
            }
        },
        stateChange: function() {
            var menu = $('.ui-editor-tag-select');
            if (this._util.isRoot.call(this, this._editor.selectedElement)) menu.selectmenu('disable');
            else menu.selectmenu('enable');
        },
        destroy: function() {
            $('.ui-editor-tag-select').selectmenu('destroy');
        }
    });
    
})(jQuery);
