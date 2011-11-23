(function($) {
    
    $.ui.editor.registerUi({
        i18n: {
            init: function(editor, options) {
                var ui = this;
                var locale = this.persist('locale');
                if (locale) {
                    editor.setLocale(locale);
                }

                var menu = $('<select autocomplete="off" name="i18n"/>');

                for (var key in editor.getLocales()) {
                    var option = $('<option value="' + key + '" class="' + key + '"/>');
                    option.html(editor.getLocaleName(key));

                    if (editor.getLocale() === key) {
                        option.attr('selected', 'selected');
                    }

                    menu.append(option);
                };

                return editor.uiSelectMenu({
                    title: _('Change Language'),
                    select: menu,
                    change: function(value) {
                        editor.setLocale(ui.persist('locale', value));
                    }
                });
            }
        }
    });
    
})(jQuery);
