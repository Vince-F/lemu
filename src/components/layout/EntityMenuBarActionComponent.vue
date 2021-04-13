<template>
  <v-tooltip top>
    <template v-slot:activator="{on}">
      <v-btn icon v-on="on" :disabled="disabled" @click="emitClick">
        <v-icon>
          {{iconName}}
        </v-icon>
      </v-btn>
    </template>
    {{tooltipContent}}
  </v-tooltip>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

@Component
export default class EntityMenuBarActionComponent extends Vue {
  @Prop({ required: true, type: String })
  private readonly iconName!: string;

  @Prop({ required: true, type: String })
  private readonly tooltipContent!: string;

  @Prop({ type: Boolean })
  private readonly disabled!: boolean;

  private emitClick($event: Event) {
    this.$emit("click", $event);
  }
}
</script>
