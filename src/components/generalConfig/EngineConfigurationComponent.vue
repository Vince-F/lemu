<template>
  <div>
    <v-radio-group :value="configuration.engine" @change="updateField('engine', $event)">
      <v-radio label="Puppeteer" value="puppeteer"></v-radio>
    </v-radio-group>
    <div class="mb-4">
      <strong>Engine options</strong>
    </div>
    <div v-for="(value, key) of configuration.engineOptions" :key="key" class="d-flex">
      <v-combobox outlined dense v-if="Array.isArray(value)" class="flex-shrink-1 flex-grow-1" multiple
        :label="key" :value="value" @change="setConfigurationEngineOptionsField({field: key, value: $event})"
        ></v-combobox>
      <v-text-field outlined dense v-else-if="typeof value === 'number'" class="flex-shrink-1 flex-grow-1" type="number"
        :label="key" :value="value" @change="setConfigurationEngineOptionsField({field: key, value: $event})"
        ></v-text-field>
      <v-checkbox v-else-if="typeof value === 'boolean'" class="flex-shrink-1 flex-grow-1"
        :label="key" :value="value" @change="setConfigurationEngineOptionsField({field: key, value: !!$event})"
        ></v-checkbox>
      <v-text-field outlined dense v-else class="flex-shrink-1 flex-grow-1"
        :label="key" :value="value" @change="setConfigurationEngineOptionsField({field: key, value: $event})"></v-text-field>
      <v-btn icon class="flex-shrink-0 flex-grow-0 delete-action-btn" @click="confirmEngineOptionRemove(key)">
        <v-icon color="grey">mdi-delete</v-icon>
      </v-btn>
    </div>
    <div class="action-container">
      <v-btn color="primary"  @click="addEngineOption()">
        <v-icon>mdi-plus</v-icon>
        Add engine option
      </v-btn>
    </div>
  </div>
</template>

<style scoped>
.delete-action-btn {
  align-self: auto;
}

.action-container {
  text-align: right;
}
</style>

<script lang="ts">
import { BackstopConfiguration } from "@/models/backstopConfiguration";
import { Vue, Component } from "vue-property-decorator";
import { ModalService } from '../../services/modalService';
import AddEngineOptionModalComponent from "./AddEngineOptionModalComponent.vue";

@Component
export default class EngineConfigurationComponent extends Vue {
  @Prop({required: true})
  private readonly configuration!: BackstopConfiguration;

  private addEngineOption() {
    ModalService.launchModal(AddEngineOptionModalComponent)
      .then((newField: {name: string, value: any, type: string}) => {
        if (newField.type === "number") {
          newField.value = Number.parseFloat(newField.value);
        }
        this.setConfigurationEngineOptionsField({field: newField.name, value: newField.value});
      });
  }

  private setConfigurationEngineOptionsField(value: {field: string, value: any}) {
    this.$emit("setConfigurationEngineOptionsField", value);
  }

  private updateField(field: string, value: any) {
    this.$emit("updateField", field, value);
  }
}
</script>