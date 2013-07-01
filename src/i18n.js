/**
 * @fileOverview Editor internationalization (i18n) private functions and properties.
 * @license http://www.raptor-editor.com/license
 *
 * @author David Neilsen <david@panmedia.co.nz>
 * @author Michael Robinson <michael@panmedia.co.nz>
 */

/**
 * @type String|null
 */
var currentLocale = null;

/**
 * @type Object
 */
var locales = {};

/**
 * @type Object
 */
var localeNames = {};

/**
 *
 * @static
 * @param {String} name
 * @param {String} nativeName
 * @param {Object} strings
 */
function registerLocale(name, nativeName, strings) {
    // <strict>
    if (locales[name]) {
        handleError(_('Locale "{{localeName}}" has already been registered, and will be overwritten', {localeName: name}));
    }
    // </strict>

    locales[name] = strings;
    localeNames[name] = nativeName;
    if (!currentLocale) {
        currentLocale = name;
    }
}

/**
 * Extends an existing locale.
 *
 * @static
 * @param {String} name
 * @param {Object} strings
 */
function extendLocale(name, strings) {
    for (var key in strings) {
        locales[name][key] = strings[key];
    }
}

/**
 * @param {String} key
 */
function setLocale(key) {
    if (currentLocale !== key) {
        // <debug>
        debug('Changing locale', key);
        // </debug>

        currentLocale = key;
        Raptor.eachInstance(function() {
            this.localeChange();
        });
    }
}

/**
 * Return the localised string for the current locale if present, else the
 * localised string for the first available locale, failing that return the
 * string.
 *
 * @param  {string} string
 * @param  {Boolean} allowMissing If true and the localized string is missing, false is returned.
 * @return {string|false}
 */
function getLocalizedString(string, allowMissing) {
    if (typeof locales[currentLocale] !== 'undefined' &&
            typeof locales[currentLocale][string] !== 'undefined') {
        return locales[currentLocale][string];
    }

    for (var localeName in localeNames) {
        if (typeof locales[localeName][string] !== 'undefined') {
            return locales[localeName][string];
        }
    }

    if (allowMissing) {
        return false;
    }

    // <debug>
    if (debugLevel >= MIN) {
        handleError('Missing locale string: ' + string);
    }
    // </debug>
    return string;
}

/**
 * Internationalisation function. Translates a string with tagged variable
 * references to the current locale.
 *
 * <p>
 * Variable references should be surrounded with double curly braces {{ }}
 *      e.g. "This string has a variable: {{my.variable}} which will not be translated"
 * </p>
 *
 * @static
 * @param {String} string
 * @param {Object|false} variables If false, then no string is returned by default.
 */
function _(string, variables) {
    // Get the current locale translated string
    string = getLocalizedString(string, variables === false);
    if (string === false) {
        return false;
    }

    // Convert the variables
    if (!variables) {
        return string;
    } else {
        for (var key in variables) {
            string = string.replace('{{' + key + '}}', variables[key]);
        }
        return string;
    }
}
