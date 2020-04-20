<template>
  <ReportComponent />
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import ReportComponent from "../components/report/ReportComponent.vue";

@Component({
  components: {
    ReportComponent
  }
})
export default class ReportView extends Vue {

}
</script>