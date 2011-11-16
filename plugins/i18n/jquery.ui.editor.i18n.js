(function($) {
    
    var translations = {};
    var currentLocale = null;
    var localeNames = {
        zh_CN: '简体中文',
        en: 'English'
    };
    
    function translate(string, variables) {
        if (currentLocale && translations[currentLocale]
                && translations[currentLocale][string]) {
            string = translations[currentLocale][string];
        }

        if (!variables) {
            return string;
        } else {
            $.each(variables, function(key, value) {
                string = string.replace('<*' + key + '*>', value);
            });

            return string;
        }
    }

    $.ui.editor.addLocale = function(name, strings) {
        // <strict>
        if (translations[name]) {
            console.error(_('Locale "<*localeName*>" has already been registered, and will be overwritten', { localeName: name }));
        }
        // </strict>
        
        translations[name] = strings;
        if (!currentLocale) currentLocale = name;
        // <debug> 
        console.debug(_('Locale <*localeName*> added', { localeName: name }), strings);
        // </debug>
    };
    
    $.ui.editor.addButton('i18n', function(editor) {
        this.title = _('Change Language');
        console.info('FIXME: i18n button')
        this.initialize = function(object, button_group) {
            var menu = $('<select autocomplete="off" name="i18n" class="ui-editor-i18n-select"></select>'),
                icons = [],
                option = null,
                editor = this;
                
            $.each(translations, function(key){
                option = '<option value="' + key + '" class="' + key + '">';
                option += localeNames[key];
                option += '</option>';
                
                if (currentLocale == key) option = $(option).prop('selected', true);
                
                menu.append(option);
                icons.push({
                    find: '.' + key,
                    icon: 'ui-widget-editor-i18n-' + key
                });
            });
            
            menu.appendTo(button_group).data(editor._data.names.button, object);
            
            menu.bind('change.i18n', function() {
                currentLocale = $(this).find(':selected').val();
                editor._editor.attach.call(editor, editor.element);
            });

            if ($.ui.selectmenu) {
                menu.selectmenu({
                    width: 'auto',
                    icons: icons
                });
            }
            
            // <strict> 
            else {
                console.error(_('jQuery UI selectmenu not found. This library should have been included in the file you downloaded. If not, acquire it here: https://github.com/fnagel/jquery-ui'));
            }
            // </strict>

            if (this.options.customTooltips) {
                button_group.find('.ui-selectmenu').tipTip({
                    content: _('Change jQuery Editor Interface Language'),
                    maxWidth: 'auto'
                });
            }
        }
        this.destroy = function() {
            if ($.ui.selectmenu) $('.ui-editor-i18n-select').selectmenu('destroy');
        }
    });
    
})(jQuery);
