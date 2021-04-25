
const cards = document.querySelectorAll('.memory-card');
const startButton = document.getElementById('start-button');
const resetButton = document.getElementById('reset-button');
const saveButton = document.getElementById('save-button');
const minDisplay = document.getElementById('minutes');
const secDisplay = document.getElementById('seconds');
const milliDisplay = document.getElementById('milliseconds');
//const secInput = document.getElementById('sec-input');

let hasFlippedCard = false;
let firstCard, secondCard;
let lockBoard = true;
var timer = null;

minCount = 0;       // minute counter
secCount = 0;       // seconds counter
milliCount = 0;     // milliseconds counter
milliTimer = 0;     // total milliseconds timer
cardsQty = 30;      // total cards
solved = 0;         // cards solved counter


// MEMORY GAME FUNCTIONS


function flipCard() {
    // (1) if board is locked, becaused cards haven't flipped back yet, flipcard function cannot be executed (code ends with return)
    if (lockBoard) return;

    // (2) if the first card was already clicked, it would be a double click
    if (this === firstCard) return;

    // (3) if board is not locked, card can be flipped
    this.classList.toggle('flip');

    // (4) if the user clicked the first card (code ends with return)
    if (!hasFlippedCard) {
        // first click
        hasFlippedCard = true;
        firstCard = this;
    return; 
    }

    // (5) if the user clicked the second card (if no return point got reached in the code above)
    secondCard = this;
    console.log(firstCard, secondCard) 
    console.log(firstCard.dataset.framework)
    console.log(secondCard.dataset.framework)
    checkForMatch();  
}


function checkForMatch() {
    // do cards match? 
    if (firstCard.dataset.framework === secondCard.dataset.framework) {          
        disableCards();
    } else {
        unflipCards();
    }
}

// shorter version --> ternary operator?
// function checkForMatch() {
//     let isMatch = firstCard.dataset.framework === secondCard.dataset.framework);          
//     isMatch ? disableCards() : unflipCards();


function disableCards() {
    // it's a match -> remove the evenlistener, so no more clicks are possible
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);
    resetBoard();
    solved += 2;
    console.log('Solved:' +solved);
    if (solved === cardsQty) {
        clearInterval(timer);
        saveButton.disabled = false;
    }
}


function unflipCards() {
    // it's not a match -> flip back the cards -> add flip class
    // for the time of backflip the board has to be blocked
    lockBoard = true;
    setTimeout(() => {
        firstCard.classList.remove('flip');
        secondCard.classList.remove('flip');
        resetBoard();
    }, 750);
}


function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
}


// IIFE - Immediately Invoked Function Expression!
(function shuffle_init() {
    cards.forEach(card => {
        let randomPos = Math.floor(Math.random() * 24);
        card.style.order = randomPos;
    });
})();


// BOARD FUNCTIONS

// Shuffle with reset button
function shuffle() {
    cards.forEach(card => {
        let randomPos = Math.floor(Math.random() * 24);
        card.style.order = randomPos;
    });
};

// Start timer
function startTimer() {  
    shuffle();
    cards.forEach(card => card.addEventListener('click', flipCard));
    timer = setInterval(function (){
            milliCount++;
            milliTimer++;
        if (milliCount === 100) {
            secCount++;
            milliCount = 0;
            milliDisplay.textContent = milliCount;
            secDisplay.textContent = secCount;
            if (secCount === 60) {
                minCount++;
                secCount = 0;
                minDisplay.textContent = minCount;
                secDisplay.textContent = secCount;
            } else {
                secDisplay.textContent = secCount;
            }
        } else {
            milliDisplay.textContent = milliCount;
        }
    }, 10)
    lockBoard = false;
    startButton.disabled = true;
    saveButton.disabled = true;
}


//// Start timer
//function startTimer() {
//    shuffle();
//    cards.forEach(card => card.addEventListener('click', flipCard));
//    timer = setInterval(function (){
//            secCount++;
//            secTimer++;
//        if (secCount === 60) {
//            minCount++;
//            secCount = 0;
//            minDisplay.textContent = minCount;
//            secDisplay.textContent = secCount;
//        } else {
//            secDisplay.textContent = secCount;
//        }
//    }, 1000)
//    lockBoard = false;
//    startButton.disabled = true;
//    saveButton.disabled = true;
//}


// Reset timer
function resetTimer() {
    clearInterval(timer);
    solved = 0;
    minCount = 0;
    secCount = 0;
    milliCount = 0;
    milliTimer = 0;
    minDisplay.textContent = minCount;
    secDisplay.textContent = secCount;
    milliDisplay.textContent = milliCount;
    //secInput.textContent = secTimer;
    startButton.disabled = false;
    lockBoard = true;
    cards.forEach(card => {
        if (card.classList.contains('flip')) {
            card.classList.toggle('flip');
        }
    });
}


function submit_entry() {
    const name = document.getElementById('name-input');
    const entry = {
        name: name.value,
        time: milliTimer,
    };
    console.log(entry);

    fetch('/save', {
        method: "POST",
        credentials: "include",
        body: JSON.stringify(entry),
        cache: "no-cache",
        headers: new Headers ({
            "content-type": "application/json"
        })
    });
}


// for all cards the event listener runs flipCard function if click happened
cards.forEach(card => card.addEventListener('click', flipCard));

startButton.addEventListener('click', startTimer);
resetButton.addEventListener('click', resetTimer);