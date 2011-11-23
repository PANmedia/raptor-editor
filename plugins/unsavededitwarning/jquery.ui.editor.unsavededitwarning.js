(function() {
        
    $.ui.editor.registerPlugin('unsaved-edit-warning', {
        // Default options
        options: {
            contentClass: '',
            position: {
                collision: 'right bottom',
                at: 'right bottom',
                my: 'right bottom',
                using: function(position) {
                    $(this).css({
                        position: 'absolute',
                        top: position.top,
                        left: position.left
                    });
                }
            }
        },
        
        init: function(editor, options) {
            this.warning = $(editor.getTemplate('unsavededitwarning.warning', this.options))
                .appendTo('body');

            editor.bind('change', function() {
                if (editor.isDirty() && editor.isEditing()) this.show();
                else this.hide();
            }, this);

            editor.bind('destroy', function() {
                this.warning.remove();
            }, this);
        },
        
        show: function() {
            this.reposition();
            this.warning.addClass(this.options.baseClass + '-visible').show();
        },

        hide: function() {
            this.warning.removeClass(this.options.baseClass + '-visible');
        },

        reposition: function() {
            // Have to use the ID because if given the element, the browser will memory leak and crash
            this.options.position.of = '#' + this.editor.getElement().attr('id');
            this.warning.position(this.options.position);
        }
    });

    $.ui.editor.bind('resize', function() {
        for (var i in this.getInstances()) {
            if (this.getInstances()[i].getPlugin('unsaved-edit-warning')) {
                this.getInstances()[i].getPlugin('unsaved-edit-warning').reposition();
            }
        };
    });
    
})();
