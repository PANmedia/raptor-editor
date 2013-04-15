/**
 * @fileOverview Contains the view normalise line breaks button code.
 * @license http://www.raptor-editor.com/license
 *
 * @author Michael Robinson <michael@panmedia.co.nz>
 * @author David Neilsen <david@panmedia.co.nz>
 * @author Melissa Richards <melissa@panmedia.co.nz>
 */

/**
 * Attempts to enforce standard behaviour across browsers for return &
 * shift+return key presses.
 *
 * @constructor
 * @param {String} name
 * @param {Object} overrides
 */
function NormaliseLineBreaksPlugin(name, overrides) {
    RaptorPlugin.call(this, name || 'normaliseLineBreaks', overrides);
}

NormaliseLineBreaksPlugin.prototype = Object.create(RaptorPlugin.prototype);

/**
 * Register hotkey actions.
 */
NormaliseLineBreaksPlugin.prototype.init = function() {
    this.raptor.registerHotkey('return', this.returnPressed.bind(this));
    this.raptor.registerHotkey('shift+return', this.shiftReturnPressed.bind(this));
};

/**
 * Handle return keypress.
 *
 * When inside a ul/ol, the the current list item is split and the cursor is
 * placed at the start of the second list item.
 *
 * @return {Boolean} True if the keypress has been handled and should not propagate
 *                        further
 */
NormaliseLineBreaksPlugin.prototype.returnPressed = function() {
    var selectedElement = selectionGetElement();
    if (selectedElement.closest('li').length) {
        var listType = selectedElement.closest('ul, ol').get(0).tagName.toLowerCase();
        var replacementElement = listBreakAtSelection(listType, 'li', this.raptor.getElement());
        if (replacementElement) {
            selectionSelectStart(replacementElement.get(0));
        }
        return true;
    }
    return false;
};

/**
 * Handle shift+return keypress.
 *
 * When inside a ul/ol, the the current selection is replaced with a p by splitting the list.
 *
 * @return {Boolean} True if the keypress has been handled and should not propagate
 *                        further
 */
NormaliseLineBreaksPlugin.prototype.shiftReturnPressed = function() {
    var selectedElement = selectionGetElement();
    if (selectedElement.is('li')) {
        var listType = selectedElement.closest('ul, ol').get(0).tagName.toLowerCase();
        var replacementElement = listBreakByReplacingSelection(listType, 'li', this.raptor.getElement(), '<p>&nbsp;</p>');
        if (replacementElement) {
            selectionSelectInner(replacementElement.get(0));
        }
        return true;
    }
    return false;
};

Raptor.registerPlugin(new NormaliseLineBreaksPlugin());
