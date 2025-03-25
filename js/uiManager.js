export class UIManager {
    static dom = {
      firstLetterContainer: document.getElementById("firstLetterContainer"),
      titleContainer: document.getElementById("titleContainer"),
      searchInput: document.getElementById("searchInput"),
      namesContainer: document.getElementById("namesContainer"),
      characterInfoContainer: document.getElementById("characterInfoContainer"),
      extraInfoContainer: document.getElementById("extraInfoContainer")
    };
  
    static init(charactersData, apiClient) {
      UIManager.dom.searchInput.addEventListener("keydown", event => {
        if (event.key === "Enter") {
            event.preventDefault();
            const query = UIManager.dom.searchInput.value.toLowerCase();
            const filtered = charactersData.filter(character =>
                character.name.toLowerCase().includes(query)
          );
          UIManager.showNames(filtered, query, apiClient);
        }
      });
      UIManager.showFirstLetters(charactersData, apiClient);
    }
  
    static showFirstLetters(charactersData, apiClient) {
      const container = UIManager.dom.firstLetterContainer;
      container.innerHTML = "";
      const uniqueLetters = [...new Set(
        charactersData.map(item => item.name.trim().charAt(0).toUpperCase())
      )].sort();
  
      uniqueLetters.forEach(letter => {
        const btn = document.createElement('a');
        btn.href = "#";
        btn.textContent = letter;
        btn.className = "btn btn-primary";
        btn.addEventListener("click", event => {
          event.preventDefault();
          UIManager.showNames(charactersData, letter, apiClient);
        });
        container.appendChild(btn);
      });
    }
  
    static showNames(charactersData, letter, apiClient) {
      ["extraInfoContainer", "characterInfoContainer", "namesContainer"].forEach(id => {
        UIManager.dom[id].innerHTML = "";
      });
      UIManager.dom.titleContainer.innerHTML = "Klik op een character";
  
      const header = document.createElement("h3");
      header.textContent = `Characters met ${letter}`;
      UIManager.dom.namesContainer.appendChild(header);
  
      if (letter.length === 1) {//if filter has one letter, data strats with that letter
        charactersData = charactersData.filter(item => item.name.startsWith(letter));
      }
      
      charactersData.forEach(item => {
        const link = document.createElement("a");
        link.href = "#";
        link.textContent = item.name.trim();
        link.className = "btn btn-primary m-2";
        link.addEventListener("click", event => {
          event.preventDefault();
          UIManager.dom.extraInfoContainer.innerHTML = "";
          UIManager.dom.titleContainer.innerHTML = "We kijken nu naar " + item.name;
          apiClient.getCharacterData(item.api_detail_url, "characterInfoContainer");
        });
        UIManager.dom.namesContainer.appendChild(link);
      });
    }
  
    static renderCharacterData(character, container) {
        console.log(character);
        container.innerHTML = "";
        let characterName;
        const titleEl = document.createElement("h3");
        titleEl.id = container.id + "Title";
        
        if (character.name) {
          characterName = character.name;
          titleEl.textContent = characterName;
          container.appendChild(titleEl);
        }
  
      if (character.image) {
        const img = document.createElement("img");
        img.src = character.image.medium_url;
        img.alt = character.name;
        container.appendChild(img);
      }

       // Enkele afbeelding
    if (character.image) {
      const img = document.createElement("img");
      img.src = character.image.medium_url;
      img.alt = characterName;
      container.appendChild(img);
    }
  
      if (character.deck) {
        const desc = document.createElement("p");
        desc.textContent = character.deck;
        container.appendChild(desc);
      }

       // Eerste game tonen
    if (character.first_appeared_in_game) {
        const firstGame = character.first_appeared_in_game;
        UIManager.createCharacterButton(
          container,
          [firstGame],
          `Eerste game van ${characterName}`,
          "firstGame",
          characterName,
          firstGame.api_detail_url
        );
      
    }
}

    static createCharacterButton(container, list, buttonText, type, characterName, characterUrl) {
        if (!list.length) return;
        console.log(list);
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
    
        button.addEventListener("click", () => {
          UIManager.dom.titleContainer.innerHTML = "We kijken nu naar " + characterName;
          if ((UIManager.dom.characterInfoContainer.querySelector("h3")?.textContent || "") !== characterName) {
            UIManager.dom.extraInfoContainer.innerHTML = "";
            app.apiClient.getCharacterData(characterUrl, "characterInfoContainer");
          }
          UIManager.dom.namesContainer.innerHTML = `<h3>${buttonText}</h3>`;
          list.forEach(item => {
            const itemBtn = document.createElement("a");
            itemBtn.href = "#";
            itemBtn.textContent = item.name;
            itemBtn.className = "btn btn-primary m-2";
            const itemUrl = (type === "enemy" || type === "friend")
              ? item.api_detail_url.replace(type, "character")
              : item.api_detail_url;
    
            if (list.length === 1) {
              setTimeout(() => {
                app.apiClient.getCharacterData(itemUrl, "extraInfoContainer");
                if (typeDescriptions[type]) {
                  UIManager.dom.titleContainer.innerHTML = `${item.name}${typeDescriptions[type]}${characterName}`;
                }
              }, 500);
            }
    
            itemBtn.addEventListener("click", event => {
              event.preventDefault();
              if (typeDescriptions[type]) {
                UIManager.dom.titleContainer.innerHTML = `${item.name}${typeDescriptions[type]}${characterName}`;
              }
              app.apiClient.getCharacterData(itemUrl, "extraInfoContainer");
            });
            UIManager.dom.namesContainer.appendChild(itemBtn);
          });
        });
        container.appendChild(button);
      }
    }


  
  