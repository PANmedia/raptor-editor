(function($) {
    var paste = function(editor, options) {
        var inProgress = false
        var dialog = false
        var selector = '.uiWidgetEditorPasteBin';
        
        editor.element.bind('paste.editor', $.proxy(function(event) {
            if (inProgress) return false;
            inProgress = true;
            
            // Save the selection
            var selection = rangy.saveSelection();
            
            // Makes a text area to capture pasted text
            if ($(selector).length) $(selector).remove();
            $('<div class="uiWidgetEditorPasteBin" contenteditable="true" style="width: 1px; height: 1px; overflow: hidden; position: fixed; top: -1px;" />').appendTo('body');
            $(selector).focus();

            window.setTimeout(function(){
                var pastedHtml = $(selector).html(),
                    pastedText = $(selector).text(),
                    updateValues = function(value) {
                        dialog.find('textarea.ui-editor-paste-plain').val(pastedText);
                        dialog.find('textarea.ui-editor-paste-source').val(pastedHtml);
                        dialog.find('.ui-editor-paste-rich').html(pastedHtml);
                    };

                if (!dialog) {
                    dialog = $('<div class="ui-editor-paste-panel">\
                            <div class="ui-editor-paste-panel-tabs">\
                                <ul>\
                                    <li><a href="#ui-editor-paste-plain">' + _('Plain Text') + '</a></li>\
                                    <li><a href="#ui-editor-paste-rich">' + _('Rich Text') + '</a></li>\
                                    <li><a href="#ui-editor-paste-source">'+ _('Source Code') + '</a></li>\
                                </ul>\
                                <div id="ui-editor-paste-plain">\
                                    <textarea class="ui-editor-paste-plain">' + pastedText + '</textarea>\
                                </div>\
                                <div id="ui-editor-paste-rich">\
                                    <div class="ui-editor-paste-rich" contenteditable="true">' + pastedHtml + '</div>\
                                </div>\
                                <div id="ui-editor-paste-source">\
                                    <textarea class="ui-editor-paste-source">' + pastedHtml + '</textarea>\
                                </div>\
                            </div>\
                        </div>');
                    dialog.find('textarea').bind('keypress.editor', function() {
                        updateValues($(this).val());
                    });

                } else {
                    updateValues();
                }

                $(dialog).dialog({
                    modal: true,
                    width: 450,
                    height: 500,
                    resizable: true,
                    title: 'Paste',
                    position: 'center',
                    show: editor.options.dialogShowAnimation,
                    hide: editor.options.dialogHideAnimation,
                    dialogClass: editor.options.dialogClass + ' ui-widget-editor-paste',
                    buttons: 
                        [
                            {
                                text: _('OK'),
                                'class': 'ok',
                                click: function() {

                                    rangy.restoreSelection(selection);

                                    var html = null, 
                                        element = $(this).find('textarea:visible, .ui-editor-paste-rich:visible');

                                    if (element.hasClass('ui-editor-paste-plain') || element.hasClass('ui-editor-paste-source')) {
                                        html = element.val();
                                    } else if (element.hasClass('ui-editor-paste-rich')) {
                                        html = element.html();
                                    }

                                    var pasted_content = $('<div id="ui-editor-paste-bin" style="display: none;">' + html + '</div>').appendTo('body');

                                    rangy.restoreSelection(selection);
                                    editor._selection.replace.call(editor, pasted_content.get(0).childNodes);

                                    pasted_content.remove();

                                    inProgress = false;
                                    $(this).dialog('close').dialog('destroy');
                                }
                            },
                            {
                                text: _('Cancel'),
                                'class': 'cancel',
                                click: function() {
                                    rangy.restoreSelection(selection);
                                    inProgress = false;
                                    $(this).dialog('close').dialog('destroy');
                                }
                            }
                    ],
                    open: function() {
                        $(this).find('.ui-editor-paste-panel-tabs').tabs();
                        editor._dialog.applyButtonIcon('cancel', 'circle-close');
                        editor._dialog.applyButtonIcon('ok', 'circle-check');
                    },
                    close: function() {
                        inProgress = false;
                    }
                });

                $(selector).remove();

            }, 0);
            
            return true;
        }, this));
        
        // Events
        console.info('FIXME: paste plugin detach');
//        this.detach = function() {
//            editor.element.unbind('paste.editor');
//        }
    }
    
    $.ui.editor.addPlugin('paste', paste);
})(jQuery);
