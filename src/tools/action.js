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

function actionApply(action, history) {
    action();
}

function actionUndo() {

}

function actionRedo() {

}
