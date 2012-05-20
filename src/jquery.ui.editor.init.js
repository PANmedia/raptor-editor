// <debug>
/**
 * Minimum debugging level (only available in dev and debug build)
 * @type int
 * @constant
 */
var MIN = 100;
/**
 * Medium debugging level (only available in dev and debug build)
 * @type int
 * @constant
 */
var MID = 500;
/**
 * Maximum debugging level (only available in development and debug build)
 * @type int
 * @constant
 */
var MAX = 1000;
/**
 * Current debugging level
 * @type int
 */
var debugLevel = MIN;


/**
 * Output a informational message, by default to the JS console (only avalible in development and debug build).
 *
 * @param {String} message1
 * @param {String} [message2...]
 */
function info() {
    var args = Array.prototype.slice.call(arguments);
    args.unshift('jQuery UI Editor');
    console.info.apply(console, args);
}

/**
 * Output a debug message, by default to the JS console (only avalible in development and debug build).
 *
 * @param {String} message1
 * @param {String} [message2...]
 */
function debug() {
    var args = Array.prototype.slice.call(arguments);
    args.unshift('Raptor Editor');
    console.debug.apply(console, args);
}

// Show some debugging information on ready
if (debugLevel >= MID) {
    $(function() {
        var result = [];
        for (var key in $.ui.editor.registeredUi) result.push(key);
        info(_('UI loaded: {{ui}} ', {ui: result.join(', ')}));

        result = [];
        for (key in $.ui.editor.plugins) result.push(key);
        info(_('Plugins loaded: {{plugins}} ', {plugins: result.join(', ')}));

        result = [];
        for (key in $.ui.editor.translations) result.push(key);
        info(_('Locales loaded: {{translations}} ', {translations: result.join(', ')}));
    });
}

if (debugLevel >= MAX) {
    info('TODO: dont fire events when editing is disabled');
    info('TODO: use cookies when local storage is not available, or chosen by option');
    info('TODO: make a way to disable all buttons then selectivity enable ones');
    info('TODO: locale switches should affect all instances');
    info('FIXME: remove editor instance from instances array on destroy');
    info('FIXME: Check for localStorage or use jQuery cookie');
    info('FIXME: updateTagTree click bindings');
    info('FIXME: updateTagTree should filter out duplicates');
    info('FIXME: Check for duplicate elements in getSelectedElements');
}
// </debug>


// <strict>

/**
 * Handles an error message by either displaying it in the JS console, or throwing
 * and exception (only avalible in development and strict build).
 * @static
 * @param {String} errorMessage The error message to display or throw
 */
function handleError(errorMessage) {
    if (console && console.error) {
        console.error(errorMessage);
    } else {
        throw errorMessage;
    }
}

// Ensure jQuery has been included
if (!$) handleError(_('jQuery is required'));

// Ensure jQuery UI has been included
if (!$.ui) handleError(_('jQuery UI is required'));

// Ensure dialog has been included
if (!$.ui.dialog) handleError(_('jQuery UI Dialog is required.'));

// Ensure dialog has been included
if (!$.ui.position) handleError(_('jQuery UI Position is required.'));

// Ensure rangy has been included
if (!rangy) handleError(_('Rangy is required. This library should have been included with the file you downloaded. If not, acquire it here: http://code.google.com/p/rangy/"'));

// </strict>


$(function() {
    // Initialise rangy
    if (!rangy.initialized) {
        rangy.init();
    }

    // Add helper method to rangy
    if (!$.isFunction(rangy.rangePrototype.insertNodeAtEnd)) {
        rangy.rangePrototype.insertNodeAtEnd = function(node) {
            var range = this.cloneRange();
            range.collapse(false);
            range.insertNode(node);
            range.detach();
            this.setEndAfter(node);
        };
    }
});

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
var _ = function(string, variables) {
    string = $.ui.editor.translate(string);
    if (!variables) {
        return string;
    } else {
        $.each(variables, function(key, value) {
            string = string.replace('{{' + key + '}}', value);
        });
        return string;
    }
}


// Select menu close event (triggered when clicked off)
$('html').click(function(event) {
    var parent = $(event.target).parents('.ui-editor-selectmenu');
    $('.ui-editor-selectmenu-menu').each(function() {
        if ($(this).parent()[0] !== parent[0]) {
            $(this).hide();
            $(this).parent().find('.ui-editor-selectmenu-button')
                .removeClass('ui-corner-top')
                .addClass('ui-corner-all');
        }
    });
});
