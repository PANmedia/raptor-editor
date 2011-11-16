(function($) {
   
    $.ui.editor.addButton('floatLeft', function(editor) {
        this.title = _('Float Left');
        this.icons = {
            primary: 'ui-icon-float-left'
        };
        this.classes = 'ui-editor-icon';
        this.click = function() {
            editor.applyStyle({ 'float': 'left' });
        }
    });
    
    $.ui.editor.addButton('floatRight', function(editor) {
        this.title = _('Float Right');
        this.icons = {
            primary: 'ui-icon-float-right'
        };
        this.classes = 'ui-editor-icon';
        this.click = function() {
            editor.applyStyle({ 'float': 'right' });
        }
    });
    
    $.ui.editor.addButton('floatNone', function(editor) {
        this.title = _('Float None');
        this.icons = {
            primary: 'ui-icon-float-none'
        };
        this.classes = 'ui-editor-icon';
        this.click = function() {
            editor.applyStyle({ 'float': 'none' });
        }
    });
    
})(jQuery);
