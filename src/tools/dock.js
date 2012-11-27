

function dockToScreen(element, options) {
    var previousState = styleSwapState(element, {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
    })
    console.log(previousState);
    $('<div>')
        .addClass('spacer')
        .css({
            height: element.outerHeight()
        })
        .prependTo('body');
}

function undockFromScreen() {
    
}

function dockToElement(elementToDock, dockTo, options) {
    
}
