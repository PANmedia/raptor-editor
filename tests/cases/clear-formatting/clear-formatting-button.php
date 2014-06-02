<?php $i = 0; ?>
<!doctype html>
<html>
<head>
    <script type="text/javascript" src="../../js/case.js"></script>
    <?php include __DIR__ . '/../../include.php'; ?>
</head>
<body class="simple">
    <script type="text/javascript">
        rangy.init();
    </script>

    <div class="test-<?= ++$i ?>">
        <h1>Clear Formatting Button <?= $i ?>: Empty Element</h1>
        <div class="test-input">
            <div class="editable">{}</div>
        </div>
        <div class="test-expected">
            <div class="editable">{}</div>
        </div>
    </div>
    <script type="text/javascript">
        testEditor('.test-<?= $i ?>', function(input) {
            clickButton(input, '.raptor-ui-clear-formatting');
            rangesToTokens(rangy.getSelection().getAllRanges());
        });
    </script>

    <div class="test-<?= ++$i ?>">
        <h1>Clear Formatting Button <?= $i ?>: Basic</h1>
        <div class="test-input">
            <div class="editable">
                <p>
                    Test 1 {paragraph 1 start.
                    <strong class="cms-bold">Some bold text.</strong>
                    Test 1 paragraph} 1 end.
                </p>
            </div>
        </div>
        <div class="test-expected">
            <div class="editable">
                <p>
                    Test 1 {paragraph 1 start.
                    Some bold text.
                    Test 1 paragraph} 1 end.
                </p>
            </div>
        </div>
    </div>
    <script type="text/javascript">
        testEditor('.test-<?= $i ?>', function(input) {
            clickButton(input, '.raptor-ui-clear-formatting');
            rangesToTokens(rangy.getSelection().getAllRanges());
        });
    </script>

    <div class="test-<?= ++$i ?>">
        <h1>Clear Formatting Button <?= $i ?>: Complex</h1>
        <div class="test-input">
            <div class="editable">
                <p>
                    Paragraph 1
                    <em class="cms-italic">{Some italic text</em>
                </p>
                <ol>
                    <li>
                        <del class="cms-strike">Some strike text in a list</del>
                    </li>
                </ol>
                <p>
                    <em class="cms-italic">Some more italic text</em>
                    Paragraph} 2
                </p>
            </div>
        </div>
        <div class="test-expected">
            <div class="editable">
                <p>
                    Paragraph 1 {
                </p>
                <p>
                    Some italic text Some strike text in a list Some more italic text Paragraph
                </p>
                <p>
                    } 2
                </p>
            </div>
        </div>
    </div>
    <script type="text/javascript">
        testEditor('.test-<?= $i ?>', function(input) {
            clickButton(input, '.raptor-ui-clear-formatting');
            rangesToTokens(rangy.getSelection().getAllRanges());
        });
    </script>

    <div class="test-<?= ++$i ?>">
        <h1>Clear Formatting Button <?= $i ?>: Multi Basic</h1>
        <div class="test-input">
            <div class="editable">
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas
                    convallis {dui id <strong class="cms-bold">erat pellentesque</strong> et rhoncus} nunc semper. Suspendisse
                    malesuada hendrerit velit nec tristique. Aliquam gravida mauris at
                    ligula venenatis rhoncus. <em class="cms-italic">Suspendisse interdum, nisi nec consectetur</em>
                    pulvinar, lorem augue ornare felis, vel lacinia erat nibh in velit.
                </p>
            </div>
        </div>
        <div class="test-expected">
            <div class="editable">
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas
                    convallis {dui id erat pellentesque et rhoncus} nunc semper. Suspendisse
                    malesuada hendrerit velit nec tristique. Aliquam gravida mauris at
                    ligula venenatis rhoncus. <em class="cms-italic">Suspendisse interdum, nisi nec consectetur</em>
                    pulvinar, lorem augue ornare felis, vel lacinia erat nibh in velit.
                </p>
            </div>
        </div>
    </div>
    <script type="text/javascript">
        testEditor('.test-<?= $i ?>', function(input) {
            clickButton(input, '.raptor-ui-clear-formatting');
            rangesToTokens(rangy.getSelection().getAllRanges());
        });
    </script>

    <div class="test-<?= ++$i ?>">
        <h1>Clear Formatting Button <?= $i ?>: Multi Paragraph Basic</h1>
        <div class="test-input">
            <div class="editable">
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas
                    convallis dui {<strong class="cms-bold">id erat pellentesque et rhoncus nunc semper. Suspendisse
                    malesuada hendrerit velit nec tristique.</strong>
                </p>
                <p>
                    <strong class="cms-bold">Aliquam gravida mauris at
                    ligula venenatis rhoncus. Suspendisse</strong>} interdum, nisi nec consectetur
                    pulvinar, lorem augue ornare felis, vel lacinia erat nibh in velit.
                </p>
            </div>
        </div>
        <div class="test-expected">
            <div class="editable">
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas convallis dui {
                </p>
                <p>
                    id erat pellentesque et rhoncus nunc semper. Suspendisse malesuada hendrerit velit nec tristique. Aliquam gravida mauris at ligula venenatis rhoncus. Suspendisse
                </p>
                <p>
                    } interdum, nisi nec consectetur pulvinar, lorem augue ornare felis, vel lacinia erat nibh in velit.
                </p>
            </div>
        </div>
    </div>
    <script type="text/javascript">
        testEditor('.test-<?= $i ?>', function(input) {
            clickButton(input, '.raptor-ui-clear-formatting');
            rangesToTokens(rangy.getSelection().getAllRanges());
        });
    </script>

    <div class="test-<?= ++$i ?>">
        <h1>Clear Formatting Button <?= $i ?>: Multi Paragraph Complex</h1>
        <div class="test-input">
            <div class="editable">
                <p>
                    Lorem ipsum {<strong class="cms-bold">dolor sit amet, consectetur adipiscing elit. Maecenas
                    convallis dui id erat pellentesque et rhoncus nunc semper. Suspendisse
                    malesuada <span class="cms-underline">hendrerit velit nec tristique.</span></strong>
                </p><p>
                    <span class="cms-underline cms-bold">Aliquam gravida mauris at
                    ligula</span>
                </p>
                <ul><li><span class="cms-underline cms-bold">venenatis rhoncus.</span></li></ul>
                <p><span class="cms-underline"><strong class="cms-bold"> Suspendisse}</strong> interdum, nisi</span> nec consectetur
                    pulvinar, lorem augue ornare felis, vel lacinia erat nibh in velit.
                </p>
            </div>
        </div>
        <div class="test-expected">
            <div class="editable">
                <p>
                    Lorem ipsum {
                </p>
                <p>
                    dolor sit amet, consectetur adipiscing elit. Maecenas convallis dui id erat pellentesque et rhoncus nunc semper. Suspendisse malesuada hendrerit velit nec tristique. Aliquam gravida mauris at ligula venenatis rhoncus. Suspendisse
                </p>
                <p>
                    <span class="cms-underline">
                        } interdum, nisi
                    </span>
                    nec consectetur pulvinar, lorem augue ornare felis, vel lacinia erat nibh in velit.
                </p>
            </div>
        </div>
    </div>
    <script type="text/javascript">
        testEditor('.test-<?= $i ?>', function(input) {
            clickButton(input, '.raptor-ui-clear-formatting');
            rangesToTokens(rangy.getSelection().getAllRanges());
        });
    </script>

    <div class="test-<?= ++$i ?>">
        <h1>Clear Formatting Button <?= $i ?>: Alignment</h1>
        <div class="test-input">
            <div class="editable">
                <p class="cms-center">
                    {Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas
                    convallis dui id erat <span class="cms-underline">pellentesque et rhoncus nunc semper. Suspendisse
                    malesuada hendrerit velit} nec tristique.</span>
                </p>
                <p>
                    Aliquam gravida mauris at
                    ligula venenatis rhoncus. Suspendisse interdum, nisi nec consectetur
                    pulvinar, lorem augue ornare felis, vel lacinia erat nibh in velit.
                </p>
            </div>
        </div>
        <div class="test-expected">
            <div class="editable">
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas convallis dui id erat pellentesque et rhoncus nunc semper. Suspendisse malesuada hendrerit velit
                </p>
                <p class="cms-center">
                    <span class="cms-underline">
                        nec tristique.
                    </span>
                </p>
                <p>
                    Aliquam gravida mauris at ligula venenatis rhoncus. Suspendisse interdum, nisi nec consectetur pulvinar, lorem augue ornare felis, vel lacinia erat nibh in velit.
                </p>
            </div>
        </div>
    </div>
    <script type="text/javascript">
        testEditor('.test-<?= $i ?>', function(input) {
            clickButton(input, '.raptor-ui-clear-formatting');
            rangesToTokens(rangy.getSelection().getAllRanges());
        });
    </script>

    <div class="test-<?= ++$i ?>">
        <h1>Clear Formatting Button <?= $i ?>: Two Different Alignments</h1>
        <div class="test-input">
            <div class="editable">
                <p class="cms-right">
                    {Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas
                    convallis dui id erat pellentesque et rhoncus nunc semper. Suspendisse
                    malesuada hendrerit velit nec tristique.
                </p><p class="cms-left">
                    Aliquam gravida mauris at
                    ligula venenatis rhoncus. Suspendisse interdum, nisi nec consectetur
                    pulvinar, lorem augue ornare felis, vel lacinia erat nibh in velit.}
                </p>
            </div>
        </div>
        <div class="test-expected">
            <div class="editable">
                {
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas
                    convallis dui id erat pellentesque et rhoncus nunc semper. Suspendisse
                    malesuada hendrerit velit nec tristique.
                    Aliquam gravida mauris at
                    ligula venenatis rhoncus. Suspendisse interdum, nisi nec consectetur
                    pulvinar, lorem augue ornare felis, vel lacinia erat nibh in velit.
                </p>
                }
            </div>
        </div>
    </div>
    <script type="text/javascript">
        testEditor('.test-<?= $i ?>', function(input) {
            clickButton(input, '.raptor-ui-clear-formatting');
            rangesToTokens(rangy.getSelection().getAllRanges());
        });
    </script>

    <div class="test-<?= ++$i ?>">
        <h1>Clear Formatting Button <?= $i ?>: Alignment and Other Formatting</h1>
        <div class="test-input">
            <div class="editable">
                <p class="cms-right">
                    {Lorem ipsum <span class="cms-underline"> dolor sit amet, consectetur adipiscing elit. Maecenas
                    convallis dui id erat pellentesque et rhoncus nunc semper. Suspendisse
                    malesuada hendrerit velit nec tristique</span>.
                </p><p class="cms-left">
                    Aliquam gravida mauris at
                    ligula venenatis rhoncus. Suspendisse interdum, nisi nec consectetur
                    pulvinar, lorem augue ornare felis, vel lacinia erat nibh in velit.}
                </p>
            </div>
        </div>
        <div class="test-expected">
            <div class="editable">
                {
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas
                    convallis dui id erat pellentesque et rhoncus nunc semper. Suspendisse
                    malesuada hendrerit velit nec tristique.
                    Aliquam gravida mauris at
                    ligula venenatis rhoncus. Suspendisse interdum, nisi nec consectetur
                    pulvinar, lorem augue ornare felis, vel lacinia erat nibh in velit.
                </p>
                }
            </div>
        </div>
    </div>
    <script type="text/javascript">
        testEditor('.test-<?= $i ?>', function(input) {
            clickButton(input, '.raptor-ui-clear-formatting');
            rangesToTokens(rangy.getSelection().getAllRanges());
        });
    </script>

    <div class="test-<?= ++$i ?>">
        <h1>Clear Formatting Button <?= $i ?>: Removing bold</h1>
        <div class="test-input">
            <div class="editable">
                <p><strong>{Some bold text.}</strong></p>
            </div>
        </div>
        <div class="test-expected">
            <div class="editable">
                <p>{Some bold text.}</p>
            </div>
        </div>
    </div>
    <script type="text/javascript">
        testEditor('.test-<?= $i ?>', function(input) {
            clickButton(input, '.raptor-ui-clear-formatting');
            rangesToTokens(rangy.getSelection().getAllRanges());
        });
    </script>

    <div class="test-<?= ++$i ?>">
        <h1>Clear Formatting Button <?= $i ?>: Removing complex styling elements</h1>
        <div class="test-input">
            <div class="editable">
                <p><i><strong>{Some bold text.}</strong></i></p>
            </div>
        </div>
        <div class="test-expected">
            <div class="editable">
                <p>{Some bold text.}</p>
            </div>
        </div>
    </div>
    <script type="text/javascript">
        testEditor('.test-<?= $i ?>', function(input) {
            clickButton(input, '.raptor-ui-clear-formatting');
            rangesToTokens(rangy.getSelection().getAllRanges());
        });
    </script>
</body>
</html>
