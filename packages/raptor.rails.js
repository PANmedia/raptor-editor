/*! 
VERSION: 0.5.0 
For license information, see http://www.raptor-editor.com/license
*/

                /* File: build/default/src/dependencies/rangy/rangy-core.js */
                /**
 * Rangy, a cross-browser JavaScript range and selection library
 * http://code.google.com/p/rangy/
 *
 * Copyright 2012, Tim Down
 * Licensed under the MIT license.
 * Version: 1.3alpha.681
 * Build date: 20 July 2012
 */
window.rangy = (function() {

    var OBJECT = "object", FUNCTION = "function", UNDEFINED = "undefined";

    // Minimal set of properties required for DOM Level 2 Range compliance. Comparison constants such as START_TO_START
    // are omitted because ranges in KHTML do not have them but otherwise work perfectly well. See issue 113.
    var domRangeProperties = ["startContainer", "startOffset", "endContainer", "endOffset", "collapsed",
        "commonAncestorContainer"];

    // Minimal set of methods required for DOM Level 2 Range compliance
    var domRangeMethods = ["setStart", "setStartBefore", "setStartAfter", "setEnd", "setEndBefore",
        "setEndAfter", "collapse", "selectNode", "selectNodeContents", "compareBoundaryPoints", "deleteContents",
        "extractContents", "cloneContents", "insertNode", "surroundContents", "cloneRange", "toString", "detach"];

    var textRangeProperties = ["boundingHeight", "boundingLeft", "boundingTop", "boundingWidth", "htmlText", "text"];

    // Subset of TextRange's full set of methods that we're interested in
    var textRangeMethods = ["collapse", "compareEndPoints", "duplicate", "moveToElementText", "parentElement", "select",
        "setEndPoint", "getBoundingClientRect"];

    /*----------------------------------------------------------------------------------------------------------------*/

    // Trio of functions taken from Peter Michaux's article:
    // http://peter.michaux.ca/articles/feature-detection-state-of-the-art-browser-scripting
    function isHostMethod(o, p) {
        var t = typeof o[p];
        return t == FUNCTION || (!!(t == OBJECT && o[p])) || t == "unknown";
    }

    function isHostObject(o, p) {
        return !!(typeof o[p] == OBJECT && o[p]);
    }

    function isHostProperty(o, p) {
        return typeof o[p] != UNDEFINED;
    }

    // Creates a convenience function to save verbose repeated calls to tests functions
    function createMultiplePropertyTest(testFunc) {
        return function(o, props) {
            var i = props.length;
            while (i--) {
                if (!testFunc(o, props[i])) {
                    return false;
                }
            }
            return true;
        };
    }

    // Next trio of functions are a convenience to save verbose repeated calls to previous two functions
    var areHostMethods = createMultiplePropertyTest(isHostMethod);
    var areHostObjects = createMultiplePropertyTest(isHostObject);
    var areHostProperties = createMultiplePropertyTest(isHostProperty);

    function isTextRange(range) {
        return range && areHostMethods(range, textRangeMethods) && areHostProperties(range, textRangeProperties);
    }

    var api = {
        version: "1.3alpha.681",
        initialized: false,
        supported: true,

        util: {
            isHostMethod: isHostMethod,
            isHostObject: isHostObject,
            isHostProperty: isHostProperty,
            areHostMethods: areHostMethods,
            areHostObjects: areHostObjects,
            areHostProperties: areHostProperties,
            isTextRange: isTextRange
        },

        features: {},

        modules: {},
        config: {
            alertOnFail: true,
            alertOnWarn: false,
            preferTextRange: false
        }
    };

    function alertOrLog(msg, shouldAlert) {
        if (shouldAlert) {
            window.alert(msg);
        } else if (typeof window.console != UNDEFINED && typeof window.console.log != UNDEFINED) {
            window.console.log(msg);
        }
    }

    function fail(reason) {
        api.initialized = true;
        api.supported = false;
        alertOrLog("Rangy is not supported on this page in your browser. Reason: " + reason, api.config.alertOnFail);
    }

    api.fail = fail;

    function warn(msg) {
        alertOrLog("Rangy warning: " + msg, api.config.alertOnWarn);
    }

    api.warn = warn;

    // Add utility extend() method
    if ({}.hasOwnProperty) {
        api.util.extend = function(obj, props, deep) {
            var o, p;
            for (var i in props) {
                if (props.hasOwnProperty(i)) {
                    o = obj[i];
                    p = props[i];
                    //if (deep) alert([o !== null, typeof o == "object", p !== null, typeof p == "object"])
                    if (deep && o !== null && typeof o == "object" && p !== null && typeof p == "object") {
                        api.util.extend(o, p, true);
                    }
                    obj[i] = p;
                }
            }
            return obj;
        };
    } else {
        fail("hasOwnProperty not supported");
    }

    var initListeners = [];
    var moduleInitializers = [];

    // Initialization
    function init() {
        if (api.initialized) {
            return;
        }
        var testRange;
        var implementsDomRange = false, implementsTextRange = false;

        // First, perform basic feature tests

        if (isHostMethod(document, "createRange")) {
            testRange = document.createRange();
            if (areHostMethods(testRange, domRangeMethods) && areHostProperties(testRange, domRangeProperties)) {
                implementsDomRange = true;
            }
            testRange.detach();
        }

        var body = isHostObject(document, "body") ? document.body : document.getElementsByTagName("body")[0];
        if (!body || body.nodeName.toLowerCase() != "body") {
            fail("No body element found");
            return;
        }

        if (body && isHostMethod(body, "createTextRange")) {
            testRange = body.createTextRange();
            if (isTextRange(testRange)) {
                implementsTextRange = true;
            }
        }

        if (!implementsDomRange && !implementsTextRange) {
            fail("Neither Range nor TextRange are available");
            return;
        }

        api.initialized = true;
        api.features = {
            implementsDomRange: implementsDomRange,
            implementsTextRange: implementsTextRange
        };

        // Initialize modules and call init listeners
        var allListeners = moduleInitializers.concat(initListeners);
        for (var i = 0, len = allListeners.length; i < len; ++i) {
            try {
                allListeners[i](api);
            } catch (ex) {
                if (isHostObject(window, "console") && isHostMethod(window.console, "log")) {
                    window.console.log("Rangy init listener threw an exception. Continuing.", ex);
                }
            }
        }
    }

    // Allow external scripts to initialize this library in case it's loaded after the document has loaded
    api.init = init;

    // Execute listener immediately if already initialized
    api.addInitListener = function(listener) {
        if (api.initialized) {
            listener(api);
        } else {
            initListeners.push(listener);
        }
    };

    var createMissingNativeApiListeners = [];

    api.addCreateMissingNativeApiListener = function(listener) {
        createMissingNativeApiListeners.push(listener);
    };

    function createMissingNativeApi(win) {
        win = win || window;
        init();

        // Notify listeners
        for (var i = 0, len = createMissingNativeApiListeners.length; i < len; ++i) {
            createMissingNativeApiListeners[i](win);
        }
    }

    api.createMissingNativeApi = createMissingNativeApi;

    function Module(name) {
        this.name = name;
        this.initialized = false;
        this.supported = false;
    }

    Module.prototype = {
        fail: function(reason) {
            this.initialized = true;
            this.supported = false;
            throw new Error("Module '" + this.name + "' failed to load: " + reason);
        },

        warn: function(msg) {
            api.warn("Module " + this.name + ": " + msg);
        },

        deprecationNotice: function(deprecated, replacement) {
            api.warn("DEPRECATED: " + deprecated + " in module " + this.name + "is deprecated. Please use "
                + replacement + " instead");
        },

        createError: function(msg) {
            return new Error("Error in Rangy " + this.name + " module: " + msg);
        }
    };

    api.createModule = function(name, initFunc) {
        var module = new Module(name);
        api.modules[name] = module;

        moduleInitializers.push(function(api) {
            initFunc(api, module);
            module.initialized = true;
            module.supported = true;
        });
    };

    api.requireModules = function(modules) {
        for (var i = 0, len = modules.length, module, moduleName; i < len; ++i) {
            moduleName = modules[i];
            module = api.modules[moduleName];
            if (!module || !(module instanceof Module)) {
                throw new Error("Module '" + moduleName + "' not found");
            }
            if (!module.supported) {
                throw new Error("Module '" + moduleName + "' not supported");
            }
        }
    };

    /*----------------------------------------------------------------------------------------------------------------*/

    // Wait for document to load before running tests

    var docReady = false;

    var loadHandler = function(e) {
        if (!docReady) {
            docReady = true;
            if (!api.initialized) {
                init();
            }
        }
    };

    // Test whether we have window and document objects that we will need
    if (typeof window == UNDEFINED) {
        fail("No window found");
        return;
    }
    if (typeof document == UNDEFINED) {
        fail("No document found");
        return;
    }

    if (isHostMethod(document, "addEventListener")) {
        document.addEventListener("DOMContentLoaded", loadHandler, false);
    }

    // Add a fallback in case the DOMContentLoaded event isn't supported
    if (isHostMethod(window, "addEventListener")) {
        window.addEventListener("load", loadHandler, false);
    } else if (isHostMethod(window, "attachEvent")) {
        window.attachEvent("onload", loadHandler);
    } else {
        fail("Window does not have required addEventListener or attachEvent method");
    }

    return api;
})();

rangy.createModule("DomUtil", function(api, module) {
    var UNDEF = "undefined";
    var util = api.util;

    // Perform feature tests
    if (!util.areHostMethods(document, ["createDocumentFragment", "createElement", "createTextNode"])) {
        module.fail("document missing a Node creation method");
    }

    if (!util.isHostMethod(document, "getElementsByTagName")) {
        module.fail("document missing getElementsByTagName method");
    }

    var el = document.createElement("div");
    if (!util.areHostMethods(el, ["insertBefore", "appendChild", "cloneNode"] ||
            !util.areHostObjects(el, ["previousSibling", "nextSibling", "childNodes", "parentNode"]))) {
        module.fail("Incomplete Element implementation");
    }

    // innerHTML is required for Range's createContextualFragment method
    if (!util.isHostProperty(el, "innerHTML")) {
        module.fail("Element is missing innerHTML property");
    }

    var textNode = document.createTextNode("test");
    if (!util.areHostMethods(textNode, ["splitText", "deleteData", "insertData", "appendData", "cloneNode"] ||
            !util.areHostObjects(el, ["previousSibling", "nextSibling", "childNodes", "parentNode"]) ||
            !util.areHostProperties(textNode, ["data"]))) {
        module.fail("Incomplete Text Node implementation");
    }

    /*----------------------------------------------------------------------------------------------------------------*/

    // Removed use of indexOf because of a bizarre bug in Opera that is thrown in one of the Acid3 tests. I haven't been
    // able to replicate it outside of the test. The bug is that indexOf returns -1 when called on an Array that
    // contains just the document as a single element and the value searched for is the document.
    var arrayContains = /*Array.prototype.indexOf ?
        function(arr, val) {
            return arr.indexOf(val) > -1;
        }:*/

        function(arr, val) {
            var i = arr.length;
            while (i--) {
                if (arr[i] === val) {
                    return true;
                }
            }
            return false;
        };

    // Opera 11 puts HTML elements in the null namespace, it seems, and IE 7 has undefined namespaceURI
    function isHtmlNamespace(node) {
        var ns;
        return typeof node.namespaceURI == UNDEF || ((ns = node.namespaceURI) === null || ns == "http://www.w3.org/1999/xhtml");
    }

    function parentElement(node) {
        var parent = node.parentNode;
        return (parent.nodeType == 1) ? parent : null;
    }

    function getNodeIndex(node) {
        var i = 0;
        while( (node = node.previousSibling) ) {
            i++;
        }
        return i;
    }

    function getNodeLength(node) {
        switch (node.nodeType) {
            case 7:
            case 10:
                return 0;
            case 3:
            case 8:
                return node.length;
            default:
                return node.childNodes.length;
        }
    }

    function getCommonAncestor(node1, node2) {
        var ancestors = [], n;
        for (n = node1; n; n = n.parentNode) {
            ancestors.push(n);
        }

        for (n = node2; n; n = n.parentNode) {
            if (arrayContains(ancestors, n)) {
                return n;
            }
        }

        return null;
    }

    function isAncestorOf(ancestor, descendant, selfIsAncestor) {
        var n = selfIsAncestor ? descendant : descendant.parentNode;
        while (n) {
            if (n === ancestor) {
                return true;
            } else {
                n = n.parentNode;
            }
        }
        return false;
    }

    function isOrIsAncestorOf(ancestor, descendant) {
        return isAncestorOf(ancestor, descendant, true);
    }

    function getClosestAncestorIn(node, ancestor, selfIsAncestor) {
        var p, n = selfIsAncestor ? node : node.parentNode;
        while (n) {
            p = n.parentNode;
            if (p === ancestor) {
                return n;
            }
            n = p;
        }
        return null;
    }

    function isCharacterDataNode(node) {
        var t = node.nodeType;
        return t == 3 || t == 4 || t == 8 ; // Text, CDataSection or Comment
    }

    function isTextOrCommentNode(node) {
        if (!node) {
            return false;
        }
        var t = node.nodeType;
        return t == 3 || t == 8 ; // Text or Comment
    }

    function insertAfter(node, precedingNode) {
        var nextNode = precedingNode.nextSibling, parent = precedingNode.parentNode;
        if (nextNode) {
            parent.insertBefore(node, nextNode);
        } else {
            parent.appendChild(node);
        }
        return node;
    }

    // Note that we cannot use splitText() because it is bugridden in IE 9.
    function splitDataNode(node, index, positionsToPreserve) {
        var newNode = node.cloneNode(false);
        newNode.deleteData(0, index);
        node.deleteData(index, node.length - index);
        insertAfter(newNode, node);

        // Preserve positions
        if (positionsToPreserve) {
            for (var i = 0, position; position = positionsToPreserve[i++]; ) {
                // Handle case where position was inside the portion of node after the split point
                if (position.node == node && position.offset > index) {
                    position.node = newNode;
                    position.offset -= index;
                }
                // Handle the case where the position is a node offset within node's parent
                else if (position.node == node.parentNode && position.offset > getNodeIndex(node)) {
                    ++position.offset;
                }
            }
        }
        return newNode;
    }

    function getDocument(node) {
        if (node.nodeType == 9) {
            return node;
        } else if (typeof node.ownerDocument != UNDEF) {
            return node.ownerDocument;
        } else if (typeof node.document != UNDEF) {
            return node.document;
        } else if (node.parentNode) {
            return getDocument(node.parentNode);
        } else {
            throw module.createError("getDocument: no document found for node");
        }
    }

    function getWindow(node) {
        var doc = getDocument(node);
        if (typeof doc.defaultView != UNDEF) {
            return doc.defaultView;
        } else if (typeof doc.parentWindow != UNDEF) {
            return doc.parentWindow;
        } else {
            throw module.createError("Cannot get a window object for node");
        }
    }

    function getIframeDocument(iframeEl) {
        if (typeof iframeEl.contentDocument != UNDEF) {
            return iframeEl.contentDocument;
        } else if (typeof iframeEl.contentWindow != UNDEF) {
            return iframeEl.contentWindow.document;
        } else {
            throw module.createError("getIframeDocument: No Document object found for iframe element");
        }
    }

    function getIframeWindow(iframeEl) {
        if (typeof iframeEl.contentWindow != UNDEF) {
            return iframeEl.contentWindow;
        } else if (typeof iframeEl.contentDocument != UNDEF) {
            return iframeEl.contentDocument.defaultView;
        } else {
            throw module.createError("getIframeWindow: No Window object found for iframe element");
        }
    }

    function getBody(doc) {
        return util.isHostObject(doc, "body") ? doc.body : doc.getElementsByTagName("body")[0];
    }

    function isWindow(obj) {
        return obj && util.isHostMethod(obj, "setTimeout") && util.isHostObject(obj, "document");
    }

    function getContentDocument(obj) {
        var doc;

        if (!obj) {
            doc = document;
        }

        // Test if a DOM node has been passed and obtain a document object for it if so
        else if (util.isHostProperty(obj, "nodeType")) {
            doc = (obj.nodeType == 1 && obj.tagName.toLowerCase() == "iframe")
                ? getIframeDocument(obj) : getDocument(obj);
        }

        // Test if the doc parameter appears to be a Window object
        else if (isWindow(obj)) {
            doc = obj.document;
        }

        return doc;
    }

    function getRootContainer(node) {
        var parent;
        while ( (parent = node.parentNode) ) {
            node = parent;
        }
        return node;
    }

    function comparePoints(nodeA, offsetA, nodeB, offsetB) {
        // See http://www.w3.org/TR/DOM-Level-2-Traversal-Range/ranges.html#Level-2-Range-Comparing
        var nodeC, root, childA, childB, n;
        if (nodeA == nodeB) {
            // Case 1: nodes are the same
            return offsetA === offsetB ? 0 : (offsetA < offsetB) ? -1 : 1;
        } else if ( (nodeC = getClosestAncestorIn(nodeB, nodeA, true)) ) {
            // Case 2: node C (container B or an ancestor) is a child node of A
            return offsetA <= getNodeIndex(nodeC) ? -1 : 1;
        } else if ( (nodeC = getClosestAncestorIn(nodeA, nodeB, true)) ) {
            // Case 3: node C (container A or an ancestor) is a child node of B
            return getNodeIndex(nodeC) < offsetB  ? -1 : 1;
        } else {
            // Case 4: containers are siblings or descendants of siblings
            root = getCommonAncestor(nodeA, nodeB);
            childA = (nodeA === root) ? root : getClosestAncestorIn(nodeA, root, true);
            childB = (nodeB === root) ? root : getClosestAncestorIn(nodeB, root, true);

            if (childA === childB) {
                // This shouldn't be possible
                throw module.createError("comparePoints got to case 4 and childA and childB are the same!");
            } else {
                n = root.firstChild;
                while (n) {
                    if (n === childA) {
                        return -1;
                    } else if (n === childB) {
                        return 1;
                    }
                    n = n.nextSibling;
                }
            }
        }
    }

    function inspectNode(node) {
        if (!node) {
            return "[No node]";
        }
        if (isCharacterDataNode(node)) {
            return '"' + node.data + '"';
        } else if (node.nodeType == 1) {
            var idAttr = node.id ? ' id="' + node.id + '"' : "";
            return "<" + node.nodeName + idAttr + ">[" + node.childNodes.length + "]";
        } else {
            return node.nodeName;
        }
    }

    function fragmentFromNodeChildren(node) {
        var fragment = getDocument(node).createDocumentFragment(), child;
        while ( (child = node.firstChild) ) {
            fragment.appendChild(child);
        }
        return fragment;
    }

    function NodeIterator(root) {
        this.root = root;
        this._next = root;
    }

    NodeIterator.prototype = {
        _current: null,

        hasNext: function() {
            return !!this._next;
        },

        next: function() {
            var n = this._current = this._next;
            var child, next;
            if (this._current) {
                child = n.firstChild;
                if (child) {
                    this._next = child;
                } else {
                    next = null;
                    while ((n !== this.root) && !(next = n.nextSibling)) {
                        n = n.parentNode;
                    }
                    this._next = next;
                }
            }
            return this._current;
        },

        detach: function() {
            this._current = this._next = this.root = null;
        }
    };

    function createIterator(root) {
        return new NodeIterator(root);
    }

    function DomPosition(node, offset) {
        this.node = node;
        this.offset = offset;
    }

    DomPosition.prototype = {
        equals: function(pos) {
            return !!pos && this.node === pos.node && this.offset == pos.offset;
        },

        inspect: function() {
            return "[DomPosition(" + inspectNode(this.node) + ":" + this.offset + ")]";
        },

        toString: function() {
            return this.inspect();
        }
    };

    function DOMException(codeName) {
        this.code = this[codeName];
        this.codeName = codeName;
        this.message = "DOMException: " + this.codeName;
    }

    DOMException.prototype = {
        INDEX_SIZE_ERR: 1,
        HIERARCHY_REQUEST_ERR: 3,
        WRONG_DOCUMENT_ERR: 4,
        NO_MODIFICATION_ALLOWED_ERR: 7,
        NOT_FOUND_ERR: 8,
        NOT_SUPPORTED_ERR: 9,
        INVALID_STATE_ERR: 11
    };

    DOMException.prototype.toString = function() {
        return this.message;
    };

    api.dom = {
        arrayContains: arrayContains,
        isHtmlNamespace: isHtmlNamespace,
        parentElement: parentElement,
        getNodeIndex: getNodeIndex,
        getNodeLength: getNodeLength,
        getCommonAncestor: getCommonAncestor,
        isAncestorOf: isAncestorOf,
        isOrIsAncestorOf: isOrIsAncestorOf,
        getClosestAncestorIn: getClosestAncestorIn,
        isCharacterDataNode: isCharacterDataNode,
        isTextOrCommentNode: isTextOrCommentNode,
        insertAfter: insertAfter,
        splitDataNode: splitDataNode,
        getDocument: getDocument,
        getWindow: getWindow,
        getIframeWindow: getIframeWindow,
        getIframeDocument: getIframeDocument,
        getBody: getBody,
        isWindow: isWindow,
        getContentDocument: getContentDocument,
        getRootContainer: getRootContainer,
        comparePoints: comparePoints,
        inspectNode: inspectNode,
        fragmentFromNodeChildren: fragmentFromNodeChildren,
        createIterator: createIterator,
        DomPosition: DomPosition
    };

    api.DOMException = DOMException;
});
rangy.createModule("DomRange", function(api, module) {
    api.requireModules( ["DomUtil"] );

    var dom = api.dom;
    var util = api.util;
    var DomPosition = dom.DomPosition;
    var DOMException = api.DOMException;

    /*----------------------------------------------------------------------------------------------------------------*/

    // Utility functions

    function isNonTextPartiallySelected(node, range) {
        return (node.nodeType != 3) &&
               (dom.isOrIsAncestorOf(node, range.startContainer) || dom.isOrIsAncestorOf(node, range.endContainer));
    }

    function getRangeDocument(range) {
        return dom.getDocument(range.startContainer);
    }

    function getBoundaryBeforeNode(node) {
        return new DomPosition(node.parentNode, dom.getNodeIndex(node));
    }

    function getBoundaryAfterNode(node) {
        return new DomPosition(node.parentNode, dom.getNodeIndex(node) + 1);
    }

    function insertNodeAtPosition(node, n, o) {
        var firstNodeInserted = node.nodeType == 11 ? node.firstChild : node;
        if (dom.isCharacterDataNode(n)) {
            if (o == n.length) {
                dom.insertAfter(node, n);
            } else {
                n.parentNode.insertBefore(node, o == 0 ? n : dom.splitDataNode(n, o));
            }
        } else if (o >= n.childNodes.length) {
            n.appendChild(node);
        } else {
            n.insertBefore(node, n.childNodes[o]);
        }
        return firstNodeInserted;
    }

    function rangesIntersect(rangeA, rangeB, touchingIsIntersecting) {
        assertRangeValid(rangeA);
        assertRangeValid(rangeB);

        if (getRangeDocument(rangeB) != getRangeDocument(rangeA)) {
            throw new DOMException("WRONG_DOCUMENT_ERR");
        }

        var startComparison = dom.comparePoints(rangeA.startContainer, rangeA.startOffset, rangeB.endContainer, rangeB.endOffset),
            endComparison = dom.comparePoints(rangeA.endContainer, rangeA.endOffset, rangeB.startContainer, rangeB.startOffset);

        return touchingIsIntersecting ? startComparison <= 0 && endComparison >= 0 : startComparison < 0 && endComparison > 0;
    }

    function cloneSubtree(iterator) {
        var partiallySelected;
        for (var node, frag = getRangeDocument(iterator.range).createDocumentFragment(), subIterator; node = iterator.next(); ) {
            partiallySelected = iterator.isPartiallySelectedSubtree();
            node = node.cloneNode(!partiallySelected);
            if (partiallySelected) {
                subIterator = iterator.getSubtreeIterator();
                node.appendChild(cloneSubtree(subIterator));
                subIterator.detach(true);
            }

            if (node.nodeType == 10) { // DocumentType
                throw new DOMException("HIERARCHY_REQUEST_ERR");
            }
            frag.appendChild(node);
        }
        return frag;
    }

    function iterateSubtree(rangeIterator, func, iteratorState) {
        var it, n;
        iteratorState = iteratorState || { stop: false };
        for (var node, subRangeIterator; node = rangeIterator.next(); ) {
            if (rangeIterator.isPartiallySelectedSubtree()) {
                if (func(node) === false) {
                    iteratorState.stop = true;
                    return;
                } else {
                    // The node is partially selected by the Range, so we can use a new RangeIterator on the portion of
                    // the node selected by the Range.
                    subRangeIterator = rangeIterator.getSubtreeIterator();
                    iterateSubtree(subRangeIterator, func, iteratorState);
                    subRangeIterator.detach(true);
                    if (iteratorState.stop) {
                        return;
                    }
                }
            } else {
                // The whole node is selected, so we can use efficient DOM iteration to iterate over the node and its
                // descendants
                it = dom.createIterator(node);
                while ( (n = it.next()) ) {
                    if (func(n) === false) {
                        iteratorState.stop = true;
                        return;
                    }
                }
            }
        }
    }

    function deleteSubtree(iterator) {
        var subIterator;
        while (iterator.next()) {
            if (iterator.isPartiallySelectedSubtree()) {
                subIterator = iterator.getSubtreeIterator();
                deleteSubtree(subIterator);
                subIterator.detach(true);
            } else {
                iterator.remove();
            }
        }
    }

    function extractSubtree(iterator) {
        for (var node, frag = getRangeDocument(iterator.range).createDocumentFragment(), subIterator; node = iterator.next(); ) {

            if (iterator.isPartiallySelectedSubtree()) {
                node = node.cloneNode(false);
                subIterator = iterator.getSubtreeIterator();
                node.appendChild(extractSubtree(subIterator));
                subIterator.detach(true);
            } else {
                iterator.remove();
            }
            if (node.nodeType == 10) { // DocumentType
                throw new DOMException("HIERARCHY_REQUEST_ERR");
            }
            frag.appendChild(node);
        }
        return frag;
    }

    function getNodesInRange(range, nodeTypes, filter) {
        var filterNodeTypes = !!(nodeTypes && nodeTypes.length), regex;
        var filterExists = !!filter;
        if (filterNodeTypes) {
            regex = new RegExp("^(" + nodeTypes.join("|") + ")$");
        }

        var nodes = [];
        iterateSubtree(new RangeIterator(range, false), function(node) {
            if ((!filterNodeTypes || regex.test(node.nodeType)) && (!filterExists || filter(node))) {
                nodes.push(node);
            }
        });
        return nodes;
    }

    function inspect(range) {
        var name = (typeof range.getName == "undefined") ? "Range" : range.getName();
        return "[" + name + "(" + dom.inspectNode(range.startContainer) + ":" + range.startOffset + ", " +
                dom.inspectNode(range.endContainer) + ":" + range.endOffset + ")]";
    }

    /*----------------------------------------------------------------------------------------------------------------*/

    // RangeIterator code partially borrows from IERange by Tim Ryan (http://github.com/timcameronryan/IERange)

    function RangeIterator(range, clonePartiallySelectedTextNodes) {
        this.range = range;
        this.clonePartiallySelectedTextNodes = clonePartiallySelectedTextNodes;


        if (!range.collapsed) {
            this.sc = range.startContainer;
            this.so = range.startOffset;
            this.ec = range.endContainer;
            this.eo = range.endOffset;
            var root = range.commonAncestorContainer;

            if (this.sc === this.ec && dom.isCharacterDataNode(this.sc)) {
                this.isSingleCharacterDataNode = true;
                this._first = this._last = this._next = this.sc;
            } else {
                this._first = this._next = (this.sc === root && !dom.isCharacterDataNode(this.sc)) ?
                    this.sc.childNodes[this.so] : dom.getClosestAncestorIn(this.sc, root, true);
                this._last = (this.ec === root && !dom.isCharacterDataNode(this.ec)) ?
                    this.ec.childNodes[this.eo - 1] : dom.getClosestAncestorIn(this.ec, root, true);
            }
        }
    }

    RangeIterator.prototype = {
        _current: null,
        _next: null,
        _first: null,
        _last: null,
        isSingleCharacterDataNode: false,

        reset: function() {
            this._current = null;
            this._next = this._first;
        },

        hasNext: function() {
            return !!this._next;
        },

        next: function() {
            // Move to next node
            var current = this._current = this._next;
            if (current) {
                this._next = (current !== this._last) ? current.nextSibling : null;

                // Check for partially selected text nodes
                if (dom.isCharacterDataNode(current) && this.clonePartiallySelectedTextNodes) {
                    if (current === this.ec) {
                        (current = current.cloneNode(true)).deleteData(this.eo, current.length - this.eo);
                    }
                    if (this._current === this.sc) {
                        (current = current.cloneNode(true)).deleteData(0, this.so);
                    }
                }
            }

            return current;
        },

        remove: function() {
            var current = this._current, start, end;

            if (dom.isCharacterDataNode(current) && (current === this.sc || current === this.ec)) {
                start = (current === this.sc) ? this.so : 0;
                end = (current === this.ec) ? this.eo : current.length;
                if (start != end) {
                    current.deleteData(start, end - start);
                }
            } else {
                if (current.parentNode) {
                    current.parentNode.removeChild(current);
                } else {
                }
            }
        },

        // Checks if the current node is partially selected
        isPartiallySelectedSubtree: function() {
            var current = this._current;
            return isNonTextPartiallySelected(current, this.range);
        },

        getSubtreeIterator: function() {
            var subRange;
            if (this.isSingleCharacterDataNode) {
                subRange = this.range.cloneRange();
                subRange.collapse(false);
            } else {
                subRange = new Range(getRangeDocument(this.range));
                var current = this._current;
                var startContainer = current, startOffset = 0, endContainer = current, endOffset = dom.getNodeLength(current);

                if (dom.isOrIsAncestorOf(current, this.sc)) {
                    startContainer = this.sc;
                    startOffset = this.so;
                }
                if (dom.isOrIsAncestorOf(current, this.ec)) {
                    endContainer = this.ec;
                    endOffset = this.eo;
                }

                updateBoundaries(subRange, startContainer, startOffset, endContainer, endOffset);
            }
            return new RangeIterator(subRange, this.clonePartiallySelectedTextNodes);
        },

        detach: function(detachRange) {
            if (detachRange) {
                this.range.detach();
            }
            this.range = this._current = this._next = this._first = this._last = this.sc = this.so = this.ec = this.eo = null;
        }
    };

    /*----------------------------------------------------------------------------------------------------------------*/

    // Exceptions

    function RangeException(codeName) {
        this.code = this[codeName];
        this.codeName = codeName;
        this.message = "RangeException: " + this.codeName;
    }

    RangeException.prototype = {
        BAD_BOUNDARYPOINTS_ERR: 1,
        INVALID_NODE_TYPE_ERR: 2
    };

    RangeException.prototype.toString = function() {
        return this.message;
    };

    /*----------------------------------------------------------------------------------------------------------------*/

    var beforeAfterNodeTypes = [1, 3, 4, 5, 7, 8, 10];
    var rootContainerNodeTypes = [2, 9, 11];
    var readonlyNodeTypes = [5, 6, 10, 12];
    var insertableNodeTypes = [1, 3, 4, 5, 7, 8, 10, 11];
    var surroundNodeTypes = [1, 3, 4, 5, 7, 8];

    function createAncestorFinder(nodeTypes) {
        return function(node, selfIsAncestor) {
            var t, n = selfIsAncestor ? node : node.parentNode;
            while (n) {
                t = n.nodeType;
                if (dom.arrayContains(nodeTypes, t)) {
                    return n;
                }
                n = n.parentNode;
            }
            return null;
        };
    }

    var getRootContainer = dom.getRootContainer;
    var getDocumentOrFragmentContainer = createAncestorFinder( [9, 11] );
    var getReadonlyAncestor = createAncestorFinder(readonlyNodeTypes);
    var getDocTypeNotationEntityAncestor = createAncestorFinder( [6, 10, 12] );

    function assertNoDocTypeNotationEntityAncestor(node, allowSelf) {
        if (getDocTypeNotationEntityAncestor(node, allowSelf)) {
            throw new RangeException("INVALID_NODE_TYPE_ERR");
        }
    }

    function assertNotDetached(range) {
        if (!range.startContainer) {
            throw new DOMException("INVALID_STATE_ERR");
        }
    }

    function assertValidNodeType(node, invalidTypes) {
        if (!dom.arrayContains(invalidTypes, node.nodeType)) {
            throw new RangeException("INVALID_NODE_TYPE_ERR");
        }
    }

    function assertValidOffset(node, offset) {
        if (offset < 0 || offset > (dom.isCharacterDataNode(node) ? node.length : node.childNodes.length)) {
            throw new DOMException("INDEX_SIZE_ERR");
        }
    }

    function assertSameDocumentOrFragment(node1, node2) {
        if (getDocumentOrFragmentContainer(node1, true) !== getDocumentOrFragmentContainer(node2, true)) {
            throw new DOMException("WRONG_DOCUMENT_ERR");
        }
    }

    function assertNodeNotReadOnly(node) {
        if (getReadonlyAncestor(node, true)) {
            throw new DOMException("NO_MODIFICATION_ALLOWED_ERR");
        }
    }

    function assertNode(node, codeName) {
        if (!node) {
            throw new DOMException(codeName);
        }
    }

    function isOrphan(node) {
        return !dom.arrayContains(rootContainerNodeTypes, node.nodeType) && !getDocumentOrFragmentContainer(node, true);
    }

    function isValidOffset(node, offset) {
        return offset <= (dom.isCharacterDataNode(node) ? node.length : node.childNodes.length);
    }

    function isRangeValid(range) {
        return (!!range.startContainer && !!range.endContainer
                && !isOrphan(range.startContainer)
                && !isOrphan(range.endContainer)
                && isValidOffset(range.startContainer, range.startOffset)
                && isValidOffset(range.endContainer, range.endOffset));
    }

    function assertRangeValid(range) {
        assertNotDetached(range);
        if (!isRangeValid(range)) {
            throw new Error("Range error: Range is no longer valid after DOM mutation (" + range.inspect() + ")");
        }
    }

    /*----------------------------------------------------------------------------------------------------------------*/

    // Test the browser's innerHTML support to decide how to implement createContextualFragment
    var styleEl = document.createElement("style");
    var htmlParsingConforms = false;
    try {
        styleEl.innerHTML = "<b>x</b>";
        htmlParsingConforms = (styleEl.firstChild.nodeType == 3); // Opera incorrectly creates an element node
    } catch (e) {
        // IE 6 and 7 throw
    }

    api.features.htmlParsingConforms = htmlParsingConforms;

    var createContextualFragment = htmlParsingConforms ?

        // Implementation as per HTML parsing spec, trusting in the browser's implementation of innerHTML. See
        // discussion and base code for this implementation at issue 67.
        // Spec: http://html5.org/specs/dom-parsing.html#extensions-to-the-range-interface
        // Thanks to Aleks Williams.
        function(fragmentStr) {
            // "Let node the context object's start's node."
            var node = this.startContainer;
            var doc = dom.getDocument(node);

            // "If the context object's start's node is null, raise an INVALID_STATE_ERR
            // exception and abort these steps."
            if (!node) {
                throw new DOMException("INVALID_STATE_ERR");
            }

            // "Let element be as follows, depending on node's interface:"
            // Document, Document Fragment: null
            var el = null;

            // "Element: node"
            if (node.nodeType == 1) {
                el = node;

            // "Text, Comment: node's parentElement"
            } else if (dom.isCharacterDataNode(node)) {
                el = dom.parentElement(node);
            }

            // "If either element is null or element's ownerDocument is an HTML document
            // and element's local name is "html" and element's namespace is the HTML
            // namespace"
            if (el === null || (
                el.nodeName == "HTML"
                && dom.isHtmlNamespace(dom.getDocument(el).documentElement)
                && dom.isHtmlNamespace(el)
            )) {

            // "let element be a new Element with "body" as its local name and the HTML
            // namespace as its namespace.""
                el = doc.createElement("body");
            } else {
                el = el.cloneNode(false);
            }

            // "If the node's document is an HTML document: Invoke the HTML fragment parsing algorithm."
            // "If the node's document is an XML document: Invoke the XML fragment parsing algorithm."
            // "In either case, the algorithm must be invoked with fragment as the input
            // and element as the context element."
            el.innerHTML = fragmentStr;

            // "If this raises an exception, then abort these steps. Otherwise, let new
            // children be the nodes returned."

            // "Let fragment be a new DocumentFragment."
            // "Append all new children to fragment."
            // "Return fragment."
            return dom.fragmentFromNodeChildren(el);
        } :

        // In this case, innerHTML cannot be trusted, so fall back to a simpler, non-conformant implementation that
        // previous versions of Rangy used (with the exception of using a body element rather than a div)
        function(fragmentStr) {
            assertNotDetached(this);
            var doc = getRangeDocument(this);
            var el = doc.createElement("body");
            el.innerHTML = fragmentStr;

            return dom.fragmentFromNodeChildren(el);
        };

    function splitRangeBoundaries(range, positionsToPreserve) {
        assertRangeValid(range);

        var sc = range.startContainer, so = range.startOffset, ec = range.endContainer, eo = range.endOffset;
        var startEndSame = (sc === ec);

        if (dom.isCharacterDataNode(ec) && eo > 0 && eo < ec.length) {
            dom.splitDataNode(ec, eo, positionsToPreserve);
        }

        if (dom.isCharacterDataNode(sc) && so > 0 && so < sc.length) {
            sc = dom.splitDataNode(sc, so, positionsToPreserve);
            if (startEndSame) {
                eo -= so;
                ec = sc;
            } else if (ec == sc.parentNode && eo >= dom.getNodeIndex(sc)) {
                eo++;
            }
            so = 0;
        }
        range.setStartAndEnd(sc, so, ec, eo);
    }

    /*----------------------------------------------------------------------------------------------------------------*/

    var rangeProperties = ["startContainer", "startOffset", "endContainer", "endOffset", "collapsed",
        "commonAncestorContainer"];

    var s2s = 0, s2e = 1, e2e = 2, e2s = 3;
    var n_b = 0, n_a = 1, n_b_a = 2, n_i = 3;

    function RangePrototype() {}

    RangePrototype.prototype = {
        compareBoundaryPoints: function(how, range) {
            assertRangeValid(this);
            assertSameDocumentOrFragment(this.startContainer, range.startContainer);

            var nodeA, offsetA, nodeB, offsetB;
            var prefixA = (how == e2s || how == s2s) ? "start" : "end";
            var prefixB = (how == s2e || how == s2s) ? "start" : "end";
            nodeA = this[prefixA + "Container"];
            offsetA = this[prefixA + "Offset"];
            nodeB = range[prefixB + "Container"];
            offsetB = range[prefixB + "Offset"];
            return dom.comparePoints(nodeA, offsetA, nodeB, offsetB);
        },

        insertNode: function(node) {
            assertRangeValid(this);
            assertValidNodeType(node, insertableNodeTypes);
            assertNodeNotReadOnly(this.startContainer);

            if (dom.isOrIsAncestorOf(node, this.startContainer)) {
                throw new DOMException("HIERARCHY_REQUEST_ERR");
            }

            // No check for whether the container of the start of the Range is of a type that does not allow
            // children of the type of node: the browser's DOM implementation should do this for us when we attempt
            // to add the node

            var firstNodeInserted = insertNodeAtPosition(node, this.startContainer, this.startOffset);
            this.setStartBefore(firstNodeInserted);
        },

        cloneContents: function() {
            assertRangeValid(this);

            var clone, frag;
            if (this.collapsed) {
                return getRangeDocument(this).createDocumentFragment();
            } else {
                if (this.startContainer === this.endContainer && dom.isCharacterDataNode(this.startContainer)) {
                    clone = this.startContainer.cloneNode(true);
                    clone.data = clone.data.slice(this.startOffset, this.endOffset);
                    frag = getRangeDocument(this).createDocumentFragment();
                    frag.appendChild(clone);
                    return frag;
                } else {
                    var iterator = new RangeIterator(this, true);
                    clone = cloneSubtree(iterator);
                    iterator.detach();
                }
                return clone;
            }
        },

        canSurroundContents: function() {
            assertRangeValid(this);
            assertNodeNotReadOnly(this.startContainer);
            assertNodeNotReadOnly(this.endContainer);

            // Check if the contents can be surrounded. Specifically, this means whether the range partially selects
            // no non-text nodes.
            var iterator = new RangeIterator(this, true);
            var boundariesInvalid = (iterator._first && (isNonTextPartiallySelected(iterator._first, this)) ||
                    (iterator._last && isNonTextPartiallySelected(iterator._last, this)));
            iterator.detach();
            return !boundariesInvalid;
        },

        surroundContents: function(node) {
            assertValidNodeType(node, surroundNodeTypes);

            if (!this.canSurroundContents()) {
                throw new RangeException("BAD_BOUNDARYPOINTS_ERR");
            }

            // Extract the contents
            var content = this.extractContents();

            // Clear the children of the node
            if (node.hasChildNodes()) {
                while (node.lastChild) {
                    node.removeChild(node.lastChild);
                }
            }

            // Insert the new node and add the extracted contents
            insertNodeAtPosition(node, this.startContainer, this.startOffset);
            node.appendChild(content);

            this.selectNode(node);
        },

        cloneRange: function() {
            assertRangeValid(this);
            var range = new Range(getRangeDocument(this));
            var i = rangeProperties.length, prop;
            while (i--) {
                prop = rangeProperties[i];
                range[prop] = this[prop];
            }
            return range;
        },

        toString: function() {
            assertRangeValid(this);
            var sc = this.startContainer;
            if (sc === this.endContainer && dom.isCharacterDataNode(sc)) {
                return (sc.nodeType == 3 || sc.nodeType == 4) ? sc.data.slice(this.startOffset, this.endOffset) : "";
            } else {
                var textBits = [], iterator = new RangeIterator(this, true);
                iterateSubtree(iterator, function(node) {
                    // Accept only text or CDATA nodes, not comments
                    if (node.nodeType == 3 || node.nodeType == 4) {
                        textBits.push(node.data);
                    }
                });
                iterator.detach();
                return textBits.join("");
            }
        },

        // The methods below are all non-standard. The following batch were introduced by Mozilla but have since
        // been removed from Mozilla.

        compareNode: function(node) {
            assertRangeValid(this);

            var parent = node.parentNode;
            var nodeIndex = dom.getNodeIndex(node);

            if (!parent) {
                throw new DOMException("NOT_FOUND_ERR");
            }

            var startComparison = this.comparePoint(parent, nodeIndex),
                endComparison = this.comparePoint(parent, nodeIndex + 1);

            if (startComparison < 0) { // Node starts before
                return (endComparison > 0) ? n_b_a : n_b;
            } else {
                return (endComparison > 0) ? n_a : n_i;
            }
        },

        comparePoint: function(node, offset) {
            assertRangeValid(this);
            assertNode(node, "HIERARCHY_REQUEST_ERR");
            assertSameDocumentOrFragment(node, this.startContainer);

            if (dom.comparePoints(node, offset, this.startContainer, this.startOffset) < 0) {
                return -1;
            } else if (dom.comparePoints(node, offset, this.endContainer, this.endOffset) > 0) {
                return 1;
            }
            return 0;
        },

        createContextualFragment: createContextualFragment,

        toHtml: function() {
            assertRangeValid(this);
            var container = this.commonAncestorContainer.parentNode.cloneNode(false);
            container.appendChild(this.cloneContents());
            return container.innerHTML;
        },

        // touchingIsIntersecting determines whether this method considers a node that borders a range intersects
        // with it (as in WebKit) or not (as in Gecko pre-1.9, and the default)
        intersectsNode: function(node, touchingIsIntersecting) {
            assertRangeValid(this);
            assertNode(node, "NOT_FOUND_ERR");
            if (dom.getDocument(node) !== getRangeDocument(this)) {
                return false;
            }

            var parent = node.parentNode, offset = dom.getNodeIndex(node);
            assertNode(parent, "NOT_FOUND_ERR");

            var startComparison = dom.comparePoints(parent, offset, this.endContainer, this.endOffset),
                endComparison = dom.comparePoints(parent, offset + 1, this.startContainer, this.startOffset);

            return touchingIsIntersecting ? startComparison <= 0 && endComparison >= 0 : startComparison < 0 && endComparison > 0;
        },

        isPointInRange: function(node, offset) {
            assertRangeValid(this);
            assertNode(node, "HIERARCHY_REQUEST_ERR");
            assertSameDocumentOrFragment(node, this.startContainer);

            return (dom.comparePoints(node, offset, this.startContainer, this.startOffset) >= 0) &&
                   (dom.comparePoints(node, offset, this.endContainer, this.endOffset) <= 0);
        },

        // The methods below are non-standard and invented by me.

        // Sharing a boundary start-to-end or end-to-start does not count as intersection.
        intersectsRange: function(range) {
            return rangesIntersect(this, range, false);
        },

        // Sharing a boundary start-to-end or end-to-start does count as intersection.
        intersectsOrTouchesRange: function(range) {
            return rangesIntersect(this, range, true);
        },

        intersection: function(range) {
            if (this.intersectsRange(range)) {
                var startComparison = dom.comparePoints(this.startContainer, this.startOffset, range.startContainer, range.startOffset),
                    endComparison = dom.comparePoints(this.endContainer, this.endOffset, range.endContainer, range.endOffset);

                var intersectionRange = this.cloneRange();
                if (startComparison == -1) {
                    intersectionRange.setStart(range.startContainer, range.startOffset);
                }
                if (endComparison == 1) {
                    intersectionRange.setEnd(range.endContainer, range.endOffset);
                }
                return intersectionRange;
            }
            return null;
        },

        union: function(range) {
            if (this.intersectsOrTouchesRange(range)) {
                var unionRange = this.cloneRange();
                if (dom.comparePoints(range.startContainer, range.startOffset, this.startContainer, this.startOffset) == -1) {
                    unionRange.setStart(range.startContainer, range.startOffset);
                }
                if (dom.comparePoints(range.endContainer, range.endOffset, this.endContainer, this.endOffset) == 1) {
                    unionRange.setEnd(range.endContainer, range.endOffset);
                }
                return unionRange;
            } else {
                throw new RangeException("Ranges do not intersect");
            }
        },

        containsNode: function(node, allowPartial) {
            if (allowPartial) {
                return this.intersectsNode(node, false);
            } else {
                return this.compareNode(node) == n_i;
            }
        },

        containsNodeContents: function(node) {
            return this.comparePoint(node, 0) >= 0 && this.comparePoint(node, dom.getNodeLength(node)) <= 0;
        },

        containsRange: function(range) {
            var intersection = this.intersection(range);
            return intersection !== null && range.equals(intersection);
        },

        containsNodeText: function(node) {
            var nodeRange = this.cloneRange();
            nodeRange.selectNode(node);
            var textNodes = nodeRange.getNodes([3]);
            if (textNodes.length > 0) {
                nodeRange.setStart(textNodes[0], 0);
                var lastTextNode = textNodes.pop();
                nodeRange.setEnd(lastTextNode, lastTextNode.length);
                var contains = this.containsRange(nodeRange);
                nodeRange.detach();
                return contains;
            } else {
                return this.containsNodeContents(node);
            }
        },

        getNodes: function(nodeTypes, filter) {
            assertRangeValid(this);
            return getNodesInRange(this, nodeTypes, filter);
        },

        getDocument: function() {
            return getRangeDocument(this);
        },

        collapseBefore: function(node) {
            assertNotDetached(this);

            this.setEndBefore(node);
            this.collapse(false);
        },

        collapseAfter: function(node) {
            assertNotDetached(this);

            this.setStartAfter(node);
            this.collapse(true);
        },

        getName: function() {
            return "DomRange";
        },

        equals: function(range) {
            return Range.rangesEqual(this, range);
        },

        isValid: function() {
            return isRangeValid(this);
        },

        inspect: function() {
            return inspect(this);
        }
    };

    function copyComparisonConstantsToObject(obj) {
        obj.START_TO_START = s2s;
        obj.START_TO_END = s2e;
        obj.END_TO_END = e2e;
        obj.END_TO_START = e2s;

        obj.NODE_BEFORE = n_b;
        obj.NODE_AFTER = n_a;
        obj.NODE_BEFORE_AND_AFTER = n_b_a;
        obj.NODE_INSIDE = n_i;
    }

    function copyComparisonConstants(constructor) {
        copyComparisonConstantsToObject(constructor);
        copyComparisonConstantsToObject(constructor.prototype);
    }

    function createRangeContentRemover(remover, boundaryUpdater) {
        return function() {
            assertRangeValid(this);

            var sc = this.startContainer, so = this.startOffset, root = this.commonAncestorContainer;

            var iterator = new RangeIterator(this, true);

            // Work out where to position the range after content removal
            var node, boundary;
            if (sc !== root) {
                node = dom.getClosestAncestorIn(sc, root, true);
                boundary = getBoundaryAfterNode(node);
                sc = boundary.node;
                so = boundary.offset;
            }

            // Check none of the range is read-only
            iterateSubtree(iterator, assertNodeNotReadOnly);

            iterator.reset();

            // Remove the content
            var returnValue = remover(iterator);
            iterator.detach();

            // Move to the new position
            boundaryUpdater(this, sc, so, sc, so);

            return returnValue;
        };
    }

    function createPrototypeRange(constructor, boundaryUpdater, detacher) {
        function createBeforeAfterNodeSetter(isBefore, isStart) {
            return function(node) {
                assertNotDetached(this);
                assertValidNodeType(node, beforeAfterNodeTypes);
                assertValidNodeType(getRootContainer(node), rootContainerNodeTypes);

                var boundary = (isBefore ? getBoundaryBeforeNode : getBoundaryAfterNode)(node);
                (isStart ? setRangeStart : setRangeEnd)(this, boundary.node, boundary.offset);
            };
        }

        function setRangeStart(range, node, offset) {
            var ec = range.endContainer, eo = range.endOffset;
            if (node !== range.startContainer || offset !== range.startOffset) {
                // Check the root containers of the range and the new boundary, and also check whether the new boundary
                // is after the current end. In either case, collapse the range to the new position
                if (getRootContainer(node) != getRootContainer(ec) || dom.comparePoints(node, offset, ec, eo) == 1) {
                    ec = node;
                    eo = offset;
                }
                boundaryUpdater(range, node, offset, ec, eo);
            }
        }

        function setRangeEnd(range, node, offset) {
            var sc = range.startContainer, so = range.startOffset;
            if (node !== range.endContainer || offset !== range.endOffset) {
                // Check the root containers of the range and the new boundary, and also check whether the new boundary
                // is after the current end. In either case, collapse the range to the new position
                if (getRootContainer(node) != getRootContainer(sc) || dom.comparePoints(node, offset, sc, so) == -1) {
                    sc = node;
                    so = offset;
                }
                boundaryUpdater(range, sc, so, node, offset);
            }
        }

        constructor.prototype = new RangePrototype();

        util.extend(constructor.prototype, {
            setStart: function(node, offset) {
                assertNotDetached(this);
                assertNoDocTypeNotationEntityAncestor(node, true);
                assertValidOffset(node, offset);

                setRangeStart(this, node, offset);
            },

            setEnd: function(node, offset) {
                assertNotDetached(this);
                assertNoDocTypeNotationEntityAncestor(node, true);
                assertValidOffset(node, offset);

                setRangeEnd(this, node, offset);
            },

            /**
             * Convenience method to set a range's start and end boundaries. Overloaded as follows:
             * - Two parameters (node, offset) creates a collapsed range at that position
             * - three parameters (node, startOffset, endOffset) creates a range contained with node starting at
             *   startOffset and ending at endOffset
             * - Four parameters (startNode, startOffset, endNode, endOffset) creates a range starting at startOffset in
             *   startNode and ending at endOffset in endNode
             */
            setStartAndEnd: function() {
                assertNotDetached(this);

                var args = arguments;
                var sc = args[0], so = args[1], ec = sc, eo = so;

                switch (args.length) {
                    case 3:
                        eo = args[2];
                        break;
                    case 4:
                        ec = args[2];
                        eo = args[3];
                        break;
                }

                boundaryUpdater(this, sc, so, ec, eo);
            },

            setStartBefore: createBeforeAfterNodeSetter(true, true),
            setStartAfter: createBeforeAfterNodeSetter(false, true),
            setEndBefore: createBeforeAfterNodeSetter(true, false),
            setEndAfter: createBeforeAfterNodeSetter(false, false),

            collapse: function(isStart) {
                assertRangeValid(this);
                if (isStart) {
                    boundaryUpdater(this, this.startContainer, this.startOffset, this.startContainer, this.startOffset);
                } else {
                    boundaryUpdater(this, this.endContainer, this.endOffset, this.endContainer, this.endOffset);
                }
            },

            selectNodeContents: function(node) {
                assertNotDetached(this);
                assertNoDocTypeNotationEntityAncestor(node, true);

                boundaryUpdater(this, node, 0, node, dom.getNodeLength(node));
            },

            selectNode: function(node) {
                assertNotDetached(this);
                assertNoDocTypeNotationEntityAncestor(node, false);
                assertValidNodeType(node, beforeAfterNodeTypes);

                var start = getBoundaryBeforeNode(node), end = getBoundaryAfterNode(node);
                boundaryUpdater(this, start.node, start.offset, end.node, end.offset);
            },

            extractContents: createRangeContentRemover(extractSubtree, boundaryUpdater),

            deleteContents: createRangeContentRemover(deleteSubtree, boundaryUpdater),

            canSurroundContents: function() {
                assertRangeValid(this);
                assertNodeNotReadOnly(this.startContainer);
                assertNodeNotReadOnly(this.endContainer);

                // Check if the contents can be surrounded. Specifically, this means whether the range partially selects
                // no non-text nodes.
                var iterator = new RangeIterator(this, true);
                var boundariesInvalid = (iterator._first && (isNonTextPartiallySelected(iterator._first, this)) ||
                        (iterator._last && isNonTextPartiallySelected(iterator._last, this)));
                iterator.detach();
                return !boundariesInvalid;
            },

            detach: function() {
                detacher(this);
            },

            splitBoundaries: function() {
                splitRangeBoundaries(this);
            },

            splitBoundariesPreservingPositions: function(positionsToPreserve) {
                splitRangeBoundaries(this, positionsToPreserve);
            },

            normalizeBoundaries: function() {
                assertRangeValid(this);

                var sc = this.startContainer, so = this.startOffset, ec = this.endContainer, eo = this.endOffset;

                var mergeForward = function(node) {
                    var sibling = node.nextSibling;
                    if (sibling && sibling.nodeType == node.nodeType) {
                        ec = node;
                        eo = node.length;
                        node.appendData(sibling.data);
                        sibling.parentNode.removeChild(sibling);
                    }
                };

                var mergeBackward = function(node) {
                    var sibling = node.previousSibling;
                    if (sibling && sibling.nodeType == node.nodeType) {
                        sc = node;
                        var nodeLength = node.length;
                        so = sibling.length;
                        node.insertData(0, sibling.data);
                        sibling.parentNode.removeChild(sibling);
                        if (sc == ec) {
                            eo += so;
                            ec = sc;
                        } else if (ec == node.parentNode) {
                            var nodeIndex = dom.getNodeIndex(node);
                            if (eo == nodeIndex) {
                                ec = node;
                                eo = nodeLength;
                            } else if (eo > nodeIndex) {
                                eo--;
                            }
                        }
                    }
                };

                var normalizeStart = true;

                if (dom.isCharacterDataNode(ec)) {
                    if (ec.length == eo) {
                        mergeForward(ec);
                    }
                } else {
                    if (eo > 0) {
                        var endNode = ec.childNodes[eo - 1];
                        if (endNode && dom.isCharacterDataNode(endNode)) {
                            mergeForward(endNode);
                        }
                    }
                    normalizeStart = !this.collapsed;
                }

                if (normalizeStart) {
                    if (dom.isCharacterDataNode(sc)) {
                        if (so == 0) {
                            mergeBackward(sc);
                        }
                    } else {
                        if (so < sc.childNodes.length) {
                            var startNode = sc.childNodes[so];
                            if (startNode && dom.isCharacterDataNode(startNode)) {
                                mergeBackward(startNode);
                            }
                        }
                    }
                } else {
                    sc = ec;
                    so = eo;
                }

                boundaryUpdater(this, sc, so, ec, eo);
            },

            collapseToPoint: function(node, offset) {
                assertNotDetached(this);
                assertNoDocTypeNotationEntityAncestor(node, true);
                assertValidOffset(node, offset);
                this.setStartAndEnd(node, offset);
            }
        });

        copyComparisonConstants(constructor);
    }

    /*----------------------------------------------------------------------------------------------------------------*/

    // Updates commonAncestorContainer and collapsed after boundary change
    function updateCollapsedAndCommonAncestor(range) {
        range.collapsed = (range.startContainer === range.endContainer && range.startOffset === range.endOffset);
        range.commonAncestorContainer = range.collapsed ?
            range.startContainer : dom.getCommonAncestor(range.startContainer, range.endContainer);
    }

    function updateBoundaries(range, startContainer, startOffset, endContainer, endOffset) {
        range.startContainer = startContainer;
        range.startOffset = startOffset;
        range.endContainer = endContainer;
        range.endOffset = endOffset;

        updateCollapsedAndCommonAncestor(range);
    }

    function detach(range) {
        assertNotDetached(range);
        range.startContainer = range.startOffset = range.endContainer = range.endOffset = null;
        range.collapsed = range.commonAncestorContainer = null;
    }

    function Range(doc) {
        this.startContainer = doc;
        this.startOffset = 0;
        this.endContainer = doc;
        this.endOffset = 0;
        updateCollapsedAndCommonAncestor(this);
    }

    createPrototypeRange(Range, updateBoundaries, detach);

    api.rangePrototype = RangePrototype.prototype;

    util.extend(Range, {
        rangeProperties: rangeProperties,
        RangeIterator: RangeIterator,
        copyComparisonConstants: copyComparisonConstants,
        createPrototypeRange: createPrototypeRange,
        inspect: inspect,
        getRangeDocument: getRangeDocument,
        rangesEqual: function(r1, r2) {
            return r1.startContainer === r2.startContainer &&
                r1.startOffset === r2.startOffset &&
                r1.endContainer === r2.endContainer &&
                r1.endOffset === r2.endOffset;
        }
    });

    api.DomRange = Range;
    api.RangeException = RangeException;
});
rangy.createModule("WrappedRange", function(api, module) {
    api.requireModules( ["DomUtil", "DomRange"] );

    var WrappedRange;
    var dom = api.dom;
    var util = api.util;
    var DomPosition = dom.DomPosition;
    var DomRange = api.DomRange;


    function getDocument(doc, methodName) {
        doc = dom.getContentDocument(doc);
        if (!doc) {
            throw module.createError(methodName + "(): Parameter must be a Document or other DOM node, or a Window object");
        }
        return doc;
    }

    /*----------------------------------------------------------------------------------------------------------------*/

    /*
    This is a workaround for a bug where IE returns the wrong container element from the TextRange's parentElement()
    method. For example, in the following (where pipes denote the selection boundaries):

    <ul id="ul"><li id="a">| a </li><li id="b"> b |</li></ul>

    var range = document.selection.createRange();
    alert(range.parentElement().id); // Should alert "ul" but alerts "b"

    This method returns the common ancestor node of the following:
    - the parentElement() of the textRange
    - the parentElement() of the textRange after calling collapse(true)
    - the parentElement() of the textRange after calling collapse(false)
     */
    function getTextRangeContainerElement(textRange) {
        var parentEl = textRange.parentElement();
        var range = textRange.duplicate();
        range.collapse(true);
        var startEl = range.parentElement();
        range = textRange.duplicate();
        range.collapse(false);
        var endEl = range.parentElement();
        var startEndContainer = (startEl == endEl) ? startEl : dom.getCommonAncestor(startEl, endEl);

        return startEndContainer == parentEl ? startEndContainer : dom.getCommonAncestor(parentEl, startEndContainer);
    }

    function textRangeIsCollapsed(textRange) {
        return textRange.compareEndPoints("StartToEnd", textRange) == 0;
    }

    // Gets the boundary of a TextRange expressed as a node and an offset within that node. This function started out as
    // an improved version of code found in Tim Cameron Ryan's IERange (http://code.google.com/p/ierange/) but has
    // grown, fixing problems with line breaks in preformatted text, adding workaround for IE TextRange bugs, handling
    // for inputs and images, plus optimizations.
    function getTextRangeBoundaryPosition(textRange, wholeRangeContainerElement, isStart, isCollapsed, startInfo) {
        var workingRange = textRange.duplicate();

        workingRange.collapse(isStart);
        var containerElement = workingRange.parentElement();

        // Sometimes collapsing a TextRange that's at the start of a text node can move it into the previous node, so
        // check for that
        if (!dom.isOrIsAncestorOf(wholeRangeContainerElement, containerElement)) {
            containerElement = wholeRangeContainerElement;
        }


        // Deal with nodes that cannot "contain rich HTML markup". In practice, this means form inputs, images and
        // similar. See http://msdn.microsoft.com/en-us/library/aa703950%28VS.85%29.aspx
        if (!containerElement.canHaveHTML) {
            return new DomPosition(containerElement.parentNode, dom.getNodeIndex(containerElement));
        }

        var workingNode = dom.getDocument(containerElement).createElement("span");

        // Workaround for HTML5 Shiv's insane violation of document.createElement(). See Rangy issue 104 and HTML 5 Shiv
        // issue 64: https://github.com/aFarkas/html5shiv/issues/64
        if (workingNode.parentNode) {
            workingNode.parentNode.removeChild(workingNode);
        }

        var comparison, workingComparisonType = isStart ? "StartToStart" : "StartToEnd";
        var previousNode, nextNode, boundaryPosition, boundaryNode;
        var start = (startInfo && startInfo.containerElement == containerElement) ? startInfo.nodeIndex : 0;
        var childNodeCount = containerElement.childNodes.length;
        var end = childNodeCount;

        // Check end first. Code within the loop assumes that the endth child node of the container is definitely
        // after the range boundary.
        var nodeIndex = end;

        while (true) {
            if (nodeIndex == childNodeCount) {
                containerElement.appendChild(workingNode);
            } else {
                containerElement.insertBefore(workingNode, containerElement.childNodes[nodeIndex]);
            }
            workingRange.moveToElementText(workingNode);
            comparison = workingRange.compareEndPoints(workingComparisonType, textRange);
            if (comparison == 0 || start == end) {
                break;
            } else if (comparison == -1) {
                if (end == start + 1) {
                    // We know the endth child node is after the range boundary, so we must be done.
                    break;
                } else {
                    start = nodeIndex
                }
            } else {
                end = (end == start + 1) ? start : nodeIndex;
            }
            nodeIndex = Math.floor((start + end) / 2);
            containerElement.removeChild(workingNode);
        }


        // We've now reached or gone past the boundary of the text range we're interested in
        // so have identified the node we want
        boundaryNode = workingNode.nextSibling;

        if (comparison == -1 && boundaryNode && dom.isCharacterDataNode(boundaryNode)) {
            // This is a character data node (text, comment, cdata). The working range is collapsed at the start of the
            // node containing the text range's boundary, so we move the end of the working range to the boundary point
            // and measure the length of its text to get the boundary's offset within the node.
            workingRange.setEndPoint(isStart ? "EndToStart" : "EndToEnd", textRange);

            var offset;

            if (/[\r\n]/.test(boundaryNode.data)) {
                /*
                For the particular case of a boundary within a text node containing rendered line breaks (within a <pre>
                element, for example), we need a slightly complicated approach to get the boundary's offset in IE. The
                facts:

                - Each line break is represented as \r in the text node's data/nodeValue properties
                - Each line break is represented as \r\n in the TextRange's 'text' property
                - The 'text' property of the TextRange does not contain trailing line breaks

                To get round the problem presented by the final fact above, we can use the fact that TextRange's
                moveStart() and moveEnd() methods return the actual number of characters moved, which is not necessarily
                the same as the number of characters it was instructed to move. The simplest approach is to use this to
                store the characters moved when moving both the start and end of the range to the start of the document
                body and subtracting the start offset from the end offset (the "move-negative-gazillion" method).
                However, this is extremely slow when the document is large and the range is near the end of it. Clearly
                doing the mirror image (i.e. moving the range boundaries to the end of the document) has the same
                problem.

                Another approach that works is to use moveStart() to move the start boundary of the range up to the end
                boundary one character at a time and incrementing a counter with the value returned by the moveStart()
                call. However, the check for whether the start boundary has reached the end boundary is expensive, so
                this method is slow (although unlike "move-negative-gazillion" is largely unaffected by the location of
                the range within the document).

                The method below is a hybrid of the two methods above. It uses the fact that a string containing the
                TextRange's 'text' property with each \r\n converted to a single \r character cannot be longer than the
                text of the TextRange, so the start of the range is moved that length initially and then a character at
                a time to make up for any trailing line breaks not contained in the 'text' property. This has good
                performance in most situations compared to the previous two methods.
                */
                var tempRange = workingRange.duplicate();
                var rangeLength = tempRange.text.replace(/\r\n/g, "\r").length;

                offset = tempRange.moveStart("character", rangeLength);
                while ( (comparison = tempRange.compareEndPoints("StartToEnd", tempRange)) == -1) {
                    offset++;
                    tempRange.moveStart("character", 1);
                }
            } else {
                offset = workingRange.text.length;
            }
            boundaryPosition = new DomPosition(boundaryNode, offset);
        } else {

            // If the boundary immediately follows a character data node and this is the end boundary, we should favour
            // a position within that, and likewise for a start boundary preceding a character data node
            previousNode = (isCollapsed || !isStart) && workingNode.previousSibling;
            nextNode = (isCollapsed || isStart) && workingNode.nextSibling;
            if (nextNode && dom.isCharacterDataNode(nextNode)) {
                boundaryPosition = new DomPosition(nextNode, 0);
            } else if (previousNode && dom.isCharacterDataNode(previousNode)) {
                boundaryPosition = new DomPosition(previousNode, previousNode.data.length);
            } else {
                boundaryPosition = new DomPosition(containerElement, dom.getNodeIndex(workingNode));
            }
        }

        // Clean up
        workingNode.parentNode.removeChild(workingNode);

        return {
            boundaryPosition: boundaryPosition,
            nodeInfo: {
                nodeIndex: nodeIndex,
                containerElement: containerElement
            }
        };
    }

    // Returns a TextRange representing the boundary of a TextRange expressed as a node and an offset within that node.
    // This function started out as an optimized version of code found in Tim Cameron Ryan's IERange
    // (http://code.google.com/p/ierange/)
    function createBoundaryTextRange(boundaryPosition, isStart) {
        var boundaryNode, boundaryParent, boundaryOffset = boundaryPosition.offset;
        var doc = dom.getDocument(boundaryPosition.node);
        var workingNode, childNodes, workingRange = doc.body.createTextRange();
        var nodeIsDataNode = dom.isCharacterDataNode(boundaryPosition.node);

        if (nodeIsDataNode) {
            boundaryNode = boundaryPosition.node;
            boundaryParent = boundaryNode.parentNode;
        } else {
            childNodes = boundaryPosition.node.childNodes;
            boundaryNode = (boundaryOffset < childNodes.length) ? childNodes[boundaryOffset] : null;
            boundaryParent = boundaryPosition.node;
        }

        // Position the range immediately before the node containing the boundary
        workingNode = doc.createElement("span");

        // Making the working element non-empty element persuades IE to consider the TextRange boundary to be within the
        // element rather than immediately before or after it
        workingNode.innerHTML = "&#feff;";

        // insertBefore is supposed to work like appendChild if the second parameter is null. However, a bug report
        // for IERange suggests that it can crash the browser: http://code.google.com/p/ierange/issues/detail?id=12
        if (boundaryNode) {
            boundaryParent.insertBefore(workingNode, boundaryNode);
        } else {
            boundaryParent.appendChild(workingNode);
        }

        workingRange.moveToElementText(workingNode);
        workingRange.collapse(!isStart);

        // Clean up
        boundaryParent.removeChild(workingNode);

        // Move the working range to the text offset, if required
        if (nodeIsDataNode) {
            workingRange[isStart ? "moveStart" : "moveEnd"]("character", boundaryOffset);
        }

        return workingRange;
    }

    /*----------------------------------------------------------------------------------------------------------------*/

    if (api.features.implementsDomRange && (!api.features.implementsTextRange || !api.config.preferTextRange)) {
        // This is a wrapper around the browser's native DOM Range. It has two aims:
        // - Provide workarounds for specific browser bugs
        // - provide convenient extensions, which are inherited from Rangy's DomRange

        (function() {
            var rangeProto;
            var rangeProperties = DomRange.rangeProperties;

            function updateRangeProperties(range) {
                var i = rangeProperties.length, prop;
                while (i--) {
                    prop = rangeProperties[i];
                    range[prop] = range.nativeRange[prop];
                }
                // Fix for broken collapsed property in IE 9.
                range.collapsed = (range.startContainer === range.endContainer && range.startOffset === range.endOffset);
            }

            function updateNativeRange(range, startContainer, startOffset, endContainer, endOffset) {
                var startMoved = (range.startContainer !== startContainer || range.startOffset != startOffset);
                var endMoved = (range.endContainer !== endContainer || range.endOffset != endOffset);
                var nativeRangeDifferent = !range.equals(range.nativeRange);

                // Always set both boundaries for the benefit of IE9 (see issue 35)
                if (startMoved || endMoved || nativeRangeDifferent) {
                    range.setEnd(endContainer, endOffset);
                    range.setStart(startContainer, startOffset);
                }
            }

            function detach(range) {
                range.nativeRange.detach();
                range.detached = true;
                var i = rangeProperties.length, prop;
                while (i--) {
                    prop = rangeProperties[i];
                    range[prop] = null;
                }
            }

            var createBeforeAfterNodeSetter;

            WrappedRange = function(range) {
                if (!range) {
                    throw module.createError("WrappedRange: Range must be specified");
                }
                this.nativeRange = range;
                updateRangeProperties(this);
            };

            DomRange.createPrototypeRange(WrappedRange, updateNativeRange, detach);

            rangeProto = WrappedRange.prototype;

            rangeProto.selectNode = function(node) {
                this.nativeRange.selectNode(node);
                updateRangeProperties(this);
            };

            rangeProto.cloneContents = function() {
                return this.nativeRange.cloneContents();
            };

            // Firefox has a bug (apparently long-standing, still present in 3.6.8) that throws "Index or size is
            // negative or greater than the allowed amount" for insertNode in some circumstances. I haven't been able to
            // find a reliable way of detecting this, so all browsers will have to use the Rangy's own implementation of
            // insertNode, which works but is almost certainly slower than the native implementation.
/*
            rangeProto.insertNode = function(node) {
                this.nativeRange.insertNode(node);
                updateRangeProperties(this);
            };
*/

            rangeProto.surroundContents = function(node) {
                this.nativeRange.surroundContents(node);
                updateRangeProperties(this);
            };

            rangeProto.collapse = function(isStart) {
                this.nativeRange.collapse(isStart);
                updateRangeProperties(this);
            };

            rangeProto.cloneRange = function() {
                return new WrappedRange(this.nativeRange.cloneRange());
            };

            rangeProto.refresh = function() {
                updateRangeProperties(this);
            };

            rangeProto.toString = function() {
                return this.nativeRange.toString();
            };

            // Create test range and node for feature detection

            var testTextNode = document.createTextNode("test");
            dom.getBody(document).appendChild(testTextNode);
            var range = document.createRange();

            /*--------------------------------------------------------------------------------------------------------*/

            // Test for Firefox 2 bug that prevents moving the start of a Range to a point after its current end and
            // correct for it

            range.setStart(testTextNode, 0);
            range.setEnd(testTextNode, 0);

            try {
                range.setStart(testTextNode, 1);

                rangeProto.setStart = function(node, offset) {
                    this.nativeRange.setStart(node, offset);
                    updateRangeProperties(this);
                };

                rangeProto.setEnd = function(node, offset) {
                    this.nativeRange.setEnd(node, offset);
                    updateRangeProperties(this);
                };

                createBeforeAfterNodeSetter = function(name) {
                    return function(node) {
                        this.nativeRange[name](node);
                        updateRangeProperties(this);
                    };
                };

            } catch(ex) {

                rangeProto.setStart = function(node, offset) {
                    try {
                        this.nativeRange.setStart(node, offset);
                    } catch (ex) {
                        this.nativeRange.setEnd(node, offset);
                        this.nativeRange.setStart(node, offset);
                    }
                    updateRangeProperties(this);
                };

                rangeProto.setEnd = function(node, offset) {
                    try {
                        this.nativeRange.setEnd(node, offset);
                    } catch (ex) {
                        this.nativeRange.setStart(node, offset);
                        this.nativeRange.setEnd(node, offset);
                    }
                    updateRangeProperties(this);
                };

                createBeforeAfterNodeSetter = function(name, oppositeName) {
                    return function(node) {
                        try {
                            this.nativeRange[name](node);
                        } catch (ex) {
                            this.nativeRange[oppositeName](node);
                            this.nativeRange[name](node);
                        }
                        updateRangeProperties(this);
                    };
                };
            }

            rangeProto.setStartBefore = createBeforeAfterNodeSetter("setStartBefore", "setEndBefore");
            rangeProto.setStartAfter = createBeforeAfterNodeSetter("setStartAfter", "setEndAfter");
            rangeProto.setEndBefore = createBeforeAfterNodeSetter("setEndBefore", "setStartBefore");
            rangeProto.setEndAfter = createBeforeAfterNodeSetter("setEndAfter", "setStartAfter");

            /*--------------------------------------------------------------------------------------------------------*/

            // Test for and correct Firefox 2 behaviour with selectNodeContents on text nodes: it collapses the range to
            // the 0th character of the text node
            range.selectNodeContents(testTextNode);
            if (range.startContainer == testTextNode && range.endContainer == testTextNode &&
                    range.startOffset == 0 && range.endOffset == testTextNode.length) {
                rangeProto.selectNodeContents = function(node) {
                    this.nativeRange.selectNodeContents(node);
                    updateRangeProperties(this);
                };
            } else {
                rangeProto.selectNodeContents = function(node) {
                    this.setStart(node, 0);
                    this.setEnd(node, DomRange.getEndOffset(node));
                };
            }

            /*--------------------------------------------------------------------------------------------------------*/

            // Test for and correct WebKit bug that has the behaviour of compareBoundaryPoints round the wrong way for
            // constants START_TO_END and END_TO_START: https://bugs.webkit.org/show_bug.cgi?id=20738

            range.selectNodeContents(testTextNode);
            range.setEnd(testTextNode, 3);

            var range2 = document.createRange();
            range2.selectNodeContents(testTextNode);
            range2.setEnd(testTextNode, 4);
            range2.setStart(testTextNode, 2);

            if (range.compareBoundaryPoints(range.START_TO_END, range2) == -1 &&
                    range.compareBoundaryPoints(range.END_TO_START, range2) == 1) {
                // This is the wrong way round, so correct for it

                rangeProto.compareBoundaryPoints = function(type, range) {
                    range = range.nativeRange || range;
                    if (type == range.START_TO_END) {
                        type = range.END_TO_START;
                    } else if (type == range.END_TO_START) {
                        type = range.START_TO_END;
                    }
                    return this.nativeRange.compareBoundaryPoints(type, range);
                };
            } else {
                rangeProto.compareBoundaryPoints = function(type, range) {
                    return this.nativeRange.compareBoundaryPoints(type, range.nativeRange || range);
                };
            }

            /*--------------------------------------------------------------------------------------------------------*/

            // Test for IE 9 deleteContents() and extractContents() bug and correct it. See issue 107.

            var el = document.createElement("div");
            el.innerHTML = "123";
            var textNode = el.firstChild;
            document.body.appendChild(el);

            range.setStart(textNode, 1);
            range.setEnd(textNode, 2);
            range.deleteContents();

            if (textNode.data == "13") {
                // Behaviour is correct per DOM4 Range so wrap the browser's implementation of deleteContents() and
                // extractContents()
                rangeProto.deleteContents = function() {
                    this.nativeRange.deleteContents();
                    updateRangeProperties(this);
                };

                rangeProto.extractContents = function() {
                    var frag = this.nativeRange.extractContents();
                    updateRangeProperties(this);
                    return frag;
                };
            } else {
            }

            document.body.removeChild(el);

            /*--------------------------------------------------------------------------------------------------------*/

            // Test for existence of createContextualFragment and delegate to it if it exists
            if (util.isHostMethod(range, "createContextualFragment")) {
                rangeProto.createContextualFragment = function(fragmentStr) {
                    return this.nativeRange.createContextualFragment(fragmentStr);
                };
            }

            /*--------------------------------------------------------------------------------------------------------*/

            // Clean up
            dom.getBody(document).removeChild(testTextNode);
            range.detach();
            range2.detach();
        })();

        api.createNativeRange = function(doc) {
            doc = getDocument(doc, "createNativeRange");
            return doc.createRange();
        };
    } else if (api.features.implementsTextRange) {
        // This is a wrapper around a TextRange, providing full DOM Range functionality using rangy's DomRange as a
        // prototype

        WrappedRange = function(textRange) {
            this.textRange = textRange;
            this.refresh();
        };

        WrappedRange.prototype = new DomRange(document);

        WrappedRange.prototype.refresh = function() {
            var start, end, startBoundary;

            // TextRange's parentElement() method cannot be trusted. getTextRangeContainerElement() works around that.
            var rangeContainerElement = getTextRangeContainerElement(this.textRange);

            if (textRangeIsCollapsed(this.textRange)) {
                end = start = getTextRangeBoundaryPosition(this.textRange, rangeContainerElement, true,
                    true).boundaryPosition;
            } else {
                startBoundary = getTextRangeBoundaryPosition(this.textRange, rangeContainerElement, true, false);
                start = startBoundary.boundaryPosition;

                // An optimization used here is that if the start and end boundaries have teh same parent element, the
                // search scope for the end boundary can be limited to exclude the portion of the element that precedes
                // the start boundary
                end = getTextRangeBoundaryPosition(this.textRange, rangeContainerElement, false, false,
                    startBoundary.nodeInfo).boundaryPosition;
            }

            this.setStart(start.node, start.offset);
            this.setEnd(end.node, end.offset);
        };

        DomRange.copyComparisonConstants(WrappedRange);

        // Add WrappedRange as the Range property of the global object to allow expression like Range.END_TO_END to work
        var globalObj = (function() { return this; })();
        if (typeof globalObj.Range == "undefined") {
            globalObj.Range = WrappedRange;
        }

        api.createNativeRange = function(doc) {
            doc = getDocument(doc, "createNativeRange");
            return doc.body.createTextRange();
        };
    }

    if (api.features.implementsTextRange) {
        WrappedRange.rangeToTextRange = function(range) {
            if (range.collapsed) {
                return createBoundaryTextRange(new DomPosition(range.startContainer, range.startOffset), true);
            } else {
                var startRange = createBoundaryTextRange(new DomPosition(range.startContainer, range.startOffset), true);
                var endRange = createBoundaryTextRange(new DomPosition(range.endContainer, range.endOffset), false);
                var textRange = dom.getDocument(range.startContainer).body.createTextRange();
                textRange.setEndPoint("StartToStart", startRange);
                textRange.setEndPoint("EndToEnd", endRange);
                return textRange;
            }
        };
    }

    WrappedRange.prototype.getName = function() {
        return "WrappedRange";
    };

    api.WrappedRange = WrappedRange;

    api.createRange = function(doc) {
        doc = getDocument(doc, "createRange");
        return new WrappedRange(api.createNativeRange(doc));
    };

    api.createRangyRange = function(doc) {
        doc = getDocument(doc, "createRangyRange");
        return new DomRange(doc);
    };

    api.createIframeRange = function(iframeEl) {
        module.deprecationNotice("createIframeRange()", "createRange(iframeEl)");
        return api.createRange(iframeEl);
    };

    api.createIframeRangyRange = function(iframeEl) {
        module.deprecationNotice("createIframeRangyRange()", "createRangyRange(iframeEl)");
        return api.createRangyRange(iframeEl);
    };

    api.addCreateMissingNativeApiListener(function(win) {
        var doc = win.document;
        if (typeof doc.createRange == "undefined") {
            doc.createRange = function() {
                return api.createRange(doc);
            };
        }
        doc = win = null;
    });
});
// This module creates a selection object wrapper that conforms as closely as possible to the Selection specification
// in the HTML Editing spec (http://dvcs.w3.org/hg/editing/raw-file/tip/editing.html#selections)
rangy.createModule("WrappedSelection", function(api, module) {
    api.requireModules( ["DomUtil", "DomRange", "WrappedRange"] );

    api.config.checkSelectionRanges = true;

    var BOOLEAN = "boolean",
        dom = api.dom,
        util = api.util,
        DomRange = api.DomRange,
        WrappedRange = api.WrappedRange,
        DOMException = api.DOMException,
        DomPosition = dom.DomPosition,
        getSelection,
        selectionIsCollapsed,
        CONTROL = "Control";


    // Utility function to support direction parameters in the API that may be a string ("backward" or "forward") or a
    // Boolean (true for backwards).
    function isDirectionBackward(dir) {
        return (typeof dir == "string") ? (dir == "backward") : !!dir;
    }

    function getWindow(win, methodName) {
        if (!win) {
            return window;
        } else if (dom.isWindow(win)) {
            return win;
        } else if (win instanceof WrappedSelection) {
            return win.win;
        } else {
            var doc = dom.getContentDocument(win);
            if (!doc) {
                throw module.createError(methodName + "(): " + "Parameter must be a Window object or DOM node");
            }
            return dom.getWindow(doc);
        }
    }

    function getWinSelection(winParam) {
        return getWindow(winParam, "getWinSelection").getSelection();
    }

    function getDocSelection(winParam) {
        return getWindow(winParam, "getDocSelection").document.selection;
    }

    // Test for the Range/TextRange and Selection features required
    // Test for ability to retrieve selection
    var implementsWinGetSelection = api.util.isHostMethod(window, "getSelection"),
        implementsDocSelection = api.util.isHostObject(document, "selection");

    api.features.implementsWinGetSelection = implementsWinGetSelection;
    api.features.implementsDocSelection = implementsDocSelection;

    var useDocumentSelection = implementsDocSelection && (!implementsWinGetSelection || api.config.preferTextRange);

    if (useDocumentSelection) {
        getSelection = getDocSelection;
        api.isSelectionValid = function(winParam) {
            var doc = getWindow(winParam, "isSelectionValid").document, nativeSel = doc.selection;

            // Check whether the selection TextRange is actually contained within the correct document
            return (nativeSel.type != "None" || dom.getDocument(nativeSel.createRange().parentElement()) == doc);
        };
    } else if (implementsWinGetSelection) {
        getSelection = getWinSelection;
        api.isSelectionValid = function() {
            return true;
        };
    } else {
        module.fail("Neither document.selection or window.getSelection() detected.");
    }

    api.getNativeSelection = getSelection;

    var testSelection = getSelection();
    var testRange = api.createNativeRange(document);
    var body = dom.getBody(document);

    // Obtaining a range from a selection
    var selectionHasAnchorAndFocus = util.areHostProperties(testSelection,
        ["anchorNode", "focusNode", "anchorOffset", "focusOffset"]);

    api.features.selectionHasAnchorAndFocus = selectionHasAnchorAndFocus;

    // Test for existence of native selection extend() method
    var selectionHasExtend = util.isHostMethod(testSelection, "extend");
    api.features.selectionHasExtend = selectionHasExtend;

    // Test if rangeCount exists
    var selectionHasRangeCount = (typeof testSelection.rangeCount == "number");
    api.features.selectionHasRangeCount = selectionHasRangeCount;

    var selectionSupportsMultipleRanges = false;
    var collapsedNonEditableSelectionsSupported = true;

    if (util.areHostMethods(testSelection, ["addRange", "getRangeAt", "removeAllRanges"]) &&
            typeof testSelection.rangeCount == "number" && api.features.implementsDomRange) {

        (function() {
            // Previously an iframe was used but this caused problems in some circumatsances in IE, so tests are
            // performed on the current document's selection. See issue 109.

            // Note also that if a selection previously existed, it is wiped by these tests. This should usually be fine
            // because initialization usually happens when the document loads, but could be a problem for a script that
            // loads and initializes Rangy later. If anyone complains, code could be added to the selection could be
            // saved and restored.
            var sel = window.getSelection();
            if (sel) {
                var body = dom.getBody(document);
                var testEl = body.appendChild( document.createElement("div") );
                testEl.contentEditable = "false";
                var textNode = testEl.appendChild( document.createTextNode("\u00a0\u00a0\u00a0") );

                // Test whether the native selection will allow a collapsed selection within a non-editable element
                var r1 = document.createRange();

                r1.setStart(textNode, 1);
                r1.collapse(true);
                sel.addRange(r1);
                collapsedNonEditableSelectionsSupported = (sel.rangeCount == 1);
                sel.removeAllRanges();

                // Test whether the native selection is capable of supporting multiple ranges
                var r2 = r1.cloneRange();
                r1.setStart(textNode, 0);
                r2.setEnd(textNode, 3);
                r2.setStart(textNode, 2);
                sel.addRange(r1);
                sel.addRange(r2);

                selectionSupportsMultipleRanges = (sel.rangeCount == 2);

                // Clean up
                body.removeChild(testEl);
                sel.removeAllRanges();
                r1.detach();
                r2.detach();
            }
        })();
    }

    api.features.selectionSupportsMultipleRanges = selectionSupportsMultipleRanges;
    api.features.collapsedNonEditableSelectionsSupported = collapsedNonEditableSelectionsSupported;

    // ControlRanges
    var implementsControlRange = false, testControlRange;

    if (body && util.isHostMethod(body, "createControlRange")) {
        testControlRange = body.createControlRange();
        if (util.areHostProperties(testControlRange, ["item", "add"])) {
            implementsControlRange = true;
        }
    }
    api.features.implementsControlRange = implementsControlRange;

    // Selection collapsedness
    if (selectionHasAnchorAndFocus) {
        selectionIsCollapsed = function(sel) {
            return sel.anchorNode === sel.focusNode && sel.anchorOffset === sel.focusOffset;
        };
    } else {
        selectionIsCollapsed = function(sel) {
            return sel.rangeCount ? sel.getRangeAt(sel.rangeCount - 1).collapsed : false;
        };
    }

    function updateAnchorAndFocusFromRange(sel, range, backward) {
        var anchorPrefix = backward ? "end" : "start", focusPrefix = backward ? "start" : "end";
        sel.anchorNode = range[anchorPrefix + "Container"];
        sel.anchorOffset = range[anchorPrefix + "Offset"];
        sel.focusNode = range[focusPrefix + "Container"];
        sel.focusOffset = range[focusPrefix + "Offset"];
    }

    function updateAnchorAndFocusFromNativeSelection(sel) {
        var nativeSel = sel.nativeSelection;
        sel.anchorNode = nativeSel.anchorNode;
        sel.anchorOffset = nativeSel.anchorOffset;
        sel.focusNode = nativeSel.focusNode;
        sel.focusOffset = nativeSel.focusOffset;
    }

    function updateEmptySelection(sel) {
        sel.anchorNode = sel.focusNode = null;
        sel.anchorOffset = sel.focusOffset = 0;
        sel.rangeCount = 0;
        sel.isCollapsed = true;
        sel._ranges.length = 0;
    }

    function getNativeRange(range) {
        var nativeRange;
        if (range instanceof DomRange) {
            nativeRange = api.createNativeRange(range.getDocument());
            nativeRange.setEnd(range.endContainer, range.endOffset);
            nativeRange.setStart(range.startContainer, range.startOffset);
        } else if (range instanceof WrappedRange) {
            nativeRange = range.nativeRange;
        } else if (api.features.implementsDomRange && (range instanceof dom.getWindow(range.startContainer).Range)) {
            nativeRange = range;
        }
        return nativeRange;
    }

    function rangeContainsSingleElement(rangeNodes) {
        if (!rangeNodes.length || rangeNodes[0].nodeType != 1) {
            return false;
        }
        for (var i = 1, len = rangeNodes.length; i < len; ++i) {
            if (!dom.isAncestorOf(rangeNodes[0], rangeNodes[i])) {
                return false;
            }
        }
        return true;
    }

    function getSingleElementFromRange(range) {
        var nodes = range.getNodes();
        if (!rangeContainsSingleElement(nodes)) {
            throw module.createError("getSingleElementFromRange: range " + range.inspect() + " did not consist of a single element");
        }
        return nodes[0];
    }

    // Simple, quick test which only needs to distinguish between a TextRange and a ControlRange
    function isTextRange(range) {
        return !!range && typeof range.text != "undefined";
    }

    function updateFromTextRange(sel, range) {
        // Create a Range from the selected TextRange
        var wrappedRange = new WrappedRange(range);
        sel._ranges = [wrappedRange];

        updateAnchorAndFocusFromRange(sel, wrappedRange, false);
        sel.rangeCount = 1;
        sel.isCollapsed = wrappedRange.collapsed;
    }

    function updateControlSelection(sel) {
        // Update the wrapped selection based on what's now in the native selection
        sel._ranges.length = 0;
        if (sel.docSelection.type == "None") {
            updateEmptySelection(sel);
        } else {
            var controlRange = sel.docSelection.createRange();
            if (isTextRange(controlRange)) {
                // This case (where the selection type is "Control" and calling createRange() on the selection returns
                // a TextRange) can happen in IE 9. It happens, for example, when all elements in the selected
                // ControlRange have been removed from the ControlRange and removed from the document.
                updateFromTextRange(sel, controlRange);
            } else {
                sel.rangeCount = controlRange.length;
                var range, doc = dom.getDocument(controlRange.item(0));
                for (var i = 0; i < sel.rangeCount; ++i) {
                    range = api.createRange(doc);
                    range.selectNode(controlRange.item(i));
                    sel._ranges.push(range);
                }
                sel.isCollapsed = sel.rangeCount == 1 && sel._ranges[0].collapsed;
                updateAnchorAndFocusFromRange(sel, sel._ranges[sel.rangeCount - 1], false);
            }
        }
    }

    function addRangeToControlSelection(sel, range) {
        var controlRange = sel.docSelection.createRange();
        var rangeElement = getSingleElementFromRange(range);

        // Create a new ControlRange containing all the elements in the selected ControlRange plus the element
        // contained by the supplied range
        var doc = dom.getDocument(controlRange.item(0));
        var newControlRange = dom.getBody(doc).createControlRange();
        for (var i = 0, len = controlRange.length; i < len; ++i) {
            newControlRange.add(controlRange.item(i));
        }
        try {
            newControlRange.add(rangeElement);
        } catch (ex) {
            throw module.createError("addRange(): Element within the specified Range could not be added to control selection (does it have layout?)");
        }
        newControlRange.select();

        // Update the wrapped selection based on what's now in the native selection
        updateControlSelection(sel);
    }

    var getSelectionRangeAt;

    if (util.isHostMethod(testSelection, "getRangeAt")) {
        // try/catch is present because getRangeAt() must have thrown an error in some browser and some situation.
        // Unfortunately, I didn't write a comment about the specifics and am now scared to take it out. Let that be a
        // lesson to us all, especially me.
        getSelectionRangeAt = function(sel, index) {
            try {
                return sel.getRangeAt(index);
            } catch (ex) {
                return null;
            }
        };
    } else if (selectionHasAnchorAndFocus) {
        getSelectionRangeAt = function(sel) {
            var doc = dom.getDocument(sel.anchorNode);
            var range = api.createRange(doc);
            range.setStart(sel.anchorNode, sel.anchorOffset);
            range.setEnd(sel.focusNode, sel.focusOffset);

            // Handle the case when the selection was selected backwards (from the end to the start in the
            // document)
            if (range.collapsed !== this.isCollapsed) {
                range.setStart(sel.focusNode, sel.focusOffset);
                range.setEnd(sel.anchorNode, sel.anchorOffset);
            }

            return range;
        };
    }

    function WrappedSelection(selection, docSelection, win) {
        this.nativeSelection = selection;
        this.docSelection = docSelection;
        this._ranges = [];
        this.win = win;
        this.refresh();
    }

    function deleteProperties(sel) {
        sel.win = sel.anchorNode = sel.focusNode = sel._ranges = null;
        sel.detached = true;
    }

    var cachedRangySelections = [];

    function findCachedSelection(win, action) {
        var i = cachedRangySelections.length, cached, sel;
        while (i--) {
            cached = cachedRangySelections[i];
            sel = cached.selection;
            if (action == "deleteAll") {
                deleteProperties(sel);
            } else if (cached.win == win) {
                if (action == "delete") {
                    cachedRangySelections.splice(i, 1);
                    return true;
                } else {
                    return sel;
                }
            }
        }
        if (action == "deleteAll") {
            cachedRangySelections.length = 0;
        }
        return null;
    }

    api.getSelection = function(win) {
        // Check if the paraemter is a Rangy Selection object
        if (win && win instanceof WrappedSelection) {
            win.refresh();
            return win;
        }

        win = getWindow(win, "getSelection");

        var sel = findCachedSelection(win);
        var nativeSel = getSelection(win), docSel = implementsDocSelection ? getDocSelection(win) : null;
        if (sel) {
            sel.nativeSelection = nativeSel;
            sel.docSelection = docSel;
            sel.refresh();
        } else {
            sel = new WrappedSelection(nativeSel, docSel, win);
            cachedRangySelections.push( { win: win, selection: sel } );
        }
        return sel;
    };

    api.getIframeSelection = function(iframeEl) {
        module.deprecationNotice("getIframeSelection()", "getSelection(iframeEl)");
        return api.getSelection(dom.getIframeWindow(iframeEl));
    };

    var selProto = WrappedSelection.prototype;

    function createControlSelection(sel, ranges) {
        // Ensure that the selection becomes of type "Control"
        var doc = dom.getDocument(ranges[0].startContainer);
        var controlRange = dom.getBody(doc).createControlRange();
        for (var i = 0, el; i < rangeCount; ++i) {
            el = getSingleElementFromRange(ranges[i]);
            try {
                controlRange.add(el);
            } catch (ex) {
                throw module.createError("setRanges(): Element within the one of the specified Ranges could not be added to control selection (does it have layout?)");
            }
        }
        controlRange.select();

        // Update the wrapped selection based on what's now in the native selection
        updateControlSelection(sel);
    }

    // Selecting a range
    if (!useDocumentSelection && selectionHasAnchorAndFocus && util.areHostMethods(testSelection, ["removeAllRanges", "addRange"])) {
        selProto.removeAllRanges = function() {
            this.nativeSelection.removeAllRanges();
            updateEmptySelection(this);
        };

        var addRangeBackward = function(sel, range) {
            var doc = DomRange.getRangeDocument(range);
            var endRange = api.createRange(doc);
            endRange.collapseToPoint(range.endContainer, range.endOffset);
            sel.nativeSelection.addRange(getNativeRange(endRange));
            sel.nativeSelection.extend(range.startContainer, range.startOffset);
            sel.refresh();
        };

        if (selectionHasRangeCount) {
            selProto.addRange = function(range, direction) {
                if (implementsControlRange && implementsDocSelection && this.docSelection.type == CONTROL) {
                    addRangeToControlSelection(this, range);
                } else {
                    if (isDirectionBackward(direction) && selectionHasExtend) {
                        addRangeBackward(this, range);
                    } else {
                        var previousRangeCount;
                        if (selectionSupportsMultipleRanges) {
                            previousRangeCount = this.rangeCount;
                        } else {
                            this.removeAllRanges();
                            previousRangeCount = 0;
                        }
                        // Clone the native range so that changing the selected range does not affect the selection.
                        // This is contrary to the spec but is the only way to achieve consistency between browsers. See
                        // issue 80.
                        this.nativeSelection.addRange(getNativeRange(range).cloneRange());

                        // Check whether adding the range was successful
                        this.rangeCount = this.nativeSelection.rangeCount;

                        if (this.rangeCount == previousRangeCount + 1) {
                            // The range was added successfully

                            // Check whether the range that we added to the selection is reflected in the last range extracted from
                            // the selection
                            if (api.config.checkSelectionRanges) {
                                var nativeRange = getSelectionRangeAt(this.nativeSelection, this.rangeCount - 1);
                                if (nativeRange && !DomRange.rangesEqual(nativeRange, range)) {
                                    // Happens in WebKit with, for example, a selection placed at the start of a text node
                                    range = new WrappedRange(nativeRange);
                                }
                            }
                            this._ranges[this.rangeCount - 1] = range;
                            updateAnchorAndFocusFromRange(this, range, selectionIsBackward(this.nativeSelection));
                            this.isCollapsed = selectionIsCollapsed(this);
                        } else {
                            // The range was not added successfully. The simplest thing is to refresh
                            this.refresh();
                        }
                    }
                }
            };
        } else {
            selProto.addRange = function(range, direction) {
                if (isDirectionBackward(direction) && selectionHasExtend) {
                    addRangeBackward(this, range);
                } else {
                    this.nativeSelection.addRange(getNativeRange(range));
                    this.refresh();
                }
            };
        }

        selProto.setRanges = function(ranges) {
            if (implementsControlRange && ranges.length > 1) {
                createControlSelection(this, ranges);
            } else {
                this.removeAllRanges();
                for (var i = 0, len = ranges.length; i < len; ++i) {
                    this.addRange(ranges[i]);
                }
            }
        };
    } else if (util.isHostMethod(testSelection, "empty") && util.isHostMethod(testRange, "select") &&
               implementsControlRange && useDocumentSelection) {

        selProto.removeAllRanges = function() {
            // Added try/catch as fix for issue #21
            try {
                this.docSelection.empty();

                // Check for empty() not working (issue #24)
                if (this.docSelection.type != "None") {
                    // Work around failure to empty a control selection by instead selecting a TextRange and then
                    // calling empty()
                    var doc;
                    if (this.anchorNode) {
                        doc = dom.getDocument(this.anchorNode);
                    } else if (this.docSelection.type == CONTROL) {
                        var controlRange = this.docSelection.createRange();
                        if (controlRange.length) {
                            doc = dom.getDocument(controlRange.item(0)).body.createTextRange();
                        }
                    }
                    if (doc) {
                        var textRange = doc.body.createTextRange();
                        textRange.select();
                        this.docSelection.empty();
                    }
                }
            } catch(ex) {}
            updateEmptySelection(this);
        };

        selProto.addRange = function(range) {
            if (this.docSelection.type == CONTROL) {
                addRangeToControlSelection(this, range);
            } else {
                WrappedRange.rangeToTextRange(range).select();
                this._ranges[0] = range;
                this.rangeCount = 1;
                this.isCollapsed = this._ranges[0].collapsed;
                updateAnchorAndFocusFromRange(this, range, false);
            }
        };

        selProto.setRanges = function(ranges) {
            this.removeAllRanges();
            var rangeCount = ranges.length;
            if (rangeCount > 1) {
                createControlSelection(this, ranges);
            } else if (rangeCount) {
                this.addRange(ranges[0]);
            }
        };
    } else {
        module.fail("No means of selecting a Range or TextRange was found");
        return false;
    }

    selProto.getRangeAt = function(index) {
        if (index < 0 || index >= this.rangeCount) {
            throw new DOMException("INDEX_SIZE_ERR");
        } else {
            // Clone the range to preserve selection-range independence. See issue 80.
            return this._ranges[index].cloneRange();
        }
    };

    var refreshSelection;

    if (useDocumentSelection) {
        refreshSelection = function(sel) {
            var range;
            if (api.isSelectionValid(sel.win)) {
                range = sel.docSelection.createRange();
            } else {
                range = dom.getBody(sel.win.document).createTextRange();
                range.collapse(true);
            }

            if (sel.docSelection.type == CONTROL) {
                updateControlSelection(sel);
            } else if (isTextRange(range)) {
                updateFromTextRange(sel, range);
            } else {
                updateEmptySelection(sel);
            }
        };
    } else if (util.isHostMethod(testSelection, "getRangeAt") && typeof testSelection.rangeCount == "number") {
        refreshSelection = function(sel) {
            if (implementsControlRange && implementsDocSelection && sel.docSelection.type == CONTROL) {
                updateControlSelection(sel);
            } else {
                sel._ranges.length = sel.rangeCount = sel.nativeSelection.rangeCount;
                if (sel.rangeCount) {
                    for (var i = 0, len = sel.rangeCount; i < len; ++i) {
                        sel._ranges[i] = new api.WrappedRange(sel.nativeSelection.getRangeAt(i));
                    }
                    updateAnchorAndFocusFromRange(sel, sel._ranges[sel.rangeCount - 1], selectionIsBackward(sel.nativeSelection));
                    sel.isCollapsed = selectionIsCollapsed(sel);
                } else {
                    updateEmptySelection(sel);
                }
            }
        };
    } else if (selectionHasAnchorAndFocus && typeof testSelection.isCollapsed == BOOLEAN && typeof testRange.collapsed == BOOLEAN && api.features.implementsDomRange) {
        refreshSelection = function(sel) {
            var range, nativeSel = sel.nativeSelection;
            if (nativeSel.anchorNode) {
                range = getSelectionRangeAt(nativeSel, 0);
                sel._ranges = [range];
                sel.rangeCount = 1;
                updateAnchorAndFocusFromNativeSelection(sel);
                sel.isCollapsed = selectionIsCollapsed(sel);
            } else {
                updateEmptySelection(sel);
            }
        };
    } else {
        module.fail("No means of obtaining a Range or TextRange from the user's selection was found");
        return false;
    }

    selProto.refresh = function(checkForChanges) {
        var oldRanges = checkForChanges ? this._ranges.slice(0) : null;
        var oldAnchorNode = this.anchorNode, oldAnchorOffset = this.anchorOffset;

        refreshSelection(this);
        if (checkForChanges) {
            // Check the range count first
            var i = oldRanges.length;
            if (i != this._ranges.length) {
                return true;
            }

            // Now check the direction. Checking the anchor position is the same is enough since we're checking all the
            // ranges after this
            if (this.anchorNode != oldAnchorNode || this.anchorOffset != oldAnchorOffset) {
                return true;
            }

            // Finally, compare each range in turn
            while (i--) {
                if (!DomRange.rangesEqual(oldRanges[i], this._ranges[i])) {
                    return true;
                }
            }
            return false;
        }
    };

    // Removal of a single range
    var removeRangeManually = function(sel, range) {
        var ranges = sel.getAllRanges();
        sel.removeAllRanges();
        for (var i = 0, len = ranges.length; i < len; ++i) {
            if (!api.DomRange.rangesEqual(range, ranges[i])) {
                sel.addRange(ranges[i]);
            }
        }
        if (!sel.rangeCount) {
            updateEmptySelection(sel);
        }
    };

    if (implementsControlRange) {
        selProto.removeRange = function(range) {
            if (this.docSelection.type == CONTROL) {
                var controlRange = this.docSelection.createRange();
                var rangeElement = getSingleElementFromRange(range);

                // Create a new ControlRange containing all the elements in the selected ControlRange minus the
                // element contained by the supplied range
                var doc = dom.getDocument(controlRange.item(0));
                var newControlRange = dom.getBody(doc).createControlRange();
                var el, removed = false;
                for (var i = 0, len = controlRange.length; i < len; ++i) {
                    el = controlRange.item(i);
                    if (el !== rangeElement || removed) {
                        newControlRange.add(controlRange.item(i));
                    } else {
                        removed = true;
                    }
                }
                newControlRange.select();

                // Update the wrapped selection based on what's now in the native selection
                updateControlSelection(this);
            } else {
                removeRangeManually(this, range);
            }
        };
    } else {
        selProto.removeRange = function(range) {
            removeRangeManually(this, range);
        };
    }

    // Detecting if a selection is backward
    var selectionIsBackward;
    if (!useDocumentSelection && selectionHasAnchorAndFocus && api.features.implementsDomRange) {
        selectionIsBackward = function(sel) {
            var backward = false;
            if (sel.anchorNode) {
                backward = (dom.comparePoints(sel.anchorNode, sel.anchorOffset, sel.focusNode, sel.focusOffset) == 1);
            }
            return backward;
        };

        selProto.isBackward = function() {
            return selectionIsBackward(this);
        };
    } else {
        selectionIsBackward = selProto.isBackward = function() {
            return false;
        };
    }

    // Create an alias for backwards compatibility. From 1.3, everything is "backward" rather than "backwards"
    selProto.isBackwards = selProto.isBackward;

    // Selection stringifier
    // This is conformant to the old HTML5 selections draft spec but differs from WebKit and Mozilla's implementation.
    // The current spec does not yet define this method.
    selProto.toString = function() {
        var rangeTexts = [];
        for (var i = 0, len = this.rangeCount; i < len; ++i) {
            rangeTexts[i] = "" + this._ranges[i];
        }
        return rangeTexts.join("");
    };

    function assertNodeInSameDocument(sel, node) {
        if (sel.anchorNode && (dom.getDocument(sel.anchorNode) !== dom.getDocument(node))) {
            throw new DOMException("WRONG_DOCUMENT_ERR");
        }
    }

    // No current browser conforms fully to the spec for this method, so Rangy's own method is always used
    selProto.collapse = function(node, offset) {
        assertNodeInSameDocument(this, node);
        var range = api.createRange(node);
        range.collapseToPoint(node, offset);
        this.setSingleRange(range);
        this.isCollapsed = true;
    };

    selProto.collapseToStart = function() {
        if (this.rangeCount) {
            var range = this._ranges[0];
            this.collapse(range.startContainer, range.startOffset);
        } else {
            throw new DOMException("INVALID_STATE_ERR");
        }
    };

    selProto.collapseToEnd = function() {
        if (this.rangeCount) {
            var range = this._ranges[this.rangeCount - 1];
            this.collapse(range.endContainer, range.endOffset);
        } else {
            throw new DOMException("INVALID_STATE_ERR");
        }
    };

    // The spec is very specific on how selectAllChildren should be implemented so the native implementation is
    // never used by Rangy.
    selProto.selectAllChildren = function(node) {
        assertNodeInSameDocument(this, node);
        var range = api.createRange(node);
        range.selectNodeContents(node);
        this.removeAllRanges();
        this.addRange(range);
    };

    selProto.deleteFromDocument = function() {
        // Sepcial behaviour required for Control selections
        if (implementsControlRange && implementsDocSelection && this.docSelection.type == CONTROL) {
            var controlRange = this.docSelection.createRange();
            var element;
            while (controlRange.length) {
                element = controlRange.item(0);
                controlRange.remove(element);
                element.parentNode.removeChild(element);
            }
            this.refresh();
        } else if (this.rangeCount) {
            var ranges = this.getAllRanges();
            if (ranges.length) {
                this.removeAllRanges();
                for (var i = 0, len = ranges.length; i < len; ++i) {
                    ranges[i].deleteContents();
                }
                // The spec says nothing about what the selection should contain after calling deleteContents on each
                // range. Firefox moves the selection to where the final selected range was, so we emulate that
                this.addRange(ranges[len - 1]);
            }
        }
    };

    // The following are non-standard extensions
    selProto.getAllRanges = function() {
        var ranges = [];
        for (var i = 0, len = this._ranges.length; i < len; ++i) {
            ranges[i] = this.getRangeAt(i);
        }
        return ranges;
    };

    selProto.setSingleRange = function(range, direction) {
        this.removeAllRanges();
        this.addRange(range, direction);
    };

    selProto.containsNode = function(node, allowPartial) {
        for (var i = 0, len = this._ranges.length; i < len; ++i) {
            if (this._ranges[i].containsNode(node, allowPartial)) {
                return true;
            }
        }
        return false;
    };

    selProto.toHtml = function() {
        var rangeHtmls = [];
        if (this.rangeCount) {
            for (var i = 0, len = this._ranges.length; i < len; ++i) {
                rangeHtmls.push(this._ranges[i].toHtml());
            }
        }
        return rangeHtmls.join("");
    };

    function inspect(sel) {
        var rangeInspects = [];
        var anchor = new DomPosition(sel.anchorNode, sel.anchorOffset);
        var focus = new DomPosition(sel.focusNode, sel.focusOffset);
        var name = (typeof sel.getName == "function") ? sel.getName() : "Selection";

        if (typeof sel.rangeCount != "undefined") {
            for (var i = 0, len = sel.rangeCount; i < len; ++i) {
                rangeInspects[i] = DomRange.inspect(sel.getRangeAt(i));
            }
        }
        return "[" + name + "(Ranges: " + rangeInspects.join(", ") +
                ")(anchor: " + anchor.inspect() + ", focus: " + focus.inspect() + "]";

    }

    selProto.getName = function() {
        return "WrappedSelection";
    };

    selProto.inspect = function() {
        return inspect(this);
    };

    selProto.detach = function() {
        findCachedSelection(this.win, "delete");
        deleteProperties(this);
    };

    WrappedSelection.detachAll = function() {
        findCachedSelection(null, "deleteAll");
    };

    WrappedSelection.inspect = inspect;
    WrappedSelection.isDirectionBackward = isDirectionBackward;

    api.Selection = WrappedSelection;

    api.selectionPrototype = selProto;

    api.addCreateMissingNativeApiListener(function(win) {
        if (typeof win.getSelection == "undefined") {
            win.getSelection = function() {
                return api.getSelection(win);
            };
        }
        win = null;
    });
});

                /* End of file: build/default/src/dependencies/rangy/rangy-core.js */
            
                /* File: build/default/src/dependencies/rangy/rangy-applier.js */
                /**
 * Tag/attribute/class applier module for Rangy.
 *
 * Depends on Rangy core.
 *
 * Subject the Raptor licence: http://www.raptor-editor.com/license
 * @author Tim Down
 * @author David Neilsen david@panmedia.co.nz
 *
 * Derived from "CSS Class Applier module for Rangy." which is Copyright 2012,
 * Tim Down, and licensed under the MIT license.
 */
rangy.createModule("Applier", function(api, module) {
    api.requireModules([
        "WrappedSelection",
        "WrappedRange"
    ]);

    var dom = api.dom;
    var DomPosition = dom.DomPosition;

    function trim(str) {
        return str.replace(/^\s\s*/, "").replace(/\s\s*$/, "");
    }

    function hasClass(el, cssClass) {
        return el.className && new RegExp("(?:^|\\s)" + cssClass + "(?:\\s|$)").test(el.className);
    }

    function addClass(el, cssClass) {
        if (el.className) {
            if (!hasClass(el, cssClass)) {
                el.className += " " + cssClass;
            }
        } else {
            el.className = cssClass;
        }
    }

    var removeClass = (function() {
        function replacer(matched, whiteSpaceBefore, whiteSpaceAfter) {
            return (whiteSpaceBefore && whiteSpaceAfter) ? " " : "";
        }

        return function(el, cssClass) {
            if (el.className) {
                el.className = el.className.replace(new RegExp("(^|\\s)" + cssClass + "(\\s|$)"), replacer);
            }
        };
    })();

    function sortClassName(className) {
        return className.split(/\s+/).sort().join(" ");
    }

    function getSortedClassName(el) {
        return sortClassName(el.className);
    }

    function haveSameClasses(el1, el2) {
        return getSortedClassName(el1) == getSortedClassName(el2);
    }

    function compareRanges(r1, r2) {
        return r1.compareBoundaryPoints(r2.START_TO_START, r2);
    }

    function mergeOverlappingRanges(ranges) {

        for (var i = 0, len = ranges.length, r1, r2, j; i < len; ++i) {
        }
    }

    // Sorts and merges any overlapping ranges
    function normalizeRanges(ranges) {
        var sortedRanges = ranges.slice(0);
        sortedRanges.sort(compareRanges);
        var newRanges = [];

        // Check for overlaps and merge where they exist
        for (var i = 1, len = ranges.length, range, mergedRange = ranges[0]; i < len; ++i) {
            range = ranges[i];
            if (range.intersectsOrTouchesRange(mergedRange)) {
                mergedRange = mergedRange.union(range);
            } else {
                newRanges.push(mergedRange);
                mergedRange = range;
            }

        }
        newRanges.push(mergedRange);
        return newRanges;
    }

    function movePosition(position, oldParent, oldIndex, newParent, newIndex) {
        var node = position.node, offset = position.offset;

        var newNode = node, newOffset = offset;

        if (node == newParent && offset > newIndex) {
            newOffset++;
        }

        if (node == oldParent && (offset == oldIndex  || offset == oldIndex + 1)) {
            newNode = newParent;
            newOffset += newIndex - oldIndex;
        }

        if (node == oldParent && offset > oldIndex + 1) {
            newOffset--;
        }

        position.node = newNode;
        position.offset = newOffset;
    }

    function movePreservingPositions(node, newParent, newIndex, positionsToPreserve) {
        // For convenience, allow newIndex to be -1 to mean "insert at the end".
        if (newIndex == -1) {
            newIndex = newParent.childNodes.length;
        }

        var oldParent = node.parentNode;
        var oldIndex = dom.getNodeIndex(node);

        for (var i = 0, position; position = positionsToPreserve[i++]; ) {
            movePosition(position, oldParent, oldIndex, newParent, newIndex);
        }

        // Now actually move the node.
        if (newParent.childNodes.length == newIndex) {
            newParent.appendChild(node);
        } else {
            newParent.insertBefore(node, newParent.childNodes[newIndex]);
        }
    }

    function moveChildrenPreservingPositions(node, newParent, newIndex, removeNode, positionsToPreserve) {
        var child, children = [];
        while ( (child = node.firstChild) ) {
            movePreservingPositions(child, newParent, newIndex++, positionsToPreserve);
            children.push(child);
        }
        if (removeNode) {
            node.parentNode.removeChild(node);
        }
        return children;
    }

    function replaceWithOwnChildrenPreservingPositions(element, positionsToPreserve) {
        return moveChildrenPreservingPositions(element, element.parentNode, dom.getNodeIndex(element), true, positionsToPreserve);
    }

    function rangeSelectsAnyText(range, textNode) {
        var textRange = range.cloneRange();
        textRange.selectNodeContents(textNode);

        var intersectionRange = textRange.intersection(range);
        var text = intersectionRange ? intersectionRange.toString() : "";
        textRange.detach();

        return text != "";
    }

    function getEffectiveTextNodes(range) {
        return range.getNodes([3], function(textNode) {
            return rangeSelectsAnyText(range, textNode);
        });
    }

    function elementsHaveSameNonClassAttributes(el1, el2) {
        if (el1.attributes.length != el2.attributes.length) return false;
        for (var i = 0, len = el1.attributes.length, attr1, attr2, name; i < len; ++i) {
            attr1 = el1.attributes[i];
            name = attr1.name;
            if (name != "class") {
                attr2 = el2.attributes.getNamedItem(name);
                if (attr1.specified != attr2.specified) return false;
                if (attr1.specified && attr1.nodeValue !== attr2.nodeValue) return false;
            }
        }
        return true;
    }

    function elementHasNonClassAttributes(el, exceptions) {
        for (var i = 0, len = el.attributes.length, attrName; i < len; ++i) {
            attrName = el.attributes[i].name;
            if ( !(exceptions && dom.arrayContains(exceptions, attrName)) && el.attributes[i].specified && attrName != "class") {
                return true;
            }
        }
        return false;
    }

    function elementHasProps(el, props) {
        var propValue;
        for (var p in props) {
            if (props.hasOwnProperty(p)) {
                propValue = props[p];
                if (typeof propValue == "object") {
                    if (!elementHasProps(el[p], propValue)) {
                        return false;
                    }
                } else if (el[p] !== propValue) {
                    return false;
                }
            }
        }
        return true;
    }

    var getComputedStyleProperty;

    if (typeof window.getComputedStyle != "undefined") {
        getComputedStyleProperty = function(el, propName) {
            return dom.getWindow(el).getComputedStyle(el, null)[propName];
        };
    } else if (typeof document.documentElement.currentStyle != "undefined") {
        getComputedStyleProperty = function(el, propName) {
            return el.currentStyle[propName];
        };
    } else {
        module.fail("No means of obtaining computed style properties found");
    }

    var isEditableElement;

    (function() {
        var testEl = document.createElement("div");
        if (typeof testEl.isContentEditable == "boolean") {
            isEditableElement = function(node) {
                return node && node.nodeType == 1 && node.isContentEditable;
            };
        } else {
            isEditableElement = function(node) {
                if (!node || node.nodeType != 1 || node.contentEditable == "false") {
                    return false;
                }
                return node.contentEditable == "true" || isEditableElement(node.parentNode);
            };
        }
    })();

    function isEditingHost(node) {
        var parent;
        return node && node.nodeType == 1
            && (( (parent = node.parentNode) && parent.nodeType == 9 && parent.designMode == "on")
            || (isEditableElement(node) && !isEditableElement(node.parentNode)));
    }

    function isEditable(node) {
        return (isEditableElement(node) || (node.nodeType != 1 && isEditableElement(node.parentNode))) && !isEditingHost(node);
    }

    var inlineDisplayRegex = /^inline(-block|-table)?$/i;

    function isNonInlineElement(node) {
        return node && node.nodeType == 1 && !inlineDisplayRegex.test(getComputedStyleProperty(node, "display"));
    }

    // White space characters as defined by HTML 4 (http://www.w3.org/TR/html401/struct/text.html)
    var htmlNonWhiteSpaceRegex = /[^\r\n\t\f \u200B]/;

    function isUnrenderedWhiteSpaceNode(node) {
        if (node.data.length == 0) {
            return true;
        }
        if (htmlNonWhiteSpaceRegex.test(node.data)) {
            return false;
        }
        var cssWhiteSpace = getComputedStyleProperty(node.parentNode, "whiteSpace");
        switch (cssWhiteSpace) {
            case "pre":
            case "pre-wrap":
            case "-moz-pre-wrap":
                return false;
            case "pre-line":
                if (/[\r\n]/.test(node.data)) {
                    return false;
                }
        }

        // We now have a whitespace-only text node that may be rendered depending on its context. If it is adjacent to a
        // non-inline element, it will not be rendered. This seems to be a good enough definition.
        return isNonInlineElement(node.previousSibling) || isNonInlineElement(node.nextSibling);
    }

    function getRangeBoundaries(ranges) {
        var positions = [], i, range;
        for (i = 0; range = ranges[i++]; ) {
            positions.push(
                new DomPosition(range.startContainer, range.startOffset),
                new DomPosition(range.endContainer, range.endOffset)
            );
        }
        return positions;
    }

    function updateRangesFromBoundaries(ranges, positions) {
        for (var i = 0, range, start, end, len = ranges.length; i < len; ++i) {
            range = ranges[i];
            start = positions[i * 2];
            end = positions[i * 2 + 1];
            range.setStartAndEnd(start.node, start.offset, end.node, end.offset);
        }
    }

    function arrayWithoutValue(arr, val) {
        var newArray = [];
        for (var i = 0, len = arr.length; i < len; ++i) {
            if (arr[i] !== val) {
                newArray.push(arr[i]);
            }
        }
        return newArray;
    }

    function isSplitPoint(node, offset) {
        if (dom.isCharacterDataNode(node)) {
            if (offset == 0) {
                return !!node.previousSibling;
            } else if (offset == node.length) {
                return !!node.nextSibling;
            } else {
                return true;
            }
        }

        return offset > 0 && offset < node.childNodes.length;
    }

    function splitNodeAt(node, descendantNode, descendantOffset, positionsToPreserve) {
        var newNode, parentNode;
        var splitAtStart = (descendantOffset == 0);

        if (dom.isAncestorOf(descendantNode, node)) {
            return node;
        }

        if (dom.isCharacterDataNode(descendantNode)) {
            var descendantIndex = dom.getNodeIndex(descendantNode);
            if (descendantOffset == 0) {
                descendantOffset = descendantIndex;
            } else if (descendantOffset == descendantNode.length) {
                descendantOffset = descendantIndex + 1;
            } else {
                throw module.createError("splitNodeAt() should not be called with offset in the middle of a data node ("
                    + descendantOffset + " in " + descendantNode.data);
            }
            descendantNode = descendantNode.parentNode;
        }

        if (isSplitPoint(descendantNode, descendantOffset)) {
            // descendantNode is now guaranteed not to be a text or other character node
            newNode = descendantNode.cloneNode(false);
            parentNode = descendantNode.parentNode;
            if (newNode.id) {
                newNode.removeAttribute("id");
            }
            var child, newChildIndex = 0;

            while ( (child = descendantNode.childNodes[descendantOffset]) ) {
                movePreservingPositions(child, newNode, newChildIndex++, positionsToPreserve);
                //newNode.appendChild(child);
            }
            movePreservingPositions(newNode, parentNode, dom.getNodeIndex(descendantNode) + 1, positionsToPreserve);
            //dom.insertAfter(newNode, descendantNode);
            return (descendantNode == node) ? newNode : splitNodeAt(node, parentNode, dom.getNodeIndex(newNode), positionsToPreserve);
        } else if (node != descendantNode) {
            newNode = descendantNode.parentNode;

            // Work out a new split point in the parent node
            var newNodeIndex = dom.getNodeIndex(descendantNode);

            if (!splitAtStart) {
                newNodeIndex++;
            }
            return splitNodeAt(node, newNode, newNodeIndex, positionsToPreserve);
        }
        return node;
    }

    function areElementsMergeable(el1, el2) {
        return el1.tagName == el2.tagName
            && haveSameClasses(el1, el2)
            && elementsHaveSameNonClassAttributes(el1, el2)
            && getComputedStyleProperty(el1, "display") == "inline"
            && getComputedStyleProperty(el2, "display") == "inline";
    }

    function createAdjacentMergeableTextNodeGetter(forward) {
        var propName = forward ? "nextSibling" : "previousSibling";

        return function(textNode, checkParentElement) {
            var el = textNode.parentNode;
            var adjacentNode = textNode[propName];
            if (adjacentNode) {
                // Can merge if the node's previous/next sibling is a text node
                if (adjacentNode && adjacentNode.nodeType == 3) {
                    return adjacentNode;
                }
            } else if (checkParentElement) {
                // Compare text node parent element with its sibling
                adjacentNode = el[propName];
                if (adjacentNode && adjacentNode.nodeType == 1 && areElementsMergeable(el, adjacentNode)) {
                    return adjacentNode[forward ? "firstChild" : "lastChild"];
                }
            }
            return null;
        };
    }

    var getPreviousMergeableTextNode = createAdjacentMergeableTextNodeGetter(false),
        getNextMergeableTextNode = createAdjacentMergeableTextNodeGetter(true);


    function Merge(firstNode) {
        this.isElementMerge = (firstNode.nodeType == 1);
        this.firstTextNode = this.isElementMerge ? firstNode.lastChild : firstNode;
        this.textNodes = [this.firstTextNode];
    }

    Merge.prototype = {
        doMerge: function(positionsToPreserve) {
            var textBits = [], combinedTextLength = 0, textNode, parent, text;
            for (var i = 0, len = this.textNodes.length, j, position; i < len; ++i) {
                textNode = this.textNodes[i];
                parent = textNode.parentNode;
                if (i > 0) {
                    parent.removeChild(textNode);
                    if (!parent.hasChildNodes()) {
                        parent.parentNode.removeChild(parent);
                    }
                    if (positionsToPreserve) {
                        for (j = 0; position = positionsToPreserve[j++]; ) {
                            // Handle case where position is inside the text node being merged into a preceding node
                            if (position.node == textNode) {
                                position.node = this.firstTextNode;
                                position.offset += combinedTextLength;
                            }
                        }
                    }
                }
                textBits[i] = textNode.data;
                combinedTextLength += textNode.data.length;
            }
            this.firstTextNode.data = text = textBits.join("");
            return text;
        },

        getLength: function() {
            var i = this.textNodes.length, len = 0;
            while (i--) {
                len += this.textNodes[i].length;
            }
            return len;
        },

        toString: function() {
            var textBits = [];
            for (var i = 0, len = this.textNodes.length; i < len; ++i) {
                textBits[i] = "'" + this.textNodes[i].data + "'";
            }
            return "[Merge(" + textBits.join(",") + ")]";
        }
    };

    // TODO: Populate this with every attribute name that corresponds to a property with a different name
    var attrNamesForProperties = {};

    function Applier(options) {
        this.tag = null;
        this.tags = [];
        this.classes = [];
        this.attributes = [];
        this.ignoreWhiteSpace = true;
        this.applyToEditableOnly = false;
        this.useExistingElements = true;
        this.ignoreClasses = false;
        this.ignoreAttributes = false;

        for (var key in options) {
            this[key] = options[key];
        }

        // Uppercase tag names
        for (var i = 0, l = this.tags.length; i < l; i++) {
            this.tags[i] = this.tags[i].toUpperCase();
        }
        if (this.tag) {
            this.tag = this.tag.toUpperCase();
            this.tags.push(this.tag);
        }
    }

    Applier.prototype = {
        copyPropertiesToElement: function(props, el, createCopy) {
            var s, elStyle, elProps = {}, elPropsStyle, propValue, elPropValue, attrName;

            for (var p in props) {
                if (props.hasOwnProperty(p)) {
                    propValue = props[p];
                    elPropValue = el[p];

                    // Special case for class. The copied properties object has the applier's CSS class as well as its
                    // own to simplify checks when removing styling elements
                    if (p == "className") {
                        addClass(el, propValue);
                        addClass(el, this.cssClass);
                        el[p] = sortClassName(el[p]);
                        if (createCopy) {
                            elProps[p] = el[p];
                        }
                    }

                    // Special case for style
                    else if (p == "style") {
                        elStyle = elPropValue;
                        if (createCopy) {
                            elProps[p] = elPropsStyle = {};
                        }
                        for (s in props[p]) {
                            elStyle[s] = propValue[s];
                            if (createCopy) {
                                elPropsStyle[s] = elStyle[s];
                            }
                        }
                        this.attrExceptions.push(p);
                    } else {
                        el[p] = propValue;
                        // Copy the property back from the dummy element so that later comparisons to check whether elements
                        // may be removed are checking against the right value. For example, the href property of an element
                        // returns a fully qualified URL even if it was previously assigned a relative URL.
                        if (createCopy) {
                            elProps[p] = el[p];

                            // Not all properties map to identically named attributes
                            attrName = attrNamesForProperties.hasOwnProperty(p) ? attrNamesForProperties[p] : p;
                            this.attrExceptions.push(attrName);
                        }
                    }
                }
            }

            return createCopy ? elProps : "";
        },

        isValid: function(node) {
            return this.isValidTag(node)
                && this.hasClasses(node)
                && this.hasAttributes(node);
        },

        isValidTag: function(node) {
            // Only elements are valid
            if (node.nodeType !== 1) {
                return false;
            }

            // Check if tag names are ignored
            if (this.tags.length === 0) {
                return true;
            }

            // Check for valid tag name
            for (var i = 0, l = this.tags.length; i < l; i++) {
                if (node.tagName === this.tags[i]) {
                    return true;
                }
            }
            return false;
        },

        hasClasses: function(node) {
            if (this.ignoreClasses) {
                return true;
            }
            for (var i = 0, l = this.classes.length; i < l; i++) {
                if (!hasClass(node, this.classes[i])) {
                    return false;
                }
            }
            return true;
        },

        hasAttributes: function(node) {
            if (this.ignoreAttributes) {
                return true;
            }
            for (var key in this.attributes) {
                if (!node.hasAttribute(key)) {
                    return false;
                }
            }
            return true;
        },

        getSelfOrAncestor: function(node) {
            while (node) {
                if (this.isValid(node)) {
                    return node;
                }
                node = node.parentNode;
            }
            return null;
        },

        isModifiable: function(node) {
            return !this.applyToEditableOnly || isEditable(node);
        },

        // White space adjacent to an unwrappable node can be ignored for wrapping
        isIgnorableWhiteSpaceNode: function(node) {
            return this.ignoreWhiteSpace && node && node.nodeType == 3 && isUnrenderedWhiteSpaceNode(node);
        },

        // Normalizes nodes after applying a CSS class to a Range.
        postApply: function(textNodes, range, positionsToPreserve, isUndo) {
            var firstNode = textNodes[0], lastNode = textNodes[textNodes.length - 1];

            var merges = [], currentMerge;

            var rangeStartNode = firstNode, rangeEndNode = lastNode;
            var rangeStartOffset = 0, rangeEndOffset = lastNode.length;

            var textNode, precedingTextNode;

            // Check for every required merge and create a Merge object for each
            for (var i = 0, len = textNodes.length; i < len; ++i) {
                textNode = textNodes[i];
                precedingTextNode = getPreviousMergeableTextNode(textNode, !isUndo);
                if (precedingTextNode) {
                    if (!currentMerge) {
                        currentMerge = new Merge(precedingTextNode);
                        merges.push(currentMerge);
                    }
                    currentMerge.textNodes.push(textNode);
                    if (textNode === firstNode) {
                        rangeStartNode = currentMerge.firstTextNode;
                        rangeStartOffset = rangeStartNode.length;
                    }
                    if (textNode === lastNode) {
                        rangeEndNode = currentMerge.firstTextNode;
                        rangeEndOffset = currentMerge.getLength();
                    }
                } else {
                    currentMerge = null;
                }
            }

            // Test whether the first node after the range needs merging
            var nextTextNode = getNextMergeableTextNode(lastNode, !isUndo);

            if (nextTextNode) {
                if (!currentMerge) {
                    currentMerge = new Merge(lastNode);
                    merges.push(currentMerge);
                }
                currentMerge.textNodes.push(nextTextNode);
            }

            // Apply the merges
            if (merges.length) {
                for (i = 0, len = merges.length; i < len; ++i) {
                    merges[i].doMerge(positionsToPreserve);
                }

                // Set the range boundaries
                range.setStartAndEnd(rangeStartNode, rangeStartOffset, rangeEndNode, rangeEndOffset);
            }
        },

        createContainer: function(doc) {
            var element = doc.createElement(this.tag);
            this.addClasses(element);
            this.addAttributes(element);
            return element;
        },

        addClasses: function(node) {
            for (var i = 0, l = this.classes.length; i < l; i++) {
                addClass(node, this.classes[i]);
            }
        },

        addAttributes: function(node) {
            for (var key in this.attributes) {
                node.setAttribute(key, this.attributes[key]);
            }
        },

        removeClasses: function(node) {
            for (var i = 0, l = this.classes.length; i < l; i++) {
                removeClass(node, this.classes[i]);
            }
        },

        removeAttributes: function(node) {
            for (var key in this.attributes) {
                node.removeAttribute(key);
            }
        },

        applyToTextNode: function(textNode, positionsToPreserve) {
            var parent = textNode.parentNode;
            if (parent.childNodes.length == 1
                    && dom.arrayContains(this.tags, parent.tagName)
                    && this.useExistingElements) {
                this.addClasses(parent);
                this.addAttributes(parent);
            } else {
                var element = this.createContainer(dom.getDocument(textNode));
                textNode.parentNode.insertBefore(element, textNode);
                element.appendChild(textNode);
            }
        },

        isRemovable: function(node) {
            return this.tags.length > 0
                && this.isValidTag(node)
                && this.hasClasses(node)
                && this.hasAttributes(node)
                && this.isModifiable(node);
        },

        undoToTextNode: function(textNode, range, ancestor, positionsToPreserve) {
            if (!range.containsNode(ancestor)) {
                // Split out the portion of the ancestor from which we can remove the CSS class
                //var parent = ancestorWithClass.parentNode, index = dom.getNodeIndex(ancestorWithClass);
                var ancestorRange = range.cloneRange();
                ancestorRange.selectNode(ancestor);
                if (ancestorRange.isPointInRange(range.endContainer, range.endOffset)) {
                    splitNodeAt(ancestor, range.endContainer, range.endOffset, positionsToPreserve);
                    range.setEndAfter(ancestor);
                }
                if (ancestorRange.isPointInRange(range.startContainer, range.startOffset)) {
                    ancestor = splitNodeAt(ancestor, range.startContainer, range.startOffset, positionsToPreserve);
                }
            }
            if (this.isRemovable(ancestor)) {
                replaceWithOwnChildrenPreservingPositions(ancestor, positionsToPreserve);
            } else {
                this.removeClasses(ancestor);
                this.removeAttributes(ancestor);
            }
        },

        applyToRange: function(range, rangesToPreserve) {
            rangesToPreserve = rangesToPreserve || [];

            // Create an array of range boundaries to preserve
            var positionsToPreserve = getRangeBoundaries(rangesToPreserve || []);

            range.splitBoundariesPreservingPositions(positionsToPreserve);
            var textNodes = getEffectiveTextNodes(range);

            if (textNodes.length) {
                for (var i = 0, textNode; textNode = textNodes[i++]; ) {
                    if (!this.isIgnorableWhiteSpaceNode(textNode)
                            && !this.getSelfOrAncestor(textNode)
                            && this.isModifiable(textNode)) {
                        this.applyToTextNode(textNode, positionsToPreserve);
                    }
                }
                range.setStart(textNodes[0], 0);
                textNode = textNodes[textNodes.length - 1];
                range.setEnd(textNode, textNode.length);
                if (this.normalize) {
                    this.postApply(textNodes, range, positionsToPreserve, false);
                }

                // Update the ranges from the preserved boundary positions
                updateRangesFromBoundaries(rangesToPreserve, positionsToPreserve);
            }
        },

        applyToRanges: function(ranges) {
            var i = ranges.length;
            while (i--) {
                this.applyToRange(ranges[i], ranges);
            }
            return ranges;
        },

        applyToSelection: function(win) {
            var sel = api.getSelection(win);
            sel.setRanges( this.applyToRanges(sel.getAllRanges()) );
        },

        undoToRange: function(range, rangesToPreserve) {

            // Create an array of range boundaries to preserve
            rangesToPreserve = rangesToPreserve || [];
            var positionsToPreserve = getRangeBoundaries(rangesToPreserve);

            range.splitBoundariesPreservingPositions(positionsToPreserve);
            var textNodes = getEffectiveTextNodes(range);
            var textNode, validAncestor;
            var lastTextNode = textNodes[textNodes.length - 1];

            if (textNodes.length) {
                for (var i = 0, l = textNodes.length; i < l; ++i) {
                    textNode = textNodes[i];
                    validAncestor = this.getSelfOrAncestor(textNode);
                    if (validAncestor
                            && this.isModifiable(textNode)) {
                        this.undoToTextNode(textNode, range, validAncestor, positionsToPreserve);
                    }

                    // Ensure the range is still valid
                    range.setStart(textNodes[0], 0);
                    range.setEnd(lastTextNode, lastTextNode.length);
                }


                if (this.normalize) {
                    this.postApply(textNodes, range, positionsToPreserve, true);
                }

                // Update the ranges from the preserved boundary positions
                updateRangesFromBoundaries(rangesToPreserve, positionsToPreserve);
            }
        },

        undoToRanges: function(ranges) {
            // Get ranges returned in document order
            var i = ranges.length;

            while (i--) {
                //this.undoToRange(ranges[i], arrayWithoutValue(ranges, ranges[i]));
                this.undoToRange(ranges[i], ranges);
            }

            return ranges;
        },

        undoToSelection: function(win) {
            var sel = api.getSelection(win);
            var ranges = api.getSelection(win).getAllRanges();
            this.undoToRanges(ranges);
            sel.setRanges(ranges);
        },

        getTextSelectedByRange: function(textNode, range) {
            var textRange = range.cloneRange();
            textRange.selectNodeContents(textNode);

            var intersectionRange = textRange.intersection(range);
            var text = intersectionRange ? intersectionRange.toString() : "";
            textRange.detach();

            return text;
        },

        isAppliedToRange: function(range) {
            if (range.collapsed) {
                return !!this.getSelfOrAncestor(range.commonAncestorContainer);
            } else {
                var textNodes = range.getNodes( [3] );
                for (var i = 0, textNode; textNode = textNodes[i++]; ) {
                    if (!this.isIgnorableWhiteSpaceNode(textNode)
                            && rangeSelectsAnyText(range, textNode)
                            && this.isModifiable(textNode)
                            && !this.getSelfOrAncestor(textNode)) {
                        return false;
                    }
                }
                return true;
            }
        },

        isAppliedToRanges: function(ranges) {
            var i = ranges.length;
            while (i--) {
                if (!this.isAppliedToRange(ranges[i])) {
                    return false;
                }
            }
            return true;
        },

        isAppliedToSelection: function(win) {
            var sel = api.getSelection(win);
            return this.isAppliedToRanges(sel.getAllRanges());
        },

        toggleRange: function(range) {
            if (this.isAppliedToRange(range)) {
                this.undoToRange(range);
            } else {
                this.applyToRange(range);
            }
        },

        toggleRanges: function(ranges) {
            if (this.isAppliedToRanges(ranges)) {
                this.undoToRanges(ranges);
            } else {
                this.applyToRanges(ranges);
            }
        },

        toggleSelection: function(win) {
            if (this.isAppliedToSelection(win)) {
                this.undoToSelection(win);
            } else {
                this.applyToSelection(win);
            }
        },

        detach: function() {}
    };

    function createApplier(options) {
        return new Applier(options);
    }

    Applier.util = {
    };

    api.Applier = Applier;
    api.createApplier = createApplier;
});

                /* End of file: build/default/src/dependencies/rangy/rangy-applier.js */
            
                /* File: build/default/src/dependencies/rangy/rangy-cssclassapplier.js */
                /**
 * CSS Class Applier module for Rangy.
 * Adds, removes and toggles CSS classes on Ranges and Selections
 *
 * Part of Rangy, a cross-browser JavaScript range and selection library
 * http://code.google.com/p/rangy/
 *
 * Depends on Rangy core.
 *
 * Copyright 2012, Tim Down
 * Licensed under the MIT license.
 * Version: 1.3alpha.681
 * Build date: 20 July 2012
 */
rangy.createModule("CssClassApplier", function(api, module) {
    api.requireModules( ["WrappedSelection", "WrappedRange"] );

    var dom = api.dom;
    var DomPosition = dom.DomPosition;


    var defaultTagName = "span";

    function trim(str) {
        return str.replace(/^\s\s*/, "").replace(/\s\s*$/, "");
    }

    function hasClass(el, cssClass) {
        return el.className && new RegExp("(?:^|\\s)" + cssClass + "(?:\\s|$)").test(el.className);
    }

    function addClass(el, cssClass) {
        if (el.className) {
            if (!hasClass(el, cssClass)) {
                el.className += " " + cssClass;
            }
        } else {
            el.className = cssClass;
        }
    }

    var removeClass = (function() {
        function replacer(matched, whiteSpaceBefore, whiteSpaceAfter) {
            return (whiteSpaceBefore && whiteSpaceAfter) ? " " : "";
        }

        return function(el, cssClass) {
            if (el.className) {
                el.className = el.className.replace(new RegExp("(^|\\s)" + cssClass + "(\\s|$)"), replacer);
            }
        };
    })();

    function sortClassName(className) {
        return className.split(/\s+/).sort().join(" ");
    }

    function getSortedClassName(el) {
        return sortClassName(el.className);
    }

    function haveSameClasses(el1, el2) {
        return getSortedClassName(el1) == getSortedClassName(el2);
    }

    function compareRanges(r1, r2) {
        return r1.compareBoundaryPoints(r2.START_TO_START, r2);
    }

    function mergeOverlappingRanges(ranges) {

        for (var i = 0, len = ranges.length, r1, r2, j; i < len; ++i) {
        }
    }

    // Sorts and merges any overlapping ranges
    function normalizeRanges(ranges) {
        var sortedRanges = ranges.slice(0);
        sortedRanges.sort(compareRanges);
        var newRanges = [];

        // Check for overlaps and merge where they exist
        for (var i = 1, len = ranges.length, range, mergedRange = ranges[0]; i < len; ++i) {
            range = ranges[i];
            if (range.intersectsOrTouchesRange(mergedRange)) {
                mergedRange = mergedRange.union(range);
            } else {
                newRanges.push(mergedRange);
                mergedRange = range;
            }

        }
        newRanges.push(mergedRange);
        return newRanges;
    }

    function movePosition(position, oldParent, oldIndex, newParent, newIndex) {
        var node = position.node, offset = position.offset;

        var newNode = node, newOffset = offset;

        if (node == newParent && offset > newIndex) {
            newOffset++;
        }

        if (node == oldParent && (offset == oldIndex  || offset == oldIndex + 1)) {
            newNode = newParent;
            newOffset += newIndex - oldIndex;
        }

        if (node == oldParent && offset > oldIndex + 1) {
            newOffset--;
        }

        position.node = newNode;
        position.offset = newOffset;
    }

    function movePreservingPositions(node, newParent, newIndex, positionsToPreserve) {
        // For convenience, allow newIndex to be -1 to mean "insert at the end".
        if (newIndex == -1) {
            newIndex = newParent.childNodes.length;
        }

        var oldParent = node.parentNode;
        var oldIndex = dom.getNodeIndex(node);

        for (var i = 0, position; position = positionsToPreserve[i++]; ) {
            movePosition(position, oldParent, oldIndex, newParent, newIndex);
        }

        // Now actually move the node.
        if (newParent.childNodes.length == newIndex) {
            newParent.appendChild(node);
        } else {
            newParent.insertBefore(node, newParent.childNodes[newIndex]);
        }
    }

    function moveChildrenPreservingPositions(node, newParent, newIndex, removeNode, positionsToPreserve) {
        var child, children = [];
        while ( (child = node.firstChild) ) {
            movePreservingPositions(child, newParent, newIndex++, positionsToPreserve);
            children.push(child);
        }
        if (removeNode) {
            node.parentNode.removeChild(node);
        }
        return children;
    }

    function replaceWithOwnChildrenPreservingPositions(element, positionsToPreserve) {
        return moveChildrenPreservingPositions(element, element.parentNode, dom.getNodeIndex(element), true, positionsToPreserve);
    }

    function rangeSelectsAnyText(range, textNode) {
        var textRange = range.cloneRange();
        textRange.selectNodeContents(textNode);

        var intersectionRange = textRange.intersection(range);
        var text = intersectionRange ? intersectionRange.toString() : "";
        textRange.detach();

        return text != "";
    }

    function getEffectiveTextNodes(range) {
        return range.getNodes([3], function(textNode) {
            return rangeSelectsAnyText(range, textNode);
        });
    }

    function elementsHaveSameNonClassAttributes(el1, el2) {
        if (el1.attributes.length != el2.attributes.length) return false;
        for (var i = 0, len = el1.attributes.length, attr1, attr2, name; i < len; ++i) {
            attr1 = el1.attributes[i];
            name = attr1.name;
            if (name != "class") {
                attr2 = el2.attributes.getNamedItem(name);
                if (attr1.specified != attr2.specified) return false;
                if (attr1.specified && attr1.nodeValue !== attr2.nodeValue) return false;
            }
        }
        return true;
    }

    function elementHasNonClassAttributes(el, exceptions) {
        for (var i = 0, len = el.attributes.length, attrName; i < len; ++i) {
            attrName = el.attributes[i].name;
            if ( !(exceptions && dom.arrayContains(exceptions, attrName)) && el.attributes[i].specified && attrName != "class") {
                return true;
            }
        }
        return false;
    }

    function elementHasProps(el, props) {
        var propValue;
        for (var p in props) {
            if (props.hasOwnProperty(p)) {
                propValue = props[p];
                if (typeof propValue == "object") {
                    if (!elementHasProps(el[p], propValue)) {
                        return false;
                    }
                } else if (el[p] !== propValue) {
                    return false;
                }
            }
        }
        return true;
    }

    var getComputedStyleProperty;

    if (typeof window.getComputedStyle != "undefined") {
        getComputedStyleProperty = function(el, propName) {
            return dom.getWindow(el).getComputedStyle(el, null)[propName];
        };
    } else if (typeof document.documentElement.currentStyle != "undefined") {
        getComputedStyleProperty = function(el, propName) {
            return el.currentStyle[propName];
        };
    } else {
        module.fail("No means of obtaining computed style properties found");
    }

    var isEditableElement;

    (function() {
        var testEl = document.createElement("div");
        if (typeof testEl.isContentEditable == "boolean") {
            isEditableElement = function(node) {
                return node && node.nodeType == 1 && node.isContentEditable;
            };
        } else {
            isEditableElement = function(node) {
                if (!node || node.nodeType != 1 || node.contentEditable == "false") {
                    return false;
                }
                return node.contentEditable == "true" || isEditableElement(node.parentNode);
            };
        }
    })();

    function isEditingHost(node) {
        var parent;
        return node && node.nodeType == 1
            && (( (parent = node.parentNode) && parent.nodeType == 9 && parent.designMode == "on")
            || (isEditableElement(node) && !isEditableElement(node.parentNode)));
    }

    function isEditable(node) {
        return (isEditableElement(node) || (node.nodeType != 1 && isEditableElement(node.parentNode))) && !isEditingHost(node);
    }

    var inlineDisplayRegex = /^inline(-block|-table)?$/i;

    function isNonInlineElement(node) {
        return node && node.nodeType == 1 && !inlineDisplayRegex.test(getComputedStyleProperty(node, "display"));
    }

    // White space characters as defined by HTML 4 (http://www.w3.org/TR/html401/struct/text.html)
    var htmlNonWhiteSpaceRegex = /[^\r\n\t\f \u200B]/;

    function isUnrenderedWhiteSpaceNode(node) {
        if (node.data.length == 0) {
            return true;
        }
        if (htmlNonWhiteSpaceRegex.test(node.data)) {
            return false;
        }
        var cssWhiteSpace = getComputedStyleProperty(node.parentNode, "whiteSpace");
        switch (cssWhiteSpace) {
            case "pre":
            case "pre-wrap":
            case "-moz-pre-wrap":
                return false;
            case "pre-line":
                if (/[\r\n]/.test(node.data)) {
                    return false;
                }
        }

        // We now have a whitespace-only text node that may be rendered depending on its context. If it is adjacent to a
        // non-inline element, it will not be rendered. This seems to be a good enough definition.
        return isNonInlineElement(node.previousSibling) || isNonInlineElement(node.nextSibling);
    }

    function getRangeBoundaries(ranges) {
        var positions = [], i, range;
        for (i = 0; range = ranges[i++]; ) {
            positions.push(
                new DomPosition(range.startContainer, range.startOffset),
                new DomPosition(range.endContainer, range.endOffset)
            );
        }
        return positions;
    }

    function updateRangesFromBoundaries(ranges, positions) {
        for (var i = 0, range, start, end, len = ranges.length; i < len; ++i) {
            range = ranges[i];
            start = positions[i * 2];
            end = positions[i * 2 + 1];
            range.setStartAndEnd(start.node, start.offset, end.node, end.offset);
        }
    }

    function arrayWithoutValue(arr, val) {
        var newArray = [];
        for (var i = 0, len = arr.length; i < len; ++i) {
            if (arr[i] !== val) {
                newArray.push(arr[i]);
            }
        }
        return newArray;
    }

    function isSplitPoint(node, offset) {
        if (dom.isCharacterDataNode(node)) {
            if (offset == 0) {
                return !!node.previousSibling;
            } else if (offset == node.length) {
                return !!node.nextSibling;
            } else {
                return true;
            }
        }

        return offset > 0 && offset < node.childNodes.length;
    }

    function splitNodeAt(node, descendantNode, descendantOffset, positionsToPreserve) {
        var newNode, parentNode;
        var splitAtStart = (descendantOffset == 0);

        if (dom.isAncestorOf(descendantNode, node)) {
            return node;
        }

        if (dom.isCharacterDataNode(descendantNode)) {
            var descendantIndex = dom.getNodeIndex(descendantNode);
            if (descendantOffset == 0) {
                descendantOffset = descendantIndex;
            } else if (descendantOffset == descendantNode.length) {
                descendantOffset = descendantIndex + 1;
            } else {
                throw module.createError("splitNodeAt() should not be called with offset in the middle of a data node ("
                    + descendantOffset + " in " + descendantNode.data);
            }
            descendantNode = descendantNode.parentNode;
        }

        if (isSplitPoint(descendantNode, descendantOffset)) {
            // descendantNode is now guaranteed not to be a text or other character node
            newNode = descendantNode.cloneNode(false);
            parentNode = descendantNode.parentNode;
            if (newNode.id) {
                newNode.removeAttribute("id");
            }
            var child, newChildIndex = 0;

            while ( (child = descendantNode.childNodes[descendantOffset]) ) {
                movePreservingPositions(child, newNode, newChildIndex++, positionsToPreserve);
                //newNode.appendChild(child);
            }
            movePreservingPositions(newNode, parentNode, dom.getNodeIndex(descendantNode) + 1, positionsToPreserve);
            //dom.insertAfter(newNode, descendantNode);
            return (descendantNode == node) ? newNode : splitNodeAt(node, parentNode, dom.getNodeIndex(newNode), positionsToPreserve);
        } else if (node != descendantNode) {
            newNode = descendantNode.parentNode;

            // Work out a new split point in the parent node
            var newNodeIndex = dom.getNodeIndex(descendantNode);

            if (!splitAtStart) {
                newNodeIndex++;
            }
            return splitNodeAt(node, newNode, newNodeIndex, positionsToPreserve);
        }
        return node;
    }

    function areElementsMergeable(el1, el2) {
        return el1.tagName == el2.tagName
            && haveSameClasses(el1, el2)
            && elementsHaveSameNonClassAttributes(el1, el2)
            && getComputedStyleProperty(el1, "display") == "inline"
            && getComputedStyleProperty(el2, "display") == "inline";
    }

    function createAdjacentMergeableTextNodeGetter(forward) {
        var propName = forward ? "nextSibling" : "previousSibling";

        return function(textNode, checkParentElement) {
            var el = textNode.parentNode;
            var adjacentNode = textNode[propName];
            if (adjacentNode) {
                // Can merge if the node's previous/next sibling is a text node
                if (adjacentNode && adjacentNode.nodeType == 3) {
                    return adjacentNode;
                }
            } else if (checkParentElement) {
                // Compare text node parent element with its sibling
                adjacentNode = el[propName];
                if (adjacentNode && adjacentNode.nodeType == 1 && areElementsMergeable(el, adjacentNode)) {
                    return adjacentNode[forward ? "firstChild" : "lastChild"];
                }
            }
            return null;
        };
    }

    var getPreviousMergeableTextNode = createAdjacentMergeableTextNodeGetter(false),
        getNextMergeableTextNode = createAdjacentMergeableTextNodeGetter(true);


    function Merge(firstNode) {
        this.isElementMerge = (firstNode.nodeType == 1);
        this.firstTextNode = this.isElementMerge ? firstNode.lastChild : firstNode;
        this.textNodes = [this.firstTextNode];
    }

    Merge.prototype = {
        doMerge: function(positionsToPreserve) {
            var textBits = [], combinedTextLength = 0, textNode, parent, text;
            for (var i = 0, len = this.textNodes.length, j, position; i < len; ++i) {
                textNode = this.textNodes[i];
                parent = textNode.parentNode;
                if (i > 0) {
                    parent.removeChild(textNode);
                    if (!parent.hasChildNodes()) {
                        parent.parentNode.removeChild(parent);
                    }
                    if (positionsToPreserve) {
                        for (j = 0; position = positionsToPreserve[j++]; ) {
                            // Handle case where position is inside the text node being merged into a preceding node
                            if (position.node == textNode) {
                                position.node = this.firstTextNode;
                                position.offset += combinedTextLength;
                            }
                        }
                    }
                }
                textBits[i] = textNode.data;
                combinedTextLength += textNode.data.length;
            }
            this.firstTextNode.data = text = textBits.join("");
            return text;
        },

        getLength: function() {
            var i = this.textNodes.length, len = 0;
            while (i--) {
                len += this.textNodes[i].length;
            }
            return len;
        },

        toString: function() {
            var textBits = [];
            for (var i = 0, len = this.textNodes.length; i < len; ++i) {
                textBits[i] = "'" + this.textNodes[i].data + "'";
            }
            return "[Merge(" + textBits.join(",") + ")]";
        }
    };

    var optionProperties = ["elementTagName", "ignoreWhiteSpace", "applyToEditableOnly", "useExistingElements"];

    // TODO: Populate this with every attribute name that corresponds to a property with a different name
    var attrNamesForProperties = {};

    function CssClassApplier(cssClass, options, tagNames) {
        this.cssClass = cssClass;
        var normalize, i, len, propName;

        var elementPropertiesFromOptions = null;

        // Initialize from options object
        if (typeof options == "object" && options !== null) {
            tagNames = options.tagNames;
            elementPropertiesFromOptions = options.elementProperties;

            for (i = 0; propName = optionProperties[i++]; ) {
                if (options.hasOwnProperty(propName)) {
                    this[propName] = options[propName];
                }
            }
            normalize = options.normalize;
        } else {
            normalize = options;
        }

        // Backward compatibility: the second parameter can also be a Boolean indicating to normalize after unapplying
        this.normalize = (typeof normalize == "undefined") ? true : normalize;

        // Initialize element properties and attribute exceptions
        this.attrExceptions = [];
        var el = document.createElement(this.elementTagName);
        this.elementProperties = this.copyPropertiesToElement(elementPropertiesFromOptions, el, true);

        this.elementSortedClassName = this.elementProperties.hasOwnProperty("className") ?
            this.elementProperties.className : cssClass;

        // Initialize tag names
        this.applyToAnyTagName = false;
        var type = typeof tagNames;
        if (type == "string") {
            if (tagNames == "*") {
                this.applyToAnyTagName = true;
            } else {
                this.tagNames = trim(tagNames.toLowerCase()).split(/\s*,\s*/);
            }
        } else if (type == "object" && typeof tagNames.length == "number") {
            this.tagNames = [];
            for (i = 0, len = tagNames.length; i < len; ++i) {
                if (tagNames[i] == "*") {
                    this.applyToAnyTagName = true;
                } else {
                    this.tagNames.push(tagNames[i].toLowerCase());
                }
            }
        } else {
            this.tagNames = [this.elementTagName];
        }
    }

    CssClassApplier.prototype = {
        elementTagName: defaultTagName,
        elementProperties: {},
        ignoreWhiteSpace: true,
        applyToEditableOnly: false,
        useExistingElements: true,

        copyPropertiesToElement: function(props, el, createCopy) {
            var s, elStyle, elProps = {}, elPropsStyle, propValue, elPropValue, attrName;

            for (var p in props) {
                if (props.hasOwnProperty(p)) {
                    propValue = props[p];
                    elPropValue = el[p];

                    // Special case for class. The copied properties object has the applier's CSS class as well as its
                    // own to simplify checks when removing styling elements
                    if (p == "className") {
                        addClass(el, propValue);
                        addClass(el, this.cssClass);
                        el[p] = sortClassName(el[p]);
                        if (createCopy) {
                            elProps[p] = el[p];
                        }
                    }

                    // Special case for style
                    else if (p == "style") {
                        elStyle = elPropValue;
                        if (createCopy) {
                            elProps[p] = elPropsStyle = {};
                        }
                        for (s in props[p]) {
                            elStyle[s] = propValue[s];
                            if (createCopy) {
                                elPropsStyle[s] = elStyle[s];
                            }
                        }
                        this.attrExceptions.push(p);
                    } else {
                        el[p] = propValue;
                        // Copy the property back from the dummy element so that later comparisons to check whether elements
                        // may be removed are checking against the right value. For example, the href property of an element
                        // returns a fully qualified URL even if it was previously assigned a relative URL.
                        if (createCopy) {
                            elProps[p] = el[p];

                            // Not all properties map to identically named attributes
                            attrName = attrNamesForProperties.hasOwnProperty(p) ? attrNamesForProperties[p] : p;
                            this.attrExceptions.push(attrName);
                        }
                    }
                }
            }

            return createCopy ? elProps : "";
        },

        hasClass: function(node) {
            return node.nodeType == 1 && dom.arrayContains(this.tagNames, node.tagName.toLowerCase()) && hasClass(node, this.cssClass);
        },

        getSelfOrAncestorWithClass: function(node) {
            while (node) {
                if (this.hasClass(node)) {
                    return node;
                }
                node = node.parentNode;
            }
            return null;
        },

        isModifiable: function(node) {
            return !this.applyToEditableOnly || isEditable(node);
        },

        // White space adjacent to an unwrappable node can be ignored for wrapping
        isIgnorableWhiteSpaceNode: function(node) {
            return this.ignoreWhiteSpace && node && node.nodeType == 3 && isUnrenderedWhiteSpaceNode(node);
        },

        // Normalizes nodes after applying a CSS class to a Range.
        postApply: function(textNodes, range, positionsToPreserve, isUndo) {
            var firstNode = textNodes[0], lastNode = textNodes[textNodes.length - 1];

            var merges = [], currentMerge;

            var rangeStartNode = firstNode, rangeEndNode = lastNode;
            var rangeStartOffset = 0, rangeEndOffset = lastNode.length;

            var textNode, precedingTextNode;

            // Check for every required merge and create a Merge object for each
            for (var i = 0, len = textNodes.length; i < len; ++i) {
                textNode = textNodes[i];
                precedingTextNode = getPreviousMergeableTextNode(textNode, !isUndo);
                if (precedingTextNode) {
                    if (!currentMerge) {
                        currentMerge = new Merge(precedingTextNode);
                        merges.push(currentMerge);
                    }
                    currentMerge.textNodes.push(textNode);
                    if (textNode === firstNode) {
                        rangeStartNode = currentMerge.firstTextNode;
                        rangeStartOffset = rangeStartNode.length;
                    }
                    if (textNode === lastNode) {
                        rangeEndNode = currentMerge.firstTextNode;
                        rangeEndOffset = currentMerge.getLength();
                    }
                } else {
                    currentMerge = null;
                }
            }

            // Test whether the first node after the range needs merging
            var nextTextNode = getNextMergeableTextNode(lastNode, !isUndo);

            if (nextTextNode) {
                if (!currentMerge) {
                    currentMerge = new Merge(lastNode);
                    merges.push(currentMerge);
                }
                currentMerge.textNodes.push(nextTextNode);
            }

            // Apply the merges
            if (merges.length) {
                for (i = 0, len = merges.length; i < len; ++i) {
                    merges[i].doMerge(positionsToPreserve);
                }

                // Set the range boundaries
                range.setStartAndEnd(rangeStartNode, rangeStartOffset, rangeEndNode, rangeEndOffset);
            }
        },

        createContainer: function(doc) {
            var el = doc.createElement(this.elementTagName);
            this.copyPropertiesToElement(this.elementProperties, el, false);
            addClass(el, this.cssClass);
            return el;
        },

        applyToTextNode: function(textNode, positionsToPreserve) {
            var parent = textNode.parentNode;
            if (parent.childNodes.length == 1 && dom.arrayContains(this.tagNames, parent.tagName.toLowerCase()) && this.useExistingElements) {
                addClass(parent, this.cssClass);
            } else {
                var el = this.createContainer(dom.getDocument(textNode));
                textNode.parentNode.insertBefore(el, textNode);
                el.appendChild(textNode);
            }
        },

        isRemovable: function(el) {
            return el.tagName.toLowerCase() == this.elementTagName
                && getSortedClassName(el) == this.elementSortedClassName
                && elementHasProps(el, this.elementProperties)
                && !elementHasNonClassAttributes(el, this.attrExceptions)
                && this.isModifiable(el);
        },

        undoToTextNode: function(textNode, range, ancestorWithClass, positionsToPreserve) {
            if (!range.containsNode(ancestorWithClass)) {
                // Split out the portion of the ancestor from which we can remove the CSS class
                //var parent = ancestorWithClass.parentNode, index = dom.getNodeIndex(ancestorWithClass);
                var ancestorRange = range.cloneRange();
                ancestorRange.selectNode(ancestorWithClass);
                if (ancestorRange.isPointInRange(range.endContainer, range.endOffset)) {
                    splitNodeAt(ancestorWithClass, range.endContainer, range.endOffset, positionsToPreserve);
                    range.setEndAfter(ancestorWithClass);
                }
                if (ancestorRange.isPointInRange(range.startContainer, range.startOffset)) {
                    ancestorWithClass = splitNodeAt(ancestorWithClass, range.startContainer, range.startOffset, positionsToPreserve);
                }
            }
            if (this.isRemovable(ancestorWithClass)) {
                replaceWithOwnChildrenPreservingPositions(ancestorWithClass, positionsToPreserve);
            } else {
                removeClass(ancestorWithClass, this.cssClass);
            }
        },

        applyToRange: function(range, rangesToPreserve) {
            rangesToPreserve = rangesToPreserve || [];

            // Create an array of range boundaries to preserve
            var positionsToPreserve = getRangeBoundaries(rangesToPreserve || []);

            range.splitBoundariesPreservingPositions(positionsToPreserve);
            var textNodes = getEffectiveTextNodes(range);

            if (textNodes.length) {
                for (var i = 0, textNode; textNode = textNodes[i++]; ) {
                    if (!this.isIgnorableWhiteSpaceNode(textNode) && !this.getSelfOrAncestorWithClass(textNode)
                            && this.isModifiable(textNode)) {
                        this.applyToTextNode(textNode, positionsToPreserve);
                    }
                }
                range.setStart(textNodes[0], 0);
                textNode = textNodes[textNodes.length - 1];
                range.setEnd(textNode, textNode.length);
                if (this.normalize) {
                    this.postApply(textNodes, range, positionsToPreserve, false);
                }

                // Update the ranges from the preserved boundary positions
                updateRangesFromBoundaries(rangesToPreserve, positionsToPreserve);
            }
        },

        applyToRanges: function(ranges) {

            var i = ranges.length;
            while (i--) {
                this.applyToRange(ranges[i], ranges);
            }


            return ranges;
        },

        applyToSelection: function(win) {
            var sel = api.getSelection(win);
            sel.setRanges( this.applyToRanges(sel.getAllRanges()) );
        },

        undoToRange: function(range, rangesToPreserve) {
            // Create an array of range boundaries to preserve
            rangesToPreserve = rangesToPreserve || [];
            var positionsToPreserve = getRangeBoundaries(rangesToPreserve);


            range.splitBoundariesPreservingPositions(positionsToPreserve);
            var textNodes = getEffectiveTextNodes(range);
            var textNode, ancestorWithClass;
            var lastTextNode = textNodes[textNodes.length - 1];

            if (textNodes.length) {
                for (var i = 0, len = textNodes.length; i < len; ++i) {
                    textNode = textNodes[i];
                    ancestorWithClass = this.getSelfOrAncestorWithClass(textNode);
                    if (ancestorWithClass && this.isModifiable(textNode)) {
                        this.undoToTextNode(textNode, range, ancestorWithClass, positionsToPreserve);
                    }

                    // Ensure the range is still valid
                    range.setStart(textNodes[0], 0);
                    range.setEnd(lastTextNode, lastTextNode.length);
                }


                if (this.normalize) {
                    this.postApply(textNodes, range, positionsToPreserve, true);
                }

                // Update the ranges from the preserved boundary positions
                updateRangesFromBoundaries(rangesToPreserve, positionsToPreserve);
            }
        },

        undoToRanges: function(ranges) {
            // Get ranges returned in document order
            var i = ranges.length;

            while (i--) {
                //this.undoToRange(ranges[i], arrayWithoutValue(ranges, ranges[i]));
                this.undoToRange(ranges[i], ranges);
            }

            ranges.forEach(function(range) {
            });

            return ranges;
        },

        undoToSelection: function(win) {
            var sel = api.getSelection(win);
            var ranges = api.getSelection(win).getAllRanges();
            this.undoToRanges(ranges);
            sel.setRanges(ranges);
        },

        getTextSelectedByRange: function(textNode, range) {
            var textRange = range.cloneRange();
            textRange.selectNodeContents(textNode);

            var intersectionRange = textRange.intersection(range);
            var text = intersectionRange ? intersectionRange.toString() : "";
            textRange.detach();

            return text;
        },

        isAppliedToRange: function(range) {
            if (range.collapsed) {
                return !!this.getSelfOrAncestorWithClass(range.commonAncestorContainer);
            } else {
                var textNodes = range.getNodes( [3] );
                for (var i = 0, textNode; textNode = textNodes[i++]; ) {
                    if (!this.isIgnorableWhiteSpaceNode(textNode) && rangeSelectsAnyText(range, textNode)
                            && this.isModifiable(textNode) && !this.getSelfOrAncestorWithClass(textNode)) {
                        return false;
                    }
                }
                return true;
            }
        },

        isAppliedToRanges: function(ranges) {
            var i = ranges.length;
            while (i--) {
                if (!this.isAppliedToRange(ranges[i])) {
                    return false;
                }
            }
            return true;
        },

        isAppliedToSelection: function(win) {
            var sel = api.getSelection(win);
            return this.isAppliedToRanges(sel.getAllRanges());
        },

        toggleRange: function(range) {
            if (this.isAppliedToRange(range)) {
                this.undoToRange(range);
            } else {
                this.applyToRange(range);
            }
        },

        toggleRanges: function(ranges) {
            if (this.isAppliedToRanges(ranges)) {
                this.undoToRanges(ranges);
            } else {
                this.applyToRanges(ranges);
            }
        },

        toggleSelection: function(win) {
            if (this.isAppliedToSelection(win)) {
                this.undoToSelection(win);
            } else {
                this.applyToSelection(win);
            }
        },

        detach: function() {}
    };

    function createCssClassApplier(cssClass, options, tagNames) {
        return new CssClassApplier(cssClass, options, tagNames);
    }

    CssClassApplier.util = {
        hasClass: hasClass,
        addClass: addClass,
        removeClass: removeClass,
        hasSameClasses: haveSameClasses,
        replaceWithOwnChildren: replaceWithOwnChildrenPreservingPositions,
        elementsHaveSameNonClassAttributes: elementsHaveSameNonClassAttributes,
        elementHasNonClassAttributes: elementHasNonClassAttributes,
        splitNodeAt: splitNodeAt,
        isEditableElement: isEditableElement,
        isEditingHost: isEditingHost,
        isEditable: isEditable
    };

    api.CssClassApplier = CssClassApplier;
    api.createCssClassApplier = createCssClassApplier;
});

                /* End of file: build/default/src/dependencies/rangy/rangy-cssclassapplier.js */
            
                /* File: build/default/src/dependencies/rangy/rangy-selectionsaverestore.js */
                /**
 * Selection save and restore module for Rangy.
 * Saves and restores user selections using marker invisible elements in the DOM.
 *
 * Part of Rangy, a cross-browser JavaScript range and selection library
 * http://code.google.com/p/rangy/
 *
 * Depends on Rangy core.
 *
 * Copyright 2012, Tim Down
 * Licensed under the MIT license.
 * Version: 1.3alpha.681
 * Build date: 20 July 2012
 */
rangy.createModule("SaveRestore", function(api, module) {
    api.requireModules( ["DomUtil", "DomRange", "WrappedRange"] );

    var dom = api.dom;

    var markerTextChar = "\ufeff";

    function gEBI(id, doc) {
        return (doc || document).getElementById(id);
    }

    function insertRangeBoundaryMarker(range, atStart) {
        var markerId = "selectionBoundary_" + (+new Date()) + "_" + ("" + Math.random()).slice(2);
        var markerEl;
        var doc = dom.getDocument(range.startContainer);

        // Clone the Range and collapse to the appropriate boundary point
        var boundaryRange = range.cloneRange();
        boundaryRange.collapse(atStart);

        // Create the marker element containing a single invisible character using DOM methods and insert it
        markerEl = doc.createElement("span");
        markerEl.id = markerId;
        markerEl.style.lineHeight = "0";
        markerEl.style.display = "none";
        markerEl.className = "rangySelectionBoundary";
        markerEl.appendChild(doc.createTextNode(markerTextChar));

        boundaryRange.insertNode(markerEl);
        boundaryRange.detach();
        return markerEl;
    }

    function setRangeBoundary(doc, range, markerId, atStart) {
        var markerEl = gEBI(markerId, doc);
        if (markerEl) {
            range[atStart ? "setStartBefore" : "setEndBefore"](markerEl);
            markerEl.parentNode.removeChild(markerEl);
        } else {
            module.warn("Marker element has been removed. Cannot restore selection.");
        }
    }

    function compareRanges(r1, r2) {
        return r2.compareBoundaryPoints(r1.START_TO_START, r1);
    }

    function saveRange(range, backward) {
        var startEl, endEl, doc = api.DomRange.getRangeDocument(range), text = range.toString();

        if (range.collapsed) {
            endEl = insertRangeBoundaryMarker(range, false);
            return {
                document: doc,
                markerId: endEl.id,
                collapsed: true
            };
        } else {
            endEl = insertRangeBoundaryMarker(range, false);
            startEl = insertRangeBoundaryMarker(range, true);

            return {
                document: doc,
                startMarkerId: startEl.id,
                endMarkerId: endEl.id,
                collapsed: false,
                backward: backward,
                toString: function() {
                    return "original text: '" + text + "', new text: '" + range.toString() + "'";
                }
            };
        }
    }

    function restoreRange(rangeInfo, normalize) {
        var doc = rangeInfo.document;
        if (typeof normalize == "undefined") {
            normalize = true;
        }
        var range = api.createRange(doc);
        if (rangeInfo.collapsed) {
            var markerEl = gEBI(rangeInfo.markerId, doc);
            if (markerEl) {
                markerEl.style.display = "inline";
                var previousNode = markerEl.previousSibling;

                // Workaround for issue 17
                if (previousNode && previousNode.nodeType == 3) {
                    markerEl.parentNode.removeChild(markerEl);
                    range.collapseToPoint(previousNode, previousNode.length);
                } else {
                    range.collapseBefore(markerEl);
                    markerEl.parentNode.removeChild(markerEl);
                }
            } else {
                module.warn("Marker element has been removed. Cannot restore selection.");
            }
        } else {
            setRangeBoundary(doc, range, rangeInfo.startMarkerId, true);
            setRangeBoundary(doc, range, rangeInfo.endMarkerId, false);
        }

        if (normalize) {
            range.normalizeBoundaries();
        }

        return range;
    }

    function saveRanges(ranges, backward) {
        var rangeInfos = [], range, doc;

        // Order the ranges by position within the DOM, latest first, cloning the array to leave the original untouched
        ranges = ranges.slice(0);
        ranges.sort(compareRanges);

        for (var i = 0, len = ranges.length; i < len; ++i) {
            rangeInfos[i] = saveRange(ranges[i], backward);
        }

        // Now that all the markers are in place and DOM manipulation over, adjust each range's boundaries to lie
        // between its markers
        for (i = len - 1; i >= 0; --i) {
            range = ranges[i];
            doc = api.DomRange.getRangeDocument(range);
            if (range.collapsed) {
                range.collapseAfter(gEBI(rangeInfos[i].markerId, doc));
            } else {
                range.setEndBefore(gEBI(rangeInfos[i].endMarkerId, doc));
                range.setStartAfter(gEBI(rangeInfos[i].startMarkerId, doc));
            }
        }

        return rangeInfos;
    }

    function saveSelection(win) {
        if (!api.isSelectionValid(win)) {
            module.warn("Cannot save selection. This usually happens when the selection is collapsed and the selection document has lost focus.");
            return null;
        }
        var sel = api.getSelection(win);
        var ranges = sel.getAllRanges();
        var backward = (ranges.length == 1 && sel.isBackward());

        var rangeInfos = saveRanges(ranges, backward);

        // Ensure current selection is unaffected
        sel.setRanges(ranges);

        return {
            win: win,
            rangeInfos: rangeInfos,
            restored: false
        };
    }

    function restoreRanges(rangeInfos) {
        var ranges = [];

        // Ranges are in reverse order of appearance in the DOM. We want to restore earliest first to avoid
        // normalization affecting previously restored ranges.
        var rangeCount = rangeInfos.length;

        for (var i = rangeCount - 1; i >= 0; i--) {
            ranges[i] = restoreRange(rangeInfos[i], true);
        }

        return ranges;
    }

    function restoreSelection(savedSelection, preserveDirection) {
        if (!savedSelection.restored) {
            var rangeInfos = savedSelection.rangeInfos;
            var sel = api.getSelection(savedSelection.win);
            var ranges = restoreRanges(rangeInfos), rangeCount = rangeInfos.length;

            if (rangeCount == 1 && preserveDirection && api.features.selectionHasExtend && rangeInfos[0].backward) {
                sel.removeAllRanges();
                sel.addRange(ranges[0], true);
            } else {
                sel.setRanges(ranges);
            }

            savedSelection.restored = true;
        }
    }

    function removeMarkerElement(doc, markerId) {
        var markerEl = gEBI(markerId, doc);
        if (markerEl) {
            markerEl.parentNode.removeChild(markerEl);
        }
    }

    function removeMarkers(savedSelection) {
        var rangeInfos = savedSelection.rangeInfos;
        for (var i = 0, len = rangeInfos.length, rangeInfo; i < len; ++i) {
            rangeInfo = rangeInfos[i];
            if (rangeInfo.collapsed) {
                removeMarkerElement(savedSelection.doc, rangeInfo.markerId);
            } else {
                removeMarkerElement(savedSelection.doc, rangeInfo.startMarkerId);
                removeMarkerElement(savedSelection.doc, rangeInfo.endMarkerId);
            }
        }
    }

    api.util.extend(api, {
        saveRange: saveRange,
        restoreRange: restoreRange,
        saveRanges: saveRanges,
        restoreRanges: restoreRanges,
        saveSelection: saveSelection,
        restoreSelection: restoreSelection,
        removeMarkerElement: removeMarkerElement,
        removeMarkers: removeMarkers
    });
});

                /* End of file: build/default/src/dependencies/rangy/rangy-selectionsaverestore.js */
            
                /* File: build/default/src/dependencies/rangy/rangy-serializer.js */
                /**
 * Serializer module for Rangy.
 * Serializes Ranges and Selections. An example use would be to store a user's selection on a particular page in a
 * cookie or local storage and restore it on the user's next visit to the same page.
 *
 * Part of Rangy, a cross-browser JavaScript range and selection library
 * http://code.google.com/p/rangy/
 *
 * Depends on Rangy core.
 *
 * Copyright 2012, Tim Down
 * Licensed under the MIT license.
 * Version: 1.3alpha.681
 * Build date: 20 July 2012
 */
rangy.createModule("Serializer", function(api, module) {
    api.requireModules( ["WrappedSelection", "WrappedRange"] );
    var UNDEF = "undefined";

    // encodeURIComponent and decodeURIComponent are required for cookie handling
    if (typeof encodeURIComponent == UNDEF || typeof decodeURIComponent == UNDEF) {
        module.fail("Global object is missing encodeURIComponent and/or decodeURIComponent method");
    }

    // Checksum for checking whether range can be serialized
    var crc32 = (function() {
        function utf8encode(str) {
            var utf8CharCodes = [];

            for (var i = 0, len = str.length, c; i < len; ++i) {
                c = str.charCodeAt(i);
                if (c < 128) {
                    utf8CharCodes.push(c);
                } else if (c < 2048) {
                    utf8CharCodes.push((c >> 6) | 192, (c & 63) | 128);
                } else {
                    utf8CharCodes.push((c >> 12) | 224, ((c >> 6) & 63) | 128, (c & 63) | 128);
                }
            }
            return utf8CharCodes;
        }

        var cachedCrcTable = null;

        function buildCRCTable() {
            var table = [];
            for (var i = 0, j, crc; i < 256; ++i) {
                crc = i;
                j = 8;
                while (j--) {
                    if ((crc & 1) == 1) {
                        crc = (crc >>> 1) ^ 0xEDB88320;
                    } else {
                        crc >>>= 1;
                    }
                }
                table[i] = crc >>> 0;
            }
            return table;
        }

        function getCrcTable() {
            if (!cachedCrcTable) {
                cachedCrcTable = buildCRCTable();
            }
            return cachedCrcTable;
        }

        return function(str) {
            var utf8CharCodes = utf8encode(str), crc = -1, crcTable = getCrcTable();
            for (var i = 0, len = utf8CharCodes.length, y; i < len; ++i) {
                y = (crc ^ utf8CharCodes[i]) & 0xFF;
                crc = (crc >>> 8) ^ crcTable[y];
            }
            return (crc ^ -1) >>> 0;
        };
    })();

    var dom = api.dom;

    function escapeTextForHtml(str) {
        return str.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }

    function nodeToInfoString(node, infoParts) {
        infoParts = infoParts || [];
        var nodeType = node.nodeType, children = node.childNodes, childCount = children.length;
        var nodeInfo = [nodeType, node.nodeName, childCount].join(":");
        var start = "", end = "";
        switch (nodeType) {
            case 3: // Text node
                start = escapeTextForHtml(node.nodeValue);
                break;
            case 8: // Comment
                start = "<!--" + escapeTextForHtml(node.nodeValue) + "-->";
                break;
            default:
                start = "<" + nodeInfo + ">";
                end = "</>";
                break;
        }
        if (start) {
            infoParts.push(start);
        }
        for (var i = 0; i < childCount; ++i) {
            nodeToInfoString(children[i], infoParts);
        }
        if (end) {
            infoParts.push(end);
        }
        return infoParts;
    }

    // Creates a string representation of the specified element's contents that is similar to innerHTML but omits all
    // attributes and comments and includes child node counts. This is done instead of using innerHTML to work around
    // IE <= 8's policy of including element properties in attributes, which ruins things by changing an element's
    // innerHTML whenever the user changes an input within the element.
    function getElementChecksum(el) {
        var info = nodeToInfoString(el).join("");
        return crc32(info).toString(16);
    }

    function serializePosition(node, offset, rootNode) {
        var pathBits = [], n = node;
        rootNode = rootNode || dom.getDocument(node).documentElement;
        while (n && n != rootNode) {
            pathBits.push(dom.getNodeIndex(n, true));
            n = n.parentNode;
        }
        return pathBits.join("/") + ":" + offset;
    }

    function deserializePosition(serialized, rootNode, doc) {
        if (rootNode) {
            doc = doc || dom.getDocument(rootNode);
        } else {
            doc = doc || document;
            rootNode = doc.documentElement;
        }
        var bits = serialized.split(":");
        var node = rootNode;
        var nodeIndices = bits[0] ? bits[0].split("/") : [], i = nodeIndices.length, nodeIndex;

        while (i--) {
            nodeIndex = parseInt(nodeIndices[i], 10);
            if (nodeIndex < node.childNodes.length) {
                node = node.childNodes[nodeIndex];
            } else {
                throw module.createError("deserializePosition() failed: node " + dom.inspectNode(node) +
                        " has no child with index " + nodeIndex + ", " + i);
            }
        }

        return new dom.DomPosition(node, parseInt(bits[1], 10));
    }

    function serializeRange(range, omitChecksum, rootNode) {
        rootNode = rootNode || api.DomRange.getRangeDocument(range).documentElement;
        if (!dom.isOrIsAncestorOf(rootNode, range.commonAncestorContainer)) {
            throw module.createError("serializeRange(): range " + range.inspect() +
                " is not wholly contained within specified root node " + dom.inspectNode(rootNode));
        }
        var serialized = serializePosition(range.startContainer, range.startOffset, rootNode) + "," +
            serializePosition(range.endContainer, range.endOffset, rootNode);
        if (!omitChecksum) {
            serialized += "{" + getElementChecksum(rootNode) + "}";
        }
        return serialized;
    }

    function deserializeRange(serialized, rootNode, doc) {
        if (rootNode) {
            doc = doc || dom.getDocument(rootNode);
        } else {
            doc = doc || document;
            rootNode = doc.documentElement;
        }
        var result = /^([^,]+),([^,\{]+)(\{([^}]+)\})?$/.exec(serialized);
        var checksum = result[4], rootNodeChecksum = getElementChecksum(rootNode);
        if (checksum && checksum !== getElementChecksum(rootNode)) {
            throw module.createError("deserializeRange(): checksums of serialized range root node (" + checksum +
                    ") and target root node (" + rootNodeChecksum + ") do not match");
        }
        var start = deserializePosition(result[1], rootNode, doc), end = deserializePosition(result[2], rootNode, doc);
        var range = api.createRange(doc);
        range.setStart(start.node, start.offset);
        range.setEnd(end.node, end.offset);
        return range;
    }

    function canDeserializeRange(serialized, rootNode, doc) {
        if (rootNode) {
            doc = doc || dom.getDocument(rootNode);
        } else {
            doc = doc || document;
            rootNode = doc.documentElement;
        }
        var result = /^([^,]+),([^,]+)(\{([^}]+)\})?$/.exec(serialized);
        var checksum = result[3];
        return !checksum || checksum === getElementChecksum(rootNode);
    }

    function serializeSelection(selection, omitChecksum, rootNode) {
        selection = api.getSelection(selection);
        var ranges = selection.getAllRanges(), serializedRanges = [];
        for (var i = 0, len = ranges.length; i < len; ++i) {
            serializedRanges[i] = serializeRange(ranges[i], omitChecksum, rootNode);
        }
        return serializedRanges.join("|");
    }

    function deserializeSelection(serialized, rootNode, win) {
        if (rootNode) {
            win = win || dom.getWindow(rootNode);
        } else {
            win = win || window;
            rootNode = win.document.documentElement;
        }
        var serializedRanges = serialized.split("|");
        var sel = api.getSelection(win);
        var ranges = [];

        for (var i = 0, len = serializedRanges.length; i < len; ++i) {
            ranges[i] = deserializeRange(serializedRanges[i], rootNode, win.document);
        }
        sel.setRanges(ranges);

        return sel;
    }

    function canDeserializeSelection(serialized, rootNode, win) {
        var doc;
        if (rootNode) {
            doc = win ? win.document : dom.getDocument(rootNode);
        } else {
            win = win || window;
            rootNode = win.document.documentElement;
        }
        var serializedRanges = serialized.split("|");

        for (var i = 0, len = serializedRanges.length; i < len; ++i) {
            if (!canDeserializeRange(serializedRanges[i], rootNode, doc)) {
                return false;
            }
        }

        return true;
    }

    var cookieName = "rangySerializedSelection";

    function getSerializedSelectionFromCookie(cookie) {
        var parts = cookie.split(/[;,]/);
        for (var i = 0, len = parts.length, nameVal, val; i < len; ++i) {
            nameVal = parts[i].split("=");
            if (nameVal[0].replace(/^\s+/, "") == cookieName) {
                val = nameVal[1];
                if (val) {
                    return decodeURIComponent(val.replace(/\s+$/, ""));
                }
            }
        }
        return null;
    }

    function restoreSelectionFromCookie(win) {
        win = win || window;
        var serialized = getSerializedSelectionFromCookie(win.document.cookie);
        if (serialized) {
            deserializeSelection(serialized, win.doc);
        }
    }

    function saveSelectionCookie(win, props) {
        win = win || window;
        props = (typeof props == "object") ? props : {};
        var expires = props.expires ? ";expires=" + props.expires.toUTCString() : "";
        var path = props.path ? ";path=" + props.path : "";
        var domain = props.domain ? ";domain=" + props.domain : "";
        var secure = props.secure ? ";secure" : "";
        var serialized = serializeSelection(api.getSelection(win));
        win.document.cookie = encodeURIComponent(cookieName) + "=" + encodeURIComponent(serialized) + expires + path + domain + secure;
    }

    api.serializePosition = serializePosition;
    api.deserializePosition = deserializePosition;

    api.serializeRange = serializeRange;
    api.deserializeRange = deserializeRange;
    api.canDeserializeRange = canDeserializeRange;

    api.serializeSelection = serializeSelection;
    api.deserializeSelection = deserializeSelection;
    api.canDeserializeSelection = canDeserializeSelection;

    api.restoreSelectionFromCookie = restoreSelectionFromCookie;
    api.saveSelectionCookie = saveSelectionCookie;

    api.getElementChecksum = getElementChecksum;
    api.nodeToInfoString = nodeToInfoString;
});

                /* End of file: build/default/src/dependencies/rangy/rangy-serializer.js */
            
                /* File: build/default/src/dependencies/jquery-hotkeys.js */
                /*
 * jQuery Hotkeys Plugin
 * Copyright 2010, John Resig
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * @link https://github.com/jeresig/jquery.hotkeys
 *
 * Based upon the plugin by Tzury Bar Yochay:
 * http://github.com/tzuryby/hotkeys
 *
 * Original idea by:
 * Binny V A, http://www.openjs.com/scripts/events/keyboard_shortcuts/
*/

(function(jQuery){

    jQuery.hotkeys = {
        version: "0.8",

        specialKeys: {
            8: "backspace", 9: "tab", 13: "return", 16: "shift", 17: "ctrl", 18: "alt", 19: "pause",
            20: "capslock", 27: "esc", 32: "space", 33: "pageup", 34: "pagedown", 35: "end", 36: "home",
            37: "left", 38: "up", 39: "right", 40: "down", 45: "insert", 46: "del",
            96: "0", 97: "1", 98: "2", 99: "3", 100: "4", 101: "5", 102: "6", 103: "7",
            104: "8", 105: "9", 106: "*", 107: "+", 109: "-", 110: ".", 111 : "/",
            112: "f1", 113: "f2", 114: "f3", 115: "f4", 116: "f5", 117: "f6", 118: "f7", 119: "f8",
            120: "f9", 121: "f10", 122: "f11", 123: "f12", 144: "numlock", 145: "scroll", 191: "/", 224: "meta"
        },

        shiftNums: {
            "`": "~", "1": "!", "2": "@", "3": "#", "4": "$", "5": "%", "6": "^", "7": "&",
            "8": "*", "9": "(", "0": ")", "-": "_", "=": "+", ";": ": ", "'": "\"", ",": "<",
            ".": ">",  "/": "?",  "\\": "|"
        }
    };

    function keyHandler( handleObj ) {
        // Only care when a possible input has been specified
        if ( typeof handleObj.data !== "string" ) {
            return;
        }

        var origHandler = handleObj.handler,
            keys = handleObj.data.toLowerCase().split(" ");

        handleObj.handler = function( event ) {
            // Don't fire in text-accepting inputs that we didn't directly bind to
            if ( this !== event.target && (/textarea|select/i.test( event.target.nodeName ) ||
                 event.target.type === "text") ) {
                return;
            }

            // Keypress represents characters, not special keys
            var special = event.type !== "keypress" && jQuery.hotkeys.specialKeys[ event.which ],
                character = String.fromCharCode( event.which ).toLowerCase(),
                key, modif = "", possible = {};

            // check combinations (alt|ctrl|shift+anything)
            if ( event.altKey && special !== "alt" ) {
                modif += "alt+";
            }

            if ( event.ctrlKey && special !== "ctrl" ) {
                modif += "ctrl+";
            }

            // TODO: Need to make sure this works consistently across platforms
            if ( event.metaKey && !event.ctrlKey && special !== "meta" ) {
                modif += "meta+";
            }

            if ( event.shiftKey && special !== "shift" ) {
                modif += "shift+";
            }

            if ( special ) {
                possible[ modif + special ] = true;

            } else {
                possible[ modif + character ] = true;
                possible[ modif + jQuery.hotkeys.shiftNums[ character ] ] = true;

                // "$" can be triggered as "Shift+4" or "Shift+$" or just "$"
                if ( modif === "shift+" ) {
                    possible[ jQuery.hotkeys.shiftNums[ character ] ] = true;
                }
            }

            for ( var i = 0, l = keys.length; i < l; i++ ) {
                if ( possible[ keys[i] ] ) {
                    return origHandler.apply(this, arguments);
                }
            }
        };
    }

    jQuery.each([ "keydown", "keyup", "keypress" ], function() {
        jQuery.event.special[this] = { add: keyHandler };
    });

})( jQuery );

                /* End of file: build/default/src/dependencies/jquery-hotkeys.js */
            
                /* File: build/default/src/adapters/jquery-ui.js */
                function aButton(element, options) {
    return $(element).button(options);
}

function aButtonSetLabel(element, text) {
    $(element).button('option', 'text', true)
    return $(element).button('option', 'label', text);
}

function aButtonSetIcon(element, icon) {
    return $(element).button('option', 'icons', {
        primary: icon
    });
}

function aButtonDisable(element) {
    return $(element).button('option', 'disabled', true);
}

function aButtonEnable(element) {
    return $(element).button('option', 'disabled', false);
}

function aMenu(element, options) {
    return $(element).menu(options);
}

function aDialog(element, options) {
    var dialog = $(element).dialog(options);
    // TODO: Remove this when jQuery UI 1.10 is released
    var buttons = dialog.parent().find('.ui-dialog-buttonpane');
    for (var i = 0, l = options.buttons.length; i < l; i++) {
        aButton(buttons.find('button:eq(' + i + ')'), {
            icons: {
                primary: options.buttons[i].icons.primary
            }
        });
    }
    return dialog;
}

function aDialogOpen(element) {
    return $(element).dialog('open');
}


function aDialogClose(element) {
    return $(element).dialog('close');
}

                /* End of file: build/default/src/adapters/jquery-ui.js */
            
                /* File: build/default/src/jquery.ui.editor.i18n.js */
                /**
 * @fileOverview Editor internationalization (i18n) private functions and properties.
 *
 * @author David Neilsen <david@panmedia.co.nz>
 * @author Michael Robinson <michael@panmedia.co.nz>
 */

/**
 * @type String|null
 */
var currentLocale = null;

/**
 * @type Object
 */
var locales = {};

/**
 * @type Object
 */
var localeNames = {};

/**
 *
 * @static
 * @param {String} name
 * @param {String} nativeName
 * @param {Object} strings
 */
function registerLocale(name, nativeName, strings) {
    // <strict/>

    locales[name] = strings;
    localeNames[name] = nativeName;
    if (!currentLocale) {
        currentLocale = name;
    }
}

/**
 * @param {String} key
 */
function setLocale(key) {
    if (currentLocale !== key) {
        // <debug/>

        currentLocale = key;
        Raptor.eachInstance(function() {
            this.reinit();
        });
    }
}

/**
 * Internationalisation function. Translates a string with tagged variable
 * references to the current locale.
 *
 * <p>
 * Variable references should be surrounded with double curly braces {{ }}
 *      e.g. "This string has a variable: {{my.variable}} which will not be translated"
 * </p>
 *
 * @static
 * @param {String} string
 * @param {Object} variables
 */
function _(string, variables) {
    // Get the current locale translated string
    if (currentLocale &&
            locales[currentLocale] &&
            typeof locales[currentLocale][string] === 'string') {
        string = locales[currentLocale][string];
    }

    // Convert the variables
    if (!variables) {
        // <debug/>
        return string;
    } else {
        for (var key in variables) {
            string = string.replace('{{' + key + '}}', variables[key]);
        }
        return string;
    }
}

                /* End of file: build/default/src/jquery.ui.editor.i18n.js */
            
                /* File: build/default/src/locales/en.js */
                /**
 * @fileOverview English strings file.
 * @author Raptor, info@raptor-editor.com, http://www.raptor-editor.com/
 */
registerLocale('en', 'English', {
    /*
    "A preview of your embedded object is displayed below.": "A preview of your embedded object is displayed below.",
    "Added link: {{link}}": "Added link: {{link}}",
    "All changes will be lost!": "All changes will be lost!",
    "Apply Source": "Apply Source",
    "Are you sure you want to stop editing?": "Are you sure you want to stop editing?",
    "Blockquote": "Blockquote",
    "bold-title": "bold-title",
    "Center Align": "Center Align",
    "Change HTML tag of selected element": "Change HTML tag of selected element",
    "Change Language": "Change Language",
    "Change the color of the selected text.": "Change the color of the selected text.",
    "Check this box to have the file open in a new browser window": "Check this box to have the file open in a new browser window",
    "Check this box to hathe link open in a new browser window": "Check this box to have the link open in a new browser window",
    "Choose a link type:": "Choose a link type:",
    "Clear Formatting": "Clear Formatting",
    "Click to detach the toolbar": "Click to detach the toolbar",
    "Click to dock the toolbar": "Click to dock the toolbar",
    "Click to edit the image": "Click to edit the image",
    "Click to select the contents of the '{{element}}' element": "Click to select the contents of the '{{element}}' element",
    "Close": "Close",
    "Content Statistics": "Content Statistics",
    "Content contains more than {{limit}} characters and may be truncated": "Content contains more than {{limit}} characters and may be truncated",
    "Content will not be truncated": "Content will not be truncated",
    "Copy the file's URL from your browser's address bar and paste it into the box above": "Copy the file's URL from your browser's address bar and paste it into the box above",
    "Copy the web address from your browser\'s address bar and paste it into the box above": "Copy the web address from your browser\'s address bar and paste it into the box above",
    "Decrease Font Size": "Decrease Font Size",
    "Destroy": "Destroy",
    "Divider": "Divider",
    "Document or other file": "Document or other file",
    "Edit Link": "Edit Link",
    "Email": "Email",
    "Email address": "Email address",
    "Embed Code": "Embed Code",
    "Embed Object": "Embed Object",
    "Embed object": "Embed object",
    "Ensure the file has been uploaded to your website": "Ensure the file has been uploaded to your website",
    "Enter email address": "Enter email address",
    "Enter subject": "Enter subject",
    "Enter your URL": "Enter your URL",
    "Failed to save {{failed}} content block(s).": "Failed to save {{failed}} content block(s).",
    "Find the page on the web you want to link to": "Find the page on the web you want to link to",
    "Float Image Left": "Float Image Left",
    "Float Image Right": "Float Image Right",
    "Formatted &amp; Cleaned": "Formatted &amp; Cleaned",
    "Formatted Unclean": "Formatted Unclean",
    "Image height": "Image height",
    "Image width": "Image width",
    "Increase Font Size": "Increase Font Size",
    "Initializing": "Initializing",
    "Insert": "Insert",
    "Insert Horizontal Rule": "Insert Horizontal Rule",
    "Insert Link": "Insert Link",
    "Insert Snippet": "Insert Snippet",
    "Left Align": "Left Align",
    "Link to a document or other file": "Link to a document or other file",
    "Link to a page on this or another website": "Link to a page on this or another website",
    "Link to an email address": "Link to an email address",
    "Location": "Location",
    "Modify Image Size": "Modify Image Size",
    "New window": "New window",
    "No changes detected to save...": "No changes detected to save...",
    "Not sure what to put in the box above?": "Not sure what to put in the box above?",
    "Open the uploaded file in your browser": "Open the uploaded file in your browser",
    "Ordered List": "Ordered List",
    "Page on this or another website": "Page on this or another website",
    "Paste Embed Code": "Paste Embed Code",
    "Paste your embed code into the text area below.": "Paste your embed code into the text area below.",
    "Plain Text": "Plain Text",
    "Preview": "Preview",
    "Raptorize": "Raptorize",
    "Reinitialise": "Reinitialise",
    "Remaining characters before the recommended character limit is reached. Click to view statistics": "Remaining characters before the recommended character limit is reached. Click to view statistics",
    "Remove Image Float": "Remove Image Float",
    "Remove Link": "Remove Link",
    "Remove unnecessary markup from editor content": "Remove unnecessary markup from editor content",
    "Resize Image": "Resize Image",
    "Right Align": "Right Align",
    "Saved {{saved}} out of {{dirty}} content blocks.": "Saved {{saved}} out of {{dirty}} content blocks.",
    "Saving changes...": "Saving changes...",
    "Show Guides": "Show Guides",
    "Source Code": "Source Code",
    "Step Back": "Step Back",
    "Step Forward": "Step Forward",
    "Subject (optional)": "Subject (optional)",
    "Successfully saved {{saved}} content block(s).": "Successfully saved {{saved}} content block(s).",
    "Super script": "Super script",
    "The URL does not look well formed": "The URL does not look well formed",
    "The email address does not look well formed": "The email address does not look well formed",
    "The image '{{image}}' is too wide for the element being edited.<br/>It will be resized to fit.": "The image '{{image}}' is too wide for the element being edited.<br/>It will be resized to fit.",
    "The url for the file you inserted doesn\'t look well formed": "The url for the file you inserted doesn\'t look well formed",
    "The url for the link you inserted doesn\'t look well formed": "The url for the link you inserted doesn\'t look well formed",
    "This block contains unsaved changes": "",
    "Underline": "Underline",
    "Unnamed Button": "Unnamed Button",
    "Unnamed Select Menu": "Unnamed Select Menu",
    "Unordered List": "Unordered List",
    "Update Link": "Update Link",
    "Updated link: {{link}}": "Updated link: {{link}}",
    "\nThere are unsaved changes on this page. \nIf you navigate away from this page you will lose your unsaved changes": "\nThere are unsaved changes on this page. \nIf you navigate away from this page you will lose your unsaved changes",
*/

    alignCenterTitle: 'Align text center',
    alignJustifyTitle: 'Align text justify',
    alignLeftTitle: 'Align text left',
    alignRightTitle: 'Align text right',

    cancelDialogCancelButton: 'Close',
    cancelDialogContent: 'Are you sure you want to cancel editing? All changes will be lost!',
    cancelDialogOKButton: 'Ok',
    cancelDialogTitle: 'Cancel Editing',
    cancelTitle: 'Cancel editing',

    clearFormattingTitle: 'Clear formatting',
    clickButtonToEditPluginButton: 'Click to begin editing',

    colorPickerBasicAutomatic: 'Automatic',
    colorPickerBasicBlack: 'Black',
    colorPickerBasicBlue: 'Blue',
    colorPickerBasicGreen: 'Green',
    colorPickerBasicGrey: 'Grey',
    colorPickerBasicOrange: 'Orange',
    colorPickerBasicPurple: 'Purple',
    colorPickerBasicRed: 'Red',
    colorPickerBasicTitle: 'Change text color',
    colorPickerBasicWhite: 'White',

    dockToElementTitle: 'Dock editor to element',
    dockToScreenTitle: 'Dock editor to screen',

    embedTitle: 'Embed object',
    embedDialogTitle: 'Embed Object',
    embedDialogTabCode: 'Embed Code',
    embedDialogTabCodeContent: 'Paste your embed code into the text area below:',
    embedDialogTabPreview: 'Preview',
    embedDialogTabPreviewContent: 'A preview of your embedded object is displayed below:',
    embedDialogOKButton: 'Embed Object',
    embedDialogCancelButton: 'Cancel',

    errorPluginNoName: 'Plugin "{{plugin}}" is invalid (must have a name property)',
    errorPluginNotObject: 'Plugin "{{plugin}}" is invalid (must be an object)',
    errorPluginOverride: 'Plugin "{{name}}" has already been registered, and will be overwritten',

    errorUINoName: 'UI "{{ui}}" is invalid (must have a name property)',
    errorUINotObject: 'UI "{{ui}}" is invalid (must be an object)',
    errorUIOverride: 'UI "{{name}}" has already been registered, and will be overwritten',

    floatLeftTitle: 'Align image to the left',
    floatNoneTitle: 'Remove image align',
    floatRightTitle: 'Align image to the right',

    guidesTitle: 'Show element guides',

    historyRedoTitle: 'Redo',
    historyUndoTitle: 'Undo',

    listOrderedTitle: 'Ordered list',
    listUnorderedTitle: 'Unordered list',

    linkDialogTitle: 'Insert Link',
    linkDialogOKButton: 'Insert Link',
    linkDialogCancelButton: 'Cancel',
    linkDialogMenuHeader: 'Choose a link type',

    linkTypeEmailLabel: 'Email address',
    linkTypeEmailHeader: 'Link to an email address',
    linkTypeEmailToLabel: 'Email:',
    linkTypeEmailToPlaceHolder: 'Enter email address',
    linkTypeEmailSubjectLabel: 'Subject (optional):',
    linkTypeEmailSubjectPlaceHolder: 'Enter subject',

    linkTypeExternalLabel: 'Page on another website',
    linkTypeExternalHeader: 'Link to a page on another website',
    linkTypeExternalLocationLabel: 'Location:',
    linkTypeExternalLocationPlaceHolder: 'Enter a URL',
    linkTypeExternalNewWindowHeader: 'New window',
    linkTypeExternalNewWindowLabel: 'Check this box to have the link open in a new browser window/tab.',
    linkTypeExternalInfo:
        '<h2>Not sure what to put in the box above?</h2>' +
        '<ol>' +
        '    <li>Find the page on the web you want to link to.</li>' +
        '    <li>Copy the web address from your browser\'s address bar and paste it into the box above.</li>' +
        '</ol>',

    linkTypeInternalLabel: 'Page on this website',
    linkTypeInternalHeader: 'Link to a page on this website',
    linkTypeInternalLocationLabel: '',
    linkTypeInternalLocationPlaceHolder: 'Enter a URI',
    linkTypeInternalNewWindowHeader: 'New window',
    linkTypeInternalNewWindowLabel: 'Check this box to have the link open in a new browser window/tab.',
    linkTypeInternalInfo:
        '<h2>Not sure what to put in the box above?</h2>' +
        '<ol>' +
        '    <li>Find the page on this site link to.</li>' +
        '    <li>Copy the web address from your browser\'s address bar, excluding "{{domain}}" and paste it into the box above.</li>' +
        '</ol>',

    logoTitle: 'Learn More About the Raptor WYSIWYG Editor',

    saveTitle: 'Save content',
    saveRestFail: 'Failed to save {{failed}} content block(s).',
    saveRestPartial: 'Saved {{saved}} out of {{failed}} content blocks.',
    saveRestSaved: 'Successfully saved {{saved}} content block(s).',

    statisticsButtonCharacterOverLimit: '{{charactersRemaining}} characters over limit',
    statisticsButtonCharacterRemaining: '{{charactersRemaining}} characters remaining',
    statisticsButtonCharacters: '{{characters}} characters',
    statisticsDialogCharactersOverLimit: '{{characters}} characters, {{charactersRemaining}} over the recommended limit',
    statisticsDialogCharactersRemaining: '{{characters}} characters, {{charactersRemaining}} remaining',
    statisticsDialogNotTruncated: 'Content will not be truncated',
    statisticsDialogOKButton: 'Ok',
    statisticsDialogSentence: '{{sentences}} sentence',
    statisticsDialogSentences: '{{sentences}} sentences',
    statisticsDialogTitle: 'Content Statistics',
    statisticsDialogTruncated: 'Content contains more than {{limit}} characters and may be truncated',
    statisticsDialogWord: '{{words}} word',
    statisticsDialogWords: '{{words}} words',
    statisticsTitle: 'Click to view statistics',

    tableCreateTitle: 'Create table',
    tableDeleteColumnTitle: 'Delete table column',
    tableDeleteRowTitle: 'Delete table row',
    tableInsertColumnTitle: 'Insert table column',
    tableInsertRowTitle: 'Insert table row',

    tagMenuTagH1: 'Heading&nbsp;1',
    tagMenuTagH2: 'Heading&nbsp;2',
    tagMenuTagH3: 'Heading&nbsp;3',
    tagMenuTagNA: 'N/A',
    tagMenuTagP: 'Paragraph',
    tagMenuTitle: 'Change element style',

    tagTreeElementLink: 'Select {{element}} element',
    tagTreeElementTitle: 'Click to select the contents of the "{{element}}" element',
    tagTreeRoot: 'root',
    tagTreeRootLink: 'Select all editable content',
    tagTreeRootTitle: 'Click to select all editable content',

    textBlockQuoteTitle: 'Block quote',
    textBoldTitle: 'Bold',
    textItalicTitle: 'Italic',
    textStrikeTitle: 'Strike through',
    textSubTitle: 'Sub-script',
    textSuperTitle: 'Super-script',
    textUnderlineTitle: 'Underline',

    unsavedEditWarningText: 'There are unsaved changes on this page',

    viewSourceDialogCancelButton: 'Close',
    viewSourceDialogOKButton: 'Apply source code',
    viewSourceDialogTitle: 'Content source code',
    viewSourceTitle: 'View/edit source code'

});

                /* End of file: build/default/src/locales/en.js */
            
            // Raptor wrapper
            (function($, window, rangy, undefined) {
        
                /* File: build/default/src/jquery.ui.editor.init.js */
                // <debug/>


// <strict/>


$(function() {
    // Initialise rangy
    if (!rangy.initialized) {
        rangy.init();
    }

    // Add helper method to rangy
    if (!$.isFunction(rangy.rangePrototype.insertNodeAtEnd)) {
        rangy.rangePrototype.insertNodeAtEnd = function(node) {
            var range = this.cloneRange();
            range.collapse(false);
            range.insertNode(node);
            range.detach();
            this.setEndAfter(node);
        };
    }
});

// Select menu close event (triggered when clicked off)
$('html').click(function(event) {
    $('.ui-editor-selectmenu-visible')
        .removeClass('ui-editor-selectmenu-visible');
});

                /* End of file: build/default/src/jquery.ui.editor.init.js */
            
                /* File: build/default/src/jquery.ui.editor.support.js */
                var supported, ios, hotkeys;

function isSupported(editor) {
    if (supported === undefined) {
        supported = true;

        // <ios>
        ios = /(iPhone|iPod|iPad).*AppleWebKit/i.test(navigator.userAgent);
        if (ios) {
            $('html').addClass(editor.options.baseClass + '-ios');

            // Fixed position hack
            if (ios) {
                $(document).bind('scroll', function(){
                    setInterval(function() {
                        $('body').css('height', '+=1').css('height', '-=1');
                    }, 0);
                });
            }
        }
        // </ios>

        if ($.browser.mozilla) {
            $('html').addClass(editor.options.baseClass + '-ff');
        }

        // <ie>
        if ($.browser.msie && $.browser.version < 9) {
            supported = false;

            // Create message modal
            var message = $('<div/>')
                .addClass(editor.options.baseClass + '-unsupported')
                .html(editor.getTemplate('unsupported'))
                .appendTo('body');

            elementBringToTop(message);

            // Close event
            message.find('.' + editor.options.baseClass + '-unsupported-close').click(function() {
                message.remove();
            });
        }
        // </ie>

        hotkeys = jQuery.hotkeys !== undefined;
    }
    return supported;
}

                /* End of file: build/default/src/jquery.ui.editor.support.js */
            
                /* File: build/default/src/tools/action.js */
                function actionPreview(previewState, target, action) {
    // <strict/>
    
    actionPreviewRestore(previewState, target);
    
    previewState = stateSave(target);
    action();
    rangy.getSelection().removeAllRanges();
    return previewState;
}

function actionPreviewRestore(previewState, target) {
    if (previewState) {
        var state = stateRestore(target, previewState);
        if (state.ranges) {
            rangy.getSelection().setRanges(state.ranges);
        }
        return state.element;
    }
    return target;
}

function actionApply(action, history) {
    action();
}

function actionUndo() {
    
}

function actionRedo() {
    
}

                /* End of file: build/default/src/tools/action.js */
            
                /* File: build/default/src/tools/clean.js */
                /**
 * @fileOverview Cleaning helper functions.
 * @author David Neilsen - david@panmedia.co.nz
 * @author Michael Robinson - michael@panmedia.co.nz
 */

/**
 * Replaces elements in another elements. E.g.
 *
 * @example
 * cleanReplaceElements('.content', {
 *     'b': '<strong/>',
 *     'i': '<em/>',
 * });
 *
 * @param  {jQuery|Element|Selector} selector The element to be find and replace in.
 * @param  {Object} replacements A map of selectors to replacements. The replacement
 *   can be a jQuery object, an element, or a selector.
 */
function cleanReplaceElements(selector, replacements) {
    for (var find in replacements) {
        var replace = replacements[find];
        var i = 0;
        do {
            var found = $(selector).find(find);
            if (found.length) {
                found = $(found.get(0));
                var clone = $(replace).clone();
                clone.html(found.html());
                clone.attr(elementGetAttributes(found));
                found.replaceWith(clone);
            }
        } while(found.length);
    }
}

/**
 * Unwrap function. Currently just wraps jQuery.unwrap() but may be extended in future.
 *
 * @param  {jQuery|Element|Selector} selector The element to unwrap.
 */
function cleanUnwrapElements(selector) {
    $(selector).unwrap();
}

function cleanEmptyAttributes(element, attributes) {
    for (i = 0; i < attributes.length; i++) {
        var attr = attributes[i];
        element
            .find('[' + attributes[i] + ']')
            .filter(function() {
                return $.trim($(this).attr(attr)) === '';
            }).removeAttr(attributes[i]);
    }
}

                /* End of file: build/default/src/tools/clean.js */
            
                /* File: build/default/src/tools/dock.js */
                

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

                /* End of file: build/default/src/tools/dock.js */
            
                /* File: build/default/src/tools/element.js */
                /**
 * @fileOverview Element manipulation helper functions.
 * @author David Neilsen - david@panmedia.co.nz
 * @author Michael Robinson - michael@panmedia.co.nz
 */

/**
 * Remove comments from element.
 *
 * @param  {jQuery} parent The jQuery element to have comments removed from.
 * @return {jQuery} The modified parent.
 */
function elementRemoveComments(parent) {
    parent.contents().each(function() {
        if (this.nodeType == 8) {
            $(this).remove();
        }
    });
    parent.children().each(function() {
        element.removeComments($(this));
    });
    return parent;
}

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
 * @param {jQuery} element The jQuery element to cleanse of attributes.
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
 * @param  {jQuery} element The jQuery element to retrieve the outer HTML from.
 * @return {String} The outer HTML.
 */
function elementOuterHtml(element) {
    return element.clone().wrap('<div/>').parent().html();
}

/**
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
 * @param  {Array}  validTagNames An array of valid tag names.
 * @return {Boolean} True if the given element is one of the give valid tags.
 */
function elementIsValid(element, validTags) {
    return -1 !== $.inArray($(element)[0].tagName.toLowerCase(), validTags);
}

/**
 * Calculate and return the visible rectangle for the element.
 *
 * @param  {jQuery|Element} element The element to calculate the visible rectangle for.
 * @return {Object} Visible rectangle for the element.
 */
function elementVisibleRect(element) {

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
 * FIXME: this function needs reviewing
 * @param {jQuerySelector|jQuery|Element} element
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
 * Wraps the inner content of an element with a tag
 *
 * @param {jQuerySelector|jQuery|Element} element The element(s) to wrap
 * @param {String} tag The wrapper tag name
 */
function elementWrapInner(element, tag) {
    selectionSave();
    $(element).each(function() {
        var wrapper = $('<' + tag + '/>').html($(this).html());
        element.html(wrapper);
    });
    selectionRestore();
}

/**
 * FIXME: this function needs reviewing
 * @public @static
 * @param {jQuerySelector|jQuery|Element} element The jQuery element to insert
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
 * @param {jQuerySelector|jQuery|Element} element1
 * @param {jQuerySelector|jQuery|Element} element2
 * @param {Object} style
 */
function elementSwapStyles(element1, element2, style) {
    for (var name in style) {
        element1.css(name, element2.css(name));
        element2.css(name, style[name]);
    }
}


function elementIsEmpty(element) {
    return $($.parseHTML(element)).is(':empty');
}

/**
 *
 * @param {jQuery} element Element to position.
 * @param {jQuery} under Element to position under.
 */
function elementPositionUnder(element, under) {
    var pos = $(under).offset(),
        height = $(under).outerHeight();
    $(element).css({
        top: (pos.top + height) + 'px',
        left: pos.left + 'px'
    });
}

function elementDetachedManip(element, manip) {
    var parent = $(element).parent();
    $(element).detach();
    manip(element);
    parent.append(element);
}
                /* End of file: build/default/src/tools/element.js */
            
                /* File: build/default/src/tools/fragment.js */
                /**
 * @fileOverview DOM fragment manipulation helper functions
 * @author David Neilsen david@panmedia.co.nz
 * @author Michael Robinson michael@panmedia.co.nz
 */

/**
 * Convert a DOMFragment to an HTML string. Optionally wraps the string in a tag.
 *
 */
function fragmentToHtml(domFragment, tag) {
    var html = '';
    // Get all nodes in the extracted content
    for (var j = 0, l = domFragment.childNodes.length; j < l; j++) {
        var node = domFragment.childNodes.item(j);
        var content = node.nodeType === 3 ? node.nodeValue : elementOuterHtml($(node));
        if (content) {
            html += content;
        }
    }
    if (tag) {
        html = $('<' + tag + '>' + html + '</' + tag + '>');
        html.find('p').wrapInner('<' + tag + '/>');
        html.find('p > *').unwrap();
        html = $('<div/>').html(html).html();
    }
    return html;
}

/**
 *
 *
 * @public @static
 * @param {DOMFragment} domFragment
 * @param {jQuerySelector|jQuery|Element} beforeElement
 * @param {String} wrapperTag
 */
function fragmentInsertBefore(domFragment, beforeElement, wrapperTag) {
    // Get all nodes in the extracted content
    for (var j = 0, l = domFragment.childNodes.length; j < l; j++) {
        var node = domFragment.childNodes.item(j);
        // Prepend the node before the current node
        var content = node.nodeType === 3 ? node.nodeValue : $(node).html();
        if (content) {
            $('<' + wrapperTag + '/>')
                .html($.trim(content))
                .insertBefore(beforeElement);
        }
    }
}
                /* End of file: build/default/src/tools/fragment.js */
            
                /* File: build/default/src/tools/list.js */
                function listToggle(listType, wrapper) {
    // Check whether selection is fully contained by a ul/ol. If so, unwrap parent ul/ol
    if ($(selectionGetElements()).is('li')
        && $(selectionGetElements()).parent().is(listType)) {
        listUnwrapSelection();
    } else {
        listWrapSelection(listType, wrapper);
    }
};

function listWrapSelection(listType, wrapper) {
    if ($.trim(selectionGetHtml()) === '') {
        selectionSelectInner(selectionGetElements());
    }
    
    var validChildren = [
            'a', 'abbr','acronym', 'applet', 'b', 'basefont', 'bdo', 'big', 'br', 'button', 'cite', 'code', 'dfn',
            'em', 'font', 'i', 'iframe', 'img', 'input', 'kbd', 'label', 'map', 'object', 'p', 'q', 's',  'samp',
            'select', 'small', 'span', 'strike', 'strong', 'sub', 'sup', 'textarea', 'tt', 'u', 'var'
        ],
        validParents = [
            'blockquote', 'body', 'button', 'center', 'dd', 'div', 'fieldset', 'form', 'iframe', 'li',
            'noframes', 'noscript', 'object', 'td', 'th'
        ],
        selectedHtml = $('<div>').html(selectionGetHtml()),
        listElements = [];

    // Convert child block elements to list elements
    $(selectedHtml).contents().each(function() {
        var liContent;
        // Use only content of block elements
        if ('block' === elementDefaultDisplay(this.tagName)) {
            liContent = stringStripTags($(this).html(), validChildren);
        } else {
            liContent = stringStripTags(elementOuterHtml($(this)), validChildren);
        }

        // Avoid inserting blank lists
        var listElement = $('<li>' + liContent + '</li>');
        if ($.trim(listElement.text()) !== '') {
            listElements.push(elementOuterHtml(listElement));
        }
    });

    var replacementHtml = '<' + listType + '>' + listElements.join('') + '</' + listType + '>',
        selectedElementParent = $(selectionGetElements()[0]).parent(),
        editingElement = wrapper[0];

    /*
     * Replace selection if the selected element parent or the selected element is the editing element,
     * instead of splitting the editing element.
     */
    if (selectedElementParent === editingElement
        || selectionGetElements()[0] === editingElement) {
        selectionReplace(replacementHtml);
    } else {
        selectionReplaceWithinValidTags(replacementHtml, validParents);
    }

    // Select the first list element of the inserted list
    selectionSelectInner(selectedElementParent.find('li:first')[0]);
};

function listUnwrapSelection() {
    selectionSave();

    // Array containing the html contents of each of the selected li elements.
    var listElementsContent = [];
    // Array containing the selected li elements themselves.
    var listElements = [];

    // The element within which selection begins.
    var startElement = selectionGetStartElement();
    // The element within which ends.
    var endElement = selectionGetEndElement();

    // Collect the first selected list element's content
    listElementsContent.push($(startElement).html());
    listElements.push(startElement);

    // Collect the remaining list elements' content
    if ($(startElement)[0] !== $(endElement)[0]) {
        var currentElement = startElement;
        do  {
            currentElement = $(currentElement).next();
            listElementsContent.push($(currentElement).html());
            listElements.push(currentElement);
        } while($(currentElement)[0] !== $(endElement)[0]);
    }

    // Boolean values used to determine whether first / last list element of the parent is selected.
    var firstLiSelected = $(startElement).prev().length === 0;
    var lastLiSelected = $(endElement).next().length === 0;

    // The parent list container, e.g. the parent ul / ol
    var parentListContainer = $(startElement).parent();

    // Remove the list elements from the DOM.
    for (listElementsIndex = 0; listElementsIndex < listElements.length; listElementsIndex++) {
        $(listElements[listElementsIndex]).remove();
    }

    // Wrap list element content in p tags if the list element parent's parent is not a li.
    for (var listElementsContentIndex = 0; listElementsContentIndex < listElementsContent.length; listElementsContentIndex++) {
        if (!parentListContainer.parent().is('li')) {
            listElementsContent[listElementsContentIndex] = '<p>' + listElementsContent[listElementsContentIndex] + '</p>';
        }
    }

    // Every li of the list has been selected, replace the entire list
    if (firstLiSelected && lastLiSelected) {
        parentListContainer.replaceWith(listElementsContent.join(''));
        selectionRestore();
        var selectedElement = selectionGetElements()[0];
        selectionSelectOuter(selectedElement);
        return;
    }

    if (firstLiSelected) {
        $(parentListContainer).before(listElementsContent.join(''));
    } else if (lastLiSelected) {
        $(parentListContainer).after(listElementsContent.join(''));
    } else {
        selectionReplaceSplittingSelectedElement(listElementsContent.join(''));
    }

    selectionRestore();
};

                /* End of file: build/default/src/tools/list.js */
            
                /* File: build/default/src/tools/persist.js */
                function persistSet(key, value) {
    if (localStorage) {
        var storage;
        if (localStorage.raptor) {
            storage = JSON.parse(localStorage.raptor);
        } else {
            storage = {};
        }
        storage[key] = value;
        localStorage.raptor = JSON.stringify(storage);
    }
}

function persistGet(key) {
    if (localStorage) {
        var storage;
        if (localStorage.raptor) {
            storage = JSON.parse(localStorage.raptor);
        } else {
            storage = {};
        }
        return storage[key];
    }
}


                /* End of file: build/default/src/tools/persist.js */
            
                /* File: build/default/src/tools/range.js */
                /**
 * @fileOverview Range manipulation helper functions.
 * @author David Neilsen david@panmedia.co.nz
 * @author Michael Robinson michael@panmedia.co.nz
 */

/**
 * Expands a range to to surround all of the content from its start container
 * to its end container.
 *
 * @public @static
 * @param {RangyRange} range The range to expand
 */
function rangeExpandToParent(range) {
    range.setStartBefore(range.startContainer);
    range.setEndAfter(range.endContainer);
}

function rangeExpandTo(range, elements) {
    do {
        rangeExpandToParent(range);
        for (var i = 0, l = elements.length; i < l; i++) {
            if ($(range.commonAncestorContainer).is(elements[i])) {
                return;
            }
        }
    } while (range.commonAncestorContainer);
}

/**
 * Replaces the content of range with the given html.
 * 
 * @param  {jQuery|String} html The html to use when replacing range.
 * @param  {RangyRange} range The range to replace.
 */
function rangeReplace(html, range) {
    var nodes = $('<div/>').append(html)[0].childNodes;
    range.deleteContents();
    if (nodes.length === undefined || nodes.length === 1) {
        range.insertNode(nodes[0].cloneNode(true));
    } else {
        $.each(nodes, function(i, node) {
            range.insertNodeAtEnd(node.cloneNode(true));
        });
    }
}

function rangeEmptyTag(range) {
    var contents = range.cloneContents();
    var html = fragmentToHtml(contents);
    if (typeof html === 'string') {
        html = html.replace(/([ #;&,.+*~\':"!^$[\]()=>|\/@])/g,'\\$1');
    }
    return elementIsEmpty(html);
}

/**
 * Works for single ranges only.
 * @return {Element} The selected range's common ancestor.
 */
function rangeGetCommonAncestor(selection) {
    selection = selection || rangy.getSelection();

    var commonAncestor;
    $(selection.getAllRanges()).each(function(i, range){
        if (this.commonAncestorContainer.nodeType === 3) {
            commonAncestor = $(range.commonAncestorContainer).parent()[0];
        } else {
            commonAncestor = range.commonAncestorContainer;
        }
    });

    return commonAncestor;
}

/**
 * Returns true if the supplied range is empty (has a length of 0)
 *
 * @public @static
 * @param {RangyRange} range The range to check if it is empty
 */
function rangeIsEmpty(range) {
    return range.startOffset === range.endOffset &&
           range.startContainer === range.endContainer;
}

function rangeIsContainedBy(range, node) {
    var nodeRange = range.cloneRange();
    nodeRange.selectNodeContents(node);
    return nodeRange.containsRange(range);
}

//function rangesToggleWrapper(ranges, tag, options) {
//    var applier = rangy.createCssClassApplier(options.classes || '', {
//        normalize: true,
//        elementTagName: tag,
//        elementProperties: options.attributes || {},
//        ignoreWhiteSpace: false
//    });
//    applier.applyToRanges(ranges);
//}
//
//function rangeToggleWrapper(range, tag, options) {
//    options = options || {};
//    var applier = rangy.createCssClassApplier(options.classes || '', {
//        normalize: true,
//        elementTagName: tag,
//        elementProperties: options.attributes || {}
//    });
//    if (rangeEmptyTag(range)) {
//        var element = $('<' + tag + '/>')
//            .addClass(options.classes)
//            .attr(options.attributes || {})
//            .append(fragmentToHtml(range.cloneContents()));
//        rangeReplace(element, range);
//    } else {
//        applier.toggleRange(range);
//    }
//}

function rangeTrim(range) {
    var selectedText = range.text();

    // Trim start
    var match = /^\s+/.exec(selectedText);
    if (match) {
        range.moveStart('character', match[0].length);
    }

    // Trim end
    match = /\s+$/.exec(selectedText);
    if (match) {
        range.moveEnd('character', -match[0].length);
    }
}

function rangeSerialize(ranges, rootNode) {
    var serializedRanges = [];
    for (var i = 0, l = ranges.length; i < l; i++) {
        serializedRanges[i] = rangy.serializeRange(ranges[i], true);
    }
    return serializedRanges.join('|');
}

function rangeDeserialize(serialized) {
    var serializedRanges = serialized.split("|"),
        ranges = [];
    for (var i = 0, l = serializedRanges.length; i < l; i++) {
        ranges[i] = rangy.deserializeRange(serializedRanges[i]);
    }
    return ranges;
}
                /* End of file: build/default/src/tools/range.js */
            
                /* File: build/default/src/tools/selection.js */
                /**
 * @fileOverview Selection manipulation helper functions.
 * @author David Neilsen david@panmedia.co.nz
 * @author Michael Robinson michael@panmedia.co.nz
 */
/**
 * @type {Boolean|Object} current saved selection.
 */
var savedSelection = false;

/**
 * Save selection wrapper, preventing plugins / UI from accessing rangy directly.
 */
function selectionSave(overwrite) {
    if (savedSelection && !overwrite) return;
    savedSelection = rangy.saveSelection();
}

/**
 * Restore selection wrapper, preventing plugins / UI from accessing rangy directly.
 */
function selectionRestore() {
    if (savedSelection) {
        rangy.restoreSelection(savedSelection);
        savedSelection = false;
    }
}

/**
 * Reset saved selection.
 */
function selectionDestroy() {
    if (savedSelection) {
        rangy.removeMarkers(savedSelection);
    }
    savedSelection = false;
}

function selectionSaved() {
    return savedSelection !== false;
}

/**
 * Iterates over all ranges in a selection and calls the callback for each
 * range. The selection/range offsets is updated in every iteration in in the
 * case that a range was changed or removed by a previous iteration.
 *
 * @public @static
 * @param {function} callback The function to call for each range. The first and only parameter will be the current range.
 * @param {RangySelection} [selection] A RangySelection, or by default, the current selection.
 * @param {object} [context] The context in which to call the callback.
 */
function selectionEachRange(callback, selection, context) {
    selection = selection || rangy.getSelection();
    var range, i = 0;
    // Create a new range set every time to update range offsets
    while (range = selection.getAllRanges()[i++]) {
        callback.call(context, range);
    }
}

function selectionSet(mixed) {
    rangy.getSelection().setSingleRange(mixed);
}

/**
 * Replaces the given selection (or the current selection if selection is not
 * supplied) with the given html.
 * @public @static
 * @param  {jQuery|String} html The html to use when replacing.
 * @param  {RangySelection|null} selection The selection to replace, or null to replace the current selection.
 */
function selectionReplace(html, selection) {
    selectionEachRange(function(range) {
        rangeReplace(html, range);
    }, selection, this);
}

/**
 * Selects all the contents of the supplied element, excluding the element itself.
 *
 * @public @static
 * @param {jQuerySelector|jQuery|Element} element
 * @param {RangySelection} [selection] A RangySelection, or by default, the current selection.
 */
function selectionSelectInner(element, selection) {
    selection = selection || rangy.getSelection();
    selection.removeAllRanges();
    $(element).focus().contents().each(function() {
        var range = rangy.createRange();
        range.selectNodeContents(this);
        selection.addRange(range);
    });
}

/**
 * Selects all the contents of the supplied element, including the element itself.
 *
 * @public @static
 * @param {jQuerySelector|jQuery|Element} element
 * @param {RangySelection} [selection] A RangySelection, or null to use the current selection.
 */
function selectionSelectOuter(element, selection) {
    selection = selection || rangy.getSelection();
    selection.removeAllRanges();
    $(element).each(function() {
        var range = rangy.createRange();
        range.selectNode(this);
        selection.addRange(range);
    }).focus();
}

/**
 * Move selection to the start or end of element.
 *
 * @param  {jQuerySelector|jQuery|Element} element The subject element.
 * @param  {RangySelection|null} selection A RangySelection, or null to use the current selection.
 * @param {Boolean} start True to select the start of the element.
 */
function selectionSelectEdge(element, selection, start) {
    selection = selection || rangy.getSelection();
    selection.removeAllRanges();

    $(element).each(function() {
        var range = rangy.createRange();
        range.selectNodeContents(this);
        range.collapse(start);
        selection.addRange(range);
    });
}

/**
 * Move selection to the end of element.
 *
 * @param  {jQuerySelector|jQuery|Element} element The subject element.
 * @param  {RangySelection|null} selection A RangySelection, or null to use the current selection.
 */
function selectionSelectEnd(element, selection) {
    selectionSelectEdge(element, selection, false);
}

/**
 * Move selection to the start of element.
 *
 * @param  {jQuerySelector|jQuery|Element} element The subject element.
 * @param  {RangySelection|null} selection A RangySelection, or null to use the current selection.
 */
function selectionSelectStart(element, selection) {
    selectionSelectEdge(element, selection, true);
}

/**
 * @param  {RangySelection|null} selection Selection to get html from or null to use current selection.
 * @return {string} The html content of the selection.
 */
function selectionGetHtml(selection) {
    selection = selection || rangy.getSelection();
    return selection.toHtml();
}

function selectionGetElement(range) {
    var commonAncestor;

    range = range || rangy.getSelection().getRangeAt(0);

    // Check if the common ancestor container is a text node
    if (range.commonAncestorContainer.nodeType === 3) {
        // Use the parent instead
        commonAncestor = range.commonAncestorContainer.parentNode;
    } else {
        commonAncestor = range.commonAncestorContainer;
    }
    return $(commonAncestor);
}

/**
 * Gets all elements that contain a selection (excluding text nodes) and
 * returns them as a jQuery array.
 *
 * @public @static
 * @param {RangySelection} [sel] A RangySelection, or by default, the current selection.
 */
function selectionGetElements(selection) {
    var result = new jQuery();
    selectionEachRange(function(range) {
        result.push(selectionGetElement(range)[0]);
    }, selection, this);
    return result;
}

function selectionGetStartElement() {
    var selection = rangy.getSelection();
    if (selection.anchorNode === null) {
        return null;
    }
    if (selection.isBackwards()) {
        return selection.focusNode.nodeType === 3 ? $(selection.focusNode.parentElement) : $(selection.focusNode);
    }
    if (!selection.anchorNode) console.trace();
    return selection.anchorNode.nodeType === 3 ? $(selection.anchorNode.parentElement) : $(selection.anchorNode);
}

function selectionGetEndElement() {
    var selection = rangy.getSelection();
    if (selection.anchorNode === null) {
        return null;
    }
    if (selection.isBackwards()) {
        return selection.anchorNode.nodeType === 3 ? $(selection.anchorNode.parentElement) : $(selection.anchorNode);
    }
    return selection.focusNode.nodeType === 3 ? $(selection.focusNode.parentElement) : $(selection.focusNode);
}

function selectionAtEndOfElement() {
    var selection = rangy.getSelection();
    var focusNode = selection.isBackwards() ? selection.anchorNode : selection.focusNode;
    var focusOffset = selection.isBackwards() ? selection.focusOffset : selection.anchorOffset;
    if (focusOffset !== focusNode.textContent.length) {
        return false;
    }
    var previous = focusNode.nextSibling;
    if (!previous || $(previous).html() === '') {
        return true;
    } else {
        return false;
    }
}

function selectionAtStartOfElement() {
    var selection = rangy.getSelection();
    var anchorNode = selection.isBackwards() ? selection.focusNode : selection.anchorNode;
    if (selection.isBackwards() ? selection.focusOffset : selection.anchorOffset !== 0) {
        return false;
    }
    var previous = anchorNode.previousSibling;
    if (!previous || $(previous).html() === '') {
        return true;
    } else {
        return false;
    }
}

function selectionIsEmpty() {
    return rangy.getSelection().toHtml() === '';
}

/**
 * FIXME: this function needs reviewing
 *
 * This should toggle an inline style, and normalise any overlapping tags, or adjacent (ignoring white space) tags.
 *
 * @public @static
 */
function selectionToggleWrapper(tag, options) {
    options = options || {};
    var applier = rangy.createCssClassApplier(options.classes || '', {
        normalize: true,
        elementTagName: tag,
        elementProperties: options.attributes || {}
    });
    selectionEachRange(function(range) {
        if (rangeEmptyTag(range)) {
            var element = $('<' + tag + '/>')
                .addClass(options.classes)
                .attr(options.attributes || {})
                .append(fragmentToHtml(range.cloneContents()));
            rangeReplace(element, range);
        } else {
            applier.toggleRange(range);
        }
    }, null, this);
}

function selectionWrapTagWithAttribute(tag, attributes, classes) {
    selectionEachRange(function(range) {
        var element = selectionGetElement(range);
        if (element.is(tag)) {
            element.attr(attributes);
        } else {
            selectionToggleWrapper(tag, {
                classes: classes,
                attributes: attributes
            });
        }
    }, null, this);
}

/**
 * Returns true if there is at least one range selected and the range is not
 * empty.
 *
 * @see rangeIsEmpty
 * @public @static
 * @param {RangySelection} [selection] A RangySelection, or by default, the current selection.
 */
function selectionExists(sel) {
    var exists = false;
    selectionEachRange(function(range) {
        if (!rangeIsEmpty(range)) {
            exists = true;
        }
    }, sel, this);
    return exists;
}

/**
 * Split the selection container and insert the given html between the two elements created.
 * @param  {jQuery|Element|string} html The html to replace selection with.
 * @param  {RangySelection|null} selection The selection to replace, or null for the current selection.
 */
function selectionReplaceSplittingSelectedElement(html, selection) {
    selection = selection || rangy.getSelection();

    var selectionRange = selection.getRangeAt(0);
    var selectedElement = selectionGetElements()[0];

    // Select from start of selected element to start of selection
    var startRange = rangy.createRange();
    startRange.setStartBefore(selectedElement);
    startRange.setEnd(selectionRange.startContainer, selectionRange.startOffset);
    var startFragment = startRange.cloneContents();

    // Select from end of selected element to end of selection
    var endRange = rangy.createRange();
    endRange.setStart(selectionRange.endContainer, selectionRange.endOffset);
    endRange.setEndAfter(selectedElement);
    var endFragment = endRange.cloneContents();

    // Replace the start element's html with the content that was not selected, append html & end element's html
    var replacement = elementOuterHtml($(fragmentToHtml(startFragment)));
    replacement += elementOuterHtml($(html));
    replacement += elementOuterHtml($(fragmentToHtml(endFragment)));

    $(selectedElement).replaceWith($(replacement));
}

/**
 * Replace current selection with given html, ensuring that selection container is split at
 * the start & end of the selection in cases where the selection starts / ends within an invalid element.
 * @param  {jQuery|Element|string} html The html to replace current selection with.
 * @param  {Array} validTagNames An array of tag names for tags that the given html may be inserted into without having the selection container split.
 * @param  {RangySeleciton|null} selection The selection to replace, or null for the current selection.
 */
function selectionReplaceWithinValidTags(html, validTagNames, selection) {
    selection = selection || rangy.getSelection();
    if (selection.rangeCount === 0) {
        return;
    }

    var startElement = selectionGetStartElement()[0];
    var endElement = selectionGetEndElement()[0];
    var selectedElement = selectionGetElements()[0];

    var selectedElementValid = elementIsValid(selectedElement, validTagNames);
    var startElementValid = elementIsValid(startElement, validTagNames);
    var endElementValid = elementIsValid(endElement, validTagNames);

    // The html may be inserted within the selected element & selection start / end.
    if (selectedElementValid && startElementValid && endElementValid) {
        selectionReplace(html);
        return;
    }

    // Context is invalid. Split containing element and insert list in between.
    selectionReplaceSplittingSelectedElement(html, selection);
}

/**
 * Toggles style(s) on the first block level parent element of each range in a selection
 *
 * @public @static
 * @param {Object} styles styles to apply
 * @param {jQuerySelector|jQuery|Element} limit The parent limit element.
 * If there is no block level elements before the limit, then the limit content
 * element will be wrapped with a "div"
 */
function selectionToggleBlockStyle(styles, limit) {
    selectionEachRange(function(range) {
        var parent = $(range.commonAncestorContainer);
        while (parent.length && parent[0] !== limit[0] && (
                parent[0].nodeType === 3 || parent.css('display') === 'inline')) {
            parent = parent.parent();
        }
        if (parent[0] === limit[0]) {
            // Only apply block style if the limit element is a block
            if (limit.css('display') !== 'inline') {
                // Wrap the HTML inside the limit element
                elementWrapInner(limit, 'div');
                // Set the parent to the wrapper
                parent = limit.children().first();
            }
        }
        // Apply the style to the parent
        elementToggleStyle(parent, styles);
    }, null, this);
}

/**
 * Removes all ranges from a selection that are not contained within the
 * supplied element.
 *
 * @public @static
 * @param {jQuerySelector|jQuery|Element} element
 * @param {RangySelection} [selection]
 */
function selectionConstrain(element, selection) {
    element = $(element)[0];
    selection = selection || rangy.getSelection();

    if (!selection) {
        selectionSelectStart(element);
        return;
    }

    var commonAncestor;
    $(selection.getAllRanges()).each(function(i, range){
        if (this.commonAncestorContainer.nodeType === 3) {
            commonAncestor = $(range.commonAncestorContainer).parent()[0];
        } else {
            commonAncestor = range.commonAncestorContainer;
        }
        if (element !== commonAncestor && !$.contains(element, commonAncestor)) {
            selection.removeRange(range);
        }
    });
}


function selectionClearFormatting(limitNode, selection) {
    limitNode = limitNode || document.body;
    selection = selection || rangy.getSelection();
    if (selection.rangeCount > 0) {
        // Create a copy of the selection range to work with
        var range = selection.getRangeAt(0).cloneRange();

        // Get the selected content
        var content = range.extractContents();

        // Expand the range to the parent if there is no selected content
        if (fragmentToHtml(content) === '') {
            rangeExpandToParent(range);
            selection.setSingleRange(range);
            content = range.extractContents();
        }

        content = $('<div/>').append(fragmentToHtml(content)).text();

        // Get the containing element
        var parent = range.commonAncestorContainer;
        while (parent && parent.parentNode != limitNode) {
            parent = parent.parentNode;
        }

        if (parent) {
            // Place the end of the range after the paragraph
            range.setEndAfter(parent);

            // Extract the contents of the paragraph after the caret into a fragment
            var contentAfterRangeStart = range.extractContents();

            // Collapse the range immediately after the paragraph
            range.collapseAfter(parent);

            // Insert the content
            range.insertNode(contentAfterRangeStart);

            // Move the caret to the insertion point
            range.collapseAfter(parent);
            range.insertNode(document.createTextNode(content));
        } else {
            range.insertNode(document.createTextNode(content));
        }
    }
}



function selectionInverseWrapWithTagClass(tag1, class1, tag2, class2) {
    selectionSave();
    // Assign a temporary tag name (to fool rangy)
    var id = 'domTools' + Math.ceil(Math.random() * 10000000);

    selectionEachRange(function(range) {
        var applier2 = rangy.createCssClassApplier(class2, {
            elementTagName: tag2
        });

        // Check if tag 2 is applied to range
        if (applier2.isAppliedToRange(range)) {
            // Remove tag 2 to range
            applier2.toggleSelection();
        } else {
            // Apply tag 1 to range
            rangy.createCssClassApplier(class1, {
                elementTagName: id
            }).toggleSelection();
        }
    }, null, this);

    // Replace the temparay tag with the correct tag
    $(id).each(function() {
        $(this).replaceWith($('<' + tag1 + '/>').addClass(class1).html($(this).html()));
    });

    selectionRestore();
}
                /* End of file: build/default/src/tools/selection.js */
            
                /* File: build/default/src/tools/state.js */
                
function stateSave(element) {
    // <strict/>
    
    var ranges = rangy.getSelection().getAllRanges();
    return {
        element: element.clone(true),
        ranges: ranges.length ? rangeSerialize(ranges, element.get(0)) : null
    };
}

function stateRestore(element, state) {
    // <strict/>
    
    element.replaceWith(state.element);
    return {
        element: state.element,
        ranges: state.ranges ? rangeDeserialize(state.ranges) : null
    };
}

//function stateRestoreRanges(state) {
//    if (state.ranges) {
//        rangeDeserialize(state.ranges);
//    }
//}

                /* End of file: build/default/src/tools/state.js */
            
                /* File: build/default/src/tools/string.js */
                /**
 * @fileOverview String helper functions
 * @author David Neilsen - david@panmedia.co.nz
 * @author Michael Robinson - michael@panmedia.co.nz
 */

/**
 * Modification of strip_tags from PHP JS - http://phpjs.org/functions/strip_tags:535.
 * @param  {string} content HTML containing tags to be stripped
 * @param {Array} allowedTags Array of tags that should not be stripped
 * @return {string} HTML with all tags not present allowedTags array.
 */
function stringStripTags(content, allowedTags) {
    // making sure the allowed arg is a string containing only tags in lowercase (<a><b><c>)
    allowed = [];
    for (var allowedTagsIndex = 0; allowedTagsIndex < allowedTags.length; allowedTagsIndex++) {
        if (allowedTags[allowedTagsIndex].match(/[a-z][a-z0-9]{0,}/g)) {
            allowed.push(allowedTags[allowedTagsIndex]);
        }
    }
    // making sure the allowed arg is a string containing only tags in lowercase (<a><b><c>)
    var tags = /<\/?([a-z][a-z0-9]*)\b[^>]*\/?>/gi,
        commentsAndPhpTags = /<!--[\s\S]*?-->|<\?(?:php)?[\s\S]*?\?>/gi;

    return content.replace(commentsAndPhpTags, '').replace(tags, function ($0, $1) {
        return allowed.indexOf($1.toLowerCase()) > -1 ? $0 : '';
    });
}

function stringCamelCaseConvert(string, delimiter) {
    return string.replace(/([A-Z])/g, function(match) {
        return (delimiter || '-') + match.toLowerCase();
    });
}

                /* End of file: build/default/src/tools/string.js */
            
                /* File: build/default/src/tools/style.js */
                function styleSwapState(element, newState) {
    var node = element.get(0),
        previousState = {};
    // Double loop because jQuery will automatically assign other style properties like 'margin-left' when setting 'margin'
    for (var key in newState) {
        previousState[key] = node.style[key];
    }
    for (var key in newState) {
        element.css(key, newState[key])
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
    for (var key in newState) {
        wrapper.css(key, inner.css(key));
        inner.css(key, newState[key])
    }
    return previousState;
}

function styleRestoreState(element, state) {
    for (var key in state) {
        element.css(key, state[key] || '');
    }
}

                /* End of file: build/default/src/tools/style.js */
            
                /* File: build/default/src/tools/table.js */
                /**
 * @fileOverview Table helper functions.
 * @author David Neilsen - david@panmedia.co.nz
 */

/**
 * Create and return a new table element with the supplied number of rows/columns.
 *
 * @public @static
 * @param {int} columns The number of columns to add to the table.
 * @param {int} rows The number of rows to add to the table.
 * @param [options] Extra options to apply.
 * @param [options.placeHolder=""] Place holder HTML to insert into each created cell.
 * @returns {HTMLTableElement}
 */
function tableCreate(columns, rows, options) {
    options = options || {};
    var table = document.createElement('table');
    while (rows--) {
        var row = table.insertRow(0);
        for (var i = 0; i < columns; i++) {
            var cell = row.insertCell(0);
            if (options.placeHolder) {
                cell.innerHTML = options.placeHolder;
            }
        }
    }
    return table;
}

/**
 * Adds a column to a table.
 *
 * @param {HTMLTableElement} table
 * @param {int} index Position to insert the column at, starting at 0.
 * @param [options] Extra options to apply.
 * @param [options.placeHolder=""] Place holder HTML to insert into each created cell.
 * @returns {HTMLTableCellElement[]} An array of cells added to the table.
 */
function tableInsertColumn(table, index, options) {
    return resizeTable(table, 0, 0, 1, index, options || {});
}
/**
 * Removes a column from a table.
 *
 * @param {HTMLTableElement} table
 * @param {int} index Position to remove the column at, starting at 0.
 */
function tableDeleteColumn(table, index) {
    resizeTable(table, 0, 0, -1, index);
}

/**
 * Adds a row to a table, and append as many cells as the longest row in the table.
 *
 * @param {HTMLTableElement} table
 * @param {int} index Position to insert the row at, starting at 0.
 * @param [options] Extra options to apply.
 * @param [options.placeHolder=""] Place holder HTML to insert into each created cell.
 * @returns {HTMLTableCellElement[]} An array of cells added to the table.
 */
function tableInsertRow(table, index, options) {
    return resizeTable(table, 1, index, 0, 0, options || {});
}

/**
 * Removes a row from a table.
 *
 * @param {HTMLTableElement} table The table to remove the row from.
 * @param {int} index Position to remove the row at, starting at 0.
 */
function tableDeleteRow(table, index) {
    resizeTable(table, -1, index, 0, 0);
}

/**
 * Return the x/y position of a table cell, taking into consideration the column/row span.
 *
 * @param {HTMLTableCellElement} cell The table cell to get the index for.
 * @returns {tableGetCellIndex.Anonym$0}
 */
function tableGetCellIndex(cell) {
    var x, y, tx, ty,
        matrix = [],
        rows = cell.parentNode.parentNode.parentNode.tBodies[0].rows;
    for (var r = 0; r < rows.length; r++) {
        y = rows[r].sectionRowIndex;
        y = r;
        for (var c = 0; c < rows[r].cells.length; c++) {
            x = c;
            while (matrix[y] && matrix[y][x]) {
                // Skip already occupied cells in current row
                x++;
            }
            for (tx = x; tx < x + (rows[r].cells[c].colSpan || 1); ++tx) {
                // Mark matrix elements occupied by current cell with true
                for (ty = y; ty < y + (rows[r].cells[c].rowSpan || 1); ++ty) {
                    if (!matrix[ty]) {
                        // Fill missing rows
                        matrix[ty] = [];
                    }
                    matrix[ty][tx] = true;
                }
            }
            if (cell === rows[r].cells[c]) {
                return {
                    x: x,
                    y: y
                };
            };
        }
    }
}

function tableGetCellByIndex(table, index) {
    return table.rows[index.y].cells[index.x];
}

function tableCellsInRange(table, startIndex, endIndex) {
    var startX = Math.min(startIndex.x, endIndex.x),
        x = startX,
        y = Math.min(startIndex.y, endIndex.y),
        endX = Math.max(startIndex.x, endIndex.x),
        endY = Math.max(startIndex.y, endIndex.y),
        cells = [];
    while (y <= endY) {
        while (x <= endX) {
            cells.push(tableGetCellByIndex(table, {
                x: x,
                y: y
            }));
            x++;
        }
        x = startX;
        y++;
    }
    return cells;
}

function tableCanMergeCells(table, startX, startY, endX, endY) {
}

function tableMergeCells(table, startX, startY, endX, endY) {
    var googTable = new GoogTable(table);
    googTable.mergeCells(startX, startY, endX, endY);
}

function tableCanSplitCells(table, x, y) {
}

function tableSplitCells(table, x, y) {
    var googTable = new GoogTable(table);
    googTable.splitCell(x, y);
}

                /* End of file: build/default/src/tools/table.js */
            
                /* File: build/default/src/tools/tag.js */
                



function tagCustomApplyToSelection(tag, className) {
    var applier = rangy.createCssClassApplier(className, {
        elementTagName: tag
    });
    applier.applyToSelection();
}

function tagCustomRemoveFromSelection(tag, className) {
    var applier = rangy.createCssClassApplier(className, {
        elementTagName: tag
    });
    applier.undoToSelection();
}

                /* End of file: build/default/src/tools/tag.js */
            
                /* File: build/default/src/tools/template.js */
                var templateCache = { 'click-button-to-edit.button': "<button class=\"{{baseClass}}-button\">_('clickButtonToEditPluginButton')<\/button>\n",
'color-picker-basic.menu': "<li data-color=\"automatic\"><a><div class=\"{{baseClass}}-swatch\" style=\"display: none\"><\/div> <span>_('colorPickerBasicAutomatic')<\/span><\/a><\/li>\n<li data-color=\"white\"><a><div class=\"{{baseClass}}-swatch\" style=\"background-color: #ffffff\"><\/div> <span>_('colorPickerBasicWhite')<\/span><\/a><\/li>\n<li data-color=\"black\"><a><div class=\"{{baseClass}}-swatch\" style=\"background-color: #000000\"><\/div> <span>_('colorPickerBasicBlack')<\/span><\/a><\/li>\n<li data-color=\"grey\"><a><div class=\"{{baseClass}}-swatch\" style=\"background-color: #999\"><\/div> <span>_('colorPickerBasicGrey')<\/span><\/a><\/li>\n<li data-color=\"blue\"><a><div class=\"{{baseClass}}-swatch\" style=\"background-color: #4f81bd\"><\/div> <span>_('colorPickerBasicBlue')<\/span><\/a><\/li>\n<li data-color=\"red\"><a><div class=\"{{baseClass}}-swatch\" style=\"background-color: #c0504d\"><\/div> <span>_('colorPickerBasicRed')<\/span><\/a><\/li>\n<li data-color=\"green\"><a><div class=\"{{baseClass}}-swatch\" style=\"background-color: #9bbb59\"><\/div> <span>_('colorPickerBasicGreen')<\/span><\/a><\/li>\n<li data-color=\"purple\"><a><div class=\"{{baseClass}}-swatch\" style=\"background-color: #8064a2\"><\/div> <span>_('colorPickerBasicPurple')<\/span><\/a><\/li>\n<li data-color=\"orange\"><a><div class=\"{{baseClass}}-swatch\" style=\"background-color: #f79646\"><\/div> <span>_('colorPickerBasicOrange')<\/span><\/a><\/li>\n",
'embed.dialog': "<div class=\"{{baseClass}}-dialog\">\n    <div class=\"{{baseClass}}-panel-tabs ui-tabs ui-widget ui-widget-content ui-corner-all\">\n        <ul class=\"ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all\">\n            <li class=\"ui-state-default ui-corner-top ui-tabs-selected ui-state-active\"><a>_('embedDialogTabCode')<\/a><\/li>\n            <li class=\"ui-state-default ui-corner-top\"><a>_('embedDialogTabPreview')<\/a><\/li>\n        <\/ul>\n        <div class=\"{{baseClass}}-code-tab\">\n            <p>_('embedDialogTabCodeContent')<\/p>\n            <textarea><\/textarea>\n        <\/div>\n        <div class=\"{{baseClass}}-preview-tab\" style=\"display: none\">\n            <p>_('embedDialogTabPreviewContent')<\/p>\n            <div class=\"{{baseClass}}-preview\"><\/div>\n        <\/div>\n    <\/div>\n<\/div>\n",
'link.dialog': "<div style=\"display:none\" class=\"{{baseClass}}-panel\">\n    <div class=\"{{baseClass}}-menu\">\n        <p>_('linkDialogMenuHeader')<\/p>\n        <fieldset data-menu=\"\"><\/fieldset>\n    <\/div>\n    <div class=\"{{baseClass}}-wrap\">\n        <div class=\"{{baseClass}}-content\" data-content=\"\"><\/div>\n    <\/div>\n<\/div>\n",
'link.email': "<h2>_('linkTypeEmailHeader')<\/h2>\n<fieldset class=\"{{baseClass}}-email\">\n    <label for=\"{{baseClass}}-email\">_('linkTypeEmailToLabel')<\/label>\n    <input id=\"{{baseClass}}-email\" name=\"email\" type=\"text\" placeholder=\"_('linkTypeEmailToPlaceHolder')\"\/>\n<\/fieldset>\n<fieldset class=\"{{baseClass}}-email\">\n    <label for=\"{{baseClass}}-email-subject\">_('linkTypeEmailSubjectLabel')<\/label>\n    <input id=\"{{baseClass}}-email-subject\" name=\"subject\" type=\"text\" placeholder=\"_('linkTypeEmailSubjectPlaceHolder')\"\/>\n<\/fieldset>\n",
'link.external': "<h2>_('linkTypeExternalHeader')<\/h2>\n<fieldset>\n    <label for=\"{{baseClass}}-external-href\">_('linkTypeExternalLocationLabel')<\/label>\n    <input id=\"{{baseClass}}-external-href\" value=\"http:\/\/\" name=\"location\" class=\"{{baseClass}}-external-href\" type=\"text\" placeholder=\"_('linkTypeExternalLocationPlaceHolder')\" \/>\n<\/fieldset>\n<h2>_('linkTypeExternalNewWindowHeader')<\/h2>\n<fieldset>\n    <label for=\"{{baseClass}}-external-target\">\n        <input id=\"{{baseClass}}-external-target\" name=\"blank\" type=\"checkbox\" \/>\n        <span>_('linkTypeExternalNewWindowLabel')<\/span>\n    <\/label>\n<\/fieldset>\n_('linkTypeExternalInfo')\n",
'link.internal': "<h2>_('linkTypeInternalHeader')<\/h2>\n<fieldset>\n    <label for=\"{{baseClass}}-external-href\">_('linkTypeInternalLocationLabel') {{domain}}<\/label>\n    <input id=\"{{baseClass}}-external-href\" value=\"\" name=\"location\" class=\"{{baseClass}}-external-href\" type=\"text\" placeholder=\"_('linkTypeInternalLocationPlaceHolder')\" \/>\n<\/fieldset>\n<h2>_('linkTypeInternalNewWindowHeader')<\/h2>\n<fieldset>\n    <label for=\"{{baseClass}}-external-target\">\n        <input id=\"{{baseClass}}-external-target\" name=\"blank\" type=\"checkbox\" \/>\n        <span>_('linkTypeInternalNewWindowLabel')<\/span>\n    <\/label>\n<\/fieldset>\n_('linkTypeInternalInfo')\n",
'link.label': "<label>\n    <input class=\"{{classes}}\" type=\"radio\" name=\"link-type\" autocomplete=\"off\"\/>\n    <span>{{label}}<\/span>\n<\/label>\n",
'statistics.dialog': "<div>\n    <ul>\n        <li data-name=\"characters\"><\/li>\n        <li data-name=\"words\"><\/li>\n        <li data-name=\"sentences\"><\/li>\n        <li data-name=\"truncation\"><\/li>\n    <\/ul>\n<\/div>\n",
'table.create-menu': "<table class=\"{{baseClass}}-menu\">\n    <tr>\n        <td><\/td>\n        <td><\/td>\n        <td><\/td>\n        <td><\/td>\n        <td><\/td>\n        <td><\/td>\n        <td><\/td>\n        <td><\/td>\n    <\/tr>\n    <tr>\n        <td><\/td>\n        <td><\/td>\n        <td><\/td>\n        <td><\/td>\n        <td><\/td>\n        <td><\/td>\n        <td><\/td>\n        <td><\/td>\n    <\/tr>\n    <tr>\n        <td><\/td>\n        <td><\/td>\n        <td><\/td>\n        <td><\/td>\n        <td><\/td>\n        <td><\/td>\n        <td><\/td>\n        <td><\/td>\n    <\/tr>\n    <tr>\n        <td><\/td>\n        <td><\/td>\n        <td><\/td>\n        <td><\/td>\n        <td><\/td>\n        <td><\/td>\n        <td><\/td>\n        <td><\/td>\n    <\/tr>\n    <tr>\n        <td><\/td>\n        <td><\/td>\n        <td><\/td>\n        <td><\/td>\n        <td><\/td>\n        <td><\/td>\n        <td><\/td>\n        <td><\/td>\n    <\/tr>\n    <tr>\n        <td><\/td>\n        <td><\/td>\n        <td><\/td>\n        <td><\/td>\n        <td><\/td>\n        <td><\/td>\n        <td><\/td>\n        <td><\/td>\n    <\/tr>\n    <tr>\n        <td><\/td>\n        <td><\/td>\n        <td><\/td>\n        <td><\/td>\n        <td><\/td>\n        <td><\/td>\n        <td><\/td>\n        <td><\/td>\n    <\/tr>\n    <tr>\n        <td><\/td>\n        <td><\/td>\n        <td><\/td>\n        <td><\/td>\n        <td><\/td>\n        <td><\/td>\n        <td><\/td>\n        <td><\/td>\n    <\/tr>\n<\/table>\n",
'tag-menu.menu': "<li data-value=\"na\"><a>_('tagMenuTagNA')<\/a><\/li>\n<li data-value=\"p\"><a>_('tagMenuTagP')<\/a><\/li>\n<li data-value=\"h1\"><a>_('tagMenuTagH1')<\/a><\/li>\n<li data-value=\"h2\"><a>_('tagMenuTagH2')<\/a><\/li>\n<li data-value=\"h3\"><a>_('tagMenuTagH3')<\/a><\/li>\n",
'unsaved-edit-warning.warning': "<div class=\"{{baseClass}}\">\n    <span class=\"ui-icon ui-icon-alert\"><\/span>\n    <span>_('unsavedEditWarningText')<\/span>\n<\/div>\n",
'view-source.dialog': "<div class=\"{{baseClass}}-inner-wrapper\">\n    <textarea><\/textarea>\n<\/div>\n",
'message': "<div class=\"{{baseClass}}-message-wrapper {{baseClass}}-message-{{type}}\">\n    <div class=\"ui-icon ui-icon-{{type}}\" \/>\n    <div class=\"{{baseClass}}-message\">{{message}}<\/div>\n    <div class=\"{{baseClass}}-message-close ui-icon ui-icon-circle-close\"><\/div>\n<\/div>\n",
'messages': "<div class=\"{{baseClass}}-messages\" \/>\n",
'unsupported': "<div class=\"{{baseClass}}-unsupported-overlay\"><\/div>\n<div class=\"{{baseClass}}-unsupported-content\">\n    It has been detected that you a using a browser that is not supported by Raptor, please\n    use one of the following browsers:\n\n    <ul>\n        <li><a href=\"http:\/\/www.google.com\/chrome\">Google Chrome<\/a><\/li>\n        <li><a href=\"http:\/\/www.firefox.com\">Mozilla Firefox<\/a><\/li>\n        <li><a href=\"http:\/\/www.google.com\/chromeframe\">Internet Explorer with Chrome Frame<\/a><\/li>\n    <\/ul>\n\n    <div class=\"{{baseClass}}-unsupported-input\">\n        <button class=\"{{baseClass}}-unsupported-close\">Close<\/button>\n        <input name=\"{{baseClass}}-unsupported-show\" type=\"checkbox\" \/>\n        <label>Don't show this message again<\/label>\n    <\/div>\n<div>" };

function templateGet(name, urlPrefix) {
    if (templateCache[name]) {
        return templateCache[name];
    }
    
    // Parse the URL
    var url = urlPrefix;
    var split = name.split('.');
    if (split.length === 1) {
        // URL is for an editor core template
        url += 'templates/' + split[0] + '.html';
    } else {
        // URL is for a plugin template
        url += 'plugins/' + split[0] + '/templates/' + split.splice(1).join('/') + '.html';
    }

    // Request the template
    var template;
    $.ajax({
        url: url,
        type: 'GET',
        async: false,
        // <debug/>
        // 15 seconds
        timeout: 15000,
        error: function() {
            template = null;
        },
        success: function(data) {
            template = data;
        }
    });
    
    // Cache the template
    templateCache[name] = template;
    
    return template;
};


function templateConvertTokens(template, variables) {
    // Translate template
    template = template.replace(/_\(['"]{1}(.*?)['"]{1}\)/g, function(match, key) {
        key = key.replace(/\\(.?)/g, function (s, slash) {
            switch (slash) {
                case '\\': {
                    return '\\';
                }
                case '0': {
                    return '\u0000';
                }
                case '': {
                    return '';
                }
                default: {
                    return slash;
                }
            }
        });
        return _(key);
    });
    
    // Replace variables
    variables = $.extend({}, this.options, variables || {});
    variables = templateGetVariables(variables);
    template = template.replace(/\{\{(.*?)\}\}/g, function(match, variable) {
        return variables[variable];
    });
    
    return template;
};

function templateGetVariables(variables, prefix, depth) {
    prefix = prefix ? prefix + '.' : '';
    var maxDepth = 5;
    if (!depth) depth = 1;
    var result = {};
    for (var name in variables) {
        if (typeof variables[name] === 'object' && depth < maxDepth) {
            var inner = templateGetVariables(variables[name], prefix + name, ++depth);
            for (var innerName in inner) {
                result[innerName] = inner[innerName];
            }
        } else {
            result[prefix + name] = variables[name];
        }
    }
    return result;
};

                /* End of file: build/default/src/tools/template.js */
            
                /* File: build/default/src/tools/types.js */
                /**
 * @fileOverview Type checking functions.
 * @author Michael Robinson michael@panmedia.co.nz
 * @author David Neilsen david@panmedia.co.nz
 */

/**
 * Determine whether object is a number {@link http://stackoverflow.com/a/1421988/187954}.
 * @param  {mixed} object The object to be tested
 * @return {Boolean} True if the object is a number.
 */
function typeIsNumber(object) {
    return !isNaN(object - 0) && object !== null;
}

                /* End of file: build/default/src/tools/types.js */
            
                /* File: build/default/src/raptor.js */
                var Raptor = /** @lends $.ui.raptor */ {

    /**
     * Default options for Raptor.
     *
     * @namespace Default options for Raptor.
     */
    defaults: {
        /**
         * @type Object Default layout to use.
         */
        layout: null,

        /**
         * Plugins option overrides.
         *
         * @type Object
         */
        plugins: {},

        /**
         * UI option overrides.
         *
         * @type Object
         */
        ui: {},

        /**
         * Default events to bind.
         *
         * @type Object
         */
        bind: {},

        /**
         * Namespace used for persistence to prevent conflicting with other stored values.
         *
         * @type String
         */
        namespace: null,

        /**
         * Switch to indicated that some events should be automatically applied to all editors that are 'unified'
         * @type boolean
         */
        unify: true,

        /**
         * Switch to indicate weather or not to stored persistent values, if set to false the persist function will always return null
         * @type boolean
         */
        persistence: true,

        /**
         * The name to store persistent values under
         * @type String
         */
        persistenceName: 'uiEditor',

        /**
         * Switch to indicate weather or not to a warning should pop up when the user navigates aways from the page and there are unsaved changes
         * @type boolean
         */
        unloadWarning: true,

        /**
         * Switch to automatically enabled editing on the element
         * @type boolean
         */
        autoEnable: false,

        /**
         * Only enable editing on certian parts of the element
         * @type {jQuerySelector}
         */
        partialEdit: false,

        /**
         * Switch to specify if the editor should automatically enable all plugins, if set to false, only the plugins specified in the 'plugins' option object will be enabled
         * @type boolean
         */
        enablePlugins: true,

        /**
         * An array of explicitly disabled plugins
         * @type String[]
         */
        disabledPlugins: [],

        /**
         * And array of arrays denoting the order and grouping of UI elements in the toolbar
         * @type String[]
         */
        uiOrder: null,

        /**
         * Switch to specify if the editor should automatically enable all UI, if set to false, only the UI specified in the {@link Raptor.defaults.ui} option object will be enabled
         * @type boolean
         */
        enableUi: true,

        /**
         * An array of explicitly disabled UI elements
         * @type String[]
         */
        disabledUi: [],

        /**
         * Default message options
         * @type Object
         */
        message: {
            delay: 5000
        },

        /**
         * Switch to indicate that the element the editor is being applied to should be replaced with a div (useful for textareas), the value/html of the replaced element will be automatically updated when the editor element is changed
         * @type boolean
         */
        replace: false,

        /**
         * A list of styles that will be copied from the replaced element and applied to the editor replacement element
         * @type String[]
         */
        replaceStyle: [
            'display', 'position', 'float', 'width',
            'padding-left', 'padding-right', 'padding-top', 'padding-bottom',
            'margin-left', 'margin-right', 'margin-top', 'margin-bottom'
        ],

        /**
         *
         * @type String
         */
        baseClass: 'raptor',

        /**
         * CSS class prefix that is prepended to inserted elements classes. E.g. "cms-bold"
         * @type String
         */
        cssPrefix: 'cms-',

        draggable: true
    },

    /** @type {Boolean} True to enable hotkeys */
    enableHotkeys: true,

    /** @type {Object} Custom hotkeys */
    hotkeys: {},

    /**
     * Events added via Raptor.bind
     * @property {Object} events
     */
    events: {},

    /**
     * Plugins added via Raptor.registerPlugin
     * @property {Object} plugins
     */
    plugins: {},

    /**
     * UI added via Raptor.registerUi
     * @property {Object} ui
     */
    ui: {},

    /**
     * Layouts added via Raptor.registerLayout
     * @property {Object} layouts
     */
    layouts: {},

    /**
     * Presets added via Raptor.registerPreset
     * @property {Object} presets
     */
    presets: {},

    /**
     * @property {Raptor[]} instances
     */
    instances: [],

    /**
     * @returns {Raptor[]}
     */
    getInstances: function() {
        return this.instances;
    },

    eachInstance: function(callback) {
        for (var i = 0; i < this.instances.length; i++) {
            callback.call(this.instances[i], this.instances[i]);
        }
    },

    /*========================================================================*\
     * Templates
    \*========================================================================*/
    /**
     * @property {String} urlPrefix
     */
    urlPrefix: '/raptor/',

    /**
     * @param {String} name
     * @returns {String}
     */
    getTemplate: function(name, urlPrefix) {
        var template;
        if (!this.templates[name]) {
            // Parse the URL
            var url = urlPrefix || this.urlPrefix;
            var split = name.split('.');
            if (split.length === 1) {
                // URL is for and editor core template
                url += 'templates/' + split[0] + '.html';
            } else {
                // URL is for a plugin template
                url += 'plugins/' + split[0] + '/templates/' + split.splice(1).join('/') + '.html';
            }

            // Request the template
            $.ajax({
                url: url,
                type: 'GET',
                async: false,
                // <debug/>
                // 15 seconds
                timeout: 15000,
                error: function() {
                    template = null;
                },
                success: function(data) {
                    template = data;
                }
            });
            // Cache the template
            this.templates[name] = template;
        } else {
            template = this.templates[name];
        }
        return template;
    },

    /*========================================================================*\
     * Helpers
    \*========================================================================*/
    /**
     * @returns {String}
     */
    getUniqueId: function() {
        var id = Raptor.defaults.baseClass + '-uid-' + new Date().getTime() + '-' + Math.floor(Math.random() * 100000);
        while ($('#' + id).length) {
            id = Raptor.defaults.baseClass + '-uid-' + new Date().getTime() + '-' + Math.floor(Math.random() * 100000);
        }
        return id;
    },

    /**
     * @returns {boolean}
     */
    isDirty: function() {
        var instances = this.getInstances();
        for (var i = 0; i < instances.length; i++) {
            if (instances[i].isDirty()) return true;
        }
        return false;
    },

    /**
     *
     */
    unloadWarning: function() {
        var instances = this.getInstances();
        for (var i = 0; i < instances.length; i++) {
            if (instances[i].isDirty() &&
                    instances[i].isEditing() &&
                    instances[i].options.unloadWarning) {
                return _('\nThere are unsaved changes on this page. \nIf you navigate away from this page you will lose your unsaved changes');
            }
        }
    },

    /*========================================================================*\
     * Plugins as UI
    \*========================================================================*/

    /**
     * Registers a new UI component, overriding any previous UI components registered with the same name.
     *
     * @param {String} name
     * @param {Object} ui
     */
    registerUi: function(ui) {
        // <strict/>
        this.ui[ui.name] = ui;
    },

    /**
     * Registers a new layout, overriding any previous layout registered with the same name.
     *
     * @param {String} name
     * @param {Object} layout
     */
    registerLayout: function(name, layout) {
        // <strict/>
        this.layouts[name] = layout;
    },

    /**
     * Registers a new preset, overriding any previous preset registered with the same name.
     *
     * @param {String} name
     * @param {Object} preset
     */
    registerPreset: function(name, preset) {
        // <strict/>
        this.presets[name] = preset;
    },

    registerPlugin: function(plugin) {
        // <strict/>

        this.plugins[plugin.name] = plugin;
    },

    /*========================================================================*\
     * Events
    \*========================================================================*/

    /**
     * @param {String} name
     * @param {function} callback
     */
    bind: function(name, callback) {
        if (!this.events[name]) this.events[name] = [];
        this.events[name].push(callback);
    },

    /**
     * @param {function} callback
     */
    unbind: function(callback) {
        $.each(this.events, function(name) {
            for (var i = 0; i < this.length; i++) {
                if (this[i] === callback) {
                    this.events[name].splice(i,1);
                }
            }
        });
    },

    /**
     * @param {String} name
     */
    fire: function(name) {
        // <debug/>
        if (!this.events[name]) {
            return;
        }
        for (var i = 0, l = this.events[name].length; i < l; i++) {
            this.events[name][i].call(this);
        }
    },

    /*========================================================================*\
     * Persistance
    \*========================================================================*/
    /**
     * @param {String} key
     * @param {mixed} value
     * @param {String} namespace
     */
    persist: function(key, value, namespace) {
        key = namespace ? namespace + '.' + key : key;
        if (localStorage) {
            var storage;
            if (localStorage.uiWidgetEditor) {
                storage = JSON.parse(localStorage.uiWidgetEditor);
            } else {
                storage = {};
            }
            if (value === undefined) return storage[key];
            storage[key] = value;
            localStorage.uiWidgetEditor = JSON.stringify(storage);
        }

        return value;
    }

};

                /* End of file: build/default/src/raptor.js */
            
                /* File: build/default/src/jquery.ui.editor.js */
                /**
 *
 * @author David Neilsen - david@panmedia.co.nz
 * @author Michael Robinson - michael@panmedia.co.nz
 * @version 0.1
 * @requires jQuery
 * @requires jQuery UI
 * @requires Rangy
 */

/**
 * @lends $.editor.prototype
 */
var RaptorWidget = {

    /**
     * Constructor
     */
    _init: function() {
        // Add the editor instance to the global list of instances
        if ($.inArray(this, Raptor.instances) === -1) {
            Raptor.instances.push(this);
        }

        var currentInstance = this;
        // <strict/>

        this.options = $.extend({}, Raptor.defaults, this.options);

        // Give the element a unique ID
        if (!this.element.attr('id')) {
            this.element.attr('id', this.getUniqueId());
        }

        // Initialise properties
        this.ready = false;
        this.events = {};
        this.ui = {};
        this.plugins = {};
        this.templates = $.extend({}, Raptor.templates);
        this.target = this.element;
        this.layout = null;
        this.previewState = null;

        // True if editing is enabled
        this.enabled = false;

        // True if the layout has been loaded and displayed
        this.visible = false;

        // List of UI objects bound to the editor
        this.uiObjects = {};

        // List of hotkeys bound to the editor
        this.hotkeys = {};
        // If hotkeys are enabled, register any custom hotkeys provided by the user
        if (this.options.enableHotkeys) {
            this.registerHotkey(this.hotkeys);
        }

        // Bind default events
        for (var name in this.options.bind) {
            this.bind(name, this.options.bind[name]);
        }

        // Undo stack, redo pointer
        this.history = [];
        this.present = 0;
        this.historyEnabled = true;

        // Check for browser support
        if (!isSupported(this)) {
            // @todo If element isn't a textarea, replace it with one
            return;
        }

        // Store the original HTML
        this.setOriginalHtml(this.element.is(':input') ? this.element.val() : this.element.html());

        // Replace textareas/inputs with a div
        if (this.element.is(':input')) {
            this.replaceOriginal();
        }

        // Attach core events
        this.attach();

        // Load plugins
        this.loadPlugins();

        // Stores if the current state of the content is clean
        this.dirty = false;

        // Stores the previous state of the content
        this.previousContent = null;

        // Stores the previous selection
        this.previousSelection = null;

        // Set the initial locale
        var locale = this.persist('locale') || this.options.initialLocale;
        if (locale) {
            setLocale(locale);
        }

        // Fire the ready event
        this.ready = true;
        this.fire('ready');

        // Automatically enable the editor if autoEnable is true
        if (this.options.autoEnable) {
            $(function() {
                currentInstance.enableEditing();
                currentInstance.showLayout();
            });
        }
    },

    /*========================================================================*\
     * Core functions
    \*========================================================================*/

    /**
     * Attaches the editors internal events.
     */
    attach: function() {
        this.bind('change', this.historyPush);

        this.getElement().find('img').bind('click.' + this.widgetName, function(event){
            selectionSelectOuter(event.target);
        }.bind(this));

        this.target.bind('mouseup.' + this.widgetName, this.checkSelectionChange.bind(this));
        this.target.bind('keyup.' + this.widgetName, this.checkChange.bind(this));

        // Unload warning
        $(window).bind('beforeunload', Raptor.unloadWarning.bind(Raptor));

        // Trigger editor resize when window is resized
        var editor = this;
        $(window).resize(function(event) {
            editor.fire('resize');
        });
    },

    /**
     * Reinitialises the editor, unbinding all events, destroys all UI and plugins
     * then recreates them.
     */
    reinit: function() {
        if (!this.ready) {
            // If the edit is still initialising, wait until its ready
            var reinit;
            reinit = function() {
                // Prevent reinit getting called twice
                this.unbind('ready', reinit);
                this.reinit();
            };
            this.bind('ready', reinit);
            return;
        }
        // <debug/>

        // Store the state of the editor
        var enabled = this.enabled,
            visible = this.visible;

        // We are ready, so we can run reinit now
        this.destruct(true);
        this._init();

        // Restore the editor state
        if (enabled) {
            this.enableEditing();
        }

        if (visible) {
            this.showLayout();
        }
    },

    /**
     * Returns the current content editable element, which will be either the
     * orignal element, or the div the orignal element was replaced with.
     * @returns {jQuery} The current content editable element
     */
    getElement: function() {
        return this.target;
    },

    /**
     *
     */
    getOriginalElement: function() {
        return this.element;
    },

    /**
     * Replaces the original element with a content editable div. Typically used
     * to replace a textarea.
     */
    replaceOriginal: function() {
        if (this.target) return;

        // Create the replacement div
        var target = $('<div/>')
            // Set the HTML of the div to the HTML of the original element, or if the original element was an input, use its value instead
            .html(this.element.val())
            // Insert the div before the original element
            .insertBefore(this.element)
            // Give the div a unique ID
            .attr('id', this.getUniqueId())
            // Copy the original elements class(es) to the replacement div
            .addClass(this.element.attr('class'));

        var style = elementGetStyles(this.element);
        for (var i = 0; i < this.options.replaceStyle.length; i++) {
            target.css(this.options.replaceStyle[i], style[this.options.replaceStyle[i]]);
        }

        this.element.hide();
        this.bind('change', function() {
            if (this.getOriginalElement().is(':input')) {
                this.getOriginalElement().val(this.getHtml());
            } else {
                this.getOriginalElement().html(this.getHtml());
            }
        });

        this.target = target;
    },

    checkSelectionChange: function() {
        // Check if the caret has changed position
        var currentSelection = rangy.serializeSelection();
        if (this.previousSelection !== currentSelection) {
            this.fire('selectionChange');
        }
        this.previousSelection = currentSelection;
    },

    /**
     * Determine whether the editing element's content has been changed.
     */
    checkChange: function() {
        // Get the current content
        var currentHtml = this.getHtml();

        // Check if the dirty state has changed
        var wasDirty = this.dirty;

        // Check if the current content is different from the original content
        this.dirty = this.originalHtml !== currentHtml;

        // If the current content has changed since the last check, fire the change event
        if (this.previousHtml !== currentHtml) {
            this.previousHtml = currentHtml;
            this.fire('change');

            // If the content was changed to its original state, fire the cleaned event
            if (wasDirty !== this.dirty) {
                if (this.dirty) {
                    this.fire('dirty');
                } else {
                    this.fire('cleaned');
                }
            }
        }
    },

    change: function() {
        this.fire('change');
    },

    /*========================================================================*\
     * Destructor
    \*========================================================================*/

    /**
     * Hides the toolbar, disables editing, and fires the destroy event, and unbinds any events.
     * @public
     */
    destruct: function(reinitialising) {
        if (!reinitialising) {
            this.hideToolbar();
        }

        this.disableEditing();

        // Trigger destroy event, for plugins to remove them selves
        this.fire('destroy', false);

        // Remove all event bindings
        this.events = {};

        // Unbind all events
        this.getElement().unbind('.' + this.widgetName);

        if (this.getOriginalElement().is(':input')) {
            this.target.remove();
            this.target = null;
            this.element.show();
        }

        // Remove the layout
        if (this.layout) {
            this.layout.destruct();
        }
    },

    /**
     * Runs destruct, then calls the UI widget destroy function.
     * @see $.
     */
    destroy: function() {
        this.destruct();
        $.Widget.prototype.destroy.call(this);
    },

    /*========================================================================*\
     * Preview functions
    \*========================================================================*/

    actionPreview: function(action) {
        this.actionPreviewRestore();
        selectionConstrain(this.target);
        this.previewState = actionPreview(this.previewState, this.target, action);
    },

    actionPreviewRestore: function() {
        if (this.previewState) {
            this.target = actionPreviewRestore(this.previewState, this.target);
            this.previewState = null;
        }
    },

    actionApply: function(action) {
        this.actionPreviewRestore();
        selectionConstrain(this.target);
        actionApply(action, this.history);
        this.previewState = null;
        this.checkChange();
    },

    actionUndo: function() {

    },

    actionRedo: function() {

    },

    stateSave: function() {
        selectionConstrain(this.target);
        return stateSave(this.target);
    },

    stateRestore: function(state) {
        var restoredState = stateRestore(this.target, state),
            selection = rangy.getSelection();
        this.target = restoredState.element;
        selection.setRanges(restoredState.ranges);
        selection.refresh();
    },

    /*========================================================================*\
     * Persistance Functions
    \*========================================================================*/

    /**
     * @param {String} key
     * @param {mixed} [value]
     * @returns {mixed}
     */
    persist: function(key, value) {
        if (!this.options.persistence) return null;
        return Raptor.persist(key, value, this.options.namespace);
    },

    /*========================================================================*\
     * Other Functions
    \*========================================================================*/

    /**
     *
     */
    enableEditing: function() {
        this.loadLayout();

        if (!this.enabled) {
            this.enabled = true;
            this.getElement().addClass(this.options.baseClass + '-editing');

            if (this.options.partialEdit) {
                this.getElement().find(this.options.partialEdit).attr('contenteditable', true);
            } else {
                this.getElement().attr('contenteditable', true);
            }

            try {
                document.execCommand('enableInlineTableEditing', false, false);
                document.execCommand('styleWithCSS', true, true);
            } catch (error) {
                handleError(error);
            }

            for (var name in this.plugins) {
                this.plugins[name].enable();
            }

            this.bindHotkeys();

            this.fire('enabled');
            this.fire('resize');
        }
    },

    /**
     *
     */
    disableEditing: function() {
        if (this.enabled) {
            this.enabled = false;
            this.getElement().attr('contenteditable', false)
                        .removeClass(this.options.baseClass + '-editing');
            rangy.getSelection().removeAllRanges();
            this.fire('disabled');
        }
    },

    cancelEditing: function() {
        this.fire('cancel');
        this.resetHtml();
        this.hideLayout();
        this.disableEditing();
        selectionDestroy();
    },

    /**
     *
     * @returns {boolean}
     */
    isEditing: function() {
        return this.enabled;
    },

    /**
     * @param {jQuerySelector|jQuery|Element} element
     * @returns {boolean}
     */
    isRoot: function(element) {
        return this.getElement()[0] === $(element)[0];
    },

    /**
     * @param {function} callback
     * @param {boolean} [callSelf]
     */
    unify: function(callback, callSelf) {
        if (callSelf !== false) callback(this);
        if (this.options.unify) {
            var currentInstance = this;
            Raptor.eachInstance(function(instance) {
                if (instance === currentInstance) {
                    return;
                }
                if (instance.options.unify) {
                    callback(instance);
                }
            });
        }
    },

    /**
     * @returns {String}
     */
    getUniqueId: function() {
        return Raptor.getUniqueId();
    },

    /*========================================================================*\
     * Messages
    \*========================================================================*/

    /**
     *
     */
    loadMessages: function() {
        this.messages = $(this.getTemplate('messages', this.options)).appendTo(this.getLayout().getElement());
    },

    /**
     * @param {String} type
     * @param {String[]} messages
     */
    showMessage: function(type, message, options) {
        options = $.extend({}, this.options.message, options);

        var messageObject;
        messageObject = {
            timer: null,
            editor: this,
            show: function() {
                this.element.slideDown();
                this.timer = window.setTimeout(function() {
                    this.timer = null;
                    messageObject.hide();
                }, options.delay, this);
            },
            hide: function() {
                if (this.timer) {
                    window.clearTimeout(this.timer);
                    this.timer = null;
                }
                this.element.stop().slideUp(function() {
                    if ($.isFunction(options.hide)) {
                        options.hide.call(this);
                    }
                    this.element.remove();
                }.bind(this));
            }
        };

        messageObject.element =
            $(this.getTemplate('message', $.extend(this.options, {
                type: type,
                message: message
            })))
            .hide()
            .appendTo(this.messages)
            .find('.ui-editor-message-close')
                .click(function() {
                    messageObject.hide();
                })
            .end();

        messageObject.show();

        return messageObject;
    },

    /**
     * @param {String[]} messages
     */
    showLoading: function(message, options) {
        return this.showMessage('clock', message, options);
    },

    /**
     * @param {String[]} messages
     */
    showInfo: function(message, options) {
        return this.showMessage('info', message, options);
    },

    /**
     * @param {String[]} messages
     */
    showError: function(message, options) {
        return this.showMessage('circle-close', message, options);
    },

    /**
     * @param {String[]} messages
     */
    showConfirm: function(message, options) {
        return this.showMessage('circle-check', message, options);
    },

    /**
     * @param {String[]} messages
     */
    showWarning: function(message, options) {
        return this.showMessage('alert', message, options);
    },

    /*========================================================================*\
     * Layout
    \*========================================================================*/
    getLayout: function() {
        return this.layout;
    },

    loadLayout: function() {
        if (!this.layout) {
            this.layout = $.extend({}, Raptor.layouts[this.options.layout.type]);
            this.layout.editor = this;
            this.layout.options = $.extend(true, {}, this.options, this.layout.options, this.options.layout.options);
            this.layout.init(this, this.layout.options);
        }
    },

    /**
     * Show the layout for the current element.
     * @param  {Range} [range] a native range to select after the layout has been shown
     */
    showLayout: function(range) {
        this.loadLayout();

        if (!this.visible) {
            // <debug/>

            // If unify option is set, hide all other layouts first
            if (this.options.unify) {
                this.hideOtherLayouts(true);
            }

            // Store the visible state
            this.visible = true;

            this.layout.show();

            this.fire('resize');
            if (typeof this.getElement().attr('tabindex') === 'undefined') {
                this.getElement().attr('tabindex', -1);
            }

            if (range) {
                if (range.select) { // IE
                    range.select();
                } else { // Others
                    var selection = window.getSelection();
                    selection.removeAllRanges();
                    selection.addRange(range);
                }
            }

            var editor = this;
            $(function() {
                editor.fire('show');
                editor.getElement().focus();
                editor.fire('selectionChange');
            });
        }
    },

    /**
     *
     */
    hideLayout: function() {
        if (this.layout) {
            this.visible = false;
            this.layout.hide();
            this.fire('hide');
            this.fire('resize');
        }
    },

    /**
     * @param {boolean} [instant]
     */
    hideOtherLayouts: function(instant) {
        this.unify(function(editor) {
            editor.hideLayout(instant);
        }, false);
    },

    /**
     *
     * @returns {boolean}
     */
    isVisible: function() {
        return this.visible;
    },

    /*========================================================================*\
     * Template functions
    \*========================================================================*/

    /**
     * @param {String} name
     * @param {Object} variables
     */
    getTemplate: function(name, variables) {
        if (!this.templates[name]) {
            this.templates[name] = templateGet(name, this.options.urlPrefix);
        }
        return templateConvertTokens(this.templates[name], variables);;
    },

    /*========================================================================*\
     * History functions
    \*========================================================================*/
    /**
     *
     */
    historyPush: function() {
        if (!this.historyEnabled) return;
        var html = this.getHtml();
        if (html !== this.historyPeak()) {
            // Reset the future on change
            if (this.present !== this.history.length - 1) {
                this.history = this.history.splice(0, this.present + 1);
            }

            // Add new HTML to the history
            this.history.push(this.getHtml());

            // Mark the persent as the end of the history
            this.present = this.history.length - 1;
        }
    },

    /**
     * @returns {String|null}
     */
    historyPeak: function() {
        if (!this.history.length) return null;
        return this.history[this.present];
    },

    /**
     *
     */
    historyBack: function() {
        if (this.present > 0) {
            this.present--;
            this.setHtml(this.history[this.present]);
            this.historyEnabled = false;
            this.change();
            this.historyEnabled = true;
        }
    },

    /**
     *
     */
    historyForward: function() {
        if (this.present < this.history.length - 1) {
            this.present++;
            this.setHtml(this.history[this.present]);
            this.historyEnabled = false;
            this.change();
            this.historyEnabled = true;
        }
    },

    /*========================================================================*\
     * Hotkeys
    \*========================================================================*/

    /**
     * @param {Array|String} mixed The hotkey name or an array of hotkeys
     * @param {Object} The hotkey object or null
     */
    registerHotkey: function(mixed, actionData, context) {
        // Allow array objects, and single plugins
        if (typeof(mixed) === 'string') {

            // <strict/>

            this.hotkeys[mixed] = $.extend({}, {
                context: context,
                restoreSelection: true
            }, actionData);

        } else {
            for (var name in mixed) {
                this.registerHotkey(name, mixed[name], context);
            }
        }
    },

    bindHotkeys: function() {
        for (var keyCombination in this.hotkeys) {
            var editor = this,
                force = this.hotkeys[keyCombination].force || false;

            if (!this.options.enableHotkeys && !force) {
                continue;
            }

            this.getElement().bind('keydown.' + this.widgetName, keyCombination, function(event) {
                selectionSave();
                var object = editor.hotkeys[event.data];
                // Returning true from action will allow event bubbling
                if (object.action.call(object.context) !== true) {
                    event.preventDefault();
                }
                if (object.restoreSelection) {
                    selectionRestore();
                }
                editor.checkChange();
            });
        }
    },

    /*========================================================================*\
     * Buttons
    \*========================================================================*/

    isUiEnabled: function(ui) {
        // Check if we are not automatically enabling UI, and if not, check if the UI was manually enabled
        if (this.options.enableUi === false &&
                typeof this.options.ui[ui] === 'undefined' ||
                this.options.ui[ui] === false) {
            // <debug/>
            return false;
        }

        // Check if we have explicitly disabled UI
        if ($.inArray(ui, this.options.disabledUi) !== -1) {
            return false;
        }

        return true;
    },

    /**
     * @param  {String} ui Name of the UI object to be returned.
     * @return {Object|null} UI object referenced by the given name.
     */
    getUi: function(ui) {
        return this.uiObjects[ui];
    },

    /*========================================================================*\
     * Plugins
    \*========================================================================*/
    /**
     * @param {String} name
     * @return {Object|undefined} plugin
     */
    getPlugin: function(name) {
        return this.plugins[name];
    },

    /**
     *
     */
    loadPlugins: function() {
        var editor = this;

        if (!this.options.plugins) {
            this.options.plugins = {};
        }

        for (var name in Raptor.plugins) {
            // Check if we are not automaticly enabling plugins, and if not, check if the plugin was manually enabled
            if (this.options.enablePlugins === false &&
                    typeof this.options.plugins[name] === 'undefined' ||
                    this.options.plugins[name] === false) {
                // <debug/>
                continue;
            }

            // Check if we have explicitly disabled the plugin
            if ($.inArray(name, this.options.disabledPlugins) !== -1) continue;

            // Clone the plugin object (which should be extended from the defaultPlugin object)
            var pluginObject = $.extend({}, Raptor.plugins[name]);

            var baseClass = name.replace(/([A-Z])/g, function(match) {
                return '-' + match.toLowerCase();
            });

            var options = $.extend(true, {}, editor.options, {
                baseClass: editor.options.baseClass + '-' + baseClass
            }, pluginObject.options, editor.options.plugins[name]);

            pluginObject.editor = editor;
            pluginObject.options = options;
            pluginObject.init(editor, options);

            if (pluginObject.hotkeys) {
                this.registerHotkey(pluginObject.hotkeys, null, pluginObject);
            }

            editor.plugins[name] = pluginObject;
        }
    },

    /*========================================================================*\
     * Content accessors
    \*========================================================================*/

    /**
     * @returns {boolean}
     */
    isDirty: function() {
        return this.dirty;
    },

    /**
     * @returns {String}
     */
    getHtml: function() {
        return this.target.html();
    },

    getCleanHtml: function() {
        this.fire('clean');
        var content = this.getElement().html();
        this.fire('restore');

        // Remove saved rangy ranges
        content = $('<div/>').html(content);
        content.find('.rangySelectionBoundary').remove();
        content = content.html();

        return content;
    },

    /**
     * @param {String} html
     */
    setHtml: function(html) {
        this.getElement().html(html);
        this.fire('html');
        this.change();
    },

    /**
     *
     */
    resetHtml: function() {
        this.setHtml(this.getOriginalHtml());
        this.fire('cleaned');
    },

    /**
     * @returns {String}
     */
    getOriginalHtml: function() {
        return this.originalHtml;
    },

    /**
     *
     */
    saved: function() {
        this.setOriginalHtml(this.getHtml());
        this.dirty = false;
        this.fire('saved');
        this.fire('cleaned');
    },

    /**
     * @param {String} html
     */
    setOriginalHtml: function(html) {
        this.originalHtml = html;
    },

    /*========================================================================*\
     * Event handling
    \*========================================================================*/
    /**
     * @param {String} name
     * @param {function} callback
     * @param {Object} [context]
     */
    bind: function(name, callback, context) {
        // <strict/>
        var names = name.split(/,\s*/);
        for (var i = 0, l = names.length; i < l; i++) {
            if (!this.events[names[i]]) {
                this.events[names[i]] = [];
            }
            this.events[names[i]].push({
                context: context,
                callback: callback
            });
        }
    },

    /**
     * @param {String} name
     * @param {function} callback
     * @param {Object} [context]
     */
    unbind: function(name, callback, context) {
        for (var i = 0, l = this.events[name].length; i < l; i++) {
            if (this.events[name][i] &&
                this.events[name][i].callback === callback &&
                this.events[name][i].context === context) {
                this.events[name].splice(i, 1);
            }
        }
    },

    /**
     * @param {String} name
     * @param {boolean} [global]
     * @param {boolean} [sub]
     */
    fire: function(name, global, sub) {
        // Fire before sub-event
        if (!sub) {
            this.fire('before:' + name, global, true);
        }

        // <debug/>

        if (this.events[name]) {
            for (var i = 0, l = this.events[name].length; i < l; i++) {
                var event = this.events[name][i];
                if (typeof event.callback !== 'undefined') {
                    event.callback.call(event.context || this);
                }
            }
        }

        // Also trigger the global editor event, unless specified not to
        if (global !== false) {
            Raptor.fire(name);
        }

        // Fire after sub-event
        if (!sub) {
            this.fire('after:' + name, global, true);
        }
    }
};

$.widget('ui.raptor', RaptorWidget);

                /* End of file: build/default/src/jquery.ui.editor.js */
            
                /* File: build/default/src/expose.js */
                
$.extend($.ui.raptor, Raptor, {

    // <expose>
    actionApply: actionApply,
    actionPreview: actionPreview,
    actionPreviewRestore: actionPreviewRestore,
    actionRedo: actionRedo,
    actionUndo: actionUndo,
    cleanEmptyAttributes: cleanEmptyAttributes,
    cleanReplaceElements: cleanReplaceElements,
    cleanUnwrapElements: cleanUnwrapElements,
    dockToElement: dockToElement,
    dockToScreen: dockToScreen,
    elementBringToTop: elementBringToTop,
    elementDefaultDisplay: elementDefaultDisplay,
    elementDetachedManip: elementDetachedManip,
    elementGetAttributes: elementGetAttributes,
    elementGetStyles: elementGetStyles,
    elementIsBlock: elementIsBlock,
    elementIsEmpty: elementIsEmpty,
    elementIsValid: elementIsValid,
    elementOuterHtml: elementOuterHtml,
    elementOuterText: elementOuterText,
    elementPositionUnder: elementPositionUnder,
    elementRemoveAttributes: elementRemoveAttributes,
    elementRemoveComments: elementRemoveComments,
    elementSwapStyles: elementSwapStyles,
    elementToggleStyle: elementToggleStyle,
    elementVisibleRect: elementVisibleRect,
    elementWrapInner: elementWrapInner,
    fragmentInsertBefore: fragmentInsertBefore,
    fragmentToHtml: fragmentToHtml,
    listToggle: listToggle,
    listUnwrapSelection: listUnwrapSelection,
    listWrapSelection: listWrapSelection,
    persistGet: persistGet,
    persistSet: persistSet,
    rangeDeserialize: rangeDeserialize,
    rangeEmptyTag: rangeEmptyTag,
    rangeExpandTo: rangeExpandTo,
    rangeExpandToParent: rangeExpandToParent,
    rangeGetCommonAncestor: rangeGetCommonAncestor,
    rangeIsContainedBy: rangeIsContainedBy,
    rangeIsEmpty: rangeIsEmpty,
    rangeReplace: rangeReplace,
    rangeSerialize: rangeSerialize,
    rangeTrim: rangeTrim,
    selectionAtEndOfElement: selectionAtEndOfElement,
    selectionAtStartOfElement: selectionAtStartOfElement,
    selectionClearFormatting: selectionClearFormatting,
    selectionConstrain: selectionConstrain,
    selectionDestroy: selectionDestroy,
    selectionEachRange: selectionEachRange,
    selectionExists: selectionExists,
    selectionGetElement: selectionGetElement,
    selectionGetElements: selectionGetElements,
    selectionGetEndElement: selectionGetEndElement,
    selectionGetHtml: selectionGetHtml,
    selectionGetStartElement: selectionGetStartElement,
    selectionIsEmpty: selectionIsEmpty,
    selectionReplace: selectionReplace,
    selectionReplaceSplittingSelectedElement: selectionReplaceSplittingSelectedElement,
    selectionReplaceWithinValidTags: selectionReplaceWithinValidTags,
    selectionRestore: selectionRestore,
    selectionSave: selectionSave,
    selectionSaved: selectionSaved,
    selectionSelectEdge: selectionSelectEdge,
    selectionSelectEnd: selectionSelectEnd,
    selectionSelectInner: selectionSelectInner,
    selectionSelectOuter: selectionSelectOuter,
    selectionSelectStart: selectionSelectStart,
    selectionSet: selectionSet,
    selectionToggleBlockStyle: selectionToggleBlockStyle,
    selectionToggleWrapper: selectionToggleWrapper,
    selectionWrapTagWithAttribute: selectionWrapTagWithAttribute,
    stateRestore: stateRestore,
    stateSave: stateSave,
    stringCamelCaseConvert: stringCamelCaseConvert,
    stringStripTags: stringStripTags,
    styleRestoreState: styleRestoreState,
    styleSwapState: styleSwapState,
    styleSwapWithWrapper: styleSwapWithWrapper,
    tableCanMergeCells: tableCanMergeCells,
    tableCanSplitCells: tableCanSplitCells,
    tableCellsInRange: tableCellsInRange,
    tableCreate: tableCreate,
    tableDeleteColumn: tableDeleteColumn,
    tableDeleteRow: tableDeleteRow,
    tableGetCellByIndex: tableGetCellByIndex,
    tableGetCellIndex: tableGetCellIndex,
    tableInsertColumn: tableInsertColumn,
    tableInsertRow: tableInsertRow,
    tableMergeCells: tableMergeCells,
    tableSplitCells: tableSplitCells,
    tagCustomApplyToSelection: tagCustomApplyToSelection,
    tagCustomRemoveFromSelection: tagCustomRemoveFromSelection,
    templateConvertTokens: templateConvertTokens,
    templateGet: templateGet,
    templateGetVariables: templateGetVariables,
    typeIsNumber: typeIsNumber,
    undockFromElement: undockFromElement,
    undockFromScreen: undockFromScreen    
    // </expose>

});

                /* End of file: build/default/src/expose.js */
            
                /* File: build/default/src/components/plugin.js */
                function RaptorPlugin(name, overrides) {
    this.name = name;
    for (var key in overrides) {
        this[key] = overrides[key];
    }
}

RaptorPlugin.prototype.init = function(raptor) {
    this.raptor = raptor;
};

RaptorPlugin.prototype.enable = function() {

};

                /* End of file: build/default/src/components/plugin.js */
            
                /* File: build/default/src/ui/components/button.js */
                function Button(overrides) {
    this.preview = true;
    this.text = false;
    this.label = null;
    this.icon = null;
    for (var key in overrides) {
        this[key] = overrides[key];
    }
};

Button.prototype.init = function(raptor) {
    this.raptor = raptor;
    return this.getButton();
};

Button.prototype.getButton = function() {
    if (!this.button) {
        this.button = $('<div>')
            .html(this.text)
            .addClass(this.options.baseClass)
            .attr('title', this.getTitle())
            .click(this.click.bind(this));
        aButton(this.button, {
            icons: {
                primary: this.getIcon()
            },
            text: this.text,
            label: this.label
        });
    }
    return this.button;
}

Button.prototype.getTitle = function() {
    return this.title || _(this.name + 'Title');
};

Button.prototype.getIcon = function() {
    if (this.icon === null) {
        return 'ui-icon-' + stringCamelCaseConvert(this.name)
    }
    return this.icon;
};

Button.prototype.click = function() {
    this.raptor.actionApply(this.action.bind(this));
};

                /* End of file: build/default/src/ui/components/button.js */
            
                /* File: build/default/src/ui/components/preview-button.js */
                function PreviewButton(options) {
    Button.call(this, options);
}

PreviewButton.prototype = Object.create(Button.prototype);

PreviewButton.prototype.getButton = function() {
    if (!this.button) {
        this.button = Button.prototype.getButton.call(this)
            .mouseenter(this.mouseEnter.bind(this))
            .mouseleave(this.mouseLeave.bind(this));
    }
    return this.button;
};

PreviewButton.prototype.mouseEnter = function() {
    if (this.canPreview()) {
        this.raptor.actionPreview(this.action.bind(this));
    }
};

PreviewButton.prototype.mouseLeave = function() {
    this.raptor.actionPreviewRestore();
};

PreviewButton.prototype.canPreview = function() {
    return this.preview;
};

                /* End of file: build/default/src/ui/components/preview-button.js */
            
                /* File: build/default/src/ui/components/filtered-preview-button.js */
                function FilteredPreviewButton(options) {
    Button.call(this, options);
}

FilteredPreviewButton.prototype = Object.create(PreviewButton.prototype);

FilteredPreviewButton.prototype.init = function(raptor) {
    var result = PreviewButton.prototype.init.call(this, raptor);
    this.raptor.bind('selectionChange', this.selectionChange.bind(this))
    return result;
};

FilteredPreviewButton.prototype.selectionChange = function() {
    if (this.isEnabled()) {
        aButtonEnable(this.button);
    } else {
        aButtonDisable(this.button);
    }
};

FilteredPreviewButton.prototype.canPreview = function() {
    return PreviewButton.prototype.canPreview.call(this) && this.isEnabled();
};

FilteredPreviewButton.prototype.isEnabled = function() {
    var result = false;
    selectionEachRange(function(range) {
        if (this.getElement(range)) {
            result = true;
        }
    }.bind(this));
    return result;
}

FilteredPreviewButton.prototype.action = function() {
    selectionEachRange(function(range) {
        var element = this.getElement(range);
        if (element) {
            this.applyToElement(element);
        }
    }.bind(this));
};

                /* End of file: build/default/src/ui/components/filtered-preview-button.js */
            
                /* File: build/default/src/ui/components/css-class-applier-button.js */
                function CSSClassApplierButton(options) {
    PreviewButton.call(this, options);
}

CSSClassApplierButton.prototype = Object.create(PreviewButton.prototype);

CSSClassApplierButton.prototype.action = function() {
    this.getApplier().toggleSelection();
};

CSSClassApplierButton.prototype.getApplier = function() {
    if (!this.applier) {
        this.applier = rangy.createCssClassApplier(this.getClass(), {
            elementTagName: this.getTag()
        });
    }
    return this.applier;
};

CSSClassApplierButton.prototype.getTag = function() {
    return this.tag || 'span';
};

CSSClassApplierButton.prototype.getClass = function() {
    return this.classes || this.cssPrefix + this.name
};

                /* End of file: build/default/src/ui/components/css-class-applier-button.js */
            
                /* File: build/default/src/ui/components/menu.js */
                function Menu(options) {
    this.raptor = null;
    this.menu = null;
    this.menuContent = '';
    this.button = null;
    for (var key in options) {
        this[key] = options[key];
    }
};

Menu.prototype.init = function(raptor) {
    this.setOptions();
    this.raptor = raptor;
    this.bind();
    return this.getButton().init(raptor);
};

Menu.prototype.bind = function() {
    // Bind events
};

Menu.prototype.getButton = function() {
    if (!this.button) {
        this.button = new Button({
            name: this.name,
            action: this.show.bind(this),
            preview: false,
            options: this.options
        });
    }
    return this.button;
};

Menu.prototype.setOptions = function() {
    this.options.title = _(this.name + 'Title');
    this.options.icon = 'ui-icon-' + this.name;
    this.options.text = _(this.name + 'Text');
};

Menu.prototype.getMenu = function() {
    if (!this.menu) {
        this.menu = $('<div>')
            .addClass('ui-menu ui-widget ui-widget-content ui-corner-all ' + this.options.baseClass + '-menu ' + this.raptor.options.baseClass + '-menu')
            .html(this.menuContent)
            .css('position', 'fixed')
            .hide()
            .appendTo('body')
            .mousedown(function(event) {
                // Prevent losing the selection on the editor target
                event.preventDefault();
            });
        // Click off close event
        $('html').click(function(event) {
            if (this.getButton().getButton().has(event.target).length === 0) {
                this.menu.hide();
            }
        }.bind(this));
    }
    return this.menu;
};

Menu.prototype.show = function() {
    elementPositionUnder(this.getMenu().toggle(), this.getButton().getButton());
};

                /* End of file: build/default/src/ui/components/menu.js */
            
                /* File: build/default/src/ui/components/select-menu.js */
                function SelectMenu(options) {
    Menu.call(this, options);
}

SelectMenu.prototype = Object.create(Menu.prototype);

SelectMenu.prototype.getMenu = function() {
    if (!this.menu) {
        this.menu = $('<ul>')
            .addClass(this.options.baseClass + '-menu ' + this.raptor.options.baseClass + '-menu')
            .html(this.getMenuItems())
            .css('position', 'fixed')
            .hide()
            .mousedown(function(event) {
                // Prevent losing the selection on the editor target
                event.preventDefault();
            })
            .on('click', 'a', function(event) {
                aButtonSetLabel(this.button.button, $(event.target).html())
            }.bind(this))
            .appendTo('body');
        aMenu(this.menu);
        // Click off close event
        $('html').click(function(event) {
            if (this.button.button.has(event.target).length === 0) {
                this.menu.hide();
            }
        }.bind(this));
    }
    return this.menu;
};

                /* End of file: build/default/src/ui/components/select-menu.js */
            
                /* File: build/default/src/ui/components/custom-menu.js */
                Menu.prototype.getMenu = function() {
    if (!this.menu) {
        this.menu = $('<div>')
            .addClass('ui-menu ui-widget ui-widget-content ui-corner-all ' + this.options.baseClass + '-menu ' + this.raptor.options.baseClass + '-menu')
            .html(this.menuContent)
            .css('position', 'fixed')
            .hide()
            .appendTo('body')
            .mousedown(function(event) {
                // Prevent losing the selection on the editor target
                event.preventDefault();
            });
        // Click off close event
        $('html').click(function(event) {
            if (this.button.button.has(event.target).length === 0) {
                this.menu.hide();
            }
        }.bind(this));
    }
    return this.menu;
};

                /* End of file: build/default/src/ui/components/custom-menu.js */
            
                /* File: build/default/src/ui/layout/toolbar.js */
                Raptor.registerLayout('toolbar', {
    options: {
        /**
         * Each element of the uiOrder should be an array of UI which will be grouped.
         */
        uiOrder: null
    },

    setDefaultUIOrder: function() {

    },

    init: function(raptor, options) {
        // Load all UI components if not supplied
        if (!options.uiOrder) {
            options.uiOrder = [[]];
            for (var name in Raptor.ui) {
                options.uiOrder[0].push(name);
            }
        }

        // <debug/>

        var toolbar = this.toolbar = $('<div/>')
            .addClass(this.options.baseClass + '-toolbar');
        var toolbarWrapper = this.toolbarWrapper = $('<div/>')
            .addClass(this.options.baseClass + '-toolbar-wrapper')
            .addClass('ui-widget-content')
            .mousedown(function(event) {
                event.preventDefault();
            })
            .append(toolbar);
        var path = this.path = $('<div/>')
            .addClass(this.options.baseClass + '-path')
            .addClass('ui-widget-header');
        var wrapper = this.wrapper = $('<div/>')
            .addClass(this.options.baseClass + '-wrapper')
            .css('display', 'none')
            .append(path)
            .append(toolbarWrapper);

        if ($.fn.draggable && this.options.draggable) {
            // <debug/>

            wrapper.draggable({
                cancel: 'a, button',
                cursor: 'move',
                // @todo Cancel drag when docked
                // @todo Move draggable into plugin
                // @todo Move tag menu/list into plugin
                handle: '.ui-editor-path',
                stop: $.proxy(function() {
                    // Save the persistant position
                    var pos = raptor.persist('position', [
                        wrapper.css('top'),
                        wrapper.css('left')
                    ]);
                    wrapper.css({
                        top: Math.abs(pos[0]),
                        left: Math.abs(pos[1])
                    });

                    // <debug/>
                }, this)
            });

            // Remove the relative position
            wrapper.css('position', '');

            // Set the persistant position
            var pos = raptor.persist('position') || this.options.dialogPosition;

            if (!pos) {
                pos = [10, 10];
            }

            // <debug/>

            if (parseInt(pos[0], 10) + wrapper.outerHeight() > $(window).height()) {
                pos[0] = $(window).height() - wrapper.outerHeight();
            }
            if (parseInt(pos[1], 10) + wrapper.outerWidth() > $(window).width()) {
                pos[1] = $(window).width() - wrapper.outerWidth();
            }

            wrapper.css({
                top: Math.abs(parseInt(pos[0])),
                left: Math.abs(parseInt(pos[1]))
            });

            // Load the message display widget
            raptor.loadMessages();
        }

        $(function() {
            wrapper.appendTo('body');
        });

        // Loop the UI component order option
        for (var i = 0, l = this.options.uiOrder.length; i < l; i++) {
            var uiGroupContainer = $('<div/>')
                .addClass(raptor.options.baseClass + '-layout-toolbar-group');

            // Loop each UI in the group
            var uiGroup = this.options.uiOrder[i];
            for (var ii = 0, ll = uiGroup.length; ii < ll; ii++) {
                // Check if the UI component has been explicitly disabled
                if (!raptor.isUiEnabled(uiGroup[ii])) {
                    continue;
                }

                // Check the UI has been registered
                if (Raptor.ui[uiGroup[ii]]) {
                    // Clone the UI object (which should be extended from the defaultUi object)
                    var uiObject = $.extend({}, Raptor.ui[uiGroup[ii]]);

                    // Get the UI components base class
                    var baseClass = uiGroup[ii].replace(/([A-Z])/g, function(match) {
                        return '-' + match.toLowerCase();
                    });

                    var options = $.extend(true, {}, raptor.options, {
                        baseClass: raptor.options.baseClass + '-ui-' + baseClass
                    }, uiObject.options, raptor.options.ui[uiGroup[ii]]);

                    uiObject.editor = raptor;
                    uiObject.options = options;
                    var ui = uiObject.init(raptor, options);

                    // Append the UI object to the group
                    uiGroupContainer.append(ui);

                    // Add the UI object to the editors list
                    raptor.uiObjects[uiGroup[ii]] = uiObject;
                }
                // <strict/>
            }

            // Append the UI group to the editor toolbar
            if (uiGroupContainer.children().length > 0) {
                uiGroupContainer.appendTo(this.toolbar);
            }
        }
        $('<div/>').css('clear', 'both').appendTo(this.toolbar);
    },

    show: function() {
        this.wrapper.css('display', '');
    },

    hide: function() {
        this.wrapper.css('display', 'none');
    },

    getElement: function() {
        return this.wrapper;
    },

    destruct: function() {
        if (this.wrapper) {
            this.wrapper.remove();
        }
    }
});

                /* End of file: build/default/src/ui/layout/toolbar.js */
            
                /* File: build/default/src/presets/default.js */
                Raptor.registerPreset('toolbar', {
    layout: {
        type: 'toolbar',
        options: {
            uiOrder: [
                ['logo'],
                ['save', 'cancel'],
                ['dockToScreen', 'guides'],
                ['viewSource'],
                ['historyUndo', 'historyRedo'],
                ['alignLeft', 'alignCenter', 'alignJustify', 'alignRight'],
                ['textBold', 'textItalic', 'textUnderline', 'textStrike'],
                ['textSuper', 'textSub'],
                ['listUnordered', 'listOrdered'],
                ['hrCreate', 'textBlockQuote'],
                ['textSizeIncrease', 'textSizeDecrease'],
                ['colorPickerBasic'],
                ['clearFormatting'],
                ['linkCreate', 'linkRemove'],
                ['embed'],
                ['floatLeft', 'floatNone', 'floatRight'],
                ['tagMenu'],
                ['statistics']
            ]
        }
    }
});

Raptor.registerPreset('tristan', {
    layout: {
        type: 'toolbar',
        options: {
            uiOrder: [
                ['save', 'cancel'],
                ['dockToScreen', 'guides'],
                ['viewSource'],
                ['historyUndo', 'historyRedo'],
                ['alignLeft', 'alignCenter', 'alignJustify', 'alignRight'],
                ['textBold', 'textItalic', 'textUnderline', 'textStrike'],
                ['textSuper', 'textSub'],
                ['listUnordered', 'listOrdered'],
                ['hrCreate', 'textBlockQuote'],
                ['textSizeIncrease', 'textSizeDecrease'],
                ['clearFormatting'],
                ['linkCreate', 'linkRemove'],
                ['embed'],
                ['floatLeft', 'floatNone', 'floatRight'],
                ['tagMenu'],
                ['tableCreate', 'tableInsertRow', 'tableDeleteRow', 'tableInsertColumn', 'tableDeleteColumn', 'tableMergeCells', 'tableSplitCells'],
            ]
        }
    }
});

//$.extend(Raptor.defaults, Raptor.presets.toolbar);
$.extend(Raptor.defaults, Raptor.presets.tristan);

                /* End of file: build/default/src/presets/default.js */
            
                /* File: build/default/src/plugins/cancel/cancel.js */
                var cancelDialog = null;

Raptor.registerUi(new Button({
    name: 'cancel',
    action: function() {
        aDialogOpen(this.getDialog());
    },
    getDialog: function() {
        if (!cancelDialog) {
            cancelDialog = $('<div>').html(_('cancelDialogContent'));
            aDialog(cancelDialog, {
                modal: true,
                resizable: false,
                autoOpen: false,
                title: _('cancelDialogTitle'),
                dialogClass: this.options.dialogClass,
                buttons: [
                    {
                        text: _('cancelDialogOKButton'),
                        click: function() {
                            this.raptor.cancelEditing();
                            aDialogClose(cancelDialog);
                        }.bind(this),
                        icons: {
                            primary: 'ui-icon-circle-check'
                        }
                    },
                    {
                        text: _('cancelDialogCancelButton'),
                        click: function() {
                            aDialogClose(cancelDialog);
                        },
                        icons: {
                            primary: 'ui-icon-circle-close'
                        }
                    }
                ]
            });
        }
        return cancelDialog;
    }
}));

                /* End of file: build/default/src/plugins/cancel/cancel.js */
            
                /* File: build/default/src/plugins/clear-formatting/clear-formatting.js */
                Raptor.registerUi(new PreviewButton({
    name: 'clearFormatting',
    action: function() {
        selectionClearFormatting(this.raptor.getElement());
    }
}));

                /* End of file: build/default/src/plugins/clear-formatting/clear-formatting.js */
            
                /* File: build/default/src/plugins/click-button-to-edit/click-button-to-edit.js */
                var clickButtonToEditButton = null,
    clickButtonToEditInstance = null,
    clickButtonToEditHover = false;

function ClickButtonToEditPlugin(name, overrides) {
    RaptorPlugin.call(this, name || 'clickButtonToEdit', overrides);
}

ClickButtonToEditPlugin.prototype = Object.create(RaptorPlugin.prototype);

ClickButtonToEditPlugin.prototype.init = function(raptor) {
    this.raptor = raptor;
    this.raptor.getElement()
        .mouseenter(this.show.bind(this))
        .mouseleave(this.hide.bind(this));
};

ClickButtonToEditPlugin.prototype.show = function() {
    if (this.raptor.isEditing()) {
        return;
    }
    this.raptor.getElement()
        .addClass(this.options.baseClass + '-hover');

    var button = this.getButton(this),
        visibleRect = elementVisibleRect(this.raptor.getElement());
    button.show().css({
        position: 'absolute',
        // Calculate offset center for the button
        top:  visibleRect.top  + ((visibleRect.height / 2) - (button.outerHeight() / 2)),
        left: visibleRect.left + ((visibleRect.width / 2)  - (button.outerWidth()  / 2))
    });
};

ClickButtonToEditPlugin.prototype.hide = function(event) {
    var button = this.getButton(this);
    if (!button.is(':hover')) {
        button.hide();
    }
};

ClickButtonToEditPlugin.prototype.edit = function() {
    this.raptor.enableEditing();
    this.raptor.showLayout();
    this.getButton(this).hide();
};

/**
 * Selects or creates the button and returns it.
 *
 * @return {jQuery} The "click to edit" button.
 */
ClickButtonToEditPlugin.prototype.getButton = function(instance) {
    clickButtonToEditInstance = instance;
    if (!clickButtonToEditButton) {
        clickButtonToEditButton = $(this.editor.getTemplate('click-button-to-edit.button', this.options))
            .click(function() {
                clickButtonToEditInstance.edit();
            })
            .appendTo('body');
        aButton(clickButtonToEditButton, {
            icons: {
                primary: 'ui-icon-pencil'
            }
        });
    }
    return clickButtonToEditButton;

};

Raptor.registerPlugin(new ClickButtonToEditPlugin());

                /* End of file: build/default/src/plugins/click-button-to-edit/click-button-to-edit.js */
            
                /* File: build/default/src/plugins/color-picker-basic/color-picker-basic.js */
                function ColorPickerBasicMenu(options) {
    this.preview = true;
    this.colors = [
        'white',
        'black',
        'grey',
        'blue',
        'red',
        'green',
        'purple',
        'orange'
    ]
    SelectMenu.call(this, {
        name: 'colorPickerBasic'
    });
}

ColorPickerBasicMenu.prototype = Object.create(SelectMenu.prototype);

ColorPickerBasicMenu.prototype.init = function(raptor) {
    raptor.bind('selectionChange', this.updateButton.bind(this));
    return SelectMenu.prototype.init.apply(this, arguments);
};

ColorPickerBasicMenu.prototype.updateButton = function() {
    var tag = selectionGetElements()[0],
        button = this.getButton().getButton(),
        color = null,
        closest = null;
    // TODO: set automatic icon color to the color of the text
    aButtonSetLabel(button, _('colorPickerBasicAutomatic'));
    aButtonSetIcon(button, false);
    if (!tag) {
        return;
    }
    tag = $(tag);
    for (var i = 0, l = this.colors.length; i < l; i++) {
        closest = $(tag).closest('.' + this.options.cssPrefix + this.colors[i]);
        if (closest.length) {
            color = this.colors[i];
            break;
        }
    }
    if (color) {
        aButtonSetLabel(button, _('colorPickerBasic' + (color.charAt(0).toUpperCase() + color.slice(1))));
        aButtonSetIcon(button, 'ui-icon-swatch');
        // FIXME: set color in an adapter friendly way
        button.find('.ui-icon').css('background-color', closest.css('color'));
        return;
    }
};

ColorPickerBasicMenu.prototype.changeColor = function(color) {
    this.raptor.actionApply(function() {
        if (color === 'automatic') {
            selectionGetElements().parents('.' + this.options.cssPrefix + 'color').andSelf().each(function() {
                var element = $(this),
                    classes = element.attr('class').match(/(cms-(.*?))( |$)/ig);
                for (var i = 0, l = classes.length; i < l; i++) {
                    element.removeClass($.trim(classes[i]));
                };
            });
        } else {
            selectionToggleWrapper('span', {
                classes: this.options.classes || this.options.cssPrefix + 'color ' + this.options.cssPrefix + color
            });
        }
//        var applier = rangy.createCssClassApplier('cms-' + color, {
//            elementTagName: 'span'
//        });
//        applier.toggleSelection(this.raptor.getSelection());
    }.bind(this));
};

ColorPickerBasicMenu.prototype.preview = function(event) {
    if (this.preview) {
        this.raptor.actionPreview(function() {
            this.changeColor($(event.currentTarget).data('color'));
        }.bind(this));
    }
};

ColorPickerBasicMenu.prototype.previewRestore = function() {
    if (this.preview) {
        this.raptor.actionPreviewRestore();
    }
};

ColorPickerBasicMenu.prototype.apply = function() {
    this.raptor.actionApply(function() {
        this.changeColor($(event.currentTarget).data('color'));
    }.bind(this));
};

ColorPickerBasicMenu.prototype.getButton = function() {
    if (!this.button) {
        this.button = new Button({
            name: this.name,
            action: this.show.bind(this),
            preview: false,
            options: this.options,
            text: true,
            icon: false,
            label: _('colorPickerBasicAutomatic')
        });
    }
    return this.button;
};

ColorPickerBasicMenu.prototype.getMenuItems = function() {
    return $(this.editor.getTemplate('color-picker-basic.menu', this.options))
        .click(this.apply.bind(this))
        .mouseenter(this.preview.bind(this))
        .mouseleave(this.previewRestore.bind(this));
};

Raptor.registerUi(new ColorPickerBasicMenu());

                /* End of file: build/default/src/plugins/color-picker-basic/color-picker-basic.js */
            
                /* File: build/default/src/plugins/dock/dock-to-element.js */
                Raptor.registerUi(new Button({
    name: 'dockToElement',
    dockState: null,
    marker: null,
    options: {
        position: 'top',
        spacer: true
    },
    action: function() {
        var element;
        if (this.dockState) {
            element = undockFromElement(this.dockState);
            this.marker.replaceWith(element);
            this.dockState = null;
        } else {
            element = this.raptor.getElement();
            this.marker = $('<marker>').addClass(this.options.baseClass + '-marker').insertAfter(element);
            this.dockState = dockToElement(this.raptor.getLayout().getElement(), element, {
                position: this.options.position,
                spacer: this.options.spacer
            });
        }
    }
}));

                /* End of file: build/default/src/plugins/dock/dock-to-element.js */
            
                /* File: build/default/src/plugins/dock/dock-to-screen.js */
                Raptor.registerUi(new Button({
    name: 'dockToScreen',
    dockState: null,
    marker: null,
    options: {
        position: 'top',
        spacer: true
    },
    action: function() {
        var layout;
        if (this.dockState) {
            layout = undockFromScreen(this.dockState);
            this.marker.replaceWith(layout);
            this.dockState = null;
        } else {
            layout = this.raptor.getLayout().getElement();
            this.marker = $('<marker>').addClass(this.options.baseClass + '-marker').insertAfter(layout);
            this.dockState = dockToScreen(layout, {
                position: this.options.position,
                spacer: this.options.spacer
            });
        }
    }
}));

                /* End of file: build/default/src/plugins/dock/dock-to-screen.js */
            
                /* File: build/default/src/plugins/embed/embed.js */
                var embedDialog = null,
    embedInstance = null;

Raptor.registerUi(new Button({
    name: 'embed',
    state: null,

    action: function() {
        this.state = this.raptor.stateSave();
        aDialogOpen(this.getDialog(this));
    },

    embedObject: function(object) {
        this.raptor.stateRestore(this.state);
        this.raptor.actionApply(function() {
            selectionReplace(object);
        });
    },

    getDialog: function(instance) {
        embedInstance = instance;
        if (!embedDialog) {
            embedDialog = $('<div>').html(this.editor.getTemplate('embed.dialog', this.options));
            aDialog(embedDialog, {
                modal: true,
                width: 600,
                height: 400,
                resizable: true,
                autoOpen: false,
                title: _('embedDialogTitle'),
                dialogClass: this.options.baseClass + '-dialog',
                buttons: [
                    {
                        text: _('embedDialogOKButton'),
                        click: function() {
                            embedInstance.embedObject(embedDialog.find('textarea').val());
                            embedDialog.dialog('close');
                        },
                        icons: {
                            primary: 'ui-icon-circle-check'
                        }
                    },
                    {
                        text: _('embedDialogCancelButton'),
                        click: function() {
                            ui.hide();
                        },
                        icons: {
                            primary: 'ui-icon-circle-close'
                        }
                    }
                ]
            });

            embedDialog.find('textarea').change(function(event) {
                embedDialog.find('.' + this.options.baseClass + '-preview').html($(event.target).val());
            }.bind(this));

            // Create fake jQuery UI tabs (to prevent hash changes)
            var tabs = embedDialog.find('.' + this.options.baseClass + '-panel-tabs');
            tabs.find('li')
                .click(function() {
                    tabs.find('ul li').removeClass('ui-state-active').removeClass('ui-tabs-selected');
                    $(this).addClass('ui-state-active').addClass('ui-tabs-selected');
                    tabs.children('div').hide().eq($(this).index()).show();
                });
        }
        return embedDialog;
    }
}));

                /* End of file: build/default/src/plugins/embed/embed.js */
            
                /* File: build/default/src/plugins/float/float-left.js */
                Raptor.registerUi(new FilteredPreviewButton({
    name: 'floatLeft',
    applyToElement: function(element) {
        element.css('float', 'left');
    },
    getElement: function(range) {
        var images = $(range.commonAncestorContainer).find('img');
        return images.length ? images : null;
    }
}));

                /* End of file: build/default/src/plugins/float/float-left.js */
            
                /* File: build/default/src/plugins/float/float-none.js */
                Raptor.registerUi(new FilteredPreviewButton({
    name: 'floatNone',
    applyToElement: function(element) {
        element.css('float', 'none');
    },
    getElement: function(range) {
        var images = $(range.commonAncestorContainer).find('img');
        return images.length ? images : null;
    }
}));

                /* End of file: build/default/src/plugins/float/float-none.js */
            
                /* File: build/default/src/plugins/float/float-right.js */
                Raptor.registerUi(new FilteredPreviewButton({
    name: 'floatRight',
    applyToElement: function(element) {
        element.css('float', 'right');
    },
    getElement: function(range) {
        var images = $(range.commonAncestorContainer).find('img');
        return images.length ? images : null;
    }
}));

                /* End of file: build/default/src/plugins/float/float-right.js */
            
                /* File: build/default/src/plugins/guides/guides.js */
                Raptor.registerUi(new PreviewButton({
    name: 'guides',
    action: function() {
        this.raptor.getElement().toggleClass(this.options.baseClass + '-visible');
    }
}));

                /* End of file: build/default/src/plugins/guides/guides.js */
            
                /* File: build/default/src/plugins/history/history-redo.js */
                Raptor.registerUi(new PreviewButton({
    name: 'historyRedo',
    action: function() {
    }
}));

                /* End of file: build/default/src/plugins/history/history-redo.js */
            
                /* File: build/default/src/plugins/history/history-undo.js */
                Raptor.registerUi(new PreviewButton({
    name: 'historyUndo',
    action: function() {
    }
}));

                /* End of file: build/default/src/plugins/history/history-undo.js */
            
                /* File: build/default/src/plugins/hr/hr-create.js */
                Raptor.registerUi(new PreviewButton({
    name: 'hrCreate',
    action: function() {
        selectionReplace('<hr/>');
    }
}));

                /* End of file: build/default/src/plugins/hr/hr-create.js */
            
                /* File: build/default/src/plugins/link/link-type-email.js */
                
function LinkTypeEmail(raptor) {
    this.raptor = raptor;
    this.label = _('linkTypeEmailLabel');
}

LinkTypeEmail.prototype.getContent = function() {
    return this.raptor.getTemplate('link.email', this.options);
};

LinkTypeEmail.prototype.getAttributes = function(panel) {
    var address = panel.find('[name=email]').val(),
        subject = panel.find('[name=subject]').val();
    if ($.trim(subject)) {
        subject = '?Subject=' + subject;
    }
    return {
        href: 'mailto:' + address + subject
    };
};

                /* End of file: build/default/src/plugins/link/link-type-email.js */
            
                /* File: build/default/src/plugins/link/link-type-external.js */
                
function LinkTypeExternal(raptor) {
    this.raptor = raptor;
    this.label = _('linkTypeExternalLabel');
};

LinkTypeExternal.prototype.getContent = function() {
    return this.raptor.getTemplate('link.external', this.options);
};

LinkTypeExternal.prototype.getAttributes = function(panel) {
    var address = panel.find('[name=location]').val(),
        target = panel.find('[name=blank]').is(':checked'),
        result = {
            href: address
        };

    if (target) {
        result.target = '_blank';
    }

    return result;
};

                /* End of file: build/default/src/plugins/link/link-type-external.js */
            
                /* File: build/default/src/plugins/link/link-type-internal.js */
                
function LinkTypeInternal(raptor) {
    this.raptor = raptor;
    this.label = _('linkTypeInternalLabel');
};

LinkTypeInternal.prototype.getContent = function() {
    return this.raptor.getTemplate('link.internal', {
        baseClass: this.raptor.options.baseClass,
        domain: window.location.protocol + '//' + window.location.host + '/'
    });
};

LinkTypeInternal.prototype.getAttributes = function(panel) {
    var address = panel.find('[name=location]').val(),
        target = panel.find('[name=blank]').is(':checked'),
        result = {
            href: address
        };

    if (target) {
        result.target = '_blank';
    }

    return result;
};

                /* End of file: build/default/src/plugins/link/link-type-internal.js */
            
                /* File: build/default/src/plugins/link/link-create.js */
                var linkDialog = null
    linkDialogInstance = null;

Raptor.registerUi(new Button({
    name: 'linkCreate',
    state: null,

    action: function() {
        this.state = this.raptor.stateSave();
        aDialogOpen(this.getDialog(this));
    },

    applyLink: function(attributes) {
        this.raptor.stateRestore(this.state);
        this.raptor.actionApply(function() {
            var applier = rangy.createApplier({
                tag: 'a',
                attributes: attributes
            });
            applier.applyToSelection();
        });
    },

    getDialog: function(instance) {
        linkDialogInstance = instance;
        if (!linkDialog) {
            linkDialog = $(this.raptor.getTemplate('link.dialog', this.options));

            var menu = linkDialog.find('[data-menu]'),
                content = linkDialog.find('[data-content]'),
                linkTypes = [
                    new LinkTypeInternal(this.raptor),
                    new LinkTypeExternal(this.raptor),
                    new LinkTypeEmail(this.raptor)
                ];

            for (var i = 0, l = linkTypes.length; i < l; i++) {
                $(this.editor.getTemplate('link.label', linkTypes[i]))
                    .click(function() {
                        content.children('div').hide();
                        content.children('div:eq(' + $(this).index() + ')').show();
                    })
                    .find(':radio')
                        .val(i)
                    .end()
                    .appendTo(menu);
                $('<div>')
                    .append(linkTypes[i].getContent())
                    .hide()
                    .appendTo(content);
            }
            menu.find(':radio:first').prop('checked', true);
            content.children('div:first').show();

            aDialog(linkDialog, {
                modal: true,
                resizable: true,
                autoOpen: false,
                title: _('linkDialogTitle'),
                dialogClass: this.options.dialogClass,
                width: 850,
                buttons: [
                    {
                        text: _('linkDialogOKButton'),
                        click: function() {
                            var index = menu.find(':radio:checked').val(),
                                linkType = linkTypes[index],
                                attributes = linkType.getAttributes(content.children('div:eq(' + index + ')'));
                            if (attributes !== false) {
                                aDialogClose(linkDialog);
                                linkDialogInstance.applyLink(attributes);
                            }
                        }.bind(this),
                        icons: {
                            primary: 'ui-icon-circle-check'
                        }
                    },
                    {
                        text: _('linkDialogCancelButton'),
                        click: function() {
                            aDialogClose(linkDialog);
                        },
                        icons: {
                            primary: 'ui-icon-circle-close'
                        }
                    }
                ]
            });
        }
        return linkDialog;
    }
}));

                /* End of file: build/default/src/plugins/link/link-create.js */
            
                /* File: build/default/src/plugins/link/link-remove.js */
                Raptor.registerUi(new Button({
    name: 'linkRemove',

    action: function() {
        this.raptor.actionApply(function() {
            var applier = rangy.createApplier({
                tag: 'a'
            });
            applier.undoToSelection();
        });
    }
}));

                /* End of file: build/default/src/plugins/link/link-remove.js */
            
                /* File: build/default/src/plugins/list/list-ordered.js */
                Raptor.registerUi(new PreviewButton({
    name: 'listOrdered',
    action: function() {
        listToggle('ol', this.raptor.getElement());
    }
}));

                /* End of file: build/default/src/plugins/list/list-ordered.js */
            
                /* File: build/default/src/plugins/list/list-unordered.js */
                Raptor.registerUi(new PreviewButton({
    name: 'listUnordered',
    action: function() {
        listToggle('ul', this.raptor.getElement());
    }
}));

                /* End of file: build/default/src/plugins/list/list-unordered.js */
            
                /* File: build/default/src/plugins/logo/logo.js */
                Raptor.registerUi(new Button({
    name: 'logo',
    init: function() {
        var button = Button.prototype.init.apply(this, arguments);

        var data = {
            enableUi: this.raptor.options.enableUi,
            enablePlugins: this.raptor.options.enablePlugins,
            disabledPlugins: this.raptor.options.disabledPlugins,
            ui: this.options.ui,
            layout: this.options.layout,
            t: new Date().getTime()
        };

        button.find('.ui-button-icon-primary').css({
            'background-image': 'url(http://www.jquery-raptor.com/logo/0.5.0?json=' + encodeURIComponent(JSON.stringify(data)) + ')'
        });
        
        return button;
    },
    action: function() {
        window.open('http://www.jquery-raptor.com/about/editors/', '_blank');
    }
}));

                /* End of file: build/default/src/plugins/logo/logo.js */
            
                /* File: build/default/src/plugins/save/save.js */
                Raptor.registerUi(new Button({
    name: 'save',

    action: function() {
        this.getPlugin().save();
    },

    init: function() {
        var result = Button.prototype.init.apply(this, arguments);

        // <strict/>
        
        this.raptor.bind('dirty', this.dirty.bind(this))
        this.raptor.bind('cleaned', this.clean.bind(this))
        this.clean();
        return result;
    },

    getPlugin: function() {
        return this.raptor.getPlugin(this.options.plugin);
    },

    dirty: function() {
        aButtonEnable(this.button);
    },

    clean: function() {
        aButtonDisable(this.button);
    }
}));

                /* End of file: build/default/src/plugins/save/save.js */
            
                /* File: build/default/src/plugins/save/save-rest.js */
                function SaveRestPlugin(name, overrides) {
    this.method = 'put';
    RaptorPlugin.call(this, name || 'saveRest', overrides);
}

SaveRestPlugin.prototype = Object.create(RaptorPlugin.prototype);

SaveRestPlugin.prototype.init = function(raptor) {
    this.raptor = raptor;
    // <strict/>
};

SaveRestPlugin.prototype.save = function() {
    this.requests = 0;
    this.errors = [];
    this.messages = [];
    this.raptor.unify(function(raptor) {
        if (raptor.isDirty()) {
            this.requests++;
            var xhr = raptor.getPlugin('saveRest').sendRequest();
            xhr.raptor = raptor;
            xhr
                .done(this.done.bind(this))
                .fail(this.fail.bind(this))
                .always(this.always.bind(this));
        }
    }.bind(this));
};

SaveRestPlugin.prototype.done = function(data, status, xhr) {
    xhr.raptor.saved();
    this.messages.push(data);
};

SaveRestPlugin.prototype.fail = function(xhr) {
    this.errors.push(xhr.responseText);
};

SaveRestPlugin.prototype.always = function() {
    this.requests--;
    if (this.requests === 0) {
        if (this.errors.length > 0 && this.messages.length === 0) {
            this.raptor.showError(_('saveRestFail', {
                failed: this.errors.length
            }));
        } else if (this.errors.length > 0) {
            this.raptor.showError(_('saveRestPartial', {
                saved: this.messages.length,
                failed: this.errors.length
            }));
        } else {
            this.raptor.showConfirm(_('saveRestSaved', {
                saved: this.messages.length
            }), {
                delay: 1000,
                hide: function() {
                    this.editor.unify(function(editor) {
                        editor.disableEditing();
                        editor.hideLayout();
                    });
                }
            });
        }
    }
};

SaveRestPlugin.prototype.sendRequest = function() {
    var headers = this.raptor.getPlugin('saveRest').getHeaders(),
        data = this.raptor.getPlugin('saveRest').getData(),
        url = this.raptor.getPlugin('saveRest').getURL();
    return $.ajax({
        type: this.options.type || 'post',
        dataType: this.options.type || 'json',
        headers: headers,
        data: data,
        url: url
    });
};

SaveRestPlugin.prototype.getHeaders = function() {
    if (this.options.headers) {
        return this.options.headers.call(this);
    }
    return {};
};

SaveRestPlugin.prototype.getData = function() {
    // Get the data to send to the server
    var content = this.raptor.getHtml();
    return this.options.data.call(this, content);
};

SaveRestPlugin.prototype.getURL = function() {
    if (typeof this.options.url === 'string') {
        return this.options.url;
    }
    return this.options.url.call(this);
};

Raptor.registerPlugin(new SaveRestPlugin());

                /* End of file: build/default/src/plugins/save/save-rest.js */
            
                /* File: build/default/src/plugins/statistics/statistics.js */
                var statisticsDialog = null;

Raptor.registerUi(new Button({
    name: 'statistics',
    maximum: 100,
    showCountInButton: true,

    init: function(raptor) {
        if (this.showCountInButton) {
            raptor.bind('change', this.updateButton.bind(this));
        }
        return Button.prototype.init.apply(this, arguments);
    },

    action: function() {
        this.processDialog();
        aDialogOpen(this.getDialog());
    },

    getCharacters: function() {
        return $('<div>').html(this.raptor.getHtml()).text().length;
    },

    updateButton: function() {
        var charactersRemaining = null,
            label = null,
            characters = this.getCharacters();

        // Cases where maximum has been provided
        if (this.maximum) {
            charactersRemaining = this.maximum - characters;
            if (charactersRemaining >= 0) {
                label = _('statisticsButtonCharacterRemaining', {
                    charactersRemaining: charactersRemaining
                });
            } else {
                label = _('statisticsButtonCharacterOverLimit', {
                    charactersRemaining: charactersRemaining * -1
                });
            }
        } else {
            label = _('statisticsButtonCharacters', {
                characters: characters
            });
        }

        aButtonSetLabel(this.button, label);

        if (!this.maximum) {
            return;
        }

        // Add the error state to the button's text element if appropriate
        if (charactersRemaining < 0) {
            this.button.addClass('ui-state-error').removeClass('ui-state-default');
        } else{
            // Add the highlight class if the remaining characters are in the "sweet zone"
            if (charactersRemaining >= 0 && charactersRemaining <= 15) {
                this.button.addClass('ui-state-highlight').removeClass('ui-state-error ui-state-default');
            } else {
                this.button.removeClass('ui-state-highlight ui-state-error').addClass('ui-state-default');
            }
        }
    },

    getButton: function() {
        if (!this.button) {
            Button.prototype.getButton.call(this);
            aButton(this.button, {
                text: true
            });
            if (this.showCountInButton) {
                this.updateButton();
            }
        }
        return this.button;
    },

    getDialog: function() {
        if (!statisticsDialog) {
            statisticsDialog = $(this.raptor.getTemplate('statistics.dialog'))
            aDialog(statisticsDialog, {
                modal: true,
                resizable: false,
                autoOpen: false,
                width: 350,
                title: _('statisticsDialogTitle'),
                dialogClass: this.options.dialogClass,
                buttons: [
                    {
                        text: _('statisticsDialogOKButton'),
                        click: function() {
                            aDialogClose(statisticsDialog);
                        }.bind(this),
                        icons: {
                            primary: 'ui-icon-circle-check'
                        }
                    }
                ]
            });
        }
        return statisticsDialog;
    },

    /**
     * Process and return the statistics dialog template.
     * @return {jQuery} The processed statistics dialog template
     */
    processDialog: function() {
        var dialog = this.getDialog();
        var content = $('<div/>').html(this.editor.getHtml()).text();

        // If maximum has not been set, use infinity
        var charactersRemaining = this.options.maximum ? this.options.maximum - content.length : '&infin;';
        if (typeIsNumber(charactersRemaining)) {
            dialog.find('[data-name=truncation]').html(_('statisticsDialogNotTruncated', {
                'limit': this.options.maximum
            }));
        } else {
            dialog.find('[data-name=truncation]').html(_('statisticsDialogNotTruncated'));
        }

        var totalWords = content.split(' ').length;
        if (totalWords === 1) {
            dialog.find('[data-name=words]').html(_('statisticsDialogWord', {
                words: totalWords
            }));
        } else {
            dialog.find('[data-name=words]').html(_('statisticsDialogWords', {
                words: totalWords
            }));
        }

        var totalSentences = content.split('. ').length;
        if (totalSentences === 1) {
            dialog.find('[data-name=sentences]').html(_('statisticsDialogSentence', {
                sentences: totalSentences
            }));
        } else {
            dialog.find('[data-name=sentences]').html(_('statisticsDialogSentences', {
                sentences: totalSentences
            }));
        }

        var characters = null;
        if (charactersRemaining >= 0 || !typeIsNumber(charactersRemaining)) {
            dialog.find('[data-name=characters]').html(_('statisticsDialogCharactersRemaining', {
                characters: content.length,
                charactersRemaining: charactersRemaining
            }));
        } else {
            dialog.find('[data-name=characters]').html(_('statisticsDialogCharactersOverLimit', {
                characters: content.length,
                charactersRemaining: charactersRemaining * -1
            }));
        }
    }
}));

                /* End of file: build/default/src/plugins/statistics/statistics.js */
            
                /* File: build/default/src/plugins/table/table-cell-button.js */
                function TableCellButton(options) {
    FilteredPreviewButton.call(this, options);
}

TableCellButton.prototype = Object.create(FilteredPreviewButton.prototype);

TableCellButton.prototype.getElement = function(range) {
    var cell = range.commonAncestorContainer.parentNode;
    if (cell.tagName === 'TD' ||
            cell.tagName === 'TH') {
        return cell;
    }
    return null;
};

                /* End of file: build/default/src/plugins/table/table-cell-button.js */
            
                /* File: build/default/src/plugins/table/table-create.js */
                function TableMenu(options) {
    Menu.call(this, {
        name: 'tableCreate'
    });
}

TableMenu.prototype = Object.create(Menu.prototype);

TableMenu.prototype.createTable = function(event) {
    this.raptor.actionApply(function() {
        selectionReplace(tableCreate(event.target.cellIndex + 1, event.target.parentNode.rowIndex + 1, {
            placeHolder: '&nbsp;'
        }));
    });
};

TableMenu.prototype.highlight = function(event) {
    var cells = tableCellsInRange(this.menuTable.get(0), {
            x: 0,
            y: 0
        }, {
            x: event.target.cellIndex,
            y: event.target.parentNode.rowIndex
        });
        
    // highlight cells in menu
    this.highlightRemove(event);
    $(cells).addClass(this.options.baseClass + '-menu-hover');
    
    // Preview create 
    this.raptor.actionPreview(function() {
        selectionReplace(tableCreate(event.target.cellIndex + 1, event.target.parentNode.rowIndex + 1, {
            placeHolder: '&nbsp;'
        }));
    });
};

TableMenu.prototype.highlightRemove = function(event) {
    this.menuTable
        .find('.' + this.options.baseClass + '-menu-hover')
        .removeClass(this.options.baseClass + '-menu-hover');
    this.raptor.actionPreviewRestore();
};

TableMenu.prototype.getMenu = function() {
    if (!this.menu) {
        this.menuContent = this.editor.getTemplate('table.create-menu', this.options);
        Menu.prototype.getMenu.call(this)
            .on('click', 'td', this.createTable.bind(this))
            .on('mouseenter', 'td', this.highlight.bind(this))
            .mouseleave(this.highlightRemove.bind(this));
        this.menuTable = this.menu.find('table:eq(0)');
    }
    return this.menu;
}

Raptor.registerUi(new TableMenu());

                /* End of file: build/default/src/plugins/table/table-create.js */
            
                /* File: build/default/src/plugins/table/table-delete-column.js */
                Raptor.registerUi(new TableCellButton({
    name: 'tableDeleteColumn',
    applyToElement: function(cell) {
        tableDeleteColumn(cell.parentNode.parentNode.parentNode, tableGetCellIndex(cell).x);
    }
}));

                /* End of file: build/default/src/plugins/table/table-delete-column.js */
            
                /* File: build/default/src/plugins/table/table-delete-row.js */
                Raptor.registerUi(new TableCellButton({
    name: 'tableDeleteRow',
    applyToElement: function(cell) {
        tableDeleteRow(cell.parentNode.parentNode.parentNode, tableGetCellIndex(cell).x);
    }
}));

                /* End of file: build/default/src/plugins/table/table-delete-row.js */
            
                /* File: build/default/src/plugins/table/table-insert-column.js */
                Raptor.registerUi(new TableCellButton({
    name: 'tableInsertColumn',
    applyToElement: function(cell) {
        tableInsertColumn(cell.parentNode.parentNode.parentNode, tableGetCellIndex(cell).x, {
            placeHolder: '&nbsp;'
        });
    }
}));

                /* End of file: build/default/src/plugins/table/table-insert-column.js */
            
                /* File: build/default/src/plugins/table/table-insert-row.js */
                Raptor.registerUi(new TableCellButton({
    name: 'tableInsertRow',
    applyToElement: function(cell) {
        tableInsertRow(cell.parentNode.parentNode.parentNode, tableGetCellIndex(cell).x, {
            placeHolder: '&nbsp;'
        });
    }
}));

                /* End of file: build/default/src/plugins/table/table-insert-row.js */
            
                /* File: build/default/src/plugins/tag-menu/tag-menu.js */
                function TagMenu(options) {
    SelectMenu.call(this, {
        name: 'tagMenu'
    });
}

TagMenu.prototype = Object.create(SelectMenu.prototype);

TagMenu.prototype.init = function(raptor) {
    raptor.bind('selectionChange', this.updateButton.bind(this));
    return SelectMenu.prototype.init.apply(this, arguments);
};

TagMenu.prototype.changeTag = function(tag) {
    // Prevent injection of illegal tags
    if (typeof tag === 'undefined' || tag === 'na') {
        return;
    }

    var editingElement = this.raptor.getElement()[0];
    var selectedElement = selectionGetElements();
    if (!selectionGetHtml() || selectionGetHtml() === '') {
        // Do not attempt to modify editing element's tag
        if ($(selectedElement)[0] === $(editingElement)[0]) {
            return;
        }
        selectionSave();
        var replacementElement = $('<' + tag + '>').html(selectedElement.html());
        selectedElement.replaceWith(replacementElement);
        selectionRestore();
    } else {
        var selectedElementParent = $(selectionGetElements()[0]).parent();
        var temporaryClass = this.options.baseClass + '-selection';
        var replacementHtml = $('<' + tag + '>').html(selectionGetHtml()).addClass(temporaryClass);

        /*
         * Replace selection if the selected element parent or the selected element is the editing element,
         * instead of splitting the editing element.
         */
        if (selectedElementParent === editingElement ||
            selectionGetElements()[0] === editingElement) {
            selectionReplace(replacementHtml);
        } else {
            selectionReplaceWithinValidTags(replacementHtml, this.validParents);
        }

        selectionSelectInner(this.raptor.getElement().find('.' + temporaryClass).removeClass(temporaryClass));
    }

    this.raptor.checkChange();
};

TagMenu.prototype.apply = function(event) {
    this.raptor.actionApply(function() {
        this.changeTag($(event.currentTarget).data('value'));
    }.bind(this));
};

TagMenu.prototype.preview = function(event) {
    if (this.preview) {
        this.raptor.actionPreview(function() {
            this.changeTag($(event.currentTarget).data('value'));
        }.bind(this));
    }
};

TagMenu.prototype.previewRestore = function(event) {
    if (this.preview) {
        this.raptor.actionPreviewRestore();
    }
};

TagMenu.prototype.updateButton = function() {
    var tag = selectionGetElements()[0],
        button = this.getButton().getButton();
    if (!tag) {
        aButtonDisable(button);
        return;
    }
    var tagName = tag.tagName.toLowerCase(),
        option = this.getMenu().find('[data-value=' + tagName + ']');
    if (option.length) {
        aButtonSetLabel(button, option.html());
    } else {
        aButtonSetLabel(button, _('tagMenuTagNA'));
    }
    if (this.editor.getElement()[0] === tag) {
        aButtonDisable(button);
    } else {
        aButtonEnable(button);
    }
};

TagMenu.prototype.getButton = function() {
    if (!this.button) {
        this.button = new Button({
            name: this.name,
            action: this.show.bind(this),
            preview: false,
            options: this.options,
            icon: false
        });
    }
    return this.button;
};

TagMenu.prototype.getMenuItems = function() {
    return $(this.editor.getTemplate('tag-menu.menu', this.options))
        .click(this.apply.bind(this))
        .mouseenter(this.preview.bind(this))
        .mouseleave(this.previewRestore.bind(this));
};

Raptor.registerUi(new TagMenu());

                /* End of file: build/default/src/plugins/tag-menu/tag-menu.js */
            
                /* File: build/default/src/plugins/text-align/center.js */
                Raptor.registerUi(new PreviewButton({
    name: 'alignCenter',
    action: function() {
        selectionToggleBlockStyle({
            'text-align': 'center'
        }, this.raptor.getElement());
    }
}));

                /* End of file: build/default/src/plugins/text-align/center.js */
            
                /* File: build/default/src/plugins/text-align/justify.js */
                Raptor.registerUi(new PreviewButton({
    name: 'alignJustify',
    action: function() {
        selectionToggleBlockStyle({
            'text-align': 'justify'
        }, this.raptor.getElement());
    }
}));

                /* End of file: build/default/src/plugins/text-align/justify.js */
            
                /* File: build/default/src/plugins/text-align/left.js */
                Raptor.registerUi(new PreviewButton({
    name: 'alignLeft',
    action: function() {
        selectionToggleBlockStyle({
            'text-align': 'left'
        }, this.raptor.getElement());
    }
}));

                /* End of file: build/default/src/plugins/text-align/left.js */
            
                /* File: build/default/src/plugins/text-align/right.js */
                Raptor.registerUi(new PreviewButton({
    name: 'alignRight',
    action: function() {
        selectionToggleBlockStyle({
            'text-align': 'right'
        }, this.raptor.getElement());
    }
}));

                /* End of file: build/default/src/plugins/text-align/right.js */
            
                /* File: build/default/src/plugins/text-style/block-quote.js */
                Raptor.registerUi(new PreviewButton({
    name: 'textBlockQuote',
    action: function() {
        selectionToggleWrapper('blockquote', { 
            classes: this.options.classes || this.options.cssPrefix + 'blockquote' 
        });
    }
}));

                /* End of file: build/default/src/plugins/text-style/block-quote.js */
            
                /* File: build/default/src/plugins/text-style/bold.js */
                Raptor.registerUi(new CSSClassApplierButton({
    name: 'textBold',
    hotkey: 'ctrl+b',
    tag: 'strong'
}));

                /* End of file: build/default/src/plugins/text-style/bold.js */
            
                /* File: build/default/src/plugins/text-style/italic.js */
                Raptor.registerUi(new CSSClassApplierButton({
    name: 'textItalic',
    hotkey: 'ctrl+i',
    tag: 'em'
}));

                /* End of file: build/default/src/plugins/text-style/italic.js */
            
                /* File: build/default/src/plugins/text-style/size-decrease.js */
                Raptor.registerUi(new PreviewButton({
    name: 'textSizeDecrease',
    action: function() {
        selectionInverseWrapWithTagClass('small', this.options.cssPrefix + 'small', 'big', this.options.cssPrefix + 'big');
    }
}));

                /* End of file: build/default/src/plugins/text-style/size-decrease.js */
            
                /* File: build/default/src/plugins/text-style/size-increase.js */
                Raptor.registerUi(new PreviewButton({
    name: 'textSizeIncrease',
    action: function() {
        selectionInverseWrapWithTagClass('big', this.options.cssPrefix + 'big', 'small', this.options.cssPrefix + 'small');
    }
}));

                /* End of file: build/default/src/plugins/text-style/size-increase.js */
            
                /* File: build/default/src/plugins/text-style/strike.js */
                Raptor.registerUi(new CSSClassApplierButton({
    name: 'textStrike',
    tag: 'strike'
}));

                /* End of file: build/default/src/plugins/text-style/strike.js */
            
                /* File: build/default/src/plugins/text-style/sub.js */
                Raptor.registerUi(new CSSClassApplierButton({
    name: 'textSub',
    tag: 'sub'
}));

                /* End of file: build/default/src/plugins/text-style/sub.js */
            
                /* File: build/default/src/plugins/text-style/super.js */
                Raptor.registerUi(new CSSClassApplierButton({
    name: 'textSuper',
    tag: 'sup'
}));

                /* End of file: build/default/src/plugins/text-style/super.js */
            
                /* File: build/default/src/plugins/text-style/underline.js */
                Raptor.registerUi(new CSSClassApplierButton({
    name: 'textUnderline',
    hotkey: 'ctrl+u',
    tag: 'u'
}));

                /* End of file: build/default/src/plugins/text-style/underline.js */
            
                /* File: build/default/src/plugins/unsaved-edit-warning/unsaved-edit-warning.js */
                var unsavedEditWarningDirty = 0,
    unsavedEditWarningElement = null;

function UnsavedEditWarningPlugin(name, overrides) {
    RaptorPlugin.call(this, name || 'unsavedEditWarning', overrides);
}

UnsavedEditWarningPlugin.prototype = Object.create(RaptorPlugin.prototype);

UnsavedEditWarningPlugin.prototype.enable = function(raptor) {
    this.raptor.bind('dirty', this.show.bind(this));
    this.raptor.bind('cleaned', this.hide.bind(this));
};

UnsavedEditWarningPlugin.prototype.show = function() {
    unsavedEditWarningDirty++;
    if (unsavedEditWarningDirty > 0) {
        elementBringToTop(this.getElement(this));
        this.getElement(this).addClass('raptor-unsaved-edit-warning-visible');
    }
};

UnsavedEditWarningPlugin.prototype.hide = function(event) {
    unsavedEditWarningDirty--;
    if (unsavedEditWarningDirty === 0) {
        this.getElement(this).removeClass('raptor-unsaved-edit-warning-visible');
    }
};

UnsavedEditWarningPlugin.prototype.getElement = function(instance) {
    if (!unsavedEditWarningElement) {
        unsavedEditWarningElement = $(this.raptor.getTemplate('unsaved-edit-warning.warning', this.options))
            .mouseenter(function() {
                Raptor.eachInstance(function(editor) {
                    if (editor.isDirty()) {
                        editor.getElement().addClass('raptor-unsaved-edit-warning-dirty');
                    }
                });
            })
            .mouseleave(function() {
                $('.raptor-unsaved-edit-warning-dirty').removeClass('raptor-unsaved-edit-warning-dirty');
            })
            .appendTo('body');
    }
    return unsavedEditWarningElement;
};

Raptor.registerPlugin(new UnsavedEditWarningPlugin());

                /* End of file: build/default/src/plugins/unsaved-edit-warning/unsaved-edit-warning.js */
            
                /* File: build/default/src/plugins/view-source/view-source.js */
                var viewSourceDialog = null;

Raptor.registerUi(new Button({
    name: 'viewSource',
    action: function() {
        this.getDialog().find('textarea').text(this.raptor.getHtml());
        aDialogOpen(this.getDialog());
    },
    getDialog: function() {
        if (!viewSourceDialog) {
            viewSourceDialog = $('<div>').html(this.editor.getTemplate('view-source.dialog', this.options));
            aDialog(viewSourceDialog, {
                modal: true,
                width: 600,
                height: 400,
                resizable: true,
                title: _('viewSourceDialogTitle'),
                autoOpen: true,
                dialogClass: this.options.baseClass + '-dialog ' + this.options.dialogClass,
                buttons: [
                    {
                        text: _('viewSourceDialogOKButton'),
                        click: function(event) {
                            var html = viewSourceDialog.find('textarea').val();
                            this.raptor.setHtml(html);
                            aDialogClose(viewSourceDialog);
                        }.bind(this),
                        icons: {
                            primary: 'ui-icon-circle-check'
                        }
                    },
                    {
                        text: _('viewSourceDialogCancelButton'),
                        click: function() {
                            aDialogClose(viewSourceDialog);
                        },
                        icons: {
                            primary: 'ui-icon-circle-close'
                        }
                    }
                ],
                close: function() {
                    this.raptor.checkChange();
                }.bind(this)
            });
        }
        return viewSourceDialog;
    }
}));

                /* End of file: build/default/src/plugins/view-source/view-source.js */
            
            // Raptor wrapper
            })(jQuery, window, rangy);
        jQuery('<style type="text/css">\n\
                /* File: build/default/src/theme/theme.css */\n\
                /* Non styles */\n\
/**\n\
 * Style global variables\n\
 *\n\
 * @author David Neilsen <david@panmedia.co.nz>\n\
 */\n\
/* Base style */\n\
/**\n\
 * Main editor layout\n\
 *\n\
 * @author David Neilsen <david@panmedia.co.nz>\n\
 * @author Michael Robinson <michael@panmedia.co.nz>\n\
 */\n\
/******************************************************************************\\n\
 * Editor toolbar\n\
\******************************************************************************/\n\
.raptor-wrapper {\n\
  overflow: visible;\n\
  z-index: 1001;\n\
  position: fixed;\n\
  font-size: 12px;\n\
  -webkit-user-select: none;\n\
  -moz-user-select: none;\n\
  user-select: none; }\n\
  .raptor-wrapper * {\n\
    -webkit-user-select: none;\n\
    -moz-user-select: none;\n\
    user-select: none; }\n\
  .raptor-wrapper .raptor-toolbar {\n\
    padding: 6px 0 0 5px;\n\
    overflow: visible; }\n\
  .raptor-wrapper .ui-dialog-titlebar .raptor-element-path:first-child {\n\
    margin-left: 5px; }\n\
  .raptor-wrapper .ui-dialog-titlebar .raptor-element-path {\n\
    min-width: 10px;\n\
    min-height: 15px;\n\
    display: inline-block; }\n\
\n\
.raptor-dock-docked-to-element .raptor-toolbar {\n\
  padding: 5px 0 0 5px!important; }\n\
  .raptor-dock-docked-to-element .raptor-toolbar .raptor-group {\n\
    margin: 0 5px 5px 0; }\n\
\n\
.raptor-dock-docked-element {\n\
  display: block !important;\n\
  border: 0 none transparent;\n\
  -webkit-box-sizing: border-box;\n\
  -moz-box-sizing: border-box;\n\
  box-sizing: border-box; }\n\
\n\
/******************************************************************************\\n\
 * Inputs\n\
\******************************************************************************/\n\
.raptor-wrapper textarea,\n\
.raptor-wrapper input {\n\
  padding: 5px; }\n\
\n\
/******************************************************************************\\n\
 * Dialogs\n\
\******************************************************************************/\n\
.raptor-wrapper .ui-dialog-content {\n\
  font-size: 13px; }\n\
.raptor-wrapper textarea {\n\
  display: -webkit-box;\n\
  display: -moz-box;\n\
  display: -ms-box;\n\
  display: box;\n\
  -webkit-box-flex: 1;\n\
  -moz-box-flex: 1;\n\
  -ms-box-flex: 1;\n\
  box-flex: 1; }\n\
\n\
html body div.ui-dialog div.ui-dialog-titlebar a.ui-dialog-titlebar-close span.ui-icon {\n\
  margin-top: 0!important; }\n\
\n\
/**\n\
 * Main editor styles\n\
 *\n\
 * @author David Neilsen <david@panmedia.co.nz>\n\
 * @author Michael Robinson <michael@panmedia.co.nz>\n\
 */\n\
.raptor-editing {\n\
  outline: none; }\n\
\n\
/******************************************************************************\\n\
 * Inputs\n\
\******************************************************************************/\n\
.raptor-wrapper textarea,\n\
.raptor-wrapper input {\n\
  border: 1px solid #D4D4D4; }\n\
\n\
/******************************************************************************\\n\
 * Dialogs\n\
\******************************************************************************/\n\
.raptor-wrapper .ui-dialog-content {\n\
  font-size: 13px; }\n\
\n\
html body div.ui-wrapper div.ui-dialog-titlebar a.ui-dialog-titlebar-close span.ui-icon {\n\
  margin-top: 0!important; }\n\
\n\
/* Components */\n\
/**\n\
 * Path selection bar\n\
 *\n\
 * @author David Neilsen <david@panmedia.co.nz>\n\
 */\n\
.raptor-path {\n\
  padding: 5px;\n\
  font-size: 13px; }\n\
\n\
/**\n\
 * Select menu UI widget styles\n\
 *\n\
 * @author David Neilsen <david@panmedia.co.nz>\n\
 */\n\
.raptor-selectmenu {\n\
  overflow: visible;\n\
  position: relative; }\n\
\n\
.raptor-selectmenu-button {\n\
  text-align: left;\n\
  padding: 3px 18px 5px 5px !important;\n\
  float: none !important; }\n\
  .raptor-selectmenu-button .ui-icon {\n\
    position: absolute;\n\
    right: 1px;\n\
    top: 8px; }\n\
  .raptor-selectmenu-button .raptor-selectmenu-text {\n\
    font-size: 13px; }\n\
\n\
.raptor-selectmenu-wrapper {\n\
  position: relative; }\n\
\n\
.raptor-selectmenu-button .ui-button-text {\n\
  padding: 0 25px 0 5px; }\n\
\n\
.raptor-selectmenu-button .ui-icon {\n\
  background-repeat: no-repeat; }\n\
\n\
.raptor-selectmenu-menu {\n\
  position: absolute;\n\
  top: 100%;\n\
  left: 0;\n\
  right: auto;\n\
  display: none;\n\
  margin-top: -1px !important; }\n\
\n\
.raptor-selectmenu-visible .raptor-selectmenu-menu {\n\
  display: block;\n\
  z-index: 1; }\n\
\n\
.raptor-selectmenu-menu-item {\n\
  padding: 5px;\n\
  margin: 3px;\n\
  z-index: 1;\n\
  text-align: left;\n\
  font-size: 13px;\n\
  font-weight: normal !important;\n\
  border: 1px solid transparent;\n\
  cursor: pointer;\n\
  background-color: inherit; }\n\
\n\
.raptor-selectmenu-button {\n\
  background: #f5f5f5;\n\
  border: 1px solid #ccc; }\n\
\n\
.raptor-buttonset .raptor-selectmenu-visible .raptor-selectmenu-button {\n\
  -moz-border-radius-bottomleft: 0;\n\
  -webkit-border-bottom-left-radius: 0;\n\
  border-bottom-left-radius: 0;\n\
  -moz-border-radius-bottomright: 0;\n\
  -webkit-border-bottom-right-radius: 0;\n\
  border-bottom-right-radius: 0; }\n\
\n\
/**\n\
 * Button UI widget styles\n\
 *\n\
 * @author David Neilsen <david@panmedia.co.nz>\n\
 */\n\
.raptor-buttonset {\n\
  float: left;\n\
  margin: 0 5px 4px 0;\n\
  display: inline-block; }\n\
  .raptor-buttonset > .ui-button {\n\
    float: left;\n\
    display: block;\n\
    margin: 0 -1px 0 0;\n\
    font-size: 13px; }\n\
  .raptor-buttonset .ui-button:hover {\n\
    z-index: 1; }\n\
  .raptor-buttonset .raptor-selectmenu {\n\
    display: block; }\n\
    .raptor-buttonset .raptor-selectmenu .ui-button {\n\
      margin: 0 -1px 0 0; }\n\
\n\
.raptor-ff .raptor-buttonset {\n\
  float: none;\n\
  vertical-align: top; }\n\
\n\
.raptor-wrapper .raptor-buttonset > .ui-button {\n\
  -webkit-border-radius: 0;\n\
  -moz-border-radius: 0;\n\
  -ms-border-radius: 0;\n\
  -o-border-radius: 0;\n\
  border-radius: 0; }\n\
  .raptor-wrapper .raptor-buttonset > .ui-button:first-child {\n\
    -moz-border-radius-topleft: 5px;\n\
    -webkit-border-top-left-radius: 5px;\n\
    border-top-left-radius: 5px;\n\
    -moz-border-radius-bottomleft: 5px;\n\
    -webkit-border-bottom-left-radius: 5px;\n\
    border-bottom-left-radius: 5px; }\n\
  .raptor-wrapper .raptor-buttonset > .ui-button:last-child {\n\
    -moz-border-radius-topright: 5px;\n\
    -webkit-border-top-right-radius: 5px;\n\
    border-top-right-radius: 5px;\n\
    -moz-border-radius-bottomright: 5px;\n\
    -webkit-border-bottom-right-radius: 5px;\n\
    border-bottom-right-radius: 5px; }\n\
\n\
.raptor-menu {\n\
  z-index: 10000; }\n\
\n\
/**\n\
 * Unsupported warning styles\n\
 *\n\
 * @author David Neilsen <david@panmedia.co.nz>\n\
 */\n\
/* Layout */\n\
.raptor-unsupported {\n\
  position: relative; }\n\
\n\
.raptor-unsupported-overlay {\n\
  position: fixed;\n\
  top: 0;\n\
  left: 0;\n\
  bottom: 0;\n\
  right: 0;\n\
  background-color: black;\n\
  filter: alpha(opacity=50);\n\
  opacity: 0.5; }\n\
\n\
.raptor-unsupported-content {\n\
  position: fixed;\n\
  top: 50%;\n\
  left: 50%;\n\
  margin: -200px 0 0 -300px;\n\
  width: 600px;\n\
  height: 400px; }\n\
\n\
.raptor-unsupported-input {\n\
  position: absolute;\n\
  bottom: 10px; }\n\
\n\
/* Style */\n\
.raptor-unsupported-content {\n\
  padding: 10px;\n\
  background-color: white;\n\
  border: 1px solid #777; }\n\
\n\
/**\n\
 * Message widget styles\n\
 *\n\
 * @author David Neilsen <david@panmedia.co.nz>\n\
 */\n\
/******************************************************************************\\n\
 * Messages\n\
\******************************************************************************/\n\
.raptor-messages {\n\
  margin: 0;\n\
  /* Error */\n\
  /* Confirm */\n\
  /* Information */\n\
  /* Warning */\n\
  /* Loading */ }\n\
  .raptor-messages .raptor-message-close {\n\
    cursor: pointer;\n\
    float: right; }\n\
  .raptor-messages .ui-icon {\n\
    margin: 0 0 3px 3px; }\n\
  .raptor-messages .ui-icon,\n\
  .raptor-messages .raptor-message {\n\
    display: inline-block;\n\
    vertical-align: top; }\n\
  .raptor-messages .raptor-message-wrapper {\n\
    padding: 3px 3px 3px 1px;\n\
    -webkit-box-shadow: inset 0 -1px 1px rgba(0, 0, 0, 0.35), inset 0 1px 2px rgba(255, 255, 255, 0.5);\n\
    -moz-box-shadow: inset 0 -1px 1px rgba(0, 0, 0, 0.35), inset 0 1px 2px rgba(255, 255, 255, 0.5);\n\
    box-shadow: inset 0 -1px 1px rgba(0, 0, 0, 0.35), inset 0 1px 2px rgba(255, 255, 255, 0.5); }\n\
  .raptor-messages .raptor-message-wrapper:first-child {\n\
    -moz-border-radius-topright: 5px;\n\
    -webkit-border-top-right-radius: 5px;\n\
    border-top-right-radius: 5px;\n\
    -moz-border-radius-topleft: 5px;\n\
    -webkit-border-top-left-radius: 5px;\n\
    border-top-left-radius: 5px; }\n\
  .raptor-messages .raptor-message-wrapper:last-child {\n\
    -moz-border-radius-bottomright: 5px;\n\
    -webkit-border-bottom-right-radius: 5px;\n\
    border-bottom-right-radius: 5px;\n\
    -moz-border-radius-bottomleft: 5px;\n\
    -webkit-border-bottom-left-radius: 5px;\n\
    border-bottom-left-radius: 5px; }\n\
  .raptor-messages .raptor-message-circle-close {\n\
    /* Red */\n\
    background: url(\'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4gPHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJncmFkIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgeDE9IjUwJSIgeTE9IjAlIiB4Mj0iNTAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iI2ZmNWQ0YiIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iI2ZhMWMxYyIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxyZWN0IHg9IjAiIHk9IjAiIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JhZCkiIC8+PC9zdmc+IA==\');\n\
    background: -webkit-gradient(linear, 50% 0%, 50% 100%, color-stop(0%, #ff5d4b), color-stop(100%, #fa1c1c));\n\
    background: -webkit-linear-gradient(top, #ff5d4b, #fa1c1c);\n\
    background: -moz-linear-gradient(top, #ff5d4b, #fa1c1c);\n\
    background: -o-linear-gradient(top, #ff5d4b, #fa1c1c);\n\
    background: linear-gradient(top, #ff5d4b, #fa1c1c); }\n\
  .raptor-messages .raptor-message-circle-check {\n\
    /* Green */\n\
    background: url(\'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4gPHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJncmFkIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgeDE9IjUwJSIgeTE9IjAlIiB4Mj0iNTAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iI2NkZWI4ZSIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iI2E1Yzk1NiIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxyZWN0IHg9IjAiIHk9IjAiIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JhZCkiIC8+PC9zdmc+IA==\');\n\
    background: -webkit-gradient(linear, 50% 0%, 50% 100%, color-stop(0%, #cdeb8e), color-stop(100%, #a5c956));\n\
    background: -webkit-linear-gradient(top, #cdeb8e, #a5c956);\n\
    background: -moz-linear-gradient(top, #cdeb8e, #a5c956);\n\
    background: -o-linear-gradient(top, #cdeb8e, #a5c956);\n\
    background: linear-gradient(top, #cdeb8e, #a5c956); }\n\
  .raptor-messages .raptor-message-info {\n\
    /* Blue */\n\
    background: url(\'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4gPHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJncmFkIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgeDE9IjUwJSIgeTE9IjAlIiB4Mj0iNTAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iI2E5ZTRmNyIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iIzBmYjRlNyIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxyZWN0IHg9IjAiIHk9IjAiIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JhZCkiIC8+PC9zdmc+IA==\');\n\
    background: -webkit-gradient(linear, 50% 0%, 50% 100%, color-stop(0%, #a9e4f7), color-stop(100%, #0fb4e7));\n\
    background: -webkit-linear-gradient(top, #a9e4f7, #0fb4e7);\n\
    background: -moz-linear-gradient(top, #a9e4f7, #0fb4e7);\n\
    background: -o-linear-gradient(top, #a9e4f7, #0fb4e7);\n\
    background: linear-gradient(top, #a9e4f7, #0fb4e7); }\n\
  .raptor-messages .raptor-message-alert {\n\
    /* Yellow */\n\
    background: url(\'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4gPHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJncmFkIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgeDE9IjUwJSIgeTE9IjAlIiB4Mj0iNTAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iI2ZmZDY1ZSIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iI2ZlYmYwNCIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxyZWN0IHg9IjAiIHk9IjAiIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JhZCkiIC8+PC9zdmc+IA==\');\n\
    background: -webkit-gradient(linear, 50% 0%, 50% 100%, color-stop(0%, #ffd65e), color-stop(100%, #febf04));\n\
    background: -webkit-linear-gradient(top, #ffd65e, #febf04);\n\
    background: -moz-linear-gradient(top, #ffd65e, #febf04);\n\
    background: -o-linear-gradient(top, #ffd65e, #febf04);\n\
    background: linear-gradient(top, #ffd65e, #febf04); }\n\
  .raptor-messages .raptor-message-clock {\n\
    /* Purple */\n\
    background: url(\'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4gPHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJncmFkIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgeDE9IjUwJSIgeTE9IjAlIiB4Mj0iNTAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iI2ZiODNmYSIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iI2U5M2NlYyIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxyZWN0IHg9IjAiIHk9IjAiIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JhZCkiIC8+PC9zdmc+IA==\');\n\
    background: -webkit-gradient(linear, 50% 0%, 50% 100%, color-stop(0%, #fb83fa), color-stop(100%, #e93cec));\n\
    background: -webkit-linear-gradient(top, #fb83fa, #e93cec);\n\
    background: -moz-linear-gradient(top, #fb83fa, #e93cec);\n\
    background: -o-linear-gradient(top, #fb83fa, #e93cec);\n\
    background: linear-gradient(top, #fb83fa, #e93cec); }\n\
  .raptor-messages .raptor-message-clock .ui-icon.ui-icon-clock {\n\
    background: transparent url(\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAOXRFWHRTb2Z0d2FyZQBBbmltYXRlZCBQTkcgQ3JlYXRvciB2MS42LjIgKHd3dy5waHBjbGFzc2VzLm9yZyl0zchKAAAAOnRFWHRUZWNobmljYWwgaW5mb3JtYXRpb25zADUuMi4xNzsgYnVuZGxlZCAoMi4wLjM0IGNvbXBhdGlibGUpCBSqhQAAAAhhY1RMAAAACAAAAAC5PYvRAAAAGmZjVEwAAAAAAAAAEAAAABAAAAAAAAAAAAA8A+gAAIIkGDIAAACsSURBVDiNtZLBCcMwDEUfJgOUjhAyQsmp9FA8TgfISj6F4gl66jSdIIf00G9wnLjYKf3w0Qch6Us2fMdVLMYx0haYRZsrMJEegZdiDj3gFFeT54jBiU2mO+XdVvdRyV0OYidVMEAH3AEPHGoboMKwuy+seYqLV9iNTpM90P7S6AQMitXogYnPHSbyz2SAC9HqQVigkW7If90z8FAsctCyvMvKQdpkSOzfxP/hDd++JCi8XmbFAAAAGmZjVEwAAAABAAAAEAAAABAAAAAAAAAAAAA8A+gAABlX8uYAAAC3ZmRBVAAAAAI4jaWQsQ3CQBAEB4cECFGCI1fiAlyFKwARWgSIeqjCNTh0gIjIkBw9gffFSfz74VlpdX/W3Xr3YBmlmIUSmMSoSGHee+CmGsMGaFU/cAecqnVh/95qpg0J/O0gCytgDRzUX4DnryIn5lwO6L7c6fxskRhMwkc4qj+TEcFjC9SqWcsj8x3GhMgu9LHmfUinvgKuYmWWp5BIyEFvBPuUAy9ibzAYgWEhUhQN8BCb2NALKY4q8wCrG7AAAAAaZmNUTAAAAAMAAAAQAAAAEAAAAAAAAAAAADwD6AAA9MEhDwAAAKhmZEFUAAAABDiNY2CgMTgNxTgBExLbh4GB4SCUxgeMcEkcZmBg+A+lcQETqBoTbJI+UM1ku4AiEATFZIEQBoi//kPZxIAAKEaJBYpACAm24wUSBORVGBgYUqA0BtjKAAmHrXg0f4aq+YxuiAQDIiD/Q/k8DAwMdVDMw8DAkIamJo2QCyYjKZ4MtfErlP8VlzeQw2AlkgErkbyBMwzQgRoDA8N+KMapAQDdvyovpG6D8gAAABpmY1RMAAAABQAAABAAAAAQAAAAAAAAAAAAPAPoAAAZC1N1AAAAsWZkQVQAAAAGOI21kkEOgjAURF9YGBbGtYcwLowrwxk8BMcg3XACD9djGJaujKmLTkMRCiXEl0ympYX8+Xz4M62UpIjWR8DI59inDgzg5CkOwEs+YnMFmzhJOdwAK1UAZ+ANfLRewuJ75QAb/kKRvp/HmggVPxHWsAMu8hEN8JRPUdLnt9oP6HTYRc/uEsCVvnlO+wFGFYRJrKPLdU4FU5HCB0KsEt+DxZfBj+xDSo7vF9AbJ9PxYV81AAAAGmZjVEwAAAAHAAAAEAAAABAAAAAAAAAAAAA8A+gAAPSdgJwAAADDZmRBVAAAAAg4jaWSTQrCMBCFP6NIT5AjCF6gJ6jbUnoCL1biDTyF5AAueoZu3LkSrAtHTEJiIn3wmCTz92YILMQ64++BPTDKXQMH4AbcAZQTvAEasTFo4AqcxeowoAFmsSk1s8M+DChRMEnyFFNQAg10sWSFv49cESPUn+RRWFLE8N2DKe2axaIR/sU25eiAi9gUBt6zDzGnFad13nZCgAr/I1UxBdZRUAMPYV2iIETrdGudd28Hqx8FFHCU8wl4xoJeZnUrSRiyCSsAAAAaZmNUTAAAAAkAAAAQAAAAEAAAAAAAAAAAADwD6AAAGe6xwAAAALtmZEFUAAAACjiNpZJBCsIwEEWfpUsPULoSl55Beh4J7nqCHkDceR3pIaSr4Ak8Qq2L/khomlrig+FPhszwJy3EqYCHolq4F6UDBkWnWgbspN+CT7EwMAPuwFM67aUAem/IdIW952jQOeCXg1bN7ZyDNQRvsEkYkgNG+S1XcpHWKwacgatzlLLH2z/8vUJCf5wSaKQxToCVBjSM37jxaluFw+qOXeOgBF4KVzNqNkH3DAfGX7tXnsRREeUD4f8lQGjw+ycAAAAaZmNUTAAAAAsAAAAQAAAAEAAAAAAAAAAAADwD6AAA9HhiKQAAAJ9mZEFUAAAADDiNtZDLCcMwEEQfIUcXoDpCKgg6qIRUEtKB6wg6poDgalyFTj7YBw+2QyRlCc6DYVm0n9FCGQc8JFepWzgBN0WACIxS/NZ8BgYVD8pzA1ogKb5x3xSPyp0a4+YLSe/J4iBH0QF83uCvXKSFq2TBs97KH/Y1ZsdL+3IEgmJt86u0PTAfJlQGdKrprA6ekslBjl76mUYqMgFhpStJaQVr0gAAABpmY1RMAAAADQAAABAAAAAQAAAAAAAAAAAAPAPoAAAZshBTAAAAu2ZkQVQAAAAOOI21kCEOwkAQRR8rKkkFCtmjkJ4ARTgBArViT4LjLJwBgUZUr8NBQlrR38Am3XYEvOTnT7PzuzO7IE8BHFWfgNdELwBLYCMH8EAr+VzIyUvgBlzkZaZ/D1zlCfXXba2+C93sVaNwK08ogUaHzcQEu9wE0O9e83kDEw7YAhG4K/ww5CoJFB52j8bwU6rcTLOJYYWo2kKywk9Zz5yvgCAfDb9nfhLoHztYJzhIpgnGOEv/owMnkSfarUXVlAAAAABJRU5ErkJggg==\') no-repeat center center; }\n\
\n\
/* Layouts */\n\
/**\n\
 * Toolbar layout.\n\
 *\n\
 * @author David Neilsen <david@panmedia.co.nz>\n\
 */\n\
.raptor-layout-toolbar-group {\n\
  float: left; }\n\
\n\
.raptor-layout-toolbar-group .ui-button {\n\
  padding: 0;\n\
  margin-top: 0;\n\
  margin-right: 0;\n\
  margin-bottom: 3px;\n\
  height: 32px;\n\
  float: left;\n\
  -webkit-border-radius: 0;\n\
  -moz-border-radius: 0;\n\
  -ms-border-radius: 0;\n\
  -o-border-radius: 0;\n\
  border-radius: 0;\n\
  -webkit-box-sizing: border-box;\n\
  -moz-box-sizing: border-box;\n\
  box-sizing: border-box; }\n\
\n\
.raptor-layout-toolbar-group .ui-button-icon-only {\n\
  width: 32px; }\n\
\n\
.raptor-layout-toolbar-group .ui-button:first-child {\n\
  -moz-border-radius-topleft: 5px;\n\
  -webkit-border-top-left-radius: 5px;\n\
  border-top-left-radius: 5px;\n\
  -moz-border-radius-bottomleft: 5px;\n\
  -webkit-border-bottom-left-radius: 5px;\n\
  border-bottom-left-radius: 5px; }\n\
\n\
.raptor-layout-toolbar-group .ui-button:last-child {\n\
  margin-right: 2px;\n\
  -moz-border-radius-topright: 5px;\n\
  -webkit-border-top-right-radius: 5px;\n\
  border-top-right-radius: 5px;\n\
  -moz-border-radius-bottomright: 5px;\n\
  -webkit-border-bottom-right-radius: 5px;\n\
  border-bottom-right-radius: 5px; }\n\
\n\
/* Plugins */\n\
/**\n\
 * Blockquote plugin\n\
 *\n\
 * @author David Neilsen <david@panmedia.co.nz>\n\
 */\n\
.raptor-quote-block-button .ui-icon-quote {\n\
  filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=85);\n\
  opacity: 0.85;\n\
  background: url(\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAGVJREFUeNpi/P//PwMlgImBQjAcDWBhYZEA4r1AHA/EKHxiXQBS+BKIF+LgEzTAG4h3I0UvOh+/AUCFbECcDmROA2lC5mMzgAWLGDuUtsTBJ+iFeUDMC6Wx8VEA42hSptwAgAADAO3wKLgntfGkAAAAAElFTkSuQmCC\') 0 0; }\n\
\n\
.raptor-quote-block-button:hover .ui-icon-quote {\n\
  filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=100);\n\
  opacity: 1; }\n\
\n\
/**\n\
 * Clean content plugin\n\
 *\n\
 * @author David Neilsen <david@panmedia.co.nz>\n\
 */\n\
.raptor-clean-button .ui-icon-clean {\n\
  filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=85);\n\
  opacity: 0.85;\n\
  background: url(\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAABNVBMVEUAAAAAAAAgSocgSocgPnAAAABxcXFPT09YWFggSocgSocoToUbPXgSN3kyYZw0ZqT///8iUZkgSoc1Z6UiUJaJrNkwXpZIeLiOvO03a6s4b7JekNUjUpqCp9eNr9pSjeAwX5g2aqquxuV8otPB1euOsNv8/f6gveFgkdVnkMmbuuVfk9lkk9fK3Pbs8vmWtd5Vjs98odCHqNWkv+Jzms6Qt+xnmNuzyudVidS90u6hwe5mmuQtXKCow+OqxepNg82Xtd3C1Ox0m89vl8x3oNl4n9NSjuDi7PqlxO+MtOyWtt2fwO60y+dUjt5zm8/L2+9qneT3+f7g6/qDrelRi95snuWowuSfvOGPr9uwyeqRsdqUs9qat92OrtmDptN5ns9Rh8hqk8uXuehwnt1vl83e6vmZu+gBAK69AAAADXRSTlMbAKM01gogSSmAy7W1OP1GaAAAAM1JREFUeF5VzNN2A1EAQNE7TIrrsSe0Udu2zf//hHZWk672PO6HAySR/UmUwBjT9XyzeJlZuGpe60wE474TxxghhHEcOz4DzLcxRoZhJGT/AOcoiiKEOE9AZEGw291fOcpNdZeD74fEqKZ5lFLP0+YplIDAzBfXrTQKNyW3bEIhgV51QD5fyVv1fQir0zOzcxfW4tLaCGqkHoYWWR/BxubW9k5/7+PgcAjZ8JicnJKz82wC6gRstTu3d/cPj0/PcFIF6ZQMf5NTaaCAfylf1j4ecCeyzckAAAAASUVORK5CYII=\') 0 0; }\n\
\n\
.raptor-clean-button:hover .ui-icon-clean {\n\
  filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=100);\n\
  opacity: 1; }\n\
\n\
/**\n\
 * Clear formatting style plugin.\n\
 *\n\
 * @author David Neilsen <david@panmedia.co.nz>\n\
 */\n\
.raptor-ui-clear-formatting .ui-icon {\n\
  filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=85);\n\
  opacity: 0.85;\n\
  background: url(\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB9wGGxcPH7KJ9wUAAAEKSURBVDjL3ZG9SgNBFIW/I76D1RIEazEIFitWNguxUPANUkUIKG4jYiEBC7WwUFJZiNssFvoOFipMFx/AoIVVEAvxB7w2MyBhV5Iq4IHLPecy9zBzBv4nJLUltQc5O1awXAE+gAnPhzMAFoE7YNzzoQ0WgBvg1vPBDSRNAl9m9gC4ebPpc+jkkADkkOTggi4KryFpV9KMpHgfXr/T1DJwGWxn4IIuM7iQdB1qDu73oPder9spuNDPYLZoeUrSZd9saQUej6DzUqvZCbhj2Pjr+pu/ZzuwnMLbc7Vqh+BCPyjIIAaefMVhuA69bhTZGnyuwlULXDeKrFWWQT+akDTAbfk3B90s+4WR4Acs5VZuyM1J1wAAAABJRU5ErkJggg==\') 0 0; }\n\
\n\
.raptor-ui-clear-formatting:hover .ui-icon {\n\
  filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=100);\n\
  opacity: 1; }\n\
\n\
/**\n\
 * Click to edit plugin\n\
 *\n\
 * @author Michael Robinson <michael@panmedia.co.nz>\n\
 * @author David Neilsen <david@panmedia.co.nz>\n\
 */\n\
.raptor-click-button-to-edit-button {\n\
  z-index: 4000; }\n\
\n\
.raptor-click-button-to-edit {\n\
  outline: 1px solid transparent; }\n\
\n\
.raptor-click-button-to-edit-highlight {\n\
  outline: 1px dotted rgba(0, 0, 0, 0.5);\n\
  -webkit-transition: all 0.5s;\n\
  -webkit-transition-delay: 0s;\n\
  -moz-transition: all 0.5s 0s;\n\
  -o-transition: all 0.5s 0s;\n\
  transition: all 0.5s 0s; }\n\
\n\
/**\n\
 * Basic color picker plugin.\n\
 *\n\
 * @author David Neilsen <david@panmedia.co.nz>\n\
 */\n\
.raptor-ui-color-picker-basic-menu > div {\n\
  min-width: 100px; }\n\
\n\
.raptor-ui-color-picker-basic-menu span {\n\
  padding-left: 2px; }\n\
\n\
.raptor-ui-color-picker-basic-swatch {\n\
  width: 16px;\n\
  height: 16px;\n\
  float: left;\n\
  margin-top: 2px;\n\
  border: 1px solid rgba(0, 0, 0, 0.2); }\n\
\n\
.raptor-ui-color-picker-basic .ui-icon-swatch {\n\
  background-image: none;\n\
  border: 1px solid rgba(0, 0, 0, 0.35); }\n\
\n\
/**\n\
 * Debug plugin\n\
 *\n\
 * @author David Neilsen <david@panmedia.co.nz>\n\
 */\n\
.raptor-debug-reinit-button .ui-icon-reload {\n\
  filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=85);\n\
  opacity: 0.85;\n\
  background: url(\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAqBJREFUeNqkU01PE2EQnrfdtmyLpbRNA/ULGyAhRi+NHkTk5sEEiRyMEi+evHszJh5I/AF613ho9EIwhEiMB4kSjQcWSDxgIAhJoZV26dd2t/v17jqzkoLGG5vM7rvzzPPsfOww13XhOJdAt8vPN0EIBEAQBPD5/UHGWALdnWgW2iO07H+40sL91APhH2ev4HOH+tJiZzoZCia7guXpj8XsnevprGX9yVQMM8i9K0jA2GI7A+9y3Uwo4I6Mj6aijToHzl2nXrNk27bBMDg0FQ7dcQFezeYljH6PlmsLuI4T8zF+e+zqqZ69ggaKZrH13WaxXDcUwm2LQ6xbgOKOCreu9WTfLuQVy3bSCBV8XoBpjmR6xYvFfKNflpuZTyuF1q+y8sHhXLINA7q6g/Byek06ERWgUlJh8EykHzkTxPUETMMYTcWCQ/Wqllnb3hct0/yM01nWVZUwePZiWcLnt0Vpd1NvmZCMBuL4PtwuwdL1S37GMqpuQaFUL+Mk5rllgeM41BuqeZH5/bmNzdJSbzQEiUggjJyBtgCqRVTDjqrc9c6YOjbRhlCHSON9YKMYGQpDrWVDh2F7mR2WoOsbezVdU30CdMXEGNY3abZ0rLcEVVkGpVqlPk0SRjEUS5y2gGUYX7byckURgnB66OxJ7MFD7MHkAQZ0Jh9hFEOxxDkUMM2ZrR/bMo+IsA3hjuzN4fPpvtQUjneJjM7kI4xiKJY4xGW0C9F7bwDrHvNHwk8T4zcutGz0hRjEQp4+1AwHGoYLosBgf3b+O1e1x9iPuUbu7uGfiEJzerUGu6+npwKDA8lm5lx8J54Ie2lWapr7c6tSWd+QwTSfYGPn/lqmoyKOpkn2yuoErKxeQdfgAbSO9hWXbAa/XDjKYcdd598CDAAkzn7JYhVZYAAAAABJRU5ErkJggg==\') 0 0; }\n\
\n\
.raptor-debug-reinit-button:hover .ui-icon-reload {\n\
  filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=100);\n\
  opacity: 1; }\n\
\n\
.raptor-debug-destroy-button .ui-icon-close {\n\
  filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=85);\n\
  opacity: 0.85;\n\
  background: url(\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAtFBMVEX///+nAABhAACnAACjAACCAACgAACHAACjAAByAAB1AAByAACDAACnAACCAACHAACgAACNAACbAACXAACMAACSAABfAACYAACRAACjAACbAAChAACqAACNAACcAACHAACqAADEERGsERHQERG+NjaiERHUTEzYERG4ERGlFBSfFRX/d3f6cnK0JSWoHh7qYmLkXFyvFRXmXl7vZ2fNRUX4cHDXT0/+dnbbU1O3Li7GPT26MTG2f8oMAAAAIXRSTlMASEjMzADMzAAASMxIAMwAAMzMzEjMzEhISABIzABISEg/DPocAAAAj0lEQVR4Xo3PVw6DMBBF0RgXTO+hBYhtILX3sv99RRpvgPcxVzp/M5syb7lYepxDABDeYcQ5wg+MAMhr3JOyJKfxTABqduuvjD37O6sBwjZ+f76/7TFuQw1VnhyGYZPklYagKbKLlDIrmkBDGq1hUaqhM4UQJpwOwFdK+a4LAbCdlWNTCgGwjLlhUQqZ8uofSk8NKY1Fm8EAAAAASUVORK5CYII=\') 0 0; }\n\
\n\
.raptor-debug-destroy-button:hover .ui-icon-close {\n\
  filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=100);\n\
  opacity: 1; }\n\
\n\
/**\n\
 * Dock plugin\n\
 *\n\
 * @author David Neilsen <david@panmedia.co.nz>\n\
 */\n\
.raptor-ui-dock-to-screen .ui-icon {\n\
  filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=85);\n\
  opacity: 0.85;\n\
  background: url(\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAZ5JREFUeNqkUj1Lw1AUPXlJY0FLraWguGWxgyC6KOLkIGjn6h9wqyBYoRYcCoJVigiiU3+BGbo4CB1EUApuDoIudqwOGgMdSs2X7z5M6cfS6oGbk5d77sl9710pmUxqAOZ5hNA/6jwedF2vKq7rLqTT6WwsFpt2HAe2bYmwLJuzDdclPeOhgLEAZDkAwzCeisXTPP9YlTYPPzz8EcVsVFLq9TpS6xMDF1/ob/wZBTNNA9SC53n9B9dTHUHh+8Hu0R3+jEQikWo2m16j0eiIUvnVi6+VBHfnSE911I3CT5rR6VP4uL5/x97JI85zy9jK3cB2XKwujbfysizTDTGxBd+AroxQrnxi/+xFFBOItw8q8FwJK4vRlolvwCzLYnwWhAHF1a2JYDCCTOFZCIlpTd99DempTnRAL+0dFHYmBW9kvvjgAJHwGC6PI/5fW1voMWg/A8JMPIzhIVdwd47W7QYytdQtmptSMRK0ODOe++7I/W5BFgamaaqM96qqaodoNi5hNCRxRk+O9FTnG9Q0TcsPOj/cpEYs0TD8Bz8CDAAbOyccWI3vMQAAAABJRU5ErkJggg==\') 0 0; }\n\
\n\
.raptor-ui-dock-to-screen:hover .ui-icon-pin-s {\n\
  filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=100);\n\
  opacity: 1; }\n\
\n\
.raptor-ui-dock-to-element .ui-icon {\n\
  filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=85);\n\
  opacity: 0.85;\n\
  background: url(\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAWJJREFUeNqck7FKxEAQhmc3eyGFWhzkBWxs7LUTQa48sLgnEH2Ba0xplUax93yCExRSW9haCBY2NlcLYjiT3B1HkllnJp4YsEgcmCy72f9j9p9dNRgMNgFgh3IdmkdK+TgejycGEXeHw2Hg+/52WZZQFLlknhc0FoDI+zWlAa074DgdiOP4ZTS6DGlxoo7DDwv/jKvTrjKLxRxODv324rt3+nbBZFkGFghgWxSiFLCOwyTJJ1g6qG0BUARgnQDSNAEksbXYHECmsk4As9lcxIjNAZqawjoBLJe5iLHEViayTgDWagJYKFtUwCayTgCO44mJSJeo8REIwDoBuO6amIjfJgYXr40grBOA521UFWDVRp7fnndrm/v9fhBFUbiae54HvV4vAHiuANxXOssPwHXdGmA6nbq/1zS1gdfEjv2jtwca9lY/rS3Pnm62agRjzD09rIN6K/WEINeqzQ38K74EGAB7PKOxn63x3wAAAABJRU5ErkJggg==\') 0 0; }\n\
\n\
.raptor-ui-dock-to-element:hover .ui-icon-pin-s {\n\
  filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=100);\n\
  opacity: 1; }\n\
\n\
/**\n\
 * Dialog docked to body\n\
 */\n\
.raptor-dock-docked {\n\
  z-index: 10000; }\n\
  .raptor-dock-docked .raptor-toolbar-wrapper {\n\
    position: fixed;\n\
    top: 0;\n\
    left: 0;\n\
    right: 0;\n\
    border-top: none;\n\
    display: -webkit-box;\n\
    display: -moz-box;\n\
    display: -ms-box;\n\
    display: box;\n\
    -webkit-box-pack: center;\n\
    -moz-box-pack: center;\n\
    -ms-box-pack: center;\n\
    box-pack: center;\n\
    -webkit-box-align: center;\n\
    -moz-box-align: center;\n\
    -ms-box-align: center;\n\
    box-align: center; }\n\
  .raptor-dock-docked .raptor-toolbar {\n\
    text-align: center; }\n\
  .raptor-dock-docked .raptor-path {\n\
    position: fixed;\n\
    bottom: 0;\n\
    left: 0;\n\
    right: 0; }\n\
\n\
.raptor-ios .raptor-dock-docked .raptor-path {\n\
  display: none; }\n\
\n\
/**\n\
 * Dialog docked to element\n\
 */\n\
.raptor-dock-docked-to-element-wrapper {\n\
  font-size: inherit;\n\
  color: inherit;\n\
  font-family: inherit; }\n\
\n\
.raptor-dock-docked-to-element-wrapper .raptor-wrapper {\n\
  /* Removed fixed position from the editor */\n\
  position: relative !important;\n\
  top: auto !important;\n\
  left: auto !important;\n\
  border: 0 none !important;\n\
  padding: 0 !important;\n\
  margin: 0 !important;\n\
  z-index: auto !important;\n\
  width: 100% !important;\n\
  font-size: inherit !important;\n\
  color: inherit !important;\n\
  font-family: inherit !important;\n\
  float: none !important;\n\
  width: auto !important;\n\
  display: -webkit-box;\n\
  display: -moz-box;\n\
  display: -ms-box;\n\
  display: box;\n\
  -webkit-box-orient: vertical;\n\
  -moz-box-orient: vertical;\n\
  -ms-box-orient: vertical;\n\
  box-orient: vertical; }\n\
  .raptor-dock-docked-to-element-wrapper .raptor-wrapper .raptor-toolbar {\n\
    margin: 0;\n\
    z-index: 2;\n\
    -webkit-box-ordinal-group: 1;\n\
    -moz-box-ordinal-group: 1;\n\
    -ms-box-ordinal-group: 1;\n\
    box-ordinal-group: 1; }\n\
  .raptor-dock-docked-to-element-wrapper .raptor-wrapper .raptor-toolbar .ui-widget-header {\n\
    border-top: 0;\n\
    border-left: 0;\n\
    border-right: 0; }\n\
  .raptor-dock-docked-to-element-wrapper .raptor-wrapper .raptor-path {\n\
    border: 0 none;\n\
    margin: 0;\n\
    -webkit-box-ordinal-group: 3;\n\
    -moz-box-ordinal-group: 3;\n\
    -ms-box-ordinal-group: 3;\n\
    box-ordinal-group: 3;\n\
    -webkit-border-radius: 0;\n\
    -moz-border-radius: 0;\n\
    -ms-border-radius: 0;\n\
    -o-border-radius: 0;\n\
    border-radius: 0; }\n\
  .raptor-dock-docked-to-element-wrapper .raptor-wrapper .raptor-messages {\n\
    margin: 0; }\n\
\n\
.raptor-dock-docked-element {\n\
  /* Override margin so toolbars sit flush next to element */\n\
  margin: 0 !important;\n\
  display: block;\n\
  z-index: 1;\n\
  position: relative !important;\n\
  top: auto !important;\n\
  left: auto !important;\n\
  border: 0 none;\n\
  padding: 0;\n\
  margin: 0;\n\
  z-index: auto;\n\
  width: 100%;\n\
  font-size: inherit;\n\
  color: inherit;\n\
  font-family: inherit;\n\
  float: none;\n\
  width: auto;\n\
  -webkit-box-ordinal-group: 2;\n\
  -moz-box-ordinal-group: 2;\n\
  -ms-box-ordinal-group: 2;\n\
  box-ordinal-group: 2; }\n\
\n\
/**\n\
 * Messages\n\
 */\n\
.raptor-dock-docked .raptor-messages {\n\
  position: fixed;\n\
  top: 0;\n\
  left: 50%;\n\
  margin: 0 -400px 10px;\n\
  padding: 0;\n\
  text-align: left; }\n\
  .raptor-dock-docked .raptor-messages .raptor-message-wrapper {\n\
    width: 800px; }\n\
  .raptor-dock-docked .raptor-messages .raptor-message-wrapper:first-child {\n\
    -moz-border-radius-topright: 0;\n\
    -webkit-border-top-right-radius: 0;\n\
    border-top-right-radius: 0;\n\
    -moz-border-radius-topleft: 0;\n\
    -webkit-border-top-left-radius: 0;\n\
    border-top-left-radius: 0; }\n\
\n\
/**\n\
 * Embed plugin\n\
 *\n\
 * @author David Neilsen <david@panmedia.co.nz>\n\
 */\n\
.raptor-ui-embed .ui-icon {\n\
  filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=85);\n\
  opacity: 0.85;\n\
  background: url(\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAxlBMVEX////////fNzfaMTHVLCzKISHFGxvvR0flPDzpSEjdMTH4Y2PaKyvtTk7PJibXIyOnLi7lQECkKyvSHR3mPj6eJCSUGhqRFxfqQkL0XFziOTmOFBSBBwehKCiHDQ3PFRWaISGXHR3wVlaECgqqMTGLEBDGHR365eW1ICDaXFz139/LDg7NLi6tNDTSKSnMNzd9AwP1TEy/Fhbwxsbqv7+7EhKzFBS6EBDonZ3akJDkhISxBwf8a2vLIiLPcHD88fH67+/fYGAnLmvBAAAAAXRSTlMAQObYZgAAAJtJREFUeF5Vx0WShFAUBMB631F3afdxd7v/pQaiN5C7BK4mgM3nxAahczfihIgrrfVTqs+qGN2qLMvHwy4tB6sOmWeMIXp7/jI9L8PCYowR0e/3xzVj1gLLiHNOg9OR82iJvBZC0GD/J0Sdo7B93+/78+737AKNK6Uker2UA7fBNlBKPdyos2CLWXI/ksywnr+MzNdoLyZa4HYC/3EAHWTN0A0YAAAAAElFTkSuQmCC\') 0 0; }\n\
\n\
.raptor-ui-embed:hover .ui-icon {\n\
  filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=100);\n\
  opacity: 1; }\n\
\n\
.raptor-ui-embed-panel-tabs {\n\
  display: -webkit-box;\n\
  display: -moz-box;\n\
  display: -ms-box;\n\
  display: box;\n\
  -webkit-box-orient: vertical;\n\
  -moz-box-orient: vertical;\n\
  -ms-box-orient: vertical;\n\
  box-orient: vertical;\n\
  height: 100%;\n\
  width: 100%; }\n\
  .raptor-ui-embed-panel-tabs .raptor-ui-embed-code-tab,\n\
  .raptor-ui-embed-panel-tabs .raptor-ui-embed-preview-tab {\n\
    display: -webkit-box;\n\
    display: -moz-box;\n\
    display: -ms-box;\n\
    display: box;\n\
    -webkit-box-orient: vertical;\n\
    -moz-box-orient: vertical;\n\
    -ms-box-orient: vertical;\n\
    box-orient: vertical;\n\
    -webkit-box-flex: 1;\n\
    -moz-box-flex: 1;\n\
    -ms-box-flex: 1;\n\
    box-flex: 1;\n\
    -webkit-box-sizing: border-box;\n\
    -moz-box-sizing: border-box;\n\
    box-sizing: border-box; }\n\
    .raptor-ui-embed-panel-tabs .raptor-ui-embed-code-tab p,\n\
    .raptor-ui-embed-panel-tabs .raptor-ui-embed-preview-tab p {\n\
      padding-top: 10px; }\n\
    .raptor-ui-embed-panel-tabs .raptor-ui-embed-code-tab textarea,\n\
    .raptor-ui-embed-panel-tabs .raptor-ui-embed-preview-tab textarea {\n\
      display: -webkit-box;\n\
      display: -moz-box;\n\
      display: -ms-box;\n\
      display: box;\n\
      -webkit-box-flex: 4;\n\
      -moz-box-flex: 4;\n\
      -ms-box-flex: 4;\n\
      box-flex: 4; }\n\
\n\
/**\n\
 * Float block plugin\n\
 *\n\
 * @author David Neilsen <david@panmedia.co.nz>\n\
 */\n\
.raptor-ui-float-left .ui-icon {\n\
  filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=85);\n\
  opacity: 0.85;\n\
  background: url(\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAS5JREFUeNpi/P//PwMlgImBQsACY1zaIH4A6Bp7dAUzV31jnLHy22YgkxFqIQhf/vfvXymKAQ8eidtra35lYAQqY+FgZWBmZ2X49fk7AxvbX6DsN1+CLlgwn5khMECAwcLiL4OogiIDj6QEw9uLZ4AGfAVJ70BzAQg7ohigrnaP4cEDLoY3bzkYzL6/ZVA34ma4ev07w/sPv0HSHgRdoKICUvgR6IWPDK8evWb49+8iw/1bfxhevwYbsBfNdhC2BkkwwqLRxRhuFgM3HyMDrwAjw8vH/xj2nvuH1WZgIDKgGMDExLQNiz9xYWagASboBpAU/zAXsCCJ7SbCZjaghexAmgOIFUh2AXKyh7GRXTARiI2w2MoKVMwBtRVkOysQHwNiPxQXDFhmotgAgAADAKYzbYynfqX2AAAAAElFTkSuQmCC\') 0 0; }\n\
\n\
.raptor-ui-float-left:hover .ui-icon {\n\
  filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=100);\n\
  opacity: 1; }\n\
\n\
.raptor-ui-float-none .ui-icon {\n\
  filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=85);\n\
  opacity: 0.85;\n\
  background: url(\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAkFBMVEUAAAABAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEAAAABAQEAAADRrxbRsBYBAQEBAQEBAQEBAQEBAQEBAQEBAQEAAAAAAAAAAACcegnCrQ6ffgqukQv+/GixkS3duyLhwyfkyizevSNRMDCigDLauC/y41DcuiLrzTTQrhWCYBiObSDErz3r4VvApCt4Vg6dewnDaH3NAAAAGHRSTlMAycfDxcu9v8HYu+DAwIm3uZnRkdDn7LIyy/h+AAAAWklEQVR4Xp2KRwqFMBQAYzfGXmPtvfx//9spgvAWQcRZzgx6gz6dGEDkQ1FWNRBN2/XZCMRvXtZtB4LSfxon6AHTsjVZUQWR5xz2cWfJxYR9eFf2MQnCCH3hAIfwBUXJe8YuAAAAAElFTkSuQmCC\') 0 0; }\n\
\n\
.raptor-ui-float-none:hover .ui-icon {\n\
  filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=100);\n\
  opacity: 1; }\n\
\n\
.raptor-ui-float-right .ui-icon {\n\
  filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=85);\n\
  opacity: 0.85;\n\
  background: url(\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAS1JREFUeNpi/P//PwMlgImBQsACN4mJqRFIaQExIxQzZYRzBaaHcWE4kZGJ8aCe/0sHFAOAoB5d4avXfAwPH4swaGt+ZWAEGsnCwcrAzM7K8Ovzd3sMFwDBWpjNMPrK5b++C94yMwQGCDBYWPxlEFVQZOCRlGB4e/EMAzYDgtFdICr6kUFd7QfDgwdcDG/ecjCYfX/LoG7EzXD1+ncGeyNMAzYiuQDsCmHhf54qKr+BzI9AL3xkePXoNcO/fxcZ7t/6wwDzAyMsGoGBiDWUnQwR4tx8jAy8AowMLx//Y9h95g+GAdvQXIAPM//798+EKBfgAkADMMJgNxE2swEtZAfSHECsQLILkJM9jI3sgolAbITFVlagYg6orSDbWYH4GBD7obhgwDITxQYABBgAdBpg+9sXURwAAAAASUVORK5CYII=\') 0 0; }\n\
\n\
.raptor-ui-float-right:hover .ui-icon- {\n\
  filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=100);\n\
  opacity: 1; }\n\
\n\
/**\n\
 * Show guides plugin\n\
 *\n\
 * @author David Neilsen <david@panmedia.co.nz>\n\
 */\n\
.raptor-ui-guides .ui-icon {\n\
  filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=85);\n\
  opacity: 0.85;\n\
  background: url(\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAHZJREFUeNpi/P//PwNFAGQAIyMjDK9BYqNgXHqZ0MSYcFmEyxBGsClMTGS5+t+/fxg2biLGAGTXoBvATGoYkuUFGMDmhd2kGjL4vHCUUi9cIjcpnwPi2UAsBaXPQZPwOXxscD5Cy0xLSbUc3YDnJLue0uwMEGAA2O1APJOrHFQAAAAASUVORK5CYII=\') 0 0; }\n\
\n\
.raptor-ui-guides:hover .ui-icon {\n\
  filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=100);\n\
  opacity: 1; }\n\
\n\
.raptor-ui-guides-visible * {\n\
  outline: 1px dashed rgba(0, 0, 0, 0.5); }\n\
\n\
/**\n\
 * History plugin\n\
 *\n\
 * @author David Neilsen <david@panmedia.co.nz>\n\
 */\n\
.raptor-ui-history-undo .ui-icon {\n\
  filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=85);\n\
  opacity: 0.85;\n\
  background: url(\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAe1JREFUeNrEUzFrFEEU/mazu7d3x8U9g0ROwkHEwrSrNmksJBxok1RRwUIEz0awFStZoqQw5B9ok1jYiRDBwl4PSaFJVLCMMfHWS7zb3ZndGd9ssgdXiVzhwGNnH+/75n3vm2FKKQyzDAy5zKmHLRSKRdiOA6tQgGlZDcrPUme3dcFBEPSLlZQQcZyFTFN8WZiGOUCnVCMRws9/4zD8BwkEFpz7N66c8vQJUbeLNEn+LuEQqxo8jv0716e8/f0UPIp0+n1OTbFLsUF1z+n7boAgA0eRf/em521tdeE4BuYunfa0OYehEMUJ3wt6Fza+7s4EkVwh3DJFLyPgYejfa0576+u/MsZe70g/tX8QRujSHDgXtpTpmOvarkjYrZ97Qg/xUTYDOv3B46U3rcnJMqRUUKaBtsXwzWDYJmfax1y0x07gx/FxfLbckd+1Wj0dYddI8vlcwhp1gcUnr/z55mXvbcfA99WXrVwjMwzGHNs0yiWbVSpFXqtVMTFxkrU+zOt55ENc04N7tvTCP9O86mn76D6cIzDSODYRhhUEnXFguy4/bs6gWr1IubN9F3KShHN8Wn6a3QNtZaFU0lvtZXAUm1LK13Jn5z7Vzw0Q9EmE0NvZDNnpoDw6OuC7voFUs0C19Uzif39MQxP8EWAA91//GdkHdYEAAAAASUVORK5CYII=\') 0 0; }\n\
\n\
.raptor-ui-history-undo:hover .ui-icon {\n\
  filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=100);\n\
  opacity: 1; }\n\
\n\
.raptor-ui-history-redo .ui-icon {\n\
  filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=85);\n\
  opacity: 0.85;\n\
  background: url(\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAd9JREFUeNrEU89LG0EUfjP7KyvEGsRorRhoySGCuSyht0IPgicFQZCcvXsvHoP/Q8FDKZRCpQityKIHvZT2YI6t6MUfCJqQKpt1d7Ozu7N9O9vWhIIUcvDBt/OY4X3z3vfNkjiOoZ+g0GfIyaf46gtQSQJF0wQIvePN5nJiJYS8xmUzDAIz8H1gnQ74npcS3BeubYOm60lqCKQjm/89QhSG0HEcSG6tzo4bAWM1JJntGaE7UNQKcL6EaQkxknQfcS6Imk0GizOTxrvPx7Xf4pvdBAOc85VBnVTLU6OPhx8NZBVZUjmPIYpStNsMGo0I5l8+NT5sfxckggCFAYrFzyaHlo1yoYDdSs2WD9e2A/atC4wFooMkJBT79EqBF88Lxu7eYU0QMN+v5Eey1enSRKF1y6ULFoKFAFUDntMgwpsiDuAEMbgBhydDKmxtH9TRmdWUwPOWSsXi2Fmr7RyfNG6sa9vzbI+FHT+MI3730hbmjIwEcLTxSRSrup5qgH6Wvn39cd76ae9TSndw6wzRQNiSooQxiohjHij4Pqy379PiTMb86wJalL+6ZB+pLK9RSv+x0XddkQfrb9K2VdXssRHZk4M1mRDc6XXWsaw/aT15ibKimN3n5MF/pr4JfgkwANDA599q/NhJAAAAAElFTkSuQmCC\') 0 0; }\n\
\n\
.raptor-ui-history-redo:hover .ui-icon {\n\
  filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=100);\n\
  opacity: 1; }\n\
\n\
/**\n\
 * Horizontal rule plugin\n\
 *\n\
 * @author David Neilsen <david@panmedia.co.nz>\n\
 */\n\
.raptor-ui-hr-create .ui-icon {\n\
  filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=85);\n\
  opacity: 0.85;\n\
  background: url(\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAXhJREFUeNpi/P//PwMTExMDEmgEYi0gZsSCrwJxNUzhv3//GBixGEA0ABnAgkV8LZqtTFDaF6aAX8KCwdBrA4QDckFq+1sGSUVrBkZGRqKwvEEhg2PyS7BeuAv07AsZXjw4BmJuQLIV5gImJLYrv7g53LlwA8TkLRgCi28wXDzQF/Dr10+G379/M/z58wfoz/9gfUxMrAzMzGwMsnr5DBwcvBgGHABiexBDyTiV4cuXTwxfv35j+PHjB9CQ/0BnszCwsHAysLHxIofVQSB2gBlgnxogAqREiI6B+ikf7ZFdcHD2hjf2X79+Zfj8+TNeF7Cz84K9wMrKdRDZAAcQ8fbJaYYndw4zYAsDHlFjBjZxKwyXwAPx1cMTDIdWxoKY+5BCHo7f31tp8VM9iUFQ0oaBQ9YBYQIoLo1dygmmA2QgIGHJoGhUCtaLLSkfweICVqA6diDNAcQKyJYTlRdAanCJY8sL04HYFM3WM0Acgs0QRlymEwsAAgwAwwCYinucCRoAAAAASUVORK5CYII=\') 0 0; }\n\
\n\
.raptor-ui-hr-create:hover .ui-icon-hr {\n\
  filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=100);\n\
  opacity: 1; }\n\
\n\
/**\n\
 * Internationalisation plugin\n\
 *\n\
 * @author Michael Robinson <michael@panmedia.co.nz>\n\
 * @author David Neilsen <david@panmedia.co.nz>\n\
 */\n\
.raptor-wrapper .raptor-i18n-select {\n\
  height: 23px;\n\
  top: -8px;\n\
  text-align: left; }\n\
\n\
.raptor-wrapper .raptor-i18n-select .raptor-selectmenu-status {\n\
  font-size: 13px;\n\
  line-height: 10px; }\n\
\n\
.raptor-selectmenu-menu li a, .raptor-selectmenu-status {\n\
  line-height: 12px; }\n\
\n\
.raptor-wrapper .raptor-i18n-select .raptor-selectmenu-item-icon {\n\
  height: 24px;\n\
  width: 24px; }\n\
\n\
.raptor-selectmenu-menu .ui-icon.raptor-i18n-en,\n\
.raptor-wrapper .ui-icon.raptor-i18n-en {\n\
  background: url(\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAALCAIAAAD5gJpuAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAflJREFUeNpinDRzn5qN3uFDt16+YWBg+Pv339+KGN0rbVP+//2rW5tf0Hfy/2+mr99+yKpyOl3Ydt8njEWIn8f9zj639NC7j78eP//8739GVUUhNUNuhl8//ysKeZrJ/v7z10Zb2PTQTIY1XZO2Xmfad+f7XgkXxuUrVB6cjPVXef78JyMjA8PFuwyX7gAZj97+T2e9o3d4BWNp84K1NzubTjAB3fH0+fv6N3qP/ir9bW6ozNQCijB8/8zw/TuQ7r4/ndvN5mZgkpPXiis3Pv34+ZPh5t23//79Rwehof/9/NDEgMrOXHvJcrllgpoRN8PFOwy/fzP8+gUlgZI/f/5xcPj/69e/37//AUX+/mXRkN555gsOG2xt/5hZQMwF4r9///75++f3nz8nr75gSms82jfvQnT6zqvXPjC8e/srJQHo9P9fvwNtAHmG4f8zZ6dDc3bIyM2LTNlsbtfM9OPHH3FhtqUz3eXX9H+cOy9ZMB2o6t/Pn0DHMPz/b+2wXGTvPlPGFxdcD+mZyjP8+8MUE6sa7a/xo6Pykn1s4zdzIZ6///8zMGpKM2pKAB0jqy4UE7/msKat6Jw5mafrsxNtWZ6/fjvNLW29qv25pQd///n+5+/fxDDVbcc//P/zx/36m5Ub9zL8+7t66yEROcHK7q5bldMBAgwADcRBCuVLfoEAAAAASUVORK5CYII=\') 0 0; }\n\
\n\
.raptor-selectmenu-menu .ui-icon.raptor-i18n-zh_CN,\n\
.raptor-wrapper .ui-icon.raptor-i18n-zh_CN {\n\
  background: url(\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAALCAIAAAD5gJpuAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAFqSURBVHjaYrzOwPAPjJgYQEDAleHVbhADIvgHLPgHiQ0QQCxAlkR9NW8sw+cV/1gV/7Gb/hV4+vfzhj8Mv/78//Pn/+/f/8AkhH1t0yaAAAJp4I37zyz2lDfu79uqv/++/WYz+cuq/vvLxt8gdb+A5K9/v34B2SyyskBLAAII5JAva/7/+/z367a/f3/8ZuT9+//Pr78vQUrB6n4CSSj6/RuoASCAWEDO/fD3ddEfhv9/OE3/sKj8/n7k9/fDQNUIs/+DVf8HawAIIJCT/v38C3Hr95N/GDh/f94AVvT7N8RUBpjxQAVADQABBNLw/y/Ifwy/f/399ufTOpDBEPf8g5sN0QBEDAwAAQTWABEChgOSA9BVA00E2wAQQCANQBbEif/AzoCqgLkbbBYwWP/+//sXqBYggFhAkfL7D7OkJFCOCSj65zfUeFjwg8z++/ffX5AGoGKAAGI8jhSRyIw/SJH9D4aAYQoQYAA6rnMw1jU2vQAAAABJRU5ErkJggg==\') 0 0; }\n\
\n\
/**\n\
 * Image resize plugin\n\
 *\n\
 * @author Michael Robinson <michael@panmedia.co.nz>\n\
 * @author David Neilsen <david@panmedia.co.nz>\n\
 */\n\
.raptor-image-resize-in-progress {\n\
  outline: 1px dashed rgba(0, 0, 0, 0.5); }\n\
\n\
/**\n\
 * Statistics plugin\n\
 *\n\
 * @author David Neilsen <david@panmedia.co.nz>\n\
 * @author Micharl Robinson <michael@panmedia.co.nz>\n\
 */\n\
.raptor-ui-statistics .ui-icon {\n\
  filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=85);\n\
  opacity: 0.85;\n\
  background: url(\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAhFJREFUeNrEk7tv01AUxr/4kcRO7Fh1HghFgSAeYglDlIfUbGEBhaWoUxFiQWJGMDDyhzB2ZmANYmAoIvQPaIHIkVJjKyWkcdzYSR1zbhSGQhFDB47007333PN9V/cVCcMQ5wkO54wIxe+5q8Rt4gaRW+VsYo9oE1/+ZpAktjKZzL1arXatWCzmFEVhOYzH40m327U7nc7nwWDwhlLbxITN8SsDVvisXq9vtVqtuqZp2XK5HDcMg5vNZlylUon7vq+XSqXLi8WiYJqmTvWfiNkvg8e06gMqLDmOI5AIvV4P8/l8CeuzHMHn8/kcmeiWZQWk6zCD67quP280GuXNdlv4qKrwTk6WwpXoFNVqNTKdTtf6/X7C87wPzOAhrX4nCIK195KEp4aBtxyHKRm4roujozGdwQSO49LYx/7+VzIPeVEUOcsyh+wab9Ge0+SKGW3nhSzj5WiEoWlhMvHolKOIRmVIkgpZVhGPKxAEGdlsIc20zOASz/NSs9lkl4IwJuOJH+CVksDi2APPx0iYIgNlCTNYXy8hmdQkpmUGCfag2u134DgJipKGdqGAR6NjbKdVOAMbQRAiRsaCEKMaHru7XdYutRw95R+Hh0NXVTNIpXQy0KDrOVy8chOb34Z4XcjCMvZoO86p12bbBy7Tsv5dYoc4OAtFFM3BxkZ4xtzOSvvPuE98X7V//oX//ht/CjAAagzmsnB4V5cAAAAASUVORK5CYII=\') 0 0; }\n\
\n\
.raptor-ui-statistics:hover .ui-icon {\n\
  filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=100);\n\
  opacity: 1; }\n\
\n\
/**\n\
 * Link plugin\n\
 *\n\
 * @author Michael Robinson <michael@panmedia.co.nz>\n\
 * @author David Neilsen <david@panmedia.co.nz>\n\
 */\n\
.raptor-ui-link-create .ui-icon {\n\
  filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=85);\n\
  opacity: 0.85;\n\
  background: url(\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAilBMVEX///8EBARUVFRUVFQEBARTU1MqKiwfHx5MTEzGxsZNTU1FRUWAgH8SEhJnZ2fd3d06Ojrg4ODIyMgODg4DAwMSEhLCwsGcnKXExNEvLy+ysrh+foMQEBBBQUEEBATJydeenqcDAwPT09OIiIjj4+OZmZl3d3fU1OPCwsHW1tXq6urr6+va2trGxsaRnmwcAAAAI3RSTlMAimdfRTOWgDXbAGXFj339cv3dAHtC3OP8bt+2cnuA/OMA+Akct2IAAABoSURBVHhetcVZFoIgGAbQ7wcVwyEKtBi01OZh/9urw2EJdV8ufkHmnDHG85RE2a7Wp812GGJtiaqvG1rOXws1dV9BzWKi2/3xfL1pErOCdT6YS2SCdxZdsdtfD8ci1UFnIxGNWUrjHz6V6QhqNdQf6wAAAABJRU5ErkJggg==\') 0 0; }\n\
\n\
.raptor-ui-link-create:hover .ui-icon {\n\
  filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=100);\n\
  opacity: 1; }\n\
\n\
.raptor-ui-link-remove .ui-icon {\n\
  filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=85);\n\
  opacity: 0.85;\n\
  background: url(\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAA2FBMVEX///8WFhYvLy9LS0sEBAQODg4EBARNTU0DAwNVVVVUVFQtLS1nZ2cfHx46OjoSEhLGxsZTU1OAgH/T09NUVFQEBAQ6OjpMTEwvLy+4uMDCwsEQEBCvr7sSEhIEBAR+foMqKixFRUUEBARDQ0MBAQEBAQG5ucQiIiICAgIODg7Z2dlAQEBMTEwsLCxGRkYAAABPT0/e3t4mJiYqKiopKSlUVFQiIiJJSUkjIyNFRUU5OTkBAQEoKCi/v8zCws+qgFWFZkY7MSbc3Nzj4+Pm5ubOztzU1OTQ0N6IE/7FAAAAQ3RSTlMAAAAAigAAAAAAZwB9gACP2zPF+F9ocjVu39xy40KAtpZlRQBrUPx9AIb8AE8AAAAA/AAAAAAAAAAAAAAA/PwAAAD8PWHlxQAAALtJREFUeF5dzsVWxEAQheHqpGPEPeMWGXfcmQHe/42oC+ewmH95F1UfGWFyhZLQUBHlTvBxOp92gZP/DaN25Esp/ag9ukeUxa5p6qbpxpmHqGgNOtWm6gxahaIokwX1ht16ps3q7rAn9utrg7RxX6Z6KvtjbWJZGHTuuLLtw8P2f/CAWd4uGYNBqCpj5s1NM2cMPd3xc2D4EDDkIWCmj1NgSEHAlGUJDAnEmOfPr+8XxtDr27sQwHDA0GU/2RcVwEV78WkAAAAASUVORK5CYII=\') 0 0; }\n\
\n\
.raptor-ui-link-remove:hover .ui-icon {\n\
  filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=100);\n\
  opacity: 1; }\n\
\n\
/* Dialog */\n\
.raptor-ui-link-panel .raptor-ui-link-menu {\n\
  height: 100%;\n\
  width: 200px;\n\
  float: left;\n\
  border-right: 1px dashed #D4D4D4;\n\
  display: -webkit-box;\n\
  display: -moz-box;\n\
  display: -ms-box;\n\
  display: box;\n\
  -webkit-box-orient: vertical;\n\
  -moz-box-orient: vertical;\n\
  -ms-box-orient: vertical;\n\
  box-orient: vertical; }\n\
  .raptor-ui-link-panel .raptor-ui-link-menu p {\n\
    font-weight: bold;\n\
    margin: 12px 0 8px; }\n\
  .raptor-ui-link-panel .raptor-ui-link-menu fieldset {\n\
    -webkit-box-flex: 2;\n\
    -moz-box-flex: 2;\n\
    -ms-box-flex: 2;\n\
    box-flex: 2;\n\
    margin: 2px 4px;\n\
    padding: 7px 4px;\n\
    font-size: 13px; }\n\
    .raptor-ui-link-panel .raptor-ui-link-menu fieldset label {\n\
      display: block;\n\
      margin-bottom: 10px; }\n\
      .raptor-ui-link-panel .raptor-ui-link-menu fieldset label span {\n\
        display: inline-block;\n\
        width: 150px;\n\
        font-size: 13px;\n\
        vertical-align: top; }\n\
\n\
.raptor-ui-link-panel .raptor-ui-link-menu fieldset,\n\
.raptor-ui-link-panel .raptor-ui-link-wrap fieldset {\n\
  border: none; }\n\
\n\
.raptor-ui-link-panel .raptor-ui-link-wrap {\n\
  margin-left: 200px;\n\
  padding-left: 20px;\n\
  min-height: 200px;\n\
  position: relative; }\n\
  .raptor-ui-link-panel .raptor-ui-link-wrap.raptor-ui-link-loading:after {\n\
    content: \'Loading...\';\n\
    position: absolute;\n\
    top: 60px;\n\
    left: 200px;\n\
    padding-left: 20px;\n\
    background: url(\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAOXRFWHRTb2Z0d2FyZQBBbmltYXRlZCBQTkcgQ3JlYXRvciB2MS42LjIgKHd3dy5waHBjbGFzc2VzLm9yZyl0zchKAAAAOnRFWHRUZWNobmljYWwgaW5mb3JtYXRpb25zADUuMi4xNzsgYnVuZGxlZCAoMi4wLjM0IGNvbXBhdGlibGUpCBSqhQAAAAhhY1RMAAAACAAAAAC5PYvRAAAAGmZjVEwAAAAAAAAAEAAAABAAAAAAAAAAAAA8A+gAAIIkGDIAAACsSURBVDiNtZLBCcMwDEUfJgOUjhAyQsmp9FA8TgfISj6F4gl66jSdIIf00G9wnLjYKf3w0Qch6Us2fMdVLMYx0haYRZsrMJEegZdiDj3gFFeT54jBiU2mO+XdVvdRyV0OYidVMEAH3AEPHGoboMKwuy+seYqLV9iNTpM90P7S6AQMitXogYnPHSbyz2SAC9HqQVigkW7If90z8FAsctCyvMvKQdpkSOzfxP/hDd++JCi8XmbFAAAAGmZjVEwAAAABAAAAEAAAABAAAAAAAAAAAAA8A+gAABlX8uYAAAC3ZmRBVAAAAAI4jaWQsQ3CQBAEB4cECFGCI1fiAlyFKwARWgSIeqjCNTh0gIjIkBw9gffFSfz74VlpdX/W3Xr3YBmlmIUSmMSoSGHee+CmGsMGaFU/cAecqnVh/95qpg0J/O0gCytgDRzUX4DnryIn5lwO6L7c6fxskRhMwkc4qj+TEcFjC9SqWcsj8x3GhMgu9LHmfUinvgKuYmWWp5BIyEFvBPuUAy9ibzAYgWEhUhQN8BCb2NALKY4q8wCrG7AAAAAaZmNUTAAAAAMAAAAQAAAAEAAAAAAAAAAAADwD6AAA9MEhDwAAAKhmZEFUAAAABDiNY2CgMTgNxTgBExLbh4GB4SCUxgeMcEkcZmBg+A+lcQETqBoTbJI+UM1ku4AiEATFZIEQBoi//kPZxIAAKEaJBYpACAm24wUSBORVGBgYUqA0BtjKAAmHrXg0f4aq+YxuiAQDIiD/Q/k8DAwMdVDMw8DAkIamJo2QCyYjKZ4MtfErlP8VlzeQw2AlkgErkbyBMwzQgRoDA8N+KMapAQDdvyovpG6D8gAAABpmY1RMAAAABQAAABAAAAAQAAAAAAAAAAAAPAPoAAAZC1N1AAAAsWZkQVQAAAAGOI21kkEOgjAURF9YGBbGtYcwLowrwxk8BMcg3XACD9djGJaujKmLTkMRCiXEl0ympYX8+Xz4M62UpIjWR8DI59inDgzg5CkOwEs+YnMFmzhJOdwAK1UAZ+ANfLRewuJ75QAb/kKRvp/HmggVPxHWsAMu8hEN8JRPUdLnt9oP6HTYRc/uEsCVvnlO+wFGFYRJrKPLdU4FU5HCB0KsEt+DxZfBj+xDSo7vF9AbJ9PxYV81AAAAGmZjVEwAAAAHAAAAEAAAABAAAAAAAAAAAAA8A+gAAPSdgJwAAADDZmRBVAAAAAg4jaWSTQrCMBCFP6NIT5AjCF6gJ6jbUnoCL1biDTyF5AAueoZu3LkSrAtHTEJiIn3wmCTz92YILMQ64++BPTDKXQMH4AbcAZQTvAEasTFo4AqcxeowoAFmsSk1s8M+DChRMEnyFFNQAg10sWSFv49cESPUn+RRWFLE8N2DKe2axaIR/sU25eiAi9gUBt6zDzGnFad13nZCgAr/I1UxBdZRUAMPYV2iIETrdGudd28Hqx8FFHCU8wl4xoJeZnUrSRiyCSsAAAAaZmNUTAAAAAkAAAAQAAAAEAAAAAAAAAAAADwD6AAAGe6xwAAAALtmZEFUAAAACjiNpZJBCsIwEEWfpUsPULoSl55Beh4J7nqCHkDceR3pIaSr4Ak8Qq2L/khomlrig+FPhszwJy3EqYCHolq4F6UDBkWnWgbspN+CT7EwMAPuwFM67aUAem/IdIW952jQOeCXg1bN7ZyDNQRvsEkYkgNG+S1XcpHWKwacgatzlLLH2z/8vUJCf5wSaKQxToCVBjSM37jxaluFw+qOXeOgBF4KVzNqNkH3DAfGX7tXnsRREeUD4f8lQGjw+ycAAAAaZmNUTAAAAAsAAAAQAAAAEAAAAAAAAAAAADwD6AAA9HhiKQAAAJ9mZEFUAAAADDiNtZDLCcMwEEQfIUcXoDpCKgg6qIRUEtKB6wg6poDgalyFTj7YBw+2QyRlCc6DYVm0n9FCGQc8JFepWzgBN0WACIxS/NZ8BgYVD8pzA1ogKb5x3xSPyp0a4+YLSe/J4iBH0QF83uCvXKSFq2TBs97KH/Y1ZsdL+3IEgmJt86u0PTAfJlQGdKrprA6ekslBjl76mUYqMgFhpStJaQVr0gAAABpmY1RMAAAADQAAABAAAAAQAAAAAAAAAAAAPAPoAAAZshBTAAAAu2ZkQVQAAAAOOI21kCEOwkAQRR8rKkkFCtmjkJ4ARTgBArViT4LjLJwBgUZUr8NBQlrR38Am3XYEvOTnT7PzuzO7IE8BHFWfgNdELwBLYCMH8EAr+VzIyUvgBlzkZaZ/D1zlCfXXba2+C93sVaNwK08ogUaHzcQEu9wE0O9e83kDEw7YAhG4K/ww5CoJFB52j8bwU6rcTLOJYYWo2kKywk9Zz5yvgCAfDb9nfhLoHztYJzhIpgnGOEv/owMnkSfarUXVlAAAAABJRU5ErkJggg==\') no-repeat left center; }\n\
  .raptor-ui-link-panel .raptor-ui-link-wrap h2 {\n\
    margin: 10px 0 0; }\n\
  .raptor-ui-link-panel .raptor-ui-link-wrap fieldset {\n\
    margin: 2px 4px;\n\
    padding: 7px 4px;\n\
    font-size: 13px; }\n\
    .raptor-ui-link-panel .raptor-ui-link-wrap fieldset input[type=text] {\n\
      width: 400px; }\n\
    .raptor-ui-link-panel .raptor-ui-link-wrap fieldset.raptor-external-href {\n\
      width: 365px; }\n\
    .raptor-ui-link-panel .raptor-ui-link-wrap fieldset.raptor-ui-link-email label {\n\
      display: inline-block;\n\
      width: 115px; }\n\
    .raptor-ui-link-panel .raptor-ui-link-wrap fieldset.raptor-ui-link-email input {\n\
      width: 340px; }\n\
  .raptor-ui-link-panel .raptor-ui-link-wrap ol li {\n\
    list-style: decimal inside; }\n\
\n\
.raptor-ui-link-panel .raptor-ui-link-wrap\n\
.raptor-ui-link-panel .raptor-ui-link-wrap fieldset #raptor-ui-link-external-target {\n\
  vertical-align: middle; }\n\
\n\
.raptor-ui-link-error-message div {\n\
  padding: 0 .7em; }\n\
  .raptor-ui-link-error-message div p {\n\
    margin: 0; }\n\
    .raptor-ui-link-error-message div p .ui-icon {\n\
      margin-top: 2px;\n\
      float: left;\n\
      margin-right: 2px; }\n\
\n\
/**\n\
 * List plugin\n\
 *\n\
 * @author David Neilsen <david@panmedia.co.nz>\n\
 */\n\
.raptor-ui-list-unordered .ui-icon-list-unordered {\n\
  filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=85);\n\
  opacity: 0.85;\n\
  background: url(\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAMlJREFUeNpi/P//PwNFAGQAIyNjGBCvgdIMxGKQXhaoORFlZWWBXV1dTED2KqjYGiBmRMJMaOwrQFwOc0EEEG+A0iS5gBFEMDExkeX9f//+MTAxUAhgBsQC8U4oTRKABWJ8Rkae84wZk5iB7MVQsW1IAYYLW8MCMRGID0Bp+gYiC46EhTPR4QrEdCA+A6VJT8pAcDMsLB3EuAniQP14BIiPAfEJID4FxGehqe8OED8B4vVgvVADioH4GZTGGWhYvUtpbqQ4JQIEGABjeFYu055ToAAAAABJRU5ErkJggg==\') 0 0; }\n\
\n\
.raptor-ui-list-unordered:hover .ui-icon-list-unordered {\n\
  filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=100);\n\
  opacity: 1; }\n\
\n\
.raptor-ui-list-ordered .ui-icon-list-ordered {\n\
  filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=85);\n\
  opacity: 0.85;\n\
  background: url(\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAM1JREFUeNpi/P//PwNFAGQAIyNjIxCvAWJBIGYgFoP0skDNqQfidUDMiGT2GigfhpnQ2FeAuJwFSQMTmuNCiPEBTFMblF1CahAwgvzBxMREVvj9+/cP7oIuIN4Bpcl2gRMQJwFxDFRuG1KAYcVAF1jDojEBiGcAsQSp0QjzgiEQawLxSiibNoGInmqRE9J0IJaEYnNSXAAzYC4QNwJxIJLcEbRAYwZidiDmgOLTYPVIzgJpPgD2F45Aw+olqAFrgfg5EBeTagAjpdkZIMAAg/ZGwsH5qkAAAAAASUVORK5CYII=\') 0 0; }\n\
\n\
.raptor-ui-list-ordered:hover .ui-icon-list-ordered {\n\
  filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=100);\n\
  opacity: 1; }\n\
\n\
/**\n\
 * Paste plugin\n\
 *\n\
 * @author David Neilsen <david@panmedia.co.nz>\n\
 * @author Michael Robinson <michael@panmedia.co.nz>\n\
 */\n\
.raptor-paste-panel-tabs {\n\
  height: 100%;\n\
  width: 100%;\n\
  -webkit-box-sizing: border-box;\n\
  -moz-box-sizing: border-box;\n\
  box-sizing: border-box; }\n\
\n\
.raptor-paste .ui-tabs a {\n\
  outline: none; }\n\
\n\
.raptor-paste-panel-tabs {\n\
  position: relative;\n\
  display: -webkit-box;\n\
  display: -moz-box;\n\
  display: -ms-box;\n\
  display: box;\n\
  -webkit-box-orient: vertical;\n\
  -moz-box-orient: vertical;\n\
  -ms-box-orient: vertical;\n\
  box-orient: vertical; }\n\
\n\
.raptor-paste-panel-tabs > div {\n\
  overflow: auto;\n\
  display: -webkit-box;\n\
  display: -moz-box;\n\
  display: -ms-box;\n\
  display: box;\n\
  -webkit-box-flex: 1;\n\
  -moz-box-flex: 1;\n\
  -ms-box-flex: 1;\n\
  box-flex: 1;\n\
  -webkit-box-orient: vertical;\n\
  -moz-box-orient: vertical;\n\
  -ms-box-orient: vertical;\n\
  box-orient: vertical;\n\
  -webkit-box-sizing: border-box;\n\
  -moz-box-sizing: border-box;\n\
  box-sizing: border-box;\n\
  border: 1px solid #C2C2C2;\n\
  border-top: none; }\n\
\n\
.raptor-paste-panel-tabs > div > textarea.raptor-paste-area {\n\
  -webkit-box-flex: 1;\n\
  -moz-box-flex: 1;\n\
  -ms-box-flex: 1;\n\
  box-flex: 1;\n\
  display: -webkit-box;\n\
  display: -moz-box;\n\
  display: -ms-box;\n\
  display: box; }\n\
\n\
.raptor-paste-panel-tabs > div > textarea,\n\
.raptor-paste-panel-tabs > div > .raptor-paste-area {\n\
  border: none;\n\
  padding: 2px; }\n\
\n\
/**\n\
 * Raptorize plugin\n\
 *\n\
 * @author David Neilsen <david@panmedia.co.nz>\n\
 */\n\
.raptor-raptorize-button .ui-icon-raptorize {\n\
  filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=85);\n\
  opacity: 0.85;\n\
  background: url(\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAABDlBMVEX///9NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU0Y/iVtAAAAWXRSTlMA/v1mTvW+WQFF+nGpsyPlDhXL1GvZHduk48LslL2a7tadwee772kEfqD8+OGCXWJ2+bQ9pt7xCme4iQU4iNH0mCEPEd82Ocxj4De2HoMaq3MHZJsDeGwCG8H1fioAAAC1SURBVHheNchFlsMwEADRlmRkSDKmMDMMMjMz9P0vkifLrl194F3NW0qtugV5Wt1FHpnloGKRmr3TK96YDjiMxFGCONngcJ1De4GNDJqhvd2VkbzsY+eDw2efMTYsjRFxd4+DZx6ajC1xhXTTB560EyfWASJW2FEG3vGJElZOz4xzH6QLKLqMgpvbu3sxD+4jPBFJe05fBby9ly0S6ADxl4BviGjp5xd0Of0TUqaUEPs/kR1YA96IIUDtx93SAAAAAElFTkSuQmCC\') 0 0; }\n\
\n\
.raptor-raptorize-button:hover .ui-icon-raptorize {\n\
  filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=100);\n\
  opacity: 1; }\n\
\n\
/**\n\
 * Save plugin\n\
 *\n\
 * @author David Neilsen <david@panmedia.co.nz>\n\
 */\n\
.raptor-ui-save .ui-icon {\n\
  filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=85);\n\
  opacity: 0.85;\n\
  background: url(\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAVNJREFUeNqkU71ugzAQPowtwdAdqRLK3odg6161a+cukZonoGrElgWWDqhb16oP0AfoytStirows0QRMj/unQsohAQi5aTD5vju4/Pd2VBKwTnG6cEYe8bl6s73P09Jel8ur3H5ruv6CUiBYRgfQRAosnrCyQhLOZTLG1ImpYQSA1VVjf7dNE0gLOV0R6AXlAMSk4uiGCUQ6ITdJzDpz0SQTxAoxlqVZo+gLEuQyDxFwIQAwg4IiPV3vYbL2WyUgDBHFbxG0Um9t237sIIkSeDYYGHbur3neQMCTgqoRWEYDToh8NyLxSO4rgtpmrY14D0CUsA5h80mh/n8QQdXq7CTTN/ILMtqa9AjEDjOGrTdSnAcRwdpr1unzB5BMweiGwY8tx/H8U+WZbmUSoPJlfr3NrZLgDkXujbNXaD9DfoLAt8OFRHPfb8X+sLcW+Pc6/wnwABHMdnKf4KT4gAAAABJRU5ErkJggg==\') 0 0; }\n\
\n\
.raptor-ui-save:hover .ui-icon {\n\
  filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=100);\n\
  opacity: 1; }\n\
\n\
.raptor-ui-cancel .ui-icon {\n\
  filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=85);\n\
  opacity: 0.85;\n\
  background: url(\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAtFBMVEX///+nAABhAACnAACjAACCAACgAACHAACjAAByAAB1AAByAACDAACnAACCAACHAACgAACNAACbAACXAACMAACSAABfAACYAACRAACjAACbAAChAACqAACNAACcAACHAACqAADEERGsERHQERG+NjaiERHUTEzYERG4ERGlFBSfFRX/d3f6cnK0JSWoHh7qYmLkXFyvFRXmXl7vZ2fNRUX4cHDXT0/+dnbbU1O3Li7GPT26MTG2f8oMAAAAIXRSTlMASEjMzADMzAAASMxIAMwAAMzMzEjMzEhISABIzABISEg/DPocAAAAj0lEQVR4Xo3PVw6DMBBF0RgXTO+hBYhtILX3sv99RRpvgPcxVzp/M5syb7lYepxDABDeYcQ5wg+MAMhr3JOyJKfxTABqduuvjD37O6sBwjZ+f76/7TFuQw1VnhyGYZPklYagKbKLlDIrmkBDGq1hUaqhM4UQJpwOwFdK+a4LAbCdlWNTCgGwjLlhUQqZ8uofSk8NKY1Fm8EAAAAASUVORK5CYII=\') 0 0; }\n\
\n\
.raptor-ui-cancel:hover .ui-icon {\n\
  filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=100);\n\
  opacity: 1; }\n\
\n\
/**\n\
 * Table plugin.\n\
 *\n\
 * @author David Neilsen <david@panmedia.co.nz>\n\
 */\n\
.raptor-ui-table-create-menu td {\n\
  width: 14px;\n\
  height: 14px;\n\
  border: 1px solid #000; }\n\
\n\
.raptor-ui-table-create-menu .raptor-ui-table-create-menu-hover {\n\
  border: 1px solid #f00; }\n\
\n\
.raptor-ui-table-create .ui-icon {\n\
  filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=85);\n\
  opacity: 0.85;\n\
  background: url(\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAb1JREFUeNqck8tKw1AQhv/E1LTe0KWISlNqS1vFCyK4bXXnSnwE8QXcFt/EF3Enoqh47YViaUVUXBU3oq3NSZyZNullJR045D8n55/55iRH2zs62gEwjcHiA7vZ7IE7YLDXcJTSXEq1fQPQmj8cx5Hh8rN73n5/lZ4Ee3WllM4bOLYimjwzVkenSafDrr/uafaw11C2rSlJoOGk4sIy6tTZt1TOhKjihwON3rN2fE1mdwLsNWzb7iFw3n5wmJiS+fXTE9YXFkSfFwrYTCZFnz48EMEc2NtFACFIm8BdtSr9jgaDuCyVpOexUAhnuZxoDvb4BIo2dwiA1Py8zO8rFaxGoy0aSrSRSIi+yOfBHiGQBH0E+ZcXIQiZJm7LZak6wjTFYg9BK0Gz6bfgEcRnZ2Wef37GUiQi+o7OYy0eb9FQIklA3p5D9AhKr69CYA4P45Ha4KpBorlpn4f3GdmrUxZd9f0H0ZkZxIii8fuLZDiMlGWh3mhgmb7ISizWaYG8RqNeH+onKL+/CwFHgdrwqt5TG90E7DU+azUzEAjgOPbVvh/mv+4We9irjS8u7lM1a5CrqOt6VfOQBo0/AQYADu2BHPVXcUgAAAAASUVORK5CYII=\') 0 0; }\n\
\n\
.raptor-ui-table-create:hover .ui-icon {\n\
  filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=100);\n\
  opacity: 1; }\n\
\n\
.raptor-ui-table-insert-row .ui-icon {\n\
  filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=85);\n\
  opacity: 0.85;\n\
  background: url(\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAeZJREFUeNqcU0FrE0EU/mYyIaRoaNOQJlGSbjy0FuxR8VIoUcGDN4X+gUJ/QA899dBf0V76CwTBS6EVIsVLBQ8hLdbiRgrRCKE2JmmTNtmZvre7WVBEGx+83fd23vfN997MiuerqxBCPAOQxvBWU8YYkGderq2tD4umzZeUdhyOhaHHkw+ATwitdeB/yt8XRkFYoRyPQGrDFAKP7whsfzbuW2tyWt62gYLFJJ6/qQBcT1ipnH7fVeD4BDu2QV51Yb6dwfBu5I+iBPyuIbTnnDsmBsIK1fcIfAXwdq52sDwTD3rdOzzEg+npIN8tlUhBFoSV6ufDL7j5LvuVFbxI9ICmgTWmcFyvB/Ow0mlUarUgTycS4HpXweVY25zet+cdkrbx6em1T6CY2vIUnLdaxxhpFZmRYtydu/dP8MfdsqvAJWienORudJPz9KFIMfZevb2WApeg1xNK1qMidmAt6EWDlcI+qEvkQx1YqhP0/LuzaV+BTJRmOMgx4+tGFJ34CMotIBOP49b4OG7TwJrtNrLJJHITE5hMpfCj0RgokOqi22XC0OAY+R4UIsBRtRrcPLaybf+Scz1hQ+qU+iaLhMNhbE61/Q6JAZm/zoDrCRsRsdlZ7muRmPPD/kxSyooYDOV/7UqAAQBguExUpw0RrAAAAABJRU5ErkJggg==\') 0 0; }\n\
\n\
.raptor-ui-table-insert-row:hover .ui-icon {\n\
  filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=100);\n\
  opacity: 1; }\n\
\n\
.raptor-ui-table-insert-column .ui-icon {\n\
  filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=85);\n\
  opacity: 0.85;\n\
  background: url(\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAhRJREFUeNqck81rE0EYxp9dE5IQaDWBBNOQhAiGGERNPYg3qR8ICkrx5B/gXXot7U3/Cg9681SqFz8Q8VQsFqMHwZpQS2ysJV+7+VjtzozzvvkwrnjQF4Zndud9nvnNsGvcWFq6CuAwPJU9cejxk9DKFz39rEf6Uv/aTKXUvDLRUnu4vPwI84uLt9Rfam13XWXuF1i9NfTBJ4UwlI67+AagFzSklEgHFa7HT+Ll/DtstARurnexabu8/nruIMhHGD4hhCkVRRi4cMTA00+K9WwQWFi7POa9M7uKFy2F5xWA+slH703huobgAOBZWSHrc6B2GpDtHu2C4myRVVl9GF9bOB9qgvrJxwSu6w4JwDvLah8LxyL8LN66cJRDzTiXnObxqlTSBCmQb3AED8FcANgolxGdmmJjV3RZy7Uadvb2BsETBCYlCX1pIwKq45kMEpEIGzuyw5qKxXCmUBgE6P4xAQd4CN5vbWE6HIa7vw9b2KwVTfCt0RgTjAJMvTg+woggn0ohEY2y0ZIWayoex+l8/leA9v1xiSOCD9vbCIdCbKQ7GBE0Wi3ukx4C00twNJnEjCb40e+jJ3usaU1wKpebJBjcwXfHOeAl+FitIhgIoF2vAw/qvEYEbcsaE5CPA5r1esDv9+NerjP85nQCEjzbvL372w8W0xRU1E8+DujadjVbLN7FP5ZpmlVSQw3x/7d+CjAAQKSJ51sBGcgAAAAASUVORK5CYII=\') 0 0; }\n\
\n\
.raptor-ui-table-insert-column:hover .ui-icon {\n\
  filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=100);\n\
  opacity: 1; }\n\
\n\
.raptor-ui-table-delete-row .ui-icon {\n\
  filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=85);\n\
  opacity: 0.85;\n\
  background: url(\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAfhJREFUeNqcU0FrE0EU/mbdEHpQJA1tk0hs4iGttIgUKhVvsaIWL2L/QMHizYvnFvoLehEKgtScPemt5lTQkkICxVaKNAElJEKJhhib1N2Z8b3Z7EJFAvHBx74H833zvfdmxeLq6gMAMQweda31W1spFX+9trYxKPvRysoT/tpKSqEpuVMESNGARAP8q97NXgTzjICU0lKaJQTmrwhsHWnzVYogga0ykE2xiId8BeDzzPMEXFfInsC7skba7kLXfkHzbYTbQ0T8piCUB66lvgDmGQHXdXsO4N1c7eDZ1UjQa+HwEDcmJoJ6e2+PHCTBvDMOFqMODuoWUuEwvhwfB/NIxWKo1OtBHYtGweev7+zsKt+BJGvjD+cwv76Or5kZVO4t9N1AlXCtVHpOvoueACn+PDlBaXkZNwsFfKB8YXa2/x6npmZe5XLkwHFMC41WC3ObmzhoC5Pn8vn+r6hWK9q+Ax7i6fYRNjo20q0O7pILv+e/wZGgudxfWnqa2d9/b5ED08Kb5hCSiRB+Ow7ikQgSw8O4RANrtdtIjozg8ugoxsfG8L3ZNEOkd3Dr0+Qk7NNu95y/Rn4H2TDwuVoNXh7Hx3L5TG0cE8+s8UejEQ6FQniZafe6IwXE+/bP55nHuTg/Pf2YlNOD/kyWZVWEEC+EP5j/jT8CDADTO03xCBe9dwAAAABJRU5ErkJggg==\') 0 0; }\n\
\n\
.raptor-ui-table-delete-row:hover .ui-icon {\n\
  filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=100);\n\
  opacity: 1; }\n\
\n\
.raptor-ui-table-delete-column .ui-icon {\n\
  filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=85);\n\
  opacity: 0.85;\n\
  background: url(\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAjZJREFUeNqUU0trE2EUPTNJjCXiIw0pDSXUCi1x0EVTrAt3ie50VcGV4Eo3XQguXLWlq/6Cogj+ABE3LsWFL+iDCKlFayBa28GAefSR1CSdl/feyUzbuOoHkzNfvnvOd+65jHJ7evomgH4cf5VezMy8Dtq2nXg5O/vkuOyJqakHjEHbshSHXm7kAMdx5CFR3E0o6L815hM2Xy3g2c+WnC9lzoJ5/L9qWZZqO44UXb+g+Bg45eDy/DzK29uC6DGROe/WcT3zxIFlmoolAgreFB0MBemW33uonghjcziNiUIB+R0bW6U6lEYD2R4iO6fBPBEwTfOIA1tv4tHFqOzfjY/jU6eFh4uL9HsO7/N5cpAE89wWfAcQB7w+F4v4VS7Doiyy2axgsVTCh5UVOed6z4HKSlxwOINLg4NIRKNCdExTMBmP46qmuQK09xxIC4cdZMLAl/V1nIlEOCjY+/uCP8jBn1rNd+C3YBqG34LnIJVMItHbC7MjwJjs68NYKnUgQLz/QvQcfNvYQDAQcAXabcGv5Opvs+mP8aAFw1CtI1MAhgcGZP+diBYJGIQj5EoCXlvzHLgC7VYr0O2goOs4GQ7zLa4DQs5gZ3fXd8A8EdiqVsOhUAjPRxqdiZMCEvJmdDJgjFMG/PDieuaJwF69rg+Njs51fyx3NO3tiK7P2ZqWrul67t7k5OOF5eWMd66qqs6oRGi2PKbuda1SwZVK5WkbSNNVuaVY7P7HWMw/D1DIjdVV/BNgAMtiagbFZitEAAAAAElFTkSuQmCC\') 0 0; }\n\
\n\
.raptor-ui-table-delete-column:hover .ui-icon {\n\
  filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=100);\n\
  opacity: 1; }\n\
\n\
.raptor-ui-table-merge-cells .ui-icon {\n\
  filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=85);\n\
  opacity: 0.85;\n\
  background: url(\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAdJJREFUeNqck89LG0EUx7+z3RAtVvxxabUxmKiNWkOlBEqvUfGSm/4HLQhevQkGPHsVehDBu1706M2D0JYmTWkkRBtdkhAQgpeiEXd2nPeym8ScJA+G+b6Z+c583oMRy8lkAsAbdBYV03Gcof3NzW+duJc2NlZMR0qhdLLwC1BKNYa+mIeiuTV393/E+0BeQ0pp0AGK+bDgeS7U1HGt46Oqse5p8pDXlLYtJF8gcPxPIWTWdGW3/PJct36x4kDofdJOQ2uz6gV5Tdu2nxA4pTusTfVz/jOfR2xigvVpNovP09OsTzIZTTAC8rYQgAnifiBdKHC9OweD2EHVbdlr7B16+i0+RVWTQOrDTQLgfTDIuWWlcbQ9W6fJ5RCLRFgnVtOQTl+dgC9oI/hrWUxQKpWROu/hrr/s6sL3szPWtC7VB/eCh4dGCR5BJBDgXIgrRMNh1mndj48ugRDXIA95nzTRI8gVi0wwMBDC4peiW3e3HnVN6+TxCIx2gvHhYc631i1Muv34c3GB6NgY65Tuh0tgmPe12ot2gvNymQkospeXXDfFb12Gp8lDXvOmWvX7fD7svvvvovqf9bfIQ17xambmq34t1MlnMgyjIDykTuNRgAEAGx8+v9rCYzwAAAAASUVORK5CYII=\') 0 0; }\n\
\n\
.raptor-ui-table-merge-cells:hover .ui-icon {\n\
  filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=100);\n\
  opacity: 1; }\n\
\n\
.raptor-ui-table-split-cells .ui-icon {\n\
  filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=85);\n\
  opacity: 0.85;\n\
  background: url(\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAbdJREFUeNqck7tLA0EQxmfPC8FCidr4Fs/4fqCFIjYWiWIjguh/oCDY2gkK1raChQj2aqGllRYWEY2KgRA18UgOq2AjGsntrjvj3eVRSQaW/eZ2v9nf7t6y5e3teQBogsriXRdCNB/v7OxX4l7a2lrTBedMqmT2FkBK6TVVmJrEvjh3xiOhAKBX45xrOAFjpotRHzYKOqR0qFN6312NHvTq3LYZpwIMLl4lGHpO7eyLVg5XqxXfBTA1jlp4WpllLaBXt227hEBkvmFjoI7ym0QCxnt6SF/HYjA1OEj66uFBEbQDeosIgAhCfoBoMkn7PThpgAPIOkfWCEdnrm6FyRFZIOBqcoEAYKijg3LTjML53hjp+fVSzUXgj4AKlBE8mSYRZDIWjC1Y3rUVay5HnQL5vLcFl6CvrY1yxt4gcjpNemLxskSjB70lh+gSxNNpIqivN2BuJU1j5Ro9LoFWTtDd0kL57qYJ/c55PL68wEgwSPouHncJNP0nl6sqJ3i2LCLAiKVS9Odh3KtrdTV60Kt/ZLN+n88Hh72fzvH4//W20INeVjM8vKpWMyp5TJqmJZmLVGn8CjAAKgs3IcwKIpQAAAAASUVORK5CYII=\') 0 0; }\n\
\n\
.raptor-ui-table-split-cells:hover .ui-icon {\n\
  filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=100);\n\
  opacity: 1; }\n\
\n\
/**\n\
 * Tag menu plugin\n\
 *\n\
 * @author David Neilsen <david@panmedia.co.nz>\n\
 * @author Michael Robinson <michael@panmedia.co.nz>\n\
 */\n\
.raptor-wrapper .raptor-selectmenu .raptor-selectmenu-button .ui-icon {\n\
  text-align: left; }\n\
\n\
.raptor-wrapper .raptor-selectmenu .raptor-selectmenu-button .raptor-selectmenu-text {\n\
  font-size: 13px;\n\
  line-height: 22px; }\n\
\n\
.raptor-selectmenu-menu li a, .raptor-selectmenu-status {\n\
  line-height: 12px; }\n\
\n\
/**\n\
 * Text alignment plugin\n\
 *\n\
 * @author David Neilsen <david@panmedia.co.nz>\n\
 */\n\
.raptor-ui-align-left .ui-icon {\n\
  filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=85);\n\
  opacity: 0.85;\n\
  background: url(\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAItJREFUeNpi/P//PwMlgImBQsACN4mJqRFIaQExIxQzYWEzQfHlf//+lYL0McK8ADSAJJuBBqC6AAjWYrEN2VYPbAZR1QUb0WxEZmPD1lR3wTYCttpSJQxg6mE0sgt2E/AzCLMBMTsQcwCxAskuQE722FwwEYiNsNjKClR8EUjH4w2DActMFBsAEGAAnS84DrgEl1wAAAAASUVORK5CYII=\') 0 0; }\n\
\n\
.raptor-ui-align-left:hover .ui-icon {\n\
  filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=100);\n\
  opacity: 1; }\n\
\n\
.raptor-ui-align-right .ui-icon {\n\
  background: url(\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAIxJREFUeNpi/P//PwMlgImBQsACN4mJqRFIaQExIxQzYWEzQfHlf//+lYL0McK8ADSAJJuBBqC6AAvYjGYrMhuEHanugo0EbETH1jQPg714bGcGYhOqu2A3AT+DMBvQQnYgzQHECiS7ADnZw9j4wmA61J+sQMUcUFtBtrMC8TEg9kNxwYBlJooNAAgwAJo0OAu5XKT8AAAAAElFTkSuQmCC\') 0 0; }\n\
\n\
.raptor-ui-align-right:hover .ui-icon {\n\
  filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=100);\n\
  opacity: 1; }\n\
\n\
.raptor-ui-align-center .ui-icon {\n\
  background: url(\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAI1JREFUeNpi/P//PwMlgImBQsACN4mJqRFIaQExIxQzYWEzQfHlf//+lYL0McK8ADSAJJuBBqC6AAlswGErjO2KrJiqLtiIw0Zc2JpmYbCTgM2WFIUBTD2MRnbBbgI2gzAbELMDMQcQK5DsAuRkj80FMDAFiI2RbGUFKuaA2noGiEOwhsGAZSaKDQAIMAB/BzgOq8akNwAAAABJRU5ErkJggg==\') 0 0; }\n\
\n\
.raptor-ui-align-center:hover .ui-icon {\n\
  filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=100);\n\
  opacity: 1; }\n\
\n\
.raptor-ui-align-justify .ui-icon {\n\
  background: url(\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAJFJREFUeNpi/P//PwMlgImBQsACN4mJqRFIaQExIxQzYWEzQfHlf//+lYL0McK8ADSAJJuBBqC6AAjWYrEN2VZkNgg7Ut0FGwnYiI6tqe6CbUTYCsPMQGxCdRfsJsJmNqCF7ECaA4gVSHYBcrKHsZFdMBGIjbDYygpUzAG1FWQ7KxAfA2I/FBcMWGai2ACAAAMAvPA4C7ttvJ4AAAAASUVORK5CYII=\') 0 0; }\n\
\n\
.raptor-ui-align-justify:hover .ui-icon {\n\
  filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=100);\n\
  opacity: 1; }\n\
\n\
/**\n\
 * Font size plugin\n\
 *\n\
 * @author David Neilsen <david@panmedia.co.nz>\n\
 */\n\
.raptor-ui-text-size-increase .ui-icon {\n\
  filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=85);\n\
  opacity: 0.85;\n\
  background: url(\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAOhJREFUeNpi/P//PwMlgImBQkCxASxgU5gwzJkOpTORBZ2ilzO8+MjFwMIixnBhnTlOF8gD8U8gFoey4UBSyZooLzgD8Umo65xhgsYu5USHgS0QHwfiE1A2TtuxGaAIxL+B+AEQnwFiaagYg6Qi2AAHIP4PpbEa4AHEz4HYAIi/QL3hgSS/H4gfQmlELCAHNBBLQGlksenP7x9l4Bc3YMTnBRWogbZIuBOIZUFyW2b5EQwDVyA+giYPcionSA6U5Jc0yTK8vrUcVQU0L1gB8RMotkKSXoMkXgQT5BM3A+sDYcahn5kAAgwArro7Z1GYijsAAAAASUVORK5CYII=\') 0 0; }\n\
\n\
.raptor-ui-text-size-increase:hover .ui-icon {\n\
  filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=100);\n\
  opacity: 1; }\n\
\n\
.raptor-ui-text-size-decrease .ui-icon {\n\
  filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=85);\n\
  opacity: 0.85;\n\
  background: url(\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAKxJREFUeNpi/P//PwMlgImBQjAMDGBBMY0Jbp4JEFcAcQcQnwEJpLa/Zfj27SvD+fPnGVhYxBgurDPH6wI9IP4DpRmMXcpJ9oIZELcBcRiaOCjOH0BpnAYoAbE6EE8EYnYgtjq7pxMm5wjE8lAapwFOQLwFiIuB+AQ0PBi2zvYHUQeAmBFKYxoATJWWQOwLxJJAfA6I5YE4FyT+9O5hBiSXwAHjaFKm3ACAAAMA85o8WKYZErQAAAAASUVORK5CYII=\') 0 0; }\n\
\n\
.raptor-ui-text-size-decrease:hover .ui-icon {\n\
  filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=100);\n\
  opacity: 1; }\n\
\n\
/**\n\
 * Basic text style plugin\n\
 *\n\
 * @author David Neilsen <david@panmedia.co.nz>\n\
 */\n\
.raptor-ui-text-bold .ui-icon {\n\
  filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=85);\n\
  opacity: 0.85;\n\
  background: url(\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAKRJREFUeNpi/P//PwMlgImBQjDwBrCgmMbEpA2kGnGofQ3E9UD86t+/fzhdcBWIpwExMxQ3AHEIEK8BYgkgdsLrAih4A8SsaBYwQcWYiDGAEcmAbiwuJBiIIAPYoLgfiMuBeBmUXwHEXIQMYEIy4BUQXwDiy1C+HBBrEPKCDBCzwwwDpVRGRkZksU8ozkVOykCFVkBqOZ5oB3lpAoqe0bzAABBgANfuIyxmXKp/AAAAAElFTkSuQmCC\') 0 0; }\n\
\n\
.raptor-ui-text-bold:hover .ui-icon {\n\
  filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=100);\n\
  opacity: 1; }\n\
\n\
.raptor-ui-text-block-quote .ui-icon {\n\
  filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=85);\n\
  opacity: 0.85;\n\
  background: url(\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAGVJREFUeNpi/P//PwMlgImBQjAcDWBhYZEA4r1AHA/EKHxiXQBS+BKIF+LgEzTAG4h3I0UvOh+/AUCFbECcDmROA2lC5mMzgAWLGDuUtsTBJ+iFeUDMC6Wx8VEA42hSptwAgAADAO3wKLgntfGkAAAAAElFTkSuQmCC\') 0 0; }\n\
\n\
.raptor-ui-text-block-quote:hover .ui-icon {\n\
  filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=100);\n\
  opacity: 1; }\n\
\n\
.raptor-ui-text-italic .ui-icon {\n\
  filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=85);\n\
  opacity: 0.85;\n\
  background: url(\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAH1JREFUeNpi/P//PwMlgImBQjDwBrBgmMgEN1MbiBvRpOv//ft3FUUEFIjImJGRERnrAPF6IO6BiaGrZyLCi6xAvJDcMLAA4j9AfJlcA/yBeCe5sWAExAJAfIKkWIAFJBAUATE7kM+M143ooQoEVkD8EA1b4Yy10bzAABBgAC7mS5rTXrDAAAAAAElFTkSuQmCC\') 0 0; }\n\
\n\
.raptor-ui-text-italic:hover .ui-icon {\n\
  filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=100);\n\
  opacity: 1; }\n\
\n\
.raptor-ui-text-underline .ui-icon {\n\
  filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=85);\n\
  opacity: 0.85;\n\
  background: url(\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAKZJREFUeNpi/P//PwMlgImBQkCxASwopjExhQGpMCSheijdiCz279+/q3AeKAxgmJGREYSdgHgdlIaJ6SCLIevB5oXXUJe9RhK7gkUMZxgwAjEzlEYG2MRwGsCKRTErKQawYFHMQqwBn6G2qSCJGULFPmPYhpwSgdEIY6YCcTKa2rlAPBvEAEYjdgNAUYRMowOYWmQ9LFjUPSGQP2RwemFoZiaAAAMAlEI7bVBRJkoAAAAASUVORK5CYII=\') 0 0; }\n\
\n\
.raptor-ui-text-underline:hover .ui-icon {\n\
  filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=100);\n\
  opacity: 1; }\n\
\n\
.raptor-ui-text-strike .ui-icon {\n\
  filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=85);\n\
  opacity: 0.85;\n\
  background: url(\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAL5JREFUeNpi/P//PwMlgImBQkCxASwopjHBzbMB4nQg5oTyrwKxNhAXAfGjf//+EXRBFhC/BOI0KAapYwZpxusCJPASquEdlD8FiHWwKWREjgUkL4gDcQ0QfwfiXqiBcIDsBXQD9hATcEADXOAckAEwzMjIiI4lgHgiEM8GYkmYOLIeXAZ4I2sA4vlQjGEArkBsAeJzQAUVYH8yMnIAKTmC6QAaHhpALALEPCBDoOJfgFQ5wVgYmnmBYgMAAgwAEGZWNyZpBykAAAAASUVORK5CYII=\') 0 0; }\n\
\n\
.raptor-ui-text-strike:hover .ui-icon {\n\
  filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=100);\n\
  opacity: 1; }\n\
\n\
.raptor-ui-text-sub .ui-icon {\n\
  filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=85);\n\
  opacity: 0.85;\n\
  background: url(\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAKZJREFUeNpi/P//PwMlgImBQjDwBrDATWJCMWs6lM7Ep/nfv39YXSAPxL+AWALKJtkLLkB8EohZoWySDbAH4uNQQ+xJNUAJiH8DMT8QPwZiWagYDEwA4v1QGgJACQmEGRkZQTgXiI+i4VyoHAy7AfEaEBucCNEM2AzEKkiKu6BiYMuAdAYQLwZiKQwDgGAVED+E0iBgBeUjiy1HErMCWzyaFxgAAgwA5Gw9vTeiCqoAAAAASUVORK5CYII=\') 0 0; }\n\
\n\
.raptor-ui-text-sub:hover .ui-icon {\n\
  filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=100);\n\
  opacity: 1; }\n\
\n\
.raptor-ui-text-super .ui-icon {\n\
  filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=85);\n\
  opacity: 0.85;\n\
  background: url(\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAALdJREFUeNpi/P//PwMlgImBQjDwBrCgmMaEYt50KJ0JpRuBWBuIrwJx/b9///C6QB6IfwGxBJQNAvVAPAkqRtALLkB8EohZoWwQiAbiICCuI8YAeyA+DjXEHiqmD8SaQLwIysYMAyhQAuLfQMwPxI+B2AkqVkZsLHgDsQYQTwXiVCBmg4phB6CUCMOMjIwgvBmIVaBsEO6CijEgY5geFAOAYBUQP4TSIGAF5SOLoVjMOJoXGAACDACTRz3jjn6PnwAAAABJRU5ErkJggg==\') 0 0; }\n\
\n\
.raptor-ui-text-super:hover .ui-icon {\n\
  filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=100);\n\
  opacity: 1; }\n\
\n\
/**\n\
 * Basic text style plugin\n\
 *\n\
 * @author David Neilsen <david@panmedia.co.nz>\n\
 */\n\
.raptor-wrapper [data-title]:after {\n\
  opacity: 0;\n\
  content: attr(data-title);\n\
  display: block;\n\
  position: absolute;\n\
  top: 100%;\n\
  font-size: 12px;\n\
  font-weight: normal;\n\
  color: white;\n\
  padding: 11px 16px 7px;\n\
  white-space: nowrap;\n\
  text-shadow: none;\n\
  overflow: visible;\n\
  z-index: 1000;\n\
  -webkit-pointer-events: none;\n\
  -moz-pointer-events: none;\n\
  pointer-events: none;\n\
  -webkit-border-radius: 9px 9px 2px 2px;\n\
  -moz-border-radius: 9px 9px 2px 2px;\n\
  -ms-border-radius: 9px 9px 2px 2px;\n\
  -o-border-radius: 9px 9px 2px 2px;\n\
  border-radius: 9px 9px 2px 2px;\n\
  -webkit-transition: opacity 0.23s;\n\
  -webkit-transition-delay: 0s;\n\
  -moz-transition: opacity 0.23s 0s;\n\
  -o-transition: opacity 0.23s 0s;\n\
  transition: opacity 0.23s 0s;\n\
  background: url(\'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4gPHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJncmFkIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgeDE9IjUwJSIgeTE9IjAlIiB4Mj0iNTAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSI1cHgiIHN0b3AtY29sb3I9InJnYmEoNDAsIDQwLCA0MCwgMCkiLz48c3RvcCBvZmZzZXQ9IjZweCIgc3RvcC1jb2xvcj0iIzI4MjgyOCIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iIzI4MjgyOCIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxyZWN0IHg9IjAiIHk9IjAiIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JhZCkiIC8+PC9zdmc+IA==\'), url(\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAGAgMAAACKgJcSAAAADFBMVEUAAAAoKCgoKCgoKCj7f2xyAAAAA3RSTlMATLP00ibhAAAAJklEQVR4XgXAMRUAEBQF0GtSwK6KYrKpIIz5P4eBTcvSc808J/UBPj4IdoCAGiAAAAAASUVORK5CYII=\') no-repeat 10px 0;\n\
  background: -webkit-gradient(linear, 50% 0%, 50% 100%, color-stop(5px, rgba(40, 40, 40, 0)), color-stop(6px, #282828), color-stop(100%, #282828)), url(\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAGAgMAAACKgJcSAAAADFBMVEUAAAAoKCgoKCgoKCj7f2xyAAAAA3RSTlMATLP00ibhAAAAJklEQVR4XgXAMRUAEBQF0GtSwK6KYrKpIIz5P4eBTcvSc808J/UBPj4IdoCAGiAAAAAASUVORK5CYII=\') no-repeat 10px 0;\n\
  background: -webkit-linear-gradient(rgba(40, 40, 40, 0) 5px, #282828 6px, #282828), url(\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAGAgMAAACKgJcSAAAADFBMVEUAAAAoKCgoKCgoKCj7f2xyAAAAA3RSTlMATLP00ibhAAAAJklEQVR4XgXAMRUAEBQF0GtSwK6KYrKpIIz5P4eBTcvSc808J/UBPj4IdoCAGiAAAAAASUVORK5CYII=\') no-repeat 10px 0;\n\
  background: -moz-linear-gradient(rgba(40, 40, 40, 0) 5px, #282828 6px, #282828), url(\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAGAgMAAACKgJcSAAAADFBMVEUAAAAoKCgoKCgoKCj7f2xyAAAAA3RSTlMATLP00ibhAAAAJklEQVR4XgXAMRUAEBQF0GtSwK6KYrKpIIz5P4eBTcvSc808J/UBPj4IdoCAGiAAAAAASUVORK5CYII=\') no-repeat 10px 0;\n\
  background: -o-linear-gradient(rgba(40, 40, 40, 0) 5px, #282828 6px, #282828), url(\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAGAgMAAACKgJcSAAAADFBMVEUAAAAoKCgoKCgoKCj7f2xyAAAAA3RSTlMATLP00ibhAAAAJklEQVR4XgXAMRUAEBQF0GtSwK6KYrKpIIz5P4eBTcvSc808J/UBPj4IdoCAGiAAAAAASUVORK5CYII=\') no-repeat 10px 0;\n\
  background: linear-gradient(rgba(40, 40, 40, 0) 5px, #282828 6px, #282828), url(\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAGAgMAAACKgJcSAAAADFBMVEUAAAAoKCgoKCgoKCj7f2xyAAAAA3RSTlMATLP00ibhAAAAJklEQVR4XgXAMRUAEBQF0GtSwK6KYrKpIIz5P4eBTcvSc808J/UBPj4IdoCAGiAAAAAASUVORK5CYII=\') no-repeat 10px 0; }\n\
\n\
.raptor-wrapper [data-title]:hover:after {\n\
  opacity: 1; }\n\
\n\
.raptor-wrapper .raptor-select-element {\n\
  position: relative; }\n\
\n\
.raptor-wrapper .raptor-select-element:after {\n\
  background: url(\'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4gPHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJncmFkIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgeDE9IjUwJSIgeTE9IjAlIiB4Mj0iNTAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSI1cHgiIHN0b3AtY29sb3I9InJnYmEoNDAsIDQwLCA0MCwgMCkiLz48c3RvcCBvZmZzZXQ9IjZweCIgc3RvcC1jb2xvcj0iIzI4MjgyOCIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iIzI4MjgyOCIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxyZWN0IHg9IjAiIHk9IjAiIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JhZCkiIC8+PC9zdmc+IA==\'), url(\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAGAgMAAACKgJcSAAAADFBMVEUAAAAoKCgoKCgoKCj7f2xyAAAAA3RSTlMATLP00ibhAAAAJklEQVR4XgXAMRUAEBQF0GtSwK6KYrKpIIz5P4eBTcvSc808J/UBPj4IdoCAGiAAAAAASUVORK5CYII=\') no-repeat 3px 0;\n\
  background: -webkit-gradient(linear, 50% 0%, 50% 100%, color-stop(5px, rgba(40, 40, 40, 0)), color-stop(6px, #282828), color-stop(100%, #282828)), url(\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAGAgMAAACKgJcSAAAADFBMVEUAAAAoKCgoKCgoKCj7f2xyAAAAA3RSTlMATLP00ibhAAAAJklEQVR4XgXAMRUAEBQF0GtSwK6KYrKpIIz5P4eBTcvSc808J/UBPj4IdoCAGiAAAAAASUVORK5CYII=\') no-repeat 3px 0;\n\
  background: -webkit-linear-gradient(rgba(40, 40, 40, 0) 5px, #282828 6px, #282828), url(\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAGAgMAAACKgJcSAAAADFBMVEUAAAAoKCgoKCgoKCj7f2xyAAAAA3RSTlMATLP00ibhAAAAJklEQVR4XgXAMRUAEBQF0GtSwK6KYrKpIIz5P4eBTcvSc808J/UBPj4IdoCAGiAAAAAASUVORK5CYII=\') no-repeat 3px 0;\n\
  background: -moz-linear-gradient(rgba(40, 40, 40, 0) 5px, #282828 6px, #282828), url(\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAGAgMAAACKgJcSAAAADFBMVEUAAAAoKCgoKCgoKCj7f2xyAAAAA3RSTlMATLP00ibhAAAAJklEQVR4XgXAMRUAEBQF0GtSwK6KYrKpIIz5P4eBTcvSc808J/UBPj4IdoCAGiAAAAAASUVORK5CYII=\') no-repeat 3px 0;\n\
  background: -o-linear-gradient(rgba(40, 40, 40, 0) 5px, #282828 6px, #282828), url(\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAGAgMAAACKgJcSAAAADFBMVEUAAAAoKCgoKCgoKCj7f2xyAAAAA3RSTlMATLP00ibhAAAAJklEQVR4XgXAMRUAEBQF0GtSwK6KYrKpIIz5P4eBTcvSc808J/UBPj4IdoCAGiAAAAAASUVORK5CYII=\') no-repeat 3px 0;\n\
  background: linear-gradient(rgba(40, 40, 40, 0) 5px, #282828 6px, #282828), url(\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAGAgMAAACKgJcSAAAADFBMVEUAAAAoKCgoKCgoKCj7f2xyAAAAA3RSTlMATLP00ibhAAAAJklEQVR4XgXAMRUAEBQF0GtSwK6KYrKpIIz5P4eBTcvSc808J/UBPj4IdoCAGiAAAAAASUVORK5CYII=\') no-repeat 3px 0; }\n\
\n\
/**\n\
 * Unsaved edit warning plugin\n\
 *\n\
 * @author Michael Robinson <michael@panmedia.co.nz>\n\
 * @author David Neilsen <david@panmedia.co.nz>\n\
 */\n\
.raptor-unsaved-edit-warning {\n\
  position: fixed;\n\
  bottom: 0;\n\
  right: 0;\n\
  height: 30px;\n\
  line-height: 30px;\n\
  border-radius: 5px 0 0 0;\n\
  border: 1px solid #D4D4D4;\n\
  padding-right: 7px;\n\
  background: url(\'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4gPHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJncmFkIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgeDE9IjUwJSIgeTE9IjAlIiB4Mj0iNTAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iI2ZmZmZmMiIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iI2VkZWNiZCIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxyZWN0IHg9IjAiIHk9IjAiIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JhZCkiIC8+PC9zdmc+IA==\');\n\
  background: -webkit-gradient(linear, 50% 0%, 50% 100%, color-stop(0%, #fffff2), color-stop(100%, #edecbd));\n\
  background: -webkit-linear-gradient(top, #fffff2, #edecbd);\n\
  background: -moz-linear-gradient(top, #fffff2, #edecbd);\n\
  background: -o-linear-gradient(top, #fffff2, #edecbd);\n\
  background: linear-gradient(top, #fffff2, #edecbd);\n\
  -webkit-transition: opacity 0.5s;\n\
  -moz-transition: opacity 0.5s;\n\
  -o-transition: opacity 0.5s;\n\
  transition: opacity 0.5s;\n\
  filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=0);\n\
  opacity: 0; }\n\
  .raptor-unsaved-edit-warning .ui-icon {\n\
    display: inline-block;\n\
    float: left;\n\
    margin: 8px 5px 0 5px; }\n\
\n\
.raptor-unsaved-edit-warning-visible {\n\
  filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=100);\n\
  opacity: 1; }\n\
\n\
.raptor-unsaved-edit-warning-dirty {\n\
  outline: 1px dotted #aaa;\n\
  background-image: url(\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoAQMAAAC2MCouAAAABlBMVEUAAACfn5/FQV4CAAAAAnRSTlMAG/z2BNQAAABPSURBVHhexc2xEYAgEAXRdQwILYFSKA1LsxRKIDRwOG8LMDb9++aO8tAvjps4qXMLaGNf5JglxyyEhWVBXpAfyCvyhrwjD74OySfy8dffFyMcWadc9txXAAAAAElFTkSuQmCC\') !important; }\n\
\n\
/**\n\
 * View source plugin\n\
 *\n\
 * @author Michael Robinson <michael@panmedia.co.nz>\n\
 * @author David Neilsen <david@panmedia.co.nz>\n\
 */\n\
.raptor-ui-view-source .ui-icon-view-source {\n\
  filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=85);\n\
  opacity: 0.85;\n\
  background: url(\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAKtJREFUeNpi/P//PwMlgImBQkCxAQwgLzAyMqLjMCCehsSfBhVDUQf2PhYDIoB4JhCLIYmJQcUiCBkQBcRzgFgci6vEoXJRuAyIAeIFODQjG7IAqhbFAAMg3gOlGQhguFp0FyQC8UoglgTx0QFUjSRUTSKuMEgG4nUghVgMkITKJROKhXQg3gbUI42kXxokBpUjGI0gDYVAfBzJABC7EFs6YBz6eYFiAwACDAADJlDtLE22CAAAAABJRU5ErkJggg==\') 0 0; }\n\
\n\
.raptor-ui-view-source:hover .ui-icon-view-source {\n\
  filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=100);\n\
  opacity: 1; }\n\
\n\
.raptor-ui-view-source-dialog .ui-dialog-content {\n\
  overflow: visible; }\n\
\n\
.raptor-ui-view-source-inner-wrapper {\n\
  width: 100%;\n\
  height: 100%;\n\
  display: -webkit-box;\n\
  display: -moz-box;\n\
  display: -ms-box;\n\
  display: box;\n\
  -webkit-box-orient: vertical;\n\
  -moz-box-orient: vertical;\n\
  -ms-box-orient: vertical;\n\
  box-orient: vertical; }\n\
\n\
.raptor-ui-view-source-dialog textarea {\n\
  width: 100%;\n\
  height: 100%;\n\
  -webkit-box-flex: 1;\n\
  -moz-box-flex: 1;\n\
  -ms-box-flex: 1;\n\
  box-flex: 1; }\n\
\n\
/**\n\
 * Basic color picker plugin default colors.\n\
 *\n\
 * @author David Neilsen <david@panmedia.co.nz>\n\
 */\n\
.cms-white {\n\
  color: #ffffff; }\n\
\n\
.cms-black {\n\
  color: #000000; }\n\
\n\
.cms-blue {\n\
  color: #4f81bd; }\n\
\n\
.cms-red {\n\
  color: #c0504d; }\n\
\n\
.cms-green {\n\
  color: #9bbb59; }\n\
\n\
.cms-purple {\n\
  color: #8064a2; }\n\
\n\
.cms-orange {\n\
  color: #f79646; }\n\
\n\
.cms-grey {\n\
  color: #999; }\n\
\n\
                /* End of file: build/default/src/theme/theme.css */\n\
            </style>').appendTo('head');