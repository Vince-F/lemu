<template>
  <menu-and-content-component>
    <template v-slot:menu>
      <tests-menu-component />
    </template>
    <template v-slot:view>
      <router-view />
    </template>
  </menu-and-content-component>
</template>

<style scoped>
</style>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import TestsMenuComponent from "../components/tests/TestsMenuComponent.vue";
import MenuAndContentComponent from "../components/MenuAndContentComponent.vue";

@Component({
  components: {
    TestsMenuComponent,
    MenuAndContentComponent
  }
})
export default class TestView extends Vue {
}
</script>