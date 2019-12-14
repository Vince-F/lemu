

export class BackstopTest {
  /* mandatory fields */
  public label: string;
  public url: string;

  /* non-mandatory fields */
  public referenceUrl!: string;

  /* for custom fields */
  [key: string]: any;

  constructor(data: any) {
    this.label = data && data.label || "";
    this.url = data && data.url || "";

    for (const key in data) {
      if (key !== "label" && key !== "url") {
        this[key] = data[key];
      }
    }
  }
}

/*
{
      "cookiePath": "backstop_data/engine_scripts/cookies.json",
      "readyEvent": "",
      "readySelector": "",
      "delay": 100,
      "hideSelectors": [],
      "removeSelectors": [],
      "hoverSelector": "",
      "clickSelector": "",
      "postInteractionWait": 0,
      "selectors": [],
      "selectorExpansion": true,
      "expect": 0,
      "misMatchThreshold" : 0.1,
      "requireSameDimensions": true
    }
*/