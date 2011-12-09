(function(document) {
    var queue = [];
    var loaded = {};
    var loading = [];
    var ready = false;
    var processing = false;
    var scripts = document.getElementsByTagName('script');
    var script = scripts[scripts.length - 1];

    function param(name, def) {
        if (script.getAttribute(name) === null) {
            return def;
        }
        return script.getAttribute(name);
    }

    var root = param('root', 'jquery.ui.editor/');

    function init() {
        if (ready && loading.length === 0) {
            ready = false;
            if (window[param('loaded')]) {
                window[param('loaded')]();
            }
        }
    }

    function callback() {
        if (!processing && queue.length) {
            processing = true;
            var file = queue.shift();
            var node = document.createElement('script');
            node.setAttribute('type', 'text/javascript');
            node.setAttribute('src', file);
            document.getElementsByTagName('head')[0].appendChild(node)

            if (node.readyState) {
                // IE
                node.onreadystatechange = function(){
                    if (node.readyState == 'loaded' ||
                            node.readyState == 'complete') {
                        node.onreadystatechange = null;
                        processing = false;
                        callback();
                    }
                };
            } else {
                // Others
                node.onload = function(){
                    processing = false;
                    callback();
                };
            }
        }
        init();
    }

    var next;

    function ajax(file, name) {
        loading.push(file);
//        if (console && console.info) {
//            console.info('Loading file: ' + file);
//        }
        $.ajax({
            url: file,
            dataType: 'script'
        }).done(function() {
//            if (console && console.info) {
//                console.info('Loaded file: ' + file);
//            }
            loaded[name] = true;
            loading.pop();
            next();
        }).error(function(data) {
            if (console && console.error) {
                console.error('Error loading file: ' + file, data);
            }
        });

    }

    next = function() {
        var i = queue.length;
        while (i--) {
            var load = true;
            var j = queue[i].deps.length;
            while (j--) {
                // Check if the dependancy is loaded
                var dependancy = queue[i].deps[j];
                if (!loaded[dependancy]) {
                    load = false;
                }
            }
            // Load the queued file
            if (load) {
                var file = queue[i].file;
                var name = queue[i].name;
                ajax(file, name);
                queue.splice(i, 1);
            }
        }
        init();
    }

    function getJs(file, name, deps) {
        if (!deps) {
            ajax(file, name);
        } else {
            queue.push({
                file: file,
                name: name,
                deps: deps
            });
            next();
        }
    }

    function getCss(file) {
        var node = document.createElement('link');
        node.setAttribute('rel', 'stylesheet');
        node.setAttribute('type', 'text/css');
        node.setAttribute('href', file);
        document.getElementsByTagName('head')[0].appendChild(node)
    }

    function getLess(file) {
        var node = document.createElement('link');
        node.setAttribute('rel', 'stylesheet/less');
        node.setAttribute('type', 'text/css');
        node.setAttribute('href', file);
        document.getElementsByTagName('head')[0].appendChild(node)
    }

    // Get jQuery first
    if (param('jquery')) {
        var node = document.createElement('script');
        node.setAttribute('type', 'text/javascript');
        node.setAttribute('src', root + 'dependencies/jquery.js');
        document.getElementsByTagName('head')[0].appendChild(node)

        if (node.readyState) {
            // IE
            node.onreadystatechange = function(){
                if (node.readyState == 'loaded' ||
                        node.readyState == 'complete') {
                    node.onreadystatechange = null;
                    processing = false;
                    next();
                }
            };
        } else {
            // Others
            node.onload = function(){
                processing = false;
                next();
            };
        }
    }

    if (param('jquery-ui')) {
        getJs(root + 'dependencies/jquery-ui.js', 'jquery-ui');
    } else {
        loaded['jquery-ui'] = true;
    }

    if (param('jquery-ui-theme')) {
        getCss(root + 'dependencies/themes/smoothness/jquery-ui.css');
    }

    if (param('rangy')) {
        getJs(root + 'dependencies/rangy/rangy-core.js', 'rangy');
        getJs(root + 'dependencies/rangy/rangy-cssclassapplier.js', null, ['rangy']);
        getJs(root + 'dependencies/rangy/rangy-selectionsaverestore.js', null, ['rangy']);
        getJs(root + 'dependencies/rangy/rangy-serializer.js', null, ['rangy']);
    } else {
        loaded['rangy'] = true;
    }

    if (param('editor', true)) {
        getJs(root + 'jquery.ui.editor.init.js', 'init', ['jquery-ui', 'rangy']);
        getJs(root + 'jquery.ui.editor.domtools.js', 'domtools', ['jquery-ui', 'rangy']);
        getJs(root + 'jquery.ui.editor.js', 'editor', ['init', 'domtools']);
        getLess(root + 'jquery.ui.editor.less');
    } else {
        loaded['init'] = true;
        loaded['domtools'] = true;
        loaded['editor'] = true;
    }

    if (param('plugins', true)) {
        getJs(root + 'plugins/dock/jquery.ui.editor.dock.js', null, ['editor']);
        getLess(root + 'plugins/dock/jquery.ui.editor.dock.less');

        getJs(root + 'dependencies/tiptip/jquery.tipTip.js', null, ['editor']);
        getCss(root + 'dependencies/tiptip/tipTip.css');
        getJs(root + 'plugins/tiptip/jquery.ui.editor.tiptip.js', null, ['editor']);

        getJs(root + 'plugins/clicktoedit/jquery.ui.editor.clicktoedit.js', null, ['editor']);
        getLess(root + 'plugins/clicktoedit/jquery.ui.editor.clicktoedit.less');

        getJs(root + 'plugins/clean/jquery.ui.editor.clean.js', null, ['editor']);
        getLess(root + 'plugins/clean/jquery.ui.editor.clean.less');

        getJs(root + 'plugins/float/jquery.ui.editor.float.js', null, ['editor']);
        getLess(root + 'plugins/float/jquery.ui.editor.float.less');

        getJs(root + 'plugins/alignment/jquery.ui.editor.alignment.js', null, ['editor']);
        getLess(root + 'plugins/alignment/jquery.ui.editor.alignment.less');

        getJs(root + 'plugins/basic/jquery.ui.editor.basic.js', null, ['editor']);
        getLess(root + 'plugins/basic/jquery.ui.editor.basic.less');

        getJs(root + 'plugins/history/jquery.ui.editor.history.js', null, ['editor']);
        getLess(root + 'plugins/history/jquery.ui.editor.history.less');

        getJs(root + 'plugins/viewsource/jquery.ui.editor.viewsource.js', null, ['editor']);
        getLess(root + 'plugins/viewsource/jquery.ui.editor.viewsource.less');

        getJs(root + 'plugins/guides/jquery.ui.editor.guides.js', null, ['editor']);
        getLess(root + 'plugins/guides/jquery.ui.editor.guides.less');

        getJs(root + 'plugins/save/jquery.ui.editor.save.js', null, ['editor']);

        getJs(root + 'plugins/paste/jquery.ui.editor.paste.js', null, ['editor']);
        getLess(root + 'plugins/paste/jquery.ui.editor.paste.less');

        getJs(root + 'plugins/cancel/jquery.ui.editor.cancel.js', null, ['editor']);

        getJs(root + 'plugins/list/jquery.ui.editor.list.js', null, ['editor']);
        getLess(root + 'plugins/list/jquery.ui.editor.list.less');

        getJs(root + 'plugins/fontsize/jquery.ui.editor.fontsize.js', null, ['editor']);
        getLess(root + 'plugins/fontsize/jquery.ui.editor.fontsize.less');

        getJs(root + 'plugins/hr/jquery.ui.editor.hr.js', null, ['editor']);
        getLess(root + 'plugins/hr/jquery.ui.editor.hr.less');

        getJs(root + 'plugins/blockquote/jquery.ui.editor.blockquote.js', null, ['editor']);
        getLess(root + 'plugins/blockquote/jquery.ui.editor.blockquote.less');

        getJs(root + 'plugins/snippet/jquery.ui.editor.snippet.js', null, ['editor']);
        getLess(root + 'plugins/snippet/jquery.ui.editor.snippet.less');

        getJs(root + 'plugins/tagmenu/jquery.ui.editor.tagmenu.js', null, ['editor']);
        getLess(root + 'plugins/tagmenu/jquery.ui.editor.tagmenu.less');

        getJs(root + 'plugins/link/jquery.ui.editor.link.js', null, ['editor']);
        getLess(root + 'plugins/link/jquery.ui.editor.link.less');

        getJs(root + 'plugins/unsavededitwarning/jquery.ui.editor.unsavededitwarning.js', null, ['editor']);
        getLess(root + 'plugins/unsavededitwarning/jquery.ui.editor.unsavededitwarning.less');

        getJs(root + 'plugins/i18n/jquery.ui.editor.i18n.js', null, ['editor']);
        getJs(root + 'plugins/i18n/locales/en.js', null, ['editor']);
        getJs(root + 'plugins/i18n/locales/zh_CN.js', null, ['editor']);
        getLess(root + 'plugins/i18n/jquery.ui.editor.i18n.less');
    }

    if (param('less', true)) {
        getJs(root + 'dependencies/less.js');
    }

    ready = true;
    init();

})(document);
