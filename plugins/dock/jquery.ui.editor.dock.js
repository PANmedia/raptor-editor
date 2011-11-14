(function($) {
    
    $.ui.editor.addPlugin('dock', {
        docked: false,
        initialize: function() {
            
        },
        destroy: function() {
            var spacer = $('.ui-widget-editor-dock-spacer');
            if (spacer.length) spacer.hide('fast');
        }
    });
    
    $.ui.editor.addButton('dock', {
        name: 'dock',
        title: _('Click to dock the toolbar'),
        icons: {
            primary: 'ui-icon-pin-s'
        },
        click: function(event, button) {
            var dialog = this._editor.toolbar.parent();
                            
            dialog.toggleClass('ui-widget-editor-docked');
            this._editor.toolbar.toggleClass('ui-dialog-content').find('.ui-widget-editor-inner').toggleClass('ui-widget-header');
            
            if (!this._plugins.dock.docked) {  // Dock
                this._plugins.dock.docked = true;
                $(button).find('span.ui-button-icon-primary')
                        .removeClass('ui-icon-pin-s').addClass('ui-icon-pin-w');
                if (this.options.customTooltips) {
                    $(button).tipTip({
                        content: _('Click to detach the toolbar')
                    });
                }
            } else {    // Detach
                this._plugins.dock.docked = false;                
                $(button).find('span.ui-button-icon-primary')
                    .removeClass('ui-icon-pin-w').addClass('ui-icon-pin-s');
                if (this.options.customTooltips) {
                    $(button).tipTip({
                        content: _('Click to dock the toolbar')
                    });
                }
            }
            
            var spacer = $('.ui-widget-editor-dock-spacer');
            if (!spacer.length) spacer = $('<div class="ui-widget-editor-dock-spacer"></div>').prependTo('body');
            spacer.height(this._editor.toolbar.outerHeight());
            if (this._plugins.unsavedEditWarning) {
                if (this._data.exists(this.element, this.options.plugins.unsavedEditWarning.dataName)) {
                    var warning = $(this.element.data(this.options.plugins.unsavedEditWarning.dataName)),
                        editorInstance = this;
                    $(warning).hide(this.options.plugins.unsavedEditWarning.animation, function() {
                        spacer.toggle(function() {
                            editorInstance._actions.stateChange.call(editorInstance);
                            editorInstance._plugins.unsavedEditWarning.show.call(editorInstance);
                        });
                    });
                }
            } else {
                spacer.toggle('fast');
            }
        }
    });
})(jQuery);
