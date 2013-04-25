/**
 * @fileOverview Action helper functions.
 * @license http://www.raptor-editor.com/license
 *
 * @author David Neilsen david@panmedia.co.nz
 * @author Michael Robinson michael@panmedia.co.nz
 */

/**
 * Previews an action on an element.
 * @todo check descriptions for accuracy
 * @param {Object} previewState The saved state of the target.
 * @param {jQuery} target Element to have the preview applied to it.
 * @param {function} action The action to be previewed.
 * @returns {Object} ??
 */
function actionPreview(previewState, target, action) {
    // <strict>
    if (!typeIsElement(target)) {
        handleError("Target must be a jQuery instance when previewing an action", target);
    }
    // </strict>

    actionPreviewRestore(previewState, target);

    previewState = stateSave(target);
    action();
    rangy.getSelection().removeAllRanges();
    return previewState;
}

/**
 * Changes an element back to its saved state and returns that element.
 * @todo check descriptions please.
 * @param {Object} previewState The previously saved state of the target.
 * @param {jQuery} target The element to have it's state restored.
 * @returns {jQuery} The restored target.
 */
function actionPreviewRestore(previewState, target) {
    if (previewState) {
        var state = stateRestore(target, previewState);
        if (state.ranges) {
            rangy.getSelection().setRanges(state.ranges);
        }
        return state.element;
    }
    return target;
}

/**
 * Applies an action.
 * @todo types for params
 * @param {type} action The action to apply.
 * @param {type} history
 */
function actionApply(action, history) {
    action();
}

/**
 * Undoes an action.
 *
 * @returns {undefined}
 */
function actionUndo() {

}

/**
 * Redoes an action.
 *
 * @returns {undefined}
 */
function actionRedo() {

}
