<template>
  <v-container fluid class="container pa-0">
    <div class="menu" v-if="displayMainMenu">
      <main-menu-component />
    </div>
    <div class="content">
      <router-view />
    </div>
  </v-container>
</template>

<style scoped>
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
</style>

<script lang="ts">
import { BackstopService } from "@/services/backstopService";
import { ModalService } from "@/services/modalService";
import { Vue, Component } from "vue-property-decorator";
import { Action, State } from "vuex-class";
import MainMenuComponent from "../components/app/MainMenuComponent.vue";
import ReloadConfigurationModalComponent from "../components/app/ReloadConfigurationModalComponent.vue";

@Component({
  name: "test-configuration-view",
  components: {
    MainMenuComponent,
  },
})
export default class TestConfigurationView extends Vue {
  @State((state) => state.configurationStore.configurationPath)
  private configurationPath!: string;
  @State((state) => state.configurationStore.configurationModified)
  private configurationModified!: string;
  @State((state) => state.configurationStore.isSaving)
  private configurationIsSaving!: boolean;
  @Action("configurationStore/openConfigurationFromPath")
  private openConfigurationFromPath!: (path: string) => Promise<void>;
  @Action("configurationStore/saveConfiguration")
  private saveConfiguration!: () => Promise<void>;

  private reloadModalOpened!: boolean;

  constructor() {
    super(arguments);
    this.reloadModalOpened = false;
  }

  private mounted() {
    BackstopService.registerConfigWatcher(this.configurationPath, () => {
      if (!this.reloadModalOpened && !this.configurationIsSaving) {
        this.reloadModalOpened = true;

        if (this.configurationModified) {
          ModalService.launchModal(ReloadConfigurationModalComponent).then(
            (response) => {
              if (response) {
                if (response.reload) {
                  this.openConfigurationFromPath(
                    this.configurationPath
                  ).finally(() => {
                    this.reloadModalOpened = false;
                  });
                } else {
                  this.saveConfiguration().finally(() => {
                    this.reloadModalOpened = false;
                  });
                }
              }
            }
          );
        } else {
          ModalService.launchConfirmationModal(
            "Configuration file has been modified outside of LEMU. " +
              "Would you like to reload it?"
          )
            .then(() => {
              this.openConfigurationFromPath(this.configurationPath).finally(
                () => {
                  this.reloadModalOpened = false;
                }
              );
            })
            .finally(() => {
              this.reloadModalOpened = false;
            });
        }
      }
    });
  }

  private get displayMainMenu() {
    return this.$route.name !== "test.fullscreenView";
  }
}
</script>