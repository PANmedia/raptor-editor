$.ui.editor.registerUi({
    clean: {
        init: function(editor) {
            return editor.uiButton({
                title: _('Clean'),
                click: function() {
                    console.log(this);
                    this.clean();
                }
            });
        },
        
        clean: function() {
            this.editor.getElement().find('[_moz_dirty]').removeAttr('_moz_dirty');
        }
    }
});
