<!doctype html>
<html>
<head>
    <?php $uri = '/jquery-raptor.com/private/jquery-raptor/src/'; include '../src/include.php'; ?>
	<script2 src="../packages/raptor.min.js"></script2>
	<script type="text/javascript" src="helpers.js"></script>
	<script type="text/javascript" src="diff.js"></script>
    <link type="text/css" rel="stylesheet" href="diff.css"/>
    <script type="text/javascript">
        function runTest(name) {
            $('.test-template').each(function() {
                var node = this;
                $.get('cases/' + name + '/test.js').done(function(js) {
                    var original = node.innerHTML,
                        text = $(node).text(),
                        start = text.indexOf('{'),
                        end = text.indexOf('}') - 1,
                        expected = $('<div/>').addClass('test-expected'),
                        after = null,
                        input = null,
                        output = null,
                        diff = null,
                        wrapper = null;
                    input = node.innerHTML.replace('{', '').replace('}', '');
                    $.ui.editor.instances[0].setHtml(input);
                    setSelectionRange($.ui.editor.instances[0].element.get(0), start, end);
                    eval(js);
                    after = $.ui.editor.instances[0].getHtml();
                    $('.test-results').append(wrapper = $('<div/>').addClass('test-wrapper'));
                    wrapper.append($('<h2/>').html(name + ' ' + $(node).data('name')));
                    wrapper.append(input = $('<div/>').addClass('test-input').html(original));
                    wrapper.append(output = $('<div/>').addClass('test-output').html(node.innerHTML));
                    wrapper.append(diff = $('<div/>').addClass('test-diff'));
                    wrapper.append(expected);
                    $.get('cases/' + name + '/output/' + $(node).data('name') + '.html').done(function(content) {
                        content = $(content).wrap('<div/>').parent().find('.test-template').html();
                        expected.html(content);
                        diff.html(diffstr(content, after));
                        if (after == content) {
                            wrapper.addClass('pass');
                        } else {
                            wrapper.addClass('fail');
                        }
                    });
                    node.innerHTML = original;
                });
            });
        }
        $(function() {
            $('.dummy-editor').editor({
                autoEnable: true,
                urlPrefix: '/jquery-raptor.com/private/jquery-raptor/src/'
            });
            runTest('toggle-wrapper-1');
        });
    </script>
    <style type="text/css">
        body {
            font-family: Arial, Helvetica, sans-serif;
        }

        del {
            background-color: #FFE6E6;
        }

        ins {
            background-color: #E6FFE6;
        }

        hr {
            margin: 20px;
        }

        .ui-editor-wrapper,
        .test-templates {
            display: none;
        }

        .test-results:before {
            content: "Results: ";
            background: #587CBF;
            width: 100%;
            display: block;
        }
        .test-results {
            border: 1px solid #587CBF;
        }

        .test-input:before {
            content: "Input: ";
            background: #587CBF;
            width: 100%;
            display: block;
        }
        .test-input {
            border: 1px solid #587CBF;
        }

        .test-output:before {
            content: "Output: ";
            background: #587CBF;
            width: 100%;
            display: block;
        }
        .test-output {
            border: 1px solid #587CBF;
        }

        .test-expected:before {
            content: "Expected: ";
            background: #587CBF;
            width: 100%;
            display: block;
        }
        .test-expected {
            border: 1px solid #587CBF;
        }

        .test-diff:before {
            content: "Differences: ";
            background: #587CBF;
            width: 100%;
            display: block;
        }
        .test-diff {
            border: 1px solid #587CBF;
        }

        .pass:before {
            content: "Pass: ";
            background: #B8DC3C;
            width: 100%;
            display: block;
        }
        .pass {
            margin: 5px;
            border: 2px solid #B8DC3C;
        }
        .pass .test-input,
        .pass .test-output,
        .pass .test-expected,
        .pass .test-diff {
            display: none;
        }

        .fail:before {
            content: "Fail: ";
            background: #CB2402;
            width: 100%;
            display: block;
        }
        .fail {
            margin: 5px;
            border: 2px solid #CB2402;
        }
    </style>
</head>
<body>
    <div class="test-results"></div>
    <div class="test-templates">
        <?php
            foreach (glob(__DIR__ . '/templates/*.html') as $file) {
                include $file;
            }
        ?>
    </div>
    <div class="dummy-editor"></div>
</body>
</html>
