/**
 * @fileOverview No break plugin.
 * @license http://www.raptor-editor.com/license
 *
 * @author David Neilsen david@panmedia.co.nz
 */

function NoBreakPlugin(name, overrides) {
    RaptorPlugin.call(this, name || 'noBreak', overrides);
}

NoBreakPlugin.prototype = Object.create(RaptorPlugin.prototype);

NoBreakPlugin.prototype.init = function() {
    this.raptor.getElement().on('keypress.raptor', this.preventReturn.bind(this));
    this.raptor.getElement().on('drop.raptor', this.preventDrop.bind(this));
};

NoBreakPlugin.prototype.preventReturn = function(event) {
    if (this.options.enabled && event.which === 13) {
        return false;
    }
};

NoBreakPlugin.prototype.preventDrop = function(event) {
    return this.options.enabled;
// Attempt to allow dropping of plain text (not working)
//
//    console.log(event.originalEvent);
//    var range = rangy.getSelection().getRangeAt(0).cloneRange();
//    console.log(range);
//    console.log(range.startOffset);
//    console.log(range.endOffset);
//    for (var i = 0, l = event.originalEvent.dataTransfer.items.length; i < l; i++) {
//        console.log(event.originalEvent);
//        if (event.originalEvent.dataTransfer.items[i].type == 'text/plain' &&
//                event.originalEvent.dataTransfer.items[i].kind == 'string') {
//            event.originalEvent.dataTransfer.items[i].getAsString(function(content) {
//                this.raptor.actionApply(function() {
//                    rangeReplace(range, content);
////                    selectionReplace(content);
//                })
//            }.bind(this));
//        }
//    }
//    return false;
};

Raptor.registerPlugin(new NoBreakPlugin());
