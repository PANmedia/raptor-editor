function aButton(element, options) {
    return $(element).button(options);
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
