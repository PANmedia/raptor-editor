/**
 * @property {String|null} currentLocale
 */
var currentLocale = null;

/**
 * @property {Object} locales
 */
var locales = {};

/**
 * @property {Object} localeNames
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
    if (!currentLocale) currentLocale = name;
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
 * @param {Object} variables
 */
function _(string, variables) {
    // Get the current locale translated string
    if (currentLocale &&
            locales[currentLocale] &&
            locales[currentLocale][string]) {
        string = locales[currentLocale][string];
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
