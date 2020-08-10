# Test configuration

When you click on a test, it will open it.
There will be two tabs, the first one being the configuration.

The test configuration will allow to configure the fields and their value for your test.

By default, two fields are always here 'label' and 'url' because they are mandatory.

## Adding a field
To add a new field in your test, click the "add field" button.

It will open a modal; you can either create a pre-defined field or a custom field.

Pre-defined are fields that exist in a BackstopJS configuration. When you select a field, an help message will appear below it explaining what is the field purpose. You can then set a value.

You can also add a custom field. Custom fields are not native for BackstopJS but may be used in your engine scripts. You choose its name, the type of variable it is (a boolean, a string, a boolean or an array), and then the value.

## Editing your field
After their creation the field will appear. You can edit them freely. The displayed control will depend of the field type. On the right along the field type you have an help button. It will give you information about the field when you over it if it is a BackstopJS default field.

You can delete any field (except the required one 'name' and 'url') by clicking on the 'bin' icon next the field value on the right.

### Field of 'boolean' type
Boolean typed field (field that can have a true/false value) will be displayed as a checkbox. Simply click it to toggle the value.

### Field of 'number' type
Number type are for numeral values, such as a delay in millisecond for instance. You can edit the value either by entering it with your keyboard or clicking on the arrows on the right to increment and decrement the value.

### Field of 'string' type
String type are for arbitrary string value. Simply type what you want.

### Field of 'array' value
Array values allow you to have several values for one field. To enter a value, type it and then press enter to validate. Your value will then appear in a "chip" display. You can remove it by clicking the cross next to it. 