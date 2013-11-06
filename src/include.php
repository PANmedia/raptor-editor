<?php
if (!defined('RAPTOR_SRC')) {
    define('RAPTOR_SRC', isset($uri) ? $uri : '/src/');
}
?>

<!-- Libraries -->
<script type="text/javascript">
    if (typeof jQuery === 'undefined') {
        document.write('<script type="text/javascript" src="<?= RAPTOR_SRC ?>dependencies/jquery.js"><' + '/script>');
    }
</script>
<script type="text/javascript">
    if (typeof jQuery.ui === 'undefined') {
        document.write('<script type="text/javascript" src="<?= RAPTOR_SRC ?>dependencies/jquery-ui.js"><' + '/script>');
//        document.write('<link rel="stylesheet" href="<?= RAPTOR_SRC ?>dependencies/themes/aristo/jquery-ui.css"/>');
//        document.write('<link rel="stylesheet" href="<?= RAPTOR_SRC ?>dependencies/themes/smoothness/jquery-ui.css"/>');
//        document.write('<link rel="stylesheet" href="<?= RAPTOR_SRC ?>dependencies/themes/redmond/jquery-ui.css"/>');
        document.write('<link rel="stylesheet" type="text/css" href="<?= RAPTOR_SRC ?>dependencies/themes/mammoth/theme.css" />');
        document.write('<link rel="stylesheet" type="text/css" href="<?= RAPTOR_SRC ?>dependencies/themes/mammoth/theme-icons.css" />');
    }
</script>
<script type="text/javascript" src="<?= RAPTOR_SRC ?>dependencies/jquery-hotkeys.js"></script>
<script type="text/javascript" src="<?= RAPTOR_SRC ?>dependencies/rangy/rangy-core.js"></script>
<script type="text/javascript" src="<?= RAPTOR_SRC ?>dependencies/rangy/rangy-serializer.js"></script>
<script type="text/javascript" src="<?= RAPTOR_SRC ?>dependencies/rangy/rangy-applier.js"></script>
<script type="text/javascript" src="<?= RAPTOR_SRC ?>dependencies/rangy/rangy-cssclassapplier.js"></script>
<script type="text/javascript" src="<?= RAPTOR_SRC ?>dependencies/rangy/rangy-selectionsaverestore.js"></script>
<script type="text/javascript" src="<?= RAPTOR_SRC ?>dependencies/rangy/rangy-textrange.js"></script>

<script type="text/javascript" src="<?= RAPTOR_SRC ?>dependencies/resizetable.js"></script>
<script type="text/javascript" src="<?= RAPTOR_SRC ?>dependencies/diff.js"></script>
<script type="text/javascript" src="<?= RAPTOR_SRC ?>dependencies/goog-table.js"></script>

<!-- Theme -->
<link rel="stylesheet" type="text/css" href="<?= RAPTOR_SRC ?>../packages/raptor.css"/>
<link rel="stylesheet" type="text/css" href="<?= RAPTOR_SRC ?>../packages/raptor-front-end.css"/>

<!-- Editor -->
<script type="text/javascript" src="<?= RAPTOR_SRC ?>adapters/jquery-ui.js"></script>
<script type="text/javascript" src="<?= RAPTOR_SRC ?>i18n.js"></script>
<script type="text/javascript" src="<?= RAPTOR_SRC ?>locales/en.js"></script>
<script type="text/javascript" src="<?= RAPTOR_SRC ?>locales/de.js"></script>
<script type="text/javascript" src="<?= RAPTOR_SRC ?>locales/es.js"></script>
<script type="text/javascript" src="<?= RAPTOR_SRC ?>locales/fr.js"></script>
<script type="text/javascript" src="<?= RAPTOR_SRC ?>locales/nl.js"></script>
<script type="text/javascript" src="<?= RAPTOR_SRC ?>locales/ru.js"></script>
<script type="text/javascript" src="<?= RAPTOR_SRC ?>locales/sv.js"></script>
<script type="text/javascript" src="<?= RAPTOR_SRC ?>locales/zh-CN.js"></script>
<script type="text/javascript" src="<?= RAPTOR_SRC ?>init.js"></script>
<script type="text/javascript" src="<?= RAPTOR_SRC ?>support.js"></script>
<script type="text/javascript" src="<?= RAPTOR_SRC ?>tools/action.js"></script>
<script type="text/javascript" src="<?= RAPTOR_SRC ?>tools/clean.js"></script>
<script type="text/javascript" src="<?= RAPTOR_SRC ?>tools/dock.js"></script>
<script type="text/javascript" src="<?= RAPTOR_SRC ?>tools/element.js"></script>
<script type="text/javascript" src="<?= RAPTOR_SRC ?>tools/fragment.js"></script>
<script type="text/javascript" src="<?= RAPTOR_SRC ?>tools/list.js"></script>
<script type="text/javascript" src="<?= RAPTOR_SRC ?>tools/node.js"></script>
<script type="text/javascript" src="<?= RAPTOR_SRC ?>tools/persist.js"></script>
<script type="text/javascript" src="<?= RAPTOR_SRC ?>tools/range.js"></script>
<script type="text/javascript" src="<?= RAPTOR_SRC ?>tools/selection.js"></script>
<script type="text/javascript" src="<?= RAPTOR_SRC ?>tools/string.js"></script>
<script type="text/javascript" src="<?= RAPTOR_SRC ?>tools/state.js"></script>
<script type="text/javascript" src="<?= RAPTOR_SRC ?>tools/style.js"></script>
<script type="text/javascript" src="<?= RAPTOR_SRC ?>tools/table.js"></script>
<script type="text/javascript" src="<?= RAPTOR_SRC ?>tools/template.js"></script>
<script type="text/javascript" src="<?= RAPTOR_SRC ?>tools/types.js"></script>
<script type="text/javascript" src="<?= RAPTOR_SRC ?>raptor.js"></script>
<script type="text/javascript" src="<?= RAPTOR_SRC ?>raptor-widget.js"></script>
<script type="text/javascript" src="<?= RAPTOR_SRC ?>components/plugin.js"></script>
<script type="text/javascript" src="<?= RAPTOR_SRC ?>components/layout.js"></script>
<script type="text/javascript" src="<?= RAPTOR_SRC ?>components/ui/button.js"></script>
<script type="text/javascript" src="<?= RAPTOR_SRC ?>components/ui/preview-button.js"></script>
<script type="text/javascript" src="<?= RAPTOR_SRC ?>components/ui/preview-toggle-button.js"></script>
<script type="text/javascript" src="<?= RAPTOR_SRC ?>components/ui/toggle-button.js"></script>
<script type="text/javascript" src="<?= RAPTOR_SRC ?>components/ui/dialog-button.js"></script>
<script type="text/javascript" src="<?= RAPTOR_SRC ?>components/ui/dialog-toggle-button.js"></script>
<script type="text/javascript" src="<?= RAPTOR_SRC ?>components/ui/filtered-preview-button.js"></script>
<script type="text/javascript" src="<?= RAPTOR_SRC ?>components/ui/css-class-applier-button.js"></script>
<script type="text/javascript" src="<?= RAPTOR_SRC ?>components/ui/menu-button.js"></script>
<script type="text/javascript" src="<?= RAPTOR_SRC ?>components/ui/menu.js"></script>
<script type="text/javascript" src="<?= RAPTOR_SRC ?>components/ui/select-menu.js"></script>
<script type="text/javascript" src="<?= RAPTOR_SRC ?>components/ui/custom-menu.js"></script>
<script type="text/javascript" src="<?= RAPTOR_SRC ?>components/layout/ui-group.js"></script>
<script type="text/javascript" src="<?= RAPTOR_SRC ?>components/layout/messages.js"></script>
<script type="text/javascript" src="<?= RAPTOR_SRC ?>components/layout/toolbar.js"></script>
<script type="text/javascript" src="<?= RAPTOR_SRC ?>components/layout/hover-panel.js"></script>

<!-- Preset -->
<script type="text/javascript" src="<?= RAPTOR_SRC ?>presets/base.js"></script>
<script type="text/javascript" src="<?= RAPTOR_SRC ?>presets/full.js"></script>
<script type="text/javascript" src="<?= RAPTOR_SRC ?>presets/micro.js"></script>

<!-- Plugins -->
<script type="text/javascript" src="<?= RAPTOR_SRC ?>plugins/cancel/cancel.js"></script>
<script type="text/javascript" src="<?= RAPTOR_SRC ?>plugins/class-menu/class-menu.js"></script>
<script type="text/javascript" src="<?= RAPTOR_SRC ?>plugins/clear-formatting/clear-formatting.js"></script>
<script type="text/javascript" src="<?= RAPTOR_SRC ?>plugins/click-button-to-edit/click-button-to-edit.js"></script>
<script type="text/javascript" src="<?= RAPTOR_SRC ?>plugins/color-menu-basic/color-menu-basic.js"></script>

<script type="text/javascript" src="<?= RAPTOR_SRC ?>plugins/dock/dock-plugin.js"></script>
<script type="text/javascript" src="<?= RAPTOR_SRC ?>plugins/dock/dock-to-screen.js"></script>
<script type="text/javascript" src="<?= RAPTOR_SRC ?>plugins/dock/dock-to-element.js"></script>

<script type="text/javascript" src="<?= RAPTOR_SRC ?>plugins/embed/embed.js"></script>
<script type="text/javascript" src="<?= RAPTOR_SRC ?>plugins/insert-file/insert-file.js"></script>
<script type="text/javascript" src="<?= RAPTOR_SRC ?>plugins/language-menu/language-menu.js"></script>

<script type="text/javascript" src="<?= RAPTOR_SRC ?>plugins/float/float-left.js"></script>
<script type="text/javascript" src="<?= RAPTOR_SRC ?>plugins/float/float-none.js"></script>
<script type="text/javascript" src="<?= RAPTOR_SRC ?>plugins/float/float-right.js"></script>

<script type="text/javascript" src="<?= RAPTOR_SRC ?>plugins/guides/guides.js"></script>

<script type="text/javascript" src="<?= RAPTOR_SRC ?>plugins/history/history-redo.js"></script>
<script type="text/javascript" src="<?= RAPTOR_SRC ?>plugins/history/history-undo.js"></script>

<script type="text/javascript" src="<?= RAPTOR_SRC ?>plugins/hr/hr-create.js"></script>

<script type="text/javascript" src="<?= RAPTOR_SRC ?>plugins/image-resize-button/image-resize-button.js"></script>

<script type="text/javascript" src="<?= RAPTOR_SRC ?>plugins/link/link-create.js"></script>
<script type="text/javascript" src="<?= RAPTOR_SRC ?>plugins/link/link-remove.js"></script>
<script type="text/javascript" src="<?= RAPTOR_SRC ?>plugins/link/link-type-email.js"></script>
<script type="text/javascript" src="<?= RAPTOR_SRC ?>plugins/link/link-type-external.js"></script>
<script type="text/javascript" src="<?= RAPTOR_SRC ?>plugins/link/link-type-document.js"></script>
<script type="text/javascript" src="<?= RAPTOR_SRC ?>plugins/link/link-type-internal.js"></script>

<script type="text/javascript" src="<?= RAPTOR_SRC ?>plugins/list/list-ordered.js"></script>
<script type="text/javascript" src="<?= RAPTOR_SRC ?>plugins/list/list-unordered.js"></script>

<script type="text/javascript" src="<?= RAPTOR_SRC ?>plugins/logo/logo.js"></script>

<script type="text/javascript" src="<?= RAPTOR_SRC ?>plugins/normalise-line-breaks/normalise-line-breaks.js"></script>
<script type="text/javascript" src="<?= RAPTOR_SRC ?>plugins/no-break/no-break.js"></script>

<script type="text/javascript" src="<?= RAPTOR_SRC ?>plugins/paste/paste.js"></script>

<script type="text/javascript" src="<?= RAPTOR_SRC ?>plugins/placeholder/placeholder.js"></script>

<script type="text/javascript" src="<?= RAPTOR_SRC ?>plugins/save/save.js"></script>
<script type="text/javascript" src="<?= RAPTOR_SRC ?>plugins/save/save-json.js"></script>
<script type="text/javascript" src="<?= RAPTOR_SRC ?>plugins/save/save-rest.js"></script>

<script type="text/javascript" src="<?= RAPTOR_SRC ?>plugins/snippet-menu/snippet-menu.js"></script>

<script type="text/javascript" src="<?= RAPTOR_SRC ?>plugins/special-characters/special-characters.js"></script>

<script type="text/javascript" src="<?= RAPTOR_SRC ?>plugins/statistics/statistics.js"></script>

<script type="text/javascript" src="<?= RAPTOR_SRC ?>plugins/table/table-cell-button.js"></script>
<script type="text/javascript" src="<?= RAPTOR_SRC ?>plugins/table/table-create.js"></script>
<script type="text/javascript" src="<?= RAPTOR_SRC ?>plugins/table/table-delete-column.js"></script>
<script type="text/javascript" src="<?= RAPTOR_SRC ?>plugins/table/table-delete-row.js"></script>
<script type="text/javascript" src="<?= RAPTOR_SRC ?>plugins/table/table-insert-column.js"></script>
<script type="text/javascript" src="<?= RAPTOR_SRC ?>plugins/table/table-insert-row.js"></script>
<script type="text/javascript" src="<?= RAPTOR_SRC ?>plugins/table/table-merge-cells.js"></script>
<script type="text/javascript" src="<?= RAPTOR_SRC ?>plugins/table/table-split-cells.js"></script>
<script type="text/javascript" src="<?= RAPTOR_SRC ?>plugins/table/table-support.js"></script>

<script type="text/javascript" src="<?= RAPTOR_SRC ?>plugins/tag-menu/tag-menu.js"></script>

<script type="text/javascript" src="<?= RAPTOR_SRC ?>plugins/text-align/text-align-button.js"></script>
<script type="text/javascript" src="<?= RAPTOR_SRC ?>plugins/text-align/left.js"></script>
<script type="text/javascript" src="<?= RAPTOR_SRC ?>plugins/text-align/right.js"></script>
<script type="text/javascript" src="<?= RAPTOR_SRC ?>plugins/text-align/center.js"></script>
<script type="text/javascript" src="<?= RAPTOR_SRC ?>plugins/text-align/justify.js"></script>

<script type="text/javascript" src="<?= RAPTOR_SRC ?>plugins/text-style/bold.js"></script>
<script type="text/javascript" src="<?= RAPTOR_SRC ?>plugins/text-style/block-quote.js"></script>
<script type="text/javascript" src="<?= RAPTOR_SRC ?>plugins/text-style/italic.js"></script>
<script type="text/javascript" src="<?= RAPTOR_SRC ?>plugins/text-style/size-decrease.js"></script>
<script type="text/javascript" src="<?= RAPTOR_SRC ?>plugins/text-style/size-increase.js"></script>
<script type="text/javascript" src="<?= RAPTOR_SRC ?>plugins/text-style/strike.js"></script>
<script type="text/javascript" src="<?= RAPTOR_SRC ?>plugins/text-style/sub.js"></script>
<script type="text/javascript" src="<?= RAPTOR_SRC ?>plugins/text-style/super.js"></script>
<script type="text/javascript" src="<?= RAPTOR_SRC ?>plugins/text-style/underline.js"></script>

<script type="text/javascript" src="<?= RAPTOR_SRC ?>plugins/tool-tip/tool-tip.js"></script>

<script type="text/javascript" src="<?= RAPTOR_SRC ?>plugins/unsaved-edit-warning/unsaved-edit-warning.js"></script>

<script type="text/javascript" src="<?= RAPTOR_SRC ?>plugins/view-source/view-source.js"></script>

<script type="text/javascript" src="<?= RAPTOR_SRC ?>expose.js"></script>
