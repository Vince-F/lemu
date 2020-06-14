<template>
  <div>
    <h1>Logs</h1>
    <p v-for="(log, index) in logs" :key="index">
      {{log}}
    </p>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { State } from "vuex-class";

@Component
export default class LogsComponent extends Vue {
  @State((state) => state.testLogStore.logs)
  private readonly logs!: string[];
}
</script>