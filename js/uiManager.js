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

  async loadAndDisplayLetters() {
    await this.characterModel.loadCharacterNames(); //load character names from JSON file and store in characterModel
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
      btn.addEventListener("click", (event) => {        
        this.showNames(filteredCharacterNames, letter);
      });
      this.dom.firstLetterContainer.appendChild(btn);
    });
  }

  showNames(filteredCharacterNames, query) {
    this.dom.namesContainer.innerHTML = ""; // Leeg de lijst voor nieuwe namen
    this.dom.characterInfoContainer.innerHTML = ""; // Leeg de character info container
    this.dom.extraInfoContainer.innerHTML = ""; // Leeg de extra info container
    this.dom.titleContainer.textContent = `Zoekresultaten voor: "${query}"`;

    const header = document.createElement("h3");
    header.textContent = `Characters met ${query}`;
    this.dom.namesContainer.appendChild(header);

    filteredCharacterNames.forEach(item => {
      const link = document.createElement("a");
      link.href = "#";
      link.textContent = item.name.trim();
      link.className = "btn btn-primary m-2";
      link.addEventListener("click", async (event) => {
        event.preventDefault(); 
        const parentContainerId = event.target.parentElement.id;       
        this.loadAndDisplayItem(item.api_detail_url, parentContainerId); // Laad de details van het character        
      });
      this.dom.namesContainer.appendChild(link);
    });
  }

  buildCharacter(character) {
    const fragment = document.createDocumentFragment();   

    if (character.name) {
      const characterNameTitle = document.createElement("h3");
      characterNameTitle.id = character.name + "Title";
      characterNameTitle.textContent = character.name;
      fragment.appendChild(characterNameTitle);
    }

    if (Array.isArray(character) && character.length > 0 && character[0].hasOwnProperty("medium_url")) {
        const imagesTitle = this.dom.titleContainer.textContent.trim().split("van")[0];

        characterNameTitle.textContent = imagesTitle;
        fragment.appendChild(characterNameTitle);
        character.forEach(image => {
          const characterImage = document.createElement("img");
          characterImage.src = image.medium_url;
          characterImage.alt = "";
          fragment.appendChild(characterImage);
      });
    }


    if (character.image) {
      const img = document.createElement("img");
      img.src = character.image.medium_url;
      img.alt = character.name;
      fragment.appendChild(img);
    }

    if (character.deck || character.description) {
      const desc = document.createElement("p");
      desc.textContent = character.deck || character.description;
      fragment.appendChild(desc);
    }

    if (character.characters) {
      this.createCharacterButton(
        fragment,
        character.characters,
        "Characters in " + character.name,
        "charactersInGame",
        character.name,
        character.api_detail_url
      );
    }

    if (character.games) {
      this.createCharacterButton(
        fragment,
        character.games,
        "Games met " + character.name,
        "game",
        character.name,
        character.api_detail_url
      );
    }

    if (character.dlcs) {
      this.createCharacterButton(
        fragment,
        character.dlcs,
        "DLC van " + character.name,
        "dlc",
        character.name,
        character.api_detail_url
      );
    }

    if (character.friends) {
      this.createCharacterButton(
        fragment,
        character.friends,
        "Vrienden van " + character.name,
        "friend",
        character.name,
        character.api_detail_url
      );
    }

    if (character.enemies) {
      this.createCharacterButton(
        fragment,
        character.enemies,
        "Vijanden van " + character.name,
        "enemy",
        character.name,
        character.api_detail_url
      );
    }

    if (character.image_tags) {
      this.createCharacterButton(
        fragment,
        character.image_tags,
        "Afbeeldingen van " + character.name,
        "images",
        character.name,
        character.api_detail_url
      );
    }

    if (character.first_appeared_in_game) {
      this.createCharacterButton(
        fragment,
        [character.first_appeared_in_game],
        `Eerste game van ${character.name}`,
        "firstGame",
        character.name,
        character.first_appeared_in_game.api_detail_url
      );
    }

    return(fragment); // Return the fragment instead of appending it directly
  }

  displayCharacter(fragment, parentContainerId) {
    console.log(parentContainerId);

    if(parentContainerId == "characterInfoContainer") {
      //this.dom.extraInfoContainer.innerHTML = ""; // Leeg de extra info container
      //this.dom.extraInfoContainer.appendChild(fragment); // Voeg de nieuwe content toe aan de container
    } 
    
    if(parentContainerId == "namesContainer") {
        if(this.dom.characterInfoContainer.innerHTML == "") {          
          this.dom.characterInfoContainer.appendChild(fragment); // Voeg de nieuwe content toe aan de container
        } else {
          this.dom.extraInfoContainer.innerHTML = ""; // Leeg de extra info container
          this.dom.extraInfoContainer.appendChild(fragment); // Voeg de nieuwe content toe aan de container
        }      
    }

    if(parentContainerId == "extraInfoContainer") {
      this.dom.extraInfoContainer.innerHTML = ""; // Leeg de extra info container
      this.dom.characterInfoContainer.innerHTML = ""; // Leeg de extra info container
      this.dom.characterInfoContainer.appendChild(fragment); // Voeg de nieuwe content toe aan de container
    } 

  }


  async loadAndDisplayItem(itemUrl, parentContainerId) {
    


    try {
      const characterData = await this.characterModel.loadCharacterData(itemUrl);
      if (!characterData) throw new Error("Geen data gevonden");
  
      const characterHtml = this.buildCharacter(characterData);
      this.displayCharacter(characterHtml, parentContainerId); // Gebruik de nieuwe functie om de HTML weer te geven
    } catch (error) {
      console.error("❌ Fout bij laden:", error);
    }
    
  }


  createCharacterButton(fragment, list, buttonText, type, characterName, characterUrl) {
    if (list.length > 0) {
      const button = document.createElement("button");
      button.textContent = buttonText;
      button.classList.add("btn", "btn-primary", "m-2");

      const typeDescriptions = {
        enemy: " is een vijand van ",
        friend: " is een vriend van ",
        game: " is een game met ",
        firstGame: " is de eerste game met ",
        charactersInGame: " is een character uit ",
        dlc: " is DLC van ",
        images: " van "
      };

      button.addEventListener("click", (event) => {
        this.dom.titleContainer.innerHTML = "We kijken nu naar " + characterName;
        const containerTitle = this.dom.characterInfoContainer.textContent;

        if (containerTitle != characterName) {
          const parentContainerId = event.target.parentElement.id;       
          this.loadAndDisplayItem(characterUrl, parentContainerId); // Laad de details van het character

        }

        this.dom.namesContainer.innerHTML = `<h3>${buttonText}</h3>`; // Leeg de lijst voor nieuwe vrienden/vijanden
        list.forEach(item => {
          const itemButton = document.createElement("a");
          itemButton.href = "#";
          itemButton.textContent = item.name;
          itemButton.classList.add("btn", "btn-primary", "m-2");


          const itemUrl = (type == "enemy" || type == "friend")
            ? item.api_detail_url.replace(type, "character")
            : item.api_detail_url;

          if (list.length === 1) {            
              const parentContainerId = event.target.parentElement.id;       
              this.loadAndDisplayItem(itemUrl, parentContainerId); // Laad de details van het character
              if (typeDescriptions[type]) {
                this.dom.titleContainer.innerHTML = `${item.name}${typeDescriptions[type]}${characterName}`;
              }
              console.log(itemUrl + "er is maar 1 item --- stop gelijk in extrainfo container");        
          }

          itemButton.addEventListener("click", (event) => {
            event.preventDefault();
            if (typeDescriptions[type]) {
              this.dom.titleContainer.innerHTML = `${item.name}${typeDescriptions[type]}${characterName}`;
            }
            const parentContainerId = event.target.parentElement.id;       
            this.loadAndDisplayItem(itemUrl, parentContainerId); // Laad de details van het character
          });


          this.dom.namesContainer.appendChild(itemButton);

        });
      });
      fragment.appendChild(button);
    }
  }

}
