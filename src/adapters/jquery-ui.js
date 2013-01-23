/**
 * @fileOverview jQuery UI helper functions.
 * @author David Neilsen david@panmedia.co.nz
 * @author Michael Robinson michael@panmedia.co.nz
 */

/**
 * Wrap the jQuery UI button function.
 * @todo Check please.
 * @param {Element|jQuery|selector} element The selector for which the button it to be created.
 * @param {Object|null} options The options relating to the creation of the button.
 * @returns {jQuery} A button for the element.
 */
function aButton(element, options) {
    return $(element).button(options);
}

/**
 * Wrap the jQuery set label function.
 *
 * @param {Element|jQuery|selector} element This is the selector for the button.
 * @param {String} text This is the text for the label.
 * @returns {jQuery} The labelled button.
 */
function aButtonSetLabel(element, text) {
    $(element).button('option', 'text', true);
    return $(element).button('option', 'label', text);
}

/**
 * Wrap the jQuery set button icon function.
 *
 * @param {Element|jQuery|selector} element This is the selector for the button.
 * @param {Object} icon The icon which is to be added to the button
 * @returns {jQuery} The iconised button.
 */
function aButtonSetIcon(element, icon) {
    return $(element).button('option', 'icons', {
        primary: icon
    });
}

/**
 * Wrap the jQuery UI enable button function.
 *
 * @param {Element|jQuery|selector} element This is the selector for the button.
 * @returns {jQuery} The enabled button.
 */
function aButtonEnable(element) {
    return $(element).button('option', 'disabled', false);
}

/**
 * Wrap the jQuery UI diable button function.
 *
 * @param {Element|jQuery|selector} element This is the selector for the button.
 * @returns {jQuery} The disabled button.
 */
function aButtonDisable(element) {
    return $(element).button('option', 'disabled', true);
}

/**
 * Wrap the jQuery UI add class function.
 *
 * @param {Element|jQuery|selector} element This is the selector for the button.
 * @returns {jQuery} The highlighted button.
 */
function aButtonActive(element) {
    return $(element).addClass('ui-state-highlight');
}

/**
 * Wrap the jQuery UI remove class function.
 *
 * @param {Element|jQuery|selector} element This is the selector for the button.
 * @returns {jQuery} The button back in its normal state.
 */
function aButtonInactive(element) {
    return $(element).removeClass('ui-state-highlight');
}

/**
 * Wrap the jQuery UI initialise menu function.
 *
 * @param {Element|jQuery|selector} element This is the selector for the menu creation.
 * @param {Object|null} options This is the set of options for the menu creation.
 * @returns {jQuery} The menu.
 */
function aMenu(element, options) {
    return $(element).menu(options);
}

/**
 * Initialises a dialog with a given element.
 *
 * @param {Element|jQuery|selector} element This is the selector for the dialog creation.
 * @param {Object|null} options This is the set of options for the menu creation.
 * @returns {jQuery} A dialog.
 */
function aDialog(element, options) {
    var dialog = $(element).dialog(options);
    // TODO: Remove this when jQuery UI 1.10 is released
    if (typeof options.buttons === 'undefined') {
        return dialog;
    }
    var buttons = dialog.parent().find('.ui-dialog-buttonpane');
    for (var i = 0, l = options.buttons.length; i < l; i++) {
        aButton(buttons.find('button:eq(' + i + ')'), {
            icons: {
                primary: options.buttons[i].icons.primary
            }
        });
    }
    return dialog;
}

/**
 * Wrap the jQuery UI open dialog function.
 *
 * @param {Element|jQuery|selector} element This is the selector for the dialog opening.
 * @returns {jQuery}
 */
function aDialogOpen(element) {
    return $(element).dialog('open');
}

/**
 * Wrap the jQuery UI close dialog function.
 *
 * @param {Element|jQuery|selector} element This is the selector for the dialog closing.
 * @returns {jQuery}
 */
function aDialogClose(element) {
    return $(element).dialog('close');
}

/**
 * Wrap the jQuery UI tabs function.
 * @todo not sure what to put for descroption for options
 * @param  {Element|jQuery|selector} element This is the selector for the tabs function.
 * @param  {Object|null} options
 * @return {jQuery}
 */
function aTabs(element, options) {
    return $(element).tabs(options);
}
