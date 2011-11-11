jQuery(function($) {
    $('body').prepend('<div class="ui-widget-editor-dock-spacer" />');
});
(function($) {
    $.ui.editor.prototype._buttons.dock = {
        name: 'dock',
        title: 'Dock',
        icons: {
            primary: 'ui-icon-pin-s'
        },
        classes: 'ui-editor-icon',
        click: function() {
            $('.ui-widget-editor-dialog').toggleClass('ui-widget-editor-docked');
            $('.ui-widget-editor-dialog .ui-widget-editor-toolbar')
                    .toggleClass('ui-widget-header')
                    .toggleClass('ui-dialog-content');
            var height = $('.ui-widget-editor-dialog .ui-widget-editor-toolbar').outerHeight();
            $('.ui-widget-editor-dock-spacer').height(height)
            $('.ui-widget-editor-dock-spacer').toggle();
        }
    };
})(jQuery);