let minesAmmount = null
let boardSize = null


function setDifficulty (element) {
    let diff = element.className;
    switch (diff) {
        case "easy":
            boardSize = "9x9"
            minesAmmount = 10
            break;
        case "normal":
            boardSize = "16x16"
            minesAmmount = 40
            break;
        case "hard":
            boardSize = "30x16"
            minesAmmount = 99
            break;
    }
    document.querySelector(".game").style.display = "block";
    document.querySelector(".choose").style.display = "none";
}