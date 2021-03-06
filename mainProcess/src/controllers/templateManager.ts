import { app } from "electron";
import * as path from "path";
import * as fs from "fs";
import { FileService } from "./fileService";

export class TemplateManager {
  public static getInstance() {
    if (!this.instance) {
      this.instance = new TemplateManager();
    }
    return this.instance;
  }

  private static instance: TemplateManager;
  private readonly templateDirectory: string;
  private readonly engineScriptsTemplateDirectory: string;
  private readonly configurationsTemplateDirectory: string;

  private constructor() {
    this.templateDirectory = path.join(app.getAppPath(), "templates");
    this.engineScriptsTemplateDirectory = path.join(this.templateDirectory, "engineScripts");
    this.configurationsTemplateDirectory = path.join(this.templateDirectory, "configurations");
  }

  public createIfNotExistTemplateDirectories() {
    // we user synchronous mkdir as we want directory to be created in order and waiting for other
    if (!fs.existsSync(this.templateDirectory)) {
      fs.mkdirSync(this.templateDirectory);
    }
    if (!fs.existsSync(this.engineScriptsTemplateDirectory)) {
      fs.mkdirSync(this.engineScriptsTemplateDirectory);
    }
    if (!fs.existsSync(this.configurationsTemplateDirectory)) {
      fs.mkdirSync(this.configurationsTemplateDirectory);
    }
  }

  public createScriptTemplate(name: string, content: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const scriptPath = path.join(this.engineScriptsTemplateDirectory, name + ".js");
      if (!fs.existsSync(scriptPath)) {
        fs.writeFile(scriptPath, content, { encoding: "utf-8" }, (err) => {
          if (err) {
            reject("Failed to create file, error: " + err.message);
          } else {
            resolve();
          }
        });
      } else {
        reject("File alreay exists");
      }
    });
  }

  public createOrUpdateScriptTemplate(name: string, content: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const scriptPath = path.join(this.engineScriptsTemplateDirectory, name + ".js");
      fs.writeFile(scriptPath, content, { encoding: "utf-8" }, (err) => {
        if (err) {
          reject("Failed to create file, error: " + err.message);
        } else {
          resolve();
        }
      });
    });
  }

  public deleteScriptTemplate(name: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const scriptPath = path.join(this.engineScriptsTemplateDirectory, name + ".js");
      fs.unlink(scriptPath, (err) => {
        if (err) {
          reject("Failed to delete file, error: " + err.message);
        } else {
          resolve();
        }
      });
    });
  }

  public retrieveEngineScriptTemplates() {
    return new Promise((resolve, reject) => {
      this.createIfNotExistTemplateDirectories();
      fs.readdir(this.engineScriptsTemplateDirectory, (err, files) => {
        if (err) {
          reject(err);
        } else {
          const filePromises = files
          .filter((file) => file.endsWith(".js"))
          .map((file) => FileService.readFile(path.join(this.engineScriptsTemplateDirectory, file))
            .then((content) => ({ name: file.replace(".js", ""), content }) ));
          Promise.all(filePromises)
            .then((scripts) => {
              resolve(scripts);
            }).catch((error) => {
              reject(error);
            });
        }
      });
    });
  }

  public createConfigurationTemplate(name: string, content: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const configPath = path.join(this.configurationsTemplateDirectory, name + ".json");
      if (!fs.existsSync(configPath)) {
        fs.writeFile(configPath, content, { encoding: "utf-8" }, (err) => {
          if (err) {
            reject("Failed to create file, error: " + err.message);
          } else {
            resolve();
          }
        });
      } else {
        reject("File alreay exists");
      }
    });
  }

  public createOrUpdateConfigurationTemplate(name: string, content: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const scriptPath = path.join(this.configurationsTemplateDirectory, name + ".json");
      fs.writeFile(scriptPath, content, { encoding: "utf-8" }, (err) => {
        if (err) {
          reject("Failed to create file, error: " + err.message);
        } else {
          resolve();
        }
      });
    });
  }

  public deleteConfigurationTemplate(name: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const scriptPath = path.join(this.configurationsTemplateDirectory, name + ".json");
      fs.unlink(scriptPath, (err) => {
        if (err) {
          reject("Failed to delete file, error: " + err.message);
        } else {
          resolve();
        }
      });
    });
  }

  public retrieveConfigurationTemplates() {
    return new Promise((resolve, reject) => {
      this.createIfNotExistTemplateDirectories();
      fs.readdir(this.configurationsTemplateDirectory, (err, files) => {
        if (err) {
          reject(err);
        } else {
          const filePromises = files
          .filter((file) => file.endsWith(".json"))
          .map((file) => FileService.readFile(path.join(this.configurationsTemplateDirectory, file))
            .then((content) => ({ name: file.replace(".json", ""), content }) ));
          Promise.all(filePromises)
            .then((configurations) => {
              resolve(configurations);
            }).catch((error) => {
              reject(error);
            });
        }
      });
    });
  }
}
