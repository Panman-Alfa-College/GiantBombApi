export class APIClient {
    constructor(apiKey) {
      this.apiKey = apiKey;
      this.baseUrl = "https://www.giantbomb.com/api/";
    }
  
    getCharacterData(characterUrl, containerId) {
      const characterContainer = document.getElementById(containerId);
      $.ajax({
        url: characterUrl,
        type: "GET",
        dataType: "jsonp",
        jsonp: "json_callback",
        data: {
          api_key: this.apiKey,
          format: "jsonp"
        },
        success: response => {
          if (response.results) {
            import('./uiManager.js').then(module => {
              module.UIManager.renderCharacterData(response.results, characterContainer);
            });
          } else {
            console.log("❌ Geen verdere resultaten.");
          }
        },
        error: (xhr, status, error) =>
          console.error("API Fout:", status, error)
      });
    }
  }
  