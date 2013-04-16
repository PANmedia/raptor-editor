/**
 * @fileOverview Message layout.
 * @license http://www.raptor-editor.com/license
 *
 * @author David Neilsen david@panmedia.co.nz
 */

function MessagesLayout() {
    RaptorLayout.call(this, 'messages');
    this.panel = null;
}

MessagesLayout.prototype = Object.create(RaptorLayout.prototype);

MessagesLayout.prototype.getElement = function() {
    if (this.panel === null) {
        this.panel = $(this.raptor.getTemplate('messages', this.options)).appendTo('body');
    }
    return this.panel;
};

/**
 * @param {String} type
 * @param {String[]} messages
 */
MessagesLayout.prototype.showMessage = function(type, message, options) {
    options = $.extend({}, this.options, options);

    var messageObject;
    messageObject = {
        timer: null,
        editor: this,
        show: function() {
            this.element.slideDown();
            this.timer = window.setTimeout(function() {
                this.timer = null;
                messageObject.hide();
            }, options.delay, this);
        },
        hide: function() {
            if (this.timer) {
                window.clearTimeout(this.timer);
                this.timer = null;
            }
            this.element.stop().slideUp(function() {
                if ($.isFunction(options.hide)) {
                    options.hide.call(this);
                }
                this.element.remove();
            }.bind(this));
        }
    };

    messageObject.element =
        $(this.raptor.getTemplate('message', $.extend(this.options, {
            type: type,
            message: message
        })))
        .hide()
        .appendTo(this.getElement())
        .find('.' + options.baseClass + '-close')
            .click(function() {
                messageObject.hide();
            })
        .end();

    messageObject.show();

    return messageObject;
};

Raptor.registerLayout(new MessagesLayout());
