export declare const eventNames: Readonly<{
    APP_INFOS: string;
    WORKING_DIR: string;
    RUN_TEST: string;
    APPROVE_TEST: string;
    INIT_TEST: string;
    RETRIEVE_TEST_RESULT: string;
    TEST_LOG: {
        REPLY: string;
    };
    RETRIEVE_ENGINE_SCRIPTS: string;
    TEST_RESULT_CHANGED: {
        REQUEST: string;
        REPLY: string;
        NOT_EXIST: string;
    };
    UNREGISTER_RESULT_WATCHER: {
        REQUEST: string;
    };
    CONFIG_CHANGED: {
        REQUEST: string;
        REPLY: string;
    };
    UNREGISTER_CONFIG_WATCHER: {
        REQUEST: string;
    };
    HELP_WINDOW: string;
    FILE_DIALOG: string;
    DIRECTORY_DIALOG: string;
    OPEN_FILE_AND_PARSE: string;
    COPY_FILE: string;
    DELETE_FILE: string;
    READ_FILE: string;
    RESOLVE_PATH: string;
    WRITE_FILE: string;
    CREATE_SCRIPT_TEMPLATE: string;
    CREATE_OR_UPDATE_SCRIPT_TEMPLATE: string;
    RETRIEVE_SCRIPT_TEMPLATES: string;
    DELETE_SCRIPT_TEMPLATE: string;
    CREATE_CONFIGURATION_TEMPLATE: string;
    CREATE_OR_UPDATE_CONFIGURATION_TEMPLATE: string;
    RETRIEVE_CONFIGURATION_TEMPLATES: string;
    DELETE_CONFIGURATION_TEMPLATE: string;
    RENAME_REFERENCES: string;
}>;
