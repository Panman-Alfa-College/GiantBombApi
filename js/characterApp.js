import { APIClient } from "./apiClient.js";
import { UIManager } from "./uiManager.js";

export class CharacterApp {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.apiClient = new APIClient(apiKey);
    this.charactersData = [];
  }

  init() {
    fetch("characterJSON.json")
      .then(response => response.json())
      .then(data => {
        this.charactersData = data;
        UIManager.init(this.charactersData, this.apiClient);
      })
      .catch(error => console.error("Fout bij laden van JSON:", error));
  }
}
