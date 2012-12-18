function aButton(element, options) {
    return $(element).button(options);
}

function aButtonSetLabel(element, text) {
    $(element).button('option', 'text', true)
    return $(element).button('option', 'label', text);
}

function aButtonSetIcon(element, icon) {
    return $(element).button('option', 'icons', {
        primary: icon
    });
}

function aButtonEnable(element) {
    return $(element).button('option', 'disabled', false);
}

function aButtonDisable(element) {
    return $(element).button('option', 'disabled', true);
}
function aButtonActive(element) {
    return $(element).addClass('ui-state-highlight');
}

function aButtonInactive(element) {
    return $(element).removeClass('ui-state-highlight');
}

function aMenu(element, options) {
    return $(element).menu(options);
}

function aDialog(element, options) {
    var dialog = $(element).dialog(options);
    // TODO: Remove this when jQuery UI 1.10 is released
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

function aDialogOpen(element) {
    return $(element).dialog('open');
}


function aDialogClose(element) {
    return $(element).dialog('close');
}
