/**
 * @fileOverview Hover panel layout.
 * @license http://www.raptor-editor.com/license
 *
 * @author David Neilsen david@panmedia.co.nz
 * @author Michael Robinson michael@panmedia.co.nz
 */

function HoverPanelLayout() {
    RaptorLayout.call(this, 'hoverPanel');
    this.hoverPanel = null;
    this.visible = false;
}

HoverPanelLayout.prototype = Object.create(RaptorLayout.prototype);

HoverPanelLayout.prototype.init = function() {
    this.raptor.bind('ready', this.ready.bind(this));
    this.raptor.bind('enabled', this.enabled.bind(this));
};

HoverPanelLayout.prototype.ready = function() {
    this.raptor.getElement()
        .mouseenter(this.show.bind(this))
        .mouseleave(this.hide.bind(this));
};

HoverPanelLayout.prototype.enabled = function() {
    this.getElement().hide();
};

HoverPanelLayout.prototype.getElement = function() {
    if (this.hoverPanel === null) {
        this.hoverPanel = $('<div/>')
            .addClass(this.raptor.options.baseClass + '-layout ' + this.options.baseClass)
            .mouseleave(this.hide.bind(this));

        var uiGroup = new UiGroup(this.raptor, this.options.uiOrder);
        uiGroup.appendTo(this, this.hoverPanel);

        $(window).bind('scroll', this.position.bind(this));

        this.hoverPanel
            .appendTo('body');

        this.raptor.fire('layoutReady', [this.hoverPanel]);
    }
    return this.hoverPanel;
};

HoverPanelLayout.prototype.show = function(event) {
    if (!this.raptor.isEditing()) {
        this.visible = true;
        this.getElement().show();
        if (this.raptor.getElement().zIndex() > this.getElement().zIndex()) {
            this.getElement().css('z-index', this.raptor.getElement().zIndex() + 1);
        } else {
            this.getElement().css('z-index', null);
        }
        this.position();
        this.raptor.getElement().addClass(this.raptor.options.baseClass + '-editable-block-hover');
    }
};

HoverPanelLayout.prototype.hide = function(event) {
    if (!this.visible) {
        return;
    }
    if (!event) {
        return;
    }
    if ($.contains(this.getElement().get(0), event.relatedTarget)) {
        return;
    }
    if (event.relatedTarget === this.getElement().get(0)) {
        return;
    }
    if (this.getElement().get(0) === $(event.relatedTarget).parent().get(0)) {
        return;
    }
    if ($.contains(this.raptor.getElement().get(0), event.relatedTarget)) {
        return;
    }
    if (event.relatedTarget === this.raptor.getElement().get(0)) {
        return;
    }
    this.visible = false;
    this.getElement().hide();
    this.raptor.getElement().removeClass(this.raptor.options.baseClass + '-editable-block-hover');
};

HoverPanelLayout.prototype.position = function() {
    if (this.visible) {
        var visibleRect = elementVisibleRect(this.raptor.getElement());
        this.getElement().css({
            // Calculate offset center for the hoverPanel
            top:  visibleRect.top  + ((visibleRect.height / 2) - (this.getElement().outerHeight() / 2)),
            left: visibleRect.left + ((visibleRect.width / 2)  - (this.getElement().outerWidth()  / 2))
        });
    }
};

HoverPanelLayout.prototype.destruct = function() {
    if (this.hoverPanel) {
        this.hoverPanel.remove();
        this.hoverPanel = null;
    }
    this.visible = false;
};

Raptor.registerLayout(new HoverPanelLayout());
