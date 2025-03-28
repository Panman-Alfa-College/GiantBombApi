import { CharacterModel } from "./CharacterModel.js";
import { UIManager } from "./UIManager.js";

export class CharacterApp {
  constructor(apiKey, jsonFilePath) {
    this.model      = new CharacterModel(apiKey, jsonFilePath);
    this.uiManager  = new UIManager(this.model);
  }

  async init() {
    await this.uiManager.loadAndDisplayLetters();
    this.uiManager.init();
  }
}
