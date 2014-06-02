/**
 * @fileOverview Element hover panel layout.
 * @license http://www.raptor-editor.com/license
 *
 * @author David Neilsen david@panmedia.co.nz
 */

function ElementHoverPanelLayout() {
    RaptorLayout.call(this, 'elementHoverPanel');
    this.elements = 'img';
    this.hoverPanel = null;
    this.visible = false;
    this.target = null;
    this.enabled = true;
}

ElementHoverPanelLayout.prototype = Object.create(RaptorLayout.prototype);

ElementHoverPanelLayout.prototype.init = function() {
    this.raptor.bind('ready', this.ready.bind(this));
};

ElementHoverPanelLayout.prototype.ready = function() {
    this.raptor.getElement()
        .on('mouseenter', this.options.elements, this.show.bind(this))
        .on('mouseleave', this.options.elements, this.hide.bind(this));
};

ElementHoverPanelLayout.prototype.getElement = function() {
    if (this.hoverPanel === null) {
        this.hoverPanel = $('<div/>')
            .addClass(this.raptor.options.baseClass + '-layout raptor-layout-hover-panel ' + this.options.baseClass)
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

ElementHoverPanelLayout.prototype.show = function(event) {
    if (this.enabled && this.raptor.isEditing()) {
        this.target = event.target;
        this.visible = true;
        elementPositionOver(this.getElement().show(), $(this.target));
    }
};

ElementHoverPanelLayout.prototype.hide = function(event) {
    if (!this.visible) {
        return;
    }
    if (event) {
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
    }
    this.visible = false;
    this.getElement().hide();
};

ElementHoverPanelLayout.prototype.close = function() {
    if (this.visible) {
        this.enabled = false;
        this.visible = false;
        this.getElement().hide();
        setTimeout(function() {
            this.enabled = true;
        }.bind(this), 1000);
    }
};

ElementHoverPanelLayout.prototype.position = function() {
    if (this.visible) {
        elementPositionOver(this.getElement(), $(this.target));
    }
};

ElementHoverPanelLayout.prototype.destruct = function() {
    if (this.hoverPanel) {
        this.hoverPanel.remove();
        this.hoverPanel = null;
    }
    this.visible = false;
};

Raptor.registerLayout(new ElementHoverPanelLayout());
