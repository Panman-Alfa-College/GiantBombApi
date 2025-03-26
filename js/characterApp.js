import { CharacterModel } from "./CharacterModel.js";
import { UIManager } from "./UIManager.js";

export class CharacterApp {
  constructor(apiKey, jsonFilePath) {
    this.model      = new CharacterModel(apiKey, jsonFilePath);
    this.uiManager  = new UIManager(this.model);
  }

  async init() {
    await this.uiManager.loadAndDisplayCharacters();
    this.uiManager.init();
  }
}

// Start de app
const app = new CharacterApp("YOUR_API_KEY", "./characters.json");
app.init();
