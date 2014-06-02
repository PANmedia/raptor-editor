<?php $i = 0; ?>
<!doctype html>
<html>
<head>
    <script type="text/javascript" src="../../js/case.js"></script>
</head>
<body class="simple">
    <div class="test-<?= ++$i ?>">
        <h1>Convert Elements <?= $i ?></h1>
        <div class="test-input">
            <div>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas
                convallis dui id erat pellentesque et rhoncus nunc semper. Suspendisse
                malesuada hendrerit velit nec tristique. Aliquam gravida mauris at
                ligula venenatis rhoncus. Suspendisse interdum, nisi nec consectetur
                pulvinar, lorem augue ornare felis, vel lacinia erat nibh in velit.
            </div>
        </div>
        <div class="test-expected">
            <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas
                convallis dui id erat pellentesque et rhoncus nunc semper. Suspendisse
                malesuada hendrerit velit nec tristique. Aliquam gravida mauris at
                ligula venenatis rhoncus. Suspendisse interdum, nisi nec consectetur
                pulvinar, lorem augue ornare felis, vel lacinia erat nibh in velit.
            </p>
        </div>
    </div>
    <script type="text/javascript">
        test('.test-<?= $i ?>', function() {
            cleanReplaceElements('.test-<?= $i ?> .test-output', {
                div: '<p/>'
            });
        });
    </script>

    <div class="test-<?= ++$i ?>">
        <h1>Convert Elements <?= $i ?></h1>
        <div class="test-input">
            <div>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas
                convallis dui id erat pellentesque et rhoncus nunc semper. Suspendisse
                malesuada hendrerit velit nec tristique. Aliquam gravida mauris at
                ligula venenatis rhoncus. Suspendisse interdum, nisi nec consectetur
                pulvinar, lorem augue ornare felis, vel lacinia erat nibh in velit.
            </div>
            <div>
                In hac habitasse platea dictumst. Donec pulvinar vestibulum viverra.
                Ut ut volutpat lectus. Mauris fermentum pretium urna, tristique pretium
                sapien fringilla quis. Donec enim urna, lobortis in sagittis sed,
                semper a mauris. Pellentesque tempus, ligula ut tempus malesuada, nisl
                arcu facilisis nisl, ut fringilla tellus ligula vitae libero.
            </div>
            <div>
                Aliquam id vulputate magna. Cum sociis natoque penatibus et magnis dis
                parturient montes, nascetur ridiculus mus. Vestibulum quis elit urna,
                sed accumsan nulla. Suspendisse porta odio quis sem ornare at vehicula
                urna dignissim.
            </div>
        </div>
        <div class="test-expected">
            <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas
                convallis dui id erat pellentesque et rhoncus nunc semper. Suspendisse
                malesuada hendrerit velit nec tristique. Aliquam gravida mauris at
                ligula venenatis rhoncus. Suspendisse interdum, nisi nec consectetur
                pulvinar, lorem augue ornare felis, vel lacinia erat nibh in velit.
            </p>
            <p>
                In hac habitasse platea dictumst. Donec pulvinar vestibulum viverra.
                Ut ut volutpat lectus. Mauris fermentum pretium urna, tristique pretium
                sapien fringilla quis. Donec enim urna, lobortis in sagittis sed,
                semper a mauris. Pellentesque tempus, ligula ut tempus malesuada, nisl
                arcu facilisis nisl, ut fringilla tellus ligula vitae libero.
            </p>
            <p>
                Aliquam id vulputate magna. Cum sociis natoque penatibus et magnis dis
                parturient montes, nascetur ridiculus mus. Vestibulum quis elit urna,
                sed accumsan nulla. Suspendisse porta odio quis sem ornare at vehicula
                urna dignissim.
            </p>
        </div>
    </div>
    <script type="text/javascript">
        test('.test-<?= $i ?>', function() {
            cleanReplaceElements('.test-<?= $i ?> .test-output', {
                div: '<p/>'
            });
        });
    </script>

    <div class="test-<?= ++$i ?>">
        <h1>Convert Elements <?= $i ?></h1>
        <div class="test-input">
            <div>
                <div>
                    <div>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas
                        convallis dui id erat pellentesque et rhoncus nunc semper. Suspendisse
                        malesuada hendrerit velit nec tristique. Aliquam gravida mauris at
                        ligula venenatis rhoncus. Suspendisse interdum, nisi nec consectetur
                        pulvinar, lorem augue ornare felis, vel lacinia erat nibh in velit.
                    </div>
                </div>
            </div>
        </div>
        <div class="test-expected">
            <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas
                convallis dui id erat pellentesque et rhoncus nunc semper. Suspendisse
                malesuada hendrerit velit nec tristique. Aliquam gravida mauris at
                ligula venenatis rhoncus. Suspendisse interdum, nisi nec consectetur
                pulvinar, lorem augue ornare felis, vel lacinia erat nibh in velit.
            </p>
        </div>
    </div>
    <script type="text/javascript">
        test('.test-<?= $i ?>', function() {
            cleanReplaceElements('.test-<?= $i ?> .test-output', {
                div: '<p/>'
            });
            cleanUnnestElement('.test-<?= $i ?> .test-output', 'p');
        });
    </script>

    <div class="test-<?= ++$i ?>">
        <h1>Convert Elements <?= $i ?></h1>
        <div class="test-input">
            <div class="some-class" style="color: red" data-foo="bar">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas
                convallis dui id erat pellentesque et rhoncus nunc semper. Suspendisse
                malesuada hendrerit velit nec tristique. Aliquam gravida mauris at
                ligula venenatis rhoncus. Suspendisse interdum, nisi nec consectetur
                pulvinar, lorem augue ornare felis, vel lacinia erat nibh in velit.
            </div>
        </div>
        <div class="test-expected">
            <p class="some-class" style="color: red" data-foo="bar">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas
                convallis dui id erat pellentesque et rhoncus nunc semper. Suspendisse
                malesuada hendrerit velit nec tristique. Aliquam gravida mauris at
                ligula venenatis rhoncus. Suspendisse interdum, nisi nec consectetur
                pulvinar, lorem augue ornare felis, vel lacinia erat nibh in velit.
            </p>
        </div>
    </div>
    <script type="text/javascript">
        test('.test-<?= $i ?>', function() {
            cleanReplaceElements('.test-<?= $i ?> .test-output', {
                div: '<p/>'
            });
        });
    </script>

    <div class="test-<?= ++$i ?>">
        <h1>Convert Elements <?= $i ?></h1>
        <div class="test-input">
            <div>
                <div>
                    <div>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas
                        convallis dui id erat pellentesque et rhoncus nunc semper. Suspendisse
                        malesuada hendrerit velit nec tristique. Aliquam gravida mauris at
                        ligula venenatis rhoncus. Suspendisse interdum, nisi nec consectetur
                        pulvinar, lorem augue ornare felis, vel lacinia erat nibh in velit.
                    </div>
                    <div>
                        In hac habitasse platea dictumst. Donec pulvinar vestibulum viverra.
                        Ut ut volutpat lectus. Mauris fermentum pretium urna, tristique pretium
                        sapien fringilla quis. Donec enim urna, lobortis in sagittis sed,
                        semper a mauris. Pellentesque tempus, ligula ut tempus malesuada, nisl
                        arcu facilisis nisl, ut fringilla tellus ligula vitae libero.
                    </div>
                </div>
                <div>
                    Aliquam id vulputate magna. Cum sociis natoque penatibus et magnis dis
                    parturient montes, nascetur ridiculus mus. Vestibulum quis elit urna,
                    sed accumsan nulla. Suspendisse porta odio quis sem ornare at vehicula
                    urna dignissim.
                </div>
            </div>
        </div>
        <div class="test-expected">
            <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas
                convallis dui id erat pellentesque et rhoncus nunc semper. Suspendisse
                malesuada hendrerit velit nec tristique. Aliquam gravida mauris at
                ligula venenatis rhoncus. Suspendisse interdum, nisi nec consectetur
                pulvinar, lorem augue ornare felis, vel lacinia erat nibh in velit.
            </p>
            <p>
                In hac habitasse platea dictumst. Donec pulvinar vestibulum viverra.
                Ut ut volutpat lectus. Mauris fermentum pretium urna, tristique pretium
                sapien fringilla quis. Donec enim urna, lobortis in sagittis sed,
                semper a mauris. Pellentesque tempus, ligula ut tempus malesuada, nisl
                arcu facilisis nisl, ut fringilla tellus ligula vitae libero.
            </p>
            <p>
                Aliquam id vulputate magna. Cum sociis natoque penatibus et magnis dis
                parturient montes, nascetur ridiculus mus. Vestibulum quis elit urna,
                sed accumsan nulla. Suspendisse porta odio quis sem ornare at vehicula
                urna dignissim.
            </p>
        </div>
    </div>
    <script type="text/javascript">
        test('.test-<?= $i ?>', function() {
            cleanReplaceElements('.test-<?= $i ?> .test-output', {
                div: '<p/>'
            });
            cleanEmptyElements($('.test-<?= $i ?> .test-output'), ['p']);
            cleanUnnestElement('.test-<?= $i ?> .test-output', 'p');
        });
    </script>
</body>
</html>