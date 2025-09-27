
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
