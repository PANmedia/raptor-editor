function getIndent(level) {
    var result = '',
        i = level * 4;
    if (level < 0) {
        throw "Level is below 0";
    }
    while (i--) {
        result += ' ';
    }
    return result;
}

function style_html(html) {
    html = html.trim();
    var result = '',
        indentLevel = 0,
        tokens = html.split(/</);
    for (var i = 0, l = tokens.length; i < l; i++) {
        var parts = tokens[i].split(/>/);
        if (parts.length === 2) {
            if (tokens[i][0] === '/') {
                indentLevel--;
            }
            result += getIndent(indentLevel);
            if (tokens[i][0] !== '/') {
                indentLevel++;
            }

            if (i > 0) {
                result += '<';
            }

            result += parts[0].trim() + ">\n";
            if (parts[1].trim() !== '') {
                result += getIndent(indentLevel) + parts[1].trim().replace(/\s+/g, ' ') + "\n";
            }

            if (parts[0].match(/^(img|hr|br)/)) {
                indentLevel--;
            }
        }
    }
    return result;
}