(function(document) {
    var queue = [];
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
    
    function init() {
        if (ready && queue.length === 0) {
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
    
    function getJs(file) {
        queue.push(file);
        callback();
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
    
    if (param('jquery')) {
        getJs('jquery.ui.editor/dependencies/jquery.js');
    }
    
    if (param('jquery-ui')) {
        getJs('jquery.ui.editor/dependencies/jquery-ui.js');
    }
    
    if (param('jquery-ui-theme')) {
        getCss('jquery.ui.editor/dependencies/themes/smoothness/jquery-ui.css');
    }
    
    if (param('rangy')) {
        getJs('jquery.ui.editor/dependencies/rangy/rangy-core.js');
        getJs('jquery.ui.editor/dependencies/rangy/rangy-cssclassapplier.js');
        getJs('jquery.ui.editor/dependencies/rangy/rangy-selectionsaverestore.js');
        getJs('jquery.ui.editor/dependencies/rangy/rangy-serializer.js');
    }
    
    if (param('editor', true)) {
        getJs('jquery.ui.editor/jquery.ui.editor.init.js');
        getJs('jquery.ui.editor/jquery.ui.editor.domtools.js');
        getJs('jquery.ui.editor/jquery.ui.editor.js');
        getLess('jquery.ui.editor/jquery.ui.editor.less');
    }
    
    if (param('plugins', true)) {
        getJs('jquery.ui.editor/plugins/dock/jquery.ui.editor.dock.js');
        getLess('jquery.ui.editor/plugins/dock/jquery.ui.editor.dock.less');

        getJs('jquery.ui.editor/dependencies/tiptip/jquery.tipTip.js');
        getCss('jquery.ui.editor/dependencies/tiptip/tipTip.css');
        getJs('jquery.ui.editor/plugins/tiptip/jquery.ui.editor.tiptip.js');

        getJs('jquery.ui.editor/plugins/clicktoedit/jquery.ui.editor.clicktoedit.js');
        getLess('jquery.ui.editor/plugins/clicktoedit/jquery.ui.editor.clicktoedit.less');

        getJs('jquery.ui.editor/plugins/clean/jquery.ui.editor.clean.js');
        getLess('jquery.ui.editor/plugins/clean/jquery.ui.editor.clean.less');

        getJs('jquery.ui.editor/plugins/float/jquery.ui.editor.float.js');
        getLess('jquery.ui.editor/plugins/float/jquery.ui.editor.float.less');

        getJs('jquery.ui.editor/plugins/alignment/jquery.ui.editor.alignment.js');
        getLess('jquery.ui.editor/plugins/alignment/jquery.ui.editor.alignment.less');

        getJs('jquery.ui.editor/plugins/basic/jquery.ui.editor.basic.js');
        getLess('jquery.ui.editor/plugins/basic/jquery.ui.editor.basic.less');

        getJs('jquery.ui.editor/plugins/history/jquery.ui.editor.history.js');
        getLess('jquery.ui.editor/plugins/history/jquery.ui.editor.history.less');

        getJs('jquery.ui.editor/plugins/viewsource/jquery.ui.editor.viewsource.js');
        getLess('jquery.ui.editor/plugins/viewsource/jquery.ui.editor.viewsource.less');

        getJs('jquery.ui.editor/plugins/guides/jquery.ui.editor.guides.js');
        getLess('jquery.ui.editor/plugins/guides/jquery.ui.editor.guides.less');

        getJs('jquery.ui.editor/plugins/save/jquery.ui.editor.save.js');

        getJs('jquery.ui.editor/plugins/paste/jquery.ui.editor.paste.js');
        getLess('jquery.ui.editor/plugins/paste/jquery.ui.editor.paste.less');

        getJs('jquery.ui.editor/plugins/cancel/jquery.ui.editor.cancel.js');

        getJs('jquery.ui.editor/plugins/list/jquery.ui.editor.list.js');
        getLess('jquery.ui.editor/plugins/list/jquery.ui.editor.list.less');

        getJs('jquery.ui.editor/plugins/fontsize/jquery.ui.editor.fontsize.js');
        getLess('jquery.ui.editor/plugins/fontsize/jquery.ui.editor.fontsize.less');

        getJs('jquery.ui.editor/plugins/hr/jquery.ui.editor.hr.js');
        getLess('jquery.ui.editor/plugins/hr/jquery.ui.editor.hr.less');

        getJs('jquery.ui.editor/plugins/blockquote/jquery.ui.editor.blockquote.js');
        getLess('jquery.ui.editor/plugins/blockquote/jquery.ui.editor.blockquote.less');

        getJs('jquery.ui.editor/plugins/tagmenu/jquery.ui.editor.tagmenu.js');
        getLess('jquery.ui.editor/plugins/tagmenu/jquery.ui.editor.tagmenu.less');

        getJs('jquery.ui.editor/plugins/link/jquery.ui.editor.link.js');
        getLess('jquery.ui.editor/plugins/link/jquery.ui.editor.link.less');

        getJs('jquery.ui.editor/plugins/unsavededitwarning/jquery.ui.editor.unsavededitwarning.js');
        getLess('jquery.ui.editor/plugins/unsavededitwarning/jquery.ui.editor.unsavededitwarning.less');

        getJs('jquery.ui.editor/plugins/i18n/jquery.ui.editor.i18n.js');
        getJs('jquery.ui.editor/plugins/i18n/locales/en.js');
        getJs('jquery.ui.editor/plugins/i18n/locales/zh_CN.js');
        getLess('jquery.ui.editor/plugins/i18n/jquery.ui.editor.i18n.less');
    }
    
    if (param('less', true)) {
        getJs('jquery.ui.editor/dependencies/less.js');
    }
    
    ready = true;
    init();
    
})(document);
