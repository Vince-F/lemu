# General configuration

General configuration allows you to configure the general settings of your tests.

## General
The "id" is the name of for your Backstop configuration.

The "onBeforeScript" is the path of the script to execute before a test is executed. It will apply for all your test unless overriden in it.

The "onReadyScript" is the path of the script to execute when the page of your test is ready. It will apply for all your test unless overriden in it.

"Path for reference bitmaps" and "Path for tests bitmaps" are where the images will be the directories where the images from test runs and references will be saved.

## Viewports 
The viewports are the different screen sizes in which your tests will be run. You can add them as many as you like. 

A viewport has a label and the screen size in pixels (width and height).

And just click the "Remove viewport" to remove a specific viewport.

## Engine 
Engine section will allow you to configure all things related to the headless browser that will run your tests.

You can choose which engine to use to run your tests.

Engine options are the arguments to passed to the engine. 