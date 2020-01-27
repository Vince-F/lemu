<template>
  <div>
    <img :src="imgSrc" v-on:load="stopLoading" 
          class="standard-image"
          @click="openFullScreen"/>
    <v-progress-circular
        v-if="loading"
        indeterminate
        color="primary"
        :size="30"
        :width="3"
      ></v-progress-circular>
    <v-overlay :value="zoomed" class="image-overlay">
      <img :src="imgSrc" v-on:load="stopLoading" />
      <v-btn
        icon @click="zoomed = false"
      >
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-overlay>
  </div>
</template>

<style scoped>
  img.standard-image {
    max-width: 90%;
  }

  .image-overlay {
    height: 100%;
    margin-top: 64px;
  }
</style>

<script lang="ts">
import { Vue, Prop, Component } from "vue-property-decorator";

@Component
export default class ZoomableImageComponent extends Vue {
  @Prop({required: true, type: String})
  private readonly imgSrc!: string;
  private zoomed: boolean;
  private loading: boolean;

  constructor() {
    super(arguments);
    this.zoomed = false;
    this.loading = false;
  }

  private openFullScreen() {
    this.zoomed = true;
    this.loading = true;
  }

  private stopLoading() {
    this.loading = false;
  }
}
</script>