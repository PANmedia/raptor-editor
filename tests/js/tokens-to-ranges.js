// http://stackoverflow.com/questions/13435810/convert-tokens-into-selection-ranges

function RangeInfo() {}

RangeInfo.prototype = {
    setStart: function(node, offset) {
        this.sc = node;
        this.so = offset;
    },
    setEnd: function(node, offset) {
        this.ec = node;
        this.eo = offset;
    },
    toRange: function() {
        var range = rangy.createRange();
        range.setStart(this.sc, this.so);
        range.setEnd(this.ec, this.eo);
        return range;
    }
};

function tokensToRanges(el) {
    var rangeInfos = [];
    var currentRangeInfo;
    var textNodes = $(el)
        .find(":not(iframe)")
        .andSelf()
        .contents()
        .filter(function() {
            return this.nodeType == 3;
        });

    $.each(textNodes, function() {
        var searchStartIndex = 0;
        var searchIndex;
        while ( (searchIndex = this.data.indexOf(currentRangeInfo ? "}" : "{", searchStartIndex)) != -1 ) {
            // Remove the marker. Doing this breaks existing ranges
            // in this node, which is why we use RangeInfo objects
            // instead of ranges
            this.data = this.data.slice(0, searchIndex) + this.data.slice(searchIndex + 1);
            if (currentRangeInfo) {
                currentRangeInfo.setEnd(this, searchIndex);
                rangeInfos.push(currentRangeInfo);
                currentRangeInfo = null;
            } else {
                currentRangeInfo = new RangeInfo();
                currentRangeInfo.setStart(this, searchIndex);
            }
            searchStartIndex = searchIndex;
        }
    });

    // Convert RangeInfos into ranges
    var ranges = [];
    $.each(rangeInfos, function() {
        ranges.push(this.toRange());
    });

    return ranges;
}