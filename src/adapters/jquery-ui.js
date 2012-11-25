
/**
 * 
 * @param {type} element
 * @param {type} options
 * @param {type} options.baseClass
 * @param {type} options.title
 * @param {type} options.disabled
 * @param {type} options.text
 * @param {type} options.label
 * @param {type} options.icon
 * @returns {unresolved}
 */
function aButton(element, options) {
    options = options || {};
    return $(element)
        .addClass(options.baseClass)
        .attr('name', name)
        .attr('title', options.title)
        .button({
            icons: {
                primary: options.icon || 'ui-icon-' + options.baseClass
            },
            disabled: options.disabled ? true : false,
            text: options.text || false,
            label: options.label || null
        });
}
