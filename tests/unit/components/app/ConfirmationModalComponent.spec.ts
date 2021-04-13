import Vue from 'vue';
import Vuetify from 'vuetify';
import { shallowMount, mount, createLocalVue } from "@vue/test-utils";
import ConfirmationModalComponent from "@/components/app/ConfirmationModalComponent.vue";

Vue.use(Vuetify);

describe("ConfirmationModalComponent", () => {
  const localVue = createLocalVue();
  let vuetify: any;

  beforeEach(() => {
    vuetify = new Vuetify();
  });

  describe("template", () => {
    it ("should contain the content in the modal body", () => {
      const componentInstance = shallowMount(ConfirmationModalComponent, {
        /*localVue,*/
        /*vuetify,*/
        propsData: {
          textContent: "Hello test!"
        }
      });
      const body = componentInstance.find("v-card-text-stub");
      expect(body.text()).toContain("Hello test!");
    });
  });

  describe("events", () => {
    it("should close the modal and announce user has accepted", async () => {
      const componentInstance = mount(ConfirmationModalComponent, {
        localVue,
        vuetify,
        propsData: {
          textContent: "Hello test!"
        }
      });
      const footer = componentInstance.find(".v-card__actions");
      const buttons = footer.findAll(".v-btn");
      await buttons.at(0).trigger("click");
      await componentInstance.vm.$nextTick();
      expect(componentInstance.emitted().accept).toBeTruthy();
    });
  });
});
