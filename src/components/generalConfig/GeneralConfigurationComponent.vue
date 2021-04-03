<template>
  <div>
    <v-text-field outlined dense label="id" :value="configuration.id" @input="updateField('id', $event)"></v-text-field>
    <v-select v-if="!templateView" outlined dense :value="configuration.onBeforeScript" @input="updateField('onBeforeScript', $event)" :items="scriptNames"
      label="onBeforeScript"></v-select>
    <v-select v-if="!templateView" outlined dense :value="configuration.onReadyScript" @input="updateField('onReadyScript', $event)" :items="scriptNames"
      label="onReadyScript"></v-select>
    <v-text-field outlined dense label="Path for reference bitmaps" :value="configuration.paths.bitmaps_reference" @input="updatePathField('bitmaps_reference', $event)"></v-text-field>
    <v-text-field outlined dense label="Path for test bitmaps" :value="configuration.paths.bitmaps_test" @input="updatePathField('bitmaps_test', $event)"></v-text-field>
  </div>
</template>

<script lang="ts">
import { BackstopConfiguration } from "@/models/backstopConfiguration";
import { EngineScript } from "@/models/engineScript";
import { Vue, Component, Prop } from "vue-property-decorator";
import { State, Getter } from "vuex-class";

@Component
export default class GeneralConfigurationComponent extends Vue {
  @Prop({ required: true, type: Object })
  private readonly configuration!: BackstopConfiguration;

  @Prop({ type: Boolean })
  private readonly templateView!: boolean;

  @State((state) => state.engineScriptStore.scripts)
  private readonly scripts!: EngineScript[];

  @Getter("configurationStore/engineScriptDirectory")
  private readonly engineScriptDirectory!: string;

  private updateField(field: string, value: unknown) {
    this.$emit("updateField", field, value);
  }

  private updatePathField(field: string, value: unknown) {
    this.$emit("updatePathField", field, value);
  }

  private get scriptNames() {
    if (this.templateView) {
      return [];
    } else {
      let scriptDirectory = this.engineScriptDirectory.replace(/\\/g, "/");
      if (!scriptDirectory.endsWith("/")) {
        scriptDirectory += "/";
      }
      return this.scripts.map((script) => {
        return script.path.replace(scriptDirectory, "");
      });
    }
  }
}

</script>
