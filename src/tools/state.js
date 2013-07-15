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

    var range = rangeGet();
    return {
        element: element.clone(true),
        ranges: range ? rangeSerialize(range, element.get(0)) : null
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
    var ranges = null;
    try {
        if (state.ranges) {
            ranges = rangeDeserialize(state.ranges, state.element.get(0));
        }
    } catch (exception) {
        // <debug>
        handleError(exception);
        // </debug>
    }
    return {
        element: state.element,
        ranges: ranges
    };
}
