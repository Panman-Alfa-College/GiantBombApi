export class UIManager {
  constructor(model) {
    this.model = model;
    this.dom = {
      firstLetterContainer:   document.getElementById("firstLetterContainer"),
      titleContainer:         document.getElementById("titleContainer"),
      searchInput:            document.getElementById("searchInput"),
      namesContainer:         document.getElementById("namesContainer"),
      characterInfoContainer: document.getElementById("characterInfoContainer"),
      extraInfoContainer:     document.getElementById("extraInfoContainer"),
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
    await this.model.loadCharacterNames(); //load character names from JSON file and store in characterModel
    this.showFirstLetters();
  }

  handleSearch() {
    const query = this.dom.searchInput.value.trim();
    const filteredCharacterNames = this.model.filterCharacterNames(query);
    this.showNames(filteredCharacterNames, query);
  }

  showFirstLetters() {
    this.dom.firstLetterContainer.innerHTML = "";
    const letters = this.model.getUniqueFirstLetters();

    letters.forEach(letter => {
      const filteredCharacterNames = this.model.filterCharacterNames(letter);
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

  buildItem(item) {
    const fragment = document.createDocumentFragment();   
    const itemTitle = document.createElement("h3"); // 
console.log(item, "item"); // Log het item voor debugging
    if (item.name) {
      
      itemTitle.id = item.name + "Title";
      itemTitle.textContent = item.name;
      fragment.appendChild(itemTitle); 
    }

    if (Array.isArray(item) && item.length > 0 && item[0].hasOwnProperty("medium_url")) {
        const imagesTitle = this.dom.titleContainer.textContent.trim().split("van")[0];
        itemTitle.textContent = imagesTitle;
        fragment.appendChild(itemTitle);
        item.forEach(image => {
          const itemImage = document.createElement("img");
          itemImage.src = image.medium_url;
          itemImage.alt = "";
          fragment.appendChild(itemImage);
      });
    }


    if (item.image) {
      const img = document.createElement("img");
      img.src = item.image.medium_url;
      img.alt = item.name;
      fragment.appendChild(img);
    }

    if (item.deck || item.description) {
      const desc = document.createElement("p");
      desc.textContent = item.deck || item.description;
      fragment.appendChild(desc);
    }

    if (item.characters) {
      this.createButton(
        fragment,
        item,        
        "characters",        
      );
    }

    if (item.games) {
      this.createButton(
        fragment,
        item,
        "games",        
      );
    }

    if (item.dlcs) {
      this.createButton(
        fragment,
        item,        
        "dlcs",  
      );
    }

    if (item.friends) {
      this.createButton(
        fragment,
        item,        
        "friends",        
      );
    }

    if (item.enemies) {
      this.createButton(
        fragment,
        item,        
        "enemies",        
      );
    }

    if (item.image_tags) {
      this.createButton(
        fragment,
        item,        
        "images_tags",        
      );
    }

    if (item.first_appeared_in_game) {
      this.createButton(
        fragment,   
        item,
        "first_appeared_in_game",                
      );
    }

    return(fragment); // Return the fragment instead of appending it directly
  }

  displayCharacter(fragment, parentContainerId) {
    
    if(parentContainerId == "characterInfoContainer") {
      this.dom.extraInfoContainer.innerHTML = ""; // Leeg de extra info container
      this.dom.extraInfoContainer.appendChild(fragment); // Voeg de nieuwe content toe aan de container
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
    console.log("parentContainerId", parentContainerId); // Log de parentContainerId voor debugging`
    console.log("itemUrl", itemUrl); // Log de itemUrl voor debugging
    try {
      const data = await this.model.loadData(itemUrl);
      if (!data) throw new Error("Geen data gevonden");  
        const html = this.buildItem(data);
        this.displayCharacter(html, parentContainerId); // Gebruik de nieuwe functie om de HTML weer te geven
    } catch (error) {
      console.error("❌ Fout bij laden:", error);
    }    
  }


  createButton(fragment, item, type) {    
    
    const buttonTextMap = {
      enemies: "Vijanden",
      friends: "Vrienden",
      games: "Games",
      first_appeared_in_game: "Eerste Game",
      characters: "Characters in Game",
      dlcs: "DLC",
      image_tags: "Afbeeldingen"
    };

  const typeDescriptionsMap = {
      enemies: " is een vijand van ",
      friends: " is een vriend van ",
      games: " komt voor in de game ",
      first_appeared_in_game: " is voor het eerst verschenen in de game ",
      characters: " is een character in de game ",
      dlcs: " is een DLC van de game ",
      image_tags: " zijn afbeeldingen van ",
    };

    const list = Array.isArray(item[type]) ? item[type] : [item[type]]; // Controleer of het een array is, anders maak er een array van
    
    
      

    
    const typeDescription  = typeDescriptionsMap[type] || ""; // Gebruik een lege string als er geen beschrijving is
    const buttonText        = buttonTextMap[type] || "Details"; // Gebruik een standaard tekst als er geen specifieke tekst is
    const oldItemName        = item.name || "";
    const oldItemUrl             = item.api_detail_url.replace(/\/(enemy|friend)\//g, "/character/"); // Vervang enemy of friend door character in de URL
    
    console.log("list", list);
    


    if (list.length > 0) {
      const fragmentButton = document.createElement("button");
      fragmentButton.textContent = buttonText;
      fragmentButton.classList.add("btn", "btn-primary", "m-2");
      
      fragmentButton.addEventListener("click", (event) => {
        this.dom.titleContainer.innerHTML = "We kijken nu naar " + oldItemName;
        let parentContainerId = event.target.parentElement.id; // Verkrijg de parentContainerId van de knop
        if (parentContainerId == "extraInfoContainer"){
          
          this.loadAndDisplayItem(oldItemUrl, parentContainerId); 
        }

        this.dom.namesContainer.innerHTML = `<h3>${buttonText}</h3>`; 
        list.forEach(item => {
          const newItenName = item.name || ""; // Verkrijg de naam van het item
          const newItemUrl = item.api_detail_url.replace(/\/(enemy|friend)\//g, "/character/"); // Vervang enemy of friend door character in de URL
          const titleText = newItenName + typeDescription + oldItemName; // Combineer de naam van het item met de beschrijving en de naam van het character

          const namesContainerButton = document.createElement("a");
          namesContainerButton.href = "#";
          namesContainerButton.textContent = item.name;
          namesContainerButton.classList.add("btn", "btn-primary", "m-2");
          
          

          namesContainerButton.addEventListener("click", (event) => {
            event.preventDefault();            
            this.dom.titleContainer.innerHTML = titleText; // Update de titleContainer met de naam van het item
            //parentContainerId = event.target.parentElement.id;
            this.loadAndDisplayItem(newItemUrl, parentContainerId); // Laad de details van het character
          });

          if (list.length === 1) {                
            this.loadAndDisplayItem(newItemUrl, parentContainerId); // Laad de details van het character
            this.dom.titleContainer.innerHTML = titleText; // Update de titleContainer met de naam van het item
            
        }

          this.dom.namesContainer.appendChild(namesContainerButton);

        });
      });
      fragment.appendChild(fragmentButton);
    }
  }

}
