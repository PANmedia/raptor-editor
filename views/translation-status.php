<h1>Translation Status</h1>
<table>
     <thead>
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
        <td><?php echo $data['nativeName']; ?></td>
        <td><?php echo $name; ?></td>
        <td>
            <?php if (isset($data['contributors'])): ?>
                <?php foreach ($data['contributors'] as $contributor): ?>
                <strong><?php echo $contributor['name']; ?></strong> <em><?php echo $contributor['email']; ?></em> <a href="<?php echo $contributor['link']; ?>" title="<?php echo $contributor['name']; ?>"><?php echo $contributor['link']; ?></a>
                <?php endforeach; ?>
            <?php else: ?>
            <em>Not specified</em>
            <?php endif; ?>
        </td>
        <td>
            <?php echo $data['percent']; ?>%
            <?php if ($data['untranslated']): ?>
            <a onclick="rpToggle(this, '<?php echo $name; ?>-untranslated')" href="#<?php echo $name; ?>-untranslated">View untranslated</a>
            <div id="<?php echo $name; ?>-untranslated" style="display:none">
                <?php foreach ($data['untranslated'] as $untranslated): ?>
                <p><?php echo $untranslated; ?></p>
                <?php endforeach; ?>
            </div>
            <?php endif; ?>
        </td>
    </tr>
<?php endforeach; ?>
    </tbody>
</table>

<script type="text/javascript">
    function rpToggle(a, id) {
        console.log(a);
        var div = document.getElementById(id);
        a.innerText = div.style.display == 'none' ? 'Hide untranslated' : 'View untranslated';
        div.style.display = div.style.display == 'none' ? 'block' : 'none';
    }
</script>