<template>
  <v-container fluid class="container pa-0">
    <div class="menu">
      <v-navigation-drawer permanent ref="leftMenu">
        <h1>Templates</h1>
        <router-view name="menu"/>
      </v-navigation-drawer>
    </div>
    <router-view name="view" class="content" />
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
import { Vue, Component } from "vue-property-decorator";

@Component
export default class TemplateContentView extends Vue {
  private mounted() {
    this.setMenuResizable();
  }

  private setMenuResizable() {
    const menuComponent = this.$refs.leftMenu;
    if (menuComponent instanceof Vue) {
      const menuElem = (menuComponent as Vue).$el;
      if (menuElem instanceof HTMLElement) {
        const menuPosition = menuElem.getBoundingClientRect();
        const borderElem = menuElem.querySelector(".v-navigation-drawer__border");

        if (borderElem instanceof HTMLElement) {
          borderElem.style.cursor = "ew-resize";
          borderElem.style.width = "2px";
          function resize(e: MouseEvent) {
            document.body.style.cursor = "ew-resize";
            let width = e.clientX - menuPosition.left;
            width = width < 150 ? 150 : width;
            (menuElem as HTMLElement).style.width = width + "px";
          }

          borderElem.addEventListener("mousedown", (e) => {
            menuElem.style.transition = "initial";
            document.addEventListener("mousemove", resize, false);
          }, false);

          document.addEventListener("mouseup", () => {
            menuElem.style.transition = "";
            document.body.style.cursor = "";
            document.removeEventListener("mousemove", resize, false);
          }, false);
        }
      }
    }
  }
}
</script>