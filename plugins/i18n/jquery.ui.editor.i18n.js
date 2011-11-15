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
        
        // <debug> 
        console.log(_('Locale <*localeName*> added', { localeName: name }), strings);
        // </debug>
    };

    $.ui.editor.addPlugin('i18n', {
        translations: {},
        
        localeNames: {
            zh_CN: _('Simplified Chinese'),
            en: _('English')
        },
        
        translate: function(string, variables) {
            
            // <debug>
            var original_string = string;
            // </debug>
            
            if (!variables) {
            
                // <debug>
                //console.log('i18n: ' + string + ' | '  + original_string);
                // </debug>
            
                return string;
            } else {
                
                $.each(variables, function(key, value) {
                    string = string.replace('<*' + key + '*>', value);
                });
            
                // <debug>
                //console.log('i18n: ' + string + ' | '  + original_string);
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
                icons = [];
                
                $.each(this._plugins.i18n.translations, function(key){
                    menu.append($('<option value="' + key + '" class="' + key + '">' + editorInstance._plugins.i18n.translate(key) + '</option>'));
                    icons.push({
                        find: '.' + key,
                        icon: 'ui-widget-editor-i18n-' + key
                    });
                });
                
                menu.appendTo(button_group).data(editorInstance._data.names.button, object);

            if ($.ui.selectmenu) {
                menu.selectmenu({
                    width: 150,
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
