<template>
  <div class="start-screen fill-height">
    <open-configuration-component />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import OpenConfigurationComponent from "../components/start/OpenConfigurationComponent.vue";

@Component({
  name: "start-screen-view",
  components: {
    OpenConfigurationComponent
  }
})
export default class StartScreenView extends Vue {

}
</script>
