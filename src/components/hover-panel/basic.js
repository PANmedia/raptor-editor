var hoverPanel = null;
Raptor.registerHoverPanel('basic', /** @lends HoverPanel.prototype */ {

    options: {
        componentOrder: null
    },

    components: {},
    visible: false,

    /**
     * Inititialise the hover panel
     * @constructs
     */
    init: function() {

        // <debug>
        if (debugLevel >= MID) {
            debug('Loading hover panel', this.raptor.getElement());
        }
        // </debug>

        this.raptor.bind('show', this.hidePanel.bind(this));
        this.raptor.bind('hideHoverPanel', this.hide.bind(this));

        if (!hoverPanel) {
            hoverPanel = $('<div/>')
                .addClass(this.options.baseClass);

            var _this = this;
            $(function() {
                hoverPanel.appendTo('body');
                _this.raptor.fire('hoverPanelReady');
            });
        }

        this.components = {};

        this.raptor.getElement()
            .mouseenter(this.show.bind(this))
            .mouseleave(this.hide.bind(this));
    },

    addComponent: function(name, component) {
        // <strict>
        if (typeof this.components[name] !== 'undefined') {
            handleError('A component named "' + name + '" has already been added, it will be overwritten.');
        }
        // </strict>
        this.components[name] = component;
    },

    /**
     * Show the hover panel.
     *
     * @fires RaptorWidget#hoverPanelShow
     */
    show: function(event) {
        if (this.raptor.isEditing()) {
            return;
        }
        if ($.contains(this.raptor.getElement().get(0), event.relatedTarget)) {
            return;
        }
        if (hoverPanel && $.contains(hoverPanel.get(0), event.relatedTarget)) {
            return;
        }
        this.visible = true;
        this.raptor.getElement()
            .addClass(this.options.baseClass + '-hover');

        // Clear panel
        hoverPanel.html('');
        var plugin;

        if (!this.options.componentOrder) {
            this.options.componentOrder = Object.keys(this.components);
        }
        var order = this.options.componentOrder;
        for (var componentOrderIndex = 0; componentOrderIndex < order.length; componentOrderIndex++) {
            if (typeof this.components[order[componentOrderIndex]] !== 'undefined') {
                plugin = this.components[order[componentOrderIndex]];
                hoverPanel.append(plugin.getButton(plugin));
            }
        }

        aButton(hoverPanel.find('button'));

        var visibleRect = elementVisibleRect(this.raptor.getElement());

        hoverPanel.css({
            position: 'absolute'
        }).show().css({
            // Calculate offset center for the hoverPanel
            top:  visibleRect.top  + ((visibleRect.height / 2) - (hoverPanel.outerHeight() / 2)),
            left: visibleRect.left + ((visibleRect.width / 2)  - (hoverPanel.outerWidth()  / 2)),
            width: hoverPanel.outerWidth()
        });

        hoverPanel.mouseleave(this.hide.bind(this));

        this.raptor.fire('hoverPanelShow');
    },

    /**
     * Hide the hover panel
     *
     * @fires RaptorWidget#hoverPanelHide
     */
    hide: function(event) {
        if (!event) {
            return;
        }
        if ($.contains(hoverPanel.get(0), event.relatedTarget)) {
            return;
        }
        if (event.relatedTarget === hoverPanel.get(0)) {
            return;
        }
        if (hoverPanel.get(0) === $(event.relatedTarget).parent().get(0)) {
            return;
        }
        if ($.contains(this.raptor.getElement().get(0), event.relatedTarget)) {
            return;
        }
        if (event.relatedTarget === this.raptor.getElement().get(0)) {
            return;
        }
        this.hidePanel();
    },

    hidePanel: function() {
        hoverPanel.hide();
        this.raptor.getElement().removeClass(this.options.baseClass + '-hover');
        this.visible = false;
        this.raptor.fire('hoverPanelHide');
    },

    /**
     * Clean up.
     */
    destruct: function() {
        this.raptor.fire('hoverPanelDestroy');
        if (this.hoverPanel) {
            this.hoverPanel.remove();
        }
    }
});
