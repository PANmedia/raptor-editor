
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

//function stateRestoreRanges(state) {
//    if (state.ranges) {
//        rangeDeserialize(state.ranges);
//    }
//}
