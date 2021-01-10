const size = 10;
const boardSize = size + 2;

const defaultSquare = 0;
const missedSquare = 1;
const hitSquare = 2;
const sunkSquare = 3;
const nearShipSquare = 4;
const shipSquare = 5;
const border = 9;

let turn = "player";

let board = createEmptyBoardAndBorders();
let shipsToFind;
let squares;
drawTable(board, "player");
let leftShips = getLeftShips(".ships-left");

let boardOponent;
let shipsToFindO;
let squaresO;
let leftShipsOponent;

let boardComputerShoot = createEmptyBoardAndBorders();

let randomOrPlaceYourShips = 0;
let shoot = 0;
let squaresAround = [];

let currentSumShip = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
let winningSumShip = [4, 3, 3, 2, 2, 2, 1, 1, 1, 1];


function createEmptyBoardAndBorders() {
    let board = []
    // board:

    // 0 (default) - nothing
    // 1 - miss
    // 2 - hit ship
    // 3 - sunk ship
    // 4 - near ship
    // 5 - ship

    for (let row = 0; row < boardSize; row++) {
        const boardRow = [];
        for (let col = 0; col < boardSize; col++) {
            if (col === 0 || col === boardSize - 1 || row === 0 || row === boardSize - 1) {
                boardRow.push(border); // create border
            } else {
                boardRow.push(0); // create inside of board 
            }
        }
        board.push(boardRow);
    }
    return board;
}

function clearPrintBoard() {
    if (document.getElementById("printingArea")) {
        document.getElementById("printingArea").remove();
    }
}

function printBoard(board) {
    clearPrintBoard();

    const body = document.getElementsByTagName('body')[0];
    const area = document.createElement('div');
    area.id = "printingArea";

    body.appendChild(area);

    for (let row = 0; row < boardSize; row++) {
        for (let col = 0; col < boardSize; col++) {
            document.getElementById("printingArea").innerHTML += board[row][col];
            document.getElementById("printingArea").innerHTML += " ";
        }
        document.getElementById("printingArea").innerHTML += "<br>";
    }
    document.getElementById("printingArea").innerHTML += "<br>";
}

function randomParameters() {

    const randomRow = Math.round(Math.random() * 100) % 10 + 1;
    const randomCol = Math.round(Math.random() * 100) % 10 + 1;
    const randomDirection = Math.round(Math.random() * 10) % 2 === 0 ? "vertical" : "horizontal";

    return { x: randomRow, y: randomCol, dir: randomDirection };
}

function getNearCount(board, params, dxdyShip) {

    let around = 0;
    const dxdy = [{ x: -1, y: 0 }, { x: -1, y: 1 }, { x: 0, y: 1 }, { x: 1, y: 1 }, { x: 1, y: 0 }, { x: 1, y: -1 }, { x: 0, y: -1 }, { x: -1, y: -1 }];

    for (square of dxdyShip) {
        for (item of dxdy) {
            const row = params.x + item.x + square.x;
            const col = params.y + item.y + square.y;
            if (board[row][col] === 0 || board[row][col] === border) {
                around++;
            }
        }
    }
    return around;
}

function placeShip(shipsToFind, board, params, dxdy) {

    const squares = [];

    for (item of dxdy) {
        board[params.x + item.x][params.y + item.y] = 5;
        squares.push([params.x + item.x - 1, params.y + item.y - 1])
    }
    shipsToFind.push([squares, Array(squares.length).fill(0)]);
    return shipsToFind;
}

function sizeThatCanBePlaced(board, params, dxdy) {
    let size = 0;
    for (item of dxdy) {
        if (board[params.x + item.x][params.y + item.y] === border) {
            return size;
        } else if (board[params.x + item.x][params.y + item.y] === 0) {
            size++;
        }
    }
    return size;
}

function chooseShip(params, shipLength) {

    const dxdy1 = [{ x: 0, y: 0 }]

    const dxdy2h = [{ x: 0, y: 0 }, { x: 0, y: 1 }]
    const dxdy2v = [{ x: 0, y: 0 }, { x: 1, y: 0 }]

    const dxdy3h = [{ x: 0, y: 0 }, { x: 0, y: 1 }, { x: 0, y: 2 }]
    const dxdy3v = [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }]

    const dxdy4h = [{ x: 0, y: 0 }, { x: 0, y: 1 }, { x: 0, y: 2 }, { x: 0, y: 3 }]
    const dxdy4v = [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 3, y: 0 }]

    switch (shipLength) {
        case 1:
            return dxdy1;

        case 2:
            switch (params.dir) {
                case "horizontal":
                    return dxdy2h;

                case "vertical":
                    return dxdy2v;
            }
        case 3:
            switch (params.dir) {
                case "horizontal":
                    return dxdy3h;

                case "vertical":
                    return dxdy3v;
            }
        case 4:
            switch (params.dir) {
                case "horizontal":
                    return dxdy4h;

                case "vertical":
                    return dxdy4v;
            }
    }
    return dxdy;
}

function createRandomShips(board) {
    let shipsToFind = [];
    shipsPlaced = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    shipsLengths = [4, 3, 3, 2, 2, 2, 1, 1, 1, 1];

    for (i in shipsPlaced) {

        while (shipsPlaced[i] === 0) {
            const params = randomParameters();
            const dxdy = chooseShip(params, shipsLengths[i]);
            const sizeThatFits = sizeThatCanBePlaced(board, params, dxdy);

            if (sizeThatFits === shipsLengths[i]) {
                const near = getNearCount(board, params, dxdy);
                if (8 * shipsLengths[i] === near) {
                    shipsPlaced[i] = 1;
                    shipsToFind = placeShip(shipsToFind, board, params, dxdy);
                }
            }
        }
    }
    return shipsToFind;
}

function getSquares(tableId) {

    const table = document.getElementById(tableId);
    const squares = [];

    let k = 0;
    for (let i = 0; i < 10; i++) {
        let squaresRow = [];
        for (let j = 0; j < 10; j++) {
            squaresRow.push(table.getElementsByTagName('TD')[k]);
            k++;
        }
        squares.push(squaresRow);
    }
    return squares;
}

function resetTexts(texts) {

    for (let m = 0; m < 10; m++) {
        texts[m].className = "default-text";
    }
    return texts;
}

function getLeftShips(shipsTypeClass) {

    const shipsType = document.querySelector(shipsTypeClass);
    const leftShips = [];
    let ids;
    shipsTypeClass === ".ships-left" ? ids = ["#s4", "#s3a", "#s3b", "#s2a", "#s2b", "#s2c", "#s1a", "#s1b", "#s1c", "#s1d"] : ids = ["#so4", "#so3a", "#so3b", "#so2a", "#so2b", "#so2c", "#so1a", "#so1b", "#so1c", "#so1d"];

    for (i in ids) {
        leftShips.push(shipsType.querySelector(ids[i]))
    }
    return leftShips
}

function showShips(board, td, i, j) {
    j++;
    switch (board[i][j]) {

        case 1: td.className = "miss";
            break;

        case 2: td.className = "hit";
            break;

        case 3: td.className = "hit-and-sunk";
            break;

        case 4: td.className = "near";
            break;

        case 5: td.className = "ship";
            break;

        default: td.className = "default";
            break;
    }
}

function dontShowShips(td) {
    td.className = "default";
}

function drawTable(board, player) {

    const container = document.getElementById('container');
    let table;
    if (player === "oponent") {
        table = document.getElementById('table-oponent');
        if (table) {
            table.remove();
        }
        table = document.createElement('table');
        table.id = "table-oponent";
    } else {
        table = document.getElementById('table-player');
        if (table) {
            table.remove();
        }
        table = document.createElement('table');
        table.id = "table-player";
    }

    let tbdy = document.createElement('tbody');

    for (let i = 0; i < 11; i++) {

        const tr = document.createElement('tr');
        const th = document.createElement('th');

        if (i != 0) {
            th.appendChild(document.createTextNode(String.fromCharCode(65 + i - 1)));// Rownames: ASCII A-J
        }

        tr.appendChild(th);

        for (let j = 0; j < 10; j++) {

            if (i === 0) {
                const th = document.createElement('th');
                th.appendChild(document.createTextNode(j + 1)); // Colnames: 1-10
                tr.appendChild(th);
            }

            else {
                const td = document.createElement('td');
                //td.appendChild(document.createTextNode("i"+(i-1)+" j"+j)); 
                showShips(board, td, i, j);
                //dontShowShips(td);
                tr.appendChild(td);
            }
        }
        tbdy.appendChild(tr);
    }
    table.appendChild(tbdy);
    container.appendChild(table)
}

function currentHitSumAll(shipsToFind, currentSumShip, winningSumShip) {
    for (let i = 0; i < shipsToFind.length; i++) {
        if (winningSumShip[i] != currentSumShip[i]) {
            return false;
        }
    }
    return true;
}

function currentHitSumShip(shipsToFind, i) {
    let sum = 0;
    for (let k = 0; k < shipsToFind[i][0].length; k++) {
        sum = sum + shipsToFind[i][1][k];
    }
    return sum;
}
function disableAround(i, row, col) {
    console.log("XY", row, col)
    let dxdy;
    if (i > 5) {
        dxdy = [{ x: -1, y: 0 }, { x: -1, y: 1 }, { x: 0, y: 1 }, { x: 1, y: 1 }, { x: 1, y: 0 }, { x: 1, y: -1 }, { x: 0, y: -1 }, { x: -1, y: -1 }];
        for (it of dxdy) {
        console.log("xy",row + it.x, col + it.y)
        board[row + it.x][col + it.y] = 1;
    }
    } else if(i>2) {
       // dxdy = [{ x: -1, y: 0 }, { x: -1, y: 1 }, { x: 0, y: 1 }, { x: 1, y: 1 }, { x: 1, y: 0 }, { x: 1, y: -1 }, { x: 0, y: -1 }, { x: -1, y: -1 }];
       if(board[row][col+1]==2){
        console.log("h")
       } else {

        console.log("v")

       }
    }
    // else if (i < 1) {
    //      dxdy = [{ x: 0, y: 0 }, { x: -1, y: 1 }];
    //      if(board[row][col+1]==2){
    //          console.log("h")
    //      }
    // }
    
}
function sunkShip(shipsToFind, squares, i, r, c) {
    for (let k = 0; k < shipsToFind[i][0].length; k++) {

        const row = shipsToFind[i][0][k][0];
        const col = shipsToFind[i][0][k][1];

        squares[row][col].className = "hit-and-sunk"
        console.log("i", i)
        disableAround(i, r, c);
    }
}

function winMessageClear() {
    if (document.getElementById("won")) {
        document.getElementById("won").remove();
    }
}

function winMessage(player) {

    let body = document.getElementsByTagName('body')[0];
    let div = document.createElement('div');
    if (player === "player") {
        div.innerHTML = "<h1 id='won'>YOU WON!!!</h1>";
    } else {
        div.innerHTML = "<h1 id='won'>YOU LOSE!!!</h1>";

    }
    body.appendChild(div);
}

function hitShip(player, board, shipsToFind, leftShips, squares, I, J, currentSumShip, winningSumShip) {

    const row = I;
    const col = J;

    squares[row][col].className = "hit";
    board[row + 1][col + 1] = hitSquare;

    for (let i = 0; i < shipsToFind.length; i++) {
        for (let j = 0; j < shipsToFind[i].length; j++) {
            for (let k = 0; k < shipsToFind[i][j].length; k++) {
                if (shipsToFind[i][j][k][0] === row && shipsToFind[i][j][k][1] === col) {
                    shipsToFind[i][1][k] = 1;
                    currentSumShip[i] = currentSumShip[i] + 1; //add hit square

                    if (currentHitSumShip(shipsToFind, i) === shipsToFind[i][j].length) {
                        sunkShip(shipsToFind, squares, i, row+1, col+1);
                        console.log(i, leftShips[i])
                        leftShips[i].className += " ship-left-sunked";
                        if (player === "oponent") {
                            squaresAround = [];
                        }
                    }
                    if (currentHitSumAll(shipsToFind, currentSumShip, winningSumShip)) {
                        winMessage(player);
                    }
                }
            }
        }
    }
}

function hit(player, board, shipsToFind, leftShips, squares, I, J, currentSumShip, winningSumShip) {
    console.log("sq", squares[I][J].className);
    if (squares[I][J].className === "ship") {
        if (turn === "player") {
            console.log("pl", turn);
            hitShip(player, board, shipsToFind, leftShips, squares, I, J, currentSumShip, winningSumShip)
            turn = "oponent";
            shootOnClick();
        } else {
            alert("its not your turn");
        }
    }
}
const missShip = function (board, squares, i, j) {

    squares[i][j].className = "miss";
    board[i + 1][j + 1] = missedSquare;

}
function miss(board, squares, i, j) {
    if (squares[i][j].className === "default") {
        if (turn === "player") {
            console.log("pl", turn);
            missShip(board, squares, i, j);
            turn = "oponent";
            shootOnClick();
        } else {
            alert("its not your turn");
        }
    }
}

function playGuess(player, board, shipsToFind, squares, leftShips, texts) {

    let currentSumShip = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    let winningSumShip = [4, 3, 3, 2, 2, 2, 1, 1, 1, 1];
    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {

            if (board[i + 1][j + 1] === shipSquare) {
                squares[i][j].addEventListener("click", function () { hit(player, board, shipsToFind, leftShips, squares, i, j, currentSumShip, winningSumShip); });

            }
            else if (board[i + 1][j + 1] === defaultSquare || board[i + 1][j + 1] === nearShipSquare) {
                squares[i][j].addEventListener("click", function () { miss(board, squares, i, j); });

            }
        }
    }
}

function aroundShoot(row, col) {
    //let randomDirection = Math.round(Math.random() * 10) % 4;
    let around = [{ x: -1, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 0 }, { x: 0, y: -1 }];
    let corners = [{ x: -1, y: -1 }, { x: 1, y: 1 }, { x: 1, y: -1 }, { x: -1, y: 1 }];

    for (i in around) {
        const x = around[i].x + row;
        const y = around[i].y + col;
        const cornerX = corners[i].x + row;
        const cornerY = corners[i].y + col;
        let isInArray = false;
        for (k in squaresAround) {
            if (squaresAround[k][0] == x && squaresAround[k][0] == y) {
                isInArray = true;
            }
        }
        if (!isInArray) {
            if (x != 0 && x != 11 && y != 0 && y != 11) {
                const square = [x, y]
                //board[x][y]=7;
                squaresAround.push(square);
            }
            if (cornerX != 0 && cornerX != 11 && cornerY != 0 && cornerY != 11) {
                board[cornerX][cornerY] = 1;//miss

            }
        }
    }
}

function randomSquareShoot(player, board, shoot) {
    let randomSquare;
    let squareShooted = 0;
    console.log("sa", squaresAround);

    for (i in squaresAround) {
        console.log("s", squaresAround[i][0], squaresAround[i][1]);

    }
    for (i in board[0]) {
        for (j in board[0]) {
            //if(board[i][j]==7){

        }
    }

    if (squaresAround.length > 0) {
        for (i in squaresAround) {
            console.log(squaresAround[i][0], squaresAround[i][1])
            const r = squaresAround[i][0];
            const c = squaresAround[i][1];
            if (board[r][c] === shipSquare) {
                if (turn === "oponent") {
                    console.log("opo", turn);
                    quareShooted = 1;
                    board[r][c] = 2;//hit
                    aroundShoot(r, c)
                    hitShip(player, board, shipsToFind, leftShips, squares, r - 1, c - 1, currentSumShip, winningSumShip);
                    turn = "player";
                    return { x: r, y: c }

                }
            } else if (board[r][c] === 0) {
                if (turn === "oponent") {
                    console.log("opo", turn);
                    squareShooted = 1;
                    board[r][c] = 1;
                    missShip(board, squares, r - 1, c - 1);
                    turn = "player";
                    //aroundShoot(r, c)
                    return { x: r, y: c }

                }
            }

            // squaresAround = [];
        }
    } else {

        while (squareShooted === 0 && shoot <= 100 && turn === "oponent") {
            const randomRow = Math.round(Math.random() * 100) % 10 + 1;
            const randomCol = Math.round(Math.random() * 100) % 10 + 1;
            randomSquare = { x: randomRow, y: randomCol };
            if (board[randomRow][randomCol] === 0) {
                if (turn === "oponent") {
                    console.log("opo", turn);
                    squareShooted = 1;
                    board[randomRow][randomCol] = 1;
                    missShip(board, squares, randomRow - 1, randomCol - 1);
                    turn = "player";
                }
            } else if (board[randomRow][randomCol] === shipSquare) {
                if (turn === "oponent") {
                    aroundShoot(randomRow, randomCol)
                    console.log("opo", turn);
                    squareShooted = 1;
                    board[randomRow][randomCol] = 2;//hit
                    hitShip(player, board, shipsToFind, leftShips, squares, randomRow - 1, randomCol - 1, currentSumShip, winningSumShip);
                    turn = "player";
                }
            } else {
                console.log("the same shoot");
            }
        }
    }
    board[0][0] = shoot;
    printBoard(board);
    return randomSquare;
}

function shootOnClick() {
    setTimeout(function () {
        shoot++;
        const randomSquare = randomSquareShoot("oponent", board, shoot);
        console.log(randomSquare)
        if (!randomSquare) {
            shoot--;
            alert("its your turn");
        }
        if (shoot === 100) {
            document.querySelector("#shoot-btn").className = "disappeared";
        }
        turn = "player"
    }, 10);//wait 1 sec
}

function randomShipsOnClick() {
    winMessageClear();
    board = createEmptyBoardAndBorders();
    turn = "player"
    shipsToFind = createRandomShips(board);
    drawTable(board, "player");
    randomOrPlaceYourShips = 1;
    squares = getSquares("table-player");
}


function resetShipsOnClick() {
    let board = createEmptyBoardAndBorders();
    randomOrPlaceYourShips = 0;

    drawTable(board, "player");
}

function changeButtons(play) {
    if (play) {
        document.querySelector("#random-btn").className = "";
        document.querySelector("#reset-btn").className = "";
        document.querySelector("#play-btn").className = "";

        document.querySelector(".ships-left-oponent").className = "ships-left-oponent disappeared";
        // document.querySelector("#shoot-btn").className = "disappeared";
        document.querySelector("#quit-btn").className = "disappeared";
    } else {
        document.querySelector("#random-btn").className = "disappeared";
        document.querySelector("#reset-btn").className = "disappeared";
        document.querySelector("#play-btn").className = "disappeared";

        document.querySelector(".ships-left-oponent").className = "ships-left-oponent";
        document.querySelector("#quit-btn").className = "";
        // document.querySelector("#shoot-btn").className = "";
    }
}

function randomOponentShips() {

    boardOponent = createEmptyBoardAndBorders();
    shipsToFindO = createRandomShips(boardOponent);
    drawTable(boardOponent, "oponent");
    squaresO = getSquares("table-oponent");
}

function playOnClick() {

    if (randomOrPlaceYourShips === 1) {
        randomOrPlaceYourShips = 0;
        changeButtons(false);
        randomOponentShips();
        leftShipsOponent = getLeftShips(".ships-left-oponent");
        playGuess("player", boardOponent, shipsToFindO, squaresO, leftShipsOponent);
    }
    else {
        alert("Place or random your ships");
    }
}

function quitOnClick() {

    const answer = confirm("Are you sure you want to end game?");
    console.log(answer);
    if (answer) {
        changeButtons(true);
        resetShipsOnClick();
        document.getElementById("table-oponent").remove();
    }
}

