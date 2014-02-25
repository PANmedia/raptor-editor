/**
 * @fileOverview Stylised tooltip plugin.
 * @license http://www.raptor-editor.com/license
 *
 * @author David Neilsen david@panmedia.co.nz
 */
function ToolTipPlugin(name, overrides) {
    RaptorPlugin.call(this, name || 'toolTip', overrides);
}

ToolTipPlugin.prototype = Object.create(RaptorPlugin.prototype);

ToolTipPlugin.prototype.init = function() {
    this.raptor.bind('layoutReady', function(node) {
        $(node)
            .on('mouseover', '[title]', function(event) {
                $(this)
                    .attr('data-title', $(this).attr('title'))
                    .removeAttr('title');
            });
    });
};

Raptor.registerPlugin(new ToolTipPlugin());
