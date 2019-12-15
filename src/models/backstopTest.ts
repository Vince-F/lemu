

export class BackstopTest {
  public label: string;
  public url: string;
  /*public referenceUrl: string;*/
  [key: string]: any;

  constructor(data: any) {
    this.label = data && data.label || "";
    this.url = data && data.url || "";
    /*this.referenceUrl = data && data.referenceUrl || "";*/
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