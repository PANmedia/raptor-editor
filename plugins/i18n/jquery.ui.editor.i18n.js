(function($) {

    $.ui.editor.addLocale = function(name, strings) {
        // <strict>
        if (!$.ui.editor.prototype._plugins.i18n) {
            console.error(_('i18n plugin not loaded'));
            return false;
        }
        if ($.ui.editor.prototype._plugins.i18n.translations[name]) {
            console.error(_('Locale "<*localeName*>" has already been registered, and will be overwritten', { localeName: name }));
        }
        // </strict>
        
        $.ui.editor.prototype._plugins.i18n.translations[name] = strings;
        if (!$.ui.editor.prototype._plugins.i18n.currentLocale) $.ui.editor.prototype._plugins.i18n.currentLocale = name;
        // <debug> 
        console.debug(_('Locale <*localeName*> added', { localeName: name }), strings);
        // </debug>
    };

    $.ui.editor.addPlugin('i18n', {
        translations: {},
        currentLocale: null,
        localeNames: {
            zh_CN: '简体中文',
            en: 'English'
        },
        
        translate: function(string, variables) {
            
            // <debug>
            var original_string = string;
            // </debug>
            
            var currentLocale = $.ui.editor.prototype._plugins.i18n.currentLocale;
            
            if (currentLocale && $.ui.editor.prototype._plugins.i18n.translations[currentLocale]
                && $.ui.editor.prototype._plugins.i18n.translations[currentLocale][string]) {
                string = $.ui.editor.prototype._plugins.i18n.translations[currentLocale][string];
            }
            
            if (!variables) {
            
                // <debug>
                console.info('i18n: ' + string + ' | '  + original_string);
                // </debug>
            
                return string;
            } else {
                
                $.each(variables, function(key, value) {
                    string = string.replace('<*' + key + '*>', value);
                });
            
                // <debug>
                console.info('i18n: ' + string + ' | '  + original_string);
                // </debug>
            
                return string;
            }
        }
    });
    
    $.ui.editor.addButton('i18n', {
        title: _('Change Language'),
        initialize: function(object, button_group) {
            var editorInstance = this,
                menu = $('<select autocomplete="off" name="i18n" class="ui-editor-i18n-select"></select>'),
                icons = [],
                option = null;
                
                $.each(this._plugins.i18n.translations, function(key){
                    option = '<option value="' + key + '" class="' + key + '">';
                    option += editorInstance._plugins.i18n.localeNames[key];
                    option += '</option>';
                    
                    if (editorInstance._plugins.i18n.currentLocale == key) option = $(option).prop('selected', true);
                    
                    menu.append(option);
                    icons.push({
                        find: '.' + key,
                        icon: 'ui-widget-editor-i18n-' + key
                    });
                });
                
                menu.appendTo(button_group).data(editorInstance._data.names.button, object);
                
                menu.bind('change.i18n', function() {
                    editorInstance._plugins.i18n.currentLocale = $(this).find(':selected').val();
                    editorInstance._editor.attach.call(editorInstance, editorInstance.element);
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
        },
        destroy: function() {
            if ($.ui.selectmenu) $('.ui-editor-i18n-select').selectmenu('destroy');
        }
    });
    
})(jQuery);
