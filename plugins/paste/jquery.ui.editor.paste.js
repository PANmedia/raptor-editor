(function($) {
    $.ui.editor.addPlugin('paste', {
        
        // Events
        detach: function() {
            this.element.unbind('paste.editor');
        },
        
        attach: function() {
            this.element.bind('paste.editor', $.proxy(this._plugins.paste.capture, this));
        },
        
        inProgress: false,
        
        dialog: false,
        
        capture: function(event) {
            
            if (this._plugins.paste.inProgress) return false;
            this._plugins.paste.inProgress = true;
            
            var selection = rangy.saveSelection(),
                editorInstance = this;
            
            if($.contains(this.element.get(0), event.target)) {
                var pasteBin = $('#paste-bin');
                if (!pasteBin.length) {
                    pasteBin = $('<textarea id="paste-bin"></textarea>').css({
                        width: 1,
                        height: 1,
                        opacity: 0,
                        position: 'absolute',
                        left: -9999
                    }).appendTo('body');
                }
                pasteBin.select().focus();
                
                window.setTimeout(function(){
                    var pasted_value = $(pasteBin).val(),
                        update_values = function(value) {
                            editorInstance._plugins.paste.dialog.find('textarea.ui-editor-paste-plain').val(value);
                            editorInstance._plugins.paste.dialog.find('textarea.ui-editor-paste-source').val(value);
                            editorInstance._plugins.paste.dialog.find('.ui-editor-paste-rich').html(value);
                        };

                    if (!editorInstance._plugins.paste.dialog) {
                        editorInstance._plugins.paste.dialog = $('<div class="ui-editor-paste-panel">\
                                <div class="ui-editor-paste-panel-tabs">\
                                    <ul>\
                                        <li><a href="#ui-editor-paste-plain">Plain Text</a></li>\
                                        <li><a href="#ui-editor-paste-rich">Rich Text</a></li>\
                                        <li><a href="#ui-editor-paste-source">Source Code</a></li>\
                                    </ul>\
                                    <div id="ui-editor-paste-plain">\
                                        <textarea class="ui-editor-paste-plain">' + pasted_value + '</textarea>\
                                    </div>\
                                    <div id="ui-editor-paste-rich">\
                                        <div class="ui-editor-paste-rich" contenteditable="true">' + pasted_value + '</div>\
                                    </div>\
                                    <div id="ui-editor-paste-source">\
                                        <textarea class="ui-editor-paste-source">' + pasted_value + '</textarea>\
                                    </div>\
                                </div>\
                            </div>');
                        editorInstance._plugins.paste.dialog.find('textarea').bind('keypress.editor', function() {
                            update_values($(this).val());
                        });
                            
                    } else {
                        update_values(pasted_value);
                    }
                    
                    $(editorInstance._plugins.paste.dialog).dialog({
                        modal: true,
                        width: 450,
                        height: 500,
                        resizable: true,
                        title: 'Paste',
                        position: 'center',
                        show: editorInstance.options.dialogShowAnimation,
                        hide: editorInstance.options.dialogHideAnimation,
                        dialogClass: editorInstance.options.dialogClass + ' ui-widget-editor-paste',
                        buttons: 
                            [
                                {
                                    text: 'OK',
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
                                        editorInstance._selection.replace.call(editorInstance, pasted_content.get(0).childNodes);
                                        
                                        pasted_content.remove();
                                        
                                        editorInstance._plugins.paste.inProgress = false;
                                        $(this).dialog('close').dialog('destroy');
                                    }
                                },
                                {
                                    text: 'Cancel',
                                    'class': 'cancel',
                                    click: function() {
                                        rangy.restoreSelection(selection);
                                        editorInstance._plugins.paste.inProgress = false;
                                        $(this).dialog('close').dialog('destroy');
                                    }
                                }
                        ],
                        open: function() {
                            $(this).find('.ui-editor-paste-panel-tabs').tabs();
                            editorInstance._dialog.applyButtonIcon('cancel', 'circle-close');
                            editorInstance._dialog.applyButtonIcon('ok', 'circle-check');
                        },
                        close: function() {
                            editorInstance._plugins.paste.inProgress = false;
                        }
                    });
                    
                    pasteBin.remove();
                    
                }, 0);
            }
            
            return true;
        }
    });
})(jQuery);
