<template>
  <div>
    <div>
      <div v-for="(value, key) in selectorFields" :key="key">
        <v-switch :label="'Display \'' + key + '\' selector'" />
      </div>
    </div>
    <iframe
      ref="previewFrame"
      class="preview"
      sandbox=""
      :src="testContent.url"
    ></iframe>
  </div>
</template>

<style scoped>
.preview {
  width: 100%;
  height: 400px;
  resize: both;
  overflow: auto;
}
</style>

<script lang="ts">
import { backstopScenarioProperties } from "@/constants/backstopScenarioProperties";
import { BackstopTest } from "@/models/backstopTest";
import { Vue, Component, Prop } from "vue-property-decorator";

@Component
export default class TestPreviewComponent extends Vue {
  @Prop({ required: true, type: BackstopTest })
  private readonly testContent!: BackstopTest;

  private get selectorFields() {
    const result: any = {};
    for (const key in this.testContent) {
      if (key in this.testContent) {
        const predefinedFieldConfig = backstopScenarioProperties.find(
          (val) => val.name === key
        );
        if (predefinedFieldConfig) {
          if (predefinedFieldConfig.type === "selector") {
            result[key] = [this.testContent[key]];
          } else if (predefinedFieldConfig.type === "selectors") {
            result[key] = this.testContent[key];
          }
        }
      }
    }
    return result;
  }

  private mounted() {
    const previewFrame = this.$refs.previewFrame;
    if (previewFrame instanceof HTMLIFrameElement) {
      const frameWindow = previewFrame.contentWindow;
      console.log(frameWindow);
      if (frameWindow) {
        frameWindow.document.onreadystatechange = () => {
          if (frameWindow.document.readyState === "complete") {
            for (const key in this.selectorFields) {
              if (key in this.selectorFields) {
                console.log(this.selectorFields[key]);
                if (Array.isArray(this.selectorFields[key])) {
                  this.selectorFields[key].forEach((selector: string) => {
                    const element = frameWindow.document.querySelector(
                      selector
                    );
                    console.log(element);
                    if (element) {
                      console.log("ok");
                      (element as HTMLElement).style.boxShadow = "0 0 0 4px red";
                    }
                  });
                }
              }
            }
          }
        };
      }
    }
  }

  private injectStyle() {
    /* do an overlay on page with another page*/
    const style = "<style></style>";
  }
}
</script>