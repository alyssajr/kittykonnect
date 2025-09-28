
//generates cat images for each tag, assigns gameTag and unique gameId
async function generateGame(tags){
    let catImages = [];

    //iterate through tags and fetch cat images
    for (let i = 0; i < tags.length; i++) {
        let tag = tags[i];
        const tagImageURL = await fetch(`https://cataas.com/api/cats?tags=${tag}`);
        const tagImageArray = await tagImageURL.json();

        //select 4 random cat images from tagImageArray
        let selectedCats = [];
        while (selectedCats.length < 4 && tagImageArray.length > 0) {
            let randomIndex = Math.floor(Math.random() * tagImageArray.length);
            selectedCats.push(tagImageArray[randomIndex]);
            tagImageArray.splice(randomIndex, 1); //remove selected to avoid duplicates
        }

        //loop through selectedCats and push object with url, gameTag, gameId to catImages array
        for (let j = 0; j < selectedCats.length; j++) {
            catImages.push({
                url: `https://cataas.com/cat/${selectedCats[j].id}?width=200&height=200`,
                gameTag: tag,
                gameId: `${tag}-${j}`
            });
        }    
    }
    //shuffle catImages array to randomize game order
    shuffle(catImages);

    //return catImages array (16 images total)
    return catImages;
}

//shuffles an array using Fisher-Yates algorithm
function shuffle(array) {
    let currentIndex = array.length, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
        }
    return array;
}

//selects 4 random tags from the list of tags
function randomTag(){
    const tags = ["angry", "bed", "belly", "black", "box", "brown", "calico", "computer", 
    "confused", "cute", "fat", "fluffy", "funny", "gray", "hat", "kitten", 
    "loaf", "orange", "sad", "sit", "sleep", "tabby", "tongue", "tuxedo", 
    "white", "sofa", "food", "happy", "outside", "serious", "shocked", 
    "christmas", "halloween", "yawn", "Bengal", "tortoiseshell", "blanket", 
    "scared", "siamese", "smug", "standing", "stretch", "ugly", 
    "basket", "bath", "cow", "crazy", "selfie", "stuck"
    ];
 
  const shuffled = [...tags].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 4);
}

const gridContainer = document.getElementById("grid");
const maxSelection = 4;
let selectedCount = 0;
const submitBtn = document.getElementById("submitBtn");

// Generate cat images grid
async function createGrid(){
    gridContainer.innerHTML = "";

    const tags = randomTag();
    const catImages = await generateGame(tags);
    hintBtn.disabled = false;
    
    for(let i = 0; i < catImages.length; i++){
        const square = document.createElement("div");
        square.classList.add("square");

        const img = document.createElement("img");
        img.src = catImages[i].url;
        img.dataset.tag = catImages[i].gameTag;

        square.appendChild(img);
        gridContainer.appendChild(square);

        // Submit button is disabled until 4 images are selected
        square.addEventListener("click", () => {
            if (square.classList.contains("selected")) {
                square.classList.remove("selected");
                selectedCount--;
            } else if (selectedCount < maxSelection) {
                square.classList.add("selected");
                selectedCount++;
            }else if(square.classList.contains("match")){
                return;
            }

            submitBtn.disabled = selectedCount !== maxSelection;
        }); 
    }
}

//checks if the four selected cards have the same gameTag
function checkMatch(selectedCards) {
    return selectedCards[0].gameTag === selectedCards[1].gameTag &&
           selectedCards[1].gameTag === selectedCards[2].gameTag &&
           selectedCards[2].gameTag === selectedCards[3].gameTag;
}

//gives the user a hint by revealing one of the tags
const hintBtn = document.getElementById("hintBtn");
const hintMessage = document.getElementById("hintMessage");

let usedHints = [];
hintBtn.addEventListener("click", () => {
    //find all unmatched squares
    const unmatchedSquares = Array.from(document.querySelectorAll(".square:not(.match) img"));
    //filter out tags that have already been used as hints
    const remainingHints = unmatchedSquares.filter(square => !usedHints.includes(square.dataset.tag));
    
    //if no remaining hints, disable button
    if (remainingHints.length === 0) {
        hintBtn.disabled = true;
        return;
    }

    //pick random unmatched square
    const randomSquare = remainingHints[Math.floor(Math.random() * remainingHints.length)];
    
    //add tag to usedHints and display
    usedHints.push(randomSquare.dataset.tag);
    hintMessage.textContent = `Hints: ${usedHints.join(", ")}`;

});

const message = document.getElementById("message");

//  Handle submit
submitBtn.addEventListener("click", () => {
    const selectedSquares = Array.from(document.querySelectorAll(".square.selected"));
    
    // Check if selected squares have the same tag
    let isMatch = true;
    const firstTag = selectedSquares[0].querySelector("img").dataset.tag;

    for(let i = 1; i < selectedSquares.length; i++){
        if(selectedSquares[i].querySelector("img").dataset.tag !== firstTag){
            isMatch = false;
            break;
        }
    }
    if(isMatch){
        for(let i = 0; i < selectedSquares.length; i++){
            const square = selectedSquares[i];
            
            const overlay = document.createElement("div");
            overlay.classList.add("tag");
            overlay.textContent = firstTag;
            square.appendChild(overlay);

            square.classList.add("match");
            square.classList.remove("selected");
        }
        message.textContent = "Correct!";
    }else{
        for(let i = 0; i < selectedSquares.length; i++){
            selectedSquares[i].classList.remove("selected");
        }
        message.textContent = "Try again!";

    }

    selectedCount = 0;
    submitBtn.disabled = true;
});

createGrid();

document.addEventListener('DOMContentLoaded', () => {
    const cat = document.querySelector('.catWalk-WALK');

    let position = 0;
    const speed = 3; // pixels per frame

    function moveCat() {
        position += speed;

        // Apply transform: move AND keep the scale
        cat.style.transform = `translateX(${position}px) scaleX(-1) scale(1.75)`;

        // If off-screen, reset to left
        if (position < window.innerWidth - 64*1.5) {
            requestAnimationFrame(moveCat);
        } else {
            position = -64; // Reset to start from left
            requestAnimationFrame(moveCat);
        }
    }

    moveCat();
});

