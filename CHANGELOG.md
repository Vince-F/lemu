# Changelog

## V1.25.0
### Features
- Add ability to remove "action" in test view
- Creating an action has been improved with a dedicated dialog
- Prevent confirmation modals to be dismissed when clicking outside
- Add ability to stop test when they are running

### Fixes
- Fix "help" documentation 

## V1.24.1
### Fixes
- Fix path of "action" script

## V1.24.0
### Features
- Add "actions", allowing to execute a set of actions such as "focus", "click" etc for your scenario
- Allowing to enable/disable auto-update 
- Improve update management by displaying notification

## V1.23.1
### Fixes
- fix issue with thread running backstop commands
## V1.23.0
### Features
- Add "settings" section and add "dark mode"
- Save logs in a file
- Add mechanism to rename references when backstop config id is changed

## V1.22.0
### Features
- Redesign welcome screen
- Redesign app toolbar
- Set "reference" first in test result
- Update report after approval

### Fixes
- Fixes an issue where the backstop related command were not working

## V1.21.0
### Features
- Add "test configuration" templates
- New view for creating a "test configuration" from template

### Fixes
- Fix a path issue when adding a new engine script in a configuration

## V1.20.3

### Fixes
- Fix an issue where the app was failing to read dependencies and was displaying an error

## V1.20.2
### Fixes
- Make all images in test result zoomable by cliking on them
## V1.20.1
### Fixes
- Allow JavaScript execution in test preview

## V1.20.0
### Features
- Improve design of general configuration
- Improve design of test view
- Add full screen mode for tests
- Add context meu on test list and test view
## V1.19.0
### Features
- Improve security and performance by updating third party libraries to last version
- Add "viewport" in test view
- Add "pre-defined" field "readyEvent" and "readySelector" in test view
- Add "performance" section in general configuration

## V1.18.1
### Fixes
- Script field accept only one value instead of several values

## V1.18.0
### Features
- Add engine script templates view to manage them
- For "onBeforeScript" and "onReadyScript", display them as combobox to select script from engine scripts in the backstop configuration
## V1.17.0
### Features
- improve design of test result page
- add feature to open/close all viewport panels in test result view
- improve design of engine script view
- close automatically notifications after 15 seconds

### Fixes
- Correctly refresh test result when opening a new configuration
- Stop displaying "outside modification" modal when saving configuration inside Lemu
- Fix issue when opening a backstop configuration where tests were never run before

## V1.16.0
### Features
- add engine script template: you can now save engine scripts to reuse them in other project
- Allow to close the zoomed image for test report by clicking on overlay

## V1.15.0
### Features
- add filtering for tests menu
- add tooltip on various icon buttons to make them clearer
- few design improvments on engine script view
- detects if configuration has been modified outside of Lemu

## V1.14.1
### Fixes
- Don't display error when canceling file opening
- fix error with icon

## V1.14.0
### New features
- Add open button to open a config file from toolbar
- Add user guide 
### Improvments
- Improve application security
- Make application faster, especially on file dialog opening

## V1.13.0
### New features
- Update test result even after a run happening outside of Lemu
- Display the state of test in the list
- Improve log readability by adding seperator between test run and hours

## V1.12.0
### New features
- Add section to manage, add and remove engine scripts
- Add ability to create script from existing file
- Add section to view Backstop logs when running tests

## V1.11.0
### New features
- Improve performance
- Add help on field to describe their purpose
- Add notification when tests finished running

## V1.10.0
### New features
- Add search to search in tests

### Fixes
- Display test placeholder when deleting a test
- Fix a bug on test status where they were not correctly refresh after a test run

## V1.9.0
### New features
- On start screen, display recently opened configuration to re-open them quickly
- Display modal with changelog on first launch after an update
- Add abilit to reduce main menu
- Add ability to resize test menu

## V1.8.1
### Fixes
- Correctly display error when a test fail
- Fix an error wrongly appearing when clicking on "cancel" when opening a configuration file

## V1.8.0
### New features
- Add ability to approve only one viewport of a test
- Add ability to display test images in fullscreen
- Re-design test menu and add possibility to run and approve a test from the menu
- Add auto-update mechanism

### Fixes
- display correctly when not test results are available
- display unkown status on test when neither success or failure can be determined
- make various check on data level to prevent some bugs

## V1.7.1
### Fixes
- Fix issues related to test runner

## V1.7.0
### New features
- Expand window by default
- add "About" modal
- Improve design of test view
- Add ability to edit engine options

## V1.6.3
### Fixes
- set working directory to the one of backstop configuration file 

## V1.6.2
### Fixes
- For approval of single test, correctly clean filename the same way BackstopJS does

## V1.6.1
### Fixes
- Fix error preventing backstopjs with puppeteer to run when packed in asar file 

## V1.6.0
### New features
- Add pre-defined Backstop properties when adding a scenario property
- Add ability to remove a scenario property
- Allow to run a single test 

### Fixes
- correctly update test results after running tests

## V1.5.0
### New features
- make "Add field" flow in test view clearer
- Add a test level report
- Add ability to approve per test

## V1.4.0
### New features
- Reduce binary size and improve performance
- Add ability to create a BackstopJS config from start screen
- Improve layout for "viewports" section in "General configuration"

### Fixes
- stop overriding "report" field when executing tests

## V1.3.0
### New features
- Add ability to run the tests
- Add ability to approve the tests 
- Add a report section to display HTML report

## V1.2.0
### New features
- Display "save" messages as toast instead of dialog
- Display symbol next to test name to highlight unsaved changes
- add tooltip on icons to clarify their meaning
- add confirmation when closing configuration while there is unsaved changes
- add confirmation before deleting test
 
### Fixes
- Fix an error when canceling the file selection (#11)
- Fix and display error when opening invalid file (#12)

## V1.1.0
### New features
- Add "close" button
- Hide "save" & "close" button on start screen
- Add "duplicate" for tests

## V1.0.0
- Initial release