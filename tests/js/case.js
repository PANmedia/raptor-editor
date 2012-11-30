var debugEnabled = false;
function debug() {
    if (arguments.length === 0) {
        debugEnabled = true;
        console.log('Debug enabled!');
        return;
    } 
    if (debugEnabled) {
        console.log.apply(console, arguments);
    }
}

function loadJS(src) {
    document.write('<script type="text/javascript" src="../../' + src + '"></script>');
}

function loadCSS(href) {
    document.write('<link type="text/css" rel="stylesheet" href="../../' + href + '" />');
}

// document.write('<meta charset="utf-8" />');
// document.write('<meta http-equiv="cache-control" content="no-cache" />');

loadCSS('css/case.css');
loadCSS('../codemirror/lib/codemirror.css');

loadJS('../codemirror/lib/codemirror.js');
loadJS('../codemirror/mode/javascript/javascript.js');
loadJS('../codemirror/mode/xml/xml.js');
loadJS('../codemirror/mode/css/css.js');
loadJS('../codemirror/mode/htmlmixed/htmlmixed.js');
loadJS('../src/dependencies/jquery.js');
loadJS('../src/dependencies/jquery-ui.js');
loadJS('../src/dependencies/rangy/rangy-core.js');
loadJS('../src/dependencies/rangy/rangy-applier.js');
loadJS('../src/dependencies/rangy/rangy-cssclassapplier.js');
loadJS('../src/dependencies/rangy/rangy-selectionsaverestore.js');
loadJS('../src/dependencies/rangy/rangy-serializer.js');
loadJS('../src/dependencies/rangy/rangy-textrange.js');
loadJS('../src/tools/action.js');
loadJS('../src/tools/clean.js');
loadJS('../src/tools/dock.js');
loadJS('../src/tools/element.js');
loadJS('../src/tools/fragment.js');
loadJS('../src/tools/list.js');
loadJS('../src/tools/range.js');
loadJS('../src/tools/selection.js');
loadJS('../src/tools/state.js');
loadJS('../src/tools/string.js');
loadJS('../src/tools/style.js');
loadJS('../src/tools/table.js');
loadJS('../src/tools/tag.js');
loadJS('../src/tools/types.js');
loadJS('js/beautify-html.js');
loadJS('js/diff.js');
loadJS('js/helpers.js');
loadJS('js/test.js');
loadJS('js/tokens-to-ranges.js');
