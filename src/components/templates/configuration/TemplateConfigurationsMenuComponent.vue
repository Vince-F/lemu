<template>
  <div>
    <v-list-item>
      <v-list-item-content>
        <v-list-item-title class="title-with-action">
          CONFIGURATIONS
          <v-spacer />
          <v-btn color="primary" @click="addNewConfigurationTemplate">
            <v-icon>mdi-plus</v-icon>Add
          </v-btn>
        </v-list-item-title>
      </v-list-item-content>
    </v-list-item>

    <v-divider></v-divider>

    <v-list dense>
      <v-list-item-group color="primary">
        <v-list-item
          v-for="(config, index) in configurations"
          :key="index"
          link
          @click="openConfigurationDetails(index)"
        >
          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <v-list-item-icon class="ms-0 mr-1 small-icon">
                <v-icon
                  v-if="hasConfigurationBeenModified(index)"
                  v-on="on"
                  x-small
                  color="grey"
                  >mdi-circle</v-icon
                >
              </v-list-item-icon>
            </template>
            <span>This configuration template contains unsaved changes</span>
          </v-tooltip>
          <v-list-item-content>
            <v-list-item-title>
              {{ config.id }}
            </v-list-item-title>
          </v-list-item-content>
          <v-list-item-action class="my-0 flex-row">
            <v-menu offset-y>
              <template v-slot:activator="{ on }">
                <v-btn icon v-on.stop.prevent="on">
                  <v-icon color="grey lighten-1">mdi-dots-vertical</v-icon>
                </v-btn>
              </template>
              <v-list dense>
                <v-list-item>
                  <v-list-item-title @click="duplicateConfiguration(config)">
                    <v-icon color="grey lighten-1">mdi-content-copy</v-icon>
                    Duplicate
                  </v-list-item-title>
                </v-list-item>
                <v-list-item>
                  <v-list-item-title @click="deleteConfiguration(config)">
                    <v-icon color="grey lighten-1">mdi-delete</v-icon>
                    Delete
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-list-item-action>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </div>
</template>

<style scoped>
.action {
  padding: 8px;
}
.container {
  display: flex;
  height: 100%;
}

.menu {
  flex: 0;
  height: 100%;
}

.content {
  flex: 1;
  height: 100%;
  max-height: 100%;
  overflow: auto;
}

.v-list-item__icon.small-icon {
  min-width: 12px;
}

.icon-container {
  height: 100%;
  display: flex;
}

.filter-area {
  padding-left: 30px;
  padding-right: 16px;
}

.filter-count {
  padding-top: 10px;
}

.empty-placeholder {
  padding: 16px;
  text-align: center;
}

.title-with-action {
  display: flex;
  align-items: center;
}
</style>

<script lang="ts">
import { BackstopConfiguration } from "@/models/backstopConfiguration";
import { Vue, Component } from "vue-property-decorator";
import { Getter, Mutation, Action, State } from "vuex-class";
import { ModalService } from "../../../services/modalService";
import { backstopConfigDefault } from "../../../constants/backstopConfigDefault";

@Component({
  name: "template-configurations-menu-component",
  components: {}
})
export default class TemplateConfigurationsMenuComponent extends Vue {
  @State((state) => state.templateStore.configurationTemplates)
  private readonly configurations!: BackstopConfiguration[];

  @Action("templateStore/retrieveConfigurationTemplates")
  private readonly retrieveConfigurationTemplates!: () => Promise<void>;

  @Mutation("templateStore/removeConfigurationTemplate")
  private readonly removeConfigurationTemplate!: (
    script: BackstopConfiguration
  ) => void;

  @Action("templateStore/createConfigurationTemplate")
  private readonly createConfigurationTemplate!: (
    config: BackstopConfiguration
  ) => Promise<void>;

  @Getter("templateStore/hasConfigurationBeenModified")
  private hasConfigurationBeenModified!: (idx: number) => boolean;

  constructor() {
    super(arguments);
  }

  private mounted() {
    this.retrieveConfigurationTemplates();
  }

  private addNewConfigurationTemplate() {
    const newConfiguration = new BackstopConfiguration(backstopConfigDefault);
    newConfiguration.id = "configuration_" + this.configurations.length;
    this.createConfigurationTemplate(newConfiguration);
  }

  private duplicateConfiguration(configuration: BackstopConfiguration) {
    const newConfiguration = new BackstopConfiguration(
      { id: configuration.id + "_copy" }
    );
    this.createConfigurationTemplate(newConfiguration);
  }

  private deleteConfiguration(config: BackstopConfiguration) {
    ModalService.launchConfirmationModal(
      "Do you really wish to delete this entry?"
    ).then(() => {
      this.removeConfigurationTemplate(config);
      this.$router.push({ name: "configurationTemplates.welcome" });
    });
  }

  private openConfigurationDetails(index: number) {
    this.$router.push({
      name: "configurationTemplates.view",
      params: { index: "" + index }
    });
  }
}
</script>
