/**
 * @fileOverview Toolbar layout.
 * @license http://www.raptor-editor.com/license
 *
 * @author David Neilsen david@panmedia.co.nz
 * @author Michael Robinson michael@panmedia.co.nz
 */

function ToolbarLayout() {
    RaptorLayout.call(this, 'toolbar');
    this.toolbar = null;
}

ToolbarLayout.prototype = Object.create(RaptorLayout.prototype);

ToolbarLayout.prototype.enabled = function() {
    this.show();
};

ToolbarLayout.prototype.disabled = function() {
    this.hide();
};

/**
 * Show the toolbar.
 *
 * @fires RaptorWidget#toolbarShow
 */
ToolbarLayout.prototype.show = function() {
    this.getElement().css('display', '');
    this.raptor.fire('toolbarShow');
};

/**
 * Hide the toolbar.
 *
 * @fires RaptorWidget#toolbarHide
 */
ToolbarLayout.prototype.hide = function() {
    this.getElement().css('display', 'none');
    this.raptor.fire('toolbarHide');
};

ToolbarLayout.prototype.enableDragging = function() {
    if ($.fn.draggable &&
            this.options.draggable &&
            this.getElement().data('ui-draggable')) {
        this.getElement().draggable('enable');
    }
};

ToolbarLayout.prototype.disableDragging = function() {
    if ($.fn.draggable &&
            this.options.draggable) {
        this.getElement().draggable('disable').removeClass('ui-state-disabled');
    }
};

ToolbarLayout.prototype.getElement = function() {
    if (this.toolbar === null) {
        // Load all UI components if not supplied
        if (!this.options.uiOrder) {
            this.options.uiOrder = [[]];
            for (var name in Raptor.ui) {
                this.options.uiOrder[0].push(name);
            }
        }

        // <debug>
        if (debugLevel >= MID) {
            debug('Loading toolbar', this.raptor.getElement());
        }
        // </debug>

        var toolbar = this.toolbar = $('<div/>')
            .addClass(this.options.baseClass + '-toolbar');
        var innerWrapper = this.toolbarWrapper = $('<div/>')
            .addClass(this.options.baseClass + '-inner')
            .addClass('ui-widget-content')
            .mousedown(function(event) {
                event.preventDefault();
            })
            .append(toolbar);
        var path = this.path = $('<div/>')
            .addClass(this.options.baseClass + '-path')
            .addClass('ui-widget-header');
        var wrapper = this.wrapper = $('<div/>')
            .addClass(this.options.baseClass + '-outer ' + this.raptor.options.baseClass + '-layout')
            .css('display', 'none')
            .append(path)
            .append(innerWrapper);

        if ($.fn.draggable && this.options.draggable) {
            // <debug>
            if (debugLevel >= MID) {
                debug('Initialising toolbar dragging', this.raptor.getElement());
            }
            // </debug>

            wrapper.draggable({
                cancel: 'a, button',
                cursor: 'move',
                // @todo Cancel drag when docked
                // @todo Move draggable into plugin
                handle: '.ui-editor-path',
                stop: $.proxy(function() {
                    // Save the persistent position
                    var pos = this.raptor.persist('position', [
                        wrapper.css('top'),
                        wrapper.css('left')
                    ]);
                    wrapper.css({
                        top: Math.abs(pos[0]),
                        left: Math.abs(pos[1])
                    });

                    // <debug>
                    if (debugLevel >= MID) debug('Saving toolbar position', this.raptor.getElement(), pos);
                    // </debug>
                }, this)
            });

            // Remove the relative position
            wrapper.css('position', 'fixed');

            // Set the persistent position
            var pos = this.raptor.persist('position') || this.options.dialogPosition;

            if (!pos) {
                pos = [10, 10];
            }

            // <debug>
            if (debugLevel >= MID) debug('Restoring toolbar position', this.raptor.getElement(), pos);
            // </debug>

            if (parseInt(pos[0], 10) + wrapper.outerHeight() > $(window).height()) {
                pos[0] = $(window).height() - wrapper.outerHeight();
            }
            if (parseInt(pos[1], 10) + wrapper.outerWidth() > $(window).width()) {
                pos[1] = $(window).width() - wrapper.outerWidth();
            }

            wrapper.css({
                top: Math.abs(parseInt(pos[0], 10)),
                left: Math.abs(parseInt(pos[1], 10))
            });
        }

        var uiGroup = new UiGroup(this.raptor, this.options.uiOrder);
        uiGroup.appendTo(this.toolbar);
        $('<div/>').css('clear', 'both').appendTo(this.toolbar);

        // Fix corner classes
        this.toolbar.find('.ui-button:first-child').addClass('ui-corner-left');
        this.toolbar.find('.ui-button:last-child').addClass('ui-corner-right');

        var layout = this;
        $(function() {
            wrapper.appendTo('body');
            layout.raptor.fire('toolbarReady');
        });
    }
    return this.wrapper;
};

Raptor.registerLayout(new ToolbarLayout());
