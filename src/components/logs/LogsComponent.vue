<template>
  <v-card class="card">
    <v-card-title class="header flex-grow-0 flex-shrink-0">
      <div class="flex-grow-1 flex-shrink-1">
        Logs 
      </div>
      <div class="flex-grow-0 flex-shrink-0">
        <v-btn icon @click="resetLogs">
          <v-icon>
            mdi-delete
          </v-icon>
        </v-btn>
      </div>
    </v-card-title>
    <v-card-text class="content flex-grow-1 flex-shrink-1">
      <p v-for="(log, index) in logs" :key="index" class="log-entry">
        {{log}}
      </p>
    </v-card-text>
  </v-card>
</template>

<style scoped >
.card {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.header {
  border-bottom: 1px solid rgba(0,0,0,0.18);
}

.content {
  overflow:auto;
}

.log-entry {
  margin: 4px;
}
</style>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { State, Mutation } from "vuex-class";

@Component
export default class LogsComponent extends Vue {
  @State((state) => state.testLogStore.logs)
  private readonly logs!: string[];
  @Mutation("testLogStore/resetLogs")
  private readonly resetLogs!: () => void;
}
</script>