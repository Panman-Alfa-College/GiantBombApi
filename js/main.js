import { CharacterApp } from "./characterApp.js";
console.log("Applicatie gestart");
const apiKey = "af3f9de4abc7f47586ff0587a49a0d1b0e620101";
const jsonFilePath = "../characterJSON.json";
const app = new CharacterApp(apiKey, jsonFilePath);
app.init();
