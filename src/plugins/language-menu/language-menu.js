function LanguageMenu(options) {
    SelectMenu.call(this, {
        name: 'languageMenu'
    });
}

LanguageMenu.prototype = Object.create(SelectMenu.prototype);

LanguageMenu.prototype.init = function() {
    var result = Menu.prototype.init.call(this);
    aButtonSetLabel(this.button.button, _('languageMenu' + currentLocale.toUpperCase().replace('-', '')));
    aButtonSetIcon(this.button.button, 'ui-icon-flag-' + currentLocale.toLowerCase());
    return result;
}

LanguageMenu.prototype.changeLanguage = function(event) {
    var locale = $(event.currentTarget).data('value');
    setTimeout(function() {
        setLocale(locale);
    }, 1);
};

LanguageMenu.prototype.getMenuItems = function() {
    var items = '';
    for (var locale in locales) {
        items += this.raptor.getTemplate('language-menu.item', {
            label: _('languageMenu' + locale.toUpperCase().replace('-', '')),
            value: locale,
            icon: locale.toLowerCase()
        });
    }
    return $(items)
        .click(this.changeLanguage.bind(this))
};

Raptor.registerUi(new LanguageMenu());
