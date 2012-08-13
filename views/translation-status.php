<?= "<?php ob_start(); ?>" ?>
<h1>Translation Status</h1>
<?= "<?= (new XMod\CMS\Block('translation-status-content'))->owner(__NAMESPACE__)->content(ob_get_clean()); ?>"; ?>
<table class="ui-widget ui-state-default">
     <thead  class="ui-widget ui-state-active">
        <tr>
            <th>Name</th>
            <th>Filename</th>
            <th>Contributors</th>
            <th>Status</th>
        </tr>
    </thead>
<tbody>
<?php foreach ($result as $name => $data): ?>
    <tr>
        <td><?= $data['nativeName']; ?></td>
        <td><?= $name; ?></td>
        <td>
            <?php if (isset($data['contributors'])): ?>
                <?php foreach ($data['contributors'] as $contributor): ?>
                <strong><?= $contributor['name']; ?></strong> <em><?= $contributor['email']; ?></em> <a href="<?= $contributor['link']; ?>" title="<?= $contributor['name']; ?>"><?= $contributor['link']; ?></a>
                <?php endforeach; ?>
            <?php else: ?>
            <em>Not specified</em>
            <?php endif; ?>
        </td>
        <td>
            <?= $data['percent']; ?>%
            <?php if ($data['untranslated']): ?>
            - <a class="toggle-untranslated" href="#<?= $name; ?>-untranslated">View untranslated</a>
            <div name="<?= $name; ?>-untranslated" class="untranslated-content" style="display:none">
                <?php foreach ($data['untranslated'] as $untranslated): ?>
                <p><?= $untranslated; ?></p>
                <?php endforeach; ?>
            </div>
            <?php endif; ?>
        </td>
    </tr>
<?php endforeach; ?>
    </tbody>
</table>

<script type="text/javascript">
    $('.toggle-untranslated').click(function(event) {
        event.preventDefault();
        var div = $(this).closest('tr').find('.untranslated-content').clone();
        div.css({
            maxHeight: 400,
            overflowY: 'auto'
        });
        div.dialog({
            title: 'Untranslated ' + $(this).closest('tr').find('td').html() + ' content',
            modal: true,
            minWidth: 400,
            close: function() {
                $(this).dialog('destroy').remove();
            }
        });
    });
</script>