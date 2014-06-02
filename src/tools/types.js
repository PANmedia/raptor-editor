/**
 * @fileOverview Type checking functions.
 * @license http://www.raptor-editor.com/license
 *
 * @author Michael Robinson michael@panmedia.co.nz
 * @author David Neilsen david@panmedia.co.nz
 */

/**
 * Determines whether object is a rangy range.
 *
 * @param {mixed} object The object to be tested.
 * @returns {Boolean} True if the object is a rangy range.
 */
function typeIsRange(object) {
    return object instanceof rangy.WrappedRange;
}

/**
 * Determines whether object is a rangy selection.
 *
 * @param {mixed} object The object to be tested.
 * @returns {Boolean} True if the object is a rangy selection.
 */
function typeIsSelection(object) {
    return object instanceof rangy.WrappedSelection;
}
