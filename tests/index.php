<?php
    if (!isset($baseURI)) {
        $baseURI = '';
    }
    include 'index-find-groups.php';
?>
<!doctype html>
<html>
    <head>
        <meta charset="utf-8" />
        <meta http-equiv="cache-control" content="no-cache" />
        <base href="<?= $baseURI ?>"/>
        <link type="text/css" rel="stylesheet" href="css/theme.css"/>
        <link type="text/css" rel="stylesheet" href="css/theme.icons.datauri.css"/>
        <link type="text/css" rel="stylesheet" href="css/tests.css"/>
        <script type="text/javascript" src="../../raptor-dependencies/jquery.js"></script>
        <script type="text/javascript" src="index-process-groups.js"></script>
    </head>
    <body>
        <div class="tests-notification">
            <div class="ui-state-highlight">
                <span class="ui-icon spinner"></span>
                <h2>Your tests are running</h2>
                <p>This may take a few minutes</p>
            </div>
        </div>
        <?php if (!empty($warnings)): ?>
            <div class="test-warnings-frame ui-state-warning">
                <h2>Warnings: </h2>
                <ul class="test-warnings">
                    <?php foreach ($warnings as $warning): ?>
                        <li><?= $warning ?></li>
                <?php endforeach; ?>
                </ul>
            </div>
        <?php endif; ?>
        <div>
        <h2>Tests: </h2>
        <div class="content">
            <div class="summary"></div>
            <div class="buttons">
                <button class="run-all">Run All Tests</button>
                <button class="run-selected">Run Selected Tests</button><br/>
                This may take several minutes
            </div>
            <div class="clear"></div>
            <div class="tests">
                <?php $i = 1; ?>
                <?php foreach ($groups as $group): ?>
                    <div class="group ui-state-default" data-path="<?= $group['path'] ?>">
                        <div class="number">
                            <label><input class="group-check" type="checkbox"><?= $i ?></label>
                        </div>
                        <div class="group-header">
                            <div class="ui-widget ui-notification">
                                <div class="group-content ui-state-default ui-corner-all">
                                    <button class="test-button run-group">Run Group</button>
                                    <span class="icon ui-icon"></span>
                                    <div class="title">
                                        <strong><?= $group['name'] ?></strong>
                                        <span class="group-pass-fail-ratio" style="display: none;"><span class="group-passes">0</span>/<?= sizeof($group['tests']) ?> items passed</span>
                                    </div>
                                    <div class="description">
                                        <p><?= $group['description'] ?></p>
                                    </div>
                                    <div class="clear"></div>
                                </div>
                            </div>
                        </div>
                        <?php $k = 0; foreach ($group["tests"] as $item): ?>
                            <div class="item ui-state-default" style="display: none;" data-file-name="<?= $item['filename'] ?>">
                                <div class="number">
                                    <label><input class="item-check" type="checkbox"><?= $i . chr(97 + $k++) ?></label>
                                </div>
                                <div class="item-header">
                                    <div class="ui-widget ui-notification">
                                        <div class="item-content ui-state-default ui-corner-all" >
                                            <button class="test-button run-test">Run Test</button>
                                            <button class="test-button view-test">View Test</button>
                                            <span class="icon ui-icon"></span>
                                            <div class="title">
                                                <strong><?= $item['name'] ?></strong>
                                                <span class="items-pass-fail-ratio" style="display: none;"></span>
                                            </div>
                                            <div class="description">
                                                <?= $item['description'] ?>
                                            </div>
                                            <div class="error-message" style="display: none;"></div>
                                            <div class="clear"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        <?php endforeach; ?>
                    </div>
                    <div class="clear"></div>
                <?php $i++; ?>
                <?php endforeach; ?>
            </div>
            <div class="buttons">
                <button class="run-all">Run All Tests</button>
                <button class="run-selected">Run Selected Tests</button>
                This may take several minutes
            </div>
            <div class="iframes"></div>
            </div>
        </div>
    </body>
</html>
