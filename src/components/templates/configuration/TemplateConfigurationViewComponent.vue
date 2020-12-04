<template>
<v-card>
    <v-toolbar flat color="primary" dark>
      <v-toolbar-title>Template name</v-toolbar-title>
    </v-toolbar>
    <v-tabs vertical>
      <v-tab>
        <v-icon left>
          mdi-cog
        </v-icon>
        General
      </v-tab>
      <v-tab>
        <v-icon left>
          mdi-bug
        </v-icon>
        Scenarios
      </v-tab>

      <v-tab-item>
        General configuration
      </v-tab-item>
      <v-tab-item>
        scenarios
      </v-tab-item>
    </v-tabs>
  </v-card>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

@Component
export default class TemplateConfigurationViewComponent extends Vue {

}
</script>