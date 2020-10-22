import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators';
import { EngineScriptTemplate } from '@/models/engineScriptTemplate';
import { TemplateService } from '@/services/templateService';

@Module({
  namespaced: true
})
export default class TemplateStore extends VuexModule {
  private scripts: EngineScriptTemplate[] = [];

  @Action({rawError: true})
  public createEngineScriptTemplate({name, content}: EngineScriptTemplate) {
    const hasNameDuplicate = !!this.scripts.find((script) => script.name === name);
    if (hasNameDuplicate) {
      return Promise.reject("duplicateName");
    } else {
      return TemplateService.createScriptTemplate(name, content)
        .then(() => {
          this.context.commit("addEngineScriptTemplate", new EngineScriptTemplate(name, content));
        });
    }
  }

  @Action
  public retrieveEngineScriptTemplates() {
    return TemplateService.retrieveScriptTemplates()
      .then((scriptTemplates) => {
        this.context.commit("setEngineScriptTemplates", scriptTemplates);
      });
  }

  @Mutation
  private addEngineScriptTemplate(script: EngineScriptTemplate) {
    this.scripts.push(script);
  }

  @Mutation
  private setEngineScriptTemplates(scripts: EngineScriptTemplate[]) {
    this.scripts = scripts;
  }
}
