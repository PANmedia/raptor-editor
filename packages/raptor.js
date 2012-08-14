/*! 
VERSION: 0.0.16 
For license information, see http://www.raptor-editor.com/license
*/
/**
 * Rangy, a cross-browser JavaScript range and selection library
 * http://code.google.com/p/rangy/
 *
 * Copyright 2012, Tim Down
 * Licensed under the MIT license.
 * Version: 1.2.3
 * Build date: 26 February 2012
 */
window['rangy'] = (function() {


    var OBJECT = "object", FUNCTION = "function", UNDEFINED = "undefined";

    var domRangeProperties = ["startContainer", "startOffset", "endContainer", "endOffset", "collapsed",
        "commonAncestorContainer", "START_TO_START", "START_TO_END", "END_TO_START", "END_TO_END"];

    var domRangeMethods = ["setStart", "setStartBefore", "setStartAfter", "setEnd", "setEndBefore",
        "setEndAfter", "collapse", "selectNode", "selectNodeContents", "compareBoundaryPoints", "deleteContents",
        "extractContents", "cloneContents", "insertNode", "surroundContents", "cloneRange", "toString", "detach"];

    var textRangeProperties = ["boundingHeight", "boundingLeft", "boundingTop", "boundingWidth", "htmlText", "text"];

    // Subset of TextRange's full set of methods that we're interested in
    var textRangeMethods = ["collapse", "compareEndPoints", "duplicate", "getBookmark", "moveToBookmark",
        "moveToElementText", "parentElement", "pasteHTML", "select", "setEndPoint", "getBoundingClientRect"];

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
        version: "1.2.3",
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
            alertOnWarn: false,
            preferTextRange: false
        }
    };

    function fail(reason) {
        window.alert("Rangy not supported in your browser. Reason: " + reason);
        api.initialized = true;
        api.supported = false;
    }

    api.fail = fail;

    function warn(msg) {
        var warningMessage = "Rangy warning: " + msg;
        if (api.config.alertOnWarn) {
            window.alert(warningMessage);
        } else if (typeof window.console != UNDEFINED && typeof window.console.log != UNDEFINED) {
            window.console.log(warningMessage);
        }
    }

    api.warn = warn;

    if ({}.hasOwnProperty) {
        api.util.extend = function(o, props) {
            for (var i in props) {
                if (props.hasOwnProperty(i)) {
                    o[i] = props[i];
                }
            }
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

        if (body && isHostMethod(body, "createTextRange")) {
            testRange = body.createTextRange();
            if (isTextRange(testRange)) {
                implementsTextRange = true;
            }
        }

        if (!implementsDomRange && !implementsTextRange) {
            fail("Neither Range nor TextRange are implemented");
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
                    window.console.log("Init listener threw an exception. Continuing.", ex);
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

    /**
     * @constructor
     */
    function Module(name) {
        this.name = name;
        this.initialized = false;
        this.supported = false;
    }

    Module.prototype.fail = function(reason) {
        this.initialized = true;
        this.supported = false;

        throw new Error("Module '" + this.name + "' failed to load: " + reason);
    };

    Module.prototype.warn = function(msg) {
        api.warn("Module " + this.name + ": " + msg);
    };

    Module.prototype.createError = function(msg) {
        return new Error("Error in Rangy " + this.name + " module: " + msg);
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
        var childNodes;
        return isCharacterDataNode(node) ? node.length : ((childNodes = node.childNodes) ? childNodes.length : 0);
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
    function splitDataNode(node, index) {
        var newNode = node.cloneNode(false);
        newNode.deleteData(0, index);
        node.deleteData(index, node.length - index);
        insertAfter(newNode, node);
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
            throw new Error("getDocument: no document found for node");
        }
    }

    function getWindow(node) {
        var doc = getDocument(node);
        if (typeof doc.defaultView != UNDEF) {
            return doc.defaultView;
        } else if (typeof doc.parentWindow != UNDEF) {
            return doc.parentWindow;
        } else {
            throw new Error("Cannot get a window object for node");
        }
    }

    function getIframeDocument(iframeEl) {
        if (typeof iframeEl.contentDocument != UNDEF) {
            return iframeEl.contentDocument;
        } else if (typeof iframeEl.contentWindow != UNDEF) {
            return iframeEl.contentWindow.document;
        } else {
            throw new Error("getIframeWindow: No Document object found for iframe element");
        }
    }

    function getIframeWindow(iframeEl) {
        if (typeof iframeEl.contentWindow != UNDEF) {
            return iframeEl.contentWindow;
        } else if (typeof iframeEl.contentDocument != UNDEF) {
            return iframeEl.contentDocument.defaultView;
        } else {
            throw new Error("getIframeWindow: No Window object found for iframe element");
        }
    }

    function getBody(doc) {
        return util.isHostObject(doc, "body") ? doc.body : doc.getElementsByTagName("body")[0];
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

                throw new Error("comparePoints got to case 4 and childA and childB are the same!");
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
                throw new Error("Should not be here!");
            }
        }
    }

    function fragmentFromNodeChildren(node) {
        var fragment = getDocument(node).createDocumentFragment(), child;
        while ( (child = node.firstChild) ) {
            fragment.appendChild(child);
        }
        return fragment;
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

    /**
     * @constructor
     */
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

    /**
     * @constructor
     */
    function DomPosition(node, offset) {
        this.node = node;
        this.offset = offset;
    }

    DomPosition.prototype = {
        equals: function(pos) {
            return this.node === pos.node & this.offset == pos.offset;
        },

        inspect: function() {
            return "[DomPosition(" + inspectNode(this.node) + ":" + this.offset + ")]";
        }
    };

    /**
     * @constructor
     */
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
        getClosestAncestorIn: getClosestAncestorIn,
        isCharacterDataNode: isCharacterDataNode,
        insertAfter: insertAfter,
        splitDataNode: splitDataNode,
        getDocument: getDocument,
        getWindow: getWindow,
        getIframeWindow: getIframeWindow,
        getIframeDocument: getIframeDocument,
        getBody: getBody,
        getRootContainer: getRootContainer,
        comparePoints: comparePoints,
        inspectNode: inspectNode,
        fragmentFromNodeChildren: fragmentFromNodeChildren,
        createIterator: createIterator,
        DomPosition: DomPosition
    };

    api.DOMException = DOMException;
});rangy.createModule("DomRange", function(api, module) {
    api.requireModules( ["DomUtil"] );


    var dom = api.dom;
    var DomPosition = dom.DomPosition;
    var DOMException = api.DOMException;

    /*----------------------------------------------------------------------------------------------------------------*/

    // Utility functions

    function isNonTextPartiallySelected(node, range) {
        return (node.nodeType != 3) &&
               (dom.isAncestorOf(node, range.startContainer, true) || dom.isAncestorOf(node, range.endContainer, true));
    }

    function getRangeDocument(range) {
        return dom.getDocument(range.startContainer);
    }

    function dispatchEvent(range, type, args) {
        var listeners = range._listeners[type];
        if (listeners) {
            for (var i = 0, len = listeners.length; i < len; ++i) {
                listeners[i].call(range, {target: range, args: args});
            }
        }
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
            //log.debug("iterateSubtree, partially selected: " + rangeIterator.isPartiallySelectedSubtree(), nodeToString(node));
            if (rangeIterator.isPartiallySelectedSubtree()) {
                // The node is partially selected by the Range, so we can use a new RangeIterator on the portion of the
                // node selected by the Range.
                if (func(node) === false) {
                    iteratorState.stop = true;
                    return;
                } else {
                    subRangeIterator = rangeIterator.getSubtreeIterator();
                    iterateSubtree(subRangeIterator, func, iteratorState);
                    subRangeIterator.detach(true);
                    if (iteratorState.stop) {
                        return;
                    }
                }
            } else {
                // The whole node is selected, so we can use efficient DOM iteration to iterate over the node and its
                // descendant
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
        //log.info("getNodesInRange, " + nodeTypes.join(","));
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

    /**
     * @constructor
     */
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
                subRange.collapse();
            } else {
                subRange = new Range(getRangeDocument(this.range));
                var current = this._current;
                var startContainer = current, startOffset = 0, endContainer = current, endOffset = dom.getNodeLength(current);

                if (dom.isAncestorOf(current, this.sc, true)) {
                    startContainer = this.sc;
                    startOffset = this.so;
                }
                if (dom.isAncestorOf(current, this.ec, true)) {
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

    /**
     * @constructor
     */
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

    /**
     * Currently iterates through all nodes in the range on creation until I think of a decent way to do it
     * TODO: Look into making this a proper iterator, not requiring preloading everything first
     * @constructor
     */
    function RangeNodeIterator(range, nodeTypes, filter) {
        this.nodes = getNodesInRange(range, nodeTypes, filter);
        this._next = this.nodes[0];
        this._position = 0;
    }

    RangeNodeIterator.prototype = {
        _current: null,

        hasNext: function() {
            return !!this._next;
        },

        next: function() {
            this._current = this._next;
            this._next = this.nodes[ ++this._position ];
            return this._current;
        },

        detach: function() {
            this._current = this._next = this.nodes = null;
        }
    };

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

    /*----------------------------------------------------------------------------------------------------------------*/

    var rangeProperties = ["startContainer", "startOffset", "endContainer", "endOffset", "collapsed",
        "commonAncestorContainer"];

    var s2s = 0, s2e = 1, e2e = 2, e2s = 3;
    var n_b = 0, n_a = 1, n_b_a = 2, n_i = 3;

    function RangePrototype() {}

    RangePrototype.prototype = {
        attachListener: function(type, listener) {
            this._listeners[type].push(listener);
        },

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

            if (dom.isAncestorOf(node, this.startContainer, true)) {
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
            var container = getRangeDocument(this).createElement("div");
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
        intersectsRange: function(range, touchingIsIntersecting) {
            assertRangeValid(this);

            if (getRangeDocument(range) != getRangeDocument(this)) {
                throw new DOMException("WRONG_DOCUMENT_ERR");
            }

            var startComparison = dom.comparePoints(this.startContainer, this.startOffset, range.endContainer, range.endOffset),
                endComparison = dom.comparePoints(this.endContainer, this.endOffset, range.startContainer, range.startOffset);

            return touchingIsIntersecting ? startComparison <= 0 && endComparison >= 0 : startComparison < 0 && endComparison > 0;
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
            if (this.intersectsRange(range, true)) {
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
            return this.intersection(range).equals(range);
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

        createNodeIterator: function(nodeTypes, filter) {
            assertRangeValid(this);
            return new RangeNodeIterator(this, nodeTypes, filter);
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

        function setRangeStartAndEnd(range, node, offset) {
            if (node !== range.startContainer || offset !== range.startOffset || node !== range.endContainer || offset !== range.endOffset) {
                boundaryUpdater(range, node, offset, node, offset);
            }
        }

        constructor.prototype = new RangePrototype();

        api.util.extend(constructor.prototype, {
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
                // This doesn't seem well specified: the spec talks only about selecting the node's contents, which
                // could be taken to mean only its children. However, browsers implement this the same as selectNode for
                // text nodes, so I shall do likewise
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
                assertRangeValid(this);


                var sc = this.startContainer, so = this.startOffset, ec = this.endContainer, eo = this.endOffset;
                var startEndSame = (sc === ec);

                if (dom.isCharacterDataNode(ec) && eo > 0 && eo < ec.length) {
                    dom.splitDataNode(ec, eo);

                }

                if (dom.isCharacterDataNode(sc) && so > 0 && so < sc.length) {

                    sc = dom.splitDataNode(sc, so);
                    if (startEndSame) {
                        eo -= so;
                        ec = sc;
                    } else if (ec == sc.parentNode && eo >= dom.getNodeIndex(sc)) {
                        eo++;
                    }
                    so = 0;

                }
                boundaryUpdater(this, sc, so, ec, eo);
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

                setRangeStartAndEnd(this, node, offset);
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
        var startMoved = (range.startContainer !== startContainer || range.startOffset !== startOffset);
        var endMoved = (range.endContainer !== endContainer || range.endOffset !== endOffset);

        range.startContainer = startContainer;
        range.startOffset = startOffset;
        range.endContainer = endContainer;
        range.endOffset = endOffset;

        updateCollapsedAndCommonAncestor(range);
        dispatchEvent(range, "boundarychange", {startMoved: startMoved, endMoved: endMoved});
    }

    function detach(range) {
        assertNotDetached(range);
        range.startContainer = range.startOffset = range.endContainer = range.endOffset = null;
        range.collapsed = range.commonAncestorContainer = null;
        dispatchEvent(range, "detach", null);
        range._listeners = null;
    }

    /**
     * @constructor
     */
    function Range(doc) {
        this.startContainer = doc;
        this.startOffset = 0;
        this.endContainer = doc;
        this.endOffset = 0;
        this._listeners = {
            boundarychange: [],
            detach: []
        };
        updateCollapsedAndCommonAncestor(this);
    }

    createPrototypeRange(Range, updateBoundaries, detach);

    api.rangePrototype = RangePrototype.prototype;

    Range.rangeProperties = rangeProperties;
    Range.RangeIterator = RangeIterator;
    Range.copyComparisonConstants = copyComparisonConstants;
    Range.createPrototypeRange = createPrototypeRange;
    Range.inspect = inspect;
    Range.getRangeDocument = getRangeDocument;
    Range.rangesEqual = function(r1, r2) {
        return r1.startContainer === r2.startContainer &&
               r1.startOffset === r2.startOffset &&
               r1.endContainer === r2.endContainer &&
               r1.endOffset === r2.endOffset;
    };

    api.DomRange = Range;
    api.RangeException = RangeException;
});rangy.createModule("WrappedRange", function(api, module) {
    api.requireModules( ["DomUtil", "DomRange"] );

    /**
     * @constructor
     */
    var WrappedRange;
    var dom = api.dom;
    var DomPosition = dom.DomPosition;
    var DomRange = api.DomRange;



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
    function getTextRangeBoundaryPosition(textRange, wholeRangeContainerElement, isStart, isCollapsed) {
        var workingRange = textRange.duplicate();

        workingRange.collapse(isStart);
        var containerElement = workingRange.parentElement();

        // Sometimes collapsing a TextRange that's at the start of a text node can move it into the previous node, so
        // check for that
        // TODO: Find out when. Workaround for wholeRangeContainerElement may break this
        if (!dom.isAncestorOf(wholeRangeContainerElement, containerElement, true)) {
            containerElement = wholeRangeContainerElement;

        }



        // Deal with nodes that cannot "contain rich HTML markup". In practice, this means form inputs, images and
        // similar. See http://msdn.microsoft.com/en-us/library/aa703950%28VS.85%29.aspx
        if (!containerElement.canHaveHTML) {
            return new DomPosition(containerElement.parentNode, dom.getNodeIndex(containerElement));
        }

        var workingNode = dom.getDocument(containerElement).createElement("span");
        var comparison, workingComparisonType = isStart ? "StartToStart" : "StartToEnd";
        var previousNode, nextNode, boundaryPosition, boundaryNode;

        // Move the working range through the container's children, starting at the end and working backwards, until the
        // working range reaches or goes past the boundary we're interested in
        do {
            containerElement.insertBefore(workingNode, workingNode.previousSibling);
            workingRange.moveToElementText(workingNode);
        } while ( (comparison = workingRange.compareEndPoints(workingComparisonType, textRange)) > 0 &&
                workingNode.previousSibling);

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
                For the particular case of a boundary within a text node containing line breaks (within a <pre> element,
                for example), we need a slightly complicated approach to get the boundary's offset in IE. The facts:

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
                boundaryPosition = new DomPosition(previousNode, previousNode.length);
            } else {
                boundaryPosition = new DomPosition(containerElement, dom.getNodeIndex(workingNode));
            }
        }

        // Clean up
        workingNode.parentNode.removeChild(workingNode);

        return boundaryPosition;
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
        // element rather than immediately before or after it, which is what we want
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
            var canSetRangeStartAfterEnd;

            function updateRangeProperties(range) {
                var i = rangeProperties.length, prop;
                while (i--) {
                    prop = rangeProperties[i];
                    range[prop] = range.nativeRange[prop];
                }
            }

            function updateNativeRange(range, startContainer, startOffset, endContainer,endOffset) {
                var startMoved = (range.startContainer !== startContainer || range.startOffset != startOffset);
                var endMoved = (range.endContainer !== endContainer || range.endOffset != endOffset);

                // Always set both boundaries for the benefit of IE9 (see issue 35)
                if (startMoved || endMoved) {
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
                    throw new Error("Range must be specified");
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

            rangeProto.deleteContents = function() {
                this.nativeRange.deleteContents();
                updateRangeProperties(this);
            };

            rangeProto.extractContents = function() {
                var frag = this.nativeRange.extractContents();
                updateRangeProperties(this);
                return frag;
            };

            rangeProto.cloneContents = function() {
                return this.nativeRange.cloneContents();
            };

            // TODO: Until I can find a way to programmatically trigger the Firefox bug (apparently long-standing, still
            // present in 3.6.8) that throws "Index or size is negative or greater than the allowed amount" for
            // insertNode in some circumstances, all browsers will have to use the Rangy's own implementation of
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
                canSetRangeStartAfterEnd = true;

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


                canSetRangeStartAfterEnd = false;

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

            // Test for WebKit bug that has the beahviour of compareBoundaryPoints round the wrong way for constants
            // START_TO_END and END_TO_START: https://bugs.webkit.org/show_bug.cgi?id=20738

            range.selectNodeContents(testTextNode);
            range.setEnd(testTextNode, 3);

            var range2 = document.createRange();
            range2.selectNodeContents(testTextNode);
            range2.setEnd(testTextNode, 4);
            range2.setStart(testTextNode, 2);

            if (range.compareBoundaryPoints(range.START_TO_END, range2) == -1 &
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

            // Test for existence of createContextualFragment and delegate to it if it exists
            if (api.util.isHostMethod(range, "createContextualFragment")) {
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
            doc = doc || document;
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
            var start, end;

            // TextRange's parentElement() method cannot be trusted. getTextRangeContainerElement() works around that.
            var rangeContainerElement = getTextRangeContainerElement(this.textRange);

            if (textRangeIsCollapsed(this.textRange)) {
                end = start = getTextRangeBoundaryPosition(this.textRange, rangeContainerElement, true, true);
            } else {

                start = getTextRangeBoundaryPosition(this.textRange, rangeContainerElement, true, false);
                end = getTextRangeBoundaryPosition(this.textRange, rangeContainerElement, false, false);
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
            doc = doc || document;
            return doc.body.createTextRange();
        };
    }

    if (api.features.implementsTextRange) {
        WrappedRange.rangeToTextRange = function(range) {
            if (range.collapsed) {
                var tr = createBoundaryTextRange(new DomPosition(range.startContainer, range.startOffset), true);



                return tr;

                //return createBoundaryTextRange(new DomPosition(range.startContainer, range.startOffset), true);
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
        doc = doc || document;
        return new WrappedRange(api.createNativeRange(doc));
    };

    api.createRangyRange = function(doc) {
        doc = doc || document;
        return new DomRange(doc);
    };

    api.createIframeRange = function(iframeEl) {
        return api.createRange(dom.getIframeDocument(iframeEl));
    };

    api.createIframeRangyRange = function(iframeEl) {
        return api.createRangyRange(dom.getIframeDocument(iframeEl));
    };

    api.addCreateMissingNativeApiListener(function(win) {
        var doc = win.document;
        if (typeof doc.createRange == "undefined") {
            doc.createRange = function() {
                return api.createRange(this);
            };
        }
        doc = win = null;
    });
});rangy.createModule("WrappedSelection", function(api, module) {
    // This will create a selection object wrapper that follows the Selection object found in the WHATWG draft DOM Range
    // spec (http://html5.org/specs/dom-range.html)

    api.requireModules( ["DomUtil", "DomRange", "WrappedRange"] );

    api.config.checkSelectionRanges = true;

    var BOOLEAN = "boolean",
        windowPropertyName = "_rangySelection",
        dom = api.dom,
        util = api.util,
        DomRange = api.DomRange,
        WrappedRange = api.WrappedRange,
        DOMException = api.DOMException,
        DomPosition = dom.DomPosition,
        getSelection,
        selectionIsCollapsed,
        CONTROL = "Control";



    function getWinSelection(winParam) {
        return (winParam || window).getSelection();
    }

    function getDocSelection(winParam) {
        return (winParam || window).document.selection;
    }

    // Test for the Range/TextRange and Selection features required
    // Test for ability to retrieve selection
    var implementsWinGetSelection = api.util.isHostMethod(window, "getSelection"),
        implementsDocSelection = api.util.isHostObject(document, "selection");

    var useDocumentSelection = implementsDocSelection && (!implementsWinGetSelection || api.config.preferTextRange);

    if (useDocumentSelection) {
        getSelection = getDocSelection;
        api.isSelectionValid = function(winParam) {
            var doc = (winParam || window).document, nativeSel = doc.selection;

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
    var selectionHasAnchorAndFocus = util.areHostObjects(testSelection, ["anchorNode", "focusNode"] &&
                                     util.areHostProperties(testSelection, ["anchorOffset", "focusOffset"]));
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
            var iframe = document.createElement("iframe");
            iframe.frameBorder = 0;
            iframe.style.position = "absolute";
            iframe.style.left = "-10000px";
            body.appendChild(iframe);

            var iframeDoc = dom.getIframeDocument(iframe);
            iframeDoc.open();
            iframeDoc.write("<html><head></head><body>12</body></html>");
            iframeDoc.close();

            var sel = dom.getIframeWindow(iframe).getSelection();
            var docEl = iframeDoc.documentElement;
            var iframeBody = docEl.lastChild, textNode = iframeBody.firstChild;

            // Test whether the native selection will allow a collapsed selection within a non-editable element
            var r1 = iframeDoc.createRange();
            r1.setStart(textNode, 1);
            r1.collapse(true);
            sel.addRange(r1);
            collapsedNonEditableSelectionsSupported = (sel.rangeCount == 1);
            sel.removeAllRanges();

            // Test whether the native selection is capable of supporting multiple ranges
            var r2 = r1.cloneRange();
            r1.setStart(textNode, 0);
            r2.setEnd(textNode, 2);
            sel.addRange(r1);
            sel.addRange(r2);

            selectionSupportsMultipleRanges = (sel.rangeCount == 2);

            // Clean up
            r1.detach();
            r2.detach();

            body.removeChild(iframe);
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

    function updateAnchorAndFocusFromRange(sel, range, backwards) {
        var anchorPrefix = backwards ? "end" : "start", focusPrefix = backwards ? "start" : "end";
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
            nativeRange = range._selectionNativeRange;
            if (!nativeRange) {
                nativeRange = api.createNativeRange(dom.getDocument(range.startContainer));
                nativeRange.setEnd(range.endContainer, range.endOffset);
                nativeRange.setStart(range.startContainer, range.startOffset);
                range._selectionNativeRange = nativeRange;
                range.attachListener("detach", function() {

                    this._selectionNativeRange = null;
                });
            }
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
            throw new Error("getSingleElementFromRange: range " + range.inspect() + " did not consist of a single element");
        }
        return nodes[0];
    }

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
            throw new Error("addRange(): Element within the specified Range could not be added to control selection (does it have layout?)");
        }
        newControlRange.select();

        // Update the wrapped selection based on what's now in the native selection
        updateControlSelection(sel);
    }

    var getSelectionRangeAt;

    if (util.isHostMethod(testSelection,  "getRangeAt")) {
        getSelectionRangeAt = function(sel, index) {
            try {
                return sel.getRangeAt(index);
            } catch(ex) {
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

    /**
     * @constructor
     */
    function WrappedSelection(selection, docSelection, win) {
        this.nativeSelection = selection;
        this.docSelection = docSelection;
        this._ranges = [];
        this.win = win;
        this.refresh();
    }

    api.getSelection = function(win) {
        win = win || window;
        var sel = win[windowPropertyName];
        var nativeSel = getSelection(win), docSel = implementsDocSelection ? getDocSelection(win) : null;
        if (sel) {
            sel.nativeSelection = nativeSel;
            sel.docSelection = docSel;
            sel.refresh(win);
        } else {
            sel = new WrappedSelection(nativeSel, docSel, win);
            win[windowPropertyName] = sel;
        }
        return sel;
    };

    api.getIframeSelection = function(iframeEl) {
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
                throw new Error("setRanges(): Element within the one of the specified Ranges could not be added to control selection (does it have layout?)");
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

        var addRangeBackwards = function(sel, range) {
            var doc = DomRange.getRangeDocument(range);
            var endRange = api.createRange(doc);
            endRange.collapseToPoint(range.endContainer, range.endOffset);
            sel.nativeSelection.addRange(getNativeRange(endRange));
            sel.nativeSelection.extend(range.startContainer, range.startOffset);
            sel.refresh();
        };

        if (selectionHasRangeCount) {
            selProto.addRange = function(range, backwards) {
                if (implementsControlRange && implementsDocSelection && this.docSelection.type == CONTROL) {
                    addRangeToControlSelection(this, range);
                } else {
                    if (backwards && selectionHasExtend) {
                        addRangeBackwards(this, range);
                    } else {
                        var previousRangeCount;
                        if (selectionSupportsMultipleRanges) {
                            previousRangeCount = this.rangeCount;
                        } else {
                            this.removeAllRanges();
                            previousRangeCount = 0;
                        }
                        this.nativeSelection.addRange(getNativeRange(range));

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
                            updateAnchorAndFocusFromRange(this, range, selectionIsBackwards(this.nativeSelection));
                            this.isCollapsed = selectionIsCollapsed(this);
                        } else {
                            // The range was not added successfully. The simplest thing is to refresh
                            this.refresh();
                        }
                    }
                }
            };
        } else {
            selProto.addRange = function(range, backwards) {
                if (backwards && selectionHasExtend) {
                    addRangeBackwards(this, range);
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
            return this._ranges[index];
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
                    updateAnchorAndFocusFromRange(sel, sel._ranges[sel.rangeCount - 1], selectionIsBackwards(sel.nativeSelection));
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
        refreshSelection(this);
        if (checkForChanges) {
            var i = oldRanges.length;
            if (i != this._ranges.length) {
                return false;
            }
            while (i--) {
                if (!DomRange.rangesEqual(oldRanges[i], this._ranges[i])) {
                    return false;
                }
            }
            return true;
        }
    };

    // Removal of a single range
    var removeRangeManually = function(sel, range) {
        var ranges = sel.getAllRanges(), removed = false;
        sel.removeAllRanges();
        for (var i = 0, len = ranges.length; i < len; ++i) {
            if (removed || range !== ranges[i]) {
                sel.addRange(ranges[i]);
            } else {
                // According to the draft WHATWG Range spec, the same range may be added to the selection multiple
                // times. removeRange should only remove the first instance, so the following ensures only the first
                // instance is removed
                removed = true;
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

    // Detecting if a selection is backwards
    var selectionIsBackwards;
    if (!useDocumentSelection && selectionHasAnchorAndFocus && api.features.implementsDomRange) {
        selectionIsBackwards = function(sel) {
            var backwards = false;
            if (sel.anchorNode) {
                backwards = (dom.comparePoints(sel.anchorNode, sel.anchorOffset, sel.focusNode, sel.focusOffset) == 1);
            }
            return backwards;
        };

        selProto.isBackwards = function() {
            return selectionIsBackwards(this);
        };
    } else {
        selectionIsBackwards = selProto.isBackwards = function() {
            return false;
        };
    }

    // Selection text
    // This is conformant to the new WHATWG DOM Range draft spec but differs from WebKit and Mozilla's implementation
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

    // No current browsers conform fully to the HTML 5 draft spec for this method, so Rangy's own method is always used
    selProto.collapse = function(node, offset) {
        assertNodeInSameDocument(this, node);
        var range = api.createRange(dom.getDocument(node));
        range.collapseToPoint(node, offset);
        this.removeAllRanges();
        this.addRange(range);
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

    // The HTML 5 spec is very specific on how selectAllChildren should be implemented so the native implementation is
    // never used by Rangy.
    selProto.selectAllChildren = function(node) {
        assertNodeInSameDocument(this, node);
        var range = api.createRange(dom.getDocument(node));
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
            this.removeAllRanges();
            for (var i = 0, len = ranges.length; i < len; ++i) {
                ranges[i].deleteContents();
            }
            // The HTML5 spec says nothing about what the selection should contain after calling deleteContents on each
            // range. Firefox moves the selection to where the final selected range was, so we emulate that
            this.addRange(ranges[len - 1]);
        }
    };

    // The following are non-standard extensions
    selProto.getAllRanges = function() {
        return this._ranges.slice(0);
    };

    selProto.setSingleRange = function(range) {
        this.setRanges( [range] );
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
        var html = "";
        if (this.rangeCount) {
            var container = DomRange.getRangeDocument(this._ranges[0]).createElement("div");
            for (var i = 0, len = this._ranges.length; i < len; ++i) {
                container.appendChild(this._ranges[i].cloneContents());
            }
            html = container.innerHTML;
        }
        return html;
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
        this.win[windowPropertyName] = null;
        this.win = this.anchorNode = this.focusNode = null;
    };

    WrappedSelection.inspect = inspect;

    api.Selection = WrappedSelection;

    api.selectionPrototype = selProto;

    api.addCreateMissingNativeApiListener(function(win) {
        if (typeof win.getSelection == "undefined") {
            win.getSelection = function() {
                return api.getSelection(this);
            };
        }
        win = null;
    });
});
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
 * Version: 1.2.3
 * Build date: 26 February 2012
 */
rangy.createModule("CssClassApplier", function(api, module) {
    api.requireModules( ["WrappedSelection", "WrappedRange"] );

    var dom = api.dom;



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
                el.className = el.className.replace(new RegExp("(?:^|\\s)" + cssClass + "(?:\\s|$)"), replacer);
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

    function replaceWithOwnChildren(el) {

        var parent = el.parentNode;
        while (el.hasChildNodes()) {
            parent.insertBefore(el.firstChild, el);
        }
        parent.removeChild(el);
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
        for (var p in props) {
            if (props.hasOwnProperty(p) && el[p] !== props[p]) {
                return false;
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

    function splitNodeAt(node, descendantNode, descendantOffset, rangesToPreserve) {
        var newNode;
        var splitAtStart = (descendantOffset == 0);

        if (dom.isAncestorOf(descendantNode, node)) {

            return node;
        }

        if (dom.isCharacterDataNode(descendantNode)) {
            if (descendantOffset == 0) {
                descendantOffset = dom.getNodeIndex(descendantNode);
                descendantNode = descendantNode.parentNode;
            } else if (descendantOffset == descendantNode.length) {
                descendantOffset = dom.getNodeIndex(descendantNode) + 1;
                descendantNode = descendantNode.parentNode;
            } else {
                throw module.createError("splitNodeAt should not be called with offset in the middle of a data node ("
                    + descendantOffset + " in " + descendantNode.data);
            }
        }

        if (isSplitPoint(descendantNode, descendantOffset)) {
            if (!newNode) {
                newNode = descendantNode.cloneNode(false);
                if (newNode.id) {
                    newNode.removeAttribute("id");
                }
                var child;
                while ((child = descendantNode.childNodes[descendantOffset])) {
                    newNode.appendChild(child);
                }
                dom.insertAfter(newNode, descendantNode);
            }
            return (descendantNode == node) ? newNode : splitNodeAt(node, newNode.parentNode, dom.getNodeIndex(newNode), rangesToPreserve);
        } else if (node != descendantNode) {
            newNode = descendantNode.parentNode;

            // Work out a new split point in the parent node
            var newNodeIndex = dom.getNodeIndex(descendantNode);

            if (!splitAtStart) {
                newNodeIndex++;
            }
            return splitNodeAt(node, newNode, newNodeIndex, rangesToPreserve);
        }
        return node;
    }

    function areElementsMergeable(el1, el2) {
        return el1.tagName == el2.tagName && haveSameClasses(el1, el2) && elementsHaveSameNonClassAttributes(el1, el2);
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
        }
    }

    var getPreviousMergeableTextNode = createAdjacentMergeableTextNodeGetter(false),
        getNextMergeableTextNode = createAdjacentMergeableTextNodeGetter(true);


    function Merge(firstNode) {
        this.isElementMerge = (firstNode.nodeType == 1);
        this.firstTextNode = this.isElementMerge ? firstNode.lastChild : firstNode;
        this.textNodes = [this.firstTextNode];
    }

    Merge.prototype = {
        doMerge: function() {
            var textBits = [], textNode, parent, text;
            for (var i = 0, len = this.textNodes.length; i < len; ++i) {
                textNode = this.textNodes[i];
                parent = textNode.parentNode;
                textBits[i] = textNode.data;
                if (i) {
                    parent.removeChild(textNode);
                    if (!parent.hasChildNodes()) {
                        parent.parentNode.removeChild(parent);
                    }
                }
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

    var optionProperties = ["elementTagName", "ignoreWhiteSpace", "applyToEditableOnly"];

    // Allow "class" as a property name in object properties
    var mappedPropertyNames = {"class" : "className"};

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

        // Backwards compatibility: the second parameter can also be a Boolean indicating whether normalization
        this.normalize = (typeof normalize == "undefined") ? true : normalize;

        // Initialize element properties and attribute exceptions
        this.attrExceptions = [];
        var el = document.createElement(this.elementTagName);
        this.elementProperties = {};
        for (var p in elementPropertiesFromOptions) {
            if (elementPropertiesFromOptions.hasOwnProperty(p)) {
                // Map "class" to "className"
                if (mappedPropertyNames.hasOwnProperty(p)) {
                    p = mappedPropertyNames[p];
                }
                el[p] = elementPropertiesFromOptions[p];

                // Copy the property back from the dummy element so that later comparisons to check whether elements
                // may be removed are checking against the right value. For example, the href property of an element
                // returns a fully qualified URL even if it was previously assigned a relative URL.
                this.elementProperties[p] = el[p];
                this.attrExceptions.push(p);
            }
        }

        this.elementSortedClassName = this.elementProperties.hasOwnProperty("className") ?
            sortClassName(this.elementProperties.className + " " + cssClass) : cssClass;

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

        hasClass: function(node) {
            return node.nodeType == 1 && dom.arrayContains(this.tagNames, node.tagName.toLowerCase()) && hasClass(node, this.cssClass);
        },

        getSelfOrAncestorWithClass: function(node) {
            while (node) {
                if (this.hasClass(node, this.cssClass)) {
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
        postApply: function(textNodes, range, isUndo) {

            var firstNode = textNodes[0], lastNode = textNodes[textNodes.length - 1];

            var merges = [], currentMerge;

            var rangeStartNode = firstNode, rangeEndNode = lastNode;
            var rangeStartOffset = 0, rangeEndOffset = lastNode.length;

            var textNode, precedingTextNode;

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

            // Do the merges
            if (merges.length) {

                for (i = 0, len = merges.length; i < len; ++i) {
                    merges[i].doMerge();
                }


                // Set the range boundaries
                range.setStart(rangeStartNode, rangeStartOffset);
                range.setEnd(rangeEndNode, rangeEndOffset);
            }

        },

        createContainer: function(doc) {
            var el = doc.createElement(this.elementTagName);
            api.util.extend(el, this.elementProperties);
            addClass(el, this.cssClass);
            return el;
        },

        applyToTextNode: function(textNode) {


            var parent = textNode.parentNode;
            if (parent.childNodes.length == 1 && dom.arrayContains(this.tagNames, parent.tagName.toLowerCase())) {
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

        undoToTextNode: function(textNode, range, ancestorWithClass) {

            if (!range.containsNode(ancestorWithClass)) {
                // Split out the portion of the ancestor from which we can remove the CSS class
                //var parent = ancestorWithClass.parentNode, index = dom.getNodeIndex(ancestorWithClass);
                var ancestorRange = range.cloneRange();
                ancestorRange.selectNode(ancestorWithClass);

                if (ancestorRange.isPointInRange(range.endContainer, range.endOffset)/* && isSplitPoint(range.endContainer, range.endOffset)*/) {
                    splitNodeAt(ancestorWithClass, range.endContainer, range.endOffset, [range]);
                    range.setEndAfter(ancestorWithClass);
                }
                if (ancestorRange.isPointInRange(range.startContainer, range.startOffset)/* && isSplitPoint(range.startContainer, range.startOffset)*/) {
                    ancestorWithClass = splitNodeAt(ancestorWithClass, range.startContainer, range.startOffset, [range]);
                }
            }

            if (this.isRemovable(ancestorWithClass)) {
                replaceWithOwnChildren(ancestorWithClass);
            } else {
                removeClass(ancestorWithClass, this.cssClass);
            }
        },

        applyToRange: function(range) {
            range.splitBoundaries();
            var textNodes = getEffectiveTextNodes(range);

            if (textNodes.length) {
                var textNode;

                for (var i = 0, len = textNodes.length; i < len; ++i) {
                    textNode = textNodes[i];

                    if (!this.isIgnorableWhiteSpaceNode(textNode) && !this.getSelfOrAncestorWithClass(textNode)
                            && this.isModifiable(textNode)) {
                        this.applyToTextNode(textNode);
                    }
                }
                range.setStart(textNodes[0], 0);
                textNode = textNodes[textNodes.length - 1];
                range.setEnd(textNode, textNode.length);
                if (this.normalize) {
                    this.postApply(textNodes, range, false);
                }
            }
        },

        applyToSelection: function(win) {

            win = win || window;
            var sel = api.getSelection(win);

            var range, ranges = sel.getAllRanges();
            sel.removeAllRanges();
            var i = ranges.length;
            while (i--) {
                range = ranges[i];
                this.applyToRange(range);
                sel.addRange(range);
            }

        },

        undoToRange: function(range) {

            range.splitBoundaries();
            var textNodes = getEffectiveTextNodes(range);
            var textNode, ancestorWithClass;
            var lastTextNode = textNodes[textNodes.length - 1];

            if (textNodes.length) {
                for (var i = 0, len = textNodes.length; i < len; ++i) {
                    textNode = textNodes[i];
                    ancestorWithClass = this.getSelfOrAncestorWithClass(textNode);
                    if (ancestorWithClass && this.isModifiable(textNode)) {
                        this.undoToTextNode(textNode, range, ancestorWithClass);
                    }

                    // Ensure the range is still valid
                    range.setStart(textNodes[0], 0);
                    range.setEnd(lastTextNode, lastTextNode.length);
                }



                if (this.normalize) {
                    this.postApply(textNodes, range, true);
                }
            }
        },

        undoToSelection: function(win) {
            win = win || window;
            var sel = api.getSelection(win);
            var ranges = sel.getAllRanges(), range;
            sel.removeAllRanges();
            for (var i = 0, len = ranges.length; i < len; ++i) {
                range = ranges[i];
                this.undoToRange(range);
                sel.addRange(range);
            }
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

        isAppliedToSelection: function(win) {
            win = win || window;
            var sel = api.getSelection(win);
            var ranges = sel.getAllRanges();
            var i = ranges.length;
            while (i--) {
                if (!this.isAppliedToRange(ranges[i])) {
                    return false;
                }
            }

            return true;
        },

        toggleRange: function(range) {
            if (this.isAppliedToRange(range)) {
                this.undoToRange(range);
            } else {
                this.applyToRange(range);
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
        replaceWithOwnChildren: replaceWithOwnChildren,
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
 * Version: 1.2.3
 * Build date: 26 February 2012
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

    function saveSelection(win) {
        win = win || window;
        var doc = win.document;
        if (!api.isSelectionValid(win)) {
            module.warn("Cannot save selection. This usually happens when the selection is collapsed and the selection document has lost focus.");
            return;
        }
        var sel = api.getSelection(win);
        var ranges = sel.getAllRanges();
        var rangeInfos = [], startEl, endEl, range;

        // Order the ranges by position within the DOM, latest first
        ranges.sort(compareRanges);

        for (var i = 0, len = ranges.length; i < len; ++i) {
            range = ranges[i];
            if (range.collapsed) {
                endEl = insertRangeBoundaryMarker(range, false);
                rangeInfos.push({
                    markerId: endEl.id,
                    collapsed: true
                });
            } else {
                endEl = insertRangeBoundaryMarker(range, false);
                startEl = insertRangeBoundaryMarker(range, true);

                rangeInfos[i] = {
                    startMarkerId: startEl.id,
                    endMarkerId: endEl.id,
                    collapsed: false,
                    backwards: ranges.length == 1 && sel.isBackwards()
                };
            }
        }

        // Now that all the markers are in place and DOM manipulation over, adjust each range's boundaries to lie
        // between its markers
        for (i = len - 1; i >= 0; --i) {
            range = ranges[i];
            if (range.collapsed) {
                range.collapseBefore(gEBI(rangeInfos[i].markerId, doc));
            } else {
                range.setEndBefore(gEBI(rangeInfos[i].endMarkerId, doc));
                range.setStartAfter(gEBI(rangeInfos[i].startMarkerId, doc));
            }
        }

        // Ensure current selection is unaffected
        sel.setRanges(ranges);
        return {
            win: win,
            doc: doc,
            rangeInfos: rangeInfos,
            restored: false
        };
    }

    function restoreSelection(savedSelection, preserveDirection) {
        if (!savedSelection.restored) {
            var rangeInfos = savedSelection.rangeInfos;
            var sel = api.getSelection(savedSelection.win);
            var ranges = [];

            // Ranges are in reverse order of appearance in the DOM. We want to restore earliest first to avoid
            // normalization affecting previously restored ranges.
            for (var len = rangeInfos.length, i = len - 1, rangeInfo, range; i >= 0; --i) {
                rangeInfo = rangeInfos[i];
                range = api.createRange(savedSelection.doc);
                if (rangeInfo.collapsed) {
                    var markerEl = gEBI(rangeInfo.markerId, savedSelection.doc);
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
                    setRangeBoundary(savedSelection.doc, range, rangeInfo.startMarkerId, true);
                    setRangeBoundary(savedSelection.doc, range, rangeInfo.endMarkerId, false);
                }

                // Normalizing range boundaries is only viable if the selection contains only one range. For example,
                // if the selection contained two ranges that were both contained within the same single text node,
                // both would alter the same text node when restoring and break the other range.
                if (len == 1) {
                    range.normalizeBoundaries();
                }
                ranges[i] = range;
            }
            if (len == 1 && preserveDirection && api.features.selectionHasExtend && rangeInfos[0].backwards) {
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

    api.saveSelection = saveSelection;
    api.restoreSelection = restoreSelection;
    api.removeMarkerElement = removeMarkerElement;
    api.removeMarkers = removeMarkers;
});
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
 * Version: 1.2.3
 * Build date: 26 February 2012
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
                node = node.childNodes[parseInt(nodeIndices[i], 10)];
            } else {
                throw module.createError("deserializePosition failed: node " + dom.inspectNode(node) +
                        " has no child with index " + nodeIndex + ", " + i);
            }
        }

        return new dom.DomPosition(node, parseInt(bits[1], 10));
    }

    function serializeRange(range, omitChecksum, rootNode) {
        rootNode = rootNode || api.DomRange.getRangeDocument(range).documentElement;
        if (!dom.isAncestorOf(rootNode, range.commonAncestorContainer, true)) {
            throw new Error("serializeRange: range is not wholly contained within specified root node");
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
        var result = /^([^,]+),([^,\{]+)({([^}]+)})?$/.exec(serialized);
        var checksum = result[4], rootNodeChecksum = getElementChecksum(rootNode);
        if (checksum && checksum !== getElementChecksum(rootNode)) {
            throw new Error("deserializeRange: checksums of serialized range root node (" + checksum +
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
        var result = /^([^,]+),([^,]+)({([^}]+)})?$/.exec(serialized);
        var checksum = result[3];
        return !checksum || checksum === getElementChecksum(rootNode);
    }

    function serializeSelection(selection, omitChecksum, rootNode) {
        selection = selection || api.getSelection();
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
            deserializeSelection(serialized, win.doc)
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
});
/*
 * jQuery Hotkeys Plugin
 * Copyright 2010, John Resig
 * Dual licensed under the MIT or GPL Version 2 licenses.
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

})( jQuery );(function($, window, rangy, undefined) {/**
 * @name $
 * @namespace jQuery
 */

/**
 * jQuery UI Editor
 *
 * <p>
 * Events:
 * <dl>
 *   <dt>resize</dt>
 *     <dd>Triggers when the page, or an element is resized to allow plugins to adjust their position</dt>
 *   <dt>change</dt>
 *     <dd>Triggers when ever the element content is change, or the selection is changed</dt>
 *   <dt>ready</dt>
 *     <dd>Triggers after the editor has been initialised, (but possibly before the editor is shown and enabled)</dt>
 *   <dt>show</dt>
 *     <dd>Triggers when the toolbar/dialog is shown</dt>
 *   <dt>hide</dt>
 *     <dd>Triggers when the toolbar/dialog is hidden</dt>
 *   <dt>enabled</dt>
 *     <dd>Triggers when the editing is enabled on the element</dt>
 *   <dt>disabled</dt>
 *     <dd>Triggers when the editing is disabled on the element</dt>
 * </dl>
 * </p>
 *
 * Naming Conventions:
 * In function names and parameters the following keywords mean:
 *  - node: A DOM node
 *  - tag: The tag name, e.g. h1, h2, p, a, etc
 *  - element: A jQuery element, selector, not HTML string (use $.parseHTML instead)
 *
 * @name $.editor
 * @class
 */

/**
 * @name $.ui
 * @namespace  jQuery UI
 */

/**
 * jQuery UI Editor
 * @name $.ui.editor
 * @namespace jQuery UI Editor
 */

/**
 * Default settings for the jQuery UI Editor widget
 * @name $.editor#options
 * @property {boolean} options
 */

/**
 * @name $.editor#reiniting
 * @property {boolean} reiniting
 */

/**
 * @name $.editor#ready
 * @property {boolean} ready
 */

/**
 * @name $.editor#element
 * @property {jQuery} element
 */

/**
 * @name $.editor#toolbar
 * @property {jQuery} toolbar
 */

/**
 * @name $.editor#events
 * @property {Object} events
 */

/**
 * @name $.editor#ui
 * @property {Object} ui
 */

/**
 * @name $.editor#plugins
 * @property {Object} plugins
 */

/**
 * @name $.editor#templates
 * @property {Object} templates
 */

/**
 * @name $.editor#history
 * @property {String[]} history
 */

/**
 * @name $.editor#present
 * @property {int} present
 */

/**
 * Switch to temporarly disable history function. Used when the history is being
 * traversed.
 *
 * @name $.editor#historyEnabled
 * @property {boolean} historyEnabled
 */

/**
 * @name $.editor#originalHtml
 * @property {String} originalHtml
 */

/**
 * @name $.editor.ui
 * @namespace Namespace beneath which all ui components reside
 */

/**
 * @name $.editor.plugin
 * @namespace Namespace beneath which all plugins reside
 *//**
 * @fileOverview This file has contains functions for making adjustments to the
 *      DOM based on ranges, selections, etc.
 * @author David Neilsen - david@panmedia.co.nz
 * @author Michael Robinson - michael@panmedia.co.nz
 * @version 0.2
 */

/**
 * Functions attached to the editor object during editor initialisation. Usage example:
 * <pre>selectionSave();
// Perform actions that could remove focus from editing element
selectionRestore();
selectionReplace('&lt;p&gt;Replace selection with this&lt;/p&gt;');</pre>
 * @namespace
 */
var domTools = {

    /**
     * Removes all ranges from a selection that are not contained within the
     * supplied element.
     *
     * @public @static
     * @param {jQuerySelector|jQuery|Element} element
     * @param {RangySelection} [selection]
     */
    constrainSelection: function(element, selection) {
        element = $(element)[0];
        selection = selection || rangy.getSelection();

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
    },

    unwrapParentTag: function(tag) {
        selectionGetElements().each(function(){
            if ($(this).is(tag)) {
                $(this).replaceWith($(this).html());
            }
        });
    },

    /**
     * Wrapper function for document.execCommand().
     * @public @static
     */
    execCommand: function(command, arg1, arg2) {
        try {
            document.execCommand(command, arg1, arg2);
        } catch (exception) { }
    },

    /**
     * Creates a new elements and inserts it at the start of each range in a selection.
     *
     * @public @static
     * @param {String} tagName
     * @param {RangySelection} [sel] A RangySelection, or by default, the current selection.
     */
    insertTag: function(tagName, sel) {
        selectionEachRange(function(range) {
            range.insertNode($('<' + tagName + '/>')[0]);
        }, sel, this);
    },

    /**
     * Creates a new elements and inserts it at the end of each range in a selection.
     *
     * @public @static
     * @param {String} tagName
     * @param {RangySelection} [sel] A RangySelection, or by default, the current selection.
     */
    insertTagAtEnd: function(tagName, sel) {
        selectionEachRange(function(range) {
            range.insertNodeAtEnd($('<' + tagName + '/>')[0]);
        }, sel, this);
    },

    /**
     * Inserts a element at the start of each range in a selection. If the clone
     * parameter is true (default) then the each node in the element will be cloned
     * (copied). If false, then each node will be moved.
     *
     * @public @static
     * @param {jQuerySelector|jQuery|Element} element The jQuery element to insert
     * @param {boolean} [clone] Switch to indicate if the nodes chould be cloned
     * @param {RangySelection} [sel] A RangySelection, or by default, the current selection.
     */
    insertElement: function(element, clone, sel) {
        selectionEachRange(function(range) {
            $(element).each(function() {
                range.insertNode(clone === false ? this : this.cloneNode(true));
            });
        }, sel, this);
    },

    /**
     * Inserts a element at the end of each range in a selection. If the clone
     * paramter is true (default) then the each node in the element will be cloned
     * (copied). If false, then each node will be moved.
     *
     * @public @static
     * @param {jQuerySelector|jQuery|Element} element The jQuery element to insert
     * @param {boolean} [clone] Switch to indicate if the nodes chould be cloned
     * @param {RangySelection} [selection] A RangySelection, or by default, the current selection.
     */
    insertElementAtEnd: function(element, clone, sel) {
        selectionEachRange(function(range) {
            $(element).each(function() {
                range.insertNodeAtEnd(clone === false ? this : this.cloneNode(true));
            });
        }, sel, this);
    },

    /**
     * Toggles style(s) on the first block level parent element of each range in a selection
     *
     * @public @static
     * @param {Object} styles styles to apply
     * @param {jQuerySelector|jQuery|Element} limit The parent limit element.
     * If there is no block level elements before the limit, then the limit content
     * element will be wrapped with a "div"
     */
    toggleBlockStyle: function(styles, limit) {
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
                    this.wrapInner(limit, 'div');
                    // Set the parent to the wrapper
                    parent = limit.children().first();
                }
            }
            // Apply the style to the parent
            this.toggleStyle(parent, styles);
        }, null, this);
    },

    /**
     * Wraps the inner content of an element with a tag
     *
     * @public @static
     * @param {jQuerySelector|jQuery|Element} element The element(s) to wrap
     * @param {String} tag The wrapper tag name
     */
    wrapInner: function(element, tag) {
        selectionSave();
        $(element).each(function() {
            var wrapper = $('<' + tag + '/>').html($(this).html());
            element.html(wrapper);
        });
        selectionRestore();
    },

    /**
     *
     */
    inverseWrapWithTagClass: function(tag1, class1, tag2, class2) {
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
    },

    /**
     * FIXME: this function needs reviewing
     * @public @static
     * @param {jQuerySelector|jQuery|Element} element The jQuery element to insert
     */
    toggleStyle: function(element, styles) {
        $.each(styles, function(property, value) {
            if ($(element).css(property) === value) {
                $(element).css(property, '');
            } else {
                $(element).css(property, value);
            }
        });
    },

    /**
     * FIXME: this function needs reviewing
     * @param {jQuerySelector|jQuery|Element} element
     */
    getStyles: function(element) {
        var result = {};
        var style = window.getComputedStyle(element[0], null);
        for (var i = 0; i < style.length; i++) {
            result[style.item(i)] = style.getPropertyValue(style.item(i));
        }
        return result;
    },

    /**
     * @public @static
     * @param {jQuerySelector|jQuery|Element} element1
     * @param {jQuerySelector|jQuery|Element} element2
     * @param {Object} style
     */
    swapStyles: function(element1, element2, style) {
        for (var name in style) {
            element1.css(name, element2.css(name));
            element2.css(name, style[name]);
        }
    }

};/**
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
    if (!currentLocale) currentLocale = name;
}

/**
 * @param {String} key
 */
function setLocale(key) {
    if (currentLocale !== key) {
        // <debug/>

        currentLocale = key;
        $.ui.editor.eachInstance(function() {
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
            locales[currentLocale][string]) {
        string = locales[currentLocale][string];
    }

    // Convert the variables
    if (!variables) {
        return string;
    } else {
        for (var key in variables) {
            string = string.replace('{{' + key + '}}', variables[key]);
        }
        return string;
    }
}
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
/**
 *
 * @author David Neilsen - david@panmedia.co.nz
 * @author Michael Robinson - michael@panmedia.co.nz
 * @version 0.1
 * @requires jQuery
 * @requires jQuery UI
 * @requires Rangy
 */

$.widget('ui.editor',
    /**
     * @lends $.editor.prototype
     */
    {

    /**
     * Constructor
     */
    _init: function() {
        // Add the editor instance to the global list of instances
        if ($.inArray(this, $.ui.editor.instances) === -1) {
            $.ui.editor.instances.push(this);
        }

        // Check for nested editors
        var currentInstance = this;
        $.ui.editor.eachInstance(function(instance) {
            if (currentInstance != instance &&
                    currentInstance.element.closest(instance.element).length) {
                handleError('Nesting editors is unsupported', currentInstance.element, instance.element);
            }
        });

        this.options = $.extend({}, $.ui.editor.defaults, this.options);

        // Set the options after the widget initialisation, because jQuery UI widget tries to extend the array (and breaks it)
        this.options.uiOrder = this.options.uiOrder || [
            ['logo'],
            ['save', 'cancel'],
            ['dock', 'showGuides', 'clean'],
            ['viewSource'],
            ['undo', 'redo'],
            ['alignLeft', 'alignCenter', 'alignJustify', 'alignRight'],
            ['textBold', 'textItalic', 'textUnderline', 'textStrike'],
            ['textSuper', 'textSub'],
            ['listUnordered', 'listOrdered'],
            ['hr', 'quoteBlock'],
            ['fontSizeInc', 'fontSizeDec'],
            ['colorPickerBasic'],
            ['clearFormatting'],
            ['link', 'unlink'],
            ['embed'],
            ['floatLeft', 'floatNone', 'floatRight'],
            ['tagMenu'],
            ['i18n'],
            ['raptorize'],
            ['length'],
            ['debugReinit', 'debugDestroy']
        ];

        // Give the element a unique ID
        if (!this.element.attr('id')) {
            this.element.attr('id', this.getUniqueId());
        }

        // Initialise properties
        this.ready = false;
        this.events = {};
        this.ui = {};
        this.plugins = {};
        this.templates = $.extend({}, $.ui.editor.templates);

        // jQuery DOM elements
        this.wrapper = null;
        this.toolbar = null;
        this.toolbarWrapper = null;
        this.path = null;

        // True if editing is enabled
        this.enabled = false;

        // True if the toolbar has been loaded and displayed
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

        // Clone the DOM tools functions
        this.cloneDomTools();

        // Store the original HTML
        this.setOriginalHtml(this.element.is(':input') ? this.element.val() : this.element.html());

        // Replace the original element with a div (if specified)
        if (this.options.replace) {
            this.replaceOriginal();
            this.options.replace = false;
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

        // Fire the ready event
        this.ready = true;
        this.fire('ready');

        // Automatically enable the editor if autoEnable is true
        if (this.options.autoEnable) {
            $(function() {
                currentInstance.enableEditing();
                currentInstance.showToolbar();
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
        this.bind('selectionChange', this.updateTagTree);
        this.bind('show', this.updateTagTree);

        var change = $.proxy(this.checkChange, this);

        this.getElement().find('img').bind('click.' + this.widgetName, $.proxy(function(event){
            selectionSelectOuter(event.target);
        }, this));
        // this.bind('change', change);
        this.getElement().bind('mouseup.' + this.widgetName, change);
        this.getElement().bind('keyup.' + this.widgetName, change);

        // Unload warning
        $(window).bind('beforeunload', $.proxy($.ui.editor.unloadWarning, $.ui.editor));
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
        this.destruct();
        this._init();

        // Restore the editor state
        if (enabled) {
            this.enableEditing();
        }

        if (visible) {
            this.showToolbar();
        }
    },

    /**
     * Returns the current content editable element, which will be either the
     * orignal element, or the div the orignal element was replaced with.
     * @returns {jQuery} The current content editable element
     */
    getElement: function() {
        return this.target ? this.target : this.element;
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
            .html(this.element.is(':input') ? this.element.val() : this.element.html())
            // Insert the div before the origianl element
            .insertBefore(this.element)
            // Give the div a unique ID
            .attr('id', this.getUniqueId())
            // Copy the original elements class(es) to the replacement div
            .addClass(this.element.attr('class'));

        var style = this.options.domTools.getStyles(this.element);
        for (var i = 0; i < this.options.replaceStyle.length; i++) {
            target.css(this.options.replaceStyle[i], style[this.options.replaceStyle[i]]);
        }

        this.element.hide();
        this.bind('change', function() {
            if (this.element.is('input, textarea')) {
                this.element.val(this.getHtml());
            } else {
                this.element.html(this.getHtml());
            }
        });
        this.target = target;
    },

    /**
     * Clones all of the DOM tools functions, and constrains the selection before
     * calling.
     */
    cloneDomTools: function() {
        for (var i in this.options.domTools) {
            if (!this[i]) {
                this[i] = (function(i) {
                    return function() {
                        this.options.domTools.constrainSelection(this.getElement());
                        var html = this.getHtml();
                        var result = this.options.domTools[i].apply(this.options.domTools, arguments);
                        if (html !== this.getHtml()) {
                            // <debug/>
                            this.change();
                        }
                        return result;
                    };
                })(i);
            }
        }
    },

    /**
     * Determine whether the editing element's content has been changed.
     */
    checkChange: function() {
        // Check if the caret has changed position
        var currentSelection = rangy.serializeSelection();
        if (this.previousSelection !== currentSelection) {
            this.fire('selectionChange');
        }
        this.previousSelection = currentSelection;

        // Get the current content
        var currentHtml = this.getCleanHtml();

        // Check if the dirty state has changed
        var wasDirty = this.dirty;

        // Check if the current content is different from the original content
        this.dirty = this.getOriginalHtml() !== currentHtml;

        // If the current content has changed since the last check, fire the change event
        if (this.previousHtml !== currentHtml) {
            this.previousHtml = currentHtml;
            this.change();

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
    destruct: function() {
        // Disable editing unless we are re initialising
        this.hideToolbar();
        this.disableEditing();

        // Trigger destroy event, for plugins to remove them selves
        this.fire('destroy', false);

        // Remove all event bindings
        this.events = {};

        // Unbind all events
        this.getElement().unbind('.' + this.widgetName);

        // Remove element
        if (this.wrapper) {
            this.wrapper.remove();
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
     * Persistance Functions
    \*========================================================================*/

    /**
     * @param {String} key
     * @param {mixed} [value]
     * @returns {mixed}
     */
    persist: function(key, value) {
        if (!this.options.persistence) return null;
        return $.ui.editor.persist(key, value, this.options.namespace);
    },

    /*========================================================================*\
     * Other Functions
    \*========================================================================*/

    /**
     *
     */
    enableEditing: function() {
        // Check if the toolbar is yet to be loaded
        if (!this.isToolbarLoaded()) {
            this.loadToolbar();
        }

        if (!this.enabled) {
            this.enabled = true;
            this.getElement().addClass(this.options.baseClass + '-editing');

            if (this.options.partialEdit) {
                this.getElement().find(this.options.partialEdit).attr('contenteditable', true);
            } else {
                this.getElement().attr('contenteditable', true);
            }

            this.execCommand('enableInlineTableEditing', false, false);
            this.execCommand('styleWithCSS', true, true);

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

    /**
     *
     * @returns {boolean}
     */
    isEditing: function() {
        return this.enabled;
    },

    /**
     *
     */
    updateTagTree: function() {
        if (!this.isEditing()) return;

        var editor = this;
        var title = '';

        // An array of ranges (by index), each with a list of elements in the range
        var lists = [];
        var i = 0;

        // Loop all selected ranges
        selectionEachRange(function(range) {
            // Get the selected nodes common parent
            var node = range.commonAncestorContainer;

            var element;
            if (node.nodeType === 3) {
                // If nodes common parent is a text node, then use its parent
                element = $(node).parent();
            // } else if(this.rangeEmptyTag(range)) {
            //     element = $(this.domFragmentToHtml(range.cloneContents()));
            } else {
                // Or else use the node
                element = $(node);
            }

            var list = [];
            lists.push(list);
            // Loop untill we get to the root element, or the body tag
            while (element[0] && !editor.isRoot(element) && element[0].tagName.toLowerCase() !== 'body') {
                // Add the node to the list
                list.push(element);
                element = element.parent();
            }
            list.reverse();
            if (title) title += ' | ';
            title += this.getTemplate('root');
            for (var j = 0; j < list.length; j++) {
                title += this.getTemplate('tag', {
                    element: list[j][0].tagName.toLowerCase(),
                    // Create a data attribute with the index to the range, and element (so [0,0] will be the first range/first element)
                    data: '[' + i + ',' + j + ']'
                });
            }
            i++;
        }, null, this);

        if (!title) title = this.getTemplate('root');
        this.path
            .html(title)
            .find('a')
            .click(function() {
                // Get the range/element data attribute
                var i = $(this).data('ui-editor-selection');
                if (i) {
                    // Get the element from the list array
                    selectionSelectOuter(lists[i[0]][i[1]]);
                    editor.updateTagTree();
                } else {
                    selectionSelectOuter(editor.getElement());
                }
            });

        this.fire('tagTreeUpdated');
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
            var instances = $.ui.editor.getInstances();
            for (var i = 0; i < instances.length; i++) {
                if (instances[i] !== this &&
                        instances[i].options.unify) {
                    callback(instances[i]);
                }
            }
        }
    },

    /**
     * @returns {String}
     */
    getUniqueId: function() {
        return $.ui.editor.getUniqueId();
    },

    /*========================================================================*\
     * Messages
    \*========================================================================*/

    /**
     *
     */
    loadMessages: function() {
        this.messages = $(this.getTemplate('messages')).appendTo(this.wrapper);
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
                this.element.stop().slideUp($.proxy(function() {
                    if ($.isFunction(options.hide)) {
                        options.hide.call(this);
                    }
                    this.element.remove();
                }, this));
            }
        };

        messageObject.element =
            $(this.getTemplate('message', {
                type: type,
                message: message
            }))
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
     * Toolbar
    \*========================================================================*/
    /**
     *
     */
    loadToolbar: function() {
        // <strict/>

        // <debug/>

        var toolbar = this.toolbar = $('<div/>')
            .addClass(this.options.baseClass + '-toolbar');
        var toolbarWrapper = this.toolbarWrapper = $('<div/>')
            .addClass(this.options.baseClass + '-toolbar-wrapper')
            .addClass('ui-widget-content')
            .append(toolbar);
        var path = this.path = $('<div/>')
            .addClass(this.options.baseClass + '-path')
            .addClass('ui-widget-header')
            .html(this.getTemplate('root'));
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
                    var pos = this.persist('position', [
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
            var pos = this.persist('position') || this.options.dialogPosition;

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
            this.loadMessages();
        }

        $(function() {
            wrapper.appendTo('body');
        });

        this.loadUi();
    },

    isToolbarLoaded: function() {
        return this.wrapper !== null;
    },

    /**
     * Show the toolbar for the current element.
     * @param  {Range} [range] a native range to select after the toolbar has been shown
     */
    showToolbar: function(range) {
        if (!this.isToolbarLoaded()) {
            this.loadToolbar();
        }

        if (!this.visible) {
            // <debug/>

            // If unify option is set, hide all other toolbars first
            if (this.options.unify) {
                this.hideOtherToolbars(true);
            }

            // Store the visible state
            this.visible = true;

            this.wrapper.css('display', '');

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
            });
        }
    },

    /**
     *
     */
    hideToolbar: function() {
        if (this.visible) {
            this.visible = false;
            this.wrapper.hide();
            this.fire('hide');
            this.fire('resize');
        }
    },

    /**
     * @param {boolean} [instant]
     */
    hideOtherToolbars: function(instant) {
        this.unify(function(editor) {
            editor.hideToolbar(instant);
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
        var template;
        if (!this.templates[name]) {
            template = $.ui.editor.getTemplate(name, this.options.urlPrefix);
        } else {
            template = this.templates[name];
        }
        // Translate template
        template = template.replace(/_\(['"]{1}(.*?)['"]{1}\)/g, function(match, string) {
            string = string.replace(/\\(.?)/g, function (s, slash) {
                switch (slash) {
                    case '\\':return '\\';
                    case '0':return '\u0000';
                    case '':return '';
                    default:return slash;
                }
            });
            return _(string);
        });
        // Replace variables
        variables = $.extend({}, this.options, variables || {});
        variables = this.getTemplateVars(variables);
        template = template.replace(/\{\{(.*?)\}\}/g, function(match, variable) {
            return variables[variable];
        });
        return template;
    },

    /**
     * @param {Object} variables
     * @param {String} prefix
     */
    getTemplateVars: function(variables, prefix, depth) {
        prefix = prefix ? prefix + '.' : '';
        var maxDepth = 5;
        if (!depth) depth = 1;
        var result = {};
        for (var name in variables) {
            if (typeof variables[name] === 'object' && depth < maxDepth) {
                var inner = this.getTemplateVars(variables[name], prefix + name, ++depth);
                for (var innerName in inner) {
                    result[innerName] = inner[innerName];
                }
            } else {
                result[prefix + name] = variables[name];
            }
        }
        return result;
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
        for (keyCombination in this.hotkeys) {
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

    uiEnabled: function(ui) {
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

    /**
     *
     */
    loadUi: function() {
        // Loop the UI order option
        for (var i = 0, l = this.options.uiOrder.length; i < l; i++) {
            var uiSet = this.options.uiOrder[i];
            // Each element of the UI order should be an array of UI which will be grouped
            var uiGroup = $('<div/>');

            // Loop each UI in the array
            for (var j = 0, ll = uiSet.length; j < ll; j++) {

                if (!this.uiEnabled(uiSet[j])) continue;

                var baseClass = uiSet[j].replace(/([A-Z])/g, function(match) {
                    return '-' + match.toLowerCase();
                });

                // Check the UI has been registered
                if ($.ui.editor.ui[uiSet[j]]) {
                    // Clone the UI object (which should be extended from the defaultUi object)
                    var uiObject = $.extend({}, $.ui.editor.ui[uiSet[j]]);

                    var options = $.extend(true, {}, this.options, {
                        baseClass: this.options.baseClass + '-ui-' + baseClass
                    }, uiObject.options, this.options.ui[uiSet[j]]);

                    uiObject.editor = this;
                    uiObject.options = options;
                    uiObject.ui = uiObject.init(this, options);

                    if (uiObject.hotkeys) {
                        this.registerHotkey(uiObject.hotkeys, null, uiObject);
                        // Add hotkeys to title
                        uiObject.ui.title += ' (' + $.map(uiObject.hotkeys, function(value, index) {
                                return index;
                            })[0] + ')';
                    }

                    // Append the UI object to the group
                    uiObject.ui.init(uiSet[j], this, options, uiObject).appendTo(uiGroup);

                    // Add the UI object to the editors list
                    this.uiObjects[uiSet[j]] = uiObject;
                }
                // <strict/>
            }

            uiGroup
                .addClass('ui-buttonset')
                .addClass(this.options.baseClass + '-buttonset');

            // Append the UI group to the editor toolbar
            if (uiGroup.children().length > 0) {
                uiGroup.appendTo(this.toolbar);
            }
        }
        $('<div/>').css('clear', 'both').appendTo(this.toolbar);
    },

    /**
     * @param {Object} options
     */
    uiButton: function(options) {
        return $.extend({
            button: null,
            options: {},
            init: function(name, editor, options, object) {
                var baseClass = name.replace(/([A-Z])/g, function(match) {
                    return '-' + match.toLowerCase();
                });
                // Extend options overriding editor < base class < supplied options < user options
                options = $.extend({}, editor.options, {
                    baseClass: editor.options.baseClass + '-' + baseClass + '-button'
                }, this.options, editor.options.ui[name]);
                // Default title if not set in plugin
                if (!this.title) this.title = _('Unnamed Button');

                // Create the HTML button
                this.button = $('<div/>')
                    .html(this.label || this.title)
                    .addClass(options.baseClass)
                    .attr('name', name)
                    .attr('title', this.title)
                    .val(name);

                if (options.classes) this.button.addClass(options.classes);

                // Prevent losing the selection on the mouse down
                this.button.bind('mousedown.' + object.editor.widgetName, function(e) {
                    e.preventDefault();
                });

                // Bind the click event
                var button = this;
                this.button.bind('mouseup.' + object.editor.widgetName, function(e) {
                    // Prevent losing the selection on the mouse up
                    e.preventDefault();
                    // Call the click event function
                    button.click.apply(object, arguments);
                });

                editor.bind('destroy', $.proxy(function() {
                    this.button.button('destroy').remove();
                }, this));

                // Create the jQuery UI button
                this.button.button({
                    icons: {
                        primary: this.icon || 'ui-icon-' + baseClass
                    },
                    disabled: options.disabled ? true : false,
                    text: this.text || false,
                    label: this.label || null
                });

                this.ready.call(object);

                return this.button;
            },
            disable: function() {
                this.button.button('option', 'disabled', true);
            },
            enable: function() {
                this.button.button('option', 'disabled', false);
            },
            ready: function() {},
            click: function() {}
        }, options);
    },

    /**
     * @param {Object} options
     */
    uiSelectMenu: function(options) {
        return $.extend({
            // HTML select
            select: null,

            // HTML replacements
            selectMenu: null,
            button: null,
            menu: null,

            // Options passed but the plugin
            options: {},

            init: function(name, editor) {
                var ui = this;

                var baseClass = name.replace(/([A-Z])/g, function(match) {
                    return '-' + match.toLowerCase();
                });

                // Extend options overriding editor < base class < supplied options < user options
                var options = $.extend({}, editor.options, {
                    baseClass: editor.options.baseClass + baseClass + '-select-menu'
                }, ui.options, editor.options.ui[name]);

                // Default title if not set in plugin
                if (!ui.title) ui.title = _('Unnamed Select Menu');

                ui.wrapper =  $('<div class="ui-editor-selectmenu-wrapper"/>')
                    .append(ui.select.hide())
                    .addClass(ui.select.attr('class'));

                ui.selectMenu = $('<div class="ui-editor-selectmenu"/>')
                    .appendTo(ui.wrapper);

                ui.menu = $('<div class="ui-editor-selectmenu-menu ui-widget-content ui-corner-bottom ui-corner-tr"/>')
                    .appendTo(ui.wrapper);

                ui.select.find('option, .ui-editor-selectmenu-option').each(function() {
                    var option = $('<div/>')
                        .addClass('ui-editor-selectmenu-menu-item')
                        .addClass('ui-corner-all')
                        .html($(this).html())
                        .appendTo(ui.menu)
                        .bind('mouseenter.' + editor.widgetName, function() {
                            $(this).addClass('ui-state-focus');
                        })
                        .bind('mouseleave.' + editor.widgetName, function() {
                            $(this).removeClass('ui-state-focus');
                        })
                        .bind('mousedown.' + editor.widgetName, function() {
                            // Prevent losing focus on editable region
                            return false;
                        })
                        .bind('click.' + editor.widgetName, function() {
                            var option = ui.select.find('option, .ui-editor-selectmenu-option').eq($(this).index());
                            var value = option.attr('value') || option.val();
                            ui.select.val(value);
                            ui.update();
                            ui.wrapper.removeClass('ui-editor-selectmenu-visible');
                            ui.button.addClass('ui-corner-all')
                                  .removeClass('ui-corner-top');
                            ui.change(value);
                            return false;
                        });
                });


                var text = $('<div/>')
                    .addClass('ui-editor-selectmenu-text');
                var icon = $('<div/>')
                    .addClass('ui-icon ui-icon-triangle-1-s');
                ui.button = $('<div/>')
                    .addClass('ui-editor-selectmenu-button ui-editor-selectmenu-button ui-button ui-state-default')
                    .attr('title', ui.title)
                    .append(text)
                    .append(icon)
                    .prependTo(ui.selectMenu);
                ui.button
                    .bind('mousedown.' + editor.widgetName, function() {
                        // Prevent losing focus on editable region
                        return false;
                    })
                    .bind('click.' + editor.widgetName, function() {
                        // Do not fire click event when disabled
                        if ($(this).hasClass('ui-state-disabled')) {
                        	return;
                        }
                        if (parseInt(ui.menu.css('min-width'), 10) < ui.button.outerWidth() + 10) {
                            ui.menu.css('min-width', ui.button.outerWidth() + 10);
                        }
                        ui.wrapper.toggleClass('ui-editor-selectmenu-visible');
                        return false;
                    })
                    .bind('mouseenter.' + editor.widgetName, function() {
                        if (!$(this).hasClass('ui-state-disabled')) {
                            $(this).addClass('ui-state-hover', $(this).hasClass('ui-state-disabled'));
                        }
                    })
                    .bind('mouseleave.' + editor.widgetName, function() {
                        $(this).removeClass('ui-state-hover');
                    });

                var selected = ui.select.find('option[value=' + this.select.val() + '], .ui-editor-selectmenu-option[value=' + this.select.val() + ']').html() ||
                    ui.select.find('option, .ui-editor-selectmenu-option').first().html();
                ui.button.find('.ui-editor-selectmenu-text').html(selected);

                return ui.wrapper;
            },
            update: function(value) {
                var selected = this.select.find('option[value=' + this.select.val() + '], .ui-editor-selectmenu-option[value=' + this.select.val() + ']').html();
                this.button.find('.ui-editor-selectmenu-text').html(selected);
            },
            val: function() {
                var result = this.select.val.apply(this.select, arguments);
                this.update();
                return result;
            },
            change: function() {
            }
        }, options);
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
        if (!this.options.plugins) this.options.plugins = {};
        for (var name in $.ui.editor.plugins) {
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
            var pluginObject = $.extend({}, $.ui.editor.plugins[name]);

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
        var content = this.getElement().html();

        // Remove saved rangy ranges
        content = $('<div/>').html(content);
        content.find('.rangySelectionBoundary').remove();
        content = content.html();

        return content;
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
    save: function() {
        var html = this.getCleanHtml();
        this.fire('save');
        this.setOriginalHtml(html);
        this.fire('saved');
        this.fire('cleaned');
        return html;
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
        var events = this.events;
        $.each(name.split(','), function(i, name) {
            name = $.trim(name);
            if (!events[name]) events[name] = [];
            events[name].push({
                context: context,
                callback: callback
            });
        });
    },

    /**
     * @param {String} name
     * @param {function} callback
     * @param {Object} [context]
     */
    unbind: function(name, callback, context) {

        for (var i = 0, l = this.events[name].length; i < l; i++) {
            if (this.events[name][i]
                && this.events[name][i].callback === callback
                && this.events[name][i].context === context) {
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
        if (!sub) this.fire('before:' + name, global, true);

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
            $.ui.editor.fire(name);
        }

        // Fire after sub-event
        if (!sub) this.fire('after:' + name, global, true);
    }

});

/*============================================================================*\
 * Global static class definition
\*============================================================================*/
$.extend($.ui.editor,
    /** @lends $.ui.editor */
    {

    // <expose>
    elementRemoveComments: elementRemoveComments,
    elementRemoveAttributes: elementRemoveAttributes,
    elementBringToTop: elementBringToTop,
    elementOuterHtml: elementOuterHtml,
    elementOuterText: elementOuterText,
    elementIsBlock: elementIsBlock,
    elementDefaultDisplay: elementDefaultDisplay,
    elementIsValid: elementIsValid,
    fragmentToHtml: fragmentToHtml,
    fragmentInsertBefore: fragmentInsertBefore,
    rangeExpandToParent: rangeExpandToParent,
    rangeGetCommonAncestor: rangeGetCommonAncestor,
    rangeIsEmpty: rangeIsEmpty,
    selectionSave: selectionSave,
    selectionRestore: selectionRestore,
    selectionDestroy: selectionDestroy,
    selectionEachRange: selectionEachRange,
    selectionReplace: selectionReplace,
    selectionSelectInner: selectionSelectInner,
    selectionSelectOuter: selectionSelectOuter,
    selectionSelectEdge: selectionSelectEdge,
    selectionSelectEnd: selectionSelectEnd,
    selectionSelectStart: selectionSelectStart,
    selectionGetHtml: selectionGetHtml,
    selectionGetElements: selectionGetElements,
    selectionToggleWrapper: selectionToggleWrapper,
    selectionExists: selectionExists,
    selectionReplaceSplittingSelectedElement: selectionReplaceSplittingSelectedElement,
    selectionReplaceWithinValidTags: selectionReplaceWithinValidTags,
    stringStripTags: stringStripTags,
    // </expose>

    /**
     * Default options for the jQuery UI Editor
     * @namespace Default settings for the jQuery UI Editor
     */
    defaults: {
        /**
         * Plugins option overrides
         * @type Object
         */
        plugins: {},

        /**
         * UI option overrides
         * @type Object
         */
        ui: {},

        /**
         * Default events to bind
         * @type Object
         */
        bind: {},

        /**
         *
         * @type Object
         */
        domTools: domTools,

        /**
         * Namespace used to persistence to prevent conflicting stored values
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
         * Switch to specify if the editor should automatically enable all UI, if set to false, only the UI specified in the {@link $.ui.editor.defaults.ui} option object will be enabled
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
        baseClass: 'ui-editor',

        /**
         * CSS class prefix that is prepended to inserted elements classes. E.g. "cms-bold"
         * @type String
         */
        cssPrefix: 'cms-',

        draggable: true,

        /**
         * @type {Boolean} True to enable hotkeys
         */
        enableHotkeys: true,

        /**
         * @type {Object} Custom hotkeys
         */
        hotkeys: {}
    },

    /**
     * Events added via $.ui.editor.bind
     * @property {Object} events
     */
    events: {},

    /**
     * Plugins added via $.ui.editor.registerPlugin
     * @property {Object} plugins
     */
    plugins: {},

    /**
     * UI added via $.ui.editor.registerUi
     * @property {Object} ui
     */
    ui: {},

    /**
     * @property {$.ui.editor[]} instances
     */
    instances: [],

    /**
     * @returns {$.ui.editor[]}
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
    urlPrefix: '/jquery-raptor/',

    /**
     * @property {Object} templates
     */
    templates: { 'paste.dialog': "<div class=\"ui-editor-paste-panel ui-dialog-content ui-widget-content\">\n    <div class=\"ui-editor-paste-panel-tabs ui-tabs ui-widget ui-widget-content ui-corner-all\">\n        <ul class=\"ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all\">\n            <li class=\"ui-state-default ui-corner-top ui-tabs-selected ui-state-active\"><a>_('Plain Text')<\/a><\/li>\n            <li class=\"ui-state-default ui-corner-top\"><a>_('Formatted &amp; Cleaned')<\/a><\/li>\n            <li class=\"ui-state-default ui-corner-top\"><a>_('Formatted Unclean')<\/a><\/li>\n            <li class=\"ui-state-default ui-corner-top\"><a>_('Source Code')<\/a><\/li>\n        <\/ul>\n        <div class=\"ui-editor-paste-plain-tab\">\n            <textarea class=\"ui-editor-paste-area ui-editor-paste-plain\">{{plain}}<\/textarea>\n        <\/div>\n        <div class=\"ui-editor-paste-markup-tab\" style=\"display: none\">\n            <div contenteditable=\"true\" class=\"ui-editor-paste-area ui-editor-paste-markup\">{{markup}}<\/div>\n        <\/div>\n        <div class=\"ui-editor-paste-rich-tab\" style=\"display: none\">\n            <div contenteditable=\"true\" class=\"ui-editor-paste-area ui-editor-paste-rich\">{{html}}<\/div>\n        <\/div>\n        <div class=\"ui-editor-paste-source-tab\" style=\"display: none\">\n            <textarea class=\"ui-editor-paste-area ui-editor-paste-source\">{{html}}<\/textarea>\n        <\/div>\n    <\/div>\n<\/div>\n",'imageresize.manually-resize-image': "<div>\n    <fieldset>\n        <label for=\"{{baseClass}}-width\">_('Image width')<\/label>\n        <input id=\"{{baseClass}}-width\" name=\"width\" type=\"text\" value=\"{{width}}\" placeholder=\"_('Image width')\"\/>\n    <\/fieldset>\n    <fieldset>\n        <label for=\"{{baseClass}}-height\">_('Image height')<\/label>\n        <input id=\"{{baseClass}}-height\" name=\"height\" type=\"text\" value=\"{{height}}\" placeholder=\"_('Image height')\"\/>\n    <\/fieldset>\n<\/div>",'viewsource.dialog': "<div style=\"display:none\" class=\"{{baseClass}}-dialog\">\n    <div class=\"{{baseClass}}-plain-text\">\n        <textarea>{{source}}<\/textarea>\n    <\/div>\n<\/div>\n",'clicktoedit.message': "<div class=\"{{baseClass}}-message\" style=\"opacity: 0;\">_('Click to begin editing')<\/div>\n",'length.dialog': "<div>\n    <ul>\n        <li>{{characters}}<\/li>\n        <li>{{words}}<\/li>\n        <li>{{sentences}}<\/li>\n        <li>{{truncation}}<\/li>\n    <\/ul>\n<\/div>\n",'i18n.menu': "<select autocomplete=\"off\" name=\"tag\" class=\"ui-editor-tag-select\">\n    <option value=\"na\">_('N\/A')<\/option>\n    <option value=\"p\">_('Paragraph')<\/option>\n    <option value=\"h1\">_('Heading&nbsp;1')<\/option>\n    <option value=\"h2\">_('Heading&nbsp;2')<\/option>\n    <option value=\"h3\">_('Heading&nbsp;3')<\/option>\n    <option value=\"div\">_('Divider')<\/option>\n<\/select>\n",'link.label': "<label>\n    <input class=\"{{classes}}\" type=\"radio\" value=\"{{type}}\" name=\"link-type\" autocomplete=\"off\"\/>\n    <span>{{title}}<\/span>\n<\/label>\n",'link.email': "<h2>_('Link to an email address')<\/h2>\n<fieldset class=\"{{baseClass}}-email\">\n    <label for=\"{{baseClass}}-email\">_('Email')<\/label>\n    <input id=\"{{baseClass}}-email\" name=\"email\" type=\"text\" placeholder=\"_('Enter email address')\"\/>\n<\/fieldset>\n<fieldset class=\"{{baseClass}}-email\">\n    <label for=\"{{baseClass}}-email-subject\">_('Subject (optional)')<\/label>\n    <input id=\"{{baseClass}}-email-subject\" name=\"subject\" type=\"text\" placeholder=\"_('Enter subject')\"\/>\n<\/fieldset>\n",'link.error': "<div style=\"display:none\" class=\"ui-widget {{baseClass}}-error-message {{messageClass}}\">\n    <div class=\"ui-state-error ui-corner-all\"> \n        <p>\n            <span class=\"ui-icon ui-icon-alert\"><\/span> \n            {{message}}\n        <\/p>\n    <\/div>\n<\/div>",'link.dialog': "<div style=\"display:none\" class=\"{{baseClass}}-panel\">\n    <div class=\"{{baseClass}}-menu\">\n        <p>_('Choose a link type:')<\/p>\n        <fieldset><\/fieldset>\n    <\/div>\n    <div class=\"{{baseClass}}-wrap\">\n        <div class=\"{{baseClass}}-content\"><\/div>\n    <\/div>\n<\/div>\n",'link.file-url': "<h2>_('Link to a document or other file')<\/h2>\n<fieldset>\n    <label for=\"{{baseClass}}-external-href\">_('Location')<\/label>\n    <input id=\"{{baseClass}}-external-href\" value=\"http:\/\/\" name=\"location\" class=\"{{baseClass}}-external-href\" type=\"text\" placeholder=\"_('Enter your URL')\" \/>\n<\/fieldset>\n<h2>_('New window')<\/h2>\n<fieldset>\n    <label for=\"{{baseClass}}-external-target\">\n        <input id=\"{{baseClass}}-external-target\" name=\"blank\" type=\"checkbox\" \/>\n        <span>_('Check this box to have the file open in a new browser window')<\/span>\n    <\/label>\n<\/fieldset>\n<h2>_('Not sure what to put in the box above?')<\/h2>\n<ol>\n    <li>_('Ensure the file has been uploaded to your website')<\/li>\n    <li>_('Open the uploaded file in your browser')<\/li>\n    <li>_(\"Copy the file's URL from your browser's address bar and paste it into the box above\")<\/li>\n<\/ol>\n",'link.external': "<h2>_('Link to a page on this or another website')<\/h2>\n<fieldset>\n    <label for=\"{{baseClass}}-external-href\">_('Location')<\/label>\n    <input id=\"{{baseClass}}-external-href\" value=\"http:\/\/\" name=\"location\" class=\"{{baseClass}}-external-href\" type=\"text\" placeholder=\"_('Enter your URL')\" \/>\n<\/fieldset>\n<h2>_('New window')<\/h2>\n<fieldset>\n    <label for=\"{{baseClass}}-external-target\">\n        <input id=\"{{baseClass}}-external-target\" name=\"blank\" type=\"checkbox\" \/>\n        <span>_('Check this box to have the link open in a new browser window')<\/span>\n    <\/label>\n<\/fieldset>\n<h2>_('Not sure what to put in the box above?')<\/h2>\n<ol>\n    <li>_('Find the page on the web you want to link to')<\/li>\n    <li>_('Copy the web address from your browser\'s address bar and paste it into the box above')<\/li>\n<\/ol>\n",'embed.dialog': "<div style=\"display:none\" class=\"{{baseClass}}-dialog\">\n    <div class=\"ui-editor-embed-panel-tabs ui-tabs ui-widget ui-widget-content ui-corner-all\">\n        <ul class=\"ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all\">\n            <li class=\"ui-state-default ui-corner-top ui-tabs-selected ui-state-active\"><a>_('Embed Code')<\/a><\/li>\n            <li class=\"ui-state-default ui-corner-top\"><a>_('Preview')<\/a><\/li>\n        <\/ul>\n        <div class=\"ui-editor-embed-code-tab\">\n            <p>_('Paste your embed code into the text area below.')<\/p>\n            <textarea><\/textarea>\n        <\/div>\n        <div class=\"ui-editor-preview-tab\" style=\"display: none\">\n            <p>_('A preview of your embedded object is displayed below.')<\/p>\n            <div class=\"ui-editor-embed-preview\"><\/div>\n        <\/div>\n    <\/div>\n<\/div>\n",'cancel.dialog': "<div>\n    _('Are you sure you want to stop editing?')\n    <br\/><br\/>\n    _('All changes will be lost!')\n<\/div>\n",'tagmenu.menu': "<select autocomplete=\"off\" name=\"tag\" class=\"ui-editor-tag-select\">\n    <option value=\"na\">_('N\/A')<\/option>\n    <option value=\"p\">_('Paragraph')<\/option>\n    <option value=\"h1\">_('Heading&nbsp;1')<\/option>\n    <option value=\"h2\">_('Heading&nbsp;2')<\/option>\n    <option value=\"h3\">_('Heading&nbsp;3')<\/option>\n<\/select>\n",'unsavededitwarning.warning': "<div title=\"_('This block contains unsaved changes')\" class=\"{{baseClass}}\">\n    <span class=\"ui-icon ui-icon-alert\"><\/span>\n    <span>There are unsaved edits on this page<\/span>\n<\/div>",'root': "<a href=\"javascript: \/\/ _('Select all editable content')\" \n   class=\"{{baseClass}}-select-element\"\n   title=\"_('Click to select all editable content')\">_('root')<\/a> \n",'message': "<div class=\"{{baseClass}}-message-wrapper {{baseClass}}-message-{{type}}\">\n    <div class=\"ui-icon ui-icon-{{type}}\" \/>\n    <div class=\"{{baseClass}}-message\">{{message}}<\/div>\n    <div class=\"{{baseClass}}-message-close ui-icon ui-icon-circle-close\"><\/div>\n<\/div>\n",'tag': " &gt; <a href=\"javascript: \/\/ _('Select {{element}} element')\" \n         class=\"{{baseClass}}-select-element\"\n         title=\"_('Click to select the contents of the '{{element}}' element')\"\n         data-ui-editor-selection=\"{{data}}\">{{element}}<\/a> \n",'unsupported': "<div class=\"{{baseClass}}-unsupported-overlay\"><\/div>\n<div class=\"{{baseClass}}-unsupported-content\">\n    It has been detected that you a using a browser that is not supported by Raptor, please\n    use one of the following browsers:\n\n    <ul>\n        <li><a href=\"http:\/\/www.google.com\/chrome\">Google Chrome<\/a><\/li>\n        <li><a href=\"http:\/\/www.firefox.com\">Mozilla Firefox<\/a><\/li>\n        <li><a href=\"http:\/\/www.google.com\/chromeframe\">Internet Explorer with Chrome Frame<\/a><\/li>\n    <\/ul>\n\n    <div class=\"{{baseClass}}-unsupported-input\">\n        <button class=\"{{baseClass}}-unsupported-close\">Close<\/button>\n        <input name=\"{{baseClass}}-unsupported-show\" type=\"checkbox\" \/>\n        <label>Don't show this message again<\/label>\n    <\/div>\n<div>",'messages': "<div class=\"{{baseClass}}-messages\" \/>\n" },

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
        var id = $.ui.editor.defaults.baseClass + '-uid-' + new Date().getTime() + '-' + Math.floor(Math.random() * 100000);
        while ($('#' + id).length) {
            id = $.ui.editor.defaults.baseClass + '-uid-' + new Date().getTime() + '-' + Math.floor(Math.random() * 100000);
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
     * @name $.ui.editor.defaultUi
     * @class The default UI component
     * @property {Object} defaultUi
     */
    defaultUi: /** @lends $.ui.editor.defaultUi.prototype */ {
        ui: null,

        /**
         * The {@link $.ui.editor} instance
         * @type {Object}
         */
        editor: null,

        /**
         * @type {Object}
         */
        options: null,

        /**
         * Initialise & return an instance of this UI component
         * @param  {$.editor} editor  The editor instance
         * @param  {$.ui.editor.defaults} options The default editor options extended with any overrides set at initialisation
         * @return {Object} An instance of the ui component
         */
        init: function(editor, options) {},

        /**
         * @param  {String} key   The key
         * @param  {[String|Object|int|float]} value A value to be stored
         * @return {String|Object|int|float} The stored value
         */
        persist: function(key, value) {
            return this.editor.persist(key, value);
        },

        /**
         * @param  {String}   name
         * @param  {Function} callback
         * @param  {String}   context
         */
        bind: function(name, callback, context) {
            this.editor.bind(name, callback, context || this);
        },

        /**
         * @param  {String}   name
         * @param  {Function} callback
         * @param  {Object}   context
         */
        unbind: function(name, callback, context) {
            this.editor.unbind(name, callback, context || this);
        }
    },

    /**
     *
     * @param {Object|String} mixed
     * @param {Object} [ui]
     */
    registerUi: function(mixed, ui) {
        // Allow array objects, and single plugins
        if (typeof(mixed) === 'string') {
            // <strict/>
            this.ui[mixed] = $.extend({}, this.defaultUi, ui);
        } else {
            for (var name in mixed) {
                this.registerUi(name, mixed[name]);
            }
        }
    },

    /**
     * @name $.ui.editor.defaultPlugin
     * @class The default plugin
     * @property {Object} defaultPlugin
     */
    defaultPlugin: /** @lends $.ui.editor.defaultPlugin.prototype */ {

        /**
         * The {@link $.ui.editor} instance
         * @type {Object}
         */
        editor: null,

        /**
         * @type {Object}
         */
        options: null,

        /**
         * Initialise & return an instance of this plugin
         * @param  {$.editor} editor  The editor instance
         * @param  {$.ui.editor.defaults} options The default editor options extended with any overrides set at initialisation
         * @return {Object} An instance of the ui component
         */
        init: function(editor, options) {},

        /**
         * @param  {String} key   The key
         * @param  {[String|Object|int|float]} value A value to be stored
         * @return {String|Object|int|float} The stored value
         */
        persist: function(key, value) {
            return this.editor.persist(key, value);
        },

        /**
         * @param  {String}   name
         * @param  {Function} callback
         * @param  {String}   context
         */
        bind: function(name, callback, context) {
            this.editor.bind(name, callback, context || this);
        },

        /**
         * @param  {String}   name
         * @param  {Function} callback
         * @param  {Object}   context
         */
        unbind: function(name, callback, context) {
            this.editor.unbind(name, callback, context || this);
        }
    },

    /**
     *
     * @param {Object|String} mixed
     * @param {Object} [plugin]
     */
    registerPlugin: function(mixed, plugin) {
        // Allow array objects, and single plugins
        if (typeof(mixed) === 'string') {
            // <strict/>

            this.plugins[mixed] = $.extend({}, this.defaultPlugin, plugin);
        } else {
            for (var name in mixed) {
                this.registerPlugin(name, mixed[name]);
            }
        }
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
        if (!this.events[name]) return;
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

});
var supported, ios;

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
    }
    return supported;
}
/**
 * @fileOverview Text alignment ui components
 * @author David Neilsen david@panmedia.co.nz
 * @author Michael Robinson michael@panmedia.co.nz
 */
$.ui.editor.registerUi({

    /**
     * @name $.editor.ui.alignLeft
     * @augments $.ui.editor.defaultUi
     * @class Aligns text left within the selected or nearest block-level element.
     * <br/>
     * Toggles <tt>text-align: left</tt>
     */
    alignLeft: /** @lends $.editor.ui.alignLeft.prototype */ {

        /**
         * @see $.ui.editor.defaultUi#init
         */
        init: function(editor) {
            return editor.uiButton({
                title: _('Left Align'),
                click: function() {
                    editor.toggleBlockStyle({
                        'text-align': 'left'
                    }, editor.getElement());
                }
            });
        }
    },

    /**
     * @name $.editor.ui.alignJustify
     * @augments $.ui.editor.defaultUi
     * @class Justifies text within the selected or nearest block-level element.
     * <br/>
     * Toggles <tt>text-align: justify</tt>
     */
    alignJustify: /** @lends $.editor.ui.alignJustify.prototype */ {

        /**
         * @see $.ui.editor.defaultUi#init
         */
        init: function(editor) {
            return editor.uiButton({
                title: _('Justify'),
                click: function() {
                    editor.toggleBlockStyle({
                        'text-align': 'justify'
                    }, editor.getElement());
                }
            });
        }
    },

    /**
     * @name $.editor.ui.alignCenter
     * @augments $.ui.editor.defaultUi
     * @class Centers text within the selected or nearest block-level element.
     * <br/>
     * Toggles: <tt>text-align: center</tt>
     */
    alignCenter: /** @lends $.editor.ui.alignCenter.prototype */  {

        /**
         * @see $.ui.editor.defaultUi#init
         */
        init: function(editor) {
            return editor.uiButton({
                title: _('Center Align'),
                click: function() {
                    editor.toggleBlockStyle({
                        'text-align': 'center'
                    }, editor.getElement());
                }
            });
        }
    },

    /**
     * @name $.editor.ui.alignRight
     * @augments $.ui.editor.defaultUi
     * @class Aligns text right within the selected or nearest block-level element.
     * <br/>
     * Toggles <tt>text-align: right</tt>
     */
    alignRight: /** @lends $.editor.ui.alignRight.prototype */  {

        /**
         * @see $.ui.editor.defaultUi#init
         */
        init: function(editor) {
            return editor.uiButton({
                title: _('Right Align'),
                click: function() {
                    editor.toggleBlockStyle({
                        'text-align': 'right'
                    }, editor.getElement());
                }
            });
        }
    }
});/**
 * @fileOverview Basic text styling ui components
 * @author David Neilsen david@panmedia.co.nz
 * @author Michael Robinson michael@panmedia.co.nz
 */

$.ui.editor.registerUi({

    /**
     * @name $.editor.ui.textBold
     * @augments $.ui.editor.defaultUi
     * @class Wraps (or unwraps) the selection with &lt;strong&gt; tags
     * <br/>
     * Applies either {@link $.ui.editor.defaults.cssPrefix} + 'bold' or a custom class (if present) to the &lt;strong&gt; element
     */
    textBold: /** @lends $.editor.ui.textBold.prototype */ {

        hotkeys: {
            'ctrl+b': {
                'action': function() {
                    this.ui.click();
                }
            }
        },

        /**
         * @see $.ui.editor.defaultUi#init
         */
        init: function(editor, options) {
            return this.editor.uiButton({
                title: _('Bold'),
                click: function() {
                    selectionToggleWrapper('strong', { classes: options.classes || options.cssPrefix + 'bold' });
                }
            });
        }
    },

    /**
     * @name $.editor.ui.textItalic
     * @augments $.ui.editor.defaultUi
     * @class Wraps (or unwraps) the selection with &lt;em&gt; tags
     * <br/>
     * Applies either {@link $.ui.editor.defaults.cssPrefix} + 'italic' or a custom class (if present) to the &lt;em&gt; element
     */
    textItalic: /** @lends $.editor.ui.textItalic.prototype */ {

        hotkeys: {
            'ctrl+i': {
                'action': function() {
                    this.ui.click();
                }
            }
        },

        /**
         * @see $.ui.editor.defaultUi#init
         */
        init: function(editor, options) {
            return editor.uiButton({
                title: _('Italic'),
                click: function() {
                    selectionToggleWrapper('em', { classes: options.classes || options.cssPrefix + 'italic' });
                }
            });
        }
    },

    /**
     * @name $.editor.ui.textUnderline
     * @augments $.ui.editor.defaultUi
     * @class Wraps (or unwraps) the selection with &lt;u&gt; tags
     * <br/>
     * Applies either {@link $.ui.editor.defaults.cssPrefix} + 'underline' or a custom class (if present) to the &lt;u&gt; element
     */
    textUnderline: /** @lends $.editor.ui.textUnderline.prototype */ {

        hotkeys: {
            'ctrl+u': {
                'action': function() {
                    this.ui.click();
                }
            }
        },

        /**
         * @see $.ui.editor.defaultUi#init
         */
        init: function(editor, options) {
            return editor.uiButton({
                title: _('Underline'),
                click: function() {
                    selectionToggleWrapper('u', { classes: options.classes || options.cssPrefix + 'underline' });
                }
            });
        }
    },

    /**
     * @name $.editor.ui.textStrike
     * @augments $.ui.editor.defaultUi
     * @class  Wraps (or unwraps) the selection with &lt;del&gt; tags
     * <br/>
     * Applies either {@link $.ui.editor.defaults.cssPrefix} + 'strike' or a custom class (if present) to the &lt;del&gt; element
     */
    textStrike: /** @lends $.editor.ui.textStrike.prototype */ {

        hotkeys: {
            'ctrl+k': {
                'action': function() {
                    this.ui.click();
                }
            }
        },

        /**
         * @see $.ui.editor.defaultUi#init
         */
        init: function(editor, options) {
            return editor.uiButton({
                title: _('Strikethrough'),
                click: function() {
                    selectionToggleWrapper('del', { classes: options.classes || options.cssPrefix + 'strike' });
                }
            });
        }
    },

    /**
     * @name $.editor.ui.textSub
     * @augments $.ui.editor.defaultUi
     * @class Wraps (or unwraps) the selection with &lt;sub&gt; tags
     * <br/>
     * Applies either {@link $.ui.editor.defaults.cssPrefix} + 'sub' or a custom class (if present) to the &lt;sub&gt; element
     */
    textSub: /** @lends $.editor.ui.textSub.prototype */ {

        /**
         * @see $.ui.editor.defaultUi#init
         */
        init: function(editor, options) {
            return editor.uiButton({
                title: _('Sub script'),
                click: function() {
                    selectionToggleWrapper('sub', { classes: options.classes || options.cssPrefix + 'sub' });
                }
            });
        }
    },

    /**
     * @name $.editor.ui.textSuper
     * @augments $.ui.editor.defaultUi
     * @class Wraps (or unwraps) the selection with &lt;sup&gt; tags
     * <br/>
     * Applies either {@link $.ui.editor.defaults.cssPrefix} + 'super' or a custom class (if present) to the &lt;sub&gt; element
     */
    textSuper: /** @lends $.editor.ui.textSuper.prototype */ {

        /**
         * @see $.ui.editor.defaultUi#init
         */
        init: function(editor, options) {
            return editor.uiButton({
                title: _('Super script'),
                click: function() {
                    selectionToggleWrapper('sup', { classes: options.classes || options.cssPrefix + 'super' });
                }
            });
        }
    }
});
/**
 * @fileOverview Blockquote ui component
 * @author David Neilsen david@panmedia.co.nz
 * @author Michael Robinson michael@panmedia.co.nz
 */

 $.ui.editor.registerUi({
   /**
    * @name $.editor.ui.quoteBlock
    * @augments $.ui.editor.defaultUi
    * @class Wraps (or unwraps) selection in &lt;blockquote&gt; tags
    * <br/>
    * Applies either {@link $.ui.editor.defaults.cssPrefix} + 'blockquote' or a custom class (if present) to the &lt;blockquote&gt; element
    */
    quoteBlock: /** @lends $.editor.ui.quoteBlock.prototype */ {

        /**
         * @see $.ui.editor.defaultUi#init
         */
        init: function(editor, options) {
            return editor.uiButton({
                title: _('Blockquote'),
                icon: 'ui-icon-quote',
                click: function() {
                    selectionToggleWrapper('blockquote', { classes: options.classes || options.cssPrefix + 'blockquote' });
                }
            });
        }
    }
});
/**
 * @fileOverview Cancel plugin & ui component
 * @author David Neilsen david@panmedia.co.nz
 * @author Michael Robinson michael@panmedia.co.nz
 */

 /**
  * @name $.editor.ui.cancel
  * @augments $.ui.editor.defaultUi
  * @class Cancels editing
  */
$.ui.editor.registerUi({
    cancel: /** @lends $.editor.ui.cancel.prototype */ {

        hotkeys: {
            'ctrl+k': {
                'action': function() {
                    this.ui.click();
                }
            }
        },

        /**
         * @see $.ui.editor.defaultUi#init
         */
        init: function(editor) {
            return editor.uiButton({
                name: 'cancel',
                title: _('Cancel'),
                icons: { primary: 'ui-icon-cancel' },
                dialog: null,
                click: function() {
                    this.confirm();
                }
            });
        },

        /**
         * If the editor is dirty, inform the user that to cancel editing will discard their unsaved changes.
         * If the user accepts of if the editor is not dirty, cancel editing.
         */
        confirm: function() {
            var plugin = this.editor.getPlugin('cancel');
            var editor = this.editor;
            if (!editor.isDirty()) {
                plugin.cancel();
            } else {
                if (!this.dialog) this.dialog = $(editor.getTemplate('cancel.dialog'));
                this.dialog.dialog({
                    modal: true,
                    resizable: false,
                    title: _('Confirm Cancel Editing'),
                    dialogClass: editor.options.dialogClass + ' ' + editor.options.baseClass,
                    show: editor.options.dialogShowAnimation,
                    hide: editor.options.dialogHideAnimation,
                    buttons: [
                        {
                            text: _('OK'),
                            click: function() {
                                plugin.cancel();
                                $(this).dialog('close');
                            }
                        },
                        {
                            text: _('Cancel'),
                            click: function() {
                                $(this).dialog('close');
                            }
                        }
                    ],
                    open: function() {
                        // Apply custom icons to the dialog buttons
                        var buttons = $(this).parent().find('.ui-dialog-buttonpane');
                        buttons.find('button:eq(0)').button({ icons: { primary: 'ui-icon-circle-check' }});
                        buttons.find('button:eq(1)').button({ icons: { primary: 'ui-icon-circle-close' }});
                    },
                    close: function() {
                        $(this).dialog('destroy').remove();
                    }
                });
            }
        }

    }
});

$.ui.editor.registerPlugin({
  /**
    * @name $.editor.plugin.cancel
    * @augments $.ui.editor.defaultPlugin
    * @class Plugin providing cancel functionality
    */
   cancel: /** @lends $.editor.plugin.cancel.prototype */ {

        /**
         * Cancel editing
         * by resetting the editor's html its pre-intitialisation state, hiding the toolbar and disabling editing on the element
         */
        cancel: function() {
            this.editor.unify(function(editor) {
                editor.fire('cancel');
                editor.resetHtml();
                editor.hideToolbar();
                editor.disableEditing();
            });
        }
   }
});
/**
 * @fileOverview Clean plugin & ui component
 * @author David Neilsen david@panmedia.co.nz
 * @author Michael Robinson michael@panmedia.co.nz
 */

 /**
  * @name $.editor.plugin.clean
  * @augments $.ui.editor.defaultPlugin
  * @class Strips empty tags and unwanted attributes from editing element
  */
  $.ui.editor.registerPlugin('clean', /** @lends $.editor.plugin.clean.prototype */ {

    /**
     * Attributes to be stripped, empty tags to be removed & attributes to be removed if empty
     * @type {Object}
     */
    options: {

        /**
         * Attributes to be completely removed
         * @type {Array}
         */
        stripAttrs: ['_moz_dirty'],

        /**
         * Attribute contents to be stripped
         * @type {Object}
         */
        stripAttrContent: {
            type: '_moz'
        },

        /**
         * Tags to be removed if empty
         * @type {String[]}
         */
        stripEmptyTags: [
            'span', 'h1', 'h2', 'h3', 'h4', 'h5',  'h6',
            'p', 'b', 'i', 'u', 'strong', 'em',
            'big', 'small', 'div'
        ],

        /**
         * Attributes to be removed if empty
         * @type {String[]}
         */
        stripEmptyAttrs: [
            'class', 'id', 'style'
        ],

        /**
         * Tag attributes to remove the domain part of a URL from.
         * @type {Object[]}
         */
        stripDomains: [
            {selector: 'a', attributes: ['href']},
            {selector: 'img', attributes: ['src']}
        ]
    },

    /**
     * Binds {@link $.editor.plugin.clean#clean} to the change event
     * @see $.ui.editor.defaultPlugin#init
     */
    init: function(editor, options) {
        editor.bind('change', this.clean, this);
    },

    /**
     * Removes empty tags and unwanted attributes from the element
     */
    clean: function() {
        var i;
        var editor = this.editor;
        for (i = 0; i < this.options.stripAttrs.length; i++) {
            editor.getElement()
                .find('[' + this.options.stripAttrs[i] + ']')
                .removeAttr(this.options.stripAttrs[i]);
        }
        for (i = 0; i < this.options.stripAttrContent.length; i++) {
            editor.getElement()
                .find('[' + i + '="' + this.options.stripAttrs[i] + '"]')
                .removeAttr(this.options.stripAttrs[i]);
        }
        for (i = 0; i < this.options.stripEmptyTags.length; i++) {
            editor.getElement()
                .find(this.options.stripEmptyTags[i])
                .filter(function() {
                    if ($.trim($(this).html()) === '') {
                        return true;
                    }
                    // Do not clear selection markers if the editor has it in use
                    if ($(this).hasClass('rangySelectionBoundary') && selectionSaved() === false) {
                        return true;
                    }
                })
                .remove();
        }
        for (i = 0; i < this.options.stripEmptyAttrs.length; i++) {
            var attr = this.options.stripEmptyAttrs[i];
            editor.getElement()
                .find('[' + this.options.stripEmptyAttrs[i] + ']')
                .filter(function() {
                    return $.trim($(this).attr(attr)) === '';
                }).removeAttr(this.options.stripEmptyAttrs[i]);
        }

        // Strip domains
        var origin = window.location.protocol + '//' + window.location.host,
            protocolDomain = '//' + window.location.host;
        for (i = 0; i < this.options.stripDomains.length; i++) {
            var def = this.options.stripDomains[i];

            // Clean only elements within the editing element
            this.editor.getElement().find(def.selector).each(function() {
                for (var j = 0; j < def.attributes.length; j++) {
                    var attr = $(this).attr(def.attributes[j]);
                    // Do not continue if there are no attributes
                    if (typeof attr === 'undefined') {
                        continue;
                    }
                    if (attr.indexOf(origin) === 0) {
                        $(this).attr(def.attributes[j], attr.substr(origin.length));
                    } else if (attr.indexOf(protocolDomain) === 0) {
                        $(this).attr(def.attributes[j], attr.substr(protocolDomain.length));
                    }
                }
            });
        }

        // Ensure ul, ol content is wrapped in li's
        this.editor.getElement().find('ul, ol').each(function() {
            $(this).find(' > :not(li)').each(function() {
                if (elementDefaultDisplay($(this).attr('tag'))) {
                    $(this).replaceWith($('<li>' + $(this).html() + '</li>').appendTo('body'));
                } else {
                    $(this).wrap($('<li>'));
                }
            });
        });
    }
});

$.ui.editor.registerUi({
    /**
      * @name $.editor.ui.clean
      * @augments $.ui.editor.defaultUi
      * @class UI component that calls {@link $.editor.plugin.clean#clean} when clicked
      */
    clean: /** @lends $.editor.ui.clean.prototype */ {

        /**
         * @see $.ui.editor.defaultUi#init
         */
        init: function(editor) {
            return editor.uiButton({
                title: _('Remove unnecessary markup from editor content'),
                click: function() {
                    editor.getPlugin('clean').clean();
                }
            });
        }
    }
});
/**
 * @fileOverview
 * @author David Neilsen david@panmedia.co.nz
 */

$.ui.editor.registerUi({

    /**
     * @name $.editor.ui.clearFormatting
     * @augments $.ui.editor.defaultUi
     * @class Removes all formatting (wrapping tags) from the selected text.
     */
    clearFormatting: /** @lends $.editor.ui.clearFormatting.prototype */ {

        /**
         * @see $.ui.editor.defaultUi#init
         */
        init: function(editor, options) {
            return this.editor.uiButton({
                title: _('Clear Formatting'),
                click: function() {
                    var sel = rangy.getSelection();
                    if (sel.rangeCount > 0) {
                        // Create a copy of the selection range to work with
                        var range = sel.getRangeAt(0).cloneRange();

                        // Get the selected content
                        var content = range.extractContents();

                        // Expand the range to the parent if there is no selected content
                        if (fragmentToHtml(content) == '') {
                            editor.expandToParent(range);
                            sel.setSingleRange(range);
                            content = range.extractContents();
                        }

                        content = $('<div/>').append(fragmentToHtml(content)).text();

                        // Get the containing element
                        var parent = range.commonAncestorContainer;
                        while (parent && parent.parentNode != editor.getElement().get(0)) {
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


/**
 * If a entire heading is selected, replace it with a p
 *
 * If part of a heading is selected, remove all inline styles, and disallowed tags from the selection.
 *
 * If content inside a p remove all inline styles, and disallowed tags from the selection.
 *
 * If the selection starts in a heading, then ends in another element, convert all headings to a p.
 *
 */

//                    selectionEachRange(function(range) {
//                        if (range.collapsed) {
//                            // Expand to parent
//                            rangeExpandTo(range, [editor.getElement(), 'p, h1, h2, h3, h4, h5, h6']);
//                        }
//
//                        if (rangeIsWholeElement(range)) {
//
//                        }
//
//                        if (range.endOffset === 0) {
//                            range.setEndBefore(range.endContainer);
//                            console.log(range.endContainer);
//                        }
//                        range.refresh();
//                        console.log(range);
//
////                        console.log(range);
////                        console.log(range.toHtml(), range.toString());
////                        console.log($(range.commonAncestorContainer).html(), $(range.commonAncestorContainer).text());
////                        console.log($(range.toHtml()));
////                        range.splitBoundaries();
////                        console.log(range);
////                        var nodes = range.getNodes([3]);
////                        console.log(nodes);
////                        for (var i = nodes.length - 1; i >= 0; i--) {
////                            console.log(nodes[i]);
////                            console.log($.trim(nodes[i].nodeValue) === '');
////                            //console.log(nodes[i].nodeValue, $.trim(nodes[i].nodeValue));
////                        }
//                        selectionSet(range);
//                    });

                    editor.checkChange();
                }
            });
        }
    }

});
/**
 * @fileOverview Click to edit plugin
 * @author David Neilsen david@panmedia.co.nz
 * @author Michael Robinson michael@panmedia.co.nz
 */

 /**
  * @name $.editor.plugin.clickToEdit
  * @augments $.ui.editor.defaultPlugin
  * @class Shows a message at the center of an editable block,
  * informing the user that they may click to edit the block contents
  */
$.ui.editor.registerPlugin('clickToEdit', /** @lends $.editor.plugin.clickToEdit.prototype */ {

    /**
     * @see $.ui.editor.defaultPlugin#init
     */
    init: function(editor, options) {
        var plugin = this;
        var message = $(editor.getTemplate('clicktoedit.message', options)).appendTo('body');

        /**
        * Plugin option defaults
        * @type {Object}
        */
        options = $.extend({}, {

            /**
             * @type {Boolean} true if links should be obscured
             */
            obscureLinks: false,
            position: {
                at: 'center center',
                of: editor.getElement(),
                my: 'center center',
                using: function(position) {
                    $(this).css({
                        position: 'absolute',
                        top: position.top,
                        left: position.left
                    });
                }
            }
        }, options);

        this.selection = function() {
            var range;
            if (document.selection) {   // IE
                range = document.selection.createRange();
            } else if (document.getSelection().rangeCount) {    // Others
                range = document.getSelection().getRangeAt(0);
            }
            return range;
        };

        /**
         * Show the click to edit message
         */
        this.show = function() {
            if (editor.isEditing()) return;
            editor.getElement().addClass(options.baseClass + '-highlight');
            editor.getElement().addClass(options.baseClass + '-hover');
            message.position(options.position);
            message.addClass(options.baseClass + '-visible');
        };

        /**
         * Hide the click to edit message
         */
        this.hide = function() {
            editor.getElement().removeClass(options.baseClass + '-highlight');
            editor.getElement().removeClass(options.baseClass + '-hover');
            message.removeClass(options.baseClass + '-visible');
        };

        /**
         * Hide the click to edit message and show toolbar
         */
        this.edit = function() {
            plugin.hide();
            if (!editor.isEditing()) editor.enableEditing();
            if (!editor.isVisible()) editor.showToolbar(plugin.selection());
        };

        message.position(options.position);

        // Prevent disabling links if required
        if (!options.obscureLinks) {
            editor.getElement().find('a').bind('mouseenter.' + editor.widgetName, plugin.hide);
            editor.getElement().find('a').bind('mouseleave.' + editor.widgetName, plugin.show);
        }
        editor.getElement().bind('mouseenter.' + editor.widgetName, plugin.show);
        editor.getElement().bind('mouseleave.' + editor.widgetName, plugin.hide);
        editor.getElement().bind('click.' + editor.widgetName, function(event) {
            // Prevent disabling links if required
            if (options.obscureLinks || (!$(event.target).is('a') && !$(event.target).parents('a').length)) {
                plugin.edit();
            }
        });
        editor.bind('destroy', function() {
            message.remove();
            editor.getElement().unbind('mouseenter.' + editor.widgetName, plugin.show);
            editor.getElement().unbind('mouseleave.' + editor.widgetName, plugin.hide);
            editor.getElement().unbind('click.' + editor.widgetName, plugin.edit);
        });
    }
});/**
 * @fileOverview Dock plugin
 * @author David Neilsen david@panmedia.co.nz
 * @author Michael Robinson michael@panmedia.co.nz
 */

/**
 * @name $.editor.plugin.dock
 * @augments $.ui.editor.defaultPlugin
 * @see  $.editor.ui.dock
 * @class Allow the user to dock / undock the toolbar from the document body or editing element
 */
$.ui.editor.registerPlugin('dock', /** @lends $.editor.plugin.dock.prototype */ {

    enabled: false,
    docked: false,
    topSpacer: null,
    bottomSpacer: null,

    options: {
        docked: false,
        dockToElement: false,
        dockUnder: false,
        persist: true,
        persistID: null
    },

    /**
     * @see $.ui.editor.defaultPlugin#init
     */
    init: function(editor) {
        this.bind('show', this.show);
        this.bind('hide', this.hide);
        this.bind('disabled', this.disable);
        this.bind('destroy', this.destroy, this);
    },

    show: function() {
        if (!this.enabled) {
            // When the editor is enabled, if persistent storage or options indicate that the toolbar should be docked, dock the toolbar
            if (this.loadState() || this.options.docked) {
                this.dock();
            }
            this.enabled = true;
        } else if (this.isDocked()) {
            this.showSpacers();
        }
    },

    hide: function() {
        this.hideSpacers();
        this.editor.toolbar
            .css('width', 'auto');
    },

    showSpacers: function() {
        if (this.options.dockToElement || !this.editor.toolbar.is(':visible')) {
            return;
        }

        this.topSpacer = $('<div/>')
            .addClass(this.options.baseClass + '-top-spacer')
            .height(this.editor.toolbar.outerHeight())
            .prependTo('body');

        this.bottomSpacer = $('<div/>')
            .addClass(this.options.baseClass + '-bottom-spacer')
            .height(this.editor.path.outerHeight())
            .appendTo('body');

        // Fire resize event to trigger plugins (like unsaved edit warning) to reposition
        this.editor.fire('resize');
    },

    hideSpacers: function() {
        if (this.topSpacer) {
            this.topSpacer.remove();
            this.topSpacer = null;
        }
        if (this.bottomSpacer) {
            this.bottomSpacer.remove();
            this.bottomSpacer = null;
        }

        // Fire resize event to trigger plugins (like unsaved edit warning) to reposition
        this.editor.fire('resize');
    },


    /**
     * Change CSS styles between two values.
     *
     * @param  {Object} to    Map of CSS styles to change to
     * @param  {Object} from  Map of CSS styles to change from
     * @param  {Object} style Map of styles to perform changes within
     * @return {Object} Map of styles that were changed
     */
    swapStyle: function(to, from, style) {
        var result = {};
        for (var name in style) {
            // Apply the style from the 'form' element to the 'to' element
            to.css(name, from.css(name));
            // Save the original style to revert the swap
            result[name] = from.css(name);
            // Apply the reset to the 'from' element'
            from.css(name, style[name]);
        }
        return result;
    },

    /**
     * Set CSS styles to given values.
     *
     * @param  {Object} to    Map of CSS styles to change to
     * @param  {Object} style Map of CSS styles to change within
     */
    revertStyle: function(to, style) {
        for (var name in style) {
            to.css(name, style[name]);
        }
    },

    /**
     * Dock the toolbar to the editing element
     */
    dockToElement: function() {
        var plugin = this;

        // <debug/>

        // Needs to be in the ready event because we cant insert to the DOM before ready (if auto enabling, before ready)
//        $(function() {
//            var element = plugin.editor.getElement()
//                .addClass(plugin.options.baseClass + '-docked-element');
//            plugin.editor.wrapper
//                .addClass(plugin.options.baseClass + '-docked-to-element')
//                .insertBefore(plugin.editor.getElement())
//                .append(element);
//        });

        var wrapper = $('<div/>')
            .insertBefore(this.editor.getElement())
            .addClass(this.options.baseClass + '-docked-to-element-wrapper');

        this.editor.wrapper
            .appendTo(wrapper);

        this.previousStyle = this.swapStyle(wrapper, this.editor.getElement(), {
            'display': 'block',
            'float': 'none',
            'clear': 'none',
            'position': 'static',
            'margin-left': 0,
            'margin-right': 0,
            'margin-top': 0,
            'margin-bottom': 0,
            'outline': 0,
            'width': 'auto'
        });

//        plugin.editor.wrapper.css('display', '');

        wrapper.css('width', wrapper.width() +
            parseInt(this.editor.getElement().css('padding-left'), 10) +
            parseInt(this.editor.getElement().css('padding-right'), 10));/* +
            parseInt(this.editor.getElement().css('border-right-width')) +
            parseInt(this.editor.getElement().css('border-left-width')));*/

        this.editor.getElement()
            .appendTo(this.editor.wrapper)
            .addClass(this.options.baseClass + '-docked-element');
    },

    /**
     * Undock toolbar from editing element
     */
    undockFromElement: function() {
        // <debug/>

//        var wrapper = this.editor.wrapper.parent();

        this.editor.getElement()
            .insertAfter(this.editor.wrapper)
            .removeClass(this.options.baseClass + '-docked-element');

        this.editor.wrapper
            .appendTo('body')
            .removeClass(this.options.baseClass + '-docked-to-element');

//        this.revertStyle(this.editor.getElement(), this.previousStyle);

//        this.editor.dialog('option', 'position', this.editor.dialog('option', 'position'));

//        wrapper.remove();
    },

    /**
     * Dock the toolbar to the document body (top of the screen)
     */
    dockToBody: function() {
        // <debug/>

        var top = 0;
        if ($(this.options.dockUnder).length) {
            top = $(this.options.dockUnder).outerHeight();
        }

        this.top = this.editor.toolbarWrapper.css('top');
        this.editor.toolbarWrapper.css('top', top);
        this.editor.wrapper.addClass(this.options.baseClass + '-docked');

        // Position message wrapper below the toolbar
        this.editor.messages.css('top', top + this.editor.toolbar.outerHeight());
    },

    /**
     * Undock toolbar from document body
     */
    undockFromBody: function() {
        // <debug/>

        this.editor.toolbarWrapper.css('top', this.top);
        // Remove the docked class
        this.editor.wrapper.removeClass(this.options.baseClass + '-docked');

        this.hideSpacers();
    },

    /**
     * Dock toolbar to element or body
     */
    dock: function() {
        if (this.docked) return;

        // Save the state of the dock
        this.docked = this.saveState(true);

        if (this.options.dockToElement) {
            this.dockToElement();
        } else {
            this.dockToBody();
        }

        // Change the dock button icon & title
        var button = this.editor.wrapper
            .find('.' + this.options.baseClass + '-button')
            .button({icons: {primary: 'ui-icon-pin-w'}});

        if (button.attr('title')) {
            button.attr('title', this.getTitle());
        } else {
            button.attr('data-title', this.getTitle());
        }

        // Add the header class to the editor toolbar
        this.editor.toolbar.find('.' + this.editor.options.baseClass + '-inner')
            .addClass('ui-widget-header');

        this.showSpacers();
    },

    /**
     * Undock toolbar
     */
    undock: function() {
        if (!this.docked) return;

        // Save the state of the dock
        this.docked = this.destroying ? false : this.saveState(false);

        // Remove the header class from the editor toolbar
        this.editor.toolbar.find('.' + this.editor.options.baseClass + '-inner')
            .removeClass('ui-widget-header');

        // Change the dock button icon & title
        var button = this.editor.wrapper
            .find('.' + this.options.baseClass + '-button')
            .button({icons: {primary: 'ui-icon-pin-s'}});

        if (button.attr('title')) {
            button.attr('title', this.getTitle());
        } else {
            button.attr('data-title', this.getTitle());
        }

        if (this.options.dockToElement) this.undockFromElement();
        else this.undockFromBody();

        // Trigger the editor resize event to adjust other plugin element positions
        this.editor.fire('resize');
    },

    /**
     * @return {Boolean} True if the toolbar is docked to the editing element or document body
     */
    isDocked: function() {
        return this.docked;
    },

    /**
     * @return {String} Title text for the dock ui button, differing depending on docked state
     */
    getTitle: function() {
        return this.isDocked() ? _('Click to detach the toolbar') : _('Click to dock the toolbar');
    },

    saveState: function(state) {
        if (!this.persist) {
            return;
        }
        if (this.persistID) {
            this.persist('docked:' + this.persistID, state);
        } else {
            this.persist('docked', state);
        }
        return state;
    },

    loadState: function() {
        if (!this.persist) {
            return null;
        }
        if (this.persistID) {
            return this.persist('docked:' + this.persistID);
        }
        return this.persist('docked');
    },

    /**
     * Hide the top and bottom spacers when editing is disabled
     */
    disable: function() {
        this.hideSpacers();
    },

    /**
     * Undock the toolbar
     */
    destroy: function() {
        this.destroying = true;
        this.undock();
    }
});

$.ui.editor.registerUi({

    /**
     * @name $.editor.ui.dock
     * @augments $.ui.editor.defaultUi
     * @see  $.editor.plugin.dock
     * @class Interface for the user to dock / undock the toolbar using the {@link $.editor.plugin.dock} plugin
     */
    dock: /** @lends $.editor.ui.dock.prototype */ {

        hotkeys: {
            'ctrl+d': {
                'action': function() {
                    this.ui.click();
                }
            }
        },

        /**
         * @see $.ui.editor.defaultUi#init
         */
        init: function(editor) {
            return editor.uiButton({
                title: editor.getPlugin('dock').getTitle(),
                icon: editor.getPlugin('dock').isDocked() ? 'ui-icon-pin-w' : 'ui-icon-pin-s',
                click: function() {
                    // Toggle dock on current editor
                    var plugin = editor.getPlugin('dock');
                    if (plugin.isDocked()) plugin.undock();
                    else plugin.dock();

                    // Set (un)docked on all unified editors
                    editor.unify(function(editor) {
                        if (plugin.isDocked()) editor.getPlugin('dock').dock();
                        else editor.getPlugin('dock').undock();
                    });
                }
            });
        }
    }
});
/**
 * @fileOverview embed UI component
 * @author David Neilsen david@panmedia.co.nz
 * @author Michael Robinson michael@panmedia.co.nz
 */
 $.ui.editor.registerUi({

    /**
     * @name $.editor.ui.embed
     * @augments $.ui.editor.defaultUi
     * @class Shows a dialog containing the element's markup, allowing the user to edit the source directly
     */
    embed: /** @lends $.editor.ui.embed.prototype */ {

        /**
         * Reference to the embed dialog. Only one dialog avalible for all editors.
         * @type {Object}
         */
        dialog: null,

        /**
         * @see $.ui.editor.defaultUi#init
         */
        init: function(editor, options) {
            editor.bind('hide', this.hide, this);
            return editor.uiButton({
                icon: 'ui-icon-youtube',
                title: _('Embed object'),
                click: function() {
                    this.show();
                }
            });
        },

        /**
         * Hide, destroy & remove the embed dialog. Enable the button.
         */
        hide: function() {
            if (this.dialog) $(this.dialog).dialog('destroy').remove();
            this.dialog = null;
            $(this.ui.button).button('option', 'disabled', false);
        },

        /**
         * Show the embed dialog. Disable the button.
         */
        show: function() {
            if (!this.dialog) {
                $(this.ui.button).button('option', 'disabled', true);
                var ui = this;

                selectionSave();

                this.dialog = $(this.editor.getTemplate('embed.dialog'));
                this.dialog.dialog({
                    modal: false,
                    width: 600,
                    height: 400,
                    resizable: true,
                    title: _('Paste Embed Code'),
                    autoOpen: true,
                    dialogClass: ui.options.baseClass + ' ' + ui.options.dialogClass,
                    buttons: [
                        {
                            text: _('Embed Object'),
                            click: function() {
                                selectionRestore();
                                selectionReplace($(this).find('textarea').val());
                                $(this).dialog('close');
                            }
                        },
                        {
                            text: _('Close'),
                            click: function() {
                                ui.hide();
                            }
                        }
                    ],
                    open: function() {
                        var buttons = $(this).parent().find('.ui-dialog-buttonpane');
                        buttons.find('button:eq(0)').button({ icons: { primary: 'ui-icon-circle-check' }});
                        buttons.find('button:eq(1)').button({ icons: { primary: 'ui-icon-circle-close' }});

                        // Create fake jQuery UI tabs (to prevent hash changes)
                        var tabs = $(this).find('.ui-editor-embed-panel-tabs');

                        tabs.find('ul li').click(function() {
                            tabs.find('ul li').removeClass('ui-state-active').removeClass('ui-tabs-selected');
                            $(this).addClass('ui-state-active').addClass('ui-tabs-selected');
                            tabs.children('div').hide().eq($(this).index()).show();
                        });

                        var preview = $(this).find('.ui-editor-embed-preview');
                        $(this).find('textarea').change(function() {
                            $(preview).html($(this).val());
                        });

                    },
                    close: function() {
                        ui.hide();
                    }
                });
            }
        }
    }
});/**
 * @fileOverview Plugin that wraps naked content.
 * @author David Neilsen david@panmedia.co.nz
 * @author Michael Robinson michael@panmedia.co.nz
 */

/**
 * @name $.editor.plugin.emptyElement
 * @augments $.ui.editor.defaultPlugin
 * @class Automaticly wraps content inside an editable element with a specified tag if it is empty.
 */
$.ui.editor.registerPlugin('emptyElement', /** @lends $.editor.plugin.emptyElement.prototype */ {

    /**
     * @name $.editor.plugin.emptyElement.options
     * @type {Object}
     * @namespace Default options
     * @see $.editor.plugin.emptyElement
     */
    options: /** @lends $.editor.plugin.emptyElement.options */  {

        /**
         * The tag to wrap bare text nodes with.
         * @type {String}
         */
        tag: '<p/>'
    },

    /**
     * @see $.ui.editor.defaultPlugin#init
     */
    init: function(editor, options) {
        this.bind('change', this.change)
    },

    change: function() {
        var plugin = this;
        this.textNodes(this.editor.getElement()).each(function() {
            $(this).wrap($(plugin.options.tag));
            // Set caret position to the end of the current text node
            selectionSelectEnd(this);
        });
        this.editor.checkChange();
    },

    /**
     * Returns the text nodes of an element (not including child elements), filtering
     * out blank (white space only) nodes.
     *
     * @param {jQuerySelector|jQuery|Element} element
     * @returns {jQuery}
     */
    textNodes: function(element) {
        return $(element).contents().filter(function() {
            return this.nodeType == 3 && $.trim(this.nodeValue).length;
        });
    }

});
/**
 * @fileOverview File Manager ui component
 * @author David Neilsen david@panmedia.co.nz
 * @author Michael Robinson michael@panmedia.co.nz
 */
$(function() {

     $.ui.editor.registerUi({

       /**
        * @name $.editor.ui.insertFile
        * @augments $.ui.editor.defaultUi
        */
        insertFile: /** @lends $.editor.ui.insertFile.prototype */ {

            fileManager: null,

            imageTypes: [
                'jpg',
                'jpeg',
                'png',
                'gif'
            ],

            /**
             * @see $.ui.editor.defaultUi#init
             */
            init: function(editor, options) {
                return editor.uiButton({
                    title: 'Insert image or uploaded file',
                    icon: 'ui-icon-image',
                    click: function() {

                        var ui = this;
                        selectionSave();

                        if (this.fileManager === null) {
                            this.fileManager = $.ui.filemanager.create({
                                enablePlugins: false,
                                // ajaxSource: '/filemanager/admin',
                                plugins: {
                                    datatables: !XMod.FileManager.Permissions.insert ? false : {
                                        ajaxSource: '/filemanager/admin/datatables',
                                        insertionCallback: function(files) {

                                            selectionRestore();

                                            if (!files.length) {
                                                return true;
                                            }

                                            var completeInsertion = function() {
                                                ui.editor.fire('change');
                                                return true;
                                            };

                                            var anchorClassNames = function(file, options) {
                                                return options.cssPrefix + 'file ' + options.cssPrefix + file.type;
                                            };

                                            if (files.length === 1) {
                                                var file = files[0];

                                                if (ui.isImage(file)) {
                                                    selectionReplace(ui.createImage(file, options.cssPrefix + file.type));
                                                    return completeInsertion();
                                                }

                                                if (ui.editor.selectionExists()) {
                                                    selectionWrapTagWithAttribute('a', {
                                                        href: file.url,
                                                        className: anchorClassNames(file, ui.options)
                                                    });
                                                    return completeInsertion();
                                                }
                                                selectionReplace(ui.createAnchor(file, anchorClassNames(file, ui.options)));
                                                return completeInsertion();

                                            }

                                            var elements = [];
                                            var file;
                                            for (var filesIndex = 0; filesIndex < files.length; filesIndex++) {
                                                file = files[filesIndex];
                                                if (ui.isImage(file)) {
                                                    elements.push($('<div/>').html(ui.createImage(file, options.cssPrefix + file.type)).html());
                                                } else {
                                                    elements.push($('<div/>').html(ui.createAnchor(file, anchorClassNames(file, ui.options))).html());
                                                }
                                            }
                                            selectionReplace(elements.join(', '));
                                            return completeInsertion();
                                        }
                                    },
                                    plupload: !XMod.FileManager.Permissions.upload ? false : {
                                        url: '/filemanager/admin/plupload'
                                    }
                                }
                            });
                        }

                        $(this.fileManager).filemanager('show');
                    }
                });
            },

            isImage: function(file) {
                if (-1 !== $.inArray(file.type.toLowerCase(), this.imageTypes)) {
                    return true;
                }
                return false;
            },

            createImage: function(file, classNames) {
                return $('<img/>').attr({
                    src: file.url,
                    title: file.name,
                    'class': classNames
                });
            },

            createAnchor: function(file, classNames) {
                return $('<a/>').attr({
                    href: file.url,
                    title: file.name,
                    'class': classNames
                }).html(file.name);
            }

        }
    });
});
/**
 * @fileOverview Float ui components
 * @author David Neilsen david@panmedia.co.nz
 * @author Michael Robinson michael@panmedia.co.nz
 */

 $.ui.editor.registerUi({

    /**
     * @name $.editor.ui.floatLeft
     * @augments $.ui.editor.defaultUi
     * @class Floats the selected or nearest block-level element left
     * <br/>
     * Toggles <tt>float: left</tt>
     */
    floatLeft: /** @lends $.editor.ui.floatLeft.prototype */ {

        /**
         * @see $.ui.editor.defaultUi#init
         */
        init: function(editor) {
            return editor.uiButton({
                title: _('Float Image Left'),
                click: function() {
                    selectionEachRange(function(range) {
                        $(range.commonAncestorContainer).find('img').css('float', 'left');
                    });
                }
            });
        }
    },

    /**
     * @name $.editor.ui.floatRight
     * @augments $.ui.editor.defaultUi
     * @class Floats the selected or nearest block-level element right
     * <br/>
     * Toggles <tt>float: right</tt>
     */
    floatRight: /** @lends $.editor.ui.floatRight.prototype */ {

        /**
         * @see $.ui.editor.defaultUi#init
         */
        init: function(editor) {
            return editor.uiButton({
                title: _('Float Image Right'),
                click: function() {
                    selectionEachRange(function(range) {
                        $(range.commonAncestorContainer).find('img').css('float', 'right');
                    });
                }
            });
        }
    },

    /**
     * @name $.editor.ui.floatNone
     * @augments $.ui.editor.defaultUi
     * @class Sets float none to the selected or nearest block-level element
     * <br/>
     * Toggles <tt>float: right</tt>
     */
    floatNone: /** @lends $.editor.ui.floatNone.prototype */ {

        /**
         * @see $.ui.editor.defaultUi#init
         */
        init: function(editor) {
            return editor.uiButton({
                title: _('Remove Image Float'),
                click: function() {
                    selectionEachRange(function(range) {
                        $(range.commonAncestorContainer).find('img').css('float', 'none');
                    });
                }
            });
        }
    }
});/**
 * @fileOverview Font size ui components
 * @author David Neilsen david@panmedia.co.nz
 * @author Michael Robinson michael@panmedia.co.nz
 */

 $.ui.editor.registerUi({

    /**
     * @name $.editor.ui.fontSizeInc
     * @augments $.ui.editor.defaultUi
     * @class Wraps selection with &lt;big&gt; tags or unwraps &lt;small&gt; tags from selection
     */
    fontSizeInc: /** @lends $.editor.ui.fontSizeInc.prototype */ {

        /**
         * @see $.ui.editor.defaultUi#init
         */
        init: function(editor, options) {
            return editor.uiButton({
                title: _('Increase Font Size'),
                click: function() {
                    editor.inverseWrapWithTagClass('big', options.cssPrefix + 'big', 'small', options.cssPrefix + 'small');
                }
            });
        }
    },

    /**
     * @name $.editor.ui.fontSizeDec
     * @augments $.ui.editor.defaultUi
     * @class Wraps selection with &lt;small&gt; tags or unwraps &lt;big&gt; tags from selection
     */
    fontSizeDec: /** @lends $.editor.ui.fontSizeDec.prototype */ {

        /**
         * @see $.ui.editor.defaultUi#init
         */
        init: function(editor, options) {
            return editor.uiButton({
                title: _('Decrease Font Size'),
                click: function() {
                    editor.inverseWrapWithTagClass('small', options.cssPrefix + 'small', 'big', options.cssPrefix + 'big');
                }
            });
        }
    }
});
/**
 * @fileOverview Show guides ui component
 * @author David Neilsen david@panmedia.co.nz
 * @author Michael Robinson michael@panmedia.co.nz
 */

$.ui.editor.registerUi({

     /**
     * @name $.editor.ui.showGuides
     * @augments $.ui.editor.defaultUi
     * @class Outlines elements contained within the editing element
     */
    showGuides: /** @lends $.editor.ui.showGuides.prototype */ {

        /**
         * @see $.ui.editor.defaultUi#init
         */
        init: function(editor, options) {

            editor.bind('cancel', this.cancel, this);
            editor.bind('destroy', this.cancel, this);

            return editor.uiButton({
                title: _('Show Guides'),
                icon: 'ui-icon-pencil',
                click: function() {
                    editor.getElement().toggleClass(options.baseClass + '-visible');
                }
            });
        },

        cancel: function() {
            this.editor.getElement().removeClass(this.options.baseClass + '-visible');
        }
    }
});
/**
 * @fileOverview History ui components
 * @author David Neilsen david@panmedia.co.nz
 * @author Michael Robinson michael@panmedia.co.nz
 */

$.ui.editor.registerUi({

    /**
     * @name $.editor.ui.undo
     * @augments $.ui.editor.defaultUi
     * @class Revert most recent change to element content
     */
    undo: /** @lends $.editor.ui.undo.prototype */ {
        options: {
            disabled: true
        },

        hotkeys: {
            'ctrl+z': {
                'action': function() {
                    this.editor.historyBack();
                }
            }
        },

        /**
         * @see $.ui.editor.defaultUi#init
         */
        init: function(editor) {
            editor.bind('change', this.change, this);

            return editor.uiButton({
                title: _('Step Back'),
                click: function() {
                    editor.historyBack();
                }
            });
        },
        change: function() {
            if (this.editor.present === 0) this.ui.disable();
            else this.ui.enable();
        }
    },

    /**
     * @name $.editor.ui.redo
     * @augments $.ui.editor.defaultUi
     * @class Step forward through the stored history
     */
    redo: /** @lends $.editor.ui.redo.prototype */ {

        options: {
            disabled: true
        },

        hotkeys: {
            'ctrl+shift+z': {
                'action': function() {
                    this.editor.historyForward();
                }
            },
            'ctrl+y': {
                'action': function() {
                    this.editor.historyForward();
                }
            }
        },

        /**
         * @see $.ui.editor.defaultUi#init
         */
        init: function(editor) {
            editor.bind('change', this.change, this);

            return this.ui = editor.uiButton({
                title: _('Step Forward'),
                click: function() {
                    editor.historyForward();
                }
            });
        },
        change: function() {
            if (this.editor.present === this.editor.history.length - 1) this.ui.disable();
            else this.ui.enable();
        }
    }
});
/**
 * @fileOverview Insert hr ui component
 * @author David Neilsen david@panmedia.co.nz
 * @author Michael Robinson michael@panmedia.co.nz
 */
 $.ui.editor.registerUi({

    /**
     * @name $.editor.ui.hr
     * @augments $.ui.editor.defaultUi
     * @class Shows a message at the center of an editable block,
     * informing the user that they may click to edit the block contents
     */
    hr: /** @lends $.editor.ui.hr.prototype */ {

        /**
         * @see $.ui.editor.defaultUi#init
         */
        init: function(editor) {
            return editor.uiButton({
                title: _('Insert Horizontal Rule'),
                click: function() {
                    selectionReplace('<hr/>');
                }
            });
        }
    }
});
/**
 * @fileOverview Internationalization UI component
 * @author David Neilsen david@panmedia.co.nz
 * @author Michael Robinson michael@panmedia.co.nz
 */
 $.ui.editor.registerUi({

    /**
     * @name $.editor.ui.i18n
     * @augments $.ui.editor.defaultUi
     * @class Provides a dropdown to allow the user to switch between available localizations
     */
    i18n: /** @lends $.editor.ui.i18n.prototype */ {

        /**
         * @see $.ui.editor.defaultUi#init
         */
        init: function(editor, options) {
            var ui = this;
            var locale = this.persist('locale');
            if (locale) {
                // @todo Move this to the global scope
                setLocale(locale);
            }

            var menu = $('<select autocomplete="off" name="i18n"/>');

            for (var key in locales) {
                var option = $('<option value="' + key + '" class="' + key + '"/>');
                option.html(localeNames[key]);

                if (currentLocale === key) {
                    option.attr('selected', 'selected');
                }

                menu.append(option);
            };

            return editor.uiSelectMenu({
                title: _('Change Language'),
                select: menu,
                change: function(value) {
                    setLocale(ui.persist('locale', value));
                }
            });
        }
    }
});
/**
 * @fileOverview English strings file.
 * @author Raptor, info@raptor-editor.com, http://www.raptor-editor.com/
 */
registerLocale('en', 'English', {
    "A preview of your embedded object is displayed below.": "A preview of your embedded object is displayed below.",
    "Added link: {{link}}": "Added link: {{link}}",
    "All changes will be lost!": "All changes will be lost!",
    "Apply Source": "Apply Source",
    "Are you sure you want to stop editing?": "Are you sure you want to stop editing?",
    "Blockquote": "Blockquote",
    "Bold": "Bold",
    "Cancel": "Cancel",
    "Center Align": "Center Align",
    "Change HTML tag of selected element": "Change HTML tag of selected element",
    "Change Language": "Change Language",
    "Check this box to have the file open in a new browser window": "Check this box to have the file open in a new browser window",
    "Check this box to have the link open in a new browser window": "Check this box to have the link open in a new browser window",
    "Choose a link type:": "Choose a link type:",
    "Clear Formatting": "Clear Formatting",
    "Click to begin editing": "Click to begin editing",
    "Click to detach the toolbar": "Click to detach the toolbar",
    "Click to dock the toolbar": "Click to dock the toolbar",
    "Click to select all editable content": "Click to select all editable content",
    "Click to select the contents of the '{{element}}' element": "Click to select the contents of the '{{element}}' element",
    "Close": "Close",
    "Confirm Cancel Editing": "Confirm Cancel Editing",
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
    "Heading&nbsp;1": "Heading&nbsp;1",
    "Heading&nbsp;2": "Heading&nbsp;2",
    "Heading&nbsp;3": "Heading&nbsp;3",
    "Image height": "Image height",
    "Image width": "Image width",
    "Increase Font Size": "Increase Font Size",
    "Initializing": "Initializing",
    "Insert": "Insert",
    "Insert Horizontal Rule": "Insert Horizontal Rule",
    "Insert Link": "Insert Link",
    "Insert Snippet": "Insert Snippet",
    "Italic": "Italic",
    "Justify": "Justify",
    "Learn More About the Raptor WYSIWYG Editor": "Learn More About the Raptor WYSIWYG Editor",
    "Left Align": "Left Align",
    "Link to a document or other file": "Link to a document or other file",
    "Link to a page on this or another website": "Link to a page on this or another website",
    "Link to an email address": "Link to an email address",
    "Location": "Location",
    "Modify Image Size": "Modify Image Size",
    "N/A": "N/A",
    "New window": "New window",
    "No changes detected to save...": "No changes detected to save...",
    "Not sure what to put in the box above?": "Not sure what to put in the box above?",
    "OK": "OK",
    "Open the uploaded file in your browser": "Open the uploaded file in your browser",
    "Ordered List": "Ordered List",
    "Page on this or another website": "Page on this or another website",
    "Paragraph": "Paragraph",
    "Paste Embed Code": "Paste Embed Code",
    "Paste your embed code into the text area below.": "Paste your embed code into the text area below.",
    "Plain Text": "Plain Text",
    "Preview": "Preview",
    "Raptorize": "Raptorize",
    "Reinitialise": "Reinitialise",
    "Remaining characters before the recommended character limit is reached": "Remaining characters before the recommended character limit is reached",
    "Remove Image Float": "Remove Image Float",
    "Remove Link": "Remove Link",
    "Remove unnecessary markup from editor content": "Remove unnecessary markup from editor content",
    "Resize Image": "Resize Image",
    "Right Align": "Right Align",
    "Save": "Save",
    "Saved {{saved}} out of {{dirty}} content blocks.": "Saved {{saved}} out of {{dirty}} content blocks.",
    "Saving changes...": "Saving changes...",
    "Select all editable content": "Select all editable content",
    "Select {{element}} element": "Select {{element}} element",
    "Show Guides": "Show Guides",
    "Source Code": "Source Code",
    "Step Back": "Step Back",
    "Step Forward": "Step Forward",
    "Strikethrough": "Strikethrough",
    "Sub script": "Sub script",
    "Subject (optional)": "Subject (optional)",
    "Successfully saved {{saved}} content block(s).": "Successfully saved {{saved}} content block(s).",
    "Super script": "Super script",
    "The URL does not look well formed": "The URL does not look well formed",
    "The email address does not look well formed": "The email address does not look well formed",
    "The image \'{{image}}\' is too large for the element being edited.<br/>It will be replaced with a resized copy when your edits are saved.": "The image \'{{image}}\' is too large for the element being edited.<br/>It will be replaced with a resized copy when your edits are saved.",
    "The url for the file you inserted doesn\'t look well formed": "The url for the file you inserted doesn\'t look well formed",
    "The url for the link you inserted doesn\'t look well formed": "The url for the link you inserted doesn\'t look well formed",
    "This block contains unsaved changes": "This block contains unsaved changes",
    "Underline": "Underline",
    "Unnamed Button": "Unnamed Button",
    "Unnamed Select Menu": "Unnamed Select Menu",
    "Unordered List": "Unordered List",
    "Update Link": "Update Link",
    "Updated link: {{link}}": "Updated link: {{link}}",
    "View / Edit Source": "View / Edit Source",
    "View Source": "View Source",
    "\nThere are unsaved changes on this page. \nIf you navigate away from this page you will lose your unsaved changes": "\nThere are unsaved changes on this page. \nIf you navigate away from this page you will lose your unsaved changes",
    "root": "root",
    "{{charactersRemaining}} characters over limit": "{{charactersRemaining}} characters over limit",
    "{{charactersRemaining}} characters remaining": "{{charactersRemaining}} characters remaining",
    "{{characters}} characters, {{charactersRemaining}} over the recommended limit": "{{characters}} characters, {{charactersRemaining}} over the recommended limit",
    "{{characters}} characters, {{charactersRemaining}} remaining": "{{characters}} characters, {{charactersRemaining}} remaining",
    "{{sentences}} sentences": "{{sentences}} sentences",
    "{{words}} word": "{{words}} word",
    "{{words}} words": "{{words}} words"
});
/**
 * @fileOverview Spanish strings file.
 * @author Francisco Martínez (JnxF), paco.7070@hotmail.com, https://twitter.com/ElJnxF
 */
registerLocale('es', 'Español', {
    "A preview of your embedded object is displayed below.": "A continuación se muestra una vista previa de su objeto incrustado.",
    "Added link: {{link}}": "Enlace añadido: {{link}}",
    "All changes will be lost!": "¡Todos los cambios serán perdidos!",
    "Apply Source": "Aplicar Fuente",
    "Are you sure you want to stop editing?": "¿Está seguro de que desea detener la edición?",
    "Blockquote": "Cita en bloque",
    "Bold": "Negrita",
    "Cancel": "Cancelar",
    "Center Align": "Centrar",
    "Change HTML tag of selected element": "Cambiar la etiqueta HTML del elemento seleccionado",
    "Change Language": "Cambiar Idioma",
    "Check this box to have the file open in a new browser window": "Marque esta casilla para que el archivo se abra en una nueva ventana",
    "Check this box to have the link open in a new browser window": "Marque esta casilla para que el enlace se abra en una nueva ventana",
    "Choose a link type:": "Escoja un tipo de enlace:",
    "Clear Formatting": "Limpiar Formato",
    "Click to begin editing": "Haga clic para empezar a editar",
    "Click to detach the toolbar": "Haga clic para desanclar la barra de herramientas",
    "Click to dock the toolbar": "Haga clic para anclar la barra de herramientas",
    "Click to select all editable content": "Haga clic para seleccionar todo el contenido editable",
    "Click to select the contents of the '{{element}}' element": "Haga clic para selecionar el contenido del elemento '{{element}}'",
    "Close": "Cerrar",
    "Confirm Cancel Editing": "Confirme Cancelar la Edición ",
    "Content Statistics": "Contenidos Estadísticos",
    "Content contains more than {{limit}} characters and may be truncated": "El contenido contiene más de {{limit}} carácteres y debe ser truncado",
    "Content will not be truncated": "El contenido no será truncado",
    "Copy the file\'s URL from your browser\'s address bar and paste it into the box above": "Copie la URL de su archivo desde la barra de dirección de su navegador y péguela en la caja superior",
    "Copy the web address from your browser\'s address bar and paste it into the box above": "Copie la dirección web desde la barra de dirección de su navegador y péguela en la caja superior",
    "Decrease Font Size": "Disminuir Tamaño de Fuente",
    "Destroy": "Destruir",
    "Divider": "Divisor",
    "Document or other file": "Documento u otro archivo",
    "Edit Link": "Editar Enlace",
    "Email": "Correo electrónico",
    "Email address": "Dirección de correo electrónico",
    "Embed Code": "Código Incrustado",
    "Embed Object": "Objeto Incrustado",
    "Embed object": "Objeto incrustado",
    "Ensure the file has been uploaded to your website": "Asegúrese de que el archivo ha sido subido a su sitio web",
    "Enter email address": "Introduzca una dirección de correo electrónico",
    "Enter subject": "Introduzca un sujeto",
    "Enter your URL": "Introduzca su URL",
    "Failed to save {{failed}} content block(s).": "Falló al guardar los bloques del cotenido de {{failed}}.",
    "Find the page on the web you want to link to": "Busque la página web a la que desee enlazar",
    "Float Image Left": "Flotar Imagen a la Izquierda",
    "Float Image Right": "Flotar Imagen a la Derecha",
    "Formatted &amp; Cleaned": "Formateado y Limpiado",
    "Formatted Unclean": "Formateado Sucio",
    "Heading&nbsp;1": "Encabezado&nbsp;1",
    "Heading&nbsp;2": "Encabezado&nbsp;2",
    "Heading&nbsp;3": "Encabezado&nbsp;3",
    "Image height": "Altura de imagen",
    "Image width": "Ancho de imagen",
    "Increase Font Size": "Incrementar Tamaño de Fuente",
    "Initializing": "Inicializando",
    "Insert": "Insertar",
    "Insert Horizontal Rule": "Insertar Línea Horizontal",
    "Insert Link": "Insertar Enlace",
    "Insert Snippet": "Insertar Snippet",
    "Italic": "Cursiva",
    "Justify": "Justificar",
    "Learn More About the Raptor WYSIWYG Editor": "Saber más sobre el editor WYSIWYG Raptor",
    "Left Align": "Alinear a la Izquierda",
    "Link to a document or other file": "Enlazar a un documento o a otro archivo",
    "Link to a page on this or another website": "Enlazar a una página en esta u otra página web",
    "Link to an email address": "Enlazar a una dirección de correo electrónico",
    "Location": "Localización",
    "Modify Image Size": "Cambiar Tamaño de Imagen",
    "N/A": false,
    "New window": "Nueva ventana",
    "No changes detected to save...": "No se detectaron cambios para guardar...",
    "Not sure what to put in the box above?": "¿No está seguro de qué poner en la caja anterior?",
    "OK": "Aceptar",
    "Open the uploaded file in your browser": "Abra el archivo cargado en su navegador",
    "Ordered List": "Lista Ordenada",
    "Page on this or another website": "Página en ésta u otra página web",
    "Paragraph": "Párrafo",
    "Paste Embed Code": "Pegar Código Incrustado",
    "Paste your embed code into the text area below.": "Pegue su código incrustado en la caja de texto posterior.",
    "Plain Text": "Texto Llano",
    "Preview": "Previsualizar",
    "Raptorize": "Raptorizar",
    "Reinitialise": "Reinicializar",
    "Remaining characters before the recommended character limit is reached": "Carácteres restantes antes de que se alcance el límite de cáracteres recomendado",
    "Remove Image Float": "No Flotar Imagen",
    "Remove Link": "Eliminar enlace",
    "Remove unnecessary markup from editor content": "Eliminar marcado innecesario del editor de contenido",
    "Resize Image": "Redimensionar Imagen",
    "Right Align": "Alinear a la Derecha",
    "Save": "Guardar",
    "Saved {{saved}} out of {{dirty}} content blocks.": "Guardados {{saved}} de {{dirty}} bloques de contenido.",
    "Saving changes...": "Guardando cambios...",
    "Select all editable content": "Seleccionar todo el contenido editable",
    "Select {{element}} element": "Seleccionar el elemento {{element}}",
    "Show Guides": "Mostrar Guías",
    "Source Code": "Código Fuente",
    "Step Back": "Deshacer",
    "Step Forward": "Rehacer",
    "Strikethrough": "Tachado",
    "Sub script": "Subíndice",
    "Subject (optional)": "Sujeto (opcional)",
    "Successfully saved {{saved}} content block(s).": "Guardado exitosamente {{saved}} bloque(s) de contenido.",
    "Super script": "Superíndice",
    "The URL does not look well formed": "La URL no parece bien formada",
    "The email address does not look well formed": "El enlace de correo electrónico no parece bien formado",
    "The image \'{{image}}\' is too large for the element being edited.<br/>It will be replaced with a resized copy when your edits are saved.": "La imagen \'{{image}}\' es demasiado grande para el elemento que está siendo editado.<br/>Será reemplazada por una copia redimensionada cuando se guarden sus cambios.",
    "The url for the file you inserted doesn\'t look well formed": "La URL del archivo que ha introducido no parece bien formada",
    "The url for the link you inserted doesn\'t look well formed": "La URL del enlace que ha introducido no parece bien formada",
    "This block contains unsaved changes": "Este bloque tiene cambios sin guardar",
    "Underline": "Subrayar",
    "Unnamed Button": "Botón sin Nombre",
    "Unnamed Select Menu": "Menú de Selección sin Nombre",
    "Unordered List": "Lista Desordenada",
    "Update Link": "Actualizar Enlace",
    "Updated link: {{link}}": "Enlace actualizado: {{link}}",
    "View / Edit Source": "Ver / Editar Código Fuente",
    "View Source": "Ver Código Fuente",
    "\nThere are unsaved changes on this page. \nIf you navigate away from this page you will lose your unsaved changes": "\nHay cambios sin guardar en esta página. \nSi sale de esta página, perderá todos los cambios sin guardar",
    "root": "orígen",
    "{{charactersRemaining}} characters over limit": "{{charactersRemaining}} carácter(es) sobre el límite",
    "{{charactersRemaining}} characters remaining": "Queda(n) {{charactersRemaining}} carácter(es)",
    "{{characters}} characters, {{charactersRemaining}} over the recommended limit": "{{characters}} carácter(es), {{charactersRemaining}} sobre el límite recomendado",
    "{{characters}} characters, {{charactersRemaining}} remaining": "{{characters}} carácter(es), queda(n) {{charactersRemaining}}",
    "{{sentences}} sentences": "{{sentences}} oraciones",
    "{{words}} word": "{{words}} palabra",
    "{{words}} words": "{{words}} palabras"
});
/**
 * @fileOverview French strings file.
 * @author SebCorbin, seb.corbin@gmail.com, https://github.com/SebCorbin/
 */
registerLocale('fr', 'Français', {
    "A preview of your embedded object is displayed below.": "Un aperçu de votre objet intégré est affiché ci-dessous.",
    "Added link: {{link}}": "Lien ajouté : {{link}}",
    "All changes will be lost!": "Toutes les modifications seront perdues !",
    "Apply Source": "Appliquer la source",
    "Are you sure you want to stop editing?": "Êtes-vous sûr(e) de vouloir arrêter la modification ?",
    "Blockquote": "Citation",
    "Bold": "Gras",
    "Cancel": "Annuler",
    "Center Align": "Aligner au centre",
    "Change HTML tag of selected element": "Modifier la balise HTML de l'élément sélectionné",
    "Change Language": "Changer de langue",
    "Check this box to have the file open in a new browser window": "Cochez cette case pour ouvrir le fichier dans une nouvelle fenêtre de navigateur",
    "Check this box to have the link open in a new browser window": "Cochez cette case pour ouvrir le lien dans une nouvelle fenêtre de navigateur",
    "Choose a link type:": "Choisissez un type de lien :",
    "Clear Formatting": "Clear Formatting",
    "Click to begin editing": "Cliquer pour commencer la modification",
    "Click to detach the toolbar": "Cliquer pour détacher la barre d'outils",
    "Click to dock the toolbar": "Cliquer pour ancrer la barre d'outils",
    "Click to select all editable content": "Cliquer pour sélectionner tout le contenu modifiable",
    "Click to select the contents of the '{{element}}' element": "Cliquer pour sélectionner le contenu de l'élément '{{element}}'",
    "Close": "Fermer",
    "Confirm Cancel Editing": "Confirmer l'annulation des modifications",
    "Content Statistics": "Statistiques de contenu",
    "Content contains more than {{limit}} characters and may be truncated": "Le contenu contient plus de {{limit}} caractères et peut être tronqué",
    "Content will not be truncated": "Le contenu ne sera pas tronqué",
    "Copy the file\'s URL from your browser\'s address bar and paste it into the box above": "Copy the file\'s URL from your browser\'s address bar and paste it into the box above",
    "Copy the web address from your browser\'s address bar and paste it into the box above": "Copy the web address from your browser\'s address bar and paste it into the box above",
    "Decrease Font Size": "Diminuer la taille de la police",
    "Destroy": "Détruire",
    "Divider": "Div",
    "Document or other file": "Document ou autre fichier",
    "Edit Link": "Modifier le lien",
    "Email": "E-mail",
    "Email address": "Adresse e-mail",
    "Embed Code": "Code intégré",
    "Embed Object": "Intégrer l'objet",
    "Embed object": "Object intégré",
    "Ensure the file has been uploaded to your website": "Vérifiez que le fichier a été transféré vers votre site",
    "Enter email address": "Saisir l'adresse e-mail",
    "Enter subject": "Saisir le sujet",
    "Enter your URL": "Saisir l'URL",
    "Failed to save {{failed}} content block(s).": "Échec d'enregistrement du(des) bloc(s) de contenu {{failed}}.",
    "Find the page on the web you want to link to": "Trouvez la page web que vous voulez lier",
    "Float Image Left": "Float Image Left",
    "Float Image Right": "Float Image Right",
    "Formatted &amp; Cleaned": "Formatté &amp; Nettoyé",
    "Formatted Unclean": "Formatté non nettoyé",
    "Heading&nbsp;1": "Titre&nbsp;1",
    "Heading&nbsp;2": "Titre&nbsp;2",
    "Heading&nbsp;3": "Titre&nbsp;3",
    "Image height": "Image height",
    "Image width": "Image width",
    "Increase Font Size": "Augmenter la taille de la police",
    "Initializing": "Initialisation",
    "Insert": "Insérer",
    "Insert Horizontal Rule": "Insérer une règle horizontale",
    "Insert Link": "Insérer un lien",
    "Insert Snippet": "Insérer un bout de code",
    "Italic": "Italique",
    "Justify": "Justifier",
    "Learn More About the Raptor WYSIWYG Editor": "En savoir plus sur l'éditeur WYSIWYG Raptor",
    "Left Align": "Aligner à gauche",
    "Link to a document or other file": "Lier un document ou un autre fichier",
    "Link to a page on this or another website": "Lier une page ou un autre site",
    "Link to an email address": "Lier une adresse e-mail",
    "Location": "Emplacement",
    "Modify Image Size": "Modify Image Size",
    "N/A": false,
    "New window": "Nouvelle fenêtre",
    "No changes detected to save...": "Aucune modification détectée à enregistrer...",
    "Not sure what to put in the box above?": "Pas sûr(e) de savoir quoi mettre dans le champ ci-dessus ?",
    "OK": false,
    "Open the uploaded file in your browser": "Ouvrir le fichier trasnféré dans votre navigateur",
    "Ordered List": "Liste ordonnée",
    "Page on this or another website": "Page sur ce site ou un autre site",
    "Paragraph": "Paragraphe",
    "Paste Embed Code": "Coller le code",
    "Paste your embed code into the text area below.": "Collez votre code intégré dans la zone de texte ci-dessous.",
    "Plain Text": "Texte brut",
    "Preview": "Aperçu",
    "Raptorize": "Raptoriser",
    "Reinitialise": "Réinitialiser",
    "Remaining characters before the recommended character limit is reached": "Caractères restants avant que la limite de caractère recommandée ne soit atteinte",
    "Remove Image Float": "Remove Image Float",
    "Remove Link": "Retirer le lien",
    "Remove unnecessary markup from editor content": "Retirer le balisage non nécessaire du contenu de l'éditeur",
    "Resize Image": "Resize Image",
    "Right Align": "Aligner à droite",
    "Save": "Enregistrer",
    "Saved {{saved}} out of {{dirty}} content blocks.": "{{saved}} enregistré sur {{dirty}} blocs de contenu.",
    "Saving changes...": "Enregistrement des modifications...",
    "Select all editable content": "Sélectionner tout le contenu modifiable",
    "Select {{element}} element": "Sélectionner l'élément {{element}}",
    "Show Guides": "Afficher les guides",
    "Source Code": "Code source",
    "Step Back": "En arrière",
    "Step Forward": "En avant",
    "Strikethrough": "Barré",
    "Sub script": "Indice",
    "Subject (optional)": "Sujet (facultatif)",
    "Successfully saved {{saved}} content block(s).": "{{saved}} bloc(s) de contenu enregistré(s) avec succès.",
    "Super script": "Exposant",
    "The URL does not look well formed": "L'URL paraît malformée",
    "The email address does not look well formed": "L'adresse e-mail paraît malformée",
    "The image \'{{image}}\' is too large for the element being edited.<br/>It will be replaced with a resized copy when your edits are saved.": "The image \'{{image}}\' is too large for the element being edited.<br/>It will be replaced with a resized copy when your edits are saved.",
    "The url for the file you inserted doesn\'t look well formed": "The url for the file you inserted doesn\'t look well formed",
    "The url for the link you inserted doesn\'t look well formed": "The url for the link you inserted doesn\'t look well formed",
    "This block contains unsaved changes": "Ce bloc contient des modifications non enregistrées",
    "Underline": "Souligné",
    "Unnamed Button": "Boutton sans nom",
    "Unnamed Select Menu": "Menu de sélection sans nom",
    "Unordered List": "Liste non ordonnée",
    "Update Link": "Mettre à jour le lien",
    "Updated link: {{link}}": "Lien mis à jour : {{link}}",
    "View / Edit Source": "Voir / Modifier la source",
    "View Source": "Voir la source",
    "\nThere are unsaved changes on this page. \nIf you navigate away from this page you will lose your unsaved changes": "\nIl y a des modifications non enregistrées sur cette page. \nSi vous quittez cette page, vous perdrez vos modifications non enregistrées",
    "root": "racine",
    "{{charactersRemaining}} characters over limit": "{{charactersRemaining}} caractères au-dessus de la limite",
    "{{charactersRemaining}} characters remaining": "{{charactersRemaining}} caractères restants",
    "{{characters}} characters, {{charactersRemaining}} over the recommended limit": "{{characters}} caractères, {{charactersRemaining}} au-dessus de la limite",
    "{{characters}} characters, {{charactersRemaining}} remaining": "{{characters}} caractères, {{charactersRemaining}} restants",
    "{{sentences}} sentences": "{{sentences}} phrases",
    "{{words}} word": "{{words}} mot",
    "{{words}} words": "{{words}} mots"
});
/**
 * @fileOverview Dutch strings file.
 * @author Ruben Vincenten, rubenvincenten@gmail.com, https://github.com/rubenvincenten
 */
registerLocale('nl', 'Nederlands', {
    "A preview of your embedded object is displayed below.": "Een voorbeeldweergave van uw ingenestelde object is hieronder weergeven.",
    "Added link: {{link}}": "Link toegevoegd:: {{link}}",
    "All changes will be lost!": "Alle aanpassingen zullen verloren gaan!",
    "Apply Source": "Broncode toepassen",
    "Are you sure you want to stop editing?": "Weet u zeker dat u wilt stoppen met aanpassen? ",
    "Blockquote": "Blokcitaat",
    "Bold": "Vetgedrukt",
    "Cancel": "Annuleren",
    "Center Align": "Centreren",
    "Change HTML tag of selected element": "Verander type van geselecteerd element",
    "Change Language": "Taal veranderen",
    "Check this box to have the file open in a new browser window": "Vink dit aan om het bestand te laten opnenen in een nieuw browser venster",
    "Check this box to have the link open in a new browser window": "Vink dit aan om de link te laten opnenen in een nieuw browser venster",
    "Choose a link type:": "Kies het type link:",
    "Clear Formatting": "Verwijder opmaak",
    "Click to begin editing": "Klik hier voor het beginnen met bewerken",
    "Click to detach the toolbar": "Klik om de werkbalk los te maken",
    "Click to dock the toolbar": "Klik om de werkbalk vast te maken",
    "Click to select all editable content": "Klik om alle bewerkbare inhoud te selecteren",
    "Click to select the contents of the '{{element}}' element": "Klik om de inhoud te selecteren van het '{{element}}' element",
    "Close": "Sluiten",
    "Confirm Cancel Editing": "Bevestig annuleren van bewerken",
    "Content Statistics": "Inhoud Statistieken",
    "Content contains more than {{limit}} characters and may be truncated": "Inhoud bevat meer dan {{limit}} tekens en kan worden ingekort.",
    "Content will not be truncated": "Inhoud wordt niet ingekort",
    "Copy the file's URL from your browser's address bar and paste it into the box above": "Kopieër het internetadres van het bestand uit de adresbalk van uw browser en plak het in het veld hierboven",
    "Copy the web address from your browser\'s address bar and paste it into the box above": "Kopieër het internetadres uit de adresbalk van uw browser en plak het in het veld hierboven",
    "Decrease Font Size": "Groter Lettertype",
    "Destroy": "Verwijder",
    "Divider": "Splitser",
    "Document or other file": "Document of ander bestand",
    "Edit Link": "Link bewerken",
    "Email": "E-mail",
    "Email address": "E-mail adres",
    "Embed Code": "Code Insluiten",
    "Embed Object": "Object Insluiten",
    "Embed object": "Object insluiten",
    "Ensure the file has been uploaded to your website": "Verzeker uzelf ervan dat het bestand op uw website staat",
    "Enter email address": "Voeg het e-mail adres in",
    "Enter subject": "Voeg het onderwerp in",
    "Enter your URL": "Voeg het internetadres in",
    "Failed to save {{failed}} content block(s).": "Kon {{failed}} inhoud blok(ken) niet opslaan.",
    "Find the page on the web you want to link to": "Vind de pagina op het internet waar u naartoe wilt linken",
    "Float Image Left": "Tekst omsluiten rechts van afbeelding",
    "Float Image Right": "Tekst omsluiten links van afbeelding",
    "Formatted &amp; Cleaned": "Geformatteerd &amp; Opgeruimd",
    "Formatted Unclean": "Rommel Opgeruimd",
    "Heading&nbsp;1": "Kopniveau&nbsp;1",
    "Heading&nbsp;2": "Kopniveau&nbsp;2",
    "Heading&nbsp;3": "Kopniveau&nbsp;3",
    "Image height": "Hoogte afbeelding",
    "Image width": "Breedte afbeelding",
    "Increase Font Size": "Kleiner Lettertype",
    "Initializing": "Initialiseren",
    "Insert": "Invoegen",
    "Insert Horizontal Rule": "Horizontale Regel Invoegen",
    "Insert Link": "Link Invoegen",
    "Insert Snippet": "Snippertekst Invoegen",
    "Italic": "Schuingedrukt",
    "Justify": "Uitlijnen aan beide kanten",
    "Learn More About the Raptor WYSIWYG Editor": "Meer leren over Rapor WYSIWYG Editor",
    "Left Align": "Links uitlijnen",
    "Link to a document or other file": "Link naar een document of ander bestand",
    "Link to a page on this or another website": "Link naar een pagina op deze of een andere website",
    "Link to an email address": "Link naar een emailadres",
    "Location": "Locatie",
    "Modify Image Size": "Afbeeldingsgrootte aanpassen",
    "N/A": "n.v.t.",
    "New window": "Nieuw venster",
    "No changes detected to save...": "Er zijn geen aanpassingen om op te slaan...",
    "Not sure what to put in the box above?": "Onzeker over wat er in het veld moet staan hierboven?",
    "OK": false,
    "Open the uploaded file in your browser": "Open het geüploade bestand in uw browser",
    "Ordered List": "Genummerde lijst",
    "Page on this or another website": "Pagina op deze of een andere website",
    "Paragraph": "Alinea",
    "Paste Embed Code": "Plak de insluitcode",
    "Paste your embed code into the text area below.": "Plak de insluitcode in het tekstveld hieronder.",
    "Plain Text": "Tekst zonder opmaak",
    "Preview": "Voorbeeldweergave",
    "Raptorize": false,
    "Reinitialise": "Herinitialiseren",
    "Remaining characters before the recommended character limit is reached": "Aantal karakters over voordat het limiet is bereikt",
    "Remove Image Float": "Tekst niet omsluiten rondom afbeelding",
    "Remove Link": "Verwijder Link",
    "Remove unnecessary markup from editor content": "Inhoud schoonmaken van overbodige opmaak",
    "Resize Image": "Herschaal Afbeelding",
    "Right Align": "Rechts Uitlijnen",
    "Save": "Opslaan",
    "Saved {{saved}} out of {{dirty}} content blocks.": "{{saved}} van de {{dirty}} inhoudsblokken zijn opgeslagen.",
    "Saving changes...": "Aanpassingen opslaan...",
    "Select all editable content": "Alle aanpasbare inhoud selecteren",
    "Select {{element}} element": "Selecteer {{element}} element",
    "Show Guides": "Rooster Tonen (Onderwatermodus)",
    "Source Code": "Broncode",
    "Step Back": "Herstel",
    "Step Forward": "Opnieuw",
    "Strikethrough": "Doorstrepen",
    "Sub script": "Subscript",
    "Subject (optional)": "Onderwerp (optioneel)",
    "Successfully saved {{saved}} content block(s).": "{{saved}} inhoudsblok(ken) succesvol opgeslagen.",
    "Super script": "Superscript",
    "The URL does not look well formed": "Het lijkt er op dat het internetadres niet correct is",
    "The email address does not look well formed": "Het e-mail adres is incorrect",
    "The image \'{{image}}\' is too large for the element being edited.<br/>It will be replaced with a resized copy when your edits are saved.": "De afbeelding \"{{image}}\" is te groot voor het element dat wordt bewerkt.<br/>Het zal worden vervangen met een herschaalde kopie wanneer uw aanpassingen worden opgeslagen.",
    "The url for the file you inserted doesn\'t look well formed": "Het lijkt er op dat het internetadres voor het bestand dat u heeft ingevoegd niet correct is",
    "The url for the link you inserted doesn\'t look well formed": "Het lijkt er op dat het internetadres voor de link die u heeft ingevoegd niet correct is",
    "This block contains unsaved changes": "Dit blok bevat aanpassingen welke niet zijn opgeslagen",
    "Underline": "Onderstrepen",
    "Unnamed Button": "Knop Zonder Naam",
    "Unnamed Select Menu": "Selectiemenu Zonder Naam",
    "Unordered List": "Lijst Van Opsommingstekens",
    "Update Link": "Link Bijwerken",
    "Updated link: {{link}}": "Link bijgewerkt: {{link}}",
    "View / Edit Source": "Broncode Bekijken/Bewerken",
    "View Source": "Broncode Bekijken",
    "\nThere are unsaved changes on this page. \nIf you navigate away from this page you will lose your unsaved changes": "\nEr zijn aanpassingen op deze pagina die niet zijn opgeslagen. \nAls u een andere pagina opnet zult u deze aanpassingen verliezen",
    "root": false,
    "{{charactersRemaining}} characters over limit": "{{charactersRemaining}} karakters over het limiet",
    "{{charactersRemaining}} characters remaining": "{{charactersRemaining}} karakters over",
    "{{characters}} characters, {{charactersRemaining}} over the recommended limit": "{{characters}} karakters, {{charactersRemaining}} over het aangeraden limiet",
    "{{characters}} characters, {{charactersRemaining}} remaining": "{{characters}} karakters, {{charactersRemaining}} over",
    "{{sentences}} sentences": "{{sentences}} zinnen",
    "{{words}} word": "{{words}} woord",
    "{{words}} words": "{{words}} woorden"
});
/**
 * @fileOverview Simplified Chinese strings file.
 * @author Raptor, info@raptor-editor.com, http://www.raptor-editor.com/
 */
registerLocale('zh-CN', '简体中文', {
    "A preview of your embedded object is displayed below.": "A preview of your embedded object is displayed below.",
    "Added link: {{link}}": "Added link: {{link}}",
    "All changes will be lost!": "All changes will be lost!",
    "Apply Source": "应用源代码",
    "Are you sure you want to stop editing?": "Are you sure you want to stop editing?",
    "Blockquote": "大段引用",
    "Bold": "粗体",
    "Cancel": "取消",
    "Center Align": "中心对齐文本",
    "Change HTML tag of selected element": "Change HTML tag of selected element",
    "Change Language": "改变语言",
    "Check this box to have the file open in a new browser window": "Check this box to have the file open in a new browser window",
    "Check this box to have the link open in a new browser window": "Check this box to have the link open in a new browser window",
    "Choose a link type:": "Choose a link type:",
    "Clear Formatting": "Clear Formatting",
    "Click to begin editing": "Click to begin editing",
    "Click to detach the toolbar": "Click to detach the toolbar",
    "Click to dock the toolbar": "Click to dock the toolbar",
    "Click to select all editable content": "Click to select all editable content",
    "Click to select the contents of the '{{element}}' element": "Click to select the contents of the '{{element}}' element",
    "Close": "Close",
    "Confirm Cancel Editing": "确认取消编辑",
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
    "Email address": "电子邮件",
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
    "Heading&nbsp;1": "Heading&nbsp;1",
    "Heading&nbsp;2": "Heading&nbsp;2",
    "Heading&nbsp;3": "Heading&nbsp;3",
    "Image height": "Image height",
    "Image width": "Image width",
    "Increase Font Size": "Increase Font Size",
    "Initializing": "Initializing",
    "Insert": "Insert",
    "Insert Horizontal Rule": "插入水平线",
    "Insert Link": "Insert Link",
    "Insert Snippet": "Insert Snippet",
    "Italic": "斜体字",
    "Justify": "对齐文字",
    "Learn More About the Raptor WYSIWYG Editor": "Learn More About the Raptor WYSIWYG Editor",
    "Left Align": "左对齐文本",
    "Link to a document or other file": "Link to a document or other file",
    "Link to a page on this or another website": "Link to a page on this or another website",
    "Link to an email address": "Link to an email address",
    "Location": "Location",
    "Modify Image Size": "Modify Image Size",
    "N/A": "N/A",
    "New window": "New window",
    "No changes detected to save...": "No changes detected to save...",
    "Not sure what to put in the box above?": "Not sure what to put in the box above?",
    "OK": "确定",
    "Open the uploaded file in your browser": "Open the uploaded file in your browser",
    "Ordered List": "Ordered List",
    "Page on this or another website": "Page on this or another website",
    "Paragraph": "Paragraph",
    "Paste Embed Code": "Paste Embed Code",
    "Paste your embed code into the text area below.": "Paste your embed code into the text area below.",
    "Plain Text": "Plain Text",
    "Preview": "Preview",
    "Raptorize": "Raptorize",
    "Reinitialise": "Reinitialise",
    "Remaining characters before the recommended character limit is reached": "Remaining characters before the recommended character limit is reached",
    "Remove Image Float": "Remove Image Float",
    "Remove Link": "Remove Link",
    "Remove unnecessary markup from editor content": "Remove unnecessary markup from editor content",
    "Resize Image": "Resize Image",
    "Right Align": "右对齐文本",
    "Save": "存储",
    "Saved {{saved}} out of {{dirty}} content blocks.": "Saved {{saved}} out of {{dirty}} content blocks.",
    "Saving changes...": "保存更改...",
    "Select all editable content": "Select all editable content",
    "Select {{element}} element": "Select {{element}} element",
    "Show Guides": "纲要",
    "Source Code": "Source Code",
    "Step Back": "Step Back",
    "Step Forward": "Step Forward",
    "Strikethrough": "Strikethrough",
    "Sub script": "Sub script",
    "Subject (optional)": "Subject (optional)",
    "Successfully saved {{saved}} content block(s).": "Successfully saved {{saved}} content block(s).",
    "Super script": "Super script",
    "The URL does not look well formed": "The URL does not look well formed",
    "The email address does not look well formed": "The email address does not look well formed",
    "The image \'{{image}}\' is too large for the element being edited.<br/>It will be replaced with a resized copy when your edits are saved.": "The image \'{{image}}\' is too large for the element being edited.<br/>It will be replaced with a resized copy when your edits are saved.",
    "The url for the file you inserted doesn\'t look well formed": "The url for the file you inserted doesn\'t look well formed",
    "The url for the link you inserted doesn\'t look well formed": "The url for the link you inserted doesn\'t look well formed",
    "This block contains unsaved changes": "This block contains unsaved changes",
    "Underline": "下划线",
    "Unnamed Button": "Unnamed Button",
    "Unnamed Select Menu": "Unnamed Select Menu",
    "Unordered List": "Unordered List",
    "Update Link": "Update Link",
    "Updated link: {{link}}": "Updated link: {{link}}",
    "View / Edit Source": "View / Edit Source",
    "View Source": "View Source",
    "\nThere are unsaved changes on this page. \nIf you navigate away from this page you will lose your unsaved changes": "\nThere are unsaved changes on this page. \nIf you navigate away from this page you will lose your unsaved changes",
    "root": "本",
    "{{charactersRemaining}} characters over limit": "{{charactersRemaining}} characters over limit",
    "{{charactersRemaining}} characters remaining": "{{charactersRemaining}} characters remaining",
    "{{characters}} characters, {{charactersRemaining}} over the recommended limit": "{{characters}} characters, {{charactersRemaining}} over the recommended limit",
    "{{characters}} characters, {{charactersRemaining}} remaining": "{{characters}} characters, {{charactersRemaining}} remaining",
    "{{sentences}} sentences": "{{sentences}} sentences",
    "{{words}} word": "{{words}} word",
    "{{words}} words": "{{words}} words"
});
/**
 * @name $.editor.plugin.imageResize
 * @augments $.ui.editor.defaultPlugin
 * @class Automatically resize oversized images with CSS and height / width attributes.
 */
$.ui.editor.registerPlugin('imageResize', /** @lends $.editor.plugin.imageResize.prototype */ {

    /**
     * @name $.editor.plugin.imageResize.options
     * @type {Object}
     * @namespace Default options
     * @see $.editor.plugin.imageResize
     */
    options: /** @lends $.editor.plugin.imageResize.options */  {
        allowOversizeImages: false,
        manuallyResizingClass: '',
        resizeButtonClass: '',
        resizingClass: ''
    },

    /**
     * @see $.ui.editor.defaultPlugin#init
     */
    init: function(editor, options) {

        this.options = $.extend(this.options, {
            manuallyResizingClass: this.options.baseClass + '-manually-resize',
            resizeButtonClass: this.options.baseClass + '-resize-button',
            resizingClass: this.options.baseClass + '-in-progress'
        });

        editor.bind('enabled', this.bind, this);
    },

    /**
     * Bind events
     */
    bind: function() {

        if (!this.options.allowOversizeImages) {
            this.addImageListeners();
            this.editor.bind('change', this.scanForOversizedImages, this);
            this.editor.bind('save', this.save, this);
        }

        this.editor.bind('destroy', this.cancel, this);
        this.editor.bind('cancel', this.cancel, this);

        this.editor.getElement().on('mouseenter.' + this.options.baseClass, 'img', $.proxy(this.imageMouseEnter, this));
        this.editor.getElement().on('mouseleave.' + this.options.baseClass, 'img', $.proxy(this.imageMouseLeave, this));
    },

    /**
     * Remove bindings from editing element.
     */
    unbind: function() {
        if (!this.options.allowOversizeImages) {
            this.removeImageListeners();
            this.editor.unbind('change', this.scanForOversizedImages, this);
        }
        this.editor.getElement().off('mouseenter.' + this.options.baseClass, 'img');
        this.editor.getElement().off('mouseleave.' + this.options.baseClass, 'img');
    },

    /**
     * Add custom image change listeners to editing element's image elements.
     */
    addImageListeners: function() {
        // If the function addEventListener exists, bind our custom image resized event
        this.resized = $.proxy(this.imageResizedByUser, this);
        var plugin = this;
        this.editor.getElement().find('img').each(function(){
            if (this.addEventListener) {
                this.addEventListener('DOMAttrModified', plugin.resized, false);
            }
            if (this.attachEvent) {  // Internet Explorer and Opera
                this.attachEvent('onpropertychange', plugin.resized);
            }
        });
    },

    /**
     * Remove custom image change listeners to editing element's image elements.
     */
    removeImageListeners: function() {
        var plugin = this;
        this.editor.getElement().find('img').each(function(){
            if (this.removeEventListener) {
                this.addEventListener('DOMAttrModified', plugin.resized, false);
            }
            if (this.detachEvent) {
                this.detachEvent('onpropertychange', plugin.resized);
            }
        });
    },

    /**
     * Handler simulating a 'resize' event for image elements
     * @param {Object} event
     */
    imageResizedByUser: function(event) {
        var target = $(event.target);
        if(target.is('img') &&
            target.attr('_moz_resizing') &&
            event.attrName == 'style' &&
            event.newValue.match(/width|height/)) {
            this.editor.fire('change');
        }
    },

    /**
     * Check for oversize images within the editing element
     */
    scanForOversizedImages: function() {
        var element = this.editor.getElement();
        var plugin = this;
        var images = [];
        $(element.find('img')).each(function() {
            // Only resize images automatically if they're too wide
            if (element.width() < $(this).outerWidth()) {
                images.push($(this));
            }
        });

        if (images.length) {
            plugin.resizeOversizedImages(images, element.width());
        }
    },

    /**
     * Proportionately resizes the image, applying width CSS style.
     * @param  {String[]} image The images to be resized
     * @param  {int} maxWidth The editing element's maximum width
     * @param  {int} maxHeight The editing element's maximum height
     */
    resizeOversizedImages: function(images, maxWidth) {

        // Prepare a link to be included in any messages
        var imageLink = $('<a>', {
            href: '',
            target: '_blank'
        });

        for (var i = 0; i < images.length; i++) {

            var image = images[i];
            var width = image.outerWidth();
            var height = image.outerHeight();
            var ratio = Math.min(maxWidth / width);

            width = Math.round(Math.abs(ratio * (width - (image.outerWidth() - image.width()))));

            image.addClass(this.options.resizingClass);

            imageLink = imageLink.html(image.attr('title') || image.attr('src').substr(image.attr('src').lastIndexOf('/') + 1)).
                    attr('href', image.attr('src'));

            // Resize the image with CSS / attributes
            $(image).css({ width: width });

            var plugin = this;
            this.showOversizeWarning(elementOuterHtml($(imageLink)), {
                hide: function() {
                    image.removeClass(plugin.options.resizingClass);
                }
            });
        }
    },

    cancel: function() {
        this.removeClasses();
        this.removeToolsButtons();
        this.unbind();
    },

    /**
     * Remove resizingClass.
     */
    save: function() {
        this.removeClasses(this.options.resizingClass);
        this.removeToolsButtons();
        this.unbind();
    },

    /**
     * Helper method for showing information about an oversized image to the user
     * @param  {anchor} imageLink link to the subject image
     * @param  {map} options options to be passed to editor.showInfo
     */
    showOversizeWarning: function(imageLink, options) {
        this.editor.showInfo(_('The image \'{{image}}\' is too large for the element being edited.<br/>It will be replaced with a resized copy when your edits are saved.', {
            image: imageLink
        }), options);
    },

    /**
     * Remove any temporary classes from the editing element's images.
     * @param  {array} classNames to be removed
     */
    removeClasses: function(classNames) {
        if (!classNames) classNames = [this.options.resizingClass, this.options.manuallyResizingClass];
        if (!$.isArray(classNames)) classNames = [classNames];
        for (var i = 0; i < classNames.length; i++) {
            this.editor.getElement().find('img.' + classNames[i]).removeClass(classNames[i]);
        }
    },

    /**
     * Display a dialog containing width / height text inputs allowing the user to manually resize the selected image.
     */
    manuallyResizeImage: function() {
        this.removeToolsButtons();
        var image = this.editor.getElement().find('img.' + this.options.manuallyResizingClass);
        var width = $(image).innerWidth(), height = $(image).innerHeight(),
            widthInputSelector = '#' + this.options.baseClass + '-width',
            heightInputSelector = '#' + this.options.baseClass + '-height',
            plugin = this;

        var updateImageSize = function(width) {
            width = Math.round((width || $(widthInputSelector).val())) + 'px';
            $(image).css({ width: width });
        };

        var dialog = $(this.editor.getTemplate('imageresize.manually-resize-image', {
            width: width,
            height: height,
            baseClass: this.options.baseClass
        }));

        dialog.dialog({
            modal: true,
            resizable: false,
            title: _('Modify Image Size'),
            autoOpen: true,
            buttons: [
                {
                    text: _('Resize Image'),
                    click: function() {
                        updateImageSize();
                        $(this).dialog('close');
                    }
                },
                {
                    text: _('Cancel'),
                    click: function() {
                        $(this).dialog('close');
                    }
                }
            ],
            close: function() {
                updateImageSize(width);
                plugin.editor.checkChange();
                $(dialog).remove();
            },
            open: function() {
                var widthInput = $(this).find(widthInputSelector);
                var heightInput = $(this).find(heightInputSelector);
                widthInput.keyup(function() {
                    heightInput.val(Math.round(Math.abs((height / width) * $(this).val())));
                    updateImageSize();
                });
                heightInput.keyup(function() {
                    widthInput.val(Math.round(Math.abs((width / height) * $(this).val())));
                    updateImageSize();
                });
            }
        });
    },

    /**
     * Create & display a 'tools' button in the top right corner of the image.
     * @param  {jQuery|Element} image The image element to display the button relative to.
     */
    displayToolsButtonRelativeToImage: function(image) {

        var resizeButton = $('<button/>')
            .appendTo('body')
            .addClass(this.options.resizeButtonClass)
            .button({
                text: false,
                icons: {
                    primary: 'ui-icon-tools'
                }
            });

        resizeButton.css({
                position: 'absolute',
                left: ($(image).position().left + $(image).innerWidth() - $(resizeButton).outerWidth() - 10) + 'px',
                marginTop: '10px'
            })
            .click($.proxy(this.manuallyResizeImage, this))

        $(image).before(resizeButton);
    },

    /**
     * Remove any tools buttons inside the editing element.
     */
    removeToolsButtons: function() {
        this.editor.getElement().find('.' + this.options.resizeButtonClass).each(function() {
            $(this).remove();
        })
    },

    /**
     * Handle the mouse enter event.
     * @param  {Event} event The event.
     */
    imageMouseEnter: function(event) {
        $(event.target).addClass(this.options.manuallyResizingClass);
        this.displayToolsButtonRelativeToImage(event.target);
    },

    /**
     * Handle the mouse leave event. If the mouse has left but the related target is a resize button,
     * do not remove the button or the manually resizing class from the image.
     * @param  {Event} event The event.
     */
    imageMouseLeave: function(event) {
        if (!$(event.relatedTarget).hasClass(this.options.resizeButtonClass)) {
            $(event.target).removeClass(this.options.manuallyResizingClass);
            this.removeToolsButtons();
        }
    }
});/**
 * @fileOverview UI Componenent for recommending & tracking maximum content length.
 * @author David Neilsen david@panmedia.co.nz
 * @author Michael Robinson michael@panmedia.co.nz
 */

$.ui.editor.registerUi({

    /**
     * @name $.editor.ui.length
     * @augments $.ui.editor.defaultUi
     * @class Displays a button containing a character count for the editor content.
     * <br/>
     * Shows a dialog containing more content statistics when clicked
     */
    length: /** @lends $.editor.ui.length.prototype */ {

        ui: null,

        /**
         * @name $.editor.ui.length.options
         * @namespace Default options
         * @see $.editor.ui.length
         * @type {Object}
         */
        options: /** @lends $.editor.ui.length.options.prototype */  {

            /**
             * @see $.editor.ui.length.options
             * @type {Integer}
             */
            length: 150
        },

        /**
         * @see $.ui.editor.length#init
         */
        init: function(editor, options) {
            editor.bind('show', $.proxy(this.updateCount, this));
            editor.bind('change', $.proxy(this.updateCount, this));

            this.ui = this.editor.uiButton({
                title: _('Remaining characters before the recommended character limit is reached'),
                label: _('Initializing'),
                text: true,
                icon: 'ui-icon-dashboard',
                click: function() {
                    this.showStatistics();
                }
            });

            return this.ui;
        },

        /**
         * Update the associated UI element when the content has changed.
         */
        updateCount: function() {
            // <debug/>

            var charactersRemaining = this.options.length - $('<div/>').html(this.editor.getCleanHtml()).text().length;

            var button = this.ui.button;
            var label = null;
            if (charactersRemaining >= 0) {
                label = _('{{charactersRemaining}} characters remaining', { charactersRemaining: charactersRemaining });
            } else {
                label = _('{{charactersRemaining}} characters over limit', { charactersRemaining: charactersRemaining * -1 });
            }
            button.button('option', 'label', label);
            button.button('option', 'text', true);

            // Add the error state to the button's text element if appropriate
            if (charactersRemaining < 0) {
                button.addClass('ui-state-error');
            } else{
                // Add the highlight class if the remaining characters are in the "sweet zone"
                if (charactersRemaining >= 0 && charactersRemaining <= 15) {
                    button.addClass('ui-state-highlight').removeClass('ui-state-error');
                } else {
                    button.removeClass('ui-state-highlight ui-state-error');
                }
            }
        },

        showStatistics: function() {
            var dialog = this.processTemplate();

            dialog.dialog({
                modal: true,
                resizable: false,
                title: _('Content Statistics'),
                dialogClass: this.editor.options.dialogClass + ' ' + this.editor.options.baseClass,
                show: this.editor.options.dialogShowAnimation,
                hide: this.editor.options.dialogHideAnimation,
                buttons: [
                    {
                        text: _('OK'),
                        click: function() {
                            $(this).dialog('close');
                        }
                    }
                ],
                open: function() {
                    // Apply custom icons to the dialog buttons
                    var buttons = $(this).parent().find('.ui-dialog-buttonpane');
                    buttons.find('button:eq(0)').button({ icons: { primary: 'ui-icon-circle-check' }});
                },
                close: function() {
                    $(this).dialog('destroy').remove();
                }
            });
        },

        /**
         * Process and return the statistics dialog template.
         * @return {jQuery} The processed statistics dialog template
         */
        processTemplate: function() {
            var content = $('<div/>').html(this.editor.getCleanHtml()).text();
            var truncation = null;
            var charactersRemaining = this.options.length - content.length;
            if (charactersRemaining < 0) {
                truncation = _('Content contains more than {{limit}} characters and may be truncated', {
                    'limit': this.options.length
                });
            } else {
                truncation = _('Content will not be truncated');
            }

            var words = null;
            var totalWords = content.split(' ').length;
            if (totalWords == 1) {
                words = _('{{words}} word', { 'words': totalWords });
            } else {
                words = _('{{words}} words', { 'words': totalWords });
            }

            var sentences = null;
            var totalSentences = content.split('. ').length;
            if (totalSentences == 1) {
                sentences = _('{{sentences}} sentences', { 'sentences': totalSentences });
            } else {
                sentences = _('{{sentences}} sentences', { 'sentences': totalSentences });
            }

            var characters = null;
            if (charactersRemaining >= 0) {
                characters = _('{{characters}} characters, {{charactersRemaining}} remaining', {
                    'characters': content.length,
                    'charactersRemaining': charactersRemaining
                });
            } else {
                characters = _('{{characters}} characters, {{charactersRemaining}} over the recommended limit', {
                    'characters': content.length,
                    'charactersRemaining': charactersRemaining * -1
                });
            }

            return $(this.editor.getTemplate('length.dialog', {
                'characters': characters,
                'words': words,
                'sentences': sentences,
                'truncation': truncation
            }));
        }
    }
});
/**
 * @fileOverview Link insertion plugin & ui component
 * @author David Neilsen david@panmedia.co.nz
 * @author Michael Robinson michael@panmedia.co.nz
 */

/**
 * @name $.editor.plugin.link
 * @augments $.ui.editor.defaultPlugin
 * @see  $.editor.ui.link
 * @see  $.editor.ui.unlink
 * @class Allow the user to wrap the selection with a link or insert a new link
 */
 $.ui.editor.registerPlugin('link', /** @lends $.editor.plugin.link.prototype */ {
    visible: null,
    dialog: null,
    types: {},

    /**
     * Array of default link types
     * @type {Array}
     */
    defaultLinkTypes: [

        /**
         * @name $.editor.plugin.link.defaultLinkTypes.page
         * @class
         * @extends $.editor.plugin.link.baseLinkType
         */
        /** @lends $.editor.plugin.link.defaultLinkTypes.page.prototype */ {

            /**
             * @see $.editor.plugin.link.baseLinkType#type
             */
            type: 'external',

            /**
             * @see $.editor.plugin.link.baseLinkType#title
             */
            title: _('Page on this or another website'),

            /**
             * @see $.editor.plugin.link.baseLinkType#focusSelector
             */
            focusSelector: 'input[name="location"]',

            /**
             * @see $.editor.plugin.link.baseLinkType#init
             */
            init: function() {
                this.content = this.plugin.editor.getTemplate('link.external', this.options);
                return this;
            },

            /**
             * @see $.editor.plugin.link.baseLinkType#show
             */
            show: function(panel, edit) {

                var link = this;
                panel.find('input[name="location"]').bind('keyup', function(){
                    link.validate(panel);
                });

                if (edit) {
                    panel.find('input[name="location"]').val(this.plugin.selectedElement.attr('href')).
                        trigger('keyup');

                    if (this.plugin.selectedElement.attr('target') === '_blank') {
                        panel.find('input[name="blank"]').attr('checked', 'checked');
                    }

                }

                return this;
            },

            /**
             * @see $.editor.plugin.link.baseLinkType#attributes
             */
            attributes: function(panel) {
                var attributes = {
                    href: panel.find('input[name="location"]').val()
                };

                if (panel.find('input[name="blank"]').is(':checked')) attributes.target = '_blank';

                if (!this.options.regexLink.test(attributes.href)) {
                    this.plugin.editor.showWarning(_('The url for the link you inserted doesn\'t look well formed'));
                }

                return attributes;
            },

            /**
             * @return {Boolean} True if the link is valid
             */
            validate: function(panel) {

                var href = panel.find('input[name="location"]').val();
                var errorMessageSelector = '.' + this.options.baseClass + '-error-message-url';
                var isValid = true;

                if (!this.options.regexLink.test(href)) {
                    if (!panel.find(errorMessageSelector).size()) {
                        panel.find('input[name="location"]').after(this.plugin.editor.getTemplate('link.error', $.extend({}, this.options, {
                            messageClass: this.options.baseClass + '-error-message-url',
                            message: _('The URL does not look well formed')
                        })));
                    }
                    panel.find(errorMessageSelector).not(':visible').show();
                    isValid = false;
                } else {
                    panel.find(errorMessageSelector).has(':visible').hide();
                }

                return isValid;
            }
        },

        /**
         * @name $.editor.plugin.link.defaultLinkTypes.email
         * @class
         * @extends $.editor.plugin.link.baseLinkType
         */
        /** @lends $.editor.plugin.link.defaultLinkTypes.email.prototype */  {

            /**
             * @see $.editor.plugin.link.baseLinkType#type
             */
            type: 'email',

            /**
             * @see $.editor.plugin.link.baseLinkType#title
             */
            title: _('Email address'),

            /**
             * @see $.editor.plugin.link.baseLinkType#focusSelector
             */
            focusSelector: 'input[name="email"]',

            /**
             * @see $.editor.plugin.link.baseLinkType#init
             */
            init: function() {
                this.content = this.plugin.editor.getTemplate('link.email', this.options);
                return this;
            },

            /**
             * @see $.editor.plugin.link.baseLinkType#show
             */
            show: function(panel, edit) {

                var email = this;
                panel.find('input[name="email"]').bind('keyup', function(){
                    email.validate(panel);
                });

                if (edit) {
                    panel.find('input[name="email"]').val(this.plugin.selectedElement.attr('href').replace(/(mailto:)|(\?Subject.*)/gi, '')).
                        trigger('keyup');
                    if (/\?Subject\=/i.test(this.plugin.selectedElement.attr('href'))) {
                        panel.find('input[name="subject"]').val(decodeURIComponent(this.plugin.selectedElement.attr('href').replace(/(.*\?Subject=)/i, '')));
                    }
                }

                return this;
            },

            /**
             * @see $.editor.plugin.link.baseLinkType#attributes
             */
            attributes: function(panel) {
                var attributes = {
                    href: 'mailto:' + panel.find('input[name="email"]').val()
                }, subject = panel.find('input[name="subject"]').val();

                if (subject) attributes.href = attributes.href + '?Subject=' + encodeURIComponent(subject);

                return attributes;
            },

            /**
             * @return {Boolean} True if the link is valid
             */
            validate: function(panel) {

                var email = panel.find('input[name="email"]').val();
                var errorMessageSelector = '.' + this.options.baseClass + '-error-message-email';
                var isValid = true;
                if (!this.options.regexEmail.test(email)) {
                    if (!panel.find(errorMessageSelector).size()) {
                        panel.find('input[name="email"]').after(this.plugin.editor.getTemplate('link.error', $.extend({}, this.options, {
                            messageClass: this.options.baseClass + '-error-message-email',
                            message: _('The email address does not look well formed')
                        })));
                    }
                    panel.find(errorMessageSelector).not(':visible').show();
                    isValid = false;
                } else {
                    panel.find(errorMessageSelector).has(':visible').hide();
                }

                return isValid;
            }
        },

        /**
         * @name $.editor.plugin.link.defaultLinkTypes.fileUrl
         * @class
         * @extends $.editor.plugin.link.baseLinkType
         */
        /** @lends $.editor.plugin.link.defaultLinkTypes.fileUrl.prototype */ {

            /**
             * @see $.editor.plugin.link.baseLinkType#type
             */
            type: 'fileUrl',

            /**
             * @see $.editor.plugin.link.baseLinkType#title
             */
            title: _('Document or other file'),

            /**
             * @see $.editor.plugin.link.baseLinkType#focusSelector
             */
            focusSelector: 'input[name="location"]',

            /**
             * @see $.editor.plugin.link.baseLinkType#init
             */
            init: function() {
                this.content = this.plugin.editor.getTemplate('link.file-url', this.options);
                return this;
            },

            /**
             * @see $.editor.plugin.link.baseLinkType#show
             */
            show: function(panel, edit) {

                var link = this;
                panel.find('input[name="location"]').bind('keyup', function(){
                    link.validate(panel);
                });

                if (edit) {
                    panel.find('input[name="location"]').val(this.plugin.selectedElement.attr('href')).
                        trigger('click');
                    if (this.plugin.selectedElement.attr('target') === '_blank') {
                        panel.find('input[name="blank"]').attr('checked', 'checked');
                    }
                }

                return this;
            },

            /**
             * @see $.editor.plugin.link.baseLinkType#attributes
             */
            attributes: function(panel) {
                var attributes = {
                    href: panel.find('input[name="location"]').val()
                };

                if (panel.find('input[name="blank"]').is(':checked')) attributes.target = '_blank';

                if (!this.options.regexLink.test(attributes.href)) {
                    this.plugin.editor.showWarning(_('The url for the file you inserted doesn\'t look well formed'));
                }

                return attributes;
            },

            /**
             * @return {Boolean} True if the link is valid
             */
            validate: function(panel) {

                var href = panel.find('input[name="location"]').val();
                var errorMessageSelector = '.' + this.options.baseClass + '-error-message-file-url';
                var isValid = true;

                if (!this.options.regexLink.test(href)) {
                    if (!panel.find(errorMessageSelector).size()) {
                        panel.find('input[name="location"]').after(this.plugin.editor.getTemplate('link.error', $.extend({}, this.options, {
                            messageClass: this.options.baseClass + '-error-message-file-url',
                            message: _('The URL does not look well formed')
                        })));
                    }
                    panel.find(errorMessageSelector).not(':visible').show();
                    isValid = false;
                } else {
                    panel.find(errorMessageSelector).has(':visible').hide();
                }

                return isValid;
            }
        }

    ],

    /**
     * @see $.ui.editor.defaultPlugin#init
     */
    init: function(editor, options) {

        this.options = $.extend({}, {
            panelAnimation: 'fade',
            replaceTypes: false,
            customTypes: [],
            typeDataName: 'uiWidgetEditorLinkType',
            dialogWidth: 750,
            dialogHeight: 'auto',
            dialogMinWidth: 670,
            regexLink: /^(http|https|ftp):\/\/[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/i,
            regexEmail: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
        }, options);

        editor.bind('save', this.repairLinks, this);
        editor.bind('cancel', this.cancel, this);
    },

    /**
     * Initialise the link types
     * @param  {Boolean} edit True if the user is editing an existing anchor
     */
    initTypes: function(edit) {

        this.types = {};

        /**
         * @name $.editor.plugin.link.baseLinkType
         * @class Default {@link $.editor.plugin.link} type
         * @see $.editor.plugin.link
         */
        var baseLinkType = /** @lends $.editor.plugin.link.baseLinkType.prototype */ {

            /**
             * Name of the link type
             * @type {String}
             */
            type: null,

            /**
             * Title of the link type.
             * Used in the link panel's radio button
             */
            title: null,

            /**
             * Content intended for use in the {@link $.editor.plugin.link} dialog's panel
             */
            content: null,

            /**
             * Reference to the instance of {@link $.editor.plugin.link}
             */
            plugin: this,

            /**
             * Reference to {@link $.editor.plugin.link#options}
             */
            options: this.options,

            /**
             * Function returning the attributes to be applied to the selection
             */
            attributes: function() {},

            /**
             * Initialise the link type
             */
            init: function() {
                return this;
            },

            /**
             * Any actions (binding, population of inputs) required before the {@link $.editor.plugin.link} dialog's panel for this link type is made visible
             */
            show: function() {},

            /**
             * Function determining whether this link type's radio button should be selected
             * @param  {Object} link The selected element
             * @return {Boolean} True if the selection represents a link of this type
             */
            editing: function(link) {
                if (link.attr('class')) {
                    var classes = this.classes.split(/\s/gi);
                    for (var i = 0; i < classes.length; i++) {
                        if (classes[i].trim() && $(link).hasClass(classes[i])) {
                            return true;
                        }
                    }
                }
                return false;
            },

            /**
             * CSS selector for the input that the {@link $.editor.plugin.link.baseLinkType.focus} function should use
             * @type {String}
             */
            focusSelector: null,

            /**
             * Any actions required after this link type's content is made visible
             * @private
             */
            focus: function() {
                if (this.focusSelector) {
                    var input = $(this.focusSelector);
                    var value = input.val();
                    input.val('');
                    input.focus().val(value);
                }
            }
        };

        var linkTypes = null;

        if (this.options.replaceTypes) linkTypes = this.options.customTypes;
        else linkTypes = $.merge(this.defaultLinkTypes, this.options.customTypes);

        var link;
        for (var i = 0; i < linkTypes.length; i++) {
            link = $.extend({}, baseLinkType, linkTypes[i], { classes: this.options.baseClass + '-' + linkTypes[i].type }).init();
            this.types[link.type] = link;
        }
    },

    /**
     * Show the link control dialog
     */
    show: function() {
        if (!this.visible) {

            selectionSave();

            this.selectedElement = selectionGetElements().first();
            var edit = this.selectedElement.is('a');
            var options = this.options;
            var plugin = this;

            this.dialog = $(this.editor.getTemplate('link.dialog', options)).appendTo('body');

            var dialog = this.dialog;

            this.initTypes();

            // Add link type radio buttons
            var linkTypesFieldset = this.dialog.find('fieldset');
            for (var type in this.types) {
                $(this.editor.getTemplate('link.label', this.types[type])).appendTo(linkTypesFieldset);
            }

            linkTypesFieldset.find('input[type="radio"]').bind('change.' + this.editor.widgetName, function(){
                plugin.typeChange(plugin.types[$(this).val()], edit);
            });

            dialog.dialog({
                autoOpen: false,
                modal: true,
                resizable: true,
                width: options.dialogWidth,
                minWidth: options.dialogMinWidth,
                height: options.dialogHeight,
                title: edit ? _('Edit Link') : _('Insert Link'),
                dialogClass: options.baseClass + ' ' + options.dialogClass,
                buttons: [
                    {
                        text: edit ? _('Update Link') : _('Insert Link'),
                        click: function() {
                            selectionRestore();
                            if (plugin.apply(edit)) {
                                $(this).dialog('close');
                            }
                        }
                    },
                    {
                        text: _('Cancel'),
                        click: function() {
                            $(this).dialog('close');
                        }
                    }
                ],
                beforeopen: function() {
                    plugin.dialog.find('.' + plugin.options.baseClass + '-content').hide();
                },
                open: function() {
                    plugin.visible = true;

                    // Apply custom icons to the dialog buttons
                    var buttons = dialog.parent().find('.ui-dialog-buttonpane');
                    buttons.find('button:eq(0)').button({ icons: { primary: 'ui-icon-circle-check' }});
                    buttons.find('button:eq(1)').button({ icons: { primary: 'ui-icon-circle-close' }});

                    var radios = dialog.find('.ui-editor-link-menu input[type="radio"]');
                    radios.first().attr('checked', 'checked');

                    var changedType = false;
                    if (edit) {
                        for(var type in plugin.types) {
                            if (changedType = plugin.types[type].editing(plugin.selectedElement)) {
                                radios.filter('[value="' + type + '"]').attr('checked', 'checked');
                                plugin.typeChange(plugin.types[type], edit);
                                break;
                            }
                        }
                    }

                    if (!edit || edit && !changedType) {
                        plugin.typeChange(plugin.types[radios.filter(':checked').val()], edit);
                    }

                    // Bind keyup to dialog so we can detect when user presses enter
                    $(this).unbind('keyup.' + plugin.editor.widgetName).bind('keyup.' + plugin.editor.widgetName, function(event) {
                        if (event.keyCode == 13) {
                            // Check for and trigger validation - only allow enter to trigger insert if validation not present or successful
                            var linkType = plugin.types[radios.filter(':checked').val()];
                            if (!$.isFunction(linkType.validate) || linkType.validate(plugin.dialog.find('.' + plugin.options.baseClass + '-content'))) {
                                buttons.find('button:eq(0)').trigger('click');
                            }
                        }
                    });
                },
                close: function() {
                    selectionRestore();
                    plugin.visible = false;
                    dialog.find('.' + options.baseClass + '-content').hide();
                    $(this).dialog('destroy');
                }
            }).dialog('open');
        }
    },

    /**
     * Apply the link attributes to the selection
     * @param  {Boolean} edit True if this is an edit
     * @return {Boolean} True if the application was successful
     */
    apply: function(edit) {
        var linkType = this.types[this.dialog.find('input[type="radio"]:checked').val()];

        var attributes = linkType.attributes(this.dialog.find('.' + this.options.baseClass + '-content'), edit);

        // No attributes to apply
        if (!attributes) {
            return true;
        }

        selectionRestore();

        // Prepare link to be shown in any confirm message
        var link = elementOuterHtml($('<a>' + (attributes.title ? attributes.title : attributes.href) + '</a>').
                attr($.extend({}, attributes, { target: '_blank' })));

        if (!edit) {
            selectionWrapTagWithAttribute('a', $.extend(attributes, { id: this.editor.getUniqueId() }), linkType.classes);
            this.editor.showConfirm(_('Added link: {{link}}', { link: link }));
            this.selectedElement = $('#' + attributes.id).removeAttr('id');
        } else {
            // Remove all link type classes
            this.selectedElement[0].className = this.selectedElement[0].className.replace(new RegExp(this.options.baseClass + '-[a-zA-Z]+','g'), '');
            this.selectedElement.addClass(linkType.classes)
                    .attr(attributes);
            this.editor.showConfirm(_('Updated link: {{link}}', { link: link }));
        }

        this.selectedElement.data(this.options.baseClass + '-href', attributes.href);

        selectionSelectOuter(this.selectedElement);
        selectionSave();

        return true;
    },

    /**
     * Update the link control panel's content depending on which radio button is selected
     * @param  {Boolean} edit    True if the user is editing a link
     */
    typeChange: function(linkType, edit) {
        var panel = this.dialog.find('.' + this.options.baseClass + '-content');
        var wrap = panel.closest('.' + this.options.baseClass + '-wrap');
        var ajax = linkType.ajaxUri && !this.types[linkType.type].content;

        if (ajax) wrap.addClass(this.options.baseClass + '-loading');

        var plugin = this;

        panel.hide(this.options.panelAnimation, function(){
            if (!ajax) {
                panel.html(linkType.content);
                linkType.show(panel, edit);
                panel.show(plugin.options.panelAnimation, $.proxy(linkType.focus, linkType));
            } else {
                $.ajax({
                    url: linkType.ajaxUri,
                    type: 'get',
                    success: function(data) {
                        panel.html(data);
                        plugin.types[linkType.type].content = data;
                        wrap.removeClass(plugin.options.baseClass + '-loading');
                        linkType.show(panel, edit);
                        panel.show(plugin.options.panelAnimation, $.proxy(linkType.focus, linkType));
                    }
                });
            }
        });
    },

    /**
     * Remove the link tags from the selection. Expand to the commonAncestor if the user has selected only a portion of an anchor
     */
    remove: function() {
        this.editor.unwrapParentTag('a');
    },

    /**
     * Replace the href for links with their data version, if stored.
     * This is an attempt to workaround browsers that "helpfully" convert relative & root-relative links to their absolute forms.
     */
    repairLinks: function() {
        var ui = this;
        this.editor.getElement().find('a[class^="' + this.options.baseClass + '"]').each(function(){
            if ($(this).data(ui.options.baseClass + '-href')) {
                $(this).attr('href', $(this).data(ui.options.baseClass + '-href'));
            }
        });
    },

    /**
     * Tidy up after the user has canceled editing
     */
    cancel: function() {
        if (this.dialog) $(this.dialog.dialog('close'));
    }

});

$.ui.editor.registerUi({

    /**
     * @name $.editor.ui.link
     * @augments $.ui.editor.defaultUi
     * @see $.ui.editor.defaultUi.unlink
     * @see  $.editor.plugin.link
     * @class Button initiating the insert link plugin
     */
    link: /** @lends $.editor.ui.link.prototype */ {

        hotkeys: {
            'ctrl+l': {
                'action': function() {
                    this.editor.getPlugin('link').show();
                },
                restoreSelection: false
            }
        },

        /**
         * @see $.ui.editor.defaultUi#init
         */
        init: function(editor) {
            editor.bind('selectionChange', this.change, this);

            return editor.uiButton({
                title: _('Insert Link'),
                click: function() {
                    editor.getPlugin('link').show();
                }
            });
        },

        change: function() {
            if (!selectionGetElements().length) this.ui.disable();
            else this.ui.enable();
        }
    },

    /**
     * @name $.editor.ui.unlink
     * @augments $.ui.editor.defaultUi
     * @see $.ui.editor.defaultUi.link
     * @see  $.editor.plugin.link
     * @class Button allowing the user to unlink text
     */
    unlink: /** @lends $.editor.ui.unlink.prototype */ {

        hotkeys: {
            'ctrl+shift+l': {
                'action': function() {
                    this.ui.click();
                },
                restoreSelection: false
            }
        },

        /**
         * @see $.ui.editor.defaultUi#init
         */
        init: function(editor) {
            editor.bind('selectionChange', this.change, this);
            editor.bind('show', this.change, this);

            return editor.uiButton({
                title: _('Remove Link'),
                click: function() {
                    editor.getPlugin('link').remove();
                }
            });
        },

        /**
         * Enable UI component only when an anchor is selected
         */
        change: function() {
            if (!selectionGetElements().is('a')) this.ui.disable();
            else this.ui.enable();
        }
    }
});
/**
 * @fileOverview UI components & plugin for inserting ordered and unordered lists
 * @author David Neilsen david@panmedia.co.nz
 * @author Michael Robinson michael@panmedia.co.nz
 */
$.ui.editor.registerPlugin('list', /** @lends $.editor.plugin.list.prototype */ {

    /**
     * @name $.editor.plugin.list.options
     * @type {Object}
     * @namespace Default options
     * @see $.editor.plugin.list
     */
    options: /** @lends $.editor.plugin.list.options */  { },

    /**
     * Tag names for elements that are allowed to contain ul/ol elements.
     * @type {Array}
     */
    validParents: [
        'blockquote', 'body', 'button', 'center', 'dd', 'div', 'fieldset', 'form', 'iframe', 'li',
        'noframes', 'noscript', 'object', 'td', 'th'
    ],

    /**
     * Tag names for elements that may be contained by li elements.
     * @type {Array}
     */
    validChildren: [
        'a', 'abbr','acronym', 'applet', 'b', 'basefont', 'bdo', 'big', 'br', 'button', 'cite', 'code', 'dfn',
        'em', 'font', 'i', 'iframe', 'img', 'input', 'kbd', 'label', 'map', 'object', 'p', 'q', 's',  'samp',
        'select', 'small', 'span', 'strike', 'strong', 'sub', 'sup', 'textarea', 'tt', 'u', 'var'
    ],

    /**
     * Toggle listType depending on the current selection.
     * This function fires both the selectionChange & change events when the action is complete.
     * @param  {string} listType One of ul or ol.
     */
    toggleList: function(listType) {

        // Check whether selection is fully contained by a ul/ol. If so, unwrap parent ul/ol
        if ($(selectionGetElements()).is('li')
            && $(selectionGetElements()).parent().is(listType)) {
            this.unwrapList();
        } else {
            this.wrapList(listType);
        }

        this.editor.fire('selectionChange');
        this.editor.fire('change');
    },

    /**
     * Extract the contents of all selected li elements.
     * If the list element's parent is not a li, then wrap the content of each li in a p, else leave them unwrapped.
     */
    unwrapList: function() {
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
        this.editor.checkChange();
    },

    /**
     * Wrap the selection with the given listType.
     * @param  {string} listType One of ul or ol.
     */
    wrapList: function(listType) {
        this.editor.constrainSelection(this.editor.getElement());
        if ($.trim(selectionGetHtml()) === '') {
            selectionSelectInner(selectionGetElements());
        }

        var selectedHtml = $('<div>').html(selectionGetHtml());

        var listElements = [];
        var plugin = this;

        // Convert child block elements to list elements
        $(selectedHtml).contents().each(function() {
            var liContent;
            // Use only content of block elements
            if ('block' === elementDefaultDisplay(this.tagName)) {
                liContent = stringStripTags($(this).html(), plugin.validChildren);
            } else {
                liContent = stringStripTags(elementOuterHtml($(this)), plugin.validChildren);
            }

            // Avoid inserting blank lists
            var listElement = $('<li>' + liContent + '</li>');
            if ($.trim(listElement.text()) !== '') {
                listElements.push(elementOuterHtml(listElement));
            }
        });

        var replacementClass = this.options.baseClass + '-selection';
        var replacementHtml = '<' + listType + ' class="' + replacementClass + '">' + listElements.join('') + '</' + listType + '>';

        // Selection must be restored before it may be replaced.
        selectionRestore();

        var selectedElementParent = $(selectionGetElements()[0]).parent();
        var editingElement = this.editor.getElement()[0];

        /*
         * Replace selection if the selected element parent or the selected element is the editing element,
         * instead of splitting the editing element.
         */
        if (selectedElementParent === editingElement
            || selectionGetElements()[0] === editingElement) {
            selectionReplace(replacementHtml);
        } else {
            selectionReplaceWithinValidTags(replacementHtml, this.validParents);
        }

        // Select the first list element of the inserted list
        var selectedElement = $(this.editor.getElement().find('.' + replacementClass).removeClass(replacementClass));
        selectionSelectInner(selectedElement.find('li:first')[0]);
        this.editor.checkChange();
    },

    /**
     * Toggle the givent ui's button state depending on whether the current selection is within the context of listType.
     * @param  {string} listType A tagname for a list type.
     * @param  {object} ui The ui owning the button whose state is to be toggled.
     */
    toggleButtonState: function(listType, ui) {

        var toggleState = function(on) {
            ui.button.toggleClass('ui-state-highlight', on).toggleClass('ui-state-default', !on);
        };

        var selectionStart = selectionGetStartElement();
        if (selectionStart === null || !selectionStart.length) {
            selectionStart = this.editor.getElement();
        }

        var selectionEnd = selectionGetEndElement();
        if (selectionEnd === null || !selectionEnd.length) {
            selectionEnd = this.editor.getElement();
        }

        var start = selectionStart[0];
        var end = selectionEnd[0];

        // If the start & end are a UL or OL, and they're the same node:
        if ($(start).is(listType) && $(end).is(listType) && start === end) {
            return toggleState(true);
        }

        var shareParentListType = $(start).parentsUntil(elementSelector, listType).first()
                                    && $(end).parentsUntil(elementSelector, listType).first();

        var elementSelector = '#' + this.editor.getElement().attr('id');
        var startIsLiOrInside = $(start).is(listType + ' > li') || $(start).parentsUntil(elementSelector, listType + ' > li').length;
        var endIsLiOrInside = $(end).is(listType + ' > li') || $(end).parentsUntil(elementSelector, listType + ' > li').length;

        // If the start & end elements are LI's or inside LI's, and they are enclosed by the same UL:
        if (startIsLiOrInside && endIsLiOrInside && shareParentListType) {

            var sharedParentList = $(rangeGetCommonAncestor());
            if (!sharedParentList.is(listType)) {
                sharedParentList = $(sharedParentList).parentsUntil(elementSelector, listType).first();
            }
            var childLists = sharedParentList.find('ul, ol');
            if (!childLists.length) {
                return toggleState(true);
            }
            for (var childListIndex = 0; childListIndex < childLists.length; childListIndex++) {
                if ($.contains(childLists[childListIndex], start) && $.contains(childLists[childListIndex], end)) {
                    return toggleState(false);
                }
            }

            return toggleState(true);
        }

        return toggleState(false);
    }
});

$.ui.editor.registerUi({

    /**
     * @name $.editor.ui.listUnordered
     * @augments $.ui.editor.defaultUi
     * @class Wraps the selection with a &lt;ul&gt;, then a &lt;li&gt;
     */
    listUnordered: /** @lends $.editor.ui.listUnordered.prototype */ {

        /**
         * @see $.ui.editor.defaultUi#init
         */
        init: function(editor) {
            var ui = editor.uiButton({
                title: _('Unordered List'),
                click: function() {
                    editor.getPlugin('list').toggleList('ul');
                }
            });

            editor.bind('selectionChange', function() {
                editor.getPlugin('list').toggleButtonState('ul', ui);
            });

            return ui;
        }
    },

    /**
     * @name $.editor.ui.listOrdered
     * @augments $.ui.editor.defaultUi
     * @class Wraps the selection with a &lt;ol&gt;, then a &lt;li&gt;
     */
    listOrdered: /** @lends $.editor.ui.listOrdered.prototype */ {

        /**
         * @see $.ui.editor.defaultUi#init
         */
        init: function(editor) {
            var ui = editor.uiButton({
                title: _('Ordered List'),
                click: function() {
                    editor.getPlugin('list').toggleList('ol');
                }
            });

            editor.bind('selectionChange', function() {
                editor.getPlugin('list').toggleButtonState('ol', ui);
            });

            return ui;
        }
    }
});
/**
 * @fileOverview Incredible Raptor logo and usage statistics tracking
 * @author David Neilsen david@panmedia.co.nz
 * @author Michael Robinson michael@panmedia.co.nz
 */
$.ui.editor.registerUi({

    /**
     * @name $.editor.ui.logo
     * @augments $.ui.editor.defaultUi
     * @class Displays an <em>amazing</em> Raptor logo, providing your users with both shock and awe.
     * <br/>
     * Links back to the Raptor home page
     */
    logo: /** @lends $.editor.ui.logo.prototype */ {

        ui: null,

        /**
         * @see $.ui.editor.defaultUi#init
         */
        init: function(editor, options) {
            this.ui = this.editor.uiButton({
                title: _('Learn More About the Raptor WYSIWYG Editor'),
                click: function() {
                    window.open('http://www.jquery-raptor.com/about/editors/', '_blank');
                },

                // Button ready event
                ready: function() {
                    var serializeJSON = function(obj) {
                        var t = typeof(obj);
                        if(t != "object" || obj === null) {
                            // simple data type
                            if(t == "string") obj = '"' + obj + '"';
                            return String(obj);
                        } else {
                            // array or object
                            var json = [], arr = (obj && $.isArray(obj));

                            $.each(obj, function(k, v) {
                                t = typeof(v);
                                if(t == "string") v = '"' + v + '"';
                                else if (t == "object" & v !== null) v = serializeJSON(v);
                                json.push((arr ? "" : '"' + k + '":') + String(v));
                            });

                            return (arr ? "[" : "{") + String(json) + (arr ? "]" : "}");
                        }
                    };

                    var data = {
                        'enableUi': this.options.enableUi,
                        'enablePlugins': this.options.enablePlugins,
                        'disabledPlugins': serializeJSON(this.options.disabledPlugins),
                        'ui': serializeJSON(this.options.ui),
                        't': new Date().getTime()
                    };

                    var query = [];
                    for (var i in data) {
                        query.push(i + '=' + encodeURIComponent(data[i]));
                    }

                    this.ui.button.find('.ui-button-icon-primary').css({
                        'background-image': 'url(http://www.jquery-raptor.com/logo/0.0.16?' + query.join('&') + ')'
                    });
                }
            });

            return this.ui;
        }
    }
});
/**
 * @name $.editor.plugin.normaliseLineBreaks
 * @augments $.ui.editor.defaultPlugin
 * @class Automaticly wraps content inside an editable element with a specified tag if it is empty.
 */
$.ui.editor.registerPlugin('normaliseLineBreaks', /** @lends $.editor.plugin.normaliseLineBreaks.prototype */ {

    /**
     * @name $.editor.plugin.normaliseLineBreaks.options
     * @type {Object}
     * @namespace Default options
     * @see $.editor.plugin.normaliseLineBreaks
     */
    options: /** @lends $.editor.plugin.normaliseLineBreaks.options */  {

        /**
         * @type {String} The tag to insert when user presses enter
         */
        enter: '<p><br/></p>',

        /**
         * @type {Array} Array of tag names within which the return HTML is valid.
         */
        enterValidTags: [
            'address', 'blockquote', 'body', 'button', 'center', 'dd',
            'div', 'fieldset', 'form', 'iframe', 'li', 'noframes',
            'noscript', 'object', 'td', 'th'
        ],

        /**
         * @type {String} The tag to insert when user presses shift enter.
         */
        shiftEnter: '<br/>',

        /**
         * @type {Array} Array of tag names within which the shiftReturn HTML is valid.
         */
        shiftEnterValidTags: [
            'a', 'abbr', 'acronym', 'address', 'applet', 'b', 'bdo',
            'big', 'blockquote', 'body', 'button', 'caption', 'center',
            'cite', 'code', 'dd', 'del', 'dfn', 'div', 'dt', 'em',
            'fieldset', 'font', 'form', 'h1', 'h2', 'h3', 'h4', 'h5',
            'h6', 'i', 'iframe', 'ins', 'kbd', 'label', 'legend', 'li',
            'noframes', 'noscript', 'object', 'p', 'pres', 'q', 's',
            'samp', 'small', 'span', 'strike', 'strong', 'sub', 'sup',
            'td', 'th', 'tt', 'u', 'var'
        ]
    },

    hotkeys: {
        'return': {
            'action': function() {

                selectionDestroy();

                var selectionEmpty = selectionIsEmpty();
                var selectionIsAtStart = selectionAtStartOfElement();
                var selectionIsAtEnd = selectionAtEndOfElement();

                var breakId = this.options.baseClass + '-enter-break';
                var breakElement = $(this.options.enter).attr('id', breakId);

                selectionReplaceWithinValidTags(breakElement, this.options.enterValidTags);

                breakElement = $('#' + breakId).removeAttr('id');
                if (selectionEmpty) {
                    if (selectionIsAtStart) {
                        selectionSelectStart(breakElement.next());
                    } else if(selectionIsAtEnd) {
                        selectionSelectStart(breakElement);
                    } else {
                        selectionSelectStart(breakElement.next());
                        var previousSibling = breakElement.prev();
                        if (previousSibling && $.trim(previousSibling.html()) !== '' && elementOuterHtml(previousSibling) !== this.options.enter) {
                            breakElement.remove();
                        }
                    }
                } else {
                    selectionSelectStart(breakElement.next());
                    breakElement.remove();
                }
            },
            restoreSelection: false
        },
        'return+shift': {
            'action': function() {
                selectionDestroy();

                var breakId = this.options.baseClass + '-enter-break';

                var breakElement = $(breakHtml)
                                .attr('id', breakId)
                                .appendTo('body');

                if (this.options.shiftEnterValidTags) {
                    selectionReplaceWithinValidTags(this.options.shiftEnter, this.options.shiftEnterValidTags);
                } else {
                    selectionReplace(breakElement);
                }

                var select = $('#' + breakId).removeAttr('id').next();

                selectionSelectStart(select);
            },
            restoreSelection: false
        }
    }
});
/**
 * @name $.editor.plugin.paste
 * @extends $.editor.plugin
 * @class Plugin that captures paste events on the element and shows a modal dialog containing different versions of what was pasted.
 * Intended to prevent horrible 'paste from word' catastrophes.
 */
$.ui.editor.registerPlugin('paste', /** @lends $.editor.plugin.paste.prototype */ {

    /**
     * @name $.editor.plugin.paste.options
     * @type {Object}
     * @namespace Default options
     * @see $.editor.plugin.paste
     */
    options: /** @lends $.editor.plugin.paste.options */  {

        /**
         * Tags that will not be stripped from pasted content.
         * @type {Array}
         */
        allowedTags: [
            'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'div', 'ul', 'ol', 'li', 'blockquote',
            'p', 'a', 'span', 'hr', 'br'
        ],

        allowedAttributes: [
            'href', 'title'
        ],

        allowedEmptyTags: [
            'hr', 'br'
        ]
    },

    /**
     * @see $.ui.editor.defaultPlugin#init
     */
    init: function(editor, options) {
        var inProgress = false;
        var dialog = false;
        var selector = '.uiWidgetEditorPasteBin';
        var plugin = this;

        // Event binding
        editor.getElement().bind('paste.' + editor.widgetName, $.proxy(function(event) {
            if (inProgress) return false;
            inProgress = true;

            selectionSave();

            // Make a contentEditable div to capture pasted text
            if ($(selector).length) $(selector).remove();
            $('<div class="uiWidgetEditorPasteBin" contenteditable="true" style="width: 1px; height: 1px; overflow: hidden; position: fixed; top: -1px;" />').appendTo('body');
            $(selector).focus();

            window.setTimeout(function() {
                var markup = $(selector).html();
                markup = plugin.filterAttributes(markup);
                markup = plugin.filterChars(markup);
                markup = plugin.stripEmpty(markup);
                markup = plugin.stripAttributes(markup);
                markup = stringStripTags(markup, plugin.options.allowedTags);

                var vars = {
                    plain: $('<div/>').html($(selector).html()).text(),
                    markup: markup,
                    html: $(selector).html()
                };

                dialog = $(editor.getTemplate('paste.dialog', vars));

                // dialog.find('.ui-editor-paste-area').bind('keyup.' + editor.widgetname, function(){
                //     plugin.updateAreas(this, dialog);
                // });

                $(dialog).dialog({
                    modal: true,
                    width: 650,
                    height: 500,
                    resizable: true,
                    title: 'Paste',
                    position: 'center',
                    show: options.dialogShowAnimation,
                    hide: options.dialogHideAnimation,
                    dialogClass: options.baseClass + ' ' + options.dialogClass,
                    buttons:
                        [
                            {
                                text: _('Insert'),
                                click: function() {
                                    var html = null;
                                    var element = $(this).find('.ui-editor-paste-area:visible');

                                    if (element.hasClass('ui-editor-paste-plain') || element.hasClass('ui-editor-paste-source')) {
                                        html = element.val();
                                    } else {
                                        html = element.html();
                                    }

                                    html = plugin.filterAttributes(html);
                                    html = plugin.filterChars(html);

                                    selectionRestore();
                                    selectionReplace(html);

                                    inProgress = false;
                                    $(this).dialog('close');
                                }
                            },
                            {
                                text: _('Cancel'),
                                click: function() {
                                    selectionRestore();
                                    inProgress = false;
                                    $(this).dialog('close');
                                }
                            }
                    ],
                    open: function() {
                        // Create fake jQuery UI tabs (to prevent hash changes)
                        var tabs = $(this).find('.ui-editor-paste-panel-tabs');
                        tabs.find('ul.ui-tabs-nav li').click(function() {
                            tabs.find('ul.ui-tabs-nav li').removeClass('ui-state-active').removeClass('ui-tabs-selected');
                            $(this).addClass('ui-state-active').addClass('ui-tabs-selected');
                            tabs.children('div').hide().eq($(this).index()).show();
                        });

                        // Set custom buttons
                        var buttons = dialog.parent().find('.ui-dialog-buttonpane');
                        buttons.find('button:eq(0)').button({icons: {primary: 'ui-icon-circle-check'}});
                        buttons.find('button:eq(1)').button({icons: {primary: 'ui-icon-circle-close'}});
                    },
                    close: function() {
                        inProgress = false;
                        $(this).dialog('destroy').remove();
                    }
                });

                $(selector).remove();

            }, 0);

            return true;
        }, this));
    },

    /**
     * Attempts to filter rubbish from content using regular expressions
     * @param  {String} content Dirty text
     * @return {String} The filtered content
     */
    filterAttributes: function(content) {
        // The filters variable is an array of of regular expression & handler pairs.
        //
        // The regular expressions attempt to strip out a lot of style data that
        // MS Word likes to insert when pasting into a contentEditable.
        // Almost all of it is junk and not good html.
        //
        // The hander is a place to put a function for match handling.
        // In most cases, it just handles it as empty string.  But the option is there
        // for more complex handling.
        var filters = [
            // Meta tags, link tags, and prefixed tags
            {regexp: /(<meta\s*[^>]*\s*>)|(<\s*link\s* href="file:[^>]*\s*>)|(<\/?\s*\w+:[^>]*\s*>)/gi, handler: ''},
            // MS class tags and comment tags.
            {regexp: /(class="Mso[^"]*")|(<!--(.|\s){1,}?-->)/gi, handler: ''},
            // Apple class tags
            {regexp: /(class="Apple-(style|converted)-[a-z]+\s?[^"]+")/, handle: ''},
            // Google doc attributes
            {regexp: /id="internal-source-marker_[^"]+"|dir="[rtl]{3}"/, handle: ''},
            // blank p tags
            {regexp: /(<p[^>]*>\s*(\&nbsp;|\u00A0)*\s*<\/p[^>]*>)|(<p[^>]*>\s*<font[^>]*>\s*(\&nbsp;|\u00A0)*\s*<\/\s*font\s*>\s<\/p[^>]*>)/ig, handler: ''},
            // Strip out styles containing mso defs and margins, as likely added in IE and are not good to have as it mangles presentation.
            {regexp: /(style="[^"]*mso-[^;][^"]*")|(style="margin:\s*[^;"]*;")/gi, handler: ''},
            // Style tags
            {regexp: /(?:<style([^>]*)>([\s\S]*?)<\/style>|<link\s+(?=[^>]*rel=['"]?stylesheet)([^>]*?href=(['"])([^>]*?)\4[^>\/]*)\/?>)/gi, handler: ''},
            // Scripts (if any)
            {regexp: /(<\s*script[^>]*>((.|\s)*?)<\\?\/\s*script\s*>)|(<\s*script\b([^<>]|\s)*>?)|(<[^>]*=(\s|)*[("|')]javascript:[^$1][(\s|.)]*[$1][^>]*>)/ig, handler: ''}
        ];

        $.each(filters, function(i, filter) {
            content = content.replace(filter.regexp, filter.handler);
        });

        return content;
    },

    /**
     * Replaces commonly-used Windows 1252 encoded chars that do not exist in ASCII or ISO-8859-1 with ISO-8859-1 cognates.
     * @param  {[type]} content [description]
     * @return {[type]}
     */
    filterChars: function(content) {
        var s = content;

        // smart single quotes and apostrophe
        s = s.replace(/[\u2018|\u2019|\u201A]/g, '\'');

        // smart double quotes
        s = s.replace(/[\u201C|\u201D|\u201E]/g, '\"');

        // ellipsis
        s = s.replace(/\u2026/g, '...');

        // dashes
        s = s.replace(/[\u2013|\u2014]/g, '-');

        // circumflex
        s = s.replace(/\u02C6/g, '^');

        // open angle bracket
        s = s.replace(/\u2039/g, '<');

        // close angle bracket
        s = s.replace(/\u203A/g, '>');

        // spaces
        s = s.replace(/[\u02DC|\u00A0]/g, ' ');

        return s;
    },

    /**
     * Strip all attributes from content (if it's an element), and every element contained within
     * Strip loop taken from <a href="http://stackoverflow.com/a/1870487/187954">Remove all attributes</a>
     * @param  {String|Element} content The string / element to be cleaned
     * @return {String} The cleaned string
     */
    stripAttributes: function(content) {
        content = $('<div/>').html(content);
        var allowedAttributes = this.options.allowedAttributes;

        $(content.find('*')).each(function() {
            // First copy the attributes to remove if we don't do this it causes problems iterating over the array
            // we're removing elements from
            var attributes = [];
            $.each(this.attributes, function(index, attribute) {
                // Do not remove allowed attributes
                if (-1 !== $.inArray(attribute.nodeName, allowedAttributes)) {
                    return;
                }
                attributes.push(attribute.nodeName);
            });

            // now remove the attributes
            for (var attributeIndex = 0; attributeIndex < attributes.length; attributeIndex++) {
                $(this).attr(attributes[attributeIndex], null);
            }
        });
        return content.html();
    },

    /**
     * Remove empty tags.
     * @param  {String} content The HTML containing empty elements to be removed
     * @return {String} The cleaned HTML
     */
    stripEmpty: function(content) {
        var wrapper = $('<div/>').html(content);
        var allowedEmptyTags = this.options.allowedEmptyTags;
        wrapper.find('*').filter(function() {
            // Do not strip elements in allowedEmptyTags
            if (-1 !== $.inArray(this.tagName.toLowerCase(), allowedEmptyTags)) {
                return false;
            }
            // If the element has at least one child element that exists in allowedEmptyTags, do not strip it
            if ($(this).find(allowedEmptyTags.join(',')).length) {
                return false;
            }
            return $.trim($(this).text()) === '';
        }).remove();
        return wrapper.html();
    },

    /**
     * Update text input content
     * @param  {Element} target The input being edited
     * @param  {Element} dialog The paste dialog
     */
    updateAreas: function(target, dialog) {
        var content = $(target).is('textarea') ? $(target).val() : $(target).html();
        if (!$(target).hasClass('ui-editor-paste-plain')) dialog.find('.ui-editor-paste-plain').val($('<div/>').html(content).text());
        if (!$(target).hasClass('ui-editor-paste-rich')) dialog.find('.ui-editor-paste-rich').html(content);
        if (!$(target).hasClass('ui-editor-paste-source')) dialog.find('.ui-editor-paste-source').html(content);
        if (!$(target).hasClass('ui-editor-paste-markup')) dialog.find('.ui-editor-paste-markup').html(this.stripAttributes(content));
    }
});/**
 * @fileOverview Placeholder text component
 * @author David Neilsen david@panmedia.co.nz
 * @author Michael Robinson michael@panmedia.co.nz
 */

$.ui.editor.registerPlugin('placeholder', /** @lends $.editor.plugin.placeholder.prototype */ {

    /**
     * @see $.ui.editor.defaultPlugin#init
     */
    init: function(editor, options) {
        var plugin = this;

        /**
        * Plugin option defaults
        * @type {Object}
        */
        options = $.extend({}, {
            /**
             * Content to insert into an editable element if said element is empty on initialisation
             * @default Placeholder content
             * @type {String}
             */
            content: '[Your content here]',

            /**
             * Tag to wrap content
             * @default p
             * @type {String}
             */
            tag: 'p',

            /**
             * Select content on insertion
             * @default true
             * @type {Boolean} False to prevent automatic selection of inserted placeholder
             */
            select: true
        }, options);

        /**
         * Show the click to edit message
         */
        this.show = function() {
            if (!$.trim(editor.getElement().html())) {

                var content = $(document.createElement(options.tag)).html(options.content);
                editor.getElement().html(content);

                if (options.select) {
                    selectionSelectInner(content);
                }
            }
        };

        editor.bind('show', plugin.show);
    }
});/**
 * @fileOverview Raptorize UI component
 * @author David Neilsen david@panmedia.co.nz
 * @author Michael Robinson michael@panmedia.co.nz
 */

$.ui.editor.registerUi({

    /**
     * @name $.editor.ui.raptorize
     * @augments $.ui.editor.defaultUi
     * @class Raptorize your editor
     */
    raptorize: /** @lends $.editor.ui.raptorize.prototype */ {

        /**
         * @see $.ui.editor.defaultUi#init
         */
        init: function(editor) {
            var ui = editor.uiButton({
                title: _('Raptorize'),
                ready: function() {
                    if (!ui.button.raptorize) {
                        // <strict/>
                        return;
                    }
                    ui.button.raptorize();
                }
            });
            return ui;
        }
    }

});
/**
 * @fileOverview Save plugin & ui component
 * @author David Neilsen david@panmedia.co.nz
 * @author Michael Robinson michael@panmedia.co.nz
 */

/**
 * @name $.editor.plugin.saveJson
 * @augments $.ui.editor.defaultPlugin
 * @class Provides an interface for saving the element's content via AJAX. For options see {@link $.editor.plugin.saveJson.options}
 */
$.ui.editor.registerPlugin('saveJson', /** @lends $.editor.plugin.saveJson.prototype */ {

    /**
     * @name $.editor.plugin.saveJson.options
     * @type {Object}
     * @namespace Default options
     * @see $.editor.plugin.saveJson
     */
    options: /** @lends $.editor.plugin.saveJson.options */  {

        /**
         * @type {Object}
         * @default <tt>{ attr: "name" }</tt>
         */
        id: { attr: 'name' },

        /**
         * @type {String}
         * @default "content"
         */
        postName: 'content',

        /**
         * @default false
         * @type {Boolean}
         */
        showResponse: false,

        /**
         * @default false
         * @type {Boolean}
         */
        appendId: false,

        /**
         * @default <tt>{
         *    url: '/',
         *    type: 'post',
         *    cache: false
         * }</tt>
         * @type {Object}
         */
        ajax: {
            url: '/',
            type: 'post',
            cache: false
        }
    },

    /**
     * @see $.ui.editor.defaultPlugin#init
     */
    init: function() {
    },

    /**
     * Get the identifier for this element
     * @return {String} The identifier
     */
    getId: function() {
        if (typeof(this.options.id) === 'string') {
            return this.options.id;
        } else if (typeof(this.options.id) === 'function') {
            return this.options.id.apply(this, [this.editor.getOriginalElement()]);
        } else if (this.options.id.attr) {
            // Check the ID attribute exists on the content block
            var id = this.editor.getOriginalElement().attr(this.options.id.attr);
            if (id) {
                return id;
            }
        }
        return null;
    },

    /**
     * Get the cleaned content for the element.
     * @param {String} id ID to use if no ID can be found.
     * @return {String}
     */
    getData: function() {
        var data = {};
        data[this.getId()] = this.editor.save();
        return data;
    },

    /**
     * Perform save.
     */
    save: function() {
        this.message = this.editor.showLoading(_('Saving changes...'));

        // Get all unified content
        var contentData = {};
        var dirty = 0;
        this.editor.unify(function(editor) {
            if (editor.isDirty()) {
                dirty++;
                var plugin = editor.getPlugin('saveJson');
                $.extend(contentData, plugin.getData());
            }
        });
        this.dirty = dirty;

        // Count the number of requests
        this.saved = 0;
        this.failed = 0;
        this.requests = 0;

        // Pass all content at once
        this.ajax(contentData);
    },

    /**
     * @param {Object} data Data returned from server
     */
    done: function(data) {
        if (this.options.multiple) {
            this.saved++;
        } else {
            this.saved = this.dirty;
        }
        if (this.options.showResponse) {
            this.editor.showConfirm(data, {
                delay: 1000,
                hide: function() {
                    this.editor.unify(function(editor) {
                        editor.disableEditing();
                        editor.hideToolbar();
                    });
                }
            });
        }
    },

    /**
     * Called if a save AJAX request fails
     * @param  {Object} xhr
    */
    fail: function(xhr) {
        if (this.options.multiple) {
            this.failed++;
        } else {
            this.failed = this.dirty;
        }
        if (this.options.showResponse) {
            this.editor.showError(xhr.responseText);
        }
    },

    /**
     * Called after every save AJAX request
     */
    always: function() {
        if (this.dirty === this.saved + this.failed) {
            if (!this.options.showResponse) {
                if (this.failed > 0 && this.saved === 0) {
                    this.editor.showError(_('Failed to save {{failed}} content block(s).', this));
                } else if (this.failed > 0) {
                    this.editor.showError(_('Saved {{saved}} out of {{dirty}} content blocks.', this));
                } else {
                    this.editor.showConfirm(_('Successfully saved {{saved}} content block(s).', this), {
                        delay: 1000,
                        hide: function() {
                            this.editor.unify(function(editor) {
                                editor.disableEditing();
                                editor.hideToolbar();
                            });
                        }
                    });
                }
            }

            // Hide the loading message
            this.message.hide();
            this.message = null;
        }
    },

    /**
     * Handle the save AJAX request(s)
     * @param  {String} contentData The element's content
     * @param  {String} id Editing element's identfier
     */
    ajax: function(contentData, id) {

        // Create the JSON request
        var ajax = $.extend(true, {}, this.options.ajax);

        if ($.isFunction(ajax.data)) {
            ajax.data = ajax.data.apply(this, [id, contentData]);
        } else if (this.options.postName) {
            ajax.data = {};
            ajax.data[this.options.postName] = JSON.stringify(contentData);
        }

        // Get the URL, if it is a callback
        if ($.isFunction(ajax.url)) {
            ajax.url = ajax.url.apply(this, [id]);
        }

        // Send the data to the server
        this.requests++;
        $.ajax(ajax)
            .done($.proxy(this.done, this))
            .fail($.proxy(this.fail, this))
            .always($.proxy(this.always, this));
    }

});
/**
 * @fileOverview
 * @author David Neilsen david@panmedia.co.nz
 */

/**
 * @name $.editor.plugin.saverest
 * @augments $.ui.editor.defaultPlugin
 * @class
 */
$.ui.editor.registerPlugin('saveRest', /** @lends $.editor.plugin.saveRest.prototype */ {

    /**
     * @name $.editor.plugin.saveRest.options
     * @type {Object}
     * @namespace Default options
     * @see $.editor.plugin.saveRest
     */
    options: /** @lends $.editor.plugin.saveRest.options */  {

        /**
         * @default false
         * @type {Boolean}
         */
        showResponse: false,

        /**
         * @default <tt>{
         *    url: '/',
         *    type: 'post',
         *    cache: false
         * }</tt>
         * @type {Object}
         */
        ajax: {
            url: '/',
            type: 'post',
            cache: false
        }
    },

    /**
     * @see $.ui.editor.defaultPlugin#init
     */
    init: function() {
    },

    /**
     * Get the identifier for this element
     * @return {String} The identifier
     */
    getId: function() {
        if (typeof(this.options.id) === 'string') {
            return this.options.id;
        } else if (this.options.id.attr) {
            // Check the ID attribute exists on the content block
            var id = this.editor.getOriginalElement().attr(this.options.id.attr);
            if (id) {
                return id;
            }
        }
        return null;
    },

    /**
     * Get the cleaned content for the element.
     * @param {String} id ID to use if no ID can be found.
     * @return {String}
     */
    getData: function(id) {
        var data = {};
        data[this.getId() || id] = this.editor.save();
        return this.editor.save();
    },

    /**
     * Perform save.
     */
    save: function() {
        this.message = this.editor.showLoading(_('Saving changes...'));

        // Count the number of requests
        this.saved = 0;
        this.failed = 0;
        this.requests = 0;

        // Get all unified content
        var dirty = 0;
        this.editor.unify(function(editor) {
            if (editor.isDirty()) {
                dirty++;
                var plugin = editor.getPlugin('saveRest');
                var content = plugin.editor.save();
                plugin.ajax(content);
            }
        });
        this.dirty = dirty;

        if (dirty === 0) {
            this.message.hide();
            this.editor.showInfo(_('No changes detected to save...'));
        }
    },

    /**
     * @param {Object} data Data returned from server
     */
    done: function(data) {
        if (this.options.multiple) {
            this.saved++;
        } else {
            this.saved = this.dirty;
        }
        if (this.options.showResponse) {
            this.editor.showConfirm(data, {
                delay: 1000,
                hide: function() {
                    this.editor.unify(function(editor) {
                        editor.disableEditing();
                        editor.hideToolbar();
                    });
                }
            });
        }
    },

    /**
     * Called if a save AJAX request fails
     * @param  {Object} xhr
    */
    fail: function(xhr) {
        if (this.options.multiple) {
            this.failed++;
        } else {
            this.failed = this.dirty;
        }
        if (this.options.showResponse) {
            this.editor.showError(xhr.responseText);
        }
    },

    /**
     * Called after every save AJAX request
     */
    always: function() {
        if (this.dirty === this.saved + this.failed) {
            if (!this.options.showResponse) {
                if (this.failed > 0 && this.saved === 0) {
                    this.editor.showError(_('Failed to save {{failed}} content block(s).', this));
                } else if (this.failed > 0) {
                    this.editor.showError(_('Saved {{saved}} out of {{dirty}} content blocks.', this));
                } else {
                    this.editor.showConfirm(_('Successfully saved {{saved}} content block(s).', this), {
                        delay: 1000,
                        hide: function() {
                            this.editor.unify(function(editor) {
                                editor.disableEditing();
                                editor.hideToolbar();
                            });
                        }
                    });
                }
            }

            // Hide the loading message
            this.message.hide();
            this.message = null;
        }
    },

    /**
     * Handle the save AJAX request(s)
     * @param  {String} contentData The element's content
     * @param  {String} id Editing element's identfier
     */
    ajax: function(contentData, id) {
        // Create POST data
        //var data = {};

        // Content is serialized to a JSON object, and sent as 1 post parameter
        //data[this.options.postName] = JSON.stringify(contentData);

        // Create the JSON request
        var ajax = $.extend(true, {}, this.options.ajax);

        if ($.isFunction(ajax.data)) {
            ajax.data = ajax.data.apply(this, [id, contentData]);
        } else if (this.options.postName) {
            ajax.data = {};
            ajax.data[this.options.postName] = JSON.stringify(contentData);
        }

        // Get the URL, if it is a callback
        if ($.isFunction(ajax.url)) {
            ajax.url = ajax.url.apply(this, [id]);
        }

        // Send the data to the server
        this.requests++;
        $.ajax(ajax)
            .done($.proxy(this.done, this))
            .fail($.proxy(this.fail, this))
            .always($.proxy(this.always, this));
    }

});
/**
 * @fileOverview
 * @author David Neilsen david@panmedia.co.nz
 */

/**
 * @name $.editor.ui.save
 * @augments $.ui.editor.defaultUi
 * @class
 */
$.ui.editor.registerUi({

    /**
     * @name $.editor.ui.save
     * @augments $.ui.editor.defaultPlugin
     * @class The save UI component
     */
    save: {

        options: {
            plugin: 'saveJson'
        },

        /**
         * @see $.ui.editor.defaultUi#init
         */
        init: function(editor, element) {
            return editor.uiButton({
                title: _('Save'),
                icon: 'ui-icon-save',
                click: function() {
                    editor.checkChange();
                    editor.getPlugin(this.options.plugin).save();
                }
            });
        }
    }
});
$.ui.editor.registerPlugin({
    snippet: {
        ids: [],
        enabled: false,

        init: function(editor, options) {
            if (options.snippets) {
                for (var i = 0, l = options.snippets.length; i < l; i++) {
                    this.createSnippet(options.snippets[i], editor);
                }

                editor.bind('restore', this.createButtons, this);
                editor.bind('save', this.disable, this);
                editor.bind('cancel', this.disable, this);

                editor.bind('enabled', this.enable, this);
                editor.bind('disabled', this.disable, this);

            }
        },

        createSnippet: function(snippet, editor) {
//            $.ui.editor.registerUi('snippet' + snippet.name.charAt(0).toUpperCase() + snippet.name.substr(1), {
//                init: function(editor, options) {
//                    return editor.uiButton({
//                        name: 'snippet',
//                        title: _('Insert Snippet')
//                    });
//                }
//            });
        },

        enable: function() {
            this.enabled = true;
            this.createButtons();
        },

        disable: function() {
            this.removeButtons();
            this.enabled = false;
        },

        createButtons: function() {
            var editor = this.editor;

            for (var i = 0, l = this.options.snippets.length; i < l; i++) {
                var snippet = this.options.snippets[i];
                if (snippet.repeatable) {
                    this.createButton(snippet, editor);
                }
            }
        },

        createButton: function(snippet, editor) {
            if (!this.enabled) {
                return;
            }
            var plugin = this;
            var id = editor.getUniqueId();
            this.ids.push(id);

            var button = $('<button/>')
                .addClass(plugin.options.baseClass)
                .addClass(plugin.options.baseClass + '-button')
                .addClass(plugin.options.baseClass + '-button-' + snippet.name)
                .addClass(id)
                .text('Add')
                .click(function() {
                    plugin.insertSnippet.call(plugin, snippet, editor, this);
                });

            var buttonAfter = (snippet.buttonAfter || editor.getElement());
            if ($.isFunction(buttonAfter)) {
                buttonAfter.call(this, button, snippet);
            } else {
                button.insertAfter(buttonAfter);
            }

            $('.' + id)
                .button({
                    icons: { primary: 'ui-icon-plusthick' }
                });
        },

        removeButtons: function() {
            if (!this.enabled) {
                return;
            }
            // Remove the button by the ID
            for (var i = 0, l = this.ids.length; i < l; i++) {
                $('.' + this.ids[i]).remove();
            }
            // Run clean function (if supplied)
            for (i = 0, l = this.options.snippets.length; i < l; i++) {
                var snippet = this.options.snippets[i];
                if ($.isFunction(snippet.clean)) {
                    snippet.clean.call(snippet, this, this.editor);
                }
            }
        },

        insertSnippet: function(snippet, editor, button) {
            var template = $(snippet.template).html();

            var appendTo = snippet.appendTo || editor.getElement();
            if ($.isFunction(appendTo)) {
                appendTo.call(this, template, snippet, button);
            } else {
                $(template).appendTo(appendTo);
            }

            editor.disableEditing();
            editor.enableEditing();
        }

    }
});
/**
 * @fileOverview UI Component for a tag-change select menu
 * @author David Neilsen david@panmedia.co.nz
 * @author Michael Robinson michael@panmedia.co.nz
 */
$.ui.editor.registerUi({

    /**
     * @name $.editor.plugin.tagMenu
     * @augments $.ui.editor.defaultPlugin
     * @class Select menu allowing users to change the tag for selection
     */
    tagMenu: /** @lends $.editor.plugin.tagMenu.prototype */ {

        validParents: [
            'blockquote', 'body', 'button', 'center', 'dd', 'div', 'fieldset', 'form', 'iframe', 'li',
            'noframes', 'noscript', 'object', 'td', 'th'
        ],

        /**
         * @see $.ui.editor.defaultUi#init
         */
        init: function(editor) {
            editor.bind('selectionChange', this.change, this);
            editor.bind('show', this.change, this);

            var ui = this;

            return editor.uiSelectMenu({
                name: 'tagMenu',
                title: _('Change HTML tag of selected element'),
                select: $(editor.getTemplate('tagmenu.menu')),
                change: function(value) {
                    // Prevent injection of illegal tags
                    if (typeof value === 'undefined' || value === 'na') {
                        return;
                    }

                    var editingElement = editor.getElement()[0];
                    var selectedElement = selectionGetElements();
                    if (!selectionGetHtml() || selectionGetHtml() === '') {
                        // Do not attempt to modify editing element's tag
                        if ($(selectedElement)[0] === $(editingElement)[0]) {
                            return;
                        }
                        selectionSave();
                        var replacementElement = $('<' + value + '>').html(selectedElement.html());
                        selectedElement.replaceWith(replacementElement);
                        selectionRestore();
                    } else {
                        var selectedElementParent = $(selectionGetElements()[0]).parent();
                        var temporaryClass = this.options.baseClass + '-selection';
                        var replacementHtml = $('<' + value + '>').html(selectionGetHtml()).addClass(temporaryClass);

                        /*
                         * Replace selection if the selected element parent or the selected element is the editing element,
                         * instead of splitting the editing element.
                         */
                        if (selectedElementParent === editingElement
                            || selectionGetElements()[0] === editingElement) {
                            selectionReplace(replacementHtml);
                        } else {
                            selectionReplaceWithinValidTags(replacementHtml, this.validParents);
                        }

                        selectionSelectInner(editor.getElement().find('.' + temporaryClass).removeClass(temporaryClass));
                    }

                    editor.checkChange();
                }
            });
        },

        /**
         * Content changed event
         */
        change: function() {
            var tag = selectionGetElements()[0];
            if (!tag) {
                $(this.ui.button).toggleClass('ui-state-disabled', true);
                return;
            }
            tag = tag.tagName.toLowerCase();
            if (this.ui.select.find('option[value=' + tag + ']').length) {
                this.ui.val(tag);
            } else {
                this.ui.val('na');
            }
            $(this.ui.button).toggleClass('ui-state-disabled', this.editor.getElement()[0] === selectionGetElements()[0]);
        }
    }
});
/**
 * @fileOverview Toolbar tips plugin
 * @author David Neilsen david@panmedia.co.nz
 */

/**
 * @name $.editor.plugin.toolbarTip
 * @augments $.ui.editor.defaultPlugin
 * @class Converts native tool tips to styled tool tips
 */
$.ui.editor.registerPlugin('toolbarTip', /** @lends $.editor.plugin.toolbarTip.prototype */ {

    /**
     * @see $.ui.editor.defaultPlugin#init
     */
    init: function(editor, options) {
        if ($.browser.msie) {
            return;
        }
        this.bind('show, tagTreeUpdated', function() {
            $('.ui-editor-wrapper [title]').each(function() {
                $(this).attr('data-title', $(this).attr('title'));
                $(this).removeAttr('title');
            });
        });
    }

});/**
 * @fileOverview UI Component for displaying a warning in a corner of the element when unsaved edits exist
 * @author David Neilsen david@panmedia.co.nz
 * @author Michael Robinson michael@panmedia.co.nz
 */
(function() {
    /**
     * The warning message node.
     * @type Element
     */
    var warning = null;

    /**
     * Amount of dirty blocks.
     * @type Element
     */
    var dirty = 0;

    /**
     * @name $.editor.plugin.unsavedEditWarning
     * @augments $.ui.editor.defaultPlugin
     * @see $.editor.plugin.unsavedEditWarning.options
     * @class
     */
    $.ui.editor.registerPlugin('unsavedEditWarning', /** @lends $.editor.plugin.unsavedEditWarning.prototype */ {

        /**
         * @see $.ui.editor.defaultPlugin#init
         */
        init: function(editor, options) {
            var plugin = this;

            if (!warning) {
                warning = $(editor.getTemplate('unsavededitwarning.warning', this.options))
                    .attr('id', editor.getUniqueId())
                    .appendTo('body')
                    .bind('mouseenter.' + editor.widgetName, function() {
                        $.ui.editor.eachInstance(function(editor) {
                            if (editor.isDirty()) {
                                editor.getElement().addClass(plugin.options.baseClass + '-dirty');
                            }
                        });
                    })
                    .bind('mouseleave.' + editor.widgetName, function() {
                        $('.' + plugin.options.baseClass + '-dirty').removeClass(plugin.options.baseClass + '-dirty');
                    });
            }

            editor.bind('dirty', function() {
                dirty++;
                if (dirty > 0) {
                    elementBringToTop(warning);
                    warning.addClass(plugin.options.baseClass + '-visible');
                }
            });

            editor.bind('cleaned', function() {
                dirty--;
                if (dirty === 0) {
                    warning.removeClass(plugin.options.baseClass + '-visible');
                }
            });
        }

    });

})();/**
 * @fileOverview View source UI component
 * @author David Neilsen david@panmedia.co.nz
 * @author Michael Robinson michael@panmedia.co.nz
 */
 $.ui.editor.registerUi({

    /**
     * @name $.editor.ui.viewSource
     * @augments $.ui.editor.defaultUi
     * @class Shows a dialog containing the element's markup, allowing the user to edit the source directly
     */
    viewSource: /** @lends $.editor.ui.viewSource.prototype */ {

        /**
         * @see $.ui.editor.defaultUi#init
         */
        init: function(editor, options) {
//            editor.bind('hide', this.hide, this);

            return editor.uiButton({
                title: _('View / Edit Source'),
                click: function() {
                    this.show();
                }
            });
        },

        /**
         * Show the view source dialog. Disable the button.
         */
        show: function() {
            var ui = this;

            var dialog = $(this.editor.getTemplate('viewsource.dialog', {
                baseClass: ui.options.baseClass,
                source: ui.editor.getHtml()
            }));

            var button = this.ui.button;
            $(button).button('option', 'disabled', true);

            dialog.dialog({
                modal: false,
                width: 600,
                height: 400,
                resizable: true,
                title: _('View Source'),
                autoOpen: true,
                dialogClass: ui.options.baseClass + ' ' + ui.options.dialogClass,
                buttons: [
                    {
                        text: _('Apply Source'),
                        click: function() {
                            var html = $(this).find('textarea').val();
                            ui.editor.setHtml(html);
                            $(this).find('textarea').val(ui.editor.getHtml());
                        }
                    },
                    {
                        text: _('Close'),
                        click: function() {
                            $(this).dialog('close');
                        }
                    }
                ],
                open: function() {
                    var buttons = $(this).parent().find('.ui-dialog-buttonpane');
                    buttons.find('button:eq(0)').button({ icons: { primary: 'ui-icon-circle-check' }});
                    buttons.find('button:eq(1)').button({ icons: { primary: 'ui-icon-circle-close' }});
                },
                close: function() {
                    $(this).dialog('destroy').remove();
                    $(button).button('option', 'disabled', false);
                    ui.editor.checkChange();
                }
            });
        }
    }
});/**
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
 * @param  {Element} element The element to test.
 * @return {Boolean} True if the element is a block element
 */
function elementIsBlock(element) {
    return elementDefaultDisplay(element.tagName) === 'block';
}

/**
 * Determine whether element is inline or block.
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
 * Check that the given element is one of the the given tags
 * @param  {jQuery|Element} element The element to be tested.
 * @param  {Array}  validTagNames An array of valid tag names.
 * @return {Boolean} True if the given element is one of the give valid tags.
 */
function elementIsValid(element, validTags) {
    return -1 !== $.inArray($(element)[0].tagName.toLowerCase(), validTags);
}
/**
 * @fileOverview DOM fragment manipulation helper functions
 * @author David Neilsen david@panmedia.co.nz
 * @author Michael Robinson michael@panmedia.co.nz
 */

/**
 * Convert a DOMFragment to an HTML string. Optinally wraps the tring in a tag.
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
}/**
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
        console.log(range.commonAncestorContainer);
        for (var i = 0, l = elements.length; i < l; i++) {
            if ($(range.commonAncestorContainer).is(elements[i])) {
                return;
            }
        }
    } while (range.commonAncestorContainer)
}

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
    if ($(html).is(':empty')) return true;
    return false;
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
 * FIXME: this function needs reviewing
 * @public @static
 */
function selectionReplace(html, sel) {
    selectionEachRange(function(range) {
        rangeReplace(html, range);
    }, sel, this);
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
    var selectionExists = false;
    selectionEachRange(function(range) {
        if (!rangeIsEmpty(range)) selectionExists = true;
    }, sel, this);
    return selectionExists;
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
    return;
}
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
}function Button() {
    return {
        init: function() {
            console.log(this);
        }
    };
};

                })(jQuery, window, rangy);
            jQuery('<style type="text/css">/* Non styles */\n\
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
.ui-editor-wrapper {\n\
  overflow: visible;\n\
  z-index: 1001;\n\
  position: fixed; }\n\
  .ui-editor-wrapper .ui-editor-toolbar {\n\
    padding: 6px 0 0 5px;\n\
    overflow: visible; }\n\
  .ui-editor-wrapper .ui-editor-toolbar,\n\
  .ui-editor-wrapper .ui-editor-toolbar * {\n\
    -webkit-user-select: none;\n\
    -moz-user-select: none;\n\
    user-select: none; }\n\
  .ui-editor-wrapper .ui-dialog-titlebar .ui-editor-element-path:first-child {\n\
    margin-left: 5px; }\n\
  .ui-editor-wrapper .ui-dialog-titlebar .ui-editor-element-path {\n\
    min-width: 10px;\n\
    min-height: 15px;\n\
    display: inline-block; }\n\
\n\
.ui-editor-dock-docked-to-element .ui-editor-toolbar {\n\
  padding: 5px 0 0 5px!important; }\n\
  .ui-editor-dock-docked-to-element .ui-editor-toolbar .ui-editor-group {\n\
    margin: 0 5px 5px 0; }\n\
\n\
.ui-editor-dock-docked-element {\n\
  display: block !important;\n\
  border: 0 none transparent;\n\
  -webkit-box-sizing: border-box;\n\
  -moz-box-sizing: border-box;\n\
  box-sizing: border-box; }\n\
\n\
/******************************************************************************\\n\
 * Inputs\n\
\******************************************************************************/\n\
.ui-editor-wrapper textarea,\n\
.ui-editor-wrapper input {\n\
  padding: 5px; }\n\
\n\
/******************************************************************************\\n\
 * Dialogs\n\
\******************************************************************************/\n\
.ui-editor-wrapper .ui-dialog-content {\n\
  font-size: 13px; }\n\
.ui-editor-wrapper textarea {\n\
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
.ui-editor-editing {\n\
  outline: none; }\n\
\n\
/******************************************************************************\\n\
 * Inputs\n\
\******************************************************************************/\n\
.ui-editor-wrapper textarea,\n\
.ui-editor-wrapper input {\n\
  border: 1px solid #D4D4D4; }\n\
\n\
/******************************************************************************\\n\
 * Dialogs\n\
\******************************************************************************/\n\
.ui-editor-wrapper .ui-dialog-content {\n\
  font-size: 13px; }\n\
\n\
html body div.ui-wrapper div.ui-dialog-titlebar a.ui-dialog-titlebar-close span.ui-icon {\n\
  margin-top: 0!important; }\n\
\n\
/* Components */\n\
/**\n\
 * Toolbar/path selection bar wrapper\n\
 *\n\
 * @author David Neilsen <david@panmedia.co.nz>\n\
 */\n\
/**\n\
 * Path selection bar\n\
 *\n\
 * @author David Neilsen <david@panmedia.co.nz>\n\
 */\n\
.ui-editor-path {\n\
  padding: 5px;\n\
  font-size: 13px; }\n\
\n\
/**\n\
 * Select menu UI widget styles\n\
 *\n\
 * @author David Neilsen <david@panmedia.co.nz>\n\
 */\n\
.ui-editor-selectmenu {\n\
  overflow: visible;\n\
  position: relative; }\n\
\n\
.ui-editor-selectmenu-button {\n\
  text-align: left;\n\
  padding: 3px 18px 5px 5px !important;\n\
  float: none !important; }\n\
  .ui-editor-selectmenu-button .ui-icon {\n\
    position: absolute;\n\
    right: 1px;\n\
    top: 8px; }\n\
  .ui-editor-selectmenu-button .ui-editor-selectmenu-text {\n\
    font-size: 13px; }\n\
\n\
.ui-editor-selectmenu-wrapper {\n\
  position: relative; }\n\
\n\
.ui-editor-selectmenu-button .ui-button-text {\n\
  padding: 0 25px 0 5px; }\n\
\n\
.ui-editor-selectmenu-button .ui-icon {\n\
  background-repeat: no-repeat; }\n\
\n\
.ui-editor-selectmenu-menu {\n\
  position: absolute;\n\
  top: 100%;\n\
  left: 0;\n\
  right: auto;\n\
  display: none;\n\
  margin-top: -1px !important; }\n\
\n\
.ui-editor-selectmenu-visible .ui-editor-selectmenu-menu {\n\
  display: block;\n\
  z-index: 1; }\n\
\n\
.ui-editor-selectmenu-menu-item {\n\
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
.ui-editor-selectmenu-button {\n\
  background: #f5f5f5;\n\
  border: 1px solid #ccc; }\n\
\n\
.ui-editor-buttonset .ui-editor-selectmenu-visible .ui-editor-selectmenu-button {\n\
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
.ui-editor-buttonset {\n\
  float: left;\n\
  margin: 0 5px 4px 0;\n\
  display: inline-block; }\n\
  .ui-editor-buttonset > .ui-button {\n\
    float: left;\n\
    display: block;\n\
    margin: 0 -1px 0 0;\n\
    font-size: 13px; }\n\
  .ui-editor-buttonset .ui-button:hover {\n\
    z-index: 1; }\n\
  .ui-editor-buttonset .ui-editor-selectmenu {\n\
    display: block; }\n\
    .ui-editor-buttonset .ui-editor-selectmenu .ui-button {\n\
      margin: 0 -1px 0 0; }\n\
\n\
.ui-editor-ff .ui-editor-buttonset {\n\
  float: none;\n\
  vertical-align: top; }\n\
\n\
.ui-editor-wrapper .ui-button {\n\
  height: 32px;\n\
  margin-bottom: 0;\n\
  margin-top: 0;\n\
  padding: 0;\n\
  -webkit-box-sizing: border-box;\n\
  -moz-box-sizing: border-box;\n\
  box-sizing: border-box; }\n\
.ui-editor-wrapper .ui-button-icon-only {\n\
  width: 32px; }\n\
\n\
.ui-editor-wrapper .ui-editor-buttonset > .ui-button {\n\
  -webkit-border-radius: 0;\n\
  -moz-border-radius: 0;\n\
  -ms-border-radius: 0;\n\
  -o-border-radius: 0;\n\
  border-radius: 0; }\n\
  .ui-editor-wrapper .ui-editor-buttonset > .ui-button:first-child {\n\
    -moz-border-radius-topleft: 5px;\n\
    -webkit-border-top-left-radius: 5px;\n\
    border-top-left-radius: 5px;\n\
    -moz-border-radius-bottomleft: 5px;\n\
    -webkit-border-bottom-left-radius: 5px;\n\
    border-bottom-left-radius: 5px; }\n\
  .ui-editor-wrapper .ui-editor-buttonset > .ui-button:last-child {\n\
    -moz-border-radius-topright: 5px;\n\
    -webkit-border-top-right-radius: 5px;\n\
    border-top-right-radius: 5px;\n\
    -moz-border-radius-bottomright: 5px;\n\
    -webkit-border-bottom-right-radius: 5px;\n\
    border-bottom-right-radius: 5px; }\n\
\n\
.ui-button-icon-only .ui-button-text {\n\
  display: none; }\n\
\n\
/**\n\
 * Unsupported warning styles\n\
 *\n\
 * @author David Neilsen <david@panmedia.co.nz>\n\
 */\n\
/* Layout */\n\
.ui-editor-unsupported {\n\
  position: relative; }\n\
\n\
.ui-editor-unsupported-overlay {\n\
  position: fixed;\n\
  top: 0;\n\
  left: 0;\n\
  bottom: 0;\n\
  right: 0;\n\
  background-color: black;\n\
  filter: alpha(opacity=50);\n\
  opacity: 0.5; }\n\
\n\
.ui-editor-unsupported-content {\n\
  position: fixed;\n\
  top: 50%;\n\
  left: 50%;\n\
  margin: -200px 0 0 -300px;\n\
  width: 600px;\n\
  height: 400px; }\n\
\n\
.ui-editor-unsupported-input {\n\
  position: absolute;\n\
  bottom: 10px; }\n\
\n\
/* Style */\n\
.ui-editor-unsupported-content {\n\
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
.ui-editor-messages {\n\
  margin: 0;\n\
  /* Error */\n\
  /* Confirm */\n\
  /* Information */\n\
  /* Warning */\n\
  /* Loading */ }\n\
  .ui-editor-messages .ui-editor-message-close {\n\
    cursor: pointer;\n\
    float: right; }\n\
  .ui-editor-messages .ui-icon {\n\
    margin: 0 0 3px 3px; }\n\
  .ui-editor-messages .ui-icon,\n\
  .ui-editor-messages .ui-editor-message {\n\
    display: inline-block;\n\
    vertical-align: top; }\n\
  .ui-editor-messages .ui-editor-message-wrapper {\n\
    padding: 3px 3px 3px 1px;\n\
    -webkit-box-shadow: inset 0 -1px 1px rgba(0, 0, 0, 0.35), inset 0 1px 2px rgba(255, 255, 255, 0.5);\n\
    -moz-box-shadow: inset 0 -1px 1px rgba(0, 0, 0, 0.35), inset 0 1px 2px rgba(255, 255, 255, 0.5);\n\
    box-shadow: inset 0 -1px 1px rgba(0, 0, 0, 0.35), inset 0 1px 2px rgba(255, 255, 255, 0.5); }\n\
  .ui-editor-messages .ui-editor-message-wrapper:first-child {\n\
    -moz-border-radius-topright: 5px;\n\
    -webkit-border-top-right-radius: 5px;\n\
    border-top-right-radius: 5px;\n\
    -moz-border-radius-topleft: 5px;\n\
    -webkit-border-top-left-radius: 5px;\n\
    border-top-left-radius: 5px; }\n\
  .ui-editor-messages .ui-editor-message-wrapper:last-child {\n\
    -moz-border-radius-bottomright: 5px;\n\
    -webkit-border-bottom-right-radius: 5px;\n\
    border-bottom-right-radius: 5px;\n\
    -moz-border-radius-bottomleft: 5px;\n\
    -webkit-border-bottom-left-radius: 5px;\n\
    border-bottom-left-radius: 5px; }\n\
  .ui-editor-messages .ui-editor-message-circle-close {\n\
    /* Red */\n\
    background: url(\'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4gPHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJncmFkIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgeDE9IjUwJSIgeTE9IjAlIiB4Mj0iNTAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iI2ZmNWQ0YiIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iI2ZhMWMxYyIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxyZWN0IHg9IjAiIHk9IjAiIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JhZCkiIC8+PC9zdmc+IA==\');\n\
    background: -webkit-gradient(linear, 50% 0%, 50% 100%, color-stop(0%, #ff5d4b), color-stop(100%, #fa1c1c));\n\
    background: -webkit-linear-gradient(top, #ff5d4b, #fa1c1c);\n\
    background: -moz-linear-gradient(top, #ff5d4b, #fa1c1c);\n\
    background: -o-linear-gradient(top, #ff5d4b, #fa1c1c);\n\
    background: linear-gradient(top, #ff5d4b, #fa1c1c); }\n\
  .ui-editor-messages .ui-editor-message-circle-check {\n\
    /* Green */\n\
    background: url(\'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4gPHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJncmFkIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgeDE9IjUwJSIgeTE9IjAlIiB4Mj0iNTAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iI2NkZWI4ZSIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iI2E1Yzk1NiIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxyZWN0IHg9IjAiIHk9IjAiIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JhZCkiIC8+PC9zdmc+IA==\');\n\
    background: -webkit-gradient(linear, 50% 0%, 50% 100%, color-stop(0%, #cdeb8e), color-stop(100%, #a5c956));\n\
    background: -webkit-linear-gradient(top, #cdeb8e, #a5c956);\n\
    background: -moz-linear-gradient(top, #cdeb8e, #a5c956);\n\
    background: -o-linear-gradient(top, #cdeb8e, #a5c956);\n\
    background: linear-gradient(top, #cdeb8e, #a5c956); }\n\
  .ui-editor-messages .ui-editor-message-info {\n\
    /* Blue */\n\
    background: url(\'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4gPHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJncmFkIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgeDE9IjUwJSIgeTE9IjAlIiB4Mj0iNTAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iI2E5ZTRmNyIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iIzBmYjRlNyIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxyZWN0IHg9IjAiIHk9IjAiIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JhZCkiIC8+PC9zdmc+IA==\');\n\
    background: -webkit-gradient(linear, 50% 0%, 50% 100%, color-stop(0%, #a9e4f7), color-stop(100%, #0fb4e7));\n\
    background: -webkit-linear-gradient(top, #a9e4f7, #0fb4e7);\n\
    background: -moz-linear-gradient(top, #a9e4f7, #0fb4e7);\n\
    background: -o-linear-gradient(top, #a9e4f7, #0fb4e7);\n\
    background: linear-gradient(top, #a9e4f7, #0fb4e7); }\n\
  .ui-editor-messages .ui-editor-message-alert {\n\
    /* Yellow */\n\
    background: url(\'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4gPHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJncmFkIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgeDE9IjUwJSIgeTE9IjAlIiB4Mj0iNTAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iI2ZmZDY1ZSIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iI2ZlYmYwNCIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxyZWN0IHg9IjAiIHk9IjAiIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JhZCkiIC8+PC9zdmc+IA==\');\n\
    background: -webkit-gradient(linear, 50% 0%, 50% 100%, color-stop(0%, #ffd65e), color-stop(100%, #febf04));\n\
    background: -webkit-linear-gradient(top, #ffd65e, #febf04);\n\
    background: -moz-linear-gradient(top, #ffd65e, #febf04);\n\
    background: -o-linear-gradient(top, #ffd65e, #febf04);\n\
    background: linear-gradient(top, #ffd65e, #febf04); }\n\
  .ui-editor-messages .ui-editor-message-clock {\n\
    /* Purple */\n\
    background: url(\'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4gPHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJncmFkIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgeDE9IjUwJSIgeTE9IjAlIiB4Mj0iNTAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iI2ZiODNmYSIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iI2U5M2NlYyIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxyZWN0IHg9IjAiIHk9IjAiIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JhZCkiIC8+PC9zdmc+IA==\');\n\
    background: -webkit-gradient(linear, 50% 0%, 50% 100%, color-stop(0%, #fb83fa), color-stop(100%, #e93cec));\n\
    background: -webkit-linear-gradient(top, #fb83fa, #e93cec);\n\
    background: -moz-linear-gradient(top, #fb83fa, #e93cec);\n\
    background: -o-linear-gradient(top, #fb83fa, #e93cec);\n\
    background: linear-gradient(top, #fb83fa, #e93cec); }\n\
  .ui-editor-messages .ui-editor-message-clock .ui-icon.ui-icon-clock {\n\
    background: transparent url(\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAOXRFWHRTb2Z0d2FyZQBBbmltYXRlZCBQTkcgQ3JlYXRvciB2MS42LjIgKHd3dy5waHBjbGFzc2VzLm9yZyl0zchKAAAAOnRFWHRUZWNobmljYWwgaW5mb3JtYXRpb25zADUuMi4xNzsgYnVuZGxlZCAoMi4wLjM0IGNvbXBhdGlibGUpCBSqhQAAAAhhY1RMAAAACAAAAAC5PYvRAAAAGmZjVEwAAAAAAAAAEAAAABAAAAAAAAAAAAA8A+gAAIIkGDIAAACsSURBVDiNtZLBCcMwDEUfJgOUjhAyQsmp9FA8TgfISj6F4gl66jSdIIf00G9wnLjYKf3w0Qch6Us2fMdVLMYx0haYRZsrMJEegZdiDj3gFFeT54jBiU2mO+XdVvdRyV0OYidVMEAH3AEPHGoboMKwuy+seYqLV9iNTpM90P7S6AQMitXogYnPHSbyz2SAC9HqQVigkW7If90z8FAsctCyvMvKQdpkSOzfxP/hDd++JCi8XmbFAAAAGmZjVEwAAAABAAAAEAAAABAAAAAAAAAAAAA8A+gAABlX8uYAAAC3ZmRBVAAAAAI4jaWQsQ3CQBAEB4cECFGCI1fiAlyFKwARWgSIeqjCNTh0gIjIkBw9gffFSfz74VlpdX/W3Xr3YBmlmIUSmMSoSGHee+CmGsMGaFU/cAecqnVh/95qpg0J/O0gCytgDRzUX4DnryIn5lwO6L7c6fxskRhMwkc4qj+TEcFjC9SqWcsj8x3GhMgu9LHmfUinvgKuYmWWp5BIyEFvBPuUAy9ibzAYgWEhUhQN8BCb2NALKY4q8wCrG7AAAAAaZmNUTAAAAAMAAAAQAAAAEAAAAAAAAAAAADwD6AAA9MEhDwAAAKhmZEFUAAAABDiNY2CgMTgNxTgBExLbh4GB4SCUxgeMcEkcZmBg+A+lcQETqBoTbJI+UM1ku4AiEATFZIEQBoi//kPZxIAAKEaJBYpACAm24wUSBORVGBgYUqA0BtjKAAmHrXg0f4aq+YxuiAQDIiD/Q/k8DAwMdVDMw8DAkIamJo2QCyYjKZ4MtfErlP8VlzeQw2AlkgErkbyBMwzQgRoDA8N+KMapAQDdvyovpG6D8gAAABpmY1RMAAAABQAAABAAAAAQAAAAAAAAAAAAPAPoAAAZC1N1AAAAsWZkQVQAAAAGOI21kkEOgjAURF9YGBbGtYcwLowrwxk8BMcg3XACD9djGJaujKmLTkMRCiXEl0ympYX8+Xz4M62UpIjWR8DI59inDgzg5CkOwEs+YnMFmzhJOdwAK1UAZ+ANfLRewuJ75QAb/kKRvp/HmggVPxHWsAMu8hEN8JRPUdLnt9oP6HTYRc/uEsCVvnlO+wFGFYRJrKPLdU4FU5HCB0KsEt+DxZfBj+xDSo7vF9AbJ9PxYV81AAAAGmZjVEwAAAAHAAAAEAAAABAAAAAAAAAAAAA8A+gAAPSdgJwAAADDZmRBVAAAAAg4jaWSTQrCMBCFP6NIT5AjCF6gJ6jbUnoCL1biDTyF5AAueoZu3LkSrAtHTEJiIn3wmCTz92YILMQ64++BPTDKXQMH4AbcAZQTvAEasTFo4AqcxeowoAFmsSk1s8M+DChRMEnyFFNQAg10sWSFv49cESPUn+RRWFLE8N2DKe2axaIR/sU25eiAi9gUBt6zDzGnFad13nZCgAr/I1UxBdZRUAMPYV2iIETrdGudd28Hqx8FFHCU8wl4xoJeZnUrSRiyCSsAAAAaZmNUTAAAAAkAAAAQAAAAEAAAAAAAAAAAADwD6AAAGe6xwAAAALtmZEFUAAAACjiNpZJBCsIwEEWfpUsPULoSl55Beh4J7nqCHkDceR3pIaSr4Ak8Qq2L/khomlrig+FPhszwJy3EqYCHolq4F6UDBkWnWgbspN+CT7EwMAPuwFM67aUAem/IdIW952jQOeCXg1bN7ZyDNQRvsEkYkgNG+S1XcpHWKwacgatzlLLH2z/8vUJCf5wSaKQxToCVBjSM37jxaluFw+qOXeOgBF4KVzNqNkH3DAfGX7tXnsRREeUD4f8lQGjw+ycAAAAaZmNUTAAAAAsAAAAQAAAAEAAAAAAAAAAAADwD6AAA9HhiKQAAAJ9mZEFUAAAADDiNtZDLCcMwEEQfIUcXoDpCKgg6qIRUEtKB6wg6poDgalyFTj7YBw+2QyRlCc6DYVm0n9FCGQc8JFepWzgBN0WACIxS/NZ8BgYVD8pzA1ogKb5x3xSPyp0a4+YLSe/J4iBH0QF83uCvXKSFq2TBs97KH/Y1ZsdL+3IEgmJt86u0PTAfJlQGdKrprA6ekslBjl76mUYqMgFhpStJaQVr0gAAABpmY1RMAAAADQAAABAAAAAQAAAAAAAAAAAAPAPoAAAZshBTAAAAu2ZkQVQAAAAOOI21kCEOwkAQRR8rKkkFCtmjkJ4ARTgBArViT4LjLJwBgUZUr8NBQlrR38Am3XYEvOTnT7PzuzO7IE8BHFWfgNdELwBLYCMH8EAr+VzIyUvgBlzkZaZ/D1zlCfXXba2+C93sVaNwK08ogUaHzcQEu9wE0O9e83kDEw7YAhG4K/ww5CoJFB52j8bwU6rcTLOJYYWo2kKywk9Zz5yvgCAfDb9nfhLoHztYJzhIpgnGOEv/owMnkSfarUXVlAAAAABJRU5ErkJggg==\') no-repeat center center; }\n\
\n\
/* Plugins */\n\
/**\n\
 * Text alignment plugin\n\
 *\n\
 * @author David Neilsen <david@panmedia.co.nz>\n\
 */\n\
.ui-editor-align-left-button .ui-icon {\n\
  filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=85);\n\
  opacity: 0.85;\n\
  background: url(\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAItJREFUeNpi/P//PwMlgImBQsACN4mJqRFIaQExIxQzYWEzQfHlf//+lYL0McK8ADSAJJuBBqC6AAjWYrEN2VYPbAZR1QUb0WxEZmPD1lR3wTYCttpSJQxg6mE0sgt2E/AzCLMBMTsQcwCxAskuQE722FwwEYiNsNjKClR8EUjH4w2DActMFBsAEGAAnS84DrgEl1wAAAAASUVORK5CYII=\') 0 0; }\n\
\n\
.ui-editor-align-left-button:hover .ui-icon {\n\
  filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=100);\n\
  opacity: 1; }\n\
\n\
.ui-editor-align-right-button .ui-icon {\n\
  background: url(\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAIxJREFUeNpi/P//PwMlgImBQsACN4mJqRFIaQExIxQzYWEzQfHlf//+lYL0McK8ADSAJJuBBqC6AAvYjGYrMhuEHanugo0EbETH1jQPg714bGcGYhOqu2A3AT+DMBvQQnYgzQHECiS7ADnZw9j4wmA61J+sQMUcUFtBtrMC8TEg9kNxwYBlJooNAAgwAJo0OAu5XKT8AAAAAElFTkSuQmCC\') 0 0; }\n\
\n\
.ui-editor-align-right-button:hover .ui-icon {\n\
  filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=100);\n\
  opacity: 1; }\n\
\n\
.ui-editor-align-center-button .ui-icon {\n\
  background: url(\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAI1JREFUeNpi/P//PwMlgImBQsACN4mJqRFIaQExIxQzYWEzQfHlf//+lYL0McK8ADSAJJuBBqC6AAlswGErjO2KrJiqLtiIw0Zc2JpmYbCTgM2WFIUBTD2MRnbBbgI2gzAbELMDMQcQK5DsAuRkj80FMDAFiI2RbGUFKuaA2noGiEOwhsGAZSaKDQAIMAB/BzgOq8akNwAAAABJRU5ErkJggg==\') 0 0; }\n\
\n\
.ui-editor-align-center-button:hover .ui-icon {\n\
  filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=100);\n\
  opacity: 1; }\n\
\n\
.ui-editor-align-justify-button .ui-icon {\n\
  background: url(\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAJFJREFUeNpi/P//PwMlgImBQsACN4mJqRFIaQExIxQzYWEzQfHlf//+lYL0McK8ADSAJJuBBqC6AAjWYrEN2VZkNgg7Ut0FGwnYiI6tqe6CbUTYCsPMQGxCdRfsJsJmNqCF7ECaA4gVSHYBcrKHsZFdMBGIjbDYygpUzAG1FWQ7KxAfA2I/FBcMWGai2ACAAAMAvPA4C7ttvJ4AAAAASUVORK5CYII=\') 0 0; }\n\
\n\
.ui-editor-align-justify-button:hover .ui-icon {\n\
  filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=100);\n\
  opacity: 1; }\n\
\n\
/**\n\
 * Basic text style plugin\n\
 *\n\
 * @author David Neilsen <david@panmedia.co.nz>\n\
 */\n\
.ui-editor-text-bold-button .ui-icon {\n\
  filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=85);\n\
  opacity: 0.85;\n\
  background: url(\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAKRJREFUeNpi/P//PwMlgImBQjDwBrCgmMbEpA2kGnGofQ3E9UD86t+/fzhdcBWIpwExMxQ3AHEIEK8BYgkgdsLrAih4A8SsaBYwQcWYiDGAEcmAbiwuJBiIIAPYoLgfiMuBeBmUXwHEXIQMYEIy4BUQXwDiy1C+HBBrEPKCDBCzwwwDpVRGRkZksU8ozkVOykCFVkBqOZ5oB3lpAoqe0bzAABBgANfuIyxmXKp/AAAAAElFTkSuQmCC\') 0 0; }\n\
\n\
.ui-editor-text-bold-button:hover .ui-icon {\n\
  filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=100);\n\
  opacity: 1; }\n\
\n\
.ui-editor-text-italic-button .ui-icon {\n\
  filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=85);\n\
  opacity: 0.85;\n\
  background: url(\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAH1JREFUeNpi/P//PwMlgImBQjDwBrBgmMgEN1MbiBvRpOv//ft3FUUEFIjImJGRERnrAPF6IO6BiaGrZyLCi6xAvJDcMLAA4j9AfJlcA/yBeCe5sWAExAJAfIKkWIAFJBAUATE7kM+M143ooQoEVkD8EA1b4Yy10bzAABBgAC7mS5rTXrDAAAAAAElFTkSuQmCC\') 0 0; }\n\
\n\
.ui-editor-text-italic-button:hover .ui-icon {\n\
  filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=100);\n\
  opacity: 1; }\n\
\n\
.ui-editor-text-underline-button .ui-icon {\n\
  filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=85);\n\
  opacity: 0.85;\n\
  background: url(\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAKZJREFUeNpi/P//PwMlgImBQkCxASwopjExhQGpMCSheijdiCz279+/q3AeKAxgmJGREYSdgHgdlIaJ6SCLIevB5oXXUJe9RhK7gkUMZxgwAjEzlEYG2MRwGsCKRTErKQawYFHMQqwBn6G2qSCJGULFPmPYhpwSgdEIY6YCcTKa2rlAPBvEAEYjdgNAUYRMowOYWmQ9LFjUPSGQP2RwemFoZiaAAAMAlEI7bVBRJkoAAAAASUVORK5CYII=\') 0 0; }\n\
\n\
.ui-editor-text-underline-button:hover .ui-icon {\n\
  filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=100);\n\
  opacity: 1; }\n\
\n\
.ui-editor-text-strike-button .ui-icon {\n\
  filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=85);\n\
  opacity: 0.85;\n\
  background: url(\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAL5JREFUeNpi/P//PwMlgImBQkCxASwopjHBzbMB4nQg5oTyrwKxNhAXAfGjf//+EXRBFhC/BOI0KAapYwZpxusCJPASquEdlD8FiHWwKWREjgUkL4gDcQ0QfwfiXqiBcIDsBXQD9hATcEADXOAckAEwzMjIiI4lgHgiEM8GYkmYOLIeXAZ4I2sA4vlQjGEArkBsAeJzQAUVYH8yMnIAKTmC6QAaHhpALALEPCBDoOJfgFQ5wVgYmnmBYgMAAgwAEGZWNyZpBykAAAAASUVORK5CYII=\') 0 0; }\n\
\n\
.ui-editor-text-strike-button:hover .ui-icon {\n\
  filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=100);\n\
  opacity: 1; }\n\
\n\
.ui-editor-text-sub-button .ui-icon {\n\
  filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=85);\n\
  opacity: 0.85;\n\
  background: url(\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAKZJREFUeNpi/P//PwMlgImBQjDwBrDATWJCMWs6lM7Ep/nfv39YXSAPxL+AWALKJtkLLkB8EohZoWySDbAH4uNQQ+xJNUAJiH8DMT8QPwZiWagYDEwA4v1QGgJACQmEGRkZQTgXiI+i4VyoHAy7AfEaEBucCNEM2AzEKkiKu6BiYMuAdAYQLwZiKQwDgGAVED+E0iBgBeUjiy1HErMCWzyaFxgAAgwA5Gw9vTeiCqoAAAAASUVORK5CYII=\') 0 0; }\n\
\n\
.ui-editor-text-sub-button:hover .ui-icon {\n\
  filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=100);\n\
  opacity: 1; }\n\
\n\
.ui-editor-text-super-button .ui-icon {\n\
  filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=85);\n\
  opacity: 0.85;\n\
  background: url(\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAALdJREFUeNpi/P//PwMlgImBQjDwBrCgmMaEYt50KJ0JpRuBWBuIrwJx/b9///C6QB6IfwGxBJQNAvVAPAkqRtALLkB8EohZoWwQiAbiICCuI8YAeyA+DjXEHiqmD8SaQLwIysYMAyhQAuLfQMwPxI+B2AkqVkZsLHgDsQYQTwXiVCBmg4phB6CUCMOMjIwgvBmIVaBsEO6CijEgY5geFAOAYBUQP4TSIGAF5SOLoVjMOJoXGAACDACTRz3jjn6PnwAAAABJRU5ErkJggg==\') 0 0; }\n\
\n\
.ui-editor-text-super-button:hover .ui-icon {\n\
  filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=100);\n\
  opacity: 1; }\n\
\n\
/**\n\
 * Blockquote plugin\n\
 *\n\
 * @author David Neilsen <david@panmedia.co.nz>\n\
 */\n\
.ui-editor-quote-block-button .ui-icon-quote {\n\
  filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=85);\n\
  opacity: 0.85;\n\
  background: url(\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAGVJREFUeNpi/P//PwMlgImBQjAcDWBhYZEA4r1AHA/EKHxiXQBS+BKIF+LgEzTAG4h3I0UvOh+/AUCFbECcDmROA2lC5mMzgAWLGDuUtsTBJ+iFeUDMC6Wx8VEA42hSptwAgAADAO3wKLgntfGkAAAAAElFTkSuQmCC\') 0 0; }\n\
\n\
.ui-editor-quote-block-button:hover .ui-icon-quote {\n\
  filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=100);\n\
  opacity: 1; }\n\
\n\
/**\n\
 * Clean content plugin\n\
 *\n\
 * @author David Neilsen <david@panmedia.co.nz>\n\
 */\n\
.ui-editor-clean-button .ui-icon-clean {\n\
  filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=85);\n\
  opacity: 0.85;\n\
  background: url(\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAABNVBMVEUAAAAAAAAgSocgSocgPnAAAABxcXFPT09YWFggSocgSocoToUbPXgSN3kyYZw0ZqT///8iUZkgSoc1Z6UiUJaJrNkwXpZIeLiOvO03a6s4b7JekNUjUpqCp9eNr9pSjeAwX5g2aqquxuV8otPB1euOsNv8/f6gveFgkdVnkMmbuuVfk9lkk9fK3Pbs8vmWtd5Vjs98odCHqNWkv+Jzms6Qt+xnmNuzyudVidS90u6hwe5mmuQtXKCow+OqxepNg82Xtd3C1Ox0m89vl8x3oNl4n9NSjuDi7PqlxO+MtOyWtt2fwO60y+dUjt5zm8/L2+9qneT3+f7g6/qDrelRi95snuWowuSfvOGPr9uwyeqRsdqUs9qat92OrtmDptN5ns9Rh8hqk8uXuehwnt1vl83e6vmZu+gBAK69AAAADXRSTlMbAKM01gogSSmAy7W1OP1GaAAAAM1JREFUeF5VzNN2A1EAQNE7TIrrsSe0Udu2zf//hHZWk672PO6HAySR/UmUwBjT9XyzeJlZuGpe60wE474TxxghhHEcOz4DzLcxRoZhJGT/AOcoiiKEOE9AZEGw291fOcpNdZeD74fEqKZ5lFLP0+YplIDAzBfXrTQKNyW3bEIhgV51QD5fyVv1fQir0zOzcxfW4tLaCGqkHoYWWR/BxubW9k5/7+PgcAjZ8JicnJKz82wC6gRstTu3d/cPj0/PcFIF6ZQMf5NTaaCAfylf1j4ecCeyzckAAAAASUVORK5CYII=\') 0 0; }\n\
\n\
.ui-editor-clean-button:hover .ui-icon-clean {\n\
  filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=100);\n\
  opacity: 1; }\n\
\n\
/**\n\
 * Clear formatting style plugin.\n\
 *\n\
 * @author David Neilsen <david@panmedia.co.nz>\n\
 */\n\
.ui-editor-clear-formatting-button .ui-icon {\n\
  filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=85);\n\
  opacity: 0.85;\n\
  background: url(\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB9wGGxcPH7KJ9wUAAAEKSURBVDjL3ZG9SgNBFIW/I76D1RIEazEIFitWNguxUPANUkUIKG4jYiEBC7WwUFJZiNssFvoOFipMFx/AoIVVEAvxB7w2MyBhV5Iq4IHLPecy9zBzBv4nJLUltQc5O1awXAE+gAnPhzMAFoE7YNzzoQ0WgBvg1vPBDSRNAl9m9gC4ebPpc+jkkADkkOTggi4KryFpV9KMpHgfXr/T1DJwGWxn4IIuM7iQdB1qDu73oPder9spuNDPYLZoeUrSZd9saQUej6DzUqvZCbhj2Pjr+pu/ZzuwnMLbc7Vqh+BCPyjIIAaefMVhuA69bhTZGnyuwlULXDeKrFWWQT+akDTAbfk3B90s+4WR4Acs5VZuyM1J1wAAAABJRU5ErkJggg==\') 0 0; }\n\
\n\
.ui-editor-clear-formatting-button:hover .ui-icon {\n\
  filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=100);\n\
  opacity: 1; }\n\
\n\
/**\n\
 * Click to edit plugin\n\
 *\n\
 * @author Michael Robinson <michael@panmedia.co.nz>\n\
 * @author David Neilsen <david@panmedia.co.nz>\n\
 */\n\
.ui-editor-click-to-edit-message {\n\
  padding: 10px;\n\
  border: 1px solid #D4D4D4;\n\
  font-size: 13px;\n\
  z-index: 4000;\n\
  color: #000;\n\
  text-shadow: none;\n\
  -webkit-pointer-events: none;\n\
  -moz-pointer-events: none;\n\
  pointer-events: none;\n\
  -webkit-border-radius: 5px;\n\
  -moz-border-radius: 5px;\n\
  -ms-border-radius: 5px;\n\
  -o-border-radius: 5px;\n\
  border-radius: 5px;\n\
  background: url(\'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4gPHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJncmFkIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgeDE9IjUwJSIgeTE9IjAlIiB4Mj0iNTAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iI2YyZmZmMiIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iI2RhZjJkNyIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxyZWN0IHg9IjAiIHk9IjAiIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JhZCkiIC8+PC9zdmc+IA==\');\n\
  background: -webkit-gradient(linear, 50% 0%, 50% 100%, color-stop(0%, #f2fff2), color-stop(100%, #daf2d7));\n\
  background: -webkit-linear-gradient(top, #f2fff2, #daf2d7);\n\
  background: -moz-linear-gradient(top, #f2fff2, #daf2d7);\n\
  background: -o-linear-gradient(top, #f2fff2, #daf2d7);\n\
  background: linear-gradient(top, #f2fff2, #daf2d7);\n\
  -webkit-box-shadow: 0px 2px 10px #cccccc;\n\
  -moz-box-shadow: 0px 2px 10px #cccccc;\n\
  box-shadow: 0px 2px 10px #cccccc;\n\
  -webkit-transition: opacity 0.5s;\n\
  -webkit-transition-delay: 0s;\n\
  -moz-transition: opacity 0.5s 0s;\n\
  -o-transition: opacity 0.5s 0s;\n\
  transition: opacity 0.5s 0s;\n\
  filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=0);\n\
  opacity: 0; }\n\
\n\
.ui-editor-click-to-edit-visible {\n\
  filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=100);\n\
  opacity: 1; }\n\
\n\
.ui-editor-click-to-edit-highlight {\n\
  cursor: pointer;\n\
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
.ui-editor-color-picker-basic-select .ui-editor-selectmenu-menu {\n\
  min-width: 100px; }\n\
\n\
.ui-editor-color-picker-basic-select span {\n\
  padding-left: 2px; }\n\
\n\
.ui-editor-color-picker-basic-swatch {\n\
  width: 16px;\n\
  height: 16px;\n\
  float: left;\n\
  margin-top: 2px;\n\
  border: 1px solid rgba(0, 0, 0, 0.2); }\n\
\n\
/**\n\
 * Debug plugin\n\
 *\n\
 * @author David Neilsen <david@panmedia.co.nz>\n\
 */\n\
.ui-editor-debug-reinit-button .ui-icon-reload {\n\
  filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=85);\n\
  opacity: 0.85;\n\
  background: url(\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAqBJREFUeNqkU01PE2EQnrfdtmyLpbRNA/ULGyAhRi+NHkTk5sEEiRyMEi+evHszJh5I/AF613ho9EIwhEiMB4kSjQcWSDxgIAhJoZV26dd2t/v17jqzkoLGG5vM7rvzzPPsfOww13XhOJdAt8vPN0EIBEAQBPD5/UHGWALdnWgW2iO07H+40sL91APhH2ev4HOH+tJiZzoZCia7guXpj8XsnevprGX9yVQMM8i9K0jA2GI7A+9y3Uwo4I6Mj6aijToHzl2nXrNk27bBMDg0FQ7dcQFezeYljH6PlmsLuI4T8zF+e+zqqZ69ggaKZrH13WaxXDcUwm2LQ6xbgOKOCreu9WTfLuQVy3bSCBV8XoBpjmR6xYvFfKNflpuZTyuF1q+y8sHhXLINA7q6g/Byek06ERWgUlJh8EykHzkTxPUETMMYTcWCQ/Wqllnb3hct0/yM01nWVZUwePZiWcLnt0Vpd1NvmZCMBuL4PtwuwdL1S37GMqpuQaFUL+Mk5rllgeM41BuqeZH5/bmNzdJSbzQEiUggjJyBtgCqRVTDjqrc9c6YOjbRhlCHSON9YKMYGQpDrWVDh2F7mR2WoOsbezVdU30CdMXEGNY3abZ0rLcEVVkGpVqlPk0SRjEUS5y2gGUYX7byckURgnB66OxJ7MFD7MHkAQZ0Jh9hFEOxxDkUMM2ZrR/bMo+IsA3hjuzN4fPpvtQUjneJjM7kI4xiKJY4xGW0C9F7bwDrHvNHwk8T4zcutGz0hRjEQp4+1AwHGoYLosBgf3b+O1e1x9iPuUbu7uGfiEJzerUGu6+npwKDA8lm5lx8J54Ie2lWapr7c6tSWd+QwTSfYGPn/lqmoyKOpkn2yuoErKxeQdfgAbSO9hWXbAa/XDjKYcdd598CDAAkzn7JYhVZYAAAAABJRU5ErkJggg==\') 0 0; }\n\
\n\
.ui-editor-debug-reinit-button:hover .ui-icon-reload {\n\
  filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=100);\n\
  opacity: 1; }\n\
\n\
.ui-editor-debug-destroy-button .ui-icon-close {\n\
  filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=85);\n\
  opacity: 0.85;\n\
  background: url(\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAtFBMVEX///+nAABhAACnAACjAACCAACgAACHAACjAAByAAB1AAByAACDAACnAACCAACHAACgAACNAACbAACXAACMAACSAABfAACYAACRAACjAACbAAChAACqAACNAACcAACHAACqAADEERGsERHQERG+NjaiERHUTEzYERG4ERGlFBSfFRX/d3f6cnK0JSWoHh7qYmLkXFyvFRXmXl7vZ2fNRUX4cHDXT0/+dnbbU1O3Li7GPT26MTG2f8oMAAAAIXRSTlMASEjMzADMzAAASMxIAMwAAMzMzEjMzEhISABIzABISEg/DPocAAAAj0lEQVR4Xo3PVw6DMBBF0RgXTO+hBYhtILX3sv99RRpvgPcxVzp/M5syb7lYepxDABDeYcQ5wg+MAMhr3JOyJKfxTABqduuvjD37O6sBwjZ+f76/7TFuQw1VnhyGYZPklYagKbKLlDIrmkBDGq1hUaqhM4UQJpwOwFdK+a4LAbCdlWNTCgGwjLlhUQqZ8uofSk8NKY1Fm8EAAAAASUVORK5CYII=\') 0 0; }\n\
\n\
.ui-editor-debug-destroy-button:hover .ui-icon-close {\n\
  filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=100);\n\
  opacity: 1; }\n\
\n\
/**\n\
 * Dock plugin\n\
 *\n\
 * @author David Neilsen <david@panmedia.co.nz>\n\
 */\n\
.ui-editor-dock-button .ui-icon-pin-s {\n\
  filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=85);\n\
  opacity: 0.85;\n\
  background: url(\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAbFJREFUeNpi/P//PwMlgAVEPGNiIqTOBojz/zIwTHrPwHD4BZDzGGhxMhAzEWlRvtTy5SE/GRiKge61R5YgyoB/IHVPnzIoTprk/52BoRJoiDNBA5BCxuY3UN2vz58Znu7ZwyAaHOz+8f//RqC8OzEuAPtdcfbsgM937zJ8+fKFgePHDwa3sDBroKGt8EBEAo1ArAV1ARPQucwqs2f7vz14kOHH378MF/buPQ4S+wXEQPkauAG3EFHp7bBihTHDs2cMf4E2ffvwgQGmeeuyZWf+MDA0ATXs+I8eiP+gGBhNNTsjIs7+5+Vl+HTrFsOry5cZXr56xXB02bKjQM21QCU7sKaDRYiA2wE0RPJnamq2VVGR8adr1xi4uLkZPjMwsDJCNf/HagAjI8SA//95gRRb5pEjxnttbM6aeHsb87CwMED9DAZ/0QxAjgVmRkZGj+vXr0+wt7evWc3ENPfI1q1n2djYGP4TSsqMEBfYLV26tExXVzcfyF8NdM17oG33V69e3QKUO0vIAF1PT8+Y2NhYUDRuh7n0PyTEdzAQ4YKYHTt2TAEyz5OaGxkpzc4AAQYAvlOuK2pYar0AAAAASUVORK5CYII=\') 0 0; }\n\
\n\
.ui-editor-dock-button:hover .ui-icon-pin-s {\n\
  filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=100);\n\
  opacity: 1; }\n\
\n\
.ui-editor-dock-button .ui-icon-pin-w {\n\
  filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=85);\n\
  opacity: 0.85;\n\
  background: url(\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB9wFFgA2AnOoAZ4AAAH4SURBVDjLtZNNaxNhFIXPfefNJJlkppFI09Ca1FiRMiDduCjWQltdtILdu1DcSkpx7UL6A1zGH+BKEFy5MkhErRvpwo+NSDEaaYyZSZNJJslkPl43XQQaaUA8u3M5PFwu5wL/KBo1FEC4DJALiN2jjAWIbcA5EVABzotkUu+ZJmvLsmQwJtcHA2oHQc8FXm8D9eE8HzafgThPpS5H19Zux4kmIqbJWL3OT/u+9LNWK1er1V8PgMMdwBsJ8AARtFoD6na1qK7PubFYTOOc9RqNQxEEX1ygswP4Jx6mDNw3Fhc/WVtb4uPy8uAx0YeHwMaoLBs1DBE9kzTtIJLJ4FQ6LQnghZVMFscCCIB8IeKB7/e6lYpjNZs2V1WeNk02FuApwAJA8xwnFHgeSUL4rmVJ3yIRfyzAFWA+Oj29EZqcvODYNveJEloisZnq9++NAkjD5gCY59nsnfjq6iafnT3bNQzJrtWQzeUm+p3OxQXbll8Cb45tYBGRKcucEd2Irq/fDC8tzSm5nKRMTSEUi3lcUXB1ZSV1RlVvPWLs2rEiaUIIDAbee+AtisWMUyqpRhAoiq7rLdtudvf2fsQlqWe02yQDr/7axEvAbml///uTcHjhqyxncjMz5zqO87th28+vu+47GWjfBdyxP61QKFA+nydVVQn/S38ATpHDEx6slP8AAAAASUVORK5CYII=\') 0 0; }\n\
\n\
.ui-editor-dock-button:hover .ui-icon-pin-w {\n\
  filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=100);\n\
  opacity: 1; }\n\
\n\
/**\n\
 * Dialog docked to body\n\
 */\n\
.ui-editor-dock-docked {\n\
  z-index: 10000; }\n\
  .ui-editor-dock-docked .ui-editor-toolbar-wrapper {\n\
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
  .ui-editor-dock-docked .ui-editor-toolbar {\n\
    text-align: center; }\n\
  .ui-editor-dock-docked .ui-editor-path {\n\
    position: fixed;\n\
    bottom: 0;\n\
    left: 0;\n\
    right: 0; }\n\
\n\
.ui-editor-ios .ui-editor-dock-docked .ui-editor-path {\n\
  display: none; }\n\
\n\
/**\n\
 * Dialog docked to element\n\
 */\n\
.ui-editor-dock-docked-to-element-wrapper {\n\
  font-size: inherit;\n\
  color: inherit;\n\
  font-family: inherit; }\n\
\n\
.ui-editor-dock-docked-to-element-wrapper .ui-editor-wrapper {\n\
  /* Removed fixed position from the editor */\n\
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
  display: -webkit-box;\n\
  display: -moz-box;\n\
  display: -ms-box;\n\
  display: box;\n\
  -webkit-box-orient: vertical;\n\
  -moz-box-orient: vertical;\n\
  -ms-box-orient: vertical;\n\
  box-orient: vertical; }\n\
  .ui-editor-dock-docked-to-element-wrapper .ui-editor-wrapper .ui-editor-toolbar {\n\
    margin: 0;\n\
    z-index: 2;\n\
    -webkit-box-ordinal-group: 1;\n\
    -moz-box-ordinal-group: 1;\n\
    -ms-box-ordinal-group: 1;\n\
    box-ordinal-group: 1; }\n\
  .ui-editor-dock-docked-to-element-wrapper .ui-editor-wrapper .ui-editor-toolbar .ui-widget-header {\n\
    border-top: 0;\n\
    border-left: 0;\n\
    border-right: 0; }\n\
  .ui-editor-dock-docked-to-element-wrapper .ui-editor-wrapper .ui-editor-path {\n\
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
  .ui-editor-dock-docked-to-element-wrapper .ui-editor-wrapper .ui-editor-messages {\n\
    margin: 0; }\n\
\n\
.ui-editor-dock-docked-element {\n\
  /* Override margin so toolbars sit flush next to element */\n\
  margin: 0 !important;\n\
  display: block;\n\
  z-index: 1;\n\
  -webkit-box-ordinal-group: 2;\n\
  -moz-box-ordinal-group: 2;\n\
  -ms-box-ordinal-group: 2;\n\
  box-ordinal-group: 2; }\n\
\n\
/**\n\
 * Messages\n\
 */\n\
.ui-editor-dock-docked .ui-editor-messages {\n\
  position: fixed;\n\
  top: 0;\n\
  left: 50%;\n\
  margin: 0 -400px 10px;\n\
  padding: 0;\n\
  text-align: left; }\n\
  .ui-editor-dock-docked .ui-editor-messages .ui-editor-message-wrapper {\n\
    width: 800px; }\n\
  .ui-editor-dock-docked .ui-editor-messages .ui-editor-message-wrapper:first-child {\n\
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
.ui-editor-embed-button .ui-icon-youtube {\n\
  filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=85);\n\
  opacity: 0.85;\n\
  background: url(\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAxlBMVEX////////fNzfaMTHVLCzKISHFGxvvR0flPDzpSEjdMTH4Y2PaKyvtTk7PJibXIyOnLi7lQECkKyvSHR3mPj6eJCSUGhqRFxfqQkL0XFziOTmOFBSBBwehKCiHDQ3PFRWaISGXHR3wVlaECgqqMTGLEBDGHR365eW1ICDaXFz139/LDg7NLi6tNDTSKSnMNzd9AwP1TEy/Fhbwxsbqv7+7EhKzFBS6EBDonZ3akJDkhISxBwf8a2vLIiLPcHD88fH67+/fYGAnLmvBAAAAAXRSTlMAQObYZgAAAJtJREFUeF5Vx0WShFAUBMB631F3afdxd7v/pQaiN5C7BK4mgM3nxAahczfihIgrrfVTqs+qGN2qLMvHwy4tB6sOmWeMIXp7/jI9L8PCYowR0e/3xzVj1gLLiHNOg9OR82iJvBZC0GD/J0Sdo7B93+/78+737AKNK6Uker2UA7fBNlBKPdyos2CLWXI/ksywnr+MzNdoLyZa4HYC/3EAHWTN0A0YAAAAAElFTkSuQmCC\') 0 0; }\n\
\n\
.ui-editor-embed-button:hover .ui-icon-youtube {\n\
  filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=100);\n\
  opacity: 1; }\n\
\n\
.ui-editor-ui-embed .ui-dialog-content .ui-editor-embed-panel-tabs {\n\
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
  .ui-editor-ui-embed .ui-dialog-content .ui-editor-embed-panel-tabs > div {\n\
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
    .ui-editor-ui-embed .ui-dialog-content .ui-editor-embed-panel-tabs > div > p:first-child {\n\
      padding-top: 10px; }\n\
    .ui-editor-ui-embed .ui-dialog-content .ui-editor-embed-panel-tabs > div textarea {\n\
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
.ui-editor-float-left-button .ui-icon-float-left {\n\
  filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=85);\n\
  opacity: 0.85;\n\
  background: url(\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAS5JREFUeNpi/P//PwMlgImBQsACY1zaIH4A6Bp7dAUzV31jnLHy22YgkxFqIQhf/vfvXymKAQ8eidtra35lYAQqY+FgZWBmZ2X49fk7AxvbX6DsN1+CLlgwn5khMECAwcLiL4OogiIDj6QEw9uLZ4AGfAVJ70BzAQg7ohigrnaP4cEDLoY3bzkYzL6/ZVA34ma4ev07w/sPv0HSHgRdoKICUvgR6IWPDK8evWb49+8iw/1bfxhevwYbsBfNdhC2BkkwwqLRxRhuFgM3HyMDrwAjw8vH/xj2nvuH1WZgIDKgGMDExLQNiz9xYWagASboBpAU/zAXsCCJ7SbCZjaghexAmgOIFUh2AXKyh7GRXTARiI2w2MoKVMwBtRVkOysQHwNiPxQXDFhmotgAgAADAKYzbYynfqX2AAAAAElFTkSuQmCC\') 0 0; }\n\
\n\
.ui-editor-float-left-button:hover .ui-icon-float-left {\n\
  filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=100);\n\
  opacity: 1; }\n\
\n\
.ui-editor-float-none-button .ui-icon-float-none {\n\
  filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=85);\n\
  opacity: 0.85;\n\
  background: url(\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAkFBMVEUAAAABAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEAAAABAQEAAADRrxbRsBYBAQEBAQEBAQEBAQEBAQEBAQEBAQEAAAAAAAAAAACcegnCrQ6ffgqukQv+/GixkS3duyLhwyfkyizevSNRMDCigDLauC/y41DcuiLrzTTQrhWCYBiObSDErz3r4VvApCt4Vg6dewnDaH3NAAAAGHRSTlMAycfDxcu9v8HYu+DAwIm3uZnRkdDn7LIyy/h+AAAAWklEQVR4Xp2KRwqFMBQAYzfGXmPtvfx//9spgvAWQcRZzgx6gz6dGEDkQ1FWNRBN2/XZCMRvXtZtB4LSfxon6AHTsjVZUQWR5xz2cWfJxYR9eFf2MQnCCH3hAIfwBUXJe8YuAAAAAElFTkSuQmCC\') 0 0; }\n\
\n\
.ui-editor-float-none-button:hover .ui-icon-float-none {\n\
  filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=100);\n\
  opacity: 1; }\n\
\n\
.ui-editor-float-right-button .ui-icon-float-right {\n\
  filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=85);\n\
  opacity: 0.85;\n\
  background: url(\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAS1JREFUeNpi/P//PwMlgImBQsACN4mJqRFIaQExIxQzZYRzBaaHcWE4kZGJ8aCe/0sHFAOAoB5d4avXfAwPH4swaGt+ZWAEGsnCwcrAzM7K8Ovzd3sMFwDBWpjNMPrK5b++C94yMwQGCDBYWPxlEFVQZOCRlGB4e/EMAzYDgtFdICr6kUFd7QfDgwdcDG/ecjCYfX/LoG7EzXD1+ncGeyNMAzYiuQDsCmHhf54qKr+BzI9AL3xkePXoNcO/fxcZ7t/6wwDzAyMsGoGBiDWUnQwR4tx8jAy8AowMLx//Y9h95g+GAdvQXIAPM//798+EKBfgAkADMMJgNxE2swEtZAfSHECsQLILkJM9jI3sgolAbITFVlagYg6orSDbWYH4GBD7obhgwDITxQYABBgAdBpg+9sXURwAAAAASUVORK5CYII=\') 0 0; }\n\
\n\
.ui-editor-float-right-button:hover .ui-icon-float-right {\n\
  filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=100);\n\
  opacity: 1; }\n\
\n\
/**\n\
 * Font size plugin\n\
 *\n\
 * @author David Neilsen <david@panmedia.co.nz>\n\
 */\n\
.ui-editor-font-size-inc-button .ui-icon-font-size-inc {\n\
  filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=85);\n\
  opacity: 0.85;\n\
  background: url(\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAOhJREFUeNpi/P//PwMlgImBQkCxASxgU5gwzJkOpTORBZ2ilzO8+MjFwMIixnBhnTlOF8gD8U8gFoey4UBSyZooLzgD8Umo65xhgsYu5USHgS0QHwfiE1A2TtuxGaAIxL+B+AEQnwFiaagYg6Qi2AAHIP4PpbEa4AHEz4HYAIi/QL3hgSS/H4gfQmlELCAHNBBLQGlksenP7x9l4Bc3YMTnBRWogbZIuBOIZUFyW2b5EQwDVyA+giYPcionSA6U5Jc0yTK8vrUcVQU0L1gB8RMotkKSXoMkXgQT5BM3A+sDYcahn5kAAgwArro7Z1GYijsAAAAASUVORK5CYII=\') 0 0; }\n\
\n\
.ui-editor-font-size-inc-button:hover .ui-icon-font-size-inc {\n\
  filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=100);\n\
  opacity: 1; }\n\
\n\
.ui-editor-font-size-dec-button .ui-icon-font-size-dec {\n\
  filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=85);\n\
  opacity: 0.85;\n\
  background: url(\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAKxJREFUeNpi/P//PwMlgImBQjAMDGBBMY0Jbp4JEFcAcQcQnwEJpLa/Zfj27SvD+fPnGVhYxBgurDPH6wI9IP4DpRmMXcpJ9oIZELcBcRiaOCjOH0BpnAYoAbE6EE8EYnYgtjq7pxMm5wjE8lAapwFOQLwFiIuB+AQ0PBi2zvYHUQeAmBFKYxoATJWWQOwLxJJAfA6I5YE4FyT+9O5hBiSXwAHjaFKm3ACAAAMA85o8WKYZErQAAAAASUVORK5CYII=\') 0 0; }\n\
\n\
.ui-editor-font-size-dec-button:hover .ui-icon-font-size-dec {\n\
  filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=100);\n\
  opacity: 1; }\n\
\n\
/**\n\
 * Show guides plugin\n\
 *\n\
 * @author David Neilsen <david@panmedia.co.nz>\n\
 */\n\
.ui-editor-show-guides-button .ui-icon-pencil {\n\
  filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=85);\n\
  opacity: 0.85;\n\
  background: url(\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAHZJREFUeNpi/P//PwNFAGQAIyMjDK9BYqNgXHqZ0MSYcFmEyxBGsClMTGS5+t+/fxg2biLGAGTXoBvATGoYkuUFGMDmhd2kGjL4vHCUUi9cIjcpnwPi2UAsBaXPQZPwOXxscD5Cy0xLSbUc3YDnJLue0uwMEGAA2O1APJOrHFQAAAAASUVORK5CYII=\') 0 0; }\n\
\n\
.ui-editor-show-guides-button:hover .ui-icon-pencil {\n\
  filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=100);\n\
  opacity: 1; }\n\
\n\
.ui-editor-ui-show-guides-visible * {\n\
  outline: 1px dashed rgba(0, 0, 0, 0.5); }\n\
\n\
/**\n\
 * History plugin\n\
 *\n\
 * @author David Neilsen <david@panmedia.co.nz>\n\
 */\n\
.ui-editor-undo-button .ui-icon-undo {\n\
  filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=85);\n\
  opacity: 0.85;\n\
  background: url(\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAe1JREFUeNrEUzFrFEEU/mazu7d3x8U9g0ROwkHEwrSrNmksJBxok1RRwUIEz0awFStZoqQw5B9ok1jYiRDBwl4PSaFJVLCMMfHWS7zb3ZndGd9ssgdXiVzhwGNnH+/75n3vm2FKKQyzDAy5zKmHLRSKRdiOA6tQgGlZDcrPUme3dcFBEPSLlZQQcZyFTFN8WZiGOUCnVCMRws9/4zD8BwkEFpz7N66c8vQJUbeLNEn+LuEQqxo8jv0716e8/f0UPIp0+n1OTbFLsUF1z+n7boAgA0eRf/em521tdeE4BuYunfa0OYehEMUJ3wt6Fza+7s4EkVwh3DJFLyPgYejfa0576+u/MsZe70g/tX8QRujSHDgXtpTpmOvarkjYrZ97Qg/xUTYDOv3B46U3rcnJMqRUUKaBtsXwzWDYJmfax1y0x07gx/FxfLbckd+1Wj0dYddI8vlcwhp1gcUnr/z55mXvbcfA99WXrVwjMwzGHNs0yiWbVSpFXqtVMTFxkrU+zOt55ENc04N7tvTCP9O86mn76D6cIzDSODYRhhUEnXFguy4/bs6gWr1IubN9F3KShHN8Wn6a3QNtZaFU0lvtZXAUm1LK13Jn5z7Vzw0Q9EmE0NvZDNnpoDw6OuC7voFUs0C19Uzif39MQxP8EWAA91//GdkHdYEAAAAASUVORK5CYII=\') 0 0; }\n\
\n\
.ui-editor-undo-button:hover .ui-icon-undo {\n\
  filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=100);\n\
  opacity: 1; }\n\
\n\
.ui-editor-redo-button .ui-icon-redo {\n\
  filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=85);\n\
  opacity: 0.85;\n\
  background: url(\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAd9JREFUeNrEU89LG0EUfjP7KyvEGsRorRhoySGCuSyht0IPgicFQZCcvXsvHoP/Q8FDKZRCpQityKIHvZT2YI6t6MUfCJqQKpt1d7Ozu7N9O9vWhIIUcvDBt/OY4X3z3vfNkjiOoZ+g0GfIyaf46gtQSQJF0wQIvePN5nJiJYS8xmUzDAIz8H1gnQ74npcS3BeubYOm60lqCKQjm/89QhSG0HEcSG6tzo4bAWM1JJntGaE7UNQKcL6EaQkxknQfcS6Imk0GizOTxrvPx7Xf4pvdBAOc85VBnVTLU6OPhx8NZBVZUjmPIYpStNsMGo0I5l8+NT5sfxckggCFAYrFzyaHlo1yoYDdSs2WD9e2A/atC4wFooMkJBT79EqBF88Lxu7eYU0QMN+v5Eey1enSRKF1y6ULFoKFAFUDntMgwpsiDuAEMbgBhydDKmxtH9TRmdWUwPOWSsXi2Fmr7RyfNG6sa9vzbI+FHT+MI3730hbmjIwEcLTxSRSrup5qgH6Wvn39cd76ae9TSndw6wzRQNiSooQxiohjHij4Pqy379PiTMb86wJalL+6ZB+pLK9RSv+x0XddkQfrb9K2VdXssRHZk4M1mRDc6XXWsaw/aT15ibKimN3n5MF/pr4JfgkwANDA599q/NhJAAAAAElFTkSuQmCC\') 0 0; }\n\
\n\
.ui-editor-redo-button:hover .ui-icon-redo {\n\
  filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=100);\n\
  opacity: 1; }\n\
\n\
/**\n\
 * Horizontal rule plugin\n\
 *\n\
 * @author David Neilsen <david@panmedia.co.nz>\n\
 */\n\
.ui-editor-hr-button .ui-icon-hr {\n\
  filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=85);\n\
  opacity: 0.85;\n\
  background: url(\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAXhJREFUeNpi/P//PwMTExMDEmgEYi0gZsSCrwJxNUzhv3//GBixGEA0ABnAgkV8LZqtTFDaF6aAX8KCwdBrA4QDckFq+1sGSUVrBkZGRqKwvEEhg2PyS7BeuAv07AsZXjw4BmJuQLIV5gImJLYrv7g53LlwA8TkLRgCi28wXDzQF/Dr10+G379/M/z58wfoz/9gfUxMrAzMzGwMsnr5DBwcvBgGHABiexBDyTiV4cuXTwxfv35j+PHjB9CQ/0BnszCwsHAysLHxIofVQSB2gBlgnxogAqREiI6B+ikf7ZFdcHD2hjf2X79+Zfj8+TNeF7Cz84K9wMrKdRDZAAcQ8fbJaYYndw4zYAsDHlFjBjZxKwyXwAPx1cMTDIdWxoKY+5BCHo7f31tp8VM9iUFQ0oaBQ9YBYQIoLo1dygmmA2QgIGHJoGhUCtaLLSkfweICVqA6diDNAcQKyJYTlRdAanCJY8sL04HYFM3WM0Acgs0QRlymEwsAAgwAwwCYinucCRoAAAAASUVORK5CYII=\') 0 0; }\n\
\n\
.ui-editor-hr-button:hover .ui-icon-hr {\n\
  filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=100);\n\
  opacity: 1; }\n\
\n\
/**\n\
 * Internationalisation plugin\n\
 *\n\
 * @author Michael Robinson <michael@panmedia.co.nz>\n\
 * @author David Neilsen <david@panmedia.co.nz>\n\
 */\n\
.ui-editor-wrapper .ui-editor-i18n-select {\n\
  height: 23px;\n\
  top: -8px;\n\
  text-align: left; }\n\
\n\
.ui-editor-wrapper .ui-editor-i18n-select .ui-editor-selectmenu-status {\n\
  font-size: 13px;\n\
  line-height: 10px; }\n\
\n\
.ui-editor-selectmenu-menu li a, .ui-editor-selectmenu-status {\n\
  line-height: 12px; }\n\
\n\
.ui-editor-wrapper .ui-editor-i18n-select .ui-editor-selectmenu-item-icon {\n\
  height: 24px;\n\
  width: 24px; }\n\
\n\
.ui-editor-selectmenu-menu .ui-icon.ui-editor-i18n-en,\n\
.ui-editor-wrapper .ui-icon.ui-editor-i18n-en {\n\
  background: url(\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAALCAIAAAD5gJpuAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAflJREFUeNpinDRzn5qN3uFDt16+YWBg+Pv339+KGN0rbVP+//2rW5tf0Hfy/2+mr99+yKpyOl3Ydt8njEWIn8f9zj639NC7j78eP//8739GVUUhNUNuhl8//ysKeZrJ/v7z10Zb2PTQTIY1XZO2Xmfad+f7XgkXxuUrVB6cjPVXef78JyMjA8PFuwyX7gAZj97+T2e9o3d4BWNp84K1NzubTjAB3fH0+fv6N3qP/ir9bW6ozNQCijB8/8zw/TuQ7r4/ndvN5mZgkpPXiis3Pv34+ZPh5t23//79Rwehof/9/NDEgMrOXHvJcrllgpoRN8PFOwy/fzP8+gUlgZI/f/5xcPj/69e/37//AUX+/mXRkN555gsOG2xt/5hZQMwF4r9///75++f3nz8nr75gSms82jfvQnT6zqvXPjC8e/srJQHo9P9fvwNtAHmG4f8zZ6dDc3bIyM2LTNlsbtfM9OPHH3FhtqUz3eXX9H+cOy9ZMB2o6t/Pn0DHMPz/b+2wXGTvPlPGFxdcD+mZyjP8+8MUE6sa7a/xo6Pykn1s4zdzIZ6///8zMGpKM2pKAB0jqy4UE7/msKat6Jw5mafrsxNtWZ6/fjvNLW29qv25pQd///n+5+/fxDDVbcc//P/zx/36m5Ub9zL8+7t66yEROcHK7q5bldMBAgwADcRBCuVLfoEAAAAASUVORK5CYII=\') 0 0; }\n\
\n\
.ui-editor-selectmenu-menu .ui-icon.ui-editor-i18n-zh_CN,\n\
.ui-editor-wrapper .ui-icon.ui-editor-i18n-zh_CN {\n\
  background: url(\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAALCAIAAAD5gJpuAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAFqSURBVHjaYrzOwPAPjJgYQEDAleHVbhADIvgHLPgHiQ0QQCxAlkR9NW8sw+cV/1gV/7Gb/hV4+vfzhj8Mv/78//Pn/+/f/8AkhH1t0yaAAAJp4I37zyz2lDfu79uqv/++/WYz+cuq/vvLxt8gdb+A5K9/v34B2SyyskBLAAII5JAva/7/+/z367a/f3/8ZuT9+//Pr78vQUrB6n4CSSj6/RuoASCAWEDO/fD3ddEfhv9/OE3/sKj8/n7k9/fDQNUIs/+DVf8HawAIIJCT/v38C3Hr95N/GDh/f94AVvT7N8RUBpjxQAVADQABBNLw/y/Ifwy/f/399ufTOpDBEPf8g5sN0QBEDAwAAQTWABEChgOSA9BVA00E2wAQQCANQBbEif/AzoCqgLkbbBYwWP/+//sXqBYggFhAkfL7D7OkJFCOCSj65zfUeFjwg8z++/ffX5AGoGKAAGI8jhSRyIw/SJH9D4aAYQoQYAA6rnMw1jU2vQAAAABJRU5ErkJggg==\') 0 0; }\n\
\n\
/**\n\
 * Image resize plugin\n\
 *\n\
 * @author Michael Robinson <michael@panmedia.co.nz>\n\
 * @author David Neilsen <david@panmedia.co.nz>\n\
 */\n\
.ui-editor-image-resize-in-progress {\n\
  outline: 1px dashed rgba(0, 0, 0, 0.5); }\n\
\n\
/**\n\
 * Length plugin\n\
 *\n\
 * @author David Neilsen <david@panmedia.co.nz>\n\
 */\n\
.ui-editor-length-button .ui-icon-dashboard {\n\
  filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=85);\n\
  opacity: 0.85;\n\
  background: url(\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAhFJREFUeNrEk7tv01AUxr/4kcRO7Fh1HghFgSAeYglDlIfUbGEBhaWoUxFiQWJGMDDyhzB2ZmANYmAoIvQPaIHIkVJjKyWkcdzYSR1zbhSGQhFDB47007333PN9V/cVCcMQ5wkO54wIxe+5q8Rt4gaRW+VsYo9oE1/+ZpAktjKZzL1arXatWCzmFEVhOYzH40m327U7nc7nwWDwhlLbxITN8SsDVvisXq9vtVqtuqZp2XK5HDcMg5vNZlylUon7vq+XSqXLi8WiYJqmTvWfiNkvg8e06gMqLDmOI5AIvV4P8/l8CeuzHMHn8/kcmeiWZQWk6zCD67quP280GuXNdlv4qKrwTk6WwpXoFNVqNTKdTtf6/X7C87wPzOAhrX4nCIK195KEp4aBtxyHKRm4roujozGdwQSO49LYx/7+VzIPeVEUOcsyh+wab9Ge0+SKGW3nhSzj5WiEoWlhMvHolKOIRmVIkgpZVhGPKxAEGdlsIc20zOASz/NSs9lkl4IwJuOJH+CVksDi2APPx0iYIgNlCTNYXy8hmdQkpmUGCfag2u134DgJipKGdqGAR6NjbKdVOAMbQRAiRsaCEKMaHru7XdYutRw95R+Hh0NXVTNIpXQy0KDrOVy8chOb34Z4XcjCMvZoO86p12bbBy7Tsv5dYoc4OAtFFM3BxkZ4xtzOSvvPuE98X7V//oX//ht/CjAAagzmsnB4V5cAAAAASUVORK5CYII=\') 0 0; }\n\
\n\
.ui-editor-length-button:hover .ui-icon-dashboard {\n\
  filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=100);\n\
  opacity: 1; }\n\
\n\
/**\n\
 * Link plugin\n\
 *\n\
 * @author Michael Robinson <michael@panmedia.co.nz>\n\
 * @author David Neilsen <david@panmedia.co.nz>\n\
 */\n\
.ui-editor-link-button .ui-icon-link {\n\
  filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=85);\n\
  opacity: 0.85;\n\
  background: url(\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAilBMVEX///8EBARUVFRUVFQEBARTU1MqKiwfHx5MTEzGxsZNTU1FRUWAgH8SEhJnZ2fd3d06Ojrg4ODIyMgODg4DAwMSEhLCwsGcnKXExNEvLy+ysrh+foMQEBBBQUEEBATJydeenqcDAwPT09OIiIjj4+OZmZl3d3fU1OPCwsHW1tXq6urr6+va2trGxsaRnmwcAAAAI3RSTlMAimdfRTOWgDXbAGXFj339cv3dAHtC3OP8bt+2cnuA/OMA+Akct2IAAABoSURBVHhetcVZFoIgGAbQ7wcVwyEKtBi01OZh/9urw2EJdV8ufkHmnDHG85RE2a7Wp812GGJtiaqvG1rOXws1dV9BzWKi2/3xfL1pErOCdT6YS2SCdxZdsdtfD8ci1UFnIxGNWUrjHz6V6QhqNdQf6wAAAABJRU5ErkJggg==\') 0 0; }\n\
\n\
.ui-editor-link-button:hover .ui-icon-link {\n\
  filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=100);\n\
  opacity: 1; }\n\
\n\
.ui-editor-unlink-button .ui-icon-unlink {\n\
  filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=85);\n\
  opacity: 0.85;\n\
  background: url(\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAA2FBMVEX///8WFhYvLy9LS0sEBAQODg4EBARNTU0DAwNVVVVUVFQtLS1nZ2cfHx46OjoSEhLGxsZTU1OAgH/T09NUVFQEBAQ6OjpMTEwvLy+4uMDCwsEQEBCvr7sSEhIEBAR+foMqKixFRUUEBARDQ0MBAQEBAQG5ucQiIiICAgIODg7Z2dlAQEBMTEwsLCxGRkYAAABPT0/e3t4mJiYqKiopKSlUVFQiIiJJSUkjIyNFRUU5OTkBAQEoKCi/v8zCws+qgFWFZkY7MSbc3Nzj4+Pm5ubOztzU1OTQ0N6IE/7FAAAAQ3RSTlMAAAAAigAAAAAAZwB9gACP2zPF+F9ocjVu39xy40KAtpZlRQBrUPx9AIb8AE8AAAAA/AAAAAAAAAAAAAAA/PwAAAD8PWHlxQAAALtJREFUeF5dzsVWxEAQheHqpGPEPeMWGXfcmQHe/42oC+ewmH95F1UfGWFyhZLQUBHlTvBxOp92gZP/DaN25Esp/ag9ukeUxa5p6qbpxpmHqGgNOtWm6gxahaIokwX1ht16ps3q7rAn9utrg7RxX6Z6KvtjbWJZGHTuuLLtw8P2f/CAWd4uGYNBqCpj5s1NM2cMPd3xc2D4EDDkIWCmj1NgSEHAlGUJDAnEmOfPr+8XxtDr27sQwHDA0GU/2RcVwEV78WkAAAAASUVORK5CYII=\') 0 0; }\n\
\n\
.ui-editor-unlink-button:hover .ui-icon-unlink {\n\
  filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=100);\n\
  opacity: 1; }\n\
\n\
/* Dialog */\n\
.ui-editor-link-panel .ui-editor-link-menu {\n\
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
  .ui-editor-link-panel .ui-editor-link-menu p {\n\
    font-weight: bold;\n\
    margin: 12px 0 8px; }\n\
  .ui-editor-link-panel .ui-editor-link-menu fieldset {\n\
    -webkit-box-flex: 2;\n\
    -moz-box-flex: 2;\n\
    -ms-box-flex: 2;\n\
    box-flex: 2;\n\
    margin: 2px 4px;\n\
    padding: 7px 4px;\n\
    font-size: 13px; }\n\
    .ui-editor-link-panel .ui-editor-link-menu fieldset label {\n\
      display: block;\n\
      margin-bottom: 10px; }\n\
      .ui-editor-link-panel .ui-editor-link-menu fieldset label span {\n\
        display: inline-block;\n\
        width: 150px;\n\
        font-size: 13px;\n\
        vertical-align: top; }\n\
\n\
.ui-editor-link-panel .ui-editor-link-menu fieldset,\n\
.ui-editor-link-panel .ui-editor-link-wrap fieldset {\n\
  border: none; }\n\
\n\
.ui-editor-link-panel .ui-editor-link-wrap {\n\
  margin-left: 200px;\n\
  padding-left: 20px;\n\
  min-height: 200px;\n\
  position: relative; }\n\
  .ui-editor-link-panel .ui-editor-link-wrap.ui-editor-link-loading:after {\n\
    content: \'Loading...\';\n\
    position: absolute;\n\
    top: 60px;\n\
    left: 200px;\n\
    padding-left: 20px;\n\
    background: url(\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAOXRFWHRTb2Z0d2FyZQBBbmltYXRlZCBQTkcgQ3JlYXRvciB2MS42LjIgKHd3dy5waHBjbGFzc2VzLm9yZyl0zchKAAAAOnRFWHRUZWNobmljYWwgaW5mb3JtYXRpb25zADUuMi4xNzsgYnVuZGxlZCAoMi4wLjM0IGNvbXBhdGlibGUpCBSqhQAAAAhhY1RMAAAACAAAAAC5PYvRAAAAGmZjVEwAAAAAAAAAEAAAABAAAAAAAAAAAAA8A+gAAIIkGDIAAACsSURBVDiNtZLBCcMwDEUfJgOUjhAyQsmp9FA8TgfISj6F4gl66jSdIIf00G9wnLjYKf3w0Qch6Us2fMdVLMYx0haYRZsrMJEegZdiDj3gFFeT54jBiU2mO+XdVvdRyV0OYidVMEAH3AEPHGoboMKwuy+seYqLV9iNTpM90P7S6AQMitXogYnPHSbyz2SAC9HqQVigkW7If90z8FAsctCyvMvKQdpkSOzfxP/hDd++JCi8XmbFAAAAGmZjVEwAAAABAAAAEAAAABAAAAAAAAAAAAA8A+gAABlX8uYAAAC3ZmRBVAAAAAI4jaWQsQ3CQBAEB4cECFGCI1fiAlyFKwARWgSIeqjCNTh0gIjIkBw9gffFSfz74VlpdX/W3Xr3YBmlmIUSmMSoSGHee+CmGsMGaFU/cAecqnVh/95qpg0J/O0gCytgDRzUX4DnryIn5lwO6L7c6fxskRhMwkc4qj+TEcFjC9SqWcsj8x3GhMgu9LHmfUinvgKuYmWWp5BIyEFvBPuUAy9ibzAYgWEhUhQN8BCb2NALKY4q8wCrG7AAAAAaZmNUTAAAAAMAAAAQAAAAEAAAAAAAAAAAADwD6AAA9MEhDwAAAKhmZEFUAAAABDiNY2CgMTgNxTgBExLbh4GB4SCUxgeMcEkcZmBg+A+lcQETqBoTbJI+UM1ku4AiEATFZIEQBoi//kPZxIAAKEaJBYpACAm24wUSBORVGBgYUqA0BtjKAAmHrXg0f4aq+YxuiAQDIiD/Q/k8DAwMdVDMw8DAkIamJo2QCyYjKZ4MtfErlP8VlzeQw2AlkgErkbyBMwzQgRoDA8N+KMapAQDdvyovpG6D8gAAABpmY1RMAAAABQAAABAAAAAQAAAAAAAAAAAAPAPoAAAZC1N1AAAAsWZkQVQAAAAGOI21kkEOgjAURF9YGBbGtYcwLowrwxk8BMcg3XACD9djGJaujKmLTkMRCiXEl0ympYX8+Xz4M62UpIjWR8DI59inDgzg5CkOwEs+YnMFmzhJOdwAK1UAZ+ANfLRewuJ75QAb/kKRvp/HmggVPxHWsAMu8hEN8JRPUdLnt9oP6HTYRc/uEsCVvnlO+wFGFYRJrKPLdU4FU5HCB0KsEt+DxZfBj+xDSo7vF9AbJ9PxYV81AAAAGmZjVEwAAAAHAAAAEAAAABAAAAAAAAAAAAA8A+gAAPSdgJwAAADDZmRBVAAAAAg4jaWSTQrCMBCFP6NIT5AjCF6gJ6jbUnoCL1biDTyF5AAueoZu3LkSrAtHTEJiIn3wmCTz92YILMQ64++BPTDKXQMH4AbcAZQTvAEasTFo4AqcxeowoAFmsSk1s8M+DChRMEnyFFNQAg10sWSFv49cESPUn+RRWFLE8N2DKe2axaIR/sU25eiAi9gUBt6zDzGnFad13nZCgAr/I1UxBdZRUAMPYV2iIETrdGudd28Hqx8FFHCU8wl4xoJeZnUrSRiyCSsAAAAaZmNUTAAAAAkAAAAQAAAAEAAAAAAAAAAAADwD6AAAGe6xwAAAALtmZEFUAAAACjiNpZJBCsIwEEWfpUsPULoSl55Beh4J7nqCHkDceR3pIaSr4Ak8Qq2L/khomlrig+FPhszwJy3EqYCHolq4F6UDBkWnWgbspN+CT7EwMAPuwFM67aUAem/IdIW952jQOeCXg1bN7ZyDNQRvsEkYkgNG+S1XcpHWKwacgatzlLLH2z/8vUJCf5wSaKQxToCVBjSM37jxaluFw+qOXeOgBF4KVzNqNkH3DAfGX7tXnsRREeUD4f8lQGjw+ycAAAAaZmNUTAAAAAsAAAAQAAAAEAAAAAAAAAAAADwD6AAA9HhiKQAAAJ9mZEFUAAAADDiNtZDLCcMwEEQfIUcXoDpCKgg6qIRUEtKB6wg6poDgalyFTj7YBw+2QyRlCc6DYVm0n9FCGQc8JFepWzgBN0WACIxS/NZ8BgYVD8pzA1ogKb5x3xSPyp0a4+YLSe/J4iBH0QF83uCvXKSFq2TBs97KH/Y1ZsdL+3IEgmJt86u0PTAfJlQGdKrprA6ekslBjl76mUYqMgFhpStJaQVr0gAAABpmY1RMAAAADQAAABAAAAAQAAAAAAAAAAAAPAPoAAAZshBTAAAAu2ZkQVQAAAAOOI21kCEOwkAQRR8rKkkFCtmjkJ4ARTgBArViT4LjLJwBgUZUr8NBQlrR38Am3XYEvOTnT7PzuzO7IE8BHFWfgNdELwBLYCMH8EAr+VzIyUvgBlzkZaZ/D1zlCfXXba2+C93sVaNwK08ogUaHzcQEu9wE0O9e83kDEw7YAhG4K/ww5CoJFB52j8bwU6rcTLOJYYWo2kKywk9Zz5yvgCAfDb9nfhLoHztYJzhIpgnGOEv/owMnkSfarUXVlAAAAABJRU5ErkJggg==\') no-repeat left center; }\n\
  .ui-editor-link-panel .ui-editor-link-wrap h2 {\n\
    margin: 10px 0 0; }\n\
  .ui-editor-link-panel .ui-editor-link-wrap fieldset {\n\
    margin: 2px 4px;\n\
    padding: 7px 4px;\n\
    font-size: 13px; }\n\
    .ui-editor-link-panel .ui-editor-link-wrap fieldset input[type=text] {\n\
      width: 400px; }\n\
    .ui-editor-link-panel .ui-editor-link-wrap fieldset.ui-editor-external-href {\n\
      width: 365px; }\n\
    .ui-editor-link-panel .ui-editor-link-wrap fieldset.ui-editor-link-email label {\n\
      display: inline-block;\n\
      width: 115px; }\n\
    .ui-editor-link-panel .ui-editor-link-wrap fieldset.ui-editor-link-email input {\n\
      width: 340px; }\n\
  .ui-editor-link-panel .ui-editor-link-wrap ol li {\n\
    list-style: decimal inside; }\n\
\n\
.ui-editor-link-panel .ui-editor-link-wrap\n\
.ui-editor-link-panel .ui-editor-link-wrap fieldset #ui-editor-link-external-target {\n\
  vertical-align: middle; }\n\
\n\
.ui-editor-link-error-message div {\n\
  padding: 0 .7em; }\n\
  .ui-editor-link-error-message div p {\n\
    margin: 0; }\n\
    .ui-editor-link-error-message div p .ui-icon {\n\
      margin-top: 2px;\n\
      float: left;\n\
      margin-right: 2px; }\n\
\n\
/**\n\
 * List plugin\n\
 *\n\
 * @author David Neilsen <david@panmedia.co.nz>\n\
 */\n\
.ui-editor-list-unordered-button .ui-icon-list-unordered {\n\
  filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=85);\n\
  opacity: 0.85;\n\
  background: url(\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAMlJREFUeNpi/P//PwNFAGQAIyNjGBCvgdIMxGKQXhaoORFlZWWBXV1dTED2KqjYGiBmRMJMaOwrQFwOc0EEEG+A0iS5gBFEMDExkeX9f//+MTAxUAhgBsQC8U4oTRKABWJ8Rkae84wZk5iB7MVQsW1IAYYLW8MCMRGID0Bp+gYiC46EhTPR4QrEdCA+A6VJT8pAcDMsLB3EuAniQP14BIiPAfEJID4FxGehqe8OED8B4vVgvVADioH4GZTGGWhYvUtpbqQ4JQIEGABjeFYu055ToAAAAABJRU5ErkJggg==\') 0 0; }\n\
\n\
.ui-editor-list-unordered-button:hover .ui-icon-list-unordered {\n\
  filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=100);\n\
  opacity: 1; }\n\
\n\
.ui-editor-list-ordered-button .ui-icon-list-ordered {\n\
  filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=85);\n\
  opacity: 0.85;\n\
  background: url(\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAM1JREFUeNpi/P//PwNFAGQAIyNjIxCvAWJBIGYgFoP0skDNqQfidUDMiGT2GigfhpnQ2FeAuJwFSQMTmuNCiPEBTFMblF1CahAwgvzBxMREVvj9+/cP7oIuIN4Bpcl2gRMQJwFxDFRuG1KAYcVAF1jDojEBiGcAsQSp0QjzgiEQawLxSiibNoGInmqRE9J0IJaEYnNSXAAzYC4QNwJxIJLcEbRAYwZidiDmgOLTYPVIzgJpPgD2F45Aw+olqAFrgfg5EBeTagAjpdkZIMAAg/ZGwsH5qkAAAAAASUVORK5CYII=\') 0 0; }\n\
\n\
.ui-editor-list-ordered-button:hover .ui-icon-list-ordered {\n\
  filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=100);\n\
  opacity: 1; }\n\
\n\
/**\n\
 * Paste plugin\n\
 *\n\
 * @author David Neilsen <david@panmedia.co.nz>\n\
 * @author Michael Robinson <michael@panmedia.co.nz>\n\
 */\n\
.ui-editor-paste-panel-tabs {\n\
  height: 100%;\n\
  width: 100%;\n\
  -webkit-box-sizing: border-box;\n\
  -moz-box-sizing: border-box;\n\
  box-sizing: border-box; }\n\
\n\
.ui-editor-paste .ui-tabs a {\n\
  outline: none; }\n\
\n\
.ui-editor-paste-panel-tabs {\n\
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
.ui-editor-paste-panel-tabs > div {\n\
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
.ui-editor-paste-panel-tabs > div > textarea.ui-editor-paste-area {\n\
  -webkit-box-flex: 1;\n\
  -moz-box-flex: 1;\n\
  -ms-box-flex: 1;\n\
  box-flex: 1;\n\
  display: -webkit-box;\n\
  display: -moz-box;\n\
  display: -ms-box;\n\
  display: box; }\n\
\n\
.ui-editor-paste-panel-tabs > div > textarea,\n\
.ui-editor-paste-panel-tabs > div > .ui-editor-paste-area {\n\
  border: none;\n\
  padding: 2px; }\n\
\n\
/**\n\
 * Raptorize plugin\n\
 *\n\
 * @author David Neilsen <david@panmedia.co.nz>\n\
 */\n\
.ui-editor-raptorize-button .ui-icon-raptorize {\n\
  filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=85);\n\
  opacity: 0.85;\n\
  background: url(\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAABDlBMVEX///9NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU0Y/iVtAAAAWXRSTlMA/v1mTvW+WQFF+nGpsyPlDhXL1GvZHduk48LslL2a7tadwee772kEfqD8+OGCXWJ2+bQ9pt7xCme4iQU4iNH0mCEPEd82Ocxj4De2HoMaq3MHZJsDeGwCG8H1fioAAAC1SURBVHheNchFlsMwEADRlmRkSDKmMDMMMjMz9P0vkifLrl194F3NW0qtugV5Wt1FHpnloGKRmr3TK96YDjiMxFGCONngcJ1De4GNDJqhvd2VkbzsY+eDw2efMTYsjRFxd4+DZx6ajC1xhXTTB560EyfWASJW2FEG3vGJElZOz4xzH6QLKLqMgpvbu3sxD+4jPBFJe05fBby9ly0S6ADxl4BviGjp5xd0Of0TUqaUEPs/kR1YA96IIUDtx93SAAAAAElFTkSuQmCC\') 0 0; }\n\
\n\
.ui-editor-raptorize-button:hover .ui-icon-raptorize {\n\
  filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=100);\n\
  opacity: 1; }\n\
\n\
/**\n\
 * Save plugin\n\
 *\n\
 * @author David Neilsen <david@panmedia.co.nz>\n\
 */\n\
.ui-editor-save-button .ui-icon {\n\
  filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=85);\n\
  opacity: 0.85;\n\
  background: url(\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAVNJREFUeNqkU71ugzAQPowtwdAdqRLK3odg6161a+cukZonoGrElgWWDqhb16oP0AfoytStirows0QRMj/unQsohAQi5aTD5vju4/Pd2VBKwTnG6cEYe8bl6s73P09Jel8ur3H5ruv6CUiBYRgfQRAosnrCyQhLOZTLG1ImpYQSA1VVjf7dNE0gLOV0R6AXlAMSk4uiGCUQ6ITdJzDpz0SQTxAoxlqVZo+gLEuQyDxFwIQAwg4IiPV3vYbL2WyUgDBHFbxG0Um9t237sIIkSeDYYGHbur3neQMCTgqoRWEYDToh8NyLxSO4rgtpmrY14D0CUsA5h80mh/n8QQdXq7CTTN/ILMtqa9AjEDjOGrTdSnAcRwdpr1unzB5BMweiGwY8tx/H8U+WZbmUSoPJlfr3NrZLgDkXujbNXaD9DfoLAt8OFRHPfb8X+sLcW+Pc6/wnwABHMdnKf4KT4gAAAABJRU5ErkJggg==\') 0 0; }\n\
\n\
.ui-editor-save-button:hover .ui-icon {\n\
  filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=100);\n\
  opacity: 1; }\n\
\n\
.ui-editor-cancel-button .ui-icon {\n\
  filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=85);\n\
  opacity: 0.85;\n\
  background: url(\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAtFBMVEX///+nAABhAACnAACjAACCAACgAACHAACjAAByAAB1AAByAACDAACnAACCAACHAACgAACNAACbAACXAACMAACSAABfAACYAACRAACjAACbAAChAACqAACNAACcAACHAACqAADEERGsERHQERG+NjaiERHUTEzYERG4ERGlFBSfFRX/d3f6cnK0JSWoHh7qYmLkXFyvFRXmXl7vZ2fNRUX4cHDXT0/+dnbbU1O3Li7GPT26MTG2f8oMAAAAIXRSTlMASEjMzADMzAAASMxIAMwAAMzMzEjMzEhISABIzABISEg/DPocAAAAj0lEQVR4Xo3PVw6DMBBF0RgXTO+hBYhtILX3sv99RRpvgPcxVzp/M5syb7lYepxDABDeYcQ5wg+MAMhr3JOyJKfxTABqduuvjD37O6sBwjZ+f76/7TFuQw1VnhyGYZPklYagKbKLlDIrmkBDGq1hUaqhM4UQJpwOwFdK+a4LAbCdlWNTCgGwjLlhUQqZ8uofSk8NKY1Fm8EAAAAASUVORK5CYII=\') 0 0; }\n\
\n\
.ui-editor-cancel-button:hover .ui-icon {\n\
  filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=100);\n\
  opacity: 1; }\n\
\n\
/**\n\
 * Tag menu plugin\n\
 *\n\
 * @author David Neilsen <david@panmedia.co.nz>\n\
 * @author Michael Robinson <michael@panmedia.co.nz>\n\
 */\n\
.ui-editor-wrapper .ui-editor-selectmenu .ui-editor-selectmenu-button .ui-icon {\n\
  text-align: left; }\n\
\n\
.ui-editor-wrapper .ui-editor-selectmenu .ui-editor-selectmenu-button .ui-editor-selectmenu-text {\n\
  font-size: 13px;\n\
  line-height: 22px; }\n\
\n\
.ui-editor-selectmenu-menu li a, .ui-editor-selectmenu-status {\n\
  line-height: 12px; }\n\
\n\
/**\n\
 * Basic text style plugin\n\
 *\n\
 * @author David Neilsen <david@panmedia.co.nz>\n\
 */\n\
.ui-editor-wrapper [data-title]:after {\n\
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
.ui-editor-wrapper [data-title]:hover:after {\n\
  opacity: 1; }\n\
\n\
.ui-editor-wrapper .ui-editor-select-element {\n\
  position: relative; }\n\
\n\
.ui-editor-wrapper .ui-editor-select-element:after {\n\
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
.ui-editor-unsaved-edit-warning {\n\
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
  .ui-editor-unsaved-edit-warning .ui-icon {\n\
    display: inline-block;\n\
    float: left;\n\
    margin: 8px 5px 0 5px; }\n\
\n\
.ui-editor-unsaved-edit-warning-visible {\n\
  filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=100);\n\
  opacity: 1; }\n\
\n\
.ui-editor-unsaved-edit-warning-dirty {\n\
  outline: 1px dotted #aaa;\n\
  background-image: url(\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoAQMAAAC2MCouAAAABlBMVEUAAACfn5/FQV4CAAAAAnRSTlMAG/z2BNQAAABPSURBVHhexc2xEYAgEAXRdQwILYFSKA1LsxRKIDRwOG8LMDb9++aO8tAvjps4qXMLaGNf5JglxyyEhWVBXpAfyCvyhrwjD74OySfy8dffFyMcWadc9txXAAAAAElFTkSuQmCC\') !important; }\n\
\n\
/**\n\
 * View source plugin\n\
 *\n\
 * @author Michael Robinson <michael@panmedia.co.nz>\n\
 * @author David Neilsen <david@panmedia.co.nz>\n\
 */\n\
.ui-editor-view-source-button .ui-icon-view-source {\n\
  filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=85);\n\
  opacity: 0.85;\n\
  background: url(\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAKtJREFUeNpi/P//PwMlgImBQkCxAQwgLzAyMqLjMCCehsSfBhVDUQf2PhYDIoB4JhCLIYmJQcUiCBkQBcRzgFgci6vEoXJRuAyIAeIFODQjG7IAqhbFAAMg3gOlGQhguFp0FyQC8UoglgTx0QFUjSRUTSKuMEgG4nUghVgMkITKJROKhXQg3gbUI42kXxokBpUjGI0gDYVAfBzJABC7EFs6YBz6eYFiAwACDAADJlDtLE22CAAAAABJRU5ErkJggg==\') 0 0; }\n\
\n\
.ui-editor-view-source-button:hover .ui-icon-view-source {\n\
  filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=100);\n\
  opacity: 1; }\n\
\n\
.ui-editor-ui-view-source .ui-editor-ui-view-source-dialog {\n\
  overflow: auto; }\n\
\n\
.ui-editor-ui-view-source-plain-text {\n\
  height: 100%;\n\
  width: 100%;\n\
  display: -webkit-box;\n\
  display: -moz-box;\n\
  display: -ms-box;\n\
  display: box;\n\
  -webkit-box-orient: vertical;\n\
  -moz-box-orient: vertical;\n\
  -ms-box-orient: vertical;\n\
  box-orient: vertical; }\n\
\n\
.ui-editor-ui-view-source-dialog textarea {\n\
  white-space: pre-line;\n\
  width: 100%;\n\
  height: 100%;\n\
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
</style>').appendTo('head');