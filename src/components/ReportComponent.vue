<template>
  <iframe v-if="reportPath && reportPath.length > 0" :src="reportPath">
  </iframe>
</template>

<style scoped>
  iframe {
    height: 98%;
    width: 100%;
    border: 0;
  }
</style>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { State } from "vuex-class";
import { BackstopConfiguration } from '../models/backstopConfiguration';
import { FileService } from '../services/fileService';

@Component
export default class ReportComponent extends Vue {
  @State((state) => state.configurationStore.currentConfiguration)
  private readonly configuration!: BackstopConfiguration;
  @State((state) => state.configurationStore.configurationPath)
  private readonly path!: string;

  private get reportPath() {
    const configurationPath = this.configuration && this.configuration.paths && 
        this.configuration.paths.html_report || "";
    const prefixPath = this.path.substr(0, this.path.length - "backstop.json".length);
    return configurationPath &&
          FileService.resolvePath([prefixPath, configurationPath, "index.html"]) || "";
  }
}
</script>