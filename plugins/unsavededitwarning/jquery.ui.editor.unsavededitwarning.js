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
                if (editor.isDirty()) this.show();
                else this.hide();
            }, this);

            editor.bind('destroy', function() {
                this.warning.remove();
            }, this);
        },
        
        show: function() {
            this.reposition();
            this.warning.addClass(this.options.baseClass + '-visible');
        },

        hide: function() {
            this.warning.removeClass(this.options.baseClass + '-visible');
        },

        reposition: function() {
            this.options.position.of = this.editor.element;
            this.warning.position(this.options.position);
        }
    });

    $.ui.editor.bind('resize', function() {
        var instances = this.getInstances();
        for (var i in instances) {
            var plugin = instances[i].getPlugin('unsavedEditWarning');
            if (plugin) {
                plugin.reposition();
            }
        };
    });
    
})();
