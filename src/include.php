<?php $uri = isset($uri) ? $uri : '/jquery-raptor/'; ?>

<!-- Libraries -->
<script type="text/javascript">
    if (typeof jQuery === 'undefined') {
        document.write('<script type="text/javascript" src="<?= $uri ?>dependencies/jquery.js"><' + '/script>');
    }
</script>
<script type="text/javascript">
    if (typeof jQuery.ui === 'undefined') {
        document.write('<script type="text/javascript" src="<?= $uri ?>dependencies/jquery-ui.js"><' + '/script>');
//        document.write('<link rel="stylesheet" href="<?= $uri ?>dependencies/themes/aristo/jquery-ui.css"/>');
//        document.write('<link rel="stylesheet" href="<?= $uri ?>dependencies/themes/smoothness/jquery-ui.css"/>');
        document.write('<link rel="stylesheet" href="<?= $uri ?>dependencies/themes/redmond/jquery-ui.css"/>');
    }
</script>
<script type="text/javascript" src="<?= $uri ?>dependencies/jquery-hotkeys.js"></script>
<script type="text/javascript" src="<?= $uri ?>dependencies/rangy/rangy-core.js"></script>
<script type="text/javascript" src="<?= $uri ?>dependencies/rangy/rangy-serializer.js"></script>
<script type="text/javascript" src="<?= $uri ?>dependencies/rangy/rangy-applier.js"></script>
<script type="text/javascript" src="<?= $uri ?>dependencies/rangy/rangy-cssclassapplier.js"></script>
<script type="text/javascript" src="<?= $uri ?>dependencies/rangy/rangy-selectionsaverestore.js"></script>
<script type="text/javascript" src="<?= $uri ?>dependencies/rangy/rangy-textrange.js"></script>
<script type="text/javascript" src="<?= $uri ?>dependencies/raptorize/jquery.raptorize.js"></script>

<script type="text/javascript" src="<?= $uri ?>dependencies/resizetable.js"></script>
<script type="text/javascript" src="<?= $uri ?>dependencies/goog-table.js"></script>

<!-- Theme -->
<link rel="stylesheet" type="text/css" href="<?= $uri ?>theme/theme.css"/>

<!-- Editor -->
<script type="text/javascript" src="<?= $uri ?>adapters/jquery-ui.js"></script>
<script type="text/javascript" src="<?= $uri ?>i18n.js"></script>
<script type="text/javascript" src="<?= $uri ?>locales/en.js"></script>
<script type="text/javascript" src="<?= $uri ?>init.js"></script>
<script type="text/javascript" src="<?= $uri ?>support.js"></script>
<script type="text/javascript" src="<?= $uri ?>tools/action.js"></script>
<script type="text/javascript" src="<?= $uri ?>tools/clean.js"></script>
<script type="text/javascript" src="<?= $uri ?>tools/dock.js"></script>
<script type="text/javascript" src="<?= $uri ?>tools/element.js"></script>
<script type="text/javascript" src="<?= $uri ?>tools/fragment.js"></script>
<script type="text/javascript" src="<?= $uri ?>tools/list.js"></script>
<script type="text/javascript" src="<?= $uri ?>tools/persist.js"></script>
<script type="text/javascript" src="<?= $uri ?>tools/range.js"></script>
<script type="text/javascript" src="<?= $uri ?>tools/selection.js"></script>
<script type="text/javascript" src="<?= $uri ?>tools/string.js"></script>
<script type="text/javascript" src="<?= $uri ?>tools/state.js"></script>
<script type="text/javascript" src="<?= $uri ?>tools/style.js"></script>
<script type="text/javascript" src="<?= $uri ?>tools/table.js"></script>
<script type="text/javascript" src="<?= $uri ?>tools/template.js"></script>
<script type="text/javascript" src="<?= $uri ?>tools/types.js"></script>
<script type="text/javascript" src="<?= $uri ?>raptor.js"></script>
<script type="text/javascript" src="<?= $uri ?>raptor-widget.js"></script>
<script type="text/javascript" src="<?= $uri ?>components/plugin.js"></script>
<script type="text/javascript" src="<?= $uri ?>components/ui/button.js"></script>
<script type="text/javascript" src="<?= $uri ?>components/ui/preview-button.js"></script>
<script type="text/javascript" src="<?= $uri ?>components/ui/filtered-preview-button.js"></script>
<script type="text/javascript" src="<?= $uri ?>components/ui/css-class-applier-button.js"></script>
<script type="text/javascript" src="<?= $uri ?>components/ui/menu.js"></script>
<script type="text/javascript" src="<?= $uri ?>components/ui/select-menu.js"></script>
<script type="text/javascript" src="<?= $uri ?>components/ui/custom-menu.js"></script>
<script type="text/javascript" src="<?= $uri ?>components/layout/toolbar.js"></script>
<script type="text/javascript" src="<?= $uri ?>components/layout/word.js"></script>
<script type="text/javascript" src="<?= $uri ?>components/layout/aloha.js"></script>
<script type="text/javascript" src="<?= $uri ?>presets/base.js"></script>
<script type="text/javascript" src="<?= $uri ?>presets/full.js"></script>

<!-- Plugins -->
<script type="text/javascript" src="<?= $uri ?>plugins/cancel/cancel.js"></script>
<script type="text/javascript" src="<?= $uri ?>plugins/clear-formatting/clear-formatting.js"></script>
<script type="text/javascript" src="<?= $uri ?>plugins/click-button-to-edit/click-button-to-edit.js"></script>
<script type="text/javascript" src="<?= $uri ?>plugins/color-picker-basic/color-picker-basic.js"></script>

<script type="text/javascript" src="<?= $uri ?>plugins/dock/dock-to-screen.js"></script>
<script type="text/javascript" src="<?= $uri ?>plugins/dock/dock-to-element.js"></script>

<script type="text/javascript" src="<?= $uri ?>plugins/embed/embed.js"></script>

<script type="text/javascript" src="<?= $uri ?>plugins/float/float-left.js"></script>
<script type="text/javascript" src="<?= $uri ?>plugins/float/float-none.js"></script>
<script type="text/javascript" src="<?= $uri ?>plugins/float/float-right.js"></script>

<script type="text/javascript" src="<?= $uri ?>plugins/guides/guides.js"></script>

<script type="text/javascript" src="<?= $uri ?>plugins/history/history-redo.js"></script>
<script type="text/javascript" src="<?= $uri ?>plugins/history/history-undo.js"></script>

<script type="text/javascript" src="<?= $uri ?>plugins/hr/hr-create.js"></script>

<script type="text/javascript" src="<?= $uri ?>plugins/link/link-create.js"></script>
<script type="text/javascript" src="<?= $uri ?>plugins/link/link-remove.js"></script>
<script type="text/javascript" src="<?= $uri ?>plugins/link/link-type-email.js"></script>
<script type="text/javascript" src="<?= $uri ?>plugins/link/link-type-external.js"></script>
<script type="text/javascript" src="<?= $uri ?>plugins/link/link-type-internal.js"></script>

<script type="text/javascript" src="<?= $uri ?>plugins/list/list-ordered.js"></script>
<script type="text/javascript" src="<?= $uri ?>plugins/list/list-unordered.js"></script>

<script type="text/javascript" src="<?= $uri ?>plugins/logo/logo.js"></script>

<script type="text/javascript" src="<?= $uri ?>plugins/save/save.js"></script>
<script type="text/javascript" src="<?= $uri ?>plugins/save/save-json.js"></script>
<script type="text/javascript" src="<?= $uri ?>plugins/save/save-rest.js"></script>

<script type="text/javascript" src="<?= $uri ?>plugins/statistics/statistics.js"></script>

<script type="text/javascript" src="<?= $uri ?>plugins/table/table-cell-button.js"></script>
<script type="text/javascript" src="<?= $uri ?>plugins/table/table-create.js"></script>
<script type="text/javascript" src="<?= $uri ?>plugins/table/table-delete-column.js"></script>
<script type="text/javascript" src="<?= $uri ?>plugins/table/table-delete-row.js"></script>
<script type="text/javascript" src="<?= $uri ?>plugins/table/table-insert-column.js"></script>
<script type="text/javascript" src="<?= $uri ?>plugins/table/table-insert-row.js"></script>
<script type="text/javascript" src="<?= $uri ?>plugins/table/table-merge-cells.js"></script>
<script type="text/javascript" src="<?= $uri ?>plugins/table/table-split-cells.js"></script>

<script type="text/javascript" src="<?= $uri ?>plugins/tag-tree/tag-tree.js"></script>
<script type="text/javascript" src="<?= $uri ?>plugins/tag-menu/tag-menu.js"></script>

<script type="text/javascript" src="<?= $uri ?>plugins/text-align/left.js"></script>
<script type="text/javascript" src="<?= $uri ?>plugins/text-align/right.js"></script>
<script type="text/javascript" src="<?= $uri ?>plugins/text-align/center.js"></script>
<script type="text/javascript" src="<?= $uri ?>plugins/text-align/justify.js"></script>

<script type="text/javascript" src="<?= $uri ?>plugins/text-style/bold.js"></script>
<script type="text/javascript" src="<?= $uri ?>plugins/text-style/block-quote.js"></script>
<script type="text/javascript" src="<?= $uri ?>plugins/text-style/italic.js"></script>
<script type="text/javascript" src="<?= $uri ?>plugins/text-style/size-decrease.js"></script>
<script type="text/javascript" src="<?= $uri ?>plugins/text-style/size-increase.js"></script>
<script type="text/javascript" src="<?= $uri ?>plugins/text-style/strike.js"></script>
<script type="text/javascript" src="<?= $uri ?>plugins/text-style/sub.js"></script>
<script type="text/javascript" src="<?= $uri ?>plugins/text-style/super.js"></script>
<script type="text/javascript" src="<?= $uri ?>plugins/text-style/underline.js"></script>

<script type="text/javascript" src="<?= $uri ?>plugins/unsaved-edit-warning/unsaved-edit-warning.js"></script>
<script type="text/javascript" src="<?= $uri ?>plugins/view-source/view-source.js"></script>