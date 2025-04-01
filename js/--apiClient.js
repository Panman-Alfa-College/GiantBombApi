export class APIClient {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseUrl = "https://www.giantbomb.com/api/";
  }

  async getCharacterData(characterUrl) {
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
}
