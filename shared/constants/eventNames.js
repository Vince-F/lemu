"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.eventNames = void 0;
exports.eventNames = Object.freeze({
    APP_INFOS: "appInfos",
    WORKING_DIR: "setWorkingDir",
    RUN_TEST: "runTest",
    APPROVE_TEST: "approveTest",
    INIT_TEST: "initTest",
    RETRIEVE_TEST_RESULT: "retrieveTestsResult",
    TEST_LOG: {
        REPLY: "testLog"
    },
    RETRIEVE_ENGINE_SCRIPTS: "retrieveEngineScripts",
    TEST_RESULT_CHANGED: {
        REQUEST: "watchTestResultsChange",
        REPLY: "testResultsChanged",
        NOT_EXIST: "testResultNonExistent"
    },
    UNREGISTER_RESULT_WATCHER: {
        REQUEST: "unregisterResultWatcher"
    },
    CONFIG_CHANGED: {
        REQUEST: "watchConfigChange",
        REPLY: "configChanged"
    },
    UNREGISTER_CONFIG_WATCHER: {
        REQUEST: "unregisterConfigWatcher"
    },
    HELP_WINDOW: "helpWindow",
    FILE_DIALOG: "openFileDialog",
    DIRECTORY_DIALOG: "openDirectoryDialog",
    OPEN_FILE_AND_PARSE: "openFileAndParse",
    COPY_FILE: "copyFile",
    DELETE_FILE: "deleteFile",
    READ_FILE: "readFile",
    RESOLVE_PATH: "resolvePath",
    WRITE_FILE: "writeFile",
    CREATE_SCRIPT_TEMPLATE: "createScriptTemplate",
    CREATE_OR_UPDATE_SCRIPT_TEMPLATE: "createOrUpdateScriptTemplate",
    RETRIEVE_SCRIPT_TEMPLATES: "retrieveScriptTemplates",
    DELETE_SCRIPT_TEMPLATE: "deleteScriptTemplate",
    CREATE_CONFIGURATION_TEMPLATE: "createConfigurationTemplate",
    CREATE_OR_UPDATE_CONFIGURATION_TEMPLATE: "createOrUpdateConfigurationTemplate",
    RETRIEVE_CONFIGURATION_TEMPLATES: "retrieveConfigurationTemplates",
    DELETE_CONFIGURATION_TEMPLATE: "deleteConfigurationTemplate"
});
