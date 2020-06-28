export const eventNames = Object.freeze({
  APP_INFOS: {
    REQUEST: "retrieveAppInfos",
    REPLY: "appInfos"
  },
  WORKING_DIR: {
    REQUEST: "setWorkingDir"
  },
  RUN_TEST: {
    REQUEST: "runTest",
    REPLY: "testFinished"
  },
  APPROVE_TEST: {
    REQUEST: "approveTest",
    REPLY: "approvalFinished"
  },
  INIT_TEST: {
    REQUEST: "initTest",
    REPLY: "initFinished"
  },
  RETRIEVE_TEST_RESULT: {
    REQUEST: "retrieveTestsResult",
    REPLY: "testsResult"
  },
  TEST_LOG: {
    REPLY: "testLog"
  },
  RETRIEVE_CUSTOM_SCRIPTS: {
    REQUEST: "retrieveEngineScripts",
    REPLY: "engineScripts"
  },
  TEST_RESULT_CHANGED: {
    REQUEST: "watchTestResultsChange",
    REPLY: "testResultsChanged"
  },
  UNREGISTER_RESULT_WATCHER: {
    REQUEST: "unregisterResultWatcher"
  }
});
