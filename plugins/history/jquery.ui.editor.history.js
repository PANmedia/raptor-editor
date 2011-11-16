(function($) {
    
    var history = function(editor, options) {
        var undoStack = {};
        var redoStack = {};
        
        this.toggleButtons = function() {
            var id = editor._util.identify(editor.element);
            editor._editor.toolbar.find('button[name="undo"]').button('option', 'disabled', (
                    undoStack[id] && undoStack[id].length == 0));
            editor._editor.toolbar.find('button[name="redo"]').button('option', 'disabled', (
                    redoStack[id] && redoStack[id].length == 0));
        }
        
        this.clear = function(all) {
            var id = editor._util.identify(editor.element);

            if (typeof all != 'undefined' && all) {
                undoStack = {};
                redoStack = {};
            } else {
                undoStack[id] = [];
                redoStack[id] = [];
            }
        }
                   
        this.undo = function() {
            var id = editor._util.identify(editor.element);
            var data = undoStack[id].pop();

            redoStack[id].push(data);
            
            editor.element.html(data.content);
            
            editor._plugins.history.toggleButtons.call(this);
        }
        
        this.redo = function() {
            var id = editor._util.identify(editor.element);                
            var data = redoStack[id].pop();
                
            undoStack[id].push(data);
            editor.element.html(data.content);
            
            editor._plugins.history.toggleButtons.call(this);
        }
        
        editor.bind('change', $.proxy(function() {
            var currentContent = editor.getHtml();
            var id = $.ui.editor.getUniqueId();

            if (typeof undoStack[id] == 'undefined') undoStack[id] = [];
            redoStack[id] = [];
            
            // Don't add identical content to stack
            if (undoStack[id].length
                    && undoStack[id][undoStack[id].length-1].content == currentContent) {
                return;
            }
            
            undoStack[id].push({
                content: currentContent
            });
        }, this));
        
        
        console.info('FIXME: history detach');
//        this.destroy = function(history) {
//            undoStack = {};
//            redoStack = {};
//        }
    }
    
    // Add history functions
    $.ui.editor.addPlugin('history', history); 
    
    // Add history undo / redo buttons
    $.ui.editor.addButton('undo', function(editor) {
        this.title = _('Step Back');
        this.icons = {
            primary: 'ui-editor-icon-undo'
        };
        this.classes = 'ui-editor-icon';
        this.disabled = true;
        this.click = function() {
            editor.getPlugin('history').undo();
        }
        this.change = function(button) {
            editor.getPlugin('history').toggleButtons();
        }
    });
    
    $.ui.editor.addButton('redo', function(editor) {
        this.title = _('Step Forward');
        this.icons = {
            primary: 'ui-editor-icon-redo'
        };
        this.classes = 'ui-editor-icon';
        this.disabled = true;
        this.click = function() {
            editor.getPlugin('history').redo();
        }
        this.change = function(button) {
            editor.getPlugin('history').toggleButtons();
        }
    });

})(jQuery);
