
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
                url: `https://cataas.com/cat/${selectedCats[j].id}`,
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
    "scared", "siamese", "smug", "standing", "stretch", "ugly", "GreenEyes", 
    "basket", "bath", "cow", "crazy", "selfie", "stuck"
    ];
 
  const shuffled = [...tags].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 4);
}

const gridContainer = document.getElementById("grid");
const maxSelection = 4;
let selectedCount = 0;

// Generate cat images grid
async function createGrid(){
    gridContainer.innerHTML = "";

    const tags = randomTag();
    const catImages = await generateGame(tags);

    for(let i = 0; i < catImages.length; i++){
        const square = document.createElement("div");
        square.classList.add("square");

        const img = document.createElement("img");
        img.src = catImages[i].url;

        square.appendChild(img);
        gridContainer.appendChild(square);

        square.addEventListener("click", () => {
            if (square.classList.contains("selected")) {
                square.classList.remove("selected");
                selectedCount--;
            } else if (selectedCount < maxSelection) {
                square.classList.add("selected");
                selectedCount++;
            }
        });
    }
}

createGrid();

//checks if the four selected cards have the same gameTag
function checkMatch(selectedCards) {
    return selectedCards[0].gameTag === selectedCards[1].gameTag &&
           selectedCards[1].gameTag === selectedCards[2].gameTag &&
           selectedCards[2].gameTag === selectedCards[3].gameTag;
}