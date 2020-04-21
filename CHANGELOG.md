# Changelog

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