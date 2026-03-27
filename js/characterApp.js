import { Model } from "./characterModel.js";
import { UIManager } from "./uiManager.js";

export class CharacterApp {
  constructor(apiKey, jsonFilePath) {
    this.model      = new Model(apiKey, jsonFilePath);
    this.uiManager  = new UIManager(this.model);
  }

  async init() {
    await this.uiManager.loadAndDisplayLetters();
    this.uiManager.init();
  }
}
