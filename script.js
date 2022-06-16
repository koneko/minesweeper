let minesAmmount = null
let boardSize = null
let diff = null
let flags = null

function setDifficulty (element) {
    diff = element.className;
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
            boardSize = "16x30"
            minesAmmount = 99
            break;
    }
    document.querySelector(".game").style.display = "flex";
    document.querySelector(".choose").style.display = "none";
    flags = minesAmmount;
    generateBoard()
}

function generateBoard () {
    let board = document.querySelector(".board");
    let style = document.createElement('style')
    switch (boardSize) {
        case "9x9":
            board.style.width = "360px";
            board.style.height = "360px";
            style.innerHTML = `.row {
                width: 360px;
                height: 40px;
                display: flex;
                flex-direction: row;
            }
            .cell {
                width: 40px;
                height: 40px;

            }`
            break;
        case "16x16":
            board.style.width = "640px";
            board.style.height = "640px";
            style.innerHTML = `.row {
                width: 640px;
                height: 40px;
                display: flex;
                flex-direction: row;
            }
            .cell {
                width: 40px;
                height: 40px;
            }`
            break;
        case "16x30":
            board.style.width = "960px";
            board.style.height = "640px";
            style.innerHTML = `.row {
                width: 960px;
                height: 40px;
                display: flex;
                flex-direction: row;
            }
            .cell {
                width: 40px;
                height: 40px;
            }`
            break;
    }
    document.body.appendChild(style)
    board.innerHTML = "";
    let ss = boardSize.split("x")[0]
    let ss2 = boardSize.split("x")[1]
    for (let i = 0; i < ss; i++) {
        let row = document.createElement("div");
        row.className = "row";
        for (let j = 0; j < ss2; j++) {
            let cell = document.createElement("div");
            cell.className = "cell";
            cell.id = `${i}-${j}`;
            cell.onclick = function () {
                checkCell(cell);
            }
            cell.addEventListener("contextmenu", function (e) {
                e.preventDefault();
                if (cell.textContent == "🚩") {
                    cell.classList.remove("flag");
                    cell.textContent = "";
                    flags++;
                } else if (cell.textContent == "") {
                    cell.classList.add("flag");
                    cell.textContent = "🚩"
                    flags--;
                    checkFlags()
                }
            })
            row.appendChild(cell);
        }
        board.appendChild(row);
    }
    generateMines(minesAmmount, diff)
}

function isMine (cell) {
    return cell.classList.contains("mine");
}

function isClicked (cell) {
    return cell.classList.contains("clicked");
}

function getNeighbors (cell) {
    let n = [];
    let row = +cell.id.split("-")[0]
    let col = +cell.id.split("-")[1]
    let height = +boardSize.split("x")[0]
    let width = +boardSize.split("x")[1]
    if (row > 0) {
        if (col > 0)
            n.push(document.getElementById(`${row - 1}-${col - 1}`));
        n.push(document.getElementById(`${row - 1}-${col}`));
        if (col + 1 < width)
            n.push(document.getElementById(`${row - 1}-${col + 1}`));
    }
    if (row + 1 < height) {
        if (col > 0)
            n.push(document.getElementById(`${row + 1}-${col - 1}`));
        n.push(document.getElementById(`${row + 1}-${col}`));
        if (col + 1 < width)
            n.push(document.getElementById(`${row + 1}-${col + 1}`));
    }
    if (col > 0)
        n.push(document.getElementById(`${row}-${col - 1}`));
    if (col + 1 < width)
        n.push(document.getElementById(`${row}-${col + 1}`));
    return n
}

function checkCell (cell) {
    let classes = cell.classList
    if (isClicked(cell)) return
    if (isMine(cell)) return;
    classes.add("clicked");
    let neighbors = getNeighbors(cell);
    let mines = 0;
    neighbors.forEach(neighbor => {
        if (isMine(neighbor))
            mines++;
    });
    if (mines == 0) {
        neighbors.forEach(checkCell);
    } else {
        cell.textContent = mines;
    }
}


function generateMines (ammount, difficulty) {
    let mines = [];
    let boardHeight = boardSize.split("x")[0]
    let boardWidth = boardSize.split("x")[1]
    for (let i = 0; i < ammount; i++) {
        let x = Math.floor(Math.random() * boardHeight);
        let y = Math.floor(Math.random() * boardWidth);
        let mine = `${x}-${y}`;
        if (mines.includes(mine)) {
            i--;
        } else {
            mines.push(mine);
        }
    }
    mines.forEach(mine => {
        let cell = document.getElementById(`${mine}`);
        cell.classList.add("mine");
        cell.addEventListener('click', (e) => {
            gameOver(cell)
        })
    })
    document.querySelector(".info").innerHTML = `${mines.length} mines`
}

function gameOver (cell) {
    showMines()
    cell.classList.add("died")
    //remove all event listeners
    let cells = document.querySelectorAll(".cell")
    cells.forEach(cell => {
        cell.removeEventListener("contextmenu", function (e) {
            e.preventDefault();
            if (cell.textContent == "🚩") {
                cell.classList.remove("flag");
                cell.textContent = "";
                flags++;
            }
            else {
                cell.classList.add("flag");
                cell.textContent = "🚩"
                flags--;
                checkFlags()
            }
        })
        cell.removeEventListener("click", function (e) {
            e.preventDefault();
            checkCell(cell)
        })
    })
    let mines = document.querySelectorAll(".mine")
    mines.forEach(mine => {
        mine.removeEventListener("mousedown", function (e) {
            e.preventDefault();
            mine.classList.add("died")
            gameOver()
        })
    })
    checkCell = () => { }
    gameOver = () => { }
    alert("You died!")
}

function showMines () {
    let mines = document.querySelectorAll(".mine");
    mines.forEach(mine => {
        mine.textContent = "💣"
    })
}

function checkFlags () {
    let miness = 0
    if (flags == 0) {
        let flagElements = document.querySelectorAll('.flag')
        flagElements.forEach(flag => {
            if (flag.classList.contains("mine")) {
                flag.classList.remove("flag")
                miness++
            }
        })
        if (miness == minesAmmount) {
            alert("You won!")
            checkCell = () => { }
        }
    }
}