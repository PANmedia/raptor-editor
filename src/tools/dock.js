/**
 * @fileOverview Docking to screen and element helper functions.
 * @license http://www.raptor-editor.com/license
 *
 * @author David Neilsen david@panmedia.co.nz
 * @author Michael Robinson michael@panmedia.co.nz
 */

/**
 * Docks a specified element to the screen.
 *
 * @param {jQuery} element The element to dock.
 * @param {string} options Any options to further specify the docking state.
 * @returns {Object} An object containing the docked element, a spacer div and the style state.
 */
function dockToScreen(element, options) {
    var position,
        spacer = $('<div>')
            .addClass('spacer');
    if (options.position === 'top') {
        position = {
            position: 'fixed',
            top: options.under ? $(options.under).outerHeight() : 0,
            left: 0,
            right: 0
        };
        if (options.spacer) {
            if (options.under) {
                spacer.insertAfter(options.under);
            } else {
                spacer.prependTo('body');
            }
        }
    } else if (options.position === 'topLeft') {
        position = {
            position: 'fixed',
            top: options.under ? $(options.under).outerHeight() : 0,
            left: 0
        };
        if (options.spacer) {
            if (options.under) {
                spacer.insertAfter(options.under);
            } else {
                spacer.prependTo('body');
            }
        }
    } else if (options.position === 'topRight') {
        position = {
            position: 'fixed',
            top: options.under ? $(options.under).outerHeight() : 0,
            right: 0
        };
        if (options.spacer) {
            if (options.under) {
                spacer.insertAfter(options.under);
            } else {
                spacer.prependTo('body');
            }
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
    var styleState = styleSwapState(element, position);
    spacer.css('height', element.outerHeight());
    setTimeout(function() {
        spacer.css('height', element.outerHeight());
    }, 300);
    return {
        dockedElement: element,
        spacer: spacer,
        styleState: styleState
    };
}

/**
 * Undocks a docked element from the screen.
 * @todo not sure of description for dockState
 * @param {jQuery} dockState
 * @returns {unresolved}
 */
function undockFromScreen(dockState) {
    styleRestoreState(dockState.dockedElement, dockState.styleState);
    dockState.spacer.remove();
    return dockState.dockedElement.detach();
}

/**
 * Docks an element to a another element.
 *
 * @param {jQuery} elementToDock This is the element to be docked.
 * @param {jQuery} dockTo This is the element to which the elementToDock will be docked to.
 * @param {string} options These are any options to refine the docking position.
 * @returns {Object} An object containing the docked element, what it has been docked to, and their style states.
 */
function dockToElement(elementToDock, dockTo, options) {
    var wrapper = dockTo
            .wrap('<div>')
            .parent(),
        innerStyleState = styleSwapWithWrapper(wrapper, dockTo, {
            'float': 'none',
            display: 'block',
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
    wrapper
        .prepend(elementToDock)
        .addClass(options.wrapperClass ? options.wrapperClass : '');
    return {
        dockedElement: elementToDock,
        dockedTo: dockTo,
        innerStyleState: innerStyleState,
        dockedElementStyleState: dockedElementStyleState
    };
}

/**
 * Undocks an element from the screen.
 *@todo not sure of description for dockState
 * @param {jQuery} dockState
 * @returns {Object} The undocked element.
 */
function undockFromElement(dockState) {
    styleRestoreState(dockState.dockedTo, dockState.innerStyleState);
    styleRestoreState(dockState.dockedElement, dockState.dockedElementStyleState);
    var dockedElement = dockState.dockedElement.detach();
    dockState.dockedTo.unwrap();
    return dockedElement;
}
