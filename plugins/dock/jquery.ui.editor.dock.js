(function($) {
    $.ui.editor.addButton('dock', {
        name: 'dock',
        title: 'Click to dock the toolbar',
        icons: {
            primary: 'ui-icon-pin-s'
        },
        click: function(event, button) {
            var dialog = this._editor.toolbar.parent();
            dialog.toggleClass('ui-widget-editor-docked');
            this._editor.toolbar.toggleClass('ui-dialog-content').find('.ui-widget-editor-inner').toggleClass('ui-widget-header');
            
            var spacer = $('.ui-widget-editor-dock-spacer');
            if (!spacer.length) {
                spacer = $('<div class="ui-widget-editor-dock-spacer"></div>').prependTo('body');
            }
            spacer.height(this._editor.toolbar.outerHeight()).toggle('fast');
            
            if (!$(button).hasClass('ui-icon-pin-w')) {  // Dock
                
                $(button).find('span.ui-button-icon-primary')
                        .removeClass('ui-icon-pin-s').addClass('ui-icon-pin-w');
                if (this.options.customTooltips) {
                    $(button).tipTip({
                        content: 'Click to detach the toolbar'
                    });
                }
            } else {    // Detach
                $(button).find('span.ui-button-icon-primary')
                    .removeClass('ui-icon-pin-w').addClass('ui-icon-pin-s');
                if (this.options.customTooltips) {
                    $(button).tipTip({
                        content: 'Click to dock the toolbar'
                    });
                }
            }
        },
        destroy: function() {
            var spacer = $('.ui-widget-editor-dock-spacer');
            if (spacer.length) spacer.hide('fast');
        }
    });
})(jQuery);
