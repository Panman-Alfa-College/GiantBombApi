export class UIManager {
  constructor(characterModel) {
    this.characterModel = characterModel;
    this.dom = {
      firstLetterContainer: document.getElementById("firstLetterContainer"),
      titleContainer: document.getElementById("titleContainer"),
      searchInput: document.getElementById("searchInput"),
      namesContainer: document.getElementById("namesContainer"),
      characterInfoContainer: document.getElementById("characterInfoContainer"),
      extraInfoContainer: document.getElementById("extraInfoContainer"),
    };
  }

  init() {
    this.dom.searchInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        this.handleSearch();
      }
    });
  }

  async loadAndDisplayCharacters() {
    await this.characterModel.loadCharacterNames();
    this.showFirstLetters();
  }

  handleSearch() {
    const query = this.dom.searchInput.value.trim();
    const filteredCharacterNames = this.characterModel.filterCharacterNames(query);
    this.showNames(filteredCharacterNames, query);
  }

  showFirstLetters() {
    this.dom.firstLetterContainer.innerHTML = "";
    const letters = this.characterModel.getUniqueFirstLetters();

    letters.forEach(letter => {
      const filteredCharacterNames = this.characterModel.filterCharacterNames(letter);
      const btn = document.createElement("a");
      btn.href = "#";
      btn.textContent = letter;
      btn.className = "btn btn-primary";
      btn.addEventListener("click", () => {
        this.showNames(filteredCharacterNames, letter);
      });
      this.dom.firstLetterContainer.appendChild(btn);
    });
  }

  showNames(filteredCharacterNames, query) {
    this.dom.namesContainer.innerHTML = "";
    this.dom.titleContainer.textContent = `Zoekresultaten voor: "${query}"`;

    const header = document.createElement("h3");
    header.textContent = `Characters met ${query}`;
    this.dom.namesContainer.appendChild(header);

    if (query.length === 1) { // Filteren op eerste letter
      filteredCharacterNames = filteredCharacterNames.filter(item => item.name.startsWith(query));
    }

    filteredCharacterNames.forEach(item => {
      const link = document.createElement("a");
      link.href = "#";
      link.textContent = item.name.trim();
      link.className = "btn btn-primary m-2";
      link.addEventListener("click", async (event) => {
        event.preventDefault();
        this.dom.extraInfoContainer.innerHTML = "";
        this.dom.titleContainer.innerHTML = "We kijken nu naar " + item.name;

        const characterData = await this.apiClient.getCharacterData(item.api_detail_url);
        if (characterData) {
          this.renderCharacterData(characterData);
        } else {
          console.log("❌ Geen verdere resultaten.");
        }
      });
      this.dom.namesContainer.appendChild(link);
    });
  }

  renderCharacterData(character) {
    const container = this.dom.characterInfoContainer;
    container.innerHTML = "";

    if (character.name) {
      const titleEl = document.createElement("h3");
      titleEl.textContent = character.name;
      container.appendChild(titleEl);
    }

    if (character.image) {
      const img = document.createElement("img");
      img.src = character.image.medium_url;
      img.alt = character.name;
      container.appendChild(img);
    }

    if (character.deck) {
      const desc = document.createElement("p");
      desc.textContent = character.deck;
      container.appendChild(desc);
    }

    if (character.first_appeared_in_game) {
      this.createCharacterButton(
        container,
        [character.first_appeared_in_game],
        `Eerste game van ${character.name}`,
        "firstGame",
        character.name,
        character.first_appeared_in_game.api_detail_url
      );
    }
  }

  createCharacterButton(container, list, buttonText, type, characterName, characterUrl) {
    if (!list.length) return;

    const button = document.createElement("button");
    button.textContent = buttonText;
    button.className = "btn btn-primary m-2";

    const typeDescriptions = {
      enemy: " is een vijand van ",
      friend: " is een vriend van ",
      game: " is een game met ",
      firstGame: " is de eerste game met ",
      charactersInGame: " is een character uit ",
      dlc: " is DLC van ",
      images: " van "
    };

    button.addEventListener("click", async () => {
      this.dom.titleContainer.innerHTML = "We kijken nu naar " + characterName;
      this.dom.extraInfoContainer.innerHTML = "";

      const characterData = await this.apiClient.getCharacterData(characterUrl);
      if (characterData) {
        this.renderCharacterData(characterData);
      }
    });

    container.appendChild(button);
  }
}
