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
loadCSS('../../raptor-themes/mammoth/theme.css');
loadCSS('../../raptor-themes/mammoth/theme-icons.css');
loadCSS('css/case.css');
loadCSS('../../raptor-dependencies/codemirror/lib/codemirror.css');
loadCSS('../../raptor-example/partials/style.css');
loadCSS('../../packages/raptor-front-end.css');

loadJS('../../raptor-dependencies/codemirror/lib/codemirror.js');
loadJS('../../raptor-dependencies/codemirror/mode/javascript/javascript.js');
loadJS('../../raptor-dependencies/codemirror/mode/xml/xml.js');
loadJS('../../raptor-dependencies/codemirror/mode/css/css.js');
loadJS('../../raptor-dependencies/codemirror/mode/htmlmixed/htmlmixed.js');
loadJS('../../raptor-dependencies/jquery.js');
loadJS('../../raptor-dependencies/jquery-ui.js');
loadJS('../../raptor-dependencies/rangy/rangy-core.js');
loadJS('../../raptor-dependencies/rangy/rangy-applier.js');
loadJS('../../raptor-dependencies/rangy/rangy-cssclassapplier.js');
loadJS('../../raptor-dependencies/rangy/rangy-selectionsaverestore.js');
loadJS('../../raptor-dependencies/rangy/rangy-serializer.js');
loadJS('../../raptor-dependencies/rangy/rangy-textrange.js');
loadJS('../../raptor-dependencies/resizetable.js');
loadJS('../../raptor-dependencies/goog-table.js');
loadJS('../../raptor-common/types.js');
loadJS('../src/init.js');
loadJS('../src/tools/action.js');
loadJS('../src/tools/clean.js');
loadJS('../src/tools/dock.js');
loadJS('../src/tools/element.js');
loadJS('../src/tools/fragment.js');
loadJS('../src/tools/list.js');
loadJS('../src/tools/node.js');
loadJS('../src/tools/range.js');
loadJS('../src/tools/selection.js');
loadJS('../src/tools/state.js');
loadJS('../src/tools/string.js');
loadJS('../src/tools/style.js');
loadJS('../src/tools/table.js');
loadJS('../src/tools/types.js');
loadJS('../../raptor-dependencies/beautify-html.js');
loadJS('js/code-mirror.js');
loadJS('js/diff.js');
loadJS('js/helpers.js');
loadJS('js/reorder-attributes.js');
loadJS('js/test-editor.js');
loadJS('js/test.js');
loadJS('js/tokens-to-ranges.js');

document.addEventListener('DOMContentLoaded', function() {
    if (top === window) {
        $('<label for="verbose">Enable verbose output</label>').prependTo('body');
        var checkbox = $('<input id="verbose" type="checkbox" name="verbose" />').click(function() {
            if ($(this).is(':checked')) {
                localStorage.setItem('verbose', 1);
                $('body').addClass('verbose').removeClass('simple');
            } else {
                localStorage.setItem('verbose', 0);
                $('body').addClass('simple').removeClass('verbose');
            }
        }).prependTo('body');
        if (localStorage.getItem('verbose') == 1) {
            checkbox.trigger('click');
        }
    }
});
