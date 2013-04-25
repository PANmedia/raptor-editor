/**
 * @fileOverview Save state helper functions.
 * @license http://www.raptor-editor.com/license
 *
 * @author David Neilsen david@panmedia.co.nz
 * @author Michael Robinson michael@panmedia.co.nz
 */

/**
 * Saves the state of an element.
 * @param {jQuery} element The element to have its current state saved.
 * @returns {Object} The saved state of the element.
 */
function stateSave(element) {
    // <strict>
    if (!(element instanceof $)) {
        handleError("Element must be a jQuery instance when saving a state", element);
    }
    // </strict>

    var ranges = rangy.getSelection().getAllRanges();
    return {
        element: element.clone(true),
        ranges: ranges.length ? rangeSerialize(ranges, element.get(0)) : null
    };
}

/**
 * Restores an element from its saved state.
 *
 * @param {jQuery} element The element to have its state restored.
 * @param {jQuery} state The state to restore the element to.
 * @returns {Object} The restored element.
 */
function stateRestore(element, state) {
    // <strict>
    if (!(element instanceof $)) {
        handleError("Element must be a jQuery instance when restoring a state", element);
    }
    if (!(state.element instanceof $)) {
        handleError("Preview state element must be a jQuery instance when restoring a state", state.element);
    }
    // </strict>

    element.replaceWith(state.element);
    return {
        element: state.element,
        ranges: state.ranges ? rangeDeserialize(state.ranges) : null
    };
}
