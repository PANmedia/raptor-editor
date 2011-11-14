(function($) {
    $.ui.editor.addButton('cancel', {
        title: 'Cancel',
        icons: {
            primary: 'ui-icon-cancel'
        },
        click: function(event, button) {
            // If the user has provided or bound their own cancel function 
            // Allow them to cancel the default
            if (this._trigger('cancel')) {
                // Confirm
                var editorInstance = this,
                    destroy = function() {
                        editorInstance._content.reset.call(editorInstance);
                        editorInstance.destroy();
                    };
                if (!this._content.dirtyBlocksExist.call(this)) {
                    destroy();
                } else {
                    this._dialog.confirmation.show.call(this, {
                        message: 'Are you sure you want to stop editing? <br/><br/>All changes will be lost!',
                        title: 'Confirm Cancel Editing',
                        ok: function(){
                            destroy();
                        }
                    });
                }
            }
        }
    });
})(jQuery);
