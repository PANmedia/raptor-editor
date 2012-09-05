<?php $uri = isset($uri) ? $uri : '/jquery-raptor/'; ?>

<!-- Libraries -->
<script type="text/javascript">
    if (typeof jQuery === 'undefined') {
        document.write('<script type="text/javascript" src="<?php echo $uri ?>dependencies/jquery.js"><' + '/script>');
    }
</script>
<script type="text/javascript">
    if (typeof jQuery.ui === 'undefined') {
        document.write('<script type="text/javascript" src="<?php echo $uri ?>dependencies/jquery-ui.js"><' + '/script>');
//        document.write('<link rel="stylesheet" href="<?php echo $uri ?>dependencies/themes/aristo/jquery-ui.css"/>');
//        document.write('<link rel="stylesheet" href="<?php echo $uri ?>dependencies/themes/smoothness/jquery-ui.css"/>');
        document.write('<link rel="stylesheet" href="<?php echo $uri ?>dependencies/themes/redmond/jquery-ui.css"/>');
    }
</script>
<script type="text/javascript" src="<?php echo $uri ?>dependencies/rangy/rangy-core.js"></script>
<script type="text/javascript" src="<?php echo $uri ?>dependencies/rangy/rangy-serializer.js"></script>
<script type="text/javascript" src="<?php echo $uri ?>dependencies/rangy/rangy-cssclassapplier.js"></script>
<script type="text/javascript" src="<?php echo $uri ?>dependencies/rangy/rangy-selectionsaverestore.js"></script>
<script type="text/javascript" src="<?php echo $uri ?>dependencies/raptorize/jquery.raptorize.js"></script>

<!-- Theme -->
<link rel="stylesheet" type="text/css" href="<?php echo $uri ?>theme/theme.css"/>

<!-- Editor -->
<script type="text/javascript" src="<?php echo $uri ?>jquery.ui.editor.i18n.js"></script>
<script type="text/javascript" src="<?php echo $uri ?>jquery.ui.editor.init.js"></script>
<script type="text/javascript" src="<?php echo $uri ?>jquery.ui.editor.domtools.js"></script>
<script type="text/javascript" src="<?php echo $uri ?>jquery.ui.editor.support.js"></script>
<script type="text/javascript" src="<?php echo $uri ?>jquery.ui.editor.js"></script>
<script type="text/javascript" src="<?php echo $uri ?>tools/jquery.ui.editor.element.js"></script>
<script type="text/javascript" src="<?php echo $uri ?>tools/jquery.ui.editor.fragment.js"></script>
<script type="text/javascript" src="<?php echo $uri ?>tools/jquery.ui.editor.selection.js"></script>
<script type="text/javascript" src="<?php echo $uri ?>tools/jquery.ui.editor.range.js"></script>

<!-- Plugins -->
<script type="text/javascript" src="<?php echo $uri ?>plugins/toolbartip/jquery.ui.editor.toolbartip.js"></script>
<script type="text/javascript" src="<?php echo $uri ?>plugins/logo/jquery.ui.editor.logo.js"></script>
<script type="text/javascript" src="<?php echo $uri ?>plugins/dock/jquery.ui.editor.dock.js"></script>
<script type="text/javascript" src="<?php echo $uri ?>plugins/clicktoedit/jquery.ui.editor.clicktoedit.js"></script>
<script type="text/javascript" src="<?php echo $uri ?>plugins/color-picker-basic/jquery.ui.editor.color-picker-basic.js"></script>
<script type="text/javascript" src="<?php echo $uri ?>plugins/clean/jquery.ui.editor.clean.js"></script>
<script type="text/javascript" src="<?php echo $uri ?>plugins/clear-formatting/jquery.ui.editor.clear-formatting.js"></script>
<script type="text/javascript" src="<?php echo $uri ?>plugins/float/jquery.ui.editor.float.js"></script>
<script type="text/javascript" src="<?php echo $uri ?>plugins/alignment/jquery.ui.editor.alignment.js"></script>
<script type="text/javascript" src="<?php echo $uri ?>plugins/basic/jquery.ui.editor.basic.js"></script>
<script type="text/javascript" src="<?php echo $uri ?>plugins/history/jquery.ui.editor.history.js"></script>
<script type="text/javascript" src="<?php echo $uri ?>plugins/viewsource/jquery.ui.editor.viewsource.js"></script>
<script type="text/javascript" src="<?php echo $uri ?>plugins/guides/jquery.ui.editor.guides.js"></script>
<script type="text/javascript" src="<?php echo $uri ?>plugins/save/jquery.ui.editor.savejson.js"></script>
<script type="text/javascript" src="<?php echo $uri ?>plugins/save/jquery.ui.editor.saverest.js"></script>
<script type="text/javascript" src="<?php echo $uri ?>plugins/save/jquery.ui.editor.saveui.js"></script>
<script type="text/javascript" src="<?php echo $uri ?>plugins/raptorize/jquery.ui.editor.raptorize.js"></script>
<script type="text/javascript" src="<?php echo $uri ?>plugins/paste/jquery.ui.editor.paste.js"></script>
<script type="text/javascript" src="<?php echo $uri ?>plugins/cancel/jquery.ui.editor.cancel.js"></script>
<script type="text/javascript" src="<?php echo $uri ?>plugins/list/jquery.ui.editor.list.js"></script>
<script type="text/javascript" src="<?php echo $uri ?>plugins/fontsize/jquery.ui.editor.fontsize.js"></script>
<script type="text/javascript" src="<?php echo $uri ?>plugins/hr/jquery.ui.editor.hr.js"></script>
<script type="text/javascript" src="<?php echo $uri ?>plugins/blockquote/jquery.ui.editor.blockquote.js"></script>
<script type="text/javascript" src="<?php echo $uri ?>plugins/tagmenu/jquery.ui.editor.tagmenu.js"></script>
<script type="text/javascript" src="<?php echo $uri ?>plugins/link/jquery.ui.editor.link.js"></script>
<script type="text/javascript" src="<?php echo $uri ?>plugins/imageresize/jquery.ui.editor.imageresize.js"></script>
<script type="text/javascript" src="<?php echo $uri ?>plugins/unsavededitwarning/jquery.ui.editor.unsavededitwarning.js"></script>
<script type="text/javascript" src="<?php echo $uri ?>plugins/embed/jquery.ui.editor.embed.js"></script>
<script type="text/javascript" src="<?php echo $uri ?>plugins/length/jquery.ui.editor.length.js"></script>
<script type="text/javascript" src="<?php echo $uri ?>plugins/i18n/jquery.ui.editor.i18n.js"></script>
<script type="text/javascript" src="<?php echo $uri ?>plugins/i18n/locales/en.js"></script>
<script type="text/javascript" src="<?php echo $uri ?>plugins/i18n/locales/zh_CN.js"></script>
<script type="text/javascript" src="<?php echo $uri ?>plugins/debug/jquery.ui.editor.debug.js"></script>
<script type="text/javascript" src="<?php echo $uri ?>plugins/empty-element/jquery.ui.editor.empty-element.js"></script>
