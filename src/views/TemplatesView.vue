<template>
  <v-container fluid class="container pa-0">
    <div class="menu">
      <templates-menu-component />
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
import TemplatesMenuComponent from "../components/templates/TemplatesMenuComponent.vue";
import ReloadConfigurationModalComponent from "../components/app/ReloadConfigurationModalComponent.vue";

@Component({
  name: "templates-view",
  components: {
    TemplatesMenuComponent
  },
})
export default class TemplatesView extends Vue {
  constructor() {
    super(arguments);
  }
}
</script>