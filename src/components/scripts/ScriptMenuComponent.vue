<template>
  <v-container fluid class="container pa-0">
    <div class="menu">
      <v-navigation-drawer permanent ref="leftMenu">
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>
              ENGINE SCRIPTS
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
          
        <v-divider></v-divider>
        <v-treeview :items="items"
          activatable
          @update:active="selectScript"
          open-on-click>
          <template v-slot:prepend="{ item, open }">
            <v-icon v-if="!item.isScript">
              {{ open ? 'mdi-folder-open' : 'mdi-folder' }}
            </v-icon>
            <v-icon v-else>
              mdi-nodejs
            </v-icon>
          </template>
          <template v-slot:label="{item}">
            <v-tooltip top>
              <template v-slot:activator="{on}">
                <span v-on="on">{{item.name}}</span>
              </template>
              {{item.name}}
            </v-tooltip>
          </template>
          <template v-slot:append="{ item }">
            <v-btn icon v-if="item.isScript" @click="deleteScript(item.id)">
              <v-icon color="grey lighten-1">
                mdi-delete
              </v-icon>
            </v-btn>
            <v-btn icon v-else @click="createScript(item.id)">
              <v-icon color="grey lighten-1">
                mdi-plus
              </v-icon>
            </v-btn>
          </template>
        </v-treeview>
      </v-navigation-drawer>
    </div>
    <router-view class="content" />
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
  border-right: 1px solid rgba(0, 0, 0, 0.12);
  flex-basis: 250px;
  max-width: 250px;
  width: 250px;
  background: white;  
}

.content {
  flex: 1;
  height: 100%;
  max-height: 100%;
  overflow: auto;
}
</style>

<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator";
import { State, Action, Getter, Mutation } from "vuex-class";
import { TreeEntry } from "../../models/treeEntry";
import { EngineScript } from '../../models/engineScript';
import { ModalService } from "../../services/modalService";
import AddScriptModalComponent from "./AddScriptModalComponent.vue";
import { FileService } from "../../services/fileService";

@Component
export default class ScriptMenuComponent extends Vue {
  @State((state) => state.engineScriptStore.scripts)
  private readonly scripts!: EngineScript[];
  @Getter("configurationStore/engineScriptDirectory")
  private readonly engineScriptDirectory!: string;
  @Mutation("applicationStore/displaySnackbar")
  private readonly displaySnackbar!: (payload: {text: string, success: boolean}) => void;
  @Mutation("engineScriptStore/addScript")
  private readonly addScript!: (payload: {scriptPath: string, content: string}) => void;
  @Mutation("engineScriptStore/removeScript")
  private readonly removeScript!: (scriptPath: string) => void;
  private items: TreeEntry[];

  constructor() {
    super(arguments);
    this.items = [];
  }

  private mounted() {
    this.updateItemsList();
  }

  private createScript(path: string) {
    ModalService.launchModal(AddScriptModalComponent)
      .then((result: {
        type: "empty" | "fromFile",
        fileName: string,
        originFilePath: string;
      }) => {
        let fileName = result.fileName;
        if (!fileName.endsWith(".js")) {
          fileName += ".js";
        }
        const fullPath = FileService.resolvePath([this.engineScriptDirectory, path, fileName]);
        switch (result.type) {
          case "empty":
            FileService.writeFile(fullPath, "")
              .then(() => {
                this.displaySnackbar({
                  text: "File successfully created",
                  success: true
                });
                this.addScript({scriptPath: fullPath, content: ""});
              }).catch((error) => {
                this.displaySnackbar({
                  text: error,
                  success: false
                });
              });
            break;
          case "fromFile":
              FileService.readFile(result.originFilePath)
                .then((fileContent: string) => {
                  this.displaySnackbar({
                    text: "File successfully created",
                    success: true
                  });
                  this.addScript({scriptPath: fullPath, content: fileContent});
                }).catch((error) => {
                  this.displaySnackbar({
                    text: error,
                    success: false
                  });
                });
        }
      });
  }

  private deleteScript(path: string) {
    ModalService.launchConfirmationModal()
      .then(() => {
        this.removeScript(path);
      });
  }

  private selectScript([path]: [string]) {
    if (path.endsWith(".js")) {
      this.$router.push(`/tests/engineScripts/${encodeURIComponent(path)}`);
    }
  }

  @Watch("scripts")
  private updateItemsList() {
    const paths = new Map();
    this.scripts.forEach((script) => {
      let basePath = script.path.replace(this.engineScriptDirectory, "").replace(/\\/g, "/");
      const tmp = this.engineScriptDirectory.replace(/\\/g, "/").split("/");
      const scriptDirectory = tmp[tmp.length - 1];
      basePath = scriptDirectory + "/" + basePath;
      const splittedPath = basePath.split("/");
      let currentLevelMap = paths;
      splittedPath.forEach((dirOrFile) => {
        if (dirOrFile.length > 0) {
          if (!currentLevelMap.has(dirOrFile)) {
            currentLevelMap.set(dirOrFile, new Map());
          }
          currentLevelMap = currentLevelMap.get(dirOrFile);
        }
      });
    });
    this.items = this.createTreeItemFromMap(paths, "", true);
  }

  private createTreeItemFromMap(map: Map<string, Map<string, any>>, path: string, rootDirectory?: boolean) {
    const items: TreeEntry[] = [];
    map.forEach((value, key) => {

      items.push({
        id: path + (path.length > 0 ? "/" : "") + (rootDirectory ? "" : key),
        name: key,
        isScript: key.endsWith(".js"),
        children: this.createTreeItemFromMap(value, path + (path.length > 0 ? "/" : "") + (rootDirectory ? "" : key))
      });
    });
    return items;
  }
}
</script>