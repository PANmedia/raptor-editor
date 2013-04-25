function ToolTipPlugin(name, overrides) {
    RaptorPlugin.call(this, name || 'toolTip', overrides);
}

ToolTipPlugin.prototype = Object.create(RaptorPlugin.prototype);

ToolTipPlugin.prototype.init = function() {
    this.raptor.bind('toolbarReady', function() {
        this.raptor.getLayout('toolbar').getElement()
            .on('mouseover', '[title]', function(event) {
                $(this).attr('data-title', $(this).attr('title'));
                $(this).removeAttr('title');
            });
    }.bind(this));
};

Raptor.registerPlugin(new ToolTipPlugin());
