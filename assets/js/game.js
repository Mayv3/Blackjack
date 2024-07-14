(() => {
  'use strict';

  let deck = [];
  const types = ["C", "D", "H", "S"],
        specials = ["A", "J", "Q", "K"];
  
  let scorePlayers = [];

  const cardsDiv = document.querySelectorAll('.cardsDiv')

  const getCard = document.querySelector("#getCard"),
        stopGame = document.querySelector("#stopGame"),
        newGame = document.querySelector("#newGame");
  
  const scoreHTML = document.querySelectorAll("small");
  
  const createDeck = () => {
    let newDeck = [];
    for (let i = 2; i <= 10; i++) {
      for (let type of types) {
        newDeck.push(i + type);
      }
    }

    for (let type of types) {
      for (let spe of specials) {
        newDeck.push(spe + type);
      }
    }

    return _.shuffle(newDeck);
  };
  const startGame = (numPlayers = 2) => {
    deck = createDeck(); 
    scorePlayers = [];
    for (let i = 0; i < numPlayers; i++) {
      scorePlayers.push(0)
    }
    scoreHTML.forEach(element => element.innerHTML=0);
    cardsDiv.forEach(element => element.innerHTML='');

    getCard.disabled = false;
    stopGame.disabled = false;

  };
  const askForLetter = () => {
    if (deck.length === 0) {
      throw "No hay cartas en el deck";
    }
    return deck.pop();
  };
  const cartValue = (card) => {
    const value = card.substring(0, card.length - 1);
    return isNaN(value) ? (value === "A" ? 11 : 10) : value * 1;
  };
  const accumulateScore = (card, turn )=>{

    scorePlayers[turn] = scorePlayers[turn] + cartValue(card);
    scoreHTML[turn].innerText = scorePlayers[turn];

    return scorePlayers[turn]
  }
  const createCard = (card, turn)=>{
    const imgCard = document.createElement("img");
    imgCard.src = `assets/cartas/${card}.png`;
    imgCard.classList.add("carta");
    cardsDiv[turn].append(imgCard);
  }
  const determineWinner = ()=>{

    const [minScore, pcScore] = scorePlayers;

    setTimeout(() => {
      if (pcScore === minScore) {
        alert("Nadie gana :(");
      } else if (minScore > 21) {
        alert("La computadora gana");
      } else if (pcScore > 21) {
        alert("Jugador gana!");
      } else {
        alert("La computadora gana");
      }
    }, 10);
  }
  const computerShift = (minScore) => {
    let pcScore = 0;
    do {
      const card = askForLetter();
      pcScore = accumulateScore(card, scorePlayers.length - 1);
      createCard(card, scorePlayers.length - 1)
    
    } while ((pcScore < minScore && minScore <= 21) && minScore <= 21);

    determineWinner();
  };

  getCard.addEventListener("click", () => {
    const card = askForLetter();
    const playerScore = accumulateScore(card, 0);

    createCard(card, 0)


    if (playerScore > 21) {
      console.warn("Lo siento ya perdiste");
      getCard.disabled = true;
      stopGame.disabled = true; 
      computerShift(playerScore);
    } else if (playerScore === 21) {
      console.warn("Ganaste!");
      getCard.disabled = true;
      stopGame.disabled = true;
      computerShift(playerScore);
    }
  });

  stopGame.addEventListener("click", () => {
    stopGame.disabled = true;
    getCard.disabled = true;
    computerShift(scorePlayers[0]);
  });

  newGame.addEventListener("click", () => {
    startGame();
  });

})();
