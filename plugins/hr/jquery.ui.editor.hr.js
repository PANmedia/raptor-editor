(function($) {
    $.ui.editor.addButton('hr', {
        title: _('Insert Horizontal Rule'),
        icons: {
            primary: 'ui-icon-hr'
        },
        classes: 'ui-editor-icon',
        click: function() {
            this._selection.insertTag.call(this, 'hr');
        }
    });
})(jQuery);
