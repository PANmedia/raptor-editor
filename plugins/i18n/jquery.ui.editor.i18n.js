(function($) {
    $.ui.editor.addPlugin('i18n', {
        translations: {},
        
        translate: function(string, variables) {
            
        }
    });
    
    $.ui.editor.prototype.addLocale = function(name, strings) {
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
    }
});
