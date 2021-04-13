<template>
  <div>
    <v-list-item>
      <v-list-item-content>
        <v-list-item-title class="title-with-action">
          SCRIPTS
          <v-spacer />
          <v-btn color="primary" @click="addScriptTemplate">
            <v-icon>mdi-plus</v-icon>Add
          </v-btn>
        </v-list-item-title>
      </v-list-item-content>
    </v-list-item>

    <v-divider></v-divider>

    <v-list dense>
      <v-list-item-group color="primary">
        <v-list-item
          v-for="(script, index) in scripts"
          :key="index"
          link
          @click="openScriptDetails(script)"
        >
          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <v-list-item-icon class="ms-0 mr-1 small-icon">
                <v-icon
                  v-if="hasScriptBeenModified(index)"
                  v-on="on"
                  x-small
                  color="grey"
                  >mdi-circle</v-icon
                >
              </v-list-item-icon>
            </template>
            <span>This script contains unsaved changes</span>
          </v-tooltip>
          <v-list-item-content>
            <v-list-item-title>
              {{ script.name }}
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
                  <v-list-item-title @click="duplicateScript(script)">
                    <v-icon color="grey lighten-1">mdi-content-copy</v-icon>
                    Duplicate
                  </v-list-item-title>
                </v-list-item>
                <v-list-item>
                  <v-list-item-title @click="deleteScript(script)">
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
import { EngineScriptTemplate } from "@/models/engineScriptTemplate";
import { Vue, Component } from "vue-property-decorator";
import { Getter, Mutation, Action, State } from "vuex-class";
import { ModalService } from "../../../services/modalService";

@Component({
  name: "scripts-menu-component",
  components: {}
})
export default class TemplateScriptsMenuComponent extends Vue {
  @State((state) => state.templateStore.scripts)
  private readonly scripts!: EngineScriptTemplate[];

  @Action("templateStore/retrieveEngineScriptTemplates")
  private readonly retrieveEngineScriptTemplates!: () => Promise<void>;

  @Mutation("templateStore/removeEngineScriptTemplate")
  private readonly removeEngineScriptTemplate!: (
    script: EngineScriptTemplate
  ) => void;

  @Action("templateStore/createEngineScriptTemplate")
  private readonly createEngineScriptTemplate!: (
    script: EngineScriptTemplate
  ) => Promise<void>;

  @Getter("templateStore/hasScriptBeenModified")
  private hasScriptBeenModified!: (idx: number) => boolean;

  constructor() {
    super(arguments);
  }

  private mounted() {
    this.retrieveEngineScriptTemplates();
  }

  private addScriptTemplate() {
    const newScript = new EngineScriptTemplate("scriptTemplate_" + this.scripts.length, "");
    this.createEngineScriptTemplate(newScript);
  }

  private duplicateScript(script: EngineScriptTemplate) {
    const newScript = new EngineScriptTemplate(
      script.name + "_copy",
      script.content
    );
    this.createEngineScriptTemplate(newScript);
  }

  private deleteScript(script: EngineScriptTemplate) {
    ModalService.launchConfirmationModal(
      "Do you really wish to delete this entry?"
    ).then(() => {
      this.removeEngineScriptTemplate(script);
      this.$router.push({ name: "scriptTemplates.welcome" });
    });
  }

  private openScriptDetails(script: EngineScriptTemplate) {
    this.$router.push({
      name: "scriptTemplates.view",
      params: { name: script.name }
    });
  }
}
</script>
