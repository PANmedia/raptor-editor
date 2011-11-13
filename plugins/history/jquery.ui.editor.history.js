(function($) {
    
    // Add history destroy function
    $.ui.editor.prototype._onDestroy.push(function() {
        this._history.undoStack = {};
        this._history.redoStack = {};
    });
    
    // Add history functions
    $.ui.editor.prototype._history = {
            
        undoStack: {},
        redoStack: {},
        
        toggleButtons: function() {
            var id = this._util.identify(this.element);
            this._editor.toolbar.find('button[name="undo"]').button('option', 'disabled', this._history.undoStack[id].length == 0);
            this._editor.toolbar.find('button[name="redo"]').button('option', 'disabled', this._history.redoStack[id].length == 0);
            this._content.unsavedEditWarning.toggle.call(this);
        },
        
        clear: function(all) {
            var id = this._util.identify(this.element);

            if (typeof all != 'undefined' && all) {
                this._history.undoStack = {};
                this._history.redoStack = {};
            } else {
                this._history.undoStack[id] = [];
                this._history.redoStack[id] = [];
            }
        },
                   
        undo: function() {
            var id = this._util.identify(this.element);
            var data = this._history.undoStack[id].pop();

            this._history.redoStack[id].push(data);
            
            this.element.html(data.content);
            
            this._history.toggleButtons.call(this);
        },
        
        redo: function() {
            var id = this._util.identify(this.element);                
            var data = this._history.redoStack[id].pop();
                
            this._history.undoStack[id].push(data);
            this.element.html(data.content);
            
            this._history.toggleButtons.call(this);
        },
        
        update: function() {
            
            var currentContent = this._content.cleaned(this.element.html());
            var id = this._util.identify(this.element);

            if (typeof this._history.undoStack[id] == 'undefined') this._history.undoStack[id] = [];
            this._history.redoStack[id] = [];
            
            // Don't add identical content to stack
            if (this._history.undoStack[id].length
                    && this._history.undoStack[id][this._history.undoStack[id].length-1].content == currentContent) {
                return;
            }
            
            this._history.undoStack[id].push({
                content: currentContent
            });
        }
    };
    
    // Add history undo / redo buttons
    $.ui.editor.addButton('undo', {
        title: 'Step Back',
        icons: {
            primary: 'ui-editor-icon-undo'
        },
        classes: 'ui-editor-icon',
        disabled: true,
        click: function() {
            this._history.undo.call(this);
        },
        stateChange: function(button) {
            this._history.toggleButtons.call(this);
        }
    });
    
    $.ui.editor.addButton('redo', {
        title: 'Step Forward',
        icons: {
            primary: 'ui-editor-icon-redo'
        },
        classes: 'ui-editor-icon',
        disabled: true,
        click: function() {
            this._history.redo.call(this);
        },
        stateChange: function(button) {
            this._history.toggleButtons.call(this);
        }
    });

})(jQuery);
