<template>
  <v-row align="center" justify="center" class="ma-0">
    <v-card>
      <v-card-title>Tests</v-card-title>
      <v-card-text>
        <p>Select a test to edit it.</p>
        <p>Or
          <v-btn color="primary" text v-on:click="addScenario">
            <v-icon>mdi-plus</v-icon>Add
          </v-btn>
          a new one.
        </p>
      </v-card-text>
    </v-card>
  </v-row>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { Mutation } from "vuex-class";

@Component
export default class TestWelcomeScreenComponent extends Vue {
  @Mutation("configurationStore/addScenario")
  private addScenario!: () => void;
}
</script>
