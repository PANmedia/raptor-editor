(function($) {
    
    // Add history functions
    $.ui.editor.addPlugin('history', {
            
        undoStack: {},
        redoStack: {},
        
        toggleButtons: function() {
            var id = this._util.identify(this.element);
            this._editor.toolbar.find('button[name="undo"]').button('option', 'disabled', (
                    this._plugins.history.undoStack[id] && this._plugins.history.undoStack[id].length == 0));
            this._editor.toolbar.find('button[name="redo"]').button('option', 'disabled', (
                    this._plugins.history.redoStack[id] && this._plugins.history.redoStack[id].length == 0));
        },
        
        clear: function(all) {
            var id = this._util.identify(this.element);

            if (typeof all != 'undefined' && all) {
                this._plugins.history.undoStack = {};
                this._plugins.history.redoStack = {};
            } else {
                this._plugins.history.undoStack[id] = [];
                this._plugins.history.redoStack[id] = [];
            }
        },
                   
        undo: function() {
            var id = this._util.identify(this.element);
            var data = this._plugins.history.undoStack[id].pop();

            this._plugins.history.redoStack[id].push(data);
            
            this.element.html(data.content);
            
            this._plugins.history.toggleButtons.call(this);
        },
        
        redo: function() {
            var id = this._util.identify(this.element);                
            var data = this._plugins.history.redoStack[id].pop();
                
            this._plugins.history.undoStack[id].push(data);
            this.element.html(data.content);
            
            this._plugins.history.toggleButtons.call(this);
        },
        
        update: function() {
            
            var currentContent = this._content.cleaned(this.element.html());
            var id = this._util.identify(this.element);

            if (typeof this._plugins.history.undoStack[id] == 'undefined') this._plugins.history.undoStack[id] = [];
            this._plugins.history.redoStack[id] = [];
            
            // Don't add identical content to stack
            if (this._plugins.history.undoStack[id].length
                    && this._plugins.history.undoStack[id][this._plugins.history.undoStack[id].length-1].content == currentContent) {
                return;
            }
            
            this._plugins.history.undoStack[id].push({
                content: currentContent
            });
        },
        
        stateChange: function(history) {
            this._plugins.history.update.call(this);
        },
        
        destroy: function(history) {
            this._plugins.history.undoStack = {};
            this._plugins.history.redoStack = {};
        }
    }); 
    
    // Add history undo / redo buttons
    $.ui.editor.addButton('undo', {
        title: _('Step Back'),
        icons: {
            primary: 'ui-editor-icon-undo'
        },
        classes: 'ui-editor-icon',
        disabled: true,
        click: function() {
            this._plugins.history.undo.call(this);
        },
        stateChange: function(button) {
            this._plugins.history.toggleButtons.call(this);
        }
    });
    
    $.ui.editor.addButton('redo', {
        title: _('Step Forward'),
        icons: {
            primary: 'ui-editor-icon-redo'
        },
        classes: 'ui-editor-icon',
        disabled: true,
        click: function() {
            this._plugins.history.redo.call(this);
        },
        stateChange: function(button) {
            this._plugins.history.toggleButtons.call(this);
        }
    });

})(jQuery);
