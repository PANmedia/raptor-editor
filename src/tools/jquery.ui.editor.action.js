function actionPreview(previewState, target, action) {
    // <strict>
    if (!(target instanceof $)) {
        handleError("Target must be a jQuery instance when previewing an action", target);
    }
    // </strict>
    
    actionPreviewRestore(previewState, target);
    
    // <debug>
    if (debugLevel >= MID) debug('Action preview');
    // </debug>
    
    previewState = stateSave(target);
    action();
    rangy.getSelection().removeAllRanges();
    return previewState;
}

function actionPreviewRestore(previewState, target) {
    if (previewState) {
        // <debug>
        if (debugLevel >= MID) debug('Action preview restore');
        // </debug>
        
        var state = stateRestore(target, previewState);
        if (state.ranges) {
            rangy.getSelection().setRanges(state.ranges);
        }
        return state.element;
    }
    return target;
}

function actionApply(previewState, target, action, history) {
    // <strict>
    if (!(target instanceof $)) {
        handleError("Target must be a jQuery instance when applying an action", target);
    }
    // </strict>
    
    target = actionPreviewRestore(previewState, target);
    
    // <debug>
    if (debugLevel >= MID) debug('Action apply');
    // </debug>
    
    action();
    return target;
}

function actionUndo() {
    
}

function actionRedo() {
    
}
