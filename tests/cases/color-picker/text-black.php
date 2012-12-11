<!doctype html>
<html>
<head>
    <script type="text/javascript" src="../../js/case.js"></script>
    <?php $uri = '../../../src/'; include '../../../src/include.php'; ?>
</head>
<body class="simple">
    <script type="text/javascript">
        rangy.init();
    </script>
    <div class="test-1">
        <h1>Text Black Button 1: Word Group Selection</h1>
        <div class="test-input">
            <div class="editible">
                <p>
                    <span class="cms-blue">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas
                    convallis {dui id erat pellentesque et rhoncus} nunc semper. Suspendisse
                    malesuada hendrerit velit nec tristique. Aliquam gravida mauris at
                    ligula venenatis rhoncus. Suspendisse interdum, nisi nec consectetur
                    pulvinar, lorem augue ornare felis, vel lacinia erat nibh in velit.</span>
                </p>
            </div>
        </div>
        <div class="test-expected">
            <div class="editible">
                <p>
                    <span class="cms-blue">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas
                    convallis</span><span class="cms-black">{dui id erat pellentesque et rhoncus}</span><span class="cms-blue"> nunc semper. Suspendisse
                    malesuada hendrerit velit nec tristique. Aliquam gravida mauris at
                    ligula venenatis rhoncus. Suspendisse interdum, nisi nec consectetur
                    pulvinar, lorem augue ornare felis, vel lacinia erat nibh in velit.</span>
                </p>
            </div>
        </div>
    </div>
<!--    <script type="text/javascript">
        testEditor('.test-1', function(input) {
            var boldButton = input.find('.editible').data('raptor').getLayout().getElement().find('.raptor-ui-text-bold');
            boldButton.trigger('click');
            rangesToTokens(rangy.getSelection().getAllRanges());
            
            if (!boldButton.is('.ui-state-active')){
                throw new Error('Button is not active');
            }
        });
    </script>-->

    <div class="test-2">
        <h1>Text Black Button 2: Single Word Selection</h1>
        <div class="test-input">
            <div class="editible">
                <p>
                    <span class="cms-blue">Lorem ipsum dolor sit amet, consectetur {adipiscing} elit. Maecenas
                    convallis dui id erat pellentesque et rhoncus nunc semper. Suspendisse
                    malesuada hendrerit velit nec tristique. Aliquam gravida mauris at
                    ligula venenatis rhoncus. Suspendisse interdum, nisi nec consectetur
                    pulvinar, lorem augue ornare felis, vel lacinia erat nibh in velit.</span>
                </p>
            </div>
        </div>
        <div class="test-expected">
            <div class="editible">
                <p>
                    <span class="cms-blue">Lorem ipsum dolor sit amet, consectetur </span><span class="cms-black">{adipiscing}</span><span class="cms-blue"> elit. Maecenas
                    convallis dui id erat pellentesque et rhoncus nunc semper. Suspendisse
                    malesuada hendrerit velit nec tristique. Aliquam gravida mauris at
                    ligula venenatis rhoncus. Suspendisse interdum, nisi nec consectetur
                    pulvinar, lorem augue ornare felis, vel lacinia erat nibh in velit.</span>
                </p>
            </div>
        </div>
    </div>
<!--    <script type="text/javascript">
        testEditor('.test-2', function(input) {
            var boldButton = input.find('.editible').data('raptor').getLayout().getElement().find('.raptor-ui-text-bold');
            boldButton.trigger('click');
            rangesToTokens(rangy.getSelection().getAllRanges());
            
            if (!boldButton.is('.ui-state-active')){
                throw new Error('Button is not active');
            }
        });
    </script>-->

    <div class="test-3">
        <h1>Text Black Button 3: Part Word Selection</h1>
        <div class="test-input">
            <div class="editible">
                <p>
                    <span class="cms-blue">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas
                    convallis dui id erat pel{lentesqu}e et rhoncus nunc semper. Suspendisse
                    malesuada hendrerit velit nec tristique. Aliquam gravida mauris at
                    ligula venenatis rhoncus. Suspendisse interdum, nisi nec consectetur
                    pulvinar, lorem augue ornare felis, vel lacinia erat nibh in velit.</span>
                </p>
            </div>
        </div>
        <div class="test-expected">
            <div class="editible">
                <p>
                    <span class="cms-blue">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas
                    convallis dui id erat pel<span class="cms-black">{lentesqu}</span>e et rhoncus nunc semper. Suspendisse
                    malesuada hendrerit velit nec tristique. Aliquam gravida mauris at
                    ligula venenatis rhoncus. Suspendisse interdum, nisi nec consectetur
                    pulvinar, lorem augue ornare felis, vel lacinia erat nibh in velit.</span>
                </p>
            </div>
        </div>
    </div>
<!--    <script type="text/javascript">
        testEditor('.test-3', function(input) {
            var boldButton = input.find('.editible').data('raptor').getLayout().getElement().find('.raptor-ui-text-bold');
            boldButton.trigger('click');
            rangesToTokens(rangy.getSelection().getAllRanges());
            
            if (!boldButton.is('.ui-state-active')){
                throw new Error('Button is not active');
            }
        });
    </script>-->

     <div class="test-4">
        <h1>Text Black Button 4: Multi-Paragraph Selection</h1>
        <div class="test-input">
            <div class="editible">
                <p>
                    <span class="cms-blue">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas
                    convallis dui {id erat pellentesque et rhoncus nunc semper. Suspendisse
                    malesuada hendrerit velit nec tristique.</span>
                </p>
                <p>
                    <span class="cms-blue">Aliquam gravida mauris at
                    ligula venenatis rhoncus. Suspendisse} interdum, nisi nec consectetur
                    pulvinar, lorem augue ornare felis, vel lacinia erat nibh in velit.</span>
                </p>
            </div>
        </div>
        <div class="test-expected">
            <div class="editible">
                <p>
                    <span class="cms-blue">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas
                    convallis dui </span><span class="cms-black">{id erat pellentesque et rhoncus nunc semper. Suspendisse
                    malesuada hendrerit velit nec tristique.
                </span></p>
                <p><span class="cms-black">
                    Aliquam gravida mauris at
                    ligula venenatis rhoncus. Suspendisse}</span><span class="cms-blue"> interdum, nisi nec consectetur
                    pulvinar, lorem augue ornare felis, vel lacinia erat nibh in velit.</span>
                </p>
            </div>
        </div>
    </div>
<!--    <script type="text/javascript">
        testEditor('.test-4', function(input) {
            var boldButton = input.find('.editible').data('raptor').getLayout().getElement().find('.raptor-ui-text-bold');
            boldButton.trigger('click');
            rangesToTokens(rangy.getSelection().getAllRanges());
            
            if (!boldButton.is('.ui-state-active')){
                throw new Error('Button is not active');
            }
        });
    </script>-->

    <div class="test-5">
        <h1>Text Black Button 5: Paragraph Selection</h1>
        <div class="test-input">
            <div class="editible">
                <p>
                    <span class="cms-blue">{Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas
                    convallis dui id erat pellentesque et rhoncus nunc semper. Suspendisse
                    malesuada hendrerit velit nec tristique.</span>
                </p><p>
                    <span class="cms-blue">Aliquam gravida mauris at
                    ligula venenatis rhoncus. Suspendisse interdum, nisi nec consectetur
                    pulvinar, lorem augue ornare felis, vel lacinia erat nibh in velit.}</span>
                </p>
            </div>
        </div>
        <div class="test-expected">
            <div class="editible">
                <p>
                    <span class="cms-black">{Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas
                    convallis dui id erat pellentesque et rhoncus nunc semper. Suspendisse
                    malesuada hendrerit velit nec tristique.
                </span></p>
                <p><span class="cms-black">
                    Aliquam gravida mauris at
                    ligula venenatis rhoncus. Suspendisse interdum, nisi nec consectetur
                    pulvinar, lorem augue ornare felis, vel lacinia erat nibh in velit.}</span>
                </p>
            </div>
        </div>
    </div>
<!--    <script type="text/javascript">
        testEditor('.test-5', function(input) {
            var boldButton = input.find('.editible').data('raptor').getLayout().getElement().find('.raptor-ui-text-bold');
            boldButton.trigger('click');
            rangesToTokens(rangy.getSelection().getAllRanges());
            
            if (!boldButton.is('.ui-state-active')){
                throw new Error('Button is not active');
            }
        });
    </script>-->

    <div class="test-6">
        <h1>Text White Button 6: Empty Selection in Word</h1>
        <div class="test-input">
            <div class="editible">
                <p>
                    <span class="cms-blue">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas
                    convallis dui id erat pellentesque et rhoncus nunc semper. Suspendisse
                    malesuada hendrerit velit nec tristique.</span>
                </p><p>
                    <span class="cms-blue">Aliquam gravida mauris at
                    ligula venenatis rhoncus. Suspen{}disse interdum, nisi nec consectetur
                    pulvinar, lorem augue ornare felis, vel lacinia erat nibh in velit.</span>
                </p>
            </div>
        </div>
        <div class="test-expected">
            <div class="editible">
                <p>
                    <span class="cms-blue">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas
                    convallis dui id erat pellentesque et rhoncus nunc semper. Suspendisse
                    malesuada hendrerit velit nec tristique.</span>
                </p><p>
                    <span class="cms-blue">Aliquam gravida mauris at
                    ligula venenatis rhoncus. </span><span class="cms-black">{Suspendisse}</span><span class="cms-blue"> interdum, nisi nec consectetur
                    pulvinar, lorem augue ornare felis, vel lacinia erat nibh in velit.</span>
                </p>
            </div>
        </div>
    </div>
<!--    <script type="text/javascript">
        testEditor('.test-6', function(input) {
            var boldButton = input.find('.editible').data('raptor').getLayout().getElement().find('.raptor-ui-text-bold');
            boldButton.trigger('click');
            rangesToTokens(rangy.getSelection().getAllRanges());
            
            if (!boldButton.is('.ui-state-active')){
                throw new Error('Button is not active');
            }
        });
    </script>-->

    <div class="test-7">
        <h1>Text Black Button 7: Empty Selection at the Beginning of a Word</h1>
        <div class="test-input">
            <div class="editible">
                <p>
                    <span class="cms-blue">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas
                    convallis dui id erat pellentesque et rhoncus nunc semper. Suspendisse
                    malesuada {}hendrerit velit nec tristique.</span>
                </p><p>
                    <span class="cms-blue">Aliquam gravida mauris at
                    ligula venenatis rhoncus. Suspendisse interdum, nisi nec consectetur
                    pulvinar, lorem augue ornare felis, vel lacinia erat nibh in velit.</span>
                </p>
            </div>
        </div>
        <div class="test-expected">
            <div class="editible">
                <p>
                    <span class="cms-blue">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas
                    convallis dui id erat pellentesque et rhoncus nunc semper. Suspendisse
                    malesuada </span><span class="cms-black">{hendrerit}</span><span class="cms-blue"> velit nec tristique.</span>
                </p><p>
                    <span class="cms-blue">Aliquam gravida mauris at
                    ligula venenatis rhoncus. Suspendisse interdum, nisi nec consectetur
                    pulvinar, lorem augue ornare felis, vel lacinia erat nibh in velit.</span>
                </p>
            </div>
        </div>
    </div>
<!--    <script type="text/javascript">
        testEditor('.test-7', function(input) {
            var boldButton = input.find('.editible').data('raptor').getLayout().getElement().find('.raptor-ui-text-bold');
            boldButton.trigger('click');
            rangesToTokens(rangy.getSelection().getAllRanges());
            
            if (!boldButton.is('.ui-state-active')){
                throw new Error('Button is not active');
            }
        });
    </script>-->
</body>
</html>