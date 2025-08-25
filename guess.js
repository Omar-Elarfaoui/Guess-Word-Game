
//  setting game name
let gameName = "Guess The Word";
document.title = gameName;
document.querySelector("h1").innerHTML = gameName;
document.querySelector("footer").innerHTML = `${gameName} Game Created By Wan Dijo`;

//  Setting Game Options 
let numbersOfTries = 5;
let numbersOfLetters = 6;
let currentTry = 1;
let numberOfHints = 2;

//  Manage Words
let wordToGuess = "";
const words = ["Devlop", "Python", "Sciens", "Cybers", "Robots", "Machin", "school"]
wordToGuess = words[Math.floor(Math.random()* words.length)].toLocaleLowerCase();
let messageArea = document.querySelector(".message");

//  Manage Hints
document.querySelector(".hint span").innerHTML = numberOfHints;
const getHintButton = document.querySelector(".hint");
getHintButton.addEventListener("click", getHint);



function generateInput() {
    const inputsContainer = document.querySelector(".inputs");

    // Create main try div
    for (let i = 1 ; i <= numbersOfTries; i++) {
        const tryDiv = document.createElement("div");
        tryDiv.classList.add(`try-${i}`);
        tryDiv.innerHTML = `<span> Try ${i}</span>`;
        if (i !== 1) tryDiv.classList.add("disabled-inputs");
        // Create inputes
        for (let j = 1 ; j <= numbersOfLetters; j++) {
            const input = document.createElement("input");
            input.type = "text"; 
            input.id = `guess-${i}-letter-${j}`;
            input.setAttribute("maxlength", "1");
            tryDiv.appendChild(input);
        }
        inputsContainer.appendChild(tryDiv);
    }

    // Focus On First Input In First Try Element
    inputsContainer.children[0].children[1].focus();
    // Disable All Inputs Except First One
    const InputsInDisabledDiv = document.querySelectorAll(".disabled-inputs input");
    InputsInDisabledDiv.forEach((input) => (input.disabled = true));
    const inputs = document.querySelectorAll("input");
    inputs.forEach((input, index) => {
        // Convert Input to Uppercase
        input.addEventListener("input", function () {
            this.value = this.value.toUpperCase();
            const nextInput = inputs[index +1];
            if (nextInput) nextInput.focus();
        });

        input.addEventListener("keydown", function(event) {
            //console.log(event)
            const currentIndex = Array.from(inputs).indexOf(event.target) // or this  
            
            if (event.key === "ArrowRight") {
                const nextInput = currentIndex +1;
                if (nextInput < inputs.length) {
                    inputs[nextInput].focus();
                }
            }
            if (event.key === "ArrowLeft") {
                const previousInput = currentIndex -1;
                if (previousInput >= 0) {
                    inputs[previousInput].focus();
                }
            }
        })
    })

};

const guessButton = document.querySelector(".check");
guessButton.addEventListener("click", handleGuesses);
console.log(wordToGuess)
function handleGuesses() {
    let succesGuess = true;
    
    for (i=1; i<= numbersOfLetters; i++) {
        const inputField = document.querySelector(`#guess-${currentTry}-letter-${i}`);
        const letter = inputField.value.toLocaleLowerCase();
        const actualLetter = wordToGuess[i -1]

        // Game Logic
        if (letter === actualLetter) {
            // Letter is correct and in place
            inputField.classList.add("yes-in-place")
        } else if ( wordToGuess.includes(letter) && letter !== "") {
            // Letter is correct but not in place
            inputField.classList.add("not-in-place");
            succesGuess = false;
        } else {
            // letter is wrong
            inputField.classList.add("no");
            succesGuess = false;
        }
    }

    // Check if User Win Or Lose
    if(succesGuess) {

        messageArea.innerHTML = `You Win The Word Is <span>${wordToGuess}</span>`;
        if (numberOfHints === 2){
            messageArea.innerHTML = `<p>Congratz You Didn't Use Hints </p> `;
        }

        // Add Disabled Class On All  Try Divs
        let AllTries = document.querySelectorAll(".inputs > div");
        AllTries.forEach((tryDiv) => tryDiv.classList.add("disabled-inputs"));

        // Disable Guess Button
        guessButton.disabled = true
        getHintButton.disabled = true
    } else {

        document.querySelector(`.try-${currentTry}`).classList.add("disabled-inputs");
        const currentTryInputs = document.querySelectorAll(`.try-${currentTry} input`);
        currentTryInputs.forEach((input) => (input.disabled = true));

        currentTry++;
        
        const nextInputs = document.querySelectorAll(`.try-${currentTry} input`);
        nextInputs.forEach((input) => (input.disabled = false));

        let el = document.querySelector(`.try-${currentTry}`)
        if (el) {
            document.querySelector(`.try-${currentTry}`).classList.remove("disabled-inputs");
            el.children[1].focus();
        } else {
            // Disable Guess Button
            guessButton.disabled = true;
            getHintButton.disabled = true
            messageArea.innerHTML = `You Lose The word Is <span>${wordToGuess}</span>`
        }

    }


}

function getHint () {
    if (numberOfHints > 0) {
        numberOfHints--;
        document.querySelector(".hint span").innerHTML = numberOfHints;
    };

    if (numberOfHints === 0) {
        getHintButton.disabled = true;
    };

    const enabledInputs = document.querySelectorAll("input:not([disabled])");
    const emptyEnabledInputs = Array.from(enabledInputs).filter((input) => input.value === "");


    if (emptyEnabledInputs.length > 0) {
        const randomIndex = Math.floor(Math.random() * emptyEnabledInputs.length);
        const randomInput = emptyEnabledInputs[randomIndex];
        const indexToFill = Array.from(enabledInputs).indexOf(randomInput);
        // console.log(randomIndex);
        // console.log(randomInput);
        // console.log(indexToFill);
        if (indexToFill !== -1) {
            randomInput.value = wordToGuess[indexToFill].toUpperCase();
        }
    }

};

function handleBackspace() {
    if (event.key === "Backspace") {
        const inputs = document.querySelectorAll("input:not([disabled])");
        const currentIndex = Array.from(inputs).indexOf(document.activeElement);

        if (currentIndex >0) {
            const currentInput = inputs[currentIndex];
            const prevInput = inputs[currentIndex -1];

            currentInput.value= "";
            prevInput.value = "";
            prevInput.focus();
        }
    }
}

function confirmEnter() {
    if (event.key === "Enter") {
        handleGuesses();
    }
}


document.addEventListener("keydown" , handleBackspace);
document.addEventListener("keydown" , confirmEnter);




window.onload = function(){ 
    generateInput();
}; 