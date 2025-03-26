export class CharacterModel {
    constructor(apiKey, jsonFilePath) {
        this.apiKey = apiKey;
        this.baseUrl = "https://www.giantbomb.com/api/";
        this.jsonFilePath = jsonFilePath;
        this.characterNames = [];
    }
  
    async getCharactersDataFromAPI(characterUrl) {
      try {
        const response = await $.ajax({
          url: characterUrl,
          type: "GET",
          dataType: "jsonp",
          jsonp: "json_callback",
          data: {
            api_key: this.apiKey,
            format: "jsonp"
          }
        });
  
        return response.results || null;
      } catch (error) {
        console.error("❌ API Fout:", error);
        return null;
      }
    }
  
    async loadCharacterNames() {
        try {
          const response = await fetch(this.jsonPath);
          this.characterNames = await response.json();
          return this.characterNames; // Geeft de geladen data terug
        } catch (error) {
          console.error("Fout bij laden van (JSON characterNames:", error);
          return [];
        }
      }
    
      filterCharacterNames(query) {
        return this.characterNames.filter(character =>
          character.name.toLowerCase().includes(query.toLowerCase())
        );
      }
    
      getUniqueFirstLetters() {
        return [...new Set(this.characterNames.map(c => c.name.charAt(0).toUpperCase()))].sort();
      }
  }
  