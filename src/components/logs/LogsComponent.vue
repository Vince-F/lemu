<template>
  <v-card class="card">
    <v-card-title class="header flex-grow-0 flex-shrink-0">
      <div class="flex-grow-1 flex-shrink-1">
        Logs 
      </div>
      <div class="flex-grow-0 flex-shrink-0">
        <entity-menu-bar-action-component iconName="mdi-delete" tooltipContent="Reset logs"
          @click="resetLogs"/>
      </div>
    </v-card-title>
    <v-card-text class="content flex-grow-1 flex-shrink-1" ref="container">
      <div v-for="(log, index) in logs" :key="index" class="d-flex log-entry">
        <template v-if="log.level === 'divider'">
          <v-divider v-if="index > 0"></v-divider>
        </template>
        <template v-else>
          <div class="flex-grow-0 flex-shrink-0">{{log.time.toLocaleTimeString()}}</div>
          <div class="flex-grow-1 flex-shrink-1" :class="{'red--text': log.message.toLocaleLowerCase().includes('error')}">{{log.message}}</div>
        </template>
      </div>
      <div v-if="logs.length === 0">
        <p>No log here yet...</p>
        <p>Here the logs of Backstop when tests are run will be displayed</p>
      </div>
      <div ref="end" class="end"></div>
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

.log-entry div + div {
  margin-left: 8px;
}

.end {
  height: 10px;
}
</style>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { State, Mutation } from "vuex-class";
import EntityMenuBarActionComponent from "../layout/EntityMenuBarActionComponent.vue";

@Component({
  components: {
    EntityMenuBarActionComponent
  }
})
export default class LogsComponent extends Vue {
  @State((state) => state.testLogStore.logs)
  private readonly logs!: Array<{message: string, level: string, time: Date}>;
  @Mutation("testLogStore/resetLogs")
  private readonly resetLogs!: () => void;

  @Watch("logs")
  private scrollDown() {
    const end = this.$refs.end;
    if (end instanceof Element) {
      end.scrollIntoView(false);
    }
  }
}
</script>
