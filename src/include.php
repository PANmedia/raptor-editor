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
<script type="text/javascript" src="<?php echo $uri ?>dependencies/jquery-hotkeys.js"></script>
<script type="text/javascript" src="<?php echo $uri ?>dependencies/rangy/rangy-core.js"></script>
<script type="text/javascript" src="<?php echo $uri ?>dependencies/rangy/rangy-serializer.js"></script>
<script type="text/javascript" src="<?php echo $uri ?>dependencies/rangy/rangy-applier.js"></script>
<script type="text/javascript" src="<?php echo $uri ?>dependencies/rangy/rangy-cssclassapplier.js"></script>
<script type="text/javascript" src="<?php echo $uri ?>dependencies/rangy/rangy-selectionsaverestore.js"></script>
<script type="text/javascript" src="<?php echo $uri ?>dependencies/rangy/rangy-textrange.js"></script>
<script type="text/javascript" src="<?php echo $uri ?>dependencies/raptorize/jquery.raptorize.js"></script>

<!-- Theme -->
<link rel="stylesheet" type="text/css" href="<?php echo $uri ?>theme/theme.css"/>

<!-- Editor -->
<script type="text/javascript" src="<?php echo $uri ?>adapters/jquery-ui.js"></script>
<script type="text/javascript" src="<?php echo $uri ?>jquery.ui.editor.i18n.js"></script>
<script type="text/javascript" src="<?php echo $uri ?>locales/en.js"></script>
<script type="text/javascript" src="<?php echo $uri ?>jquery.ui.editor.init.js"></script>
<script type="text/javascript" src="<?php echo $uri ?>jquery.ui.editor.support.js"></script>
<script type="text/javascript" src="<?php echo $uri ?>tools/action.js"></script>
<script type="text/javascript" src="<?php echo $uri ?>tools/clean.js"></script>
<script type="text/javascript" src="<?php echo $uri ?>tools/dock.js"></script>
<script type="text/javascript" src="<?php echo $uri ?>tools/element.js"></script>
<script type="text/javascript" src="<?php echo $uri ?>tools/fragment.js"></script>
<script type="text/javascript" src="<?php echo $uri ?>tools/list.js"></script>
<script type="text/javascript" src="<?php echo $uri ?>tools/persist.js"></script>
<script type="text/javascript" src="<?php echo $uri ?>tools/range.js"></script>
<script type="text/javascript" src="<?php echo $uri ?>tools/selection.js"></script>
<script type="text/javascript" src="<?php echo $uri ?>tools/string.js"></script>
<script type="text/javascript" src="<?php echo $uri ?>tools/state.js"></script>
<script type="text/javascript" src="<?php echo $uri ?>tools/style.js"></script>
<script type="text/javascript" src="<?php echo $uri ?>tools/table.js"></script>
<script type="text/javascript" src="<?php echo $uri ?>tools/template.js"></script>
<script type="text/javascript" src="<?php echo $uri ?>tools/types.js"></script>
<script type="text/javascript" src="<?php echo $uri ?>raptor.js"></script>
<script type="text/javascript" src="<?php echo $uri ?>jquery.ui.editor.js"></script>
<script type="text/javascript" src="<?php echo $uri ?>components/plugin.js"></script>
<script type="text/javascript" src="<?php echo $uri ?>ui/components/button.js"></script>
<script type="text/javascript" src="<?php echo $uri ?>ui/components/preview-button.js"></script>
<script type="text/javascript" src="<?php echo $uri ?>ui/components/filtered-preview-button.js"></script>
<script type="text/javascript" src="<?php echo $uri ?>ui/components/css-class-applier-button.js"></script>
<script type="text/javascript" src="<?php echo $uri ?>ui/components/menu.js"></script>
<script type="text/javascript" src="<?php echo $uri ?>ui/components/select-menu.js"></script>
<script type="text/javascript" src="<?php echo $uri ?>ui/components/custom-menu.js"></script>
<script type="text/javascript" src="<?php echo $uri ?>ui/layout/toolbar.js"></script>
<script type="text/javascript" src="<?php echo $uri ?>ui/layout/word.js"></script>
<script type="text/javascript" src="<?php echo $uri ?>ui/layout/aloha.js"></script>
<script type="text/javascript" src="<?php echo $uri ?>presets/default.js"></script>

<!-- Plugins -->
<script type="text/javascript" src="<?php echo $uri ?>plugins/cancel/cancel.js"></script>
<script type="text/javascript" src="<?php echo $uri ?>plugins/clear-formatting/clear-formatting.js"></script>
<script type="text/javascript" src="<?php echo $uri ?>plugins/click-button-to-edit/click-button-to-edit.js"></script>
<script type="text/javascript" src="<?php echo $uri ?>plugins/color-picker-basic/color-picker-basic.js"></script>

<script type="text/javascript" src="<?php echo $uri ?>plugins/dock/dock-to-screen.js"></script>
<script type="text/javascript" src="<?php echo $uri ?>plugins/dock/dock-to-element.js"></script>

<script type="text/javascript" src="<?php echo $uri ?>plugins/embed/embed.js"></script>

<script type="text/javascript" src="<?php echo $uri ?>plugins/float/float-left.js"></script>
<script type="text/javascript" src="<?php echo $uri ?>plugins/float/float-none.js"></script>
<script type="text/javascript" src="<?php echo $uri ?>plugins/float/float-right.js"></script>

<script type="text/javascript" src="<?php echo $uri ?>plugins/guides/guides.js"></script>

<script type="text/javascript" src="<?php echo $uri ?>plugins/history/history-redo.js"></script>
<script type="text/javascript" src="<?php echo $uri ?>plugins/history/history-undo.js"></script>

<script type="text/javascript" src="<?php echo $uri ?>plugins/hr/hr-create.js"></script>

<script type="text/javascript" src="<?php echo $uri ?>plugins/link/link-create.js"></script>
<script type="text/javascript" src="<?php echo $uri ?>plugins/link/link-remove.js"></script>
<script type="text/javascript" src="<?php echo $uri ?>plugins/link/link-type-email.js"></script>
<script type="text/javascript" src="<?php echo $uri ?>plugins/link/link-type-external.js"></script>
<script type="text/javascript" src="<?php echo $uri ?>plugins/link/link-type-internal.js"></script>

<script type="text/javascript" src="<?php echo $uri ?>plugins/list/list-ordered.js"></script>
<script type="text/javascript" src="<?php echo $uri ?>plugins/list/list-unordered.js"></script>

<script type="text/javascript" src="<?php echo $uri ?>plugins/logo/logo.js"></script>

<script type="text/javascript" src="<?php echo $uri ?>plugins/save/save.js"></script>
<script type="text/javascript" src="<?php echo $uri ?>plugins/statistics/statistics.js"></script>

<script type="text/javascript" src="<?php echo $uri ?>plugins/table/table-cell-button.js"></script>
<script type="text/javascript" src="<?php echo $uri ?>plugins/table/table-create.js"></script>
<script type="text/javascript" src="<?php echo $uri ?>plugins/table/table-delete-column.js"></script>
<script type="text/javascript" src="<?php echo $uri ?>plugins/table/table-delete-row.js"></script>
<script type="text/javascript" src="<?php echo $uri ?>plugins/table/table-insert-column.js"></script>
<script type="text/javascript" src="<?php echo $uri ?>plugins/table/table-insert-row.js"></script>

<script type="text/javascript" src="<?php echo $uri ?>plugins/tag-tree/tag-tree.js"></script>
<script type="text/javascript" src="<?php echo $uri ?>plugins/tag-menu/tag-menu.js"></script>

<script type="text/javascript" src="<?php echo $uri ?>plugins/text-align/left.js"></script>
<script type="text/javascript" src="<?php echo $uri ?>plugins/text-align/right.js"></script>
<script type="text/javascript" src="<?php echo $uri ?>plugins/text-align/center.js"></script>
<script type="text/javascript" src="<?php echo $uri ?>plugins/text-align/justify.js"></script>

<script type="text/javascript" src="<?php echo $uri ?>plugins/text-style/bold.js"></script>
<script type="text/javascript" src="<?php echo $uri ?>plugins/text-style/block-quote.js"></script>
<script type="text/javascript" src="<?php echo $uri ?>plugins/text-style/italic.js"></script>
<script type="text/javascript" src="<?php echo $uri ?>plugins/text-style/size-decrease.js"></script>
<script type="text/javascript" src="<?php echo $uri ?>plugins/text-style/size-increase.js"></script>
<script type="text/javascript" src="<?php echo $uri ?>plugins/text-style/strike.js"></script>
<script type="text/javascript" src="<?php echo $uri ?>plugins/text-style/sub.js"></script>
<script type="text/javascript" src="<?php echo $uri ?>plugins/text-style/super.js"></script>
<script type="text/javascript" src="<?php echo $uri ?>plugins/text-style/underline.js"></script>

<script type="text/javascript" src="<?php echo $uri ?>plugins/unsaved-edit-warning/unsaved-edit-warning.js"></script>
<script type="text/javascript" src="<?php echo $uri ?>plugins/view-source/view-source.js"></script>