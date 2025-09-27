const gridContainer = document.getElementById("grid");
const maxSelection = 4;
let selectedCount = 0;

async function createGrid(rows = 4, cols = 4){
    gridContainer.innerHTML = "";
    const totalSquares = rows * cols;

    for(let i = 0; i < totalSquares; i++){
        const square = document.createElement("div");
        const counter = document.createElement("div")
        square.classList.add("square");

        const img = document.createElement("img");
        img.src = `https://cataas.com/cat?${Math.random()}?width=150&height=150`;

        square.appendChild(img);
        gridContainer.appendChild(square);

        square.addEventListener("click", () => {
            if (square.classList.contains("selected")) {
                square.classList.remove("selected");
                selectedCount--;
            } else if (selectedCount < maxSelection) {
                square.classList.add("selected");
                selectedCount++;
                counter.classList.add("counter")
            }
        });
    }
}

createGrid();