

function dockToScreen(element, options) {
    var position,
        spacer = $('<div>')
            .addClass('spacer')
            .css({
                height: element.outerHeight()
            });
    if (options.position === 'top') {
        position = {
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0
        };
        if (options.spacer) {
            spacer.prependTo('body');
        }
    } else if (options.position === 'topLeft') {
        position = {
            position: 'fixed',
            top: 0,
            left: 0
        };
        if (options.spacer) {
            spacer.prependTo('body');
        }
    } else if (options.position === 'topRight') {
        position = {
            position: 'fixed',
            top: 0,
            right: 0
        };
        if (options.spacer) {
            spacer.prependTo('body');
        }
    } else if (options.position === 'bottom') {
        position = {
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0
        };
        if (options.spacer) {
            spacer.appendTo('body');
        }
    } else if (options.position === 'bottomLeft') {
        position = {
            position: 'fixed',
            bottom: 0,
            left: 0
        };
        if (options.spacer) {
            spacer.appendTo('body');
        }
    } else if (options.position === 'bottomRight') {
        position = {
            position: 'fixed',
            bottom: 0,
            right: 0
        };
        if (options.spacer) {
            spacer.appendTo('body');
        }
    }
    return {
        dockedElement: element,
        spacer: spacer,
        styleState: styleSwapState(element, position)
    };
}

function undockFromScreen(dockState) {
    styleRestoreState(dockState.dockedElement, dockState.styleState)
    dockState.spacer.remove();
    return dockState.dockedElement.detach();
}

function dockToElement(elementToDock, dockTo, options) {
    var wrapper = dockTo.wrap('<div>').parent(),
        innerStyleState = styleSwapWithWrapper(wrapper, dockTo, {
            display: 'block',
            float: 'none',
            clear: 'none',
            position: 'static',

            /* Margin */
            margin: 0,
            marginLeft: 0,
            marginRight: 0,
            marginTop: 0,
            marginBottom: 0,

            /* Padding */
            padding: 0,
            paddingLeft: 0,
            paddingRight: 0,
            paddingTop: 0,
            paddingBottom: 0,

            outline: 0,
            width: 'auto',
            border: 'none'
        }),
        dockedElementStyleState = styleSwapState(elementToDock, {
            position: 'static'
        });
    wrapper.prepend(elementToDock);
    return {
        dockedElement: elementToDock,
        dockedTo: dockTo,
        innerStyleState: innerStyleState,
        dockedElementStyleState: dockedElementStyleState
    };
}

function undockFromElement(dockState) {
    styleRestoreState(dockState.dockedTo, dockState.innerStyleState)
    styleRestoreState(dockState.dockedElement, dockState.dockedElementStyleState)
    var dockedElement = dockState.dockedElement.detach();
    dockState.dockedTo.unwrap();
    return dockedElement;
}
