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
                .attr('id', editor.getUniqueId())
                .appendTo('body');

            editor.bind('change', function() {
                if (editor.isDirty() && editor.isEditing()) this.show();
                else this.hide();
            }, this);

            editor.bind('destroy', function() {
                this.warning.remove();
                this.warning = null;
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
            // <strict>
            if (!$(this.options.position.of).length) {
                throw 'Editor element has been removed, unsaved edit warning plugin cannot reposition'; 
            }
            // </strict>
            this.warning.position(this.options.position);
        }
    });

    $.ui.editor.bind('resize', function() {
        var instances = this.getInstances();
        for (var i = 0; i < instances.length; i++) {
            if (instances[i].getPlugin('unsaved-edit-warning')) {
                instances[i].getPlugin('unsaved-edit-warning').reposition();
            }
        };
    });
    
})();
