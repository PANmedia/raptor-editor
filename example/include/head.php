<?php $type = isset($_GET['type']) ? $_GET['type'] : 'include'; ?>
<meta charset="utf-8" />
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
<link rel="stylesheet" href="<?= RAPTOR_EDITOR_URI; ?>example/include/style.css" />
<?php if ($type === 'default'): ?>
    <link rel="stylesheet" type="text/css" href="<?= RAPTOR_EDITOR_URI; ?>src/dependencies/themes/mammoth/theme.css" />
    <link rel="stylesheet" type="text/css" href="<?= RAPTOR_EDITOR_URI; ?>src/dependencies/themes/mammoth/theme-icons.css" />
    <script src="<?= RAPTOR_PACKAGES_URI; ?>raptor.js"></script>
<?php elseif ($type === 'light'): ?>
    <link rel="stylesheet" type="text/css" href="<?= RAPTOR_EDITOR_URI; ?>src/dependencies/themes/aristo/jquery-ui.css" />
    <link rel="stylesheet" type="text/css" href="<?= RAPTOR_EDITOR_URI; ?>src/theme/theme.css" />
    <script src="<?= RAPTOR_EDITOR_URI; ?>src/dependencies/jquery.js"></script>
    <script src="<?= RAPTOR_EDITOR_URI; ?>src/dependencies/jquery-ui.js"></script>
    <script src="<?= RAPTOR_PACKAGES_URI; ?>raptor.light.min.js"></script>
<?php elseif ($type === 'rails'): ?>
    <link rel="stylesheet" type="text/css" href="<?= RAPTOR_EDITOR_URI; ?>src/dependencies/themes/redmond/jquery-ui.css" />
    <link rel="stylesheet" type="text/css" href="<?= RAPTOR_PACKAGES_URI; ?>raptor-front-end.css" />
    <script src="<?= RAPTOR_EDITOR_URI; ?>src/dependencies/jquery.js"></script>
    <script src="<?= RAPTOR_EDITOR_URI; ?>src/dependencies/jquery-ui.js"></script>
    <script src="<?= RAPTOR_PACKAGES_URI; ?>raptor.rails.js"></script>
<?php elseif ($type === 'mammoth'): ?>
    <link rel="stylesheet" type="text/css" href="<?= RAPTOR_EDITOR_URI; ?>src/dependencies/themes/mammoth/theme.css" />
    <link rel="stylesheet" type="text/css" href="<?= RAPTOR_EDITOR_URI; ?>src/dependencies/themes/mammoth/theme-icons.css" />
    <script src="<?= RAPTOR_EDITOR_URI; ?>src/dependencies/jquery.js"></script>
    <script src="<?= RAPTOR_EDITOR_URI; ?>src/dependencies/jquery-ui.js"></script>
    <script src="<?= RAPTOR_PACKAGES_URI; ?>raptor.mammoth.js"></script>
<?php elseif ($type === '0deps'): ?>
    <script src="<?= RAPTOR_PACKAGES_URI; ?>raptor.0deps.js"></script>
<?php elseif ($type === '0depsnc'): ?>
    <script src="<?= RAPTOR_PACKAGES_URI; ?>raptor.0depsnc.js"></script>
<?php elseif ($type === 'include'): ?>
    <?php loadRaptor(); ?>
<?php endif; ?>
