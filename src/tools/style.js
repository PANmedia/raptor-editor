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

function styleRestoreState(element, state) {
    for (var key in state) {
        element.css(key, state[key] || '');
    }
}
