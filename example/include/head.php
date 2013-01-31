<?php
    $type = isset($_GET['type']) ? $_GET['type'] : 'include';
?>
<meta charset="utf-8" />
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
<link rel="stylesheet" href="../assets/style.css" />
<?php if ($type === 'light'): ?>
    <link rel="stylesheet" href="../../src/dependencies/themes/aristo/jquery-ui.css" />
    <link rel="stylesheet" href="../../src/theme/theme.css" />
    <script src="../../src/dependencies/jquery.js"></script>
    <script src="../../src/dependencies/jquery-ui.js"></script>
    <script src="../../packages/raptor.light.min.js"></script>
<?php elseif ($type === 'rails'): ?>
    <link rel="stylesheet" type="text/css" href="../../src/dependencies/themes/redmond/jquery-ui.css" />
    <link rel="stylesheet" href="../../packages/raptor-front-end.css" />
    <script src="../../src/dependencies/jquery.js"></script>
    <script src="../../src/dependencies/jquery-ui.js"></script>
    <script src="../../packages/raptor.rails.js"></script>
<?php elseif ($type === 'mammoth'): ?>
    <link rel="stylesheet" href="../../src/dependencies/themes/aristo/jquery-ui.css" />
    <link rel="stylesheet" href="../../packages/raptor-front-end.css" />
    <script src="../../src/dependencies/jquery.js"></script>
    <script src="../../src/dependencies/jquery-ui.js"></script>
    <script src="../../packages/raptor.mammoth.js"></script>
<?php elseif ($type === 'include'): ?>
    <?php $uri = '../../src/'; include '../../src/include.php'; ?>
<?php endif; ?>
