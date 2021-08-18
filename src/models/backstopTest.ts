import { TestAction } from "./testAction";
import { Viewport } from "./viewport";

export class BackstopTest {
  /* mandatory fields */
  public label: string;
  public url: string;

  /* non-mandatory fields */
  public referenceUrl!: string;
  public cookiePath!: string;
  public readyEvent!: string;
  public readySelector!: string;
  public delay!: number;
  public hideSelectors!: string[];
  public removeSelectors!: string[];
  public hoverSelector!: string;
  public clickSelector!: string;
  public postInteractionWait!: number;
  public selectors!: string[];
  public selectorExpansion!: boolean;
  public expect!: number;
  public misMatchThreshold!: number;
  public requireSameDimensions!: boolean;
  public viewports!: Viewport[];
  public actions!: TestAction[];

  /* for custom fields */
  [key: string]: unknown;

  constructor(data: any) { // eslint-disable-line
    this.label = data?.label ?? "";
    this.url = data?.url ?? "";

    for (const key in data) {
      if (key !== "label" && key !== "url") {
        this[key] = data[key];
      }
    }
  }
}
