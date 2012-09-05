<!doctype html>
<html>
<head>
	<script src="../../src/dependencies/jquery.js"></script>
    <script>
        var myCanvas;
        function createCanvasOverlay(color, canvasContainer) {
            canvasContainer = document.createElement('div');
            document.body.appendChild(canvasContainer);
            canvasContainer.style.position="absolute";
            canvasContainer.style.left="0px";
            canvasContainer.style.top="0px";
            canvasContainer.style.width="100%";
            canvasContainer.style.height="100%";
            canvasContainer.style.zIndex="1000";
            var superContainer=document.body;

            // Part of block below is inspired by code from Google excanvas.js
            {
                myCanvas = document.createElement('canvas');
                myCanvas.style.width = superContainer.scrollWidth+"px";
                myCanvas.style.height = superContainer.scrollHeight+"px";
                // You must set this otherwise the canvas will be streethed to fit the container
                myCanvas.width=superContainer.scrollWidth;
                myCanvas.height=superContainer.scrollHeight;
                //surfaceElement.style.width=window.innerWidth;
                myCanvas.style.overflow = 'visible';
                myCanvas.style.position = 'absolute';
            }

            var context=myCanvas.getContext('2d');
            context.fillStyle = color;
            context.fillRect(0,0, myCanvas.width, myCanvas.height);
            canvasContainer.appendChild(myCanvas);
            return context;
        }

        jQuery(function($) {
            var context = createCanvasOverlay('rgba(255,255,0,0.5)');
            $('th, td').each(function() {
                var y = $(this).offset().top;
                var x = $(this).offset().left;
                context.strokeStyle = "#FF1C0A";
                context.beginPath();
                context.moveTo(x - 5, y - 5);
                context.lineTo(x + 5, y + 5);
                context.moveTo(x + 5, y - 5);
                context.lineTo(x - 5, y + 5);
                context.closePath();
                context.stroke();
            });
        });
    </script>
    <style type="text/css">
        td, th {
            border: 1px solid #aaa;
            width: 100%;
        }

        .wrapper {
            margin: 100px auto;
            width: 300px;
        }
    </style>
</head>
<body>
    <div class="wrapper">
        <table>
            <thead>
                <tr>
                    <th>Header</th>
                    <th>Header</th>
                    <th>Header</th>
                    <td>Cell Header</td>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <th>Body Header</th>
                    <td>Cell</td>
                    <td>Cell</td>
                    <td>Cell</td>
                </tr>
                <tr>
                    <td>Cell</td>
                    <td>Cell</td>
                    <td>Cell</td>
                    <td>Cell</td>
                </tr>
            </tbody>
            <tfoot>
                <tr>
                    <th>Footer</th>
                    <th>Footer</th>
                    <th>Footer</th>
                    <td>Cell Footer</td>
                </tr>
            </tfoot>
        </table>
    </div>
    <div class="wrapper">
        <table>
            <thead>
                <tr>
                    <th>Header</th>
                    <th>Header</th>
                    <th>Header</th>
                    <td>Cell Header</td>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <th>Body Header</th>
                    <td>Cell</td>
                    <td>Cell</td>
                    <td>Cell</td>
                </tr>
                <tr>
                    <td>Cell</td>
                    <td>Cell</td>
                    <td>Cell</td>
                    <td>Cell</td>
                </tr>
            </tbody>
            <tfoot>
                <tr>
                    <th>Footer</th>
                    <th>Footer</th>
                    <th>Footer</th>
                    <td>Cell Footer</td>
                </tr>
            </tfoot>
        </table>
    </div>
    <div class="wrapper">
        <table>
            <thead>
                <tr>
                    <th>Header</th>
                    <th>Header</th>
                    <th>Header</th>
                    <td>Cell Header</td>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <th>Body Header</th>
                    <td>Cell</td>
                    <td>Cell</td>
                    <td>Cell</td>
                </tr>
                <tr>
                    <td>Cell</td>
                    <td>Cell</td>
                    <td>Cell</td>
                    <td>Cell</td>
                </tr>
            </tbody>
            <tfoot>
                <tr>
                    <th>Footer</th>
                    <th>Footer</th>
                    <th>Footer</th>
                    <td>Cell Footer</td>
                </tr>
            </tfoot>
        </table>
    </div>
    <div class="wrapper">
        <table>
            <thead>
                <tr>
                    <th>Header</th>
                    <th>Header</th>
                    <th>Header</th>
                    <td>Cell Header</td>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <th>Body Header</th>
                    <td>Cell</td>
                    <td>Cell</td>
                    <td>Cell</td>
                </tr>
                <tr>
                    <td>Cell</td>
                    <td>Cell</td>
                    <td>Cell</td>
                    <td>Cell</td>
                </tr>
            </tbody>
            <tfoot>
                <tr>
                    <th>Footer</th>
                    <th>Footer</th>
                    <th>Footer</th>
                    <td>Cell Footer</td>
                </tr>
            </tfoot>
        </table>
    </div>
</body>
</html>
