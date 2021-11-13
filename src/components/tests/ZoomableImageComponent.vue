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
    <v-overlay :value="zoomed" class="image-overlay" @click.native="zoomed = false">
      <div class="d-flex fill-height" @click.stop="">
        <v-btn-toggle
          v-model="selectedImageIndex"
          tile
          color="primary accent-3"
          group
        >
          <v-btn v-for="imageDesc in otherImages" :key="imageDesc.type">
            {{imageDesc.type}}
          </v-btn>
        </v-btn-toggle>
        {{currentZoomedUrl}}
        <div class="overlay-image-container flex-grow-1 flex-shrink-1">
          <img :src="otherImages[selectedImageIndex].src" v-on:load="stopLoading" />
        </div>
        <v-btn class="flex-grow-0 flex-shrink-0"
          icon @click="zoomed = false"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </div>
    </v-overlay>
  </div>
</template>

<style>
  img.standard-image {
    max-width: 90%;
    cursor: pointer;
  }

  .image-overlay {
    height: 100%;
    padding-top: 64px;
  }

  .image-overlay>.v-overlay__content {
    height: 100%;
    padding: 24px;
  }

  .overlay-image-container {
    overflow: auto;
  }
  .overlay-image-container img {
    max-width: 100%;
  }
</style>

<script lang="ts">
import { Vue, Prop, Component } from "vue-property-decorator";

@Component
export default class ZoomableImageComponent extends Vue {
  @Prop({ required: true, type: String })
  private readonly imgSrc!: string;

  @Prop({ required: true, type: Array })
  private readonly otherImages!: Array<{
    type: string,
    src: string
  }>;

  private selectedImageIndex: number;
  private zoomed: boolean;
  private loading: boolean;

  constructor() {
    super(arguments);
    this.zoomed = false;
    this.loading = false;
    this.selectedImageIndex = 0;
  }

  private mounted() {
    this.selectedImageIndex = this.otherImages.findIndex((val) => val.src === this.imgSrc);
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
