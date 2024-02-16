var sentence = "test"
var scrambled = []
const wordE = document.getElementById("word")
const inputE = document.getElementById("input")
const guessE = document.getElementById("guess")
const guessText = document.getElementById("guessText")
const attemptsE = document.getElementById("attempts")
const dayE = document.getElementById("day")
const submitE = document.getElementById("submit")

var seed = 1;
function random() {
  var x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

var attempts = [];

getTodaysPhrase()
var localAttempts = localStorage.getItem("attempts")
localAttempts = JSON.parse(localAttempts)
attempts = localAttempts ? localAttempts : []
if (attempts.length > 0) {
  attempts.forEach(attempt => {
    matchCorrectLetters(attempt)
  })
}
attemptsE.innerHTML = attempts.length


function getTodaysPhrase() {
  const currentDate = new Date();
  const targetDate = new Date(2024, 1, 15);
  const diffTime = (currentDate - targetDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  console.log(diffDays);
  dayE.innerHTML += diffDays;
  resetLocalStorage(diffDays)
  var phrase = commonPhrases[diffDays]
  setPhrase(phrase)
}

function resetLocalStorage(dayId) {
  var storedDay = localStorage.getItem("day")
  if (storedDay != dayId) {
    localStorage.setItem("attempts", JSON.stringify([]))
  }
  localStorage.setItem("day", dayId)
}

guessE.addEventListener("input", (e) => {
  var string = e.target.value

  Array.from(wordE.children).forEach(child => {
    child.used = false
    child.style.color = "black"
    child.style.textDecoration = "none"
  })
  
  string.split("").forEach((letter, index) => {
     var match = false
    var child = Array.from(wordE.children)[index]
    if (child) child.style.textDecoration = 'underline'
    Array.from(wordE.children).forEach((child) => {
      if (child.used || match) return
      if (child.innerHTML == letter) {
        child.used = true
        child.style.color = "lightgrey"
        match = true
      }
    })
  })
})

submitE.addEventListener("submit", (e) => {
  e.preventDefault()
  matchCorrectLetters(guessE.value)
  console.log(typeof(attempts))
  attempts.push(guessE.value)
  attemptsE.innerHTML = attempts.length
  localStorage.setItem("attempts", JSON.stringify(attempts))
  if (guessE.value == sentence) {
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

  var block = document.createElement("div")
  guessText.insertBefore(block, guessText.firstChild)


  
  sentence.split("").forEach((letter, index) => {
    var span = document.createElement("span")
    span.innerHTML = guess[index] ? guess[index] : "_"
    span.innerHTML = (span.innerHTML == " ") ? '_' : span.innerHTML
    span.innerHTML = (letter == ' ' && span.innerHTML == '_') ? ' ' : span.innerHTML
    span.style.color = correctLetters[index] ? "green" : "red"
    block.appendChild(span)
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
  scrambled = final
  phraseToSpan(final)
  //wordE.innerHTML = final.join("");
}

function phraseToSpan(phrase) {
  phrase.forEach(char => {
    var span = document.createElement("span")
    span.innerHTML = char
    wordE.appendChild(span)
  })
}

function shuffle(word) {
  var shuffledWord = word.split('').sort(function() { return 0.5 - random() }).join('');
  return shuffledWord;
}