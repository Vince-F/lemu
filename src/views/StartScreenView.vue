<template>
  <div class="start-screen fill-height">
    <open-configuration-component />
  </div>
</template>

<style scoped>

</style>

<script lang="ts">
  import { Vue, Component } from "vue-property-decorator";
  import OpenConfigurationComponent from "../components/OpenConfigurationComponent.vue";

  @Component({
    name: "start-screen-view",
    components: {
      OpenConfigurationComponent
    }
  })
  export default class StartScreenView extends Vue {

  }
</script>
