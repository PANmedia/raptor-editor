/**
 * @fileOverview Element manipulation helper functions.
 * @license http://www.raptor-editor.com/license
 *
 * @author David Neilsen david@panmedia.co.nz
 * @author Michael Robinson michael@panmedia.co.nz
 */

/**
 * Remove all but the allowed attributes from the parent.
 *
 * @param {jQuery} parent The jQuery element to cleanse of attributes.
 * @param {String[]|null} allowedAttributes An array of allowed attributes.
 * @return {jQuery} The modified parent.
 */
function elementRemoveAttributes(parent, allowedAttributes) {
    parent.children().each(function() {
        var stripAttributes = $.map(this.attributes, function(item) {
            if ($.inArray(item.name, allowedAttributes) === -1) {
                return item.name;
            }
        });
        var child = $(this);
        $.each(stripAttributes, function(i, attributeName) {
            child.removeAttr(attributeName);
        });
        element.removeAttributes($(this), allowedAttributes);
    });
    return parent;
}

/**
 * Sets the z-index CSS property on an element to 1 above all its sibling elements.
 *
 * @param {jQuery} element The jQuery element to have it's z index increased.
 */
function elementBringToTop(element) {
    var zIndex = 1;
    element.siblings().each(function() {
        var z = $(this).css('z-index');
        if (!isNaN(z) && z > zIndex) {
            zIndex = z + 1;
        }
    });
    element.css('z-index', zIndex);
}

/**
 * Retrieve outer html from an element.
 *
 * @param  {jQuery} element The jQuery element to retrieve the outer HTML from.
 * @return {String} The outer HTML.
 */
function elementOuterHtml(element) {
    return element.clone().wrap('<div/>').parent().html();
}

/**
 * Retrieve outer text from an element.
 *
 * @param  {jQuery} element The jQuery element to retrieve the outer text from.
 * @return {String} The outer text.
 */
function elementOuterText(element) {
    return element.clone().wrap('<div/>').parent().text();
}

/**
 * Determine whether element is block.
 *
 * @param  {Element} element The element to test.
 * @return {Boolean} True if the element is a block element
 */
function elementIsBlock(element) {
    return elementDefaultDisplay(element.tagName) === 'block';
}

/**
 * Determine whether element contains a block element.
 *
 * @param  {Element} element
 * @return {Boolean} True if the element contains a block element, false otherwise.
 */
function elementContainsBlockElement(element) {
    var containsBlock = false;
    element.contents().each(function() {
        if (!typeIsTextNode(this) && elementIsBlock(this)) {
            containsBlock = true;
            return;
        }
    });
    return containsBlock;
}

/**
 * Determine whether element is inline or block.
 *
 * @see http://stackoverflow.com/a/2881008/187954
 * @param  {string} tag Lower case tag name, e.g. 'a'.
 * @return {string} Default display style for tag.
 */
function elementDefaultDisplay(tag) {
    var cStyle,
        t = document.createElement(tag),
        gcs = "getComputedStyle" in window;

    document.body.appendChild(t);
    cStyle = (gcs ? window.getComputedStyle(t, "") : t.currentStyle).display;
    document.body.removeChild(t);

    return cStyle;
}

/**
 * Check that the given element is one of the the given tags.
 *
 * @param  {jQuery|Element} element The element to be tested.
 * @param  {Array}  validTags An array of valid tag names.
 * @return {Boolean} True if the given element is one of the give valid tags.
 */
function elementIsValid(element, validTags) {
    return -1 !== $.inArray($(element)[0].tagName.toLowerCase(), validTags);
}

/**
 * According to the given array of valid tags, find and return the first invalid
 * element of a valid parent. Recursively search parents until the wrapper is
 * encountered.
 *
 * @param  {Node} element
 * @param  {string[]} validTags
 * @param  {Element} wrapper
 * @return {Node}           [description]
 */
function elementFirstInvalidElementOfValidParent(element, validTags, wrapper) {
    // <strict>
    if (!typeIsNode(element)) {
        handleInvalidArgumentError('Parameter 1 to elementFirstInvalidElementOfValidParent must be a node', element);
        return;
    }
    // </strict>
    var parent = element.parentNode;
    if (parent[0] === wrapper[0]) {
        // <strict>
        if (!elementIsValid(parent, validTags)) {
            handleError('elementFirstInvalidElementOfValidParent requires a valid wrapper');
            return;
        }
        // </strict>
        return element;
    }
    if (elementIsValid(parent, validTags)) {
        return element;
    }
    return elementFirstInvalidElementOfValidParent(parent, validTags, wrapper);
}

/**
 * Calculate and return the visible rectangle for the element.
 *
 * @param  {jQuery|Element} element The element to calculate the visible rectangle for.
 * @return {Object} Visible rectangle for the element.
 */
function elementVisibleRect(element) {
    // <strict>
    if (!typeIsJQueryCompatible(element)) {
        handleInvalidArgumentError('Parameter 1 to elementVisibleRect is expected to be a jQuery compatible object', element);
        return;
    }
    // </strict>
    element = $(element);

    var rect = {
        top: Math.round(element.offset().top),
        left: Math.round(element.offset().left),
        width: Math.round(element.outerWidth()),
        height: Math.round(element.outerHeight())
    };


    var scrollTop = $(window).scrollTop();
    var windowHeight = $(window).height();
    var scrollBottom = scrollTop + windowHeight;
    var elementBottom = Math.round(rect.height + rect.top);

    // If top & bottom of element are within the viewport, do nothing.
    if (scrollTop < rect.top && scrollBottom > elementBottom) {
        return rect;
    }

    // Top of element is outside the viewport
    if (scrollTop > rect.top) {
        rect.top = scrollTop;
    }

    // Bottom of element is outside the viewport
    if (scrollBottom < elementBottom) {
        rect.height = scrollBottom - rect.top;
    } else {
        // Bottom of element inside viewport
        rect.height = windowHeight - (scrollBottom - elementBottom);
    }

    return rect;
}

/**
 * Returns a map of an elements attributes and values. The result of this function
 * can be passed directly to $('...').attr(result);
 *
 * @param  {jQuery|Element|Selector} element The element to get the attributes from.
 * @return {Object} A map of attribute names mapped to their values.
 */
function elementGetAttributes(element) {
    var attributes = $(element).get(0).attributes,
        result = {};
    for (var i = 0, l = attributes.length; i < l; i++) {
        result[attributes[i].name] = attributes[i].value;
    }
    return result;
}

/**
 * Gets the styles of an element.
 * @todo the type for result.
 * FIXME: this function needs reviewing.
 * @param {jQuerySelector|jQuery|Element} element This is the element to get the style from.
 * @returns {unresolved} The style(s) of the element.
 */
function elementGetStyles(element) {
    var result = {};
    var style = window.getComputedStyle(element[0], null);
    for (var i = 0; i < style.length; i++) {
        result[style.item(i)] = style.getPropertyValue(style.item(i));
    }
    return result;
}

/**
 * Wraps the inner content of an element with a tag.
 *
 * @param {jQuerySelector|jQuery|Element} element The element(s) to wrap.
 * @param {String} tag The wrapper tag name
 * @returns {jQuery} The wrapped element.
 */
function elementWrapInner(element, tag) {
    var result = new jQuery();
    selectionSave();
    for (var i = 0, l = element.length; i < l; i++) {
        var wrapper = $('<' + tag + '/>').html($(element[i]).html());
        element.html(wrapper);
        result.push(wrapper[0]);
    }
    selectionRestore();
    return result;
}

/**
 * Toggles the styles of an element.
 *
 * FIXME: this function needs reviewing
 * @public @static
 * @param {jQuerySelector|jQuery|Element} element The jQuery element to have it's style changed.
 * @param {type} styles The styles to add or remove from the element.
 * @returns {undefined}
 */
function elementToggleStyle(element, styles) {
    $.each(styles, function(property, value) {
        if ($(element).css(property) === value) {
            $(element).css(property, '');
        } else {
            $(element).css(property, value);
        }
    });
}

/**
 * Swaps the styles of two elements.
 *
 * @param {jQuery|Element} element1 The element for element 2 to get its styles from.
 * @param {jQuery|Element} element2 The element for element 1 to get its styles from.
 * @param {Object} style The style to be swapped between the two elements.
 */
function elementSwapStyles(element1, element2, style) {
    for (var name in style) {
        element1.css(name, element2.css(name));
        element2.css(name, style[name]);
    }
}

/**
 * Checks if an element is empty.
 *
 * @param {Element} element The element to be checked.
 * @returns {Boolean} Returns true if element is empty.
 */
function elementIsEmpty(element) {
    // <strict>
    if (!typeIsElement(element)) {
        handleInvalidArgumentError('Parameter 1 to elementIsEmpty must be a jQuery element', element);
        return;
    }
    // </strict>

    // Images and elements containing images are not empty
    if (element.is('img') || element.find('img').length) {
        return false;
    }
    if ((/&nbsp;/).test(element.html())) {
        return false;
    }
    return element.text() === '';
}

/**
 * Positions an element underneath another element.
 *
 * @param {jQuery} element Element to position.
 * @param {jQuery} under Element to position under.
 */
function elementPositionUnder(element, under) {
    var pos = $(under).offset(),
        height = $(under).outerHeight();
    $(element).css({
        top: (pos.top + height - $(window).scrollTop()) + 'px',
        left: pos.left + 'px'
    });
}

/**
 * Removes the element from the DOM to manipulate it using a function passed to the method, then replaces it back to it's origional position.
 *
 * @todo desc and type for manip
 * @param {jQuery|Element} element The element to be manipulated.
 * @param {type} manip A function used to manipulate the element i think.
 */
function elementDetachedManip(element, manip) {
    var parent = $(element).parent();
    $(element).detach();
    manip(element);
    parent.append(element);
}

/**
 * Finds the closest parent, up to a limit element, to the supplied element that is not an display inline or null.
 * If the parent element is the same as the limit element then it returns null.
 *
 * @param {jQuery} element The element to find the closest parent of.
 * @param {jQuery} limitElement The element to stop looking for the closest parent at.
 * @returns {jQuery} Closest element that is not display inline or null, or null if the parent element is the same as the limit element.
 */
function elementClosestBlock(element, limitElement) {
    // <strict>
    if (!typeIsElement(element)) {
        handleInvalidArgumentError('Parameter 1 to elementClosestBlock must be a jQuery element', element);
        return;
    }
    if (!typeIsElement(limitElement)) {
        handleInvalidArgumentError('Parameter 2 to elementClosestBlock must be a jQuery element', limitElement);
        return;
    }
    // </strict>
    while (element.length > 0 &&
        element[0] !== limitElement[0] &&
        (element[0].nodeType === Node.TEXT_NODE || element.css('display') === 'inline')) {
        element = element.parent();
    }
    if (element[0] === limitElement[0]) {
        return null;
    }
    return element;
}

/**
 * Generates a unique id.
 *
 * @returns {String} The unique id.
 */
function elementUniqueId() {
    var id = 'ruid-' + new Date().getTime() + '-' + Math.floor(Math.random() * 100000);
    while ($('#' + id).length) {
        id = 'ruid-' + new Date().getTime() + '-' + Math.floor(Math.random() * 100000);
    }
    return id;
}

/**
 * Changes the tags on a given element.
 *
 * @todo not sure of details of return
 * @param {jQuerySelector|jQuery|Element} element The element(s) to have it's tags changed
 * @param {Element} newTag The new tag for the element(s)
 * @returns {Element}
 */
function elementChangeTag(element, newTag) {
    // <strict>
    if (!typeIsElement(element)) {
        handleInvalidArgumentError('Parameter 1 to elementChangeTag must be a jQuery element', element);
    }
    // </strict>
    var tags = [];
    for (var i = element.length - 1; 0 <= i ; i--) {
        var node = document.createElement(newTag);
        node.innerHTML = element[i].innerHTML;
        $.each(element[i].attributes, function() {
            $(node).attr(this.name, this.value);
        });
        $(element[i]).after(node).remove();
        tags[i] = node;
    }
    return $(tags);
}

/**
 * Positions an element over top of another element.
 *  - If the other element is big, then the element is positioned in the center of the visible part of the other element.
 *  - If the other element is small and not at the top of the screen, the other element is positioned at the top of the other element.
 *  - If the other element is small and not is at the top of the screen, the other element is positioned at the bottom of the other element.
 *
 * @param {Element} element The element to position.
 * @param {Element} over The element to position over.
 */
function elementPositionOver(element, over) {
    if (element.outerHeight() > over.outerHeight() - 20) {
        var visibleRect = elementVisibleRect(over),
            offset = over.offset();
        element.css({
            position: 'absolute',
            // Calculate offset center for the element
            top:  offset.top - element.outerHeight(),
            left: visibleRect.left + ((visibleRect.width / 2)  - (element.outerWidth()  / 2))
        });
    } else {
        var visibleRect = elementVisibleRect(over);
        element.css({
            position: 'absolute',
            // Calculate offset center for the element
            top:  visibleRect.top  + ((visibleRect.height / 2) - (element.outerHeight() / 2)),
            left: visibleRect.left + ((visibleRect.width / 2)  - (element.outerWidth()  / 2))
        });
    }
}
