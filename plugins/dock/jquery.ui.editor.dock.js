(function($) {
    
    var dock = {
        editor: null,
        docked: false,
        initialize: function(editor, options) {
            this.editor = editor;
            if (options.docked) {
                this.dock();
            }
        },
        dock: function() {
            this.docked = true;
            this.dialog().addClass('ui-widget-editor-docked');
            this.toolbar().addClass('ui-widget-header');
            this.button().button({ icons: { primary: 'ui-icon-pin-w' } });
            if (this.editor.options.customTooltips) {
                this.button().tipTip({
                    content: _('Click to detach the toolbar')
                });
            }
            this.spacer().height(this.toolbar().outerHeight()).show();
            this.editor.trigger('resize');
        },
        undock: function() {
            this.docked = false;
            this.dialog().removeClass('ui-widget-editor-docked');
            this.dialog().find('.ui-widget-editor-inner:first').removeClass('ui-widget-header');
            this.button().button({ icons: { primary: 'ui-icon-pin-s' } });
            if (this.editor.options.customTooltips) {
                this.button().tipTip({
                    content: _('Click to dock the toolbar')
                });
            }
            this.spacer().hide();
            this.editor.trigger('resize');
        },
        dialog: function() {
            return this.editor._editor.toolbar.parent();
        },
        toolbar: function() {
            return this.dialog().find('.ui-widget-editor-inner:first');
        },
        button: function() {
            return this.dialog().find('.ui-widget-editor-button-dock');
        },
        spacer: function() {
            var spacer = $('.ui-widget-editor-dock-spacer');
            if (!spacer.length) {
                $('<div class="ui-widget-editor-dock-spacer"></div>').prependTo('body');
            }
            return $('.ui-widget-editor-dock-spacer');
        },
        destroy: function() {
            var spacer = $('.ui-widget-editor-dock-spacer');
            if (spacer.length) spacer.hide('fast');
            delete this.editor;
        }
    };
    
    $.ui.editor.addPlugin('dock', dock);
    
    $.ui.editor.addButton('dock', {
        name: 'dock',
        title: _('Click to dock the toolbar'),
        icons: {
            primary: 'ui-icon-pin-s'
        },
        click: function(event, button) {
            if (!dock.docked) dock.dock();
            else dock.undock();
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
