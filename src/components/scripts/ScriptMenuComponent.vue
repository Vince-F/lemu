<template>
  <v-container fluid class="container pa-0">
    <div class="menu">
      <v-treeview :items="items"
        activatable
        @update:active="selectScript"></v-treeview>
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
import { State, Action, Getter } from "vuex-class";
import { TreeEntry } from "../../models/treeEntry";
import { CustomScript } from '../../models/customScript';

@Component
export default class ScriptMenuComponent extends Vue {
  @State((state) => state.customScriptStore.scripts)
  private readonly scripts!: CustomScript[];
  @Getter("configurationStore/engineScriptDirectory")
  private readonly engineScriptDirectory!: string;
  private items: TreeEntry[];

  constructor() {
    super(arguments);
    this.items = [];
  }

  private mounted() {
    this.updateItemsList();
  }

  private selectScript([path]: [string]) {
    if (path.endsWith(".js")) {
      this.$router.push(`/tests/customScripts/${encodeURIComponent(path)}`);
    }
  }

  @Watch("scripts")
  private updateItemsList() {
    const paths = new Map();
    this.scripts.forEach((script) => {
      const basePath = script.path.replace(this.engineScriptDirectory, "");
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
    this.items = this.createTreeItemFromMap(paths, "");
  }

  private createTreeItemFromMap(map: Map<string, Map<string, any>>, path: string) {
    const items: TreeEntry[] = [];
    map.forEach((value, key) => {
      items.push({
        id: path + (path.length > 0 ? "/" : "") + key,
        name: key,
        children: this.createTreeItemFromMap(value, path + (path.length > 0 ? "/" : "") + key)
      });
    });
    return items;
  }
}
</script>