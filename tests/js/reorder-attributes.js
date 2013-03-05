// http://stackoverflow.com/questions/13752904/sort-html-attributes-with-javascript
// http://stackoverflow.com/questions/979256/how-to-sort-an-array-of-javascript-objects
function sortAttributesBy(field, reverse, primer) {
    var key = function(x) {
        return primer ? primer(x[field]) : x[field];
    };

    return function(a, b) {
        var A = key(a),
            B = key(b);
        return ((A < B) ? -1 : (A > B) ? +1 : 0) * [-1, 1][+ !! reverse];
    }
};

function sortAttributes(elements) {
    for (var j = 0; j < elements.length; j++) {
        var attributes = [];
        for (var i = 0; i < elements[j].attributes.length; i++) {
            attributes.push({
                name: elements[j].attributes[i].name,
                value: elements[j].attributes[i].value
            });
        }

        var sortedAttributes = attributes.sort(sortAttributesBy('name', true, function(a) {
            return a.toUpperCase();
        }));

        for (var i = 0; i < sortedAttributes.length; i++) {
            $(elements[j]).removeAttr(sortedAttributes[i]['name']);
        }

        for (var i = 0; i < sortedAttributes.length; i++) {
            $(elements[j]).attr(sortedAttributes[i]['name'], sortedAttributes[i]['value']);
        }
    }
};
