<template>
  <v-container fluid class="container pa-0">
    <div class="menu">
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
import { ModalService } from '@/services/modalService';
import { Vue, Component } from "vue-property-decorator";
import { Action, State } from "vuex-class";
import MainMenuComponent from "../components/app/MainMenuComponent.vue";

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
  @Action("configurationStore/openConfigurationFromPath")
  private openConfigurationFromPath!: (path: string) => Promise<void>;

  private mounted() {
    BackstopService.registerConfigWatcher(this.configurationPath, () => {
      if (this.configurationModified) {

      } else {
        ModalService.launchConfirmationModal("Configuration file has been modified outside of LEMU." +
          "Do you wish to reload it?")
          .then(() => {
            this.openConfigurationFromPath(this.configurationPath);
          });
      }
    });
  }
}
</script>