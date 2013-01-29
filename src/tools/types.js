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
 * @param  {mixed} object
 * @return {boolean} True if object is an Object.
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
 * @param  {mixed} object
 * @return {boolean} True if object is a jQuery element.
 */
function typeIsElement(object) {
    return object instanceof jQuery;
}

/**
 * @param  {mixed} object
 * @return {boolean} True if object is a RangyRange.
 */
function typeIsRange(object) {
    return object instanceof rangy.WrappedRange;
}

/**
 * @param  {mixed} object
 * @return {boolean} True if object is a RangySelection.
 */
function typeIsSelection(object) {
    return object instanceof rangy.WrappedSelection;
}

/**
 * @param  {mixed} object
 * @return {boolean} True if object is a string.
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
