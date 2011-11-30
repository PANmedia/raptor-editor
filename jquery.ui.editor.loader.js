(function(document) {
    var scripts = document.getElementsByTagName('script');
    var script = scripts[scripts.length - 1];
    
    function param(name, def) {
        if (script.getAttribute(name) === null) {
            return def;
        }
        return script.getAttribute(name) === 'true';
    }
    
    function js(file) {
        var node = document.createElement('script');
        node.setAttribute('type', 'text/javascript');
        node.setAttribute('src', file);
        document.getElementsByTagName('head')[0].appendChild(node)
        
        if (script.readyState){  //IE
            script.onreadystatechange = function(){
                if (script.readyState == "loaded" ||
                        script.readyState == "complete"){
                    script.onreadystatechange = null;
                    callback();
                }
            };
        } else {  //Others
            script.onload = function(){
                callback();
            };
        }
    }
    
    function css(file) {
        var node = document.createElement('link');
        node.setAttribute('rel', 'stylesheet');
        node.setAttribute('type', 'text/css');
        node.setAttribute('href', file);
        document.getElementsByTagName('head')[0].appendChild(node)
    }
    
    function less(file) {
        var node = document.createElement('link');
        node.setAttribute('rel', 'stylesheet/less');
        node.setAttribute('type', 'text/css');
        node.setAttribute('href', file);
        document.getElementsByTagName('head')[0].appendChild(node)
    }
    
    if (param('jquery')) {
        js('jquery.ui.editor/dependencies/jquery.js');
    }
    
    if (param('jquery-ui')) {
        js('jquery.ui.editor/dependencies/jquery-ui.js');
    }
    
    if (param('jquery-ui-theme')) {
        css('jquery.ui.editor/dependencies/themes/smoothness/jquery-ui.css');
    }
    
    if (param('rangy')) {
        js('jquery.ui.editor/dependencies/rangy/rangy-core.js');
        js('jquery.ui.editor/dependencies/rangy/rangy-cssclassapplier.js');
        js('jquery.ui.editor/dependencies/rangy/rangy-selectionsaverestore.js');
        js('jquery.ui.editor/dependencies/rangy/rangy-serializer.js');
    }
    
    if (param('editor', true)) {
        js('jquery.ui.editor/jquery.ui.editor.init.js');
        js('jquery.ui.editor/jquery.ui.editor.domtools.js');
        js('jquery.ui.editor/jquery.ui.editor.js');
        less('jquery.ui.editor/jquery.ui.editor.less');
    }
    
    if (param('plugins', true)) {
        js('jquery.ui.editor/plugins/dock/jquery.ui.editor.dock.js');
        less('jquery.ui.editor/plugins/dock/jquery.ui.editor.dock.less');

        js('jquery.ui.editor/plugins/tiptip/jquery.ui.editor.tiptip.js');

        js('jquery.ui.editor/plugins/clicktoedit/jquery.ui.editor.clicktoedit.js');
        less('jquery.ui.editor/plugins/clicktoedit/jquery.ui.editor.clicktoedit.less');

        js('jquery.ui.editor/plugins/clean/jquery.ui.editor.clean.js');
        less('jquery.ui.editor/plugins/clean/jquery.ui.editor.clean.less');

        js('jquery.ui.editor/plugins/float/jquery.ui.editor.float.js');
        less('jquery.ui.editor/plugins/float/jquery.ui.editor.float.less');

        js('jquery.ui.editor/plugins/alignment/jquery.ui.editor.alignment.js');
        less('jquery.ui.editor/plugins/alignment/jquery.ui.editor.alignment.less');

        js('jquery.ui.editor/plugins/basic/jquery.ui.editor.basic.js');
        less('jquery.ui.editor/plugins/basic/jquery.ui.editor.basic.less');

        js('jquery.ui.editor/plugins/history/jquery.ui.editor.history.js');
        less('jquery.ui.editor/plugins/history/jquery.ui.editor.history.less');

        js('jquery.ui.editor/plugins/viewsource/jquery.ui.editor.viewsource.js');
        less('jquery.ui.editor/plugins/viewsource/jquery.ui.editor.viewsource.less');

        js('jquery.ui.editor/plugins/guides/jquery.ui.editor.guides.js');
        less('jquery.ui.editor/plugins/guides/jquery.ui.editor.guides.less');

        js('jquery.ui.editor/plugins/save/jquery.ui.editor.save.js');

        js('jquery.ui.editor/plugins/paste/jquery.ui.editor.paste.js');
        less('jquery.ui.editor/plugins/paste/jquery.ui.editor.paste.less');

        js('jquery.ui.editor/plugins/cancel/jquery.ui.editor.cancel.js');

        js('jquery.ui.editor/plugins/list/jquery.ui.editor.list.js');
        less('jquery.ui.editor/plugins/list/jquery.ui.editor.list.less');

        js('jquery.ui.editor/plugins/fontsize/jquery.ui.editor.fontsize.js');
        less('jquery.ui.editor/plugins/fontsize/jquery.ui.editor.fontsize.less');

        js('jquery.ui.editor/plugins/hr/jquery.ui.editor.hr.js');
        less('jquery.ui.editor/plugins/hr/jquery.ui.editor.hr.less');

        js('jquery.ui.editor/plugins/blockquote/jquery.ui.editor.blockquote.js');
        less('jquery.ui.editor/plugins/blockquote/jquery.ui.editor.blockquote.less');

        js('jquery.ui.editor/plugins/tagmenu/jquery.ui.editor.tagmenu.js');
        less('jquery.ui.editor/plugins/tagmenu/jquery.ui.editor.tagmenu.less');

        js('jquery.ui.editor/plugins/link/jquery.ui.editor.link.js');
        less('jquery.ui.editor/plugins/link/jquery.ui.editor.link.less');

        js('jquery.ui.editor/plugins/unsavededitwarning/jquery.ui.editor.unsavededitwarning.js');
        less('jquery.ui.editor/plugins/unsavededitwarning/jquery.ui.editor.unsavededitwarning.less');

        js('jquery.ui.editor/plugins/i18n/jquery.ui.editor.i18n.js');
        js('jquery.ui.editor/plugins/i18n/locales/en.js');
        js('jquery.ui.editor/plugins/i18n/locales/zh_CN.js');
        less('jquery.ui.editor/plugins/i18n/jquery.ui.editor.i18n.less');
    }
    
})(document);
