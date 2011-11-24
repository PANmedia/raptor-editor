$.ui.editor.registerUi({
    clean: {
        init: function(editor) {
            return editor.uiButton({
                title: _('Remove unnecessary markup from editor content'),
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
