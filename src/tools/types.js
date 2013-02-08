/**
 * @fileOverview Type checking functions.
 * @author Michael Robinson michael@panmedia.co.nz
 * @author David Neilsen david@panmedia.co.nz
 */

/**
 * Determine whether object is a number
 * {@link http://stackoverflow.com/a/1421988/187954}.
 *
 * @param  {mixed} object The object to be tested
 * @return {Boolean} True if the object is a number.
 */
function typeIsNumber(object) {
    return !isNaN(object - 0) && object !== null;
}

/**
 * Determines whether object is a node.
 *
 * @param {mixed} object The object to be tested.
 * @returns {Boolean} True if the object is a node.
 */
function typeIsNode(object) {
    return object instanceof Node;
}

/**
 * @param  {mixed} object
 * @return {boolean} True if object is a text node.
 */
function typeIsTextNode(object) {
    if (typeIsNode(object)) {
        return object.nodeType === Node.TEXT_NODE;
    }

    if (typeIsElement(object)) {
        return typeIsNode(object[0]);
    }

    return false;
}

/**
 * Determines whether object is an element.
 *
 * @param {mixed} object The object to be tested.
 * @returns {Boolean} True if the object is an element.
 */
function typeIsElement(object) {
    return object instanceof jQuery;
}

/**
 * Determines whether object is a range.
 *
 * @param {mixed} object The object to be tested.
 * @returns {Boolean} True if the object is a range.
 */
function typeIsRange(object) {
    return object instanceof rangy.WrappedRange;
}

/**
 * Determines whether object is a selection.
 *
 * @param {mixed} object The object to be tested.
 * @returns {Boolean} True if the object is a selection.
 */
function typeIsSelection(object) {
    return object instanceof rangy.WrappedSelection;
}

/**
 * Determines whether object is a string.
 *
 * @param {mixed} object The object to be tested.
 * @returns {Boolean} True if the object is a string.
 */
function typeIsString(object) {
    return typeof object === 'string';
}

/**
 * @param  {mixed} object
 * @return {boolean} True if object is an Array.
 */
function typeIsArray(object) {
    return object instanceof Array;
}
