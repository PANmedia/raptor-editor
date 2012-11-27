
function stateSave(element) {
    // <strict>
    if (!(element instanceof $)) {
        handleError("Element must be a jQuery instance when saving a state", element);
    }
    // </strict>
    
    // <debug>
    if (debugLevel >= MID) debug('State save');
    // </debug>
    
    var ranges = rangy.getSelection().getAllRanges();
    return {
        element: element.clone(),
        ranges: ranges.length ? rangeSerialize(ranges, element.get(0)) : null
    };
}

function stateRestore(element, state) {
    // <strict>
    if (!(element instanceof $)) {
        handleError("Element must be a jQuery instance when restoring a state", element);
    }
    if (!(state.element instanceof $)) {
        handleError("Preview state element must be a jQuery instance when restoring a state", state.element);
    }
    // </strict>
    
    // <debug>
    if (debugLevel >= MID) debug('State restore');
    // </debug>
    
    element.replaceWith(state.element);
    return {
        element: state.element,
        ranges: state.ranges ? rangeDeserialize(state.ranges) : null
    };
}

//function stateRestoreRanges(state) {
//    if (state.ranges) {
//        rangeDeserialize(state.ranges);
//    }
//}