/**
 * @fileOverview View source UI component
 * @author David Neilsen david@panmedia.co.nz
 * @author Michael Robinson michael@panmedia.co.nz
 */
 $.ui.editor.registerUi({

    /**
     * @name $.editor.ui.viewSource
     * @augments $.ui.editor.defaultUi
     * @class Shows a dialog containing the element's markup, allowing the user to edit the source directly
     */
    viewSource: /** @lends $.editor.ui.viewSource.prototype */ {

        /**
         * Reference to the view source dialog
         * @type {Object}
         */
        dialog: null,

        /**
         * @see $.ui.editor.defaultUi#init
         */
        init: function(editor, options) {
            editor.bind('hide', this.hide, this);

            return editor.uiButton({
                title: _('View / Edit Source'),
                click: function() {
                    this.show();
                }
            });
        },

        tab: function() {
            return '    ';
        },

        highlightSource: function() {
            var rainbowPresent = typeof window.Rainbow !== 'undefined';
            if (!rainbowPresent) {
                // <strict>
                handleError(_('jquery.ui.editor.viewsource requires Rainbow'));
                // </strict>
            }
            return rainbowPresent;
        },

        untidyHtml: function(highlightedSource) {
            var html = $('<div/>').html(highlightedSource);

            // Unwrap highlighting helpers
            $(html).find('span.support').each(function() {
                $(this).contents().unwrap();
            });

            html = html.html();
            html = html.replace(/&lt;/g, '<');
            html = html.replace(/&gt;/g, '>');
            html = html.replace(/&amp;/g, '&');

            return html;
        },

        tidyHtml: function(html) {
            if (typeof HTMLParser === 'undefined') {
                // <strict>
                handleError(_('jquery.ui.editor.viewsource requires HTMLParser'));
                // </strict>
                return html;
            }
            var depth = 0;
            var tidiedHtml = '';
            var ui = this;
            HTMLParser(html, {
                start: function(tag, attrs, unary) {
                    for (var i = 0; i < depth; i++) {
                        tidiedHtml += ui.tab();
                    }
                    tidiedHtml += "<" + tag;
                    for (i = 0; i < attrs.length; i++ ) {
                        tidiedHtml += " " + attrs[i].name + '="' + attrs[i].escaped + '"';
                    }
                    tidiedHtml += (unary ? "/" : "") + ">";
                    depth++;
                },
                end: function(tag) {
                    tidiedHtml += '</' + tag + '>';
                    depth--;
                },
                chars: function( text ) {
                    tidiedHtml += text;
                },
                comment: function( text ) {
                    tidiedHtml += "<!--" + text + "-->";
                }
            });
            return tidiedHtml;
        },

        prepareSource: function(dialog) {

            if (this.highlightSource()) {
                var html = this.tidyHtml($.trim(this.editor.getHtml()));
                var highlighted = $(dialog).find('.' + this.options.baseClass + '-highlighted');

                var highlight = function(element, html, ui) {

                    element = $(element);

                    var code = element.find('code:first');

                    code.unbind('keydown keyup');
                    code.attr('contenteditable', true);

                    Rainbow.color(html, 'html', function(highlightedHtml) {
                        code.html(highlightedHtml);
                        element.show();

                        var getFirstRange = function() {
                            var sel = rangy.getSelection();
                            return sel.rangeCount ? sel.getRangeAt(0) : null;
                        };

                        var previousContent = '';

                        code.bind('keydown', function(event) {
                            previousContent = code.html();
                            switch(event.keyCode) {

                                // Prevent enter key presses from triggering creation of new <pre> tag
                                case 13:
                                    var range = getFirstRange();
                                    var added = false;
                                    var newline = document.createTextNode('\r\n');

                                    if (range) {
                                        range.insertNode(newline);
                                        range.setEndAfter(newline);
                                        range.setStartAfter(newline);
                                        var sel = rangy.getSelection();
                                        sel.setSingleRange(range);
                                        added = true;
                                    }

                                    if (added) {
                                        event.preventDefault();
                                    }
                                    return false;

                                // Insert a tab or indent selection
                                case 9:
                                    var range = getFirstRange();
                                    var tab = document.createTextNode(ui.tab());
                                    if (range) {
                                        range.insertNode(tab);
                                        var sel = rangy.getSelection();
                                        range.setEndAfter(tab);
                                        range.setStartAfter(tab);
                                        sel.setSingleRange(range);
                                    }
                                    return false;
                            }
                        });

                        var keydown = false;
                        code.bind('keydown', function() {
                            keydown = true;
                        });

                        code.bind('keyup', function() {
                            keydown = false;
                            window.setTimeout(function() {
                                if (!keydown) {
                                    if (previousContent == code.html()) {
                                        return true;
                                    }
                                    try {
                                        var untidyHtml = ui.untidyHtml(code.html());
                                        if ($('<div/>').html(untidyHtml).html() == untidyHtml) {
                                            highlight(element, untidyHtml, ui);
                                        }
                                    } catch (e) {
                                        console.log('error');
                                    }
                                }
                            }, 5000);
                        });
                    });

                };
                highlight(highlighted, html, this);
            } else {
                $(dialog).find('textarea').val($.trim(this.editor.getHtml()));
                $(dialog).find('.' + this.options.baseClass + '-plain-text').show();
            }
        },

        /**
         * Hide, destroy & remove the view source dialog. Enable the button.
         */
        hide: function() {
            if (this.dialog) $(this.dialog).dialog('destroy').remove();
            this.dialog = null;
            $(this.ui.button).button('option', 'disabled', false);
        },

        /**
         * Show the view source dialog. Disable the button.
         */
        show: function() {
            if (!this.dialog) {
                $(this.ui.button).button('option', 'disabled', true);
                var ui = this;
                this.dialog = $(this.editor.getTemplate('viewsource.dialog', { baseClass: ui.options.baseClass }));

                this.dialog.dialog({
                    modal: false,
                    width: 600,
                    height: 400,
                    resizable: true,
                    title: _('View Source'),
                    autoOpen: true,
                    dialogClass: ui.options.baseClass + ' ' + ui.options.dialogClass,
                    buttons: [
                        {
                            text: _('Apply Source'),
                            click: function() {
                                var html;
                                if (ui.highlightSource()) {
                                    html = $(this).find('.' + ui.options.baseClass + '-highlighted pre code:first').html();
                                    html = ui.untidyHtml(html);
                                } else {
                                    html = $(this).find('textarea').val();
                                }
                                ui.editor.setHtml(html);
                                $(this).find('textarea').val(ui.editor.getHtml());
                            }
                        },
                        {
                            text: _('Close'),
                            click: function() {
                                ui.hide();
                            }
                        }
                    ],
                    open: function() {
                        var buttons = $(this).parent().find('.ui-dialog-buttonpane');
                        buttons.find('button:eq(0)').button({ icons: { primary: 'ui-icon-circle-check' }});
                        buttons.find('button:eq(1)').button({ icons: { primary: 'ui-icon-circle-close' }});

                        ui.prepareSource.call(ui, this);

                    },
                    close: function() {
                        ui.hide();
                    }
                });
            }
        }
    }
});