var sentence = "test"
const wordE = document.getElementById("word")
const inputE = document.getElementById("input")
const guessE = document.getElementById("guess")
const guessText = document.getElementById("guessText")
const attemptsE = document.getElementById("attempts")
const dayE = document.getElementById("day")

var seed = 1;
function random() {
  var x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

getTodaysPhrase()

function getTodaysPhrase() {
  const currentDate = new Date();
  const targetDate = new Date(2024, 1, 15);
  const diffTime = (currentDate - targetDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  console.log(diffDays);
  dayE.innerHTML += diffDays;
  var phrase = commonPhrases[diffDays]
  setPhrase(phrase)
}

guessE.addEventListener("change", (e) => {
  matchCorrectLetters(e.target.value)
  attemptsE.innerHTML = Number(attemptsE.innerHTML) + 1
  if (e.target.value == sentence) {
    inputE.value = "Correct"
    inputE.style.backgroundColor = "green"
    inputE.disabled = false
    guessE.disabled = true
  } else {
    inputE.style.backgroundColor = "red"
    inputE.value = "Incorrect"
  }
})

function matchCorrectLetters(guess) {
  let correctLetters = []
  for (let i = 0; i < guess.length; i++) {
    if (guess[i] == sentence[i]) {
      correctLetters.push(true)
    } else {
      correctLetters.push(false)
    }
  }

  guessText.innerHTML = ""

  sentence.split("").forEach((letter, index) => {
    var span = document.createElement("span")
    span.innerHTML = guess[index] ? guess[index] : "_"
    span.innerHTML = (span.innerHTML == " ") ? '_' : span.innerHTML
    span.innerHTML = (letter == ' ' && span.innerHTML == '_') ? ' ' : span.innerHTML
    span.style.color = correctLetters[index] ? "green" : "red"
    guessText.appendChild(span)
  })
}



inputE.addEventListener("change", (e) => {
  setPhrase(e.target.value)
})

function setPhrase(phrase) {
  sentence = phrase;
  inputE.value = "";
  inputE.disabled = true;
  inputE.style.backgroundColor = "white"

  var spaceIndexes = [];
  sentence.split("").forEach((char, index) => {
    if (char == " ") {
      spaceIndexes.push(index);
    }
  });
  var letters = sentence.split(" ").join("");
  var shuffled = shuffle(letters);
  var final = shuffled.split("");

  spaceIndexes.forEach((index) => {
    final.splice(index, 0, ' ')
  });
  wordE.innerHTML = final.join("");
}

function shuffle(word) {
  var shuffledWord = word.split('').sort(function() { return 0.5 - random() }).join('');
  return shuffledWord;
}