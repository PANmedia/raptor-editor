(function($) {
    
    var dock = function(editor, options) {
        var docked = false;
        
        if (options.docked) {
            this.dock();
        }
        
        this.dock = function() {
            docked = true;
            this.dialog().addClass('ui-widget-editor-docked');
            this.toolbar().addClass('ui-widget-header');
            this.button().button({ icons: { primary: 'ui-icon-pin-w' } });
            if (editor.options.customTooltips) {
                this.button().tipTip({
                    content: _('Click to detach the toolbar')
                });
            }
            this.spacer().height(this.toolbar().outerHeight()).show();
            editor.trigger('resize');
        }
        
        this.undock = function() {
            docked = false;
            this.dialog().removeClass('ui-widget-editor-docked');
            this.dialog().find('.ui-widget-editor-inner:first').removeClass('ui-widget-header');
            this.button().button({ icons: { primary: 'ui-icon-pin-s' } });
            if (editor.options.customTooltips) {
                this.button().tipTip({
                    content: _('Click to dock the toolbar')
                });
            }
            this.spacer().hide();
            editor.trigger('resize');
        }
        
        this.isDocked = function() {
            return docked;
        }
        
        this.dialog = function() {
            return editor._editor.toolbar.parent();
        }
        
        this.toolbar = function() {
            return this.dialog().find('.ui-widget-editor-inner:first');
        }
        
        this.button = function() {
            return this.dialog().find('.ui-widget-editor-button-dock');
        }
        
        this.spacer = function() {
            var spacer = $('.ui-widget-editor-dock-spacer');
            if (!spacer.length) {
                $('<div class="ui-widget-editor-dock-spacer"></div>').prependTo('body');
            }
            return $('.ui-widget-editor-dock-spacer');
        }
        
        this.destroy = function() {
            var spacer = $('.ui-widget-editor-dock-spacer');
            if (spacer.length) spacer.hide('fast');
            delete editor;
        }
    };
    
    $.ui.editor.addPlugin('dock', dock);
    
    $.ui.editor.addButton('dock', function(editor) {
        this.name = 'dock';
        this.title = _('Click to dock the toolbar');
        this.icons = {
            primary: 'ui-icon-pin-s'
        }
        this.click = function() {
            var plugin = editor.getPlugin('dock');
            if (plugin.isDocked()) plugin.undock();
            else plugin.dock();
//            return;
//            var dialog = this._editor.toolbar.parent();
//            dialog.toggleClass('ui-widget-editor-docked');
//            this._editor.toolbar.toggleClass('ui-dialog-content').find('.ui-widget-editor-inner').toggleClass('ui-widget-header');
//            
//            if (!this._plugins.dock.docked) {
//                // Dock
//                this._plugins.dock.docked = true;
//                $(button).button({ icons: { primary: 'ui-icon-pin-w' } });
//                if (this.options.customTooltips) {
//                    $(button).tipTip({
//                        content: _('Click to detach the toolbar')
//                    });
//                }
//            } else {
//                // Detach
//                this._plugins.dock.docked = false;                
//                $(button).button({ icons: { primary: 'ui-icon-pin-s' } });
//                if (this.options.customTooltips) {
//                    $(button).tipTip({
//                        content: _('Click to dock the toolbar')
//                    });
//                }
//            }
//            
//            var spacer = $('.ui-widget-editor-dock-spacer');
//            if (!spacer.length) spacer = $('<div class="ui-widget-editor-dock-spacer"></div>').prependTo('body');
//            spacer.height(this._editor.toolbar.outerHeight());
//            if (this._plugins.unsavedEditWarning) {
//                if (this._data.exists(this.element, this.options.plugins.unsavedEditWarning.dataName)) {
//                    var warning = $(this.element.data(this.options.plugins.unsavedEditWarning.dataName)),
//                        editorInstance = this;
//                    $(warning).hide(this.options.plugins.unsavedEditWarning.animation, function() {
//                        spacer.toggle(function() {
//                            editorInstance._actions.stateChange.call(editorInstance);
//                            editorInstance._plugins.unsavedEditWarning.show.call(editorInstance);
//                        });
//                    });
//                }
//            } else {
//                spacer.toggle('fast');
//            }
        }
    });
})(jQuery);
