function styleSwapState(element, newState) {
    var previousState = {};
    for (var key in newState) {
        previousState[key] = element.get(0).style[key];
        element.css(key, newState[key]);
    }
    return previousState;
}
