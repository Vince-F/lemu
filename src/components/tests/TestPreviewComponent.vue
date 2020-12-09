<template>
  <div>
    <div class="d-flex">
      <div v-for="(value, key) in selectorFields" :key="key" class="mr-8">
        <v-switch class="slider mr-2" :label="'Display \'' + key + '\' selector'" 
          :input-value="selectorProperties[key].displayed" @change="updateSelectorProperty(key, 'displayed', $event)"/>
        <v-menu 
          offset-y
          :close-on-content-click="false">
          <template v-slot:activator="{ on: menuListener }">
            <div class="color-picker" v-on="menuListener" 
              :style="{background: selectorProperties[key].color }"></div>
          </template>
          <v-color-picker
            dot-size="25"
            mode="hexa"
            show-swatches
            swatches-max-height="200"
            :value="selectorProperties[key].color"
            @input="updateSelectorProperty(key, 'color', $event)"
          ></v-color-picker>
        </v-menu>
      </div>
    </div>
    <iframe
      :elevation="4"
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
  border: none;
}

.slider {
  display: inline-block;
}

.color-picker {
  width: 16px;
  height: 16px;
  border-radius: 100%;
  cursor: pointer;
  display: inline-block;
}
</style>

<script lang="ts">
import { backstopScenarioProperties } from "@/constants/backstopScenarioProperties";
import { BackstopTest } from "@/models/backstopTest";
import { Vue, Component, Prop, Watch } from "vue-property-decorator";

@Component
export default class TestPreviewComponent extends Vue {
  @Prop({ required: true, type: Object })
  private readonly testContent!: BackstopTest;

  private readonly predefinedColors: string[];
  private selectorProperties: { [key: string]: { displayed: boolean, color: string} };

  constructor() {
    super(arguments);
    this.predefinedColors = [
      "#3F51B5FF",
      "#43A047FF",
      "#F57C00FF",
      "#455A64FF",
      "#D32F2FFF",
      "#2E7D32FF",
      "#4E342EFF",
      "#7986CBFF",
      "#C0CA33FF",
      "#7B1FA2FF",
      "#00695CFF",
      "#BF360CFF",
      "#FBC02DFF",
      "#000000FF",
      "#8BC34AFF"
    ];
    this.selectorProperties = {};
  }

  private get selectorFields(): {[key: string]: string[]} {
    const result: any = {};
    let i = 0;
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
          if (!this.selectorProperties[key]) {
            Vue.set(this.selectorProperties, key, {displayed: true, color: this.predefinedColors[i]});
          }
        }
        i++;
        if (i >= this.predefinedColors.length) {
          i = 0;
        }
      }
    }
    return result;
  }

  private mounted() {
    this.setPreviewOnSelectors();
  }

  private updateSelectorProperty(key: string, property: "displayed" | "color", value: boolean | string) {
    if (this.selectorProperties[key]) {
      const selectorProperty = this.selectorProperties[key];
      if (selectorProperty) {
        if (property === "displayed" && typeof value === "boolean") {
          Vue.set(selectorProperty, property, value);
        } else if (property === "color" && typeof value === "string") {
          Vue.set(selectorProperty, property, value);
        }
      }
    }
  }

  @Watch("selectorFields")
  private updateSelectorsDisplayAfterFieldUpdate() {
    this.setPreviewOnSelectors();
  }

  @Watch("selectorProperties", {deep: true})
  private updateSelectorsAfterSelectorPropertiesUpdate() {
    this.setPreviewOnSelectors();
  }

  private setPreviewOnSelectors() {
    const previewFrame = this.$refs.previewFrame;
    if (previewFrame instanceof HTMLIFrameElement) {
      const frameWindow = previewFrame.contentWindow;
      if (frameWindow) {
        if (frameWindow.document.readyState === "complete") {
          this.highlightSelectors(frameWindow);
        } else {
          frameWindow.document.onreadystatechange = () => {
            if (frameWindow.document.readyState === "complete") {
              this.highlightSelectors(frameWindow);
            }
          };
        }
      }
    }
  }

  private highlightSelectors(frameWindow: Window) {
    for (const key in this.selectorFields) {
      if (key in this.selectorFields) {
        if (Array.isArray(this.selectorFields[key])) {
          this.selectorFields[key].forEach((selector: string) => {
            const element = frameWindow.document.querySelector(
              selector
            );
            if (element) {
              const boxShadowProp = "0 0 0 4.001px " + this.selectorProperties[key]?.color;
              if (this.selectorProperties[key]?.displayed) {
                (element as HTMLElement).style.boxShadow = boxShadowProp;
              } else {
                (element as HTMLElement).style.boxShadow = "none";
              }
            }
          });
        }
      }
    }
  }
}
</script>