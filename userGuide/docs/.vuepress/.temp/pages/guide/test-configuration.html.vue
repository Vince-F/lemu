<template><div><h1 id="test-configuration" tabindex="-1"><a class="header-anchor" href="#test-configuration" aria-hidden="true">#</a> Test configuration</h1>
<p>When you click on a test, it will open it.
There will be two tabs, the first one being the configuration.</p>
<p>The test configuration will allow to configure the fields and their value for your test.</p>
<p>By default, two fields are always here 'label' and 'url' because they are mandatory.</p>
<h2 id="adding-a-field" tabindex="-1"><a class="header-anchor" href="#adding-a-field" aria-hidden="true">#</a> Adding a field</h2>
<p>To add a new field in your test, click the &quot;add field&quot; button.</p>
<p>It will open a modal; you can either create a pre-defined field or a custom field.</p>
<p>Pre-defined are fields that exist in a BackstopJS configuration. When you select a field, an help message will appear below it explaining what is the field purpose. You can then set a value.</p>
<p>You can also add a custom field. Custom fields are not native for BackstopJS but may be used in your engine scripts. You choose its name, the type of variable it is (a boolean, a string, a boolean or an array), and then the value.</p>
<h2 id="editing-your-field" tabindex="-1"><a class="header-anchor" href="#editing-your-field" aria-hidden="true">#</a> Editing your field</h2>
<p>After their creation the field will appear. You can edit them freely. The displayed control will depend of the field type. On the right along the field type you have an help button. It will give you information about the field when you over it if it is a BackstopJS default field.</p>
<p>You can delete any field (except the required one 'name' and 'url') by clicking on the 'bin' icon next the field value on the right.</p>
<h3 id="field-of-boolean-type" tabindex="-1"><a class="header-anchor" href="#field-of-boolean-type" aria-hidden="true">#</a> Field of 'boolean' type</h3>
<p>Boolean typed field (field that can have a true/false value) will be displayed as a checkbox. Simply click it to toggle the value.</p>
<h3 id="field-of-number-type" tabindex="-1"><a class="header-anchor" href="#field-of-number-type" aria-hidden="true">#</a> Field of 'number' type</h3>
<p>Number type are for numeral values, such as a delay in millisecond for instance. You can edit the value either by entering it with your keyboard or clicking on the arrows on the right to increment and decrement the value.</p>
<h3 id="field-of-string-type" tabindex="-1"><a class="header-anchor" href="#field-of-string-type" aria-hidden="true">#</a> Field of 'string' type</h3>
<p>String type are for arbitrary string value. Simply type what you want.</p>
<h3 id="field-of-array-value" tabindex="-1"><a class="header-anchor" href="#field-of-array-value" aria-hidden="true">#</a> Field of 'array' value</h3>
<p>Array values allow you to have several values for one field. To enter a value, type it and then press enter to validate. Your value will then appear in a &quot;chip&quot; display. You can remove it by clicking the cross next to it.</p>
</div></template>


