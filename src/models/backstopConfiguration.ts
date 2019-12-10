import { BackstopTest } from './backstopTest';


export class BackstopConfiguration {
    public id: string;
    public viewports: Array<{label: string, width: number, height: number}>;
    public onBeforeScript: string;
    public onReadyScript: string;
    public scenarios: BackstopTest[];
    public paths: {
        bitmaps_reference: string;
        bitmaps_test: string;
        engine_scripts: string;
        html_report: string;
        ci_report: string;
        json_report: string;
    };
    public report: Array<"browser"|"CI"|"json">;
    public engine: string;
    public engineOptions: string[];
    public asyncCaptureLimit: number | null;
    public asyncCompareLimit: number | null;
    public debug: boolean | null;
    public debugWindow: boolean | null;

    constructor(data: any) {
        this.id = data && data.id || "";
        this.viewports = data && data.viewports || [];
        this.onBeforeScript = data && data.onBeforeScript || "";
        this.onReadyScript = data && data.onReadyScript || "";
        this.scenarios = [];
        if (data && Array.isArray(data.scenarios)) {
          this.scenarios = data.scenarios.map((scenario: any) => {
            return new BackstopTest(scenario);
          });
        }
        this.paths = data && data.paths || {};
        this.report = data && data.report || [];
        this.engine = data && data.engine || "";
        this.engineOptions = data && data.engineOptions;
        this.asyncCaptureLimit = data && !isNaN(data.asyncCaptureLimit) ? data.asyncCaptureLimit : null;
        this.asyncCompareLimit = data && !isNaN(data.asyncCompareLimit) ? data.asyncCompareLimit : null;
        this.debug = data && data.debug !== undefined ? data.debug : null;
        this.debugWindow = data && data.debugWindow !== undefined ? data.debugWindow : null;
    }
}

/*{
  "scenarios": [
    
  ],
  "asyncCaptureLimit": 5,
  "asyncCompareLimit": 50,
  "debug": false,
  "debugWindow": false
}*/