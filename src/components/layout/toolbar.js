/**
 * @fileOverview Toolbar layout.
 * @license http://www.raptor-editor.com/license
 *
 * @author David Neilsen david@panmedia.co.nz
 * @author Michael Robinson michael@panmedia.co.nz
 */

function ToolbarLayout() {
    RaptorLayout.call(this, 'toolbar');
    this.wrapper = null;
}

ToolbarLayout.prototype = Object.create(RaptorLayout.prototype);

ToolbarLayout.prototype.init = function() {
    this.raptor.bind('enabled', this.show.bind(this));
    this.raptor.bind('disabled', this.hide.bind(this));
    this.raptor.bind('layoutShow', this.show.bind(this));
    this.raptor.bind('layoutHide', this.hide.bind(this));
    $(window).resize(this.constrainPosition.bind(this));
};

ToolbarLayout.prototype.destruct = function() {
    if (this.wrapper) {
        this.wrapper.remove();
        this.wrapper = null;
    }
    this.raptor.fire('toolbarDestroy');
};

/**
 * Show the toolbar.
 *
 * @fires RaptorWidget#toolbarShow
 */
ToolbarLayout.prototype.show = function() {
    if (!this.isVisible()) {
        this.getElement().css('display', '');
        this.constrainPosition();
        if (this.raptor.getElement().zIndex() > this.getElement().zIndex()) {
            this.getElement().css('z-index', this.raptor.getElement().zIndex() + 1);
        } else {
            this.getElement().css('z-index', null);
        }
        this.raptor.fire('toolbarShow');
    }
};

/**
 * Hide the toolbar.
 *
 * @fires RaptorWidget#toolbarHide
 */
ToolbarLayout.prototype.hide = function() {
    if (this.isReady()) {
        this.getElement().css('display', 'none');
        this.raptor.fire('toolbarHide');
    }
};

ToolbarLayout.prototype.initDragging = function() {
    if ($.fn.draggable &&
            this.options.draggable &&
            !this.getElement().data('ui-draggable')) {
        // <debug>
        if (debugLevel >= MID) {
            debug('Initialising toolbar dragging', this.raptor.getElement());
        }
        // </debug>
        this.getElement().draggable({
            cancel: 'a, button',
            cursor: 'move',
            stop: this.constrainPosition.bind(this)
        });
        // Remove the relative position
        this.getElement().css('position', 'fixed');

        // Set the persistent position
        var pos = this.raptor.persist('position') || this.options.dialogPosition;

        if (!pos) {
            pos = [10, 10];
        }

        // <debug>
        if (debugLevel >= MID) {
            debug('Restoring toolbar position', this.raptor.getElement(), pos);
        }
        // </debug>

        if (parseInt(pos[0], 10) + this.getElement().outerHeight() > $(window).height()) {
            pos[0] = $(window).height() - this.getElement().outerHeight();
        }
        if (parseInt(pos[1], 10) + this.getElement().outerWidth() > $(window).width()) {
            pos[1] = $(window).width() - this.getElement().outerWidth();
        }

        this.getElement().css({
            top: Math.abs(parseInt(pos[0], 10)),
            left: Math.abs(parseInt(pos[1], 10))
        });
    }
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
            this.options.draggable &&
            this.getElement().is('.ui-draggable')) {
        this.getElement().draggable('disable').removeClass('ui-state-disabled');
    }
};

ToolbarLayout.prototype.isReady = function() {
    return this.wrapper !== null;
};

ToolbarLayout.prototype.isVisible = function() {
    return this.isReady() && this.getElement().is(':visible');
};

ToolbarLayout.prototype.constrainPosition = function() {
    if (this.isVisible()) {
        var x = parseInt(this.wrapper.css('left')) || -999,
            y = parseInt(this.wrapper.css('top')) || -999,
            width = this.wrapper.outerWidth(),
            height = this.wrapper.outerHeight(),
            windowWidth = $(window).width(),
            windowHeight = $(window).height(),
            newX = Math.max(0, Math.min(x, windowWidth - width)),
            newY = Math.max(0, Math.min(y, windowHeight - height));

        if (newX !== x || newY !== y) {
            this.wrapper.css({
                left: newX,
                top: newY
            });
        }

        // Save the persistent position
        this.raptor.persist('position', [
            this.wrapper.css('top'),
            this.wrapper.css('left')
        ]);
    }
};

ToolbarLayout.prototype.getElement = function() {
    if (this.wrapper === null) {
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
            .addClass('raptor-ui')
            .addClass(this.options.baseClass + '-outer ' + this.raptor.options.baseClass + '-layout')
            .css('display', 'none')
            .append(path)
            .append(innerWrapper);

        var uiGroup = new UiGroup(this.raptor, this.options.uiOrder);
        uiGroup.appendTo(this, this.toolbar);
        $('<div/>').css('clear', 'both').appendTo(this.toolbar);

        $(function() {
            wrapper.appendTo('body');
            this.initDragging();
            this.constrainPosition(true);
            this.raptor.fire('layoutReady', [this.wrapper]);
            this.raptor.fire('toolbarReady', [this]);
        }.bind(this));
    }
    return this.wrapper;
};

Raptor.registerLayout(new ToolbarLayout());
