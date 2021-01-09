const size = 10;
const boardSize = size + 2;

const defaultSquare = 0;
const missedSquare = 1;
const hitSquare = 2;
const sunkSquare = 3;
const nearShipSquare = 4;
const shipSquare = 5;


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
            if (col == 0 || col == 11 || row == 0 || row == 11) {
                boardRow.push(9); // create border
            } else {
                boardRow.push(0); // create board
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

    let body = document.getElementsByTagName('body')[0];

    let area = document.createElement('div');
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

    let randomDirection = Math.round(Math.random() * 10) % 2;

    if (randomDirection == 0) {
        randomDirection = "vertical";
    } else {
        randomDirection = "horizontal";
    }

    return { x: randomRow, y: randomCol, dir: randomDirection };

}



function checkNear(board, params, dxdyShip) {
    around = 0;
    const dxdy = [{ x: -1, y: 0 }, { x: -1, y: 1 }, { x: 0, y: 1 }, { x: 1, y: 1 }, { x: 1, y: 0 }, { x: 1, y: -1 }, { x: 0, y: -1 }, { x: -1, y: -1 }];
    for (square of dxdyShip) {

        for (item of dxdy) {

            if (board[params.x + item.x + square.x][params.y + item.y + square.y] == 0 || board[params.x + item.x + square.x][params.y + item.y + square.y] == 9) {
                around += 1;
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
        if (board[params.x + item.x][params.y + item.y] == 9) {
            return size;
        } else if (board[params.x + item.x][params.y + item.y] == 0) {
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
            break;

        case 2:
            switch (params.dir) {
                case "horizontal":
                    return dxdy2h;
                    break;

                case "vertical":
                    return dxdy2v;
                    break;
            }
        case 3:
            switch (params.dir) {
                case "horizontal":
                    return dxdy3h;
                    break;

                case "vertical":
                    return dxdy3v;
                    break;
            }
        case 4:
            switch (params.dir) {
                case "horizontal":
                    return dxdy4h;
                    break;

                case "vertical":
                    return dxdy4v;
                    break;
            }
    }
    return dxdy;
}

function createRandomShips(board) {
    let shipsToFind = [];
    shipsPlaced = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    shipsLengths = [4, 3, 3, 2, 2, 2, 1, 1, 1, 1];

    for (i in shipsPlaced) {

        while (shipsPlaced[i] == 0) {
            const params = randomParameters();


            const dxdy = chooseShip(params, shipsLengths[i]);
            const sizeThatFits = sizeThatCanBePlaced(board, params, dxdy);


            if (sizeThatFits == shipsLengths[i]) {
                const near = checkNear(board, params, dxdy);
                if (8 * shipsLengths[i] == near) {
                    shipsPlaced[i] = 1;
                    shipsToFind = placeShip(shipsToFind, board, params, dxdy);

                }

            } else {
            }

        }
    }
    return shipsToFind;
}

const getSquares = function (tableId) {

    let table = document.getElementById(tableId);
    let squares = [];

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


const resetTexts = function (texts) {

    for (let m = 0; m < 10; m++) {
        texts[m].className = "default-text";
    }

    return texts;
}




const getLeftShips = function () {

    let leftShips = [];

    leftShips.push(document.querySelector("#s4"));
    leftShips.push(document.querySelector("#s3a"));
    leftShips.push(document.querySelector("#s3b"));
    leftShips.push(document.querySelector("#s2a"));
    leftShips.push(document.querySelector("#s2b"));
    leftShips.push(document.querySelector("#s2c"));
    leftShips.push(document.querySelector("#s1a"));
    leftShips.push(document.querySelector("#s1b"));
    leftShips.push(document.querySelector("#s1c"));
    leftShips.push(document.querySelector("#s1d"));


    return leftShips
}


const getLeftShipsOponent = function () {

    let leftShipsOponent = [];

    leftShipsOponent.push(document.querySelector("#so4"));
    leftShipsOponent.push(document.querySelector("#so3a"));
    leftShipsOponent.push(document.querySelector("#so3b"));
    leftShipsOponent.push(document.querySelector("#so2a"));
    leftShipsOponent.push(document.querySelector("#so2b"));
    leftShipsOponent.push(document.querySelector("#so2c"));
    leftShipsOponent.push(document.querySelector("#so1a"));
    leftShipsOponent.push(document.querySelector("#so1b"));
    leftShipsOponent.push(document.querySelector("#so1c"));
    leftShipsOponent.push(document.querySelector("#so1d"));


    return leftShipsOponent;
}

const showShips = function (board, td, i, j) {
    i++;
    j++;
    switch (board[i - 1][j]) {

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

const dontShowShips = function (td) {
    td.className = "default";
}

const drawTable = function (board, player) {

    let body = document.getElementById('container');
    let table;
    if (player == "oponent") {
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


    //table.setAttribute('border', '1');

    let tbdy = document.createElement('tbody');

    for (let i = 0; i < 11; i++) {

        let tr = document.createElement('tr');

        let th = document.createElement('th');

        if (i == 0) {
            //th.appendChild(document.createTextNode('X'));
        }

        else {
            th.appendChild(document.createTextNode(String.fromCharCode(65 + i - 1)));// Rownames: ASCII A-J
        }

        tr.appendChild(th);

        for (let j = 0; j < 10; j++) {

            if (i == 0) {
                let th = document.createElement('th');
                th.appendChild(document.createTextNode(j + 1)); // Colnames: 1-10
                tr.appendChild(th);
            }

            else {
                let td = document.createElement('td');

                //td.appendChild(document.createTextNode("i"+(i-1)+" j"+j)); 

                showShips(board, td, i, j);
                //dontShowShips(td);

                tr.appendChild(td);
            }
        }

        tbdy.appendChild(tr);
    }

    table.appendChild(tbdy);

    body.appendChild(table)

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

function sunkShip(shipsToFind, squares, i) {
    for (let k = 0; k < shipsToFind[i][0].length; k++) {

        const row = shipsToFind[i][0][k][0];
        const col = shipsToFind[i][0][k][1];

        squares[row][col].className = "hit-and-sunk"

    }
}

function winMessageClear() {
    if (document.getElementById("won")) {
        document.getElementById("won").remove();
    }
}
const winMessage = function (player) {

    let body = document.getElementsByTagName('body')[0];
    let div = document.createElement('div');
    if (player == "player") {
        div.innerHTML = "<h1 id='won'>YOU WON!!!</h1>";
    } else {
        div.innerHTML = "<h1 id='won'>YOU LOSE!!!</h1>";

    }
    body.appendChild(div);
}
let turn = "player";

function hitShip(player, board, shipsToFind, leftShips, squares, I, J, currentSumShip, winningSumShip) {


    const row = I;
    const col = J;

    squares[row][col].className = "hit";
    board[row + 1][col + 1] = hitSquare;

    for (let i = 0; i < shipsToFind.length; i++) {
        for (let j = 0; j < shipsToFind[i].length; j++) {
            for (let k = 0; k < shipsToFind[i][j].length; k++) {
                if (shipsToFind[i][j][k][0] == row && shipsToFind[i][j][k][1] == col) {
                    shipsToFind[i][1][k] = 1;
                    currentSumShip[i] = currentSumShip[i] + 1; //add hit square

                    if (currentHitSumShip(shipsToFind, i) == shipsToFind[i][j].length) {
                        sunkShip(shipsToFind, squares, i);
                        leftShips[i].className += " ship-left-sunked";

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
    if (squares[I][J].className == "ship") {
        if (turn == "player") {
            console.log("pl", turn);
            hitShip(player, board, shipsToFind, leftShips, squares, I, J, currentSumShip, winningSumShip)
            turn = "oponent";
        } else {
            alert("its not your turn");
        }
    }
}
const missShip = function (board, squares, i, j) {

    squares[i][j].className = "miss";
    board[i + 1][j + 1] = missedSquare;

}
const miss = function (board, squares, i, j) {
    if (squares[i][j].className == "default") {
        if (turn == "player") {
            console.log("pl", turn);
            missShip(board, squares, i, j); turn = "oponent";
        } else {
            alert("its not your turn");
        }
    }
}

const playGuess = function (player, board, shipsToFind, squares, leftShips, texts) {

    let currentSumShip = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    let winningSumShip = [4, 3, 3, 2, 2, 2, 1, 1, 1, 1];
    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {

            if (board[i + 1][j + 1] == shipSquare) {
                squares[i][j].addEventListener("click", function () { hit(player, board, shipsToFind, leftShips, squares, i, j, currentSumShip, winningSumShip); });

            }
            else if (board[i + 1][j + 1] == defaultSquare || board[i + 1][j + 1] == nearShipSquare) {
                squares[i][j].addEventListener("click", function () { miss(board, squares, i, j); });

            }
        }
    }


}


let board;
let boardOponent;
let boardComputerShoot = createEmptyBoardAndBorders();

let shipsToFind;
let shipsToFindO;
let squaresO;
let leftShips = getLeftShips();
let leftShipsOponent = getLeftShipsOponent();

let squares;

let randomOrPlaceYourShips = 0;
let currentSumShip = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
let winningSumShip = [4, 3, 3, 2, 2, 2, 1, 1, 1, 1];

function aroundShoot(player, board, shoot) {
    let randomDirection = Math.round(Math.random() * 10) % 4;

    let around=[{ x: -1, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 0 }, { x: 0, y: -1 }];


}
function randomSquareShoot(player, board, shoot) {


    let randomSquare;
    let squareShooted = 0;
    while (squareShooted == 0 && shoot <= 100 && turn == "oponent") {
        const randomRow = Math.round(Math.random() * 100) % 10 + 1;
        const randomCol = Math.round(Math.random() * 100) % 10 + 1;
        randomSquare = { x: randomRow, y: randomCol };
        if (board[randomRow][randomCol] == 0) {
            if (turn == "oponent") {
                console.log("opo", turn);
                squareShooted = 1;
                board[randomRow][randomCol] = 1;
                missShip(board, squares, randomRow - 1, randomCol - 1);
                turn = "player";
            }

        } else if (board[randomRow][randomCol] == 5) {
            if (turn == "oponent") {
                console.log("opo", turn);
                squareShooted = 1;
                board[randomRow][randomCol] = 6;//hit
                hitShip(player, board, shipsToFind, leftShips, squares, randomRow - 1, randomCol - 1, currentSumShip, winningSumShip);
                turn = "player";
            }

        } else {

            console.log("the same shoot");

        }


    }

    board[0][0] = shoot;

    //printBoard(board);
    return randomSquare;

}
let shoot = 0;
function shootOnClick() {
    //document.getElementsByName("body").innerHTML+=shoot;


    shoot++;
    const randomSquare = randomSquareShoot("oponent", board, shoot);
    if (!randomSquare) {
        shoot--;
        alert("its your turn");

    }
    if (shoot == 100) {
        document.querySelector("#shoot-btn").className = "disappeared";

    }
    turn = "player"

}


function randomShipsOnClick() {
    winMessageClear();
    board = createEmptyBoardAndBorders();
    turn = "player"
    shipsToFind = createRandomShips(board);
    //createAndShowNear();
    //printBoard(board);

    drawTable(board, "player");
    randomOrPlaceYourShips = 1;
    squares = getSquares("table-player");
}



board = createEmptyBoardAndBorders();
drawTable(board, "player");

//console.log("ships", getLeftShips());



function resetShipsOnClick() {
    let board = createEmptyBoardAndBorders();
    randomOrPlaceYourShips = 0;

    drawTable(board, "player");

}

function buttonsChanges(play) {
    if (play == true) {
        document.querySelector("#random-btn").className = "";
        document.querySelector("#reset-btn").className = "";
        document.querySelector("#play-btn").className = "";
        //document.querySelector("#left-ships-container").className = "disappeared";

        document.querySelector("#quit-btn").className = "disappeared";
    } else {
        document.querySelector("#random-btn").className = "disappeared";
        document.querySelector("#reset-btn").className = "disappeared";
        document.querySelector("#play-btn").className = "disappeared";
        //document.querySelector("#left-ships-container").className = "";

        document.querySelector("#quit-btn").className = "";
    }


    //document.querySelector("#play-btn").className = "";

}

function randomOponentShips() {

    boardOponent = createEmptyBoardAndBorders();
    shipsToFindO = createRandomShips(boardOponent);
    drawTable(boardOponent, "oponent");
    squaresO = getSquares("table-oponent");

    //textsO = resetTexts(tO);
}


function playOnClick() {

    if (randomOrPlaceYourShips == 1) {
        randomOrPlaceYourShips = 0;
        buttonsChanges(false);
        randomOponentShips();
        playGuess("player", boardOponent, shipsToFindO, squaresO, leftShipsOponent);
    }
    else {
        alert("Place or random your ships");
    }

}

function quitOnClick() {

    let answer = confirm("Are you sure you want to end game?");
    console.log(answer);
    if (answer == true) {
        buttonsChanges(true);

        resetShipsOnClick();
        //randomOponentShips();
        document.getElementById("table-oponent").remove();
    }
}


function checkIfshooted() {

}