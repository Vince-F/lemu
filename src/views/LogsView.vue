<template>
  <logs-component />
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import LogsComponent from "../components/logs/LogsComponent.vue";

@Component({
  components: {
    LogsComponent
  }
})
export default class LogsView extends Vue {

}
</script>