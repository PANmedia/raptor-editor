// http://stackoverflow.com/questions/13435810/convert-tokens-into-selection-ranges

function RangeInfo() {}

RangeInfo.prototype = {
    setStart: function(node, offset) {
        this.startNode = node;
        this.startOffset = offset;
    },
    setEnd: function(node, offset) {
        this.endNode = node;
        this.endOffset = offset;
    },
    toRange: function() {
        var range = rangy.createRange();
        range.setStart(this.startNode, this.startOffset);
        range.setEnd(this.endNode, this.endOffset);
        return range;
    }
};

function getTextNodesIn(node) {
    var textNodes = [];
    function getTextNodes(node) {
        if (node.nodeType === 3) {
            textNodes.push(node);
        } else {
            for (var i = 0, l = node.childNodes.length; i < l; i++) {
                getTextNodes(node.childNodes[i]);
            }
        }
    }

    getTextNodes(node);
    return textNodes;
}

function tokensToRanges(el, limit) {

    var rangeInfos = [],
        currentRangeInfo,
        textNodes = getTextNodesIn(el.get(0));

    (function() {
        for (var i = 0, l = textNodes.length; i < l; i++) {
            var searchStartIndex = 0,
                searchIndex;
            while ((searchIndex = textNodes[i].data.indexOf(currentRangeInfo ? "}" : "{", searchStartIndex)) != -1) {
                if (limit && rangeInfos.length === limit) {
                    return;
                }
                textNodes[i].data = textNodes[i].data.slice(0, searchIndex) + textNodes[i].data.slice(searchIndex + 1);
                if (currentRangeInfo) {
                    currentRangeInfo.setEnd(textNodes[i], searchIndex);
                    rangeInfos.push(currentRangeInfo);
                    currentRangeInfo = null;
                } else {
                    currentRangeInfo = new RangeInfo();
                    currentRangeInfo.setStart(textNodes[i], searchIndex);
                }
                searchStartIndex = searchIndex;
            }
        }
    })();

    // Convert RangeInfos into ranges
    var ranges = [];
    $.each(rangeInfos, function() {
        ranges.push(this.toRange());
    });

    return ranges;
}

function tokensToSelection(el, limit) {
    var ranges = tokensToRanges(el, limit);
    rangy.getSelection().setRanges(ranges);
    return ranges;
}

function rangesToTokens(ranges) {
    var i = ranges.length;
    while (i--) {
        var close = document.createTextNode('}'),
            open = document.createTextNode('{'),
            closeRange = rangy.createRangyRange(),
            openRange = rangy.createRangyRange();
        closeRange.setStart(ranges[i].endContainer, ranges[i].endOffset);
        openRange.setStart(ranges[i].startContainer, ranges[i].startOffset);
        closeRange.insertNode(close);
        openRange.insertNode(open);
    }
}

function selectionToTokens() {
    return rangesToTokens(rangy.getSelection().getAllRanges());
}
