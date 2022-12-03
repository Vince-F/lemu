<template><div><h1 id="general-configuration" tabindex="-1"><a class="header-anchor" href="#general-configuration" aria-hidden="true">#</a> General configuration</h1>
<p>General configuration allows you to configure the general settings of your tests.</p>
<h2 id="general" tabindex="-1"><a class="header-anchor" href="#general" aria-hidden="true">#</a> General</h2>
<p>The &quot;id&quot; is the name of for your Backstop configuration.</p>
<p>The &quot;onBeforeScript&quot; is the path of the script to execute before a test is executed. It will apply for all your test unless overriden in it.</p>
<p>The &quot;onReadyScript&quot; is the path of the script to execute when the page of your test is ready. It will apply for all your test unless overriden in it.</p>
<p>&quot;Path for reference bitmaps&quot; and &quot;Path for tests bitmaps&quot; are where the images will be the directories where the images from test runs and references will be saved.</p>
<h2 id="viewports" tabindex="-1"><a class="header-anchor" href="#viewports" aria-hidden="true">#</a> Viewports</h2>
<p>The viewports are the different screen sizes in which your tests will be run. You can add them as many as you like.</p>
<p>A viewport has a label and the screen size in pixels (width and height).</p>
<p>And just click the &quot;Remove viewport&quot; to remove a specific viewport.</p>
<h2 id="engine" tabindex="-1"><a class="header-anchor" href="#engine" aria-hidden="true">#</a> Engine</h2>
<p>Engine section will allow you to configure all things related to the headless browser that will run your tests.</p>
<p>You can choose which engine to use to run your tests.</p>
<p>Engine options are the arguments to passed to the engine.</p>
<h2 id="report" tabindex="-1"><a class="header-anchor" href="#report" aria-hidden="true">#</a> Report</h2>
<p>This section allows to configure which format of report you want. BackstopJS supports 3 formats:</p>
<ul>
<li>HTML report</li>
<li>CI report (for continuous integration server)</li>
<li>JSON report</li>
</ul>
<p>You can also configure the path where those reports will be saved.</p>
</div></template>


