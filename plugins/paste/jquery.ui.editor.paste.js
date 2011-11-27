console.info('FIXME: paste plugin detach, remove dialog');
(function($) {
    var paste = {
        init: function(editor, options) {
            var inProgress = false
            var dialog = false
            var selector = '.uiWidgetEditorPasteBin';

            function filterWord(content) {
                // The filters is an array of regular expressions to try and strip out a lot
                // of style data MS Word likes to insert when pasting into a contentEditable.
                // Prettymuch all of it is junk and not good html.  The hander is a place to put a function
                // for match handling.  In most cases, it just handles it as empty string.  But the option is
                // there for more complex handling.
                var filters = [
                    // Meta tags, link tags, and prefixed tags
                    {regexp: /(<meta\s*[^>]*\s*>)|(<\s*link\s* href="file:[^>]*\s*>)|(<\/?\s*\w+:[^>]*\s*>)/gi, handler: ""},
                    // Style tags
                    {regexp: /(?:<style([^>]*)>([\s\S]*?)<\/style>|<link\s+(?=[^>]*rel=['"]?stylesheet)([^>]*?href=(['"])([^>]*?)\4[^>\/]*)\/?>)/gi, handler: ""},
                    // MS class tags and comment tags.
                    {regexp: /(class="Mso[^"]*")|(<!--(.|\s){1,}?-->)/gi, handler: ""},
                    // blank p tags
                    {regexp: /(<p[^>]*>\s*(\&nbsp;|\u00A0)*\s*<\/p[^>]*>)|(<p[^>]*>\s*<font[^>]*>\s*(\&nbsp;|\u00A0)*\s*<\/\s*font\s*>\s<\/p[^>]*>)/ig, handler: ""},
                    // Strip out styles containing mso defs and margins, as likely added in IE and are not good to have as it mangles presentation.
                    {regexp: /(style="[^"]*mso-[^;][^"]*")|(style="margin:\s*[^;"]*;")/gi, handler: ""},
                    // Scripts (if any)
                    {regexp: /(<\s*script[^>]*>((.|\s)*?)<\\?\/\s*script\s*>)|(<\s*script\b([^<>]|\s)*>?)|(<[^>]*=(\s|)*[("|')]javascript:[^$1][(\s|.)]*[$1][^>]*>)/ig, handler: ""}
                ];

                $.each(filters, function(i, filter) {
                    content = content.replace(filter.regexp, filter.handler);
                });

                return content;
            }

            // Replaces commonly-used Windows 1252 encoded chars that do not exist in ASCII or ISO-8859-1 with ISO-8859-1 cognates.
            function filterChars(content) {
                var s = content;

                // smart single quotes and apostrophe
                s = s.replace(/[\u2018|\u2019|\u201A]/g, "\'");

                // smart double quotes
                s = s.replace(/[\u201C|\u201D|\u201E]/g, "\"");

                // ellipsis
                s = s.replace(/\u2026/g, "...");

                // dashes
                s = s.replace(/[\u2013|\u2014]/g, "-");

                // circumflex
                s = s.replace(/\u02C6/g, "^");

                // open angle bracket
                s = s.replace(/\u2039/g, "<");

                // close angle bracket
                s = s.replace(/\u203A/g, ">");

                // spaces
                s = s.replace(/[\u02DC|\u00A0]/g, " ");

                return s;
            }

            editor.getElement().bind('paste.' + editor.widgetName, $.proxy(function(event) {
                if (inProgress) return false;
                inProgress = true;

                // Save the selection
                var selection = rangy.saveSelection();

                // Makes a text area to capture pasted text
                if ($(selector).length) $(selector).remove();
                $('<div class="uiWidgetEditorPasteBin" contenteditable="true" style="width: 1px; height: 1px; overflow: hidden; position: fixed; top: -1px;" />').appendTo('body');
                $(selector).focus();

                window.setTimeout(function() {
                    var content = $(selector).html();
                    content = filterWord(content);
                    content = filterChars(content);
                    dialog = $(editor.getTemplate('paste.dialog', {
                        pastedHtml: content
                    }));

                    dialog.find('.ui-editor-paste-plain').bind('keypress.' + editor.widgetName, function() {
                        dialog.find('.ui-editor-paste-rich').html($(this).val());
                        dialog.find('.ui-editor-paste-source').val($(this).val());
                    });
                    dialog.find('.ui-editor-paste-rich').bind('keypress.' + editor.widgetName, function() {
                        dialog.find('.ui-editor-paste-plain').val($(this).html());
                        dialog.find('.ui-editor-paste-source').val($(this).html());
                    }).trigger('keypress');
                    dialog.find('.ui-editor-paste-source').bind('keypress.' + editor.widgetName, function() {
                        dialog.find('.ui-editor-paste-plain').val($(this).val());
                        dialog.find('.ui-editor-paste-rich').html($(this).val());
                    });

                    $(dialog).dialog({
                        modal: true,
                        width: 450,
                        height: 500,
                        resizable: true,
                        title: 'Paste',
                        position: 'center',
                        show: options.dialogShowAnimation,
                        hide: options.dialogHideAnimation,
                        dialogClass: options.baseClass + ' ' + options.dialogClass,
                        buttons: 
                            [
                                {
                                    text: _('OK'),
                                    click: function() {
                                        var html = null;
                                        var element = $(this).find('textarea:visible, .ui-editor-paste-rich:visible');

                                        if (element.hasClass('ui-editor-paste-plain') || element.hasClass('ui-editor-paste-source')) {
                                            html = element.val();
                                        } else if (element.hasClass('ui-editor-paste-rich')) {
                                            html = element.html();
                                        }
                                        html = filterWord(html);
                                        html = filterChars(html);

                                        rangy.restoreSelection(selection);
                                        editor.replaceSelection(html);

                                        inProgress = false;
                                        $(this).dialog('close');
                                    }
                                },
                                {
                                    text: _('Cancel'),
                                    click: function() {
                                        rangy.restoreSelection(selection);
                                        inProgress = false;
                                        $(this).dialog('close');
                                    }
                                }
                        ],
                        open: function() {
                            // Create fake jQuery UI tabs (to prevent hash changes)
                            var tabs = $(this).find('.ui-editor-paste-panel-tabs');
                            tabs.find('ul li').click(function() {
                                tabs.find('ul li').removeClass('ui-state-active').removeClass('ui-tabs-selected');
                                $(this).addClass('ui-state-active').addClass('ui-tabs-selected');
                                tabs.children('div').hide().eq($(this).index()).show();
                            });

                            // Set custom buttons
                            var buttons = dialog.parent().find('.ui-dialog-buttonpane');
                            buttons.find('button:eq(0)').button({icons: {primary: 'ui-icon-circle-check'}});
                            buttons.find('button:eq(1)').button({icons: {primary: 'ui-icon-circle-close'}});
                        },
                        close: function() {
                            inProgress = false;
                            $(this).dialog('destroy').remove();
                        }
                    });

                    $(selector).remove();

                }, 0);

                return true;
            }, this));

            // Events
    //        this.detach = function() {
    //            editor.getElement().unbind('paste.editor');
    //        }
        }
    }
    
    $.ui.editor.registerPlugin('paste', paste);
})(jQuery);
