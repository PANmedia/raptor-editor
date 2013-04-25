/**
 * @fileOverview Style helper functions.
 * @license http://www.raptor-editor.com/license
 *
 * @author David Neilsen david@panmedia.co.nz
 * @author Michael Robinson michael@panmedia.co.nz
 */

/**
 * @todo desc all
 * @param {jQuerySelector|jQuery|Element} element This is the element to have its styles swapped.
 * @param {array} newState The new state to be applied to the element.
 * @returns {array}
 */
function styleSwapState(element, newState) {
    var node = element.get(0),
        previousState = {};
    // Double loop because jQuery will automatically assign other style properties like 'margin-left' when setting 'margin'
    for (var key in newState) {
        previousState[key] = node.style[key];
    }
    for (key in newState) {
        element.css(key, newState[key]);
    }
    return previousState;
}

/**
 * @todo type for wrapper and inner and descriptions
 * @param {type} wrapper
 * @param {type} inner
 * @param {array} newState
 * @returns {unresolved}
 */
function styleSwapWithWrapper(wrapper, inner, newState) {
    var innerNode = inner.get(0),
        previousState = {};
    // Double loop because jQuery will automatically assign other style properties like 'margin-left' when setting 'margin'
    for (var key in newState) {
        previousState[key] = innerNode.style[key];
    }
    for (key in newState) {
        wrapper.css(key, inner.css(key));
        inner.css(key, newState[key]);
    }
    return previousState;
}

/**
 * @todo all
 * @param {jQuery} element
 * @param {array} state
 * @returns {undefined}
 */
function styleRestoreState(element, state) {
    for (var key in state) {
        element.css(key, state[key] || '');
    }
}
