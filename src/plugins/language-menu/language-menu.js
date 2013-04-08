/**
 * @fileOverview Contains the insert file button code.
 * @license http://www.raptor-editor.com/license
 *
 * @author David Neilsen <david@panmedia.co.nz>
 * @author Michael Robinson <michael@panmedia.co.nz>
 * @author Melissa Richards <melissa@panmedia.co.nz>
 */

/**
 * The language menu class.
 *
 * @constructor
 * @augments SelectMenu
 * @param {Object} options
 */
function LanguageMenu(options) {
    SelectMenu.call(this, {
        name: 'languageMenu'
    });
}

LanguageMenu.prototype = Object.create(SelectMenu.prototype);

/**
 * Initialize the language menu.
 *
 * @return {Element}
 */
LanguageMenu.prototype.init = function() {
    var result = Menu.prototype.init.call(this);
    aButtonSetLabel(this.button.button, _('languageMenu' + currentLocale.toUpperCase().replace('-', '')));
    aButtonSetIcon(this.button.button, 'ui-icon-flag-' + currentLocale.toLowerCase());
    return result;
};

/**
 * Change the editor's language to the current selection.
 *
 * @param {Event} event
 */
LanguageMenu.prototype.changeLanguage = function(event) {
    var locale = $(event.currentTarget).data('value');
    setTimeout(function() {
        setLocale(locale);
    }, 1);
};

/**
 * @return {jQuery}
 */
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
        .click(this.changeLanguage.bind(this));
};

Raptor.registerUi(new LanguageMenu());
