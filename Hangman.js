"use strict";

console.clear();

/**
 * @param {Word} word
 */
let incercari = 0;
function read(word) {
  let msg = "Introduceti o litera pentru a continua.\n";
  msg += "Pentru oprire apasati enter.\n";
  msg += `Esti la incercarea ${incercari + 1} din 7\n`;
  msg += `${word.work}`;

  return prompt(msg)
};

/*  Ex: 05. hangman game*/

class Hangman {
  constructor(words) {
    this.collection = new WordsCollection(words);
  }

  run() {
    const word = new Word(this.collection.select);

    do {
      let letter = read(word);
      if (!letter) {
        break
      }
      
      word.update(letter);
      incercari++;
      if (incercari >= 7) {
        console.log('Ati epuizat toate cele 7 incercari');
        break;
      }
    } while(!word.done);

    alert(word.work);
  }
}

const newGame = new Hangman();
newGame.run();