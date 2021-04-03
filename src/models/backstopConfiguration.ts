import { BackstopTest } from "./backstopTest";
import { Viewport } from "./viewport";

// because it is a mapping of BackstopJS configuration file, not all fields are camelCase
/* eslint-disable camelcase */
export class BackstopConfiguration {
    public id: string;
    public viewports: Viewport[];
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
    public engineOptions: {[key: string]: unknown};
    public asyncCaptureLimit: number | null;
    public asyncCompareLimit: number | null;
    public debug: boolean | null;
    public debugWindow: boolean | null;

    constructor(data: any) { // eslint-disable-line
      this.id = data?.id ?? "";
      this.viewports = [];
      if (Array.isArray(data?.viewports)) {
        this.viewports = data.viewports.map((viewport: unknown) => new Viewport(viewport));
      }
      this.onBeforeScript = data?.onBeforeScript ?? "";
      this.onReadyScript = data?.onReadyScript ?? "";
      this.scenarios = [];
      if (Array.isArray(data?.scenarios)) {
        this.scenarios = data.scenarios.map((scenario: unknown) => new BackstopTest(scenario));
      }
      this.paths = data?.paths ?? {};
      this.report = data?.report ?? [];
      this.engine = data?.engine ?? "";
      this.engineOptions = data?.engineOptions;
      this.asyncCaptureLimit = !isNaN(data?.asyncCaptureLimit) ? data.asyncCaptureLimit : null;
      this.asyncCompareLimit = !isNaN(data?.asyncCompareLimit) ? data.asyncCompareLimit : null;
      this.debug = data?.debug ?? null;
      this.debugWindow = data?.debugWindow ?? null;
    }
}
/* eslint-enable camelcase */
