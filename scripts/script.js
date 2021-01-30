const size = 10;
const boardSize = size + 2;
let draggedShips = [];
const defaultSquare = 0;
const missedSquare = 1;
const hitSquare = 2;
const sunkSquare = 3;
const nearShipSquare = 4;
const shipSquare = 5;
const border = 9;
let setDirection = "vertical";//vertical horizontal
let turn = "player";

let shipsToFind = [];
let squares;
let leftShips;
let squaresD;

let boardOponent;
let shipsToFindO;
let squaresO;
let leftShipsOponent;

let randomOrPlaceYourShips = 0;
let shoot = 0;
let squaresAround = [];

let currentSumShip = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
let winningSumShip = [4, 3, 3, 2, 2, 2, 1, 1, 1, 1];

let placeYourShips = 0;
let chosenShip = "none";
let chosenShipId = 0;
let placedShipsCount = 0;

createEmptyBoardAndBorders = () => {
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
let board = createEmptyBoardAndBorders();

clearPrintBoard = () => {
    if (document.getElementById("printingArea")) {
        document.getElementById("printingArea").remove();
    }
}

printBoard = (board) => {
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

randomParameters = () => {

    const randomRow = Math.round(Math.random() * 100) % 10 + 1;
    const randomCol = Math.round(Math.random() * 100) % 10 + 1;
    const randomDirection = Math.round(Math.random() * 10) % 2 === 0 ? "vertical" : "horizontal";

    return { x: randomRow, y: randomCol, dir: randomDirection };
}

getNearCount = (board, params, dxdyShip) => {

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

placeShip = (shipsToFind, board, params, dxdy) =>{

    const squares = [];

    for (item of dxdy) {
        board[params.x + item.x][params.y + item.y] = 5;
        squares.push([params.x + item.x - 1, params.y + item.y - 1])
    }
    shipsToFind.push([squares, Array(squares.length).fill(0)]);
    return shipsToFind;
}

 sizeThatCanBePlaced=(board, params, dxdy)=> {
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

 createShip = (params, shipLength)=>{

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

 createRandomShips = (board) =>{
    let shipsToFind = [];
    shipsPlaced = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    shipsLengths = [4, 3, 3, 2, 2, 2, 1, 1, 1, 1];

    for (i in shipsPlaced) {

        while (shipsPlaced[i] === 0) {
            const params = randomParameters();
            const dxdy = createShip(params, shipsLengths[i]);
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

 getSquares=(tableId) =>{

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

 resetTexts=(texts)=> {

    for (let m = 0; m < 10; m++) {
        texts[m].className = "default-text";
    }
    return texts;
}

 getLeftShips=(shipsTypeClass)=> {

    const shipsType = document.querySelector(shipsTypeClass);
    const leftShips = [];
    let ids;
    shipsTypeClass === ".ships-left" ? ids = ["#s4", "#s3a", "#s3b", "#s2a", "#s2b", "#s2c", "#s1a", "#s1b", "#s1c", "#s1d"] : ids = ["#so4", "#so3a", "#so3b", "#so2a", "#so2b", "#so2c", "#so1a", "#so1b", "#so1c", "#so1d"];

    for (i in ids) {
        leftShips.push(shipsType.querySelector(ids[i]))
    }
    return leftShips
}

 showShips=(board, td, i, j, player) =>{
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

        case 5:
            player === "player" ? td.className = "ship" : td.className = "shipO"
            break;

        default: td.className = "default";
            break;
    }
}

 drawTable=(board, player) =>{

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
                if (player === "player") {
                    td.id = "id" + (i - 1).toString() + j.toString();
                }
                //td.appendChild(document.createTextNode("i"+(i-1)+" j"+j)); 
                showShips(board, td, i, j, player);

                td.setAttribute("onmouseover", "hoverSquareColor(this)");
                td.setAttribute("onmouseout", "defaultSquareColor(this)");
                tr.appendChild(td);
            }
        }
        tbdy.appendChild(tr);
    }
    table.appendChild(tbdy);
    container.appendChild(table)
}
drawTable(board, "player");


 currentHitSumAll=(shipsToFind, currentSumShip, winningSumShip) =>{
    for (let i = 0; i < shipsToFind.length; i++) {
        if (winningSumShip[i] != currentSumShip[i]) {
            return false;
        }
    }
    return true;
}

 currentHitSumShip=(shipsToFind, i)=> {
    let sum = 0;
    for (let k = 0; k < shipsToFind[i][0].length; k++) {
        sum = sum + shipsToFind[i][1][k];
    }
    return sum;
}

 disableAround=(i, row, col, board) =>{
    let dxdy;
    if (i > 5) { // 1 square ships
        dxdy = [{ x: -1, y: 0 }, { x: -1, y: 1 }, { x: 0, y: 1 }, { x: 1, y: 1 }, { x: 1, y: 0 }, { x: 1, y: -1 }, { x: 0, y: -1 }, { x: -1, y: -1 }];
        for (it of dxdy) {
            const r = row + it.x;
            const c = col + it.y;
            if (board[r][c] != border) { board[r][c] = missedSquare; }
        }
    } else {
        let direction;
        let sizeOfShip;

        board[row][col + 1] === 2 || board[row][col - 1] === 2 ? direction = "horizontal" : direction = "vertical";

        if (i > 2) { // 2 square ships
            sizeOfShip = 2;
        } else if (i > 0) { // 3 square ships
            sizeOfShip = 3;
        } else { // 4 square ship
            sizeOfShip = 4;
        }
        if (direction === "vertical") {

            if (board[row - 1][col] === hitSquare) { // current is lower
                if (board[row + 1][col] != border) { board[row + 1][col] = missedSquare; }
                if (board[row - sizeOfShip][col] != border) { board[row - sizeOfShip][col] = missedSquare; }
            }
            else { //current is upper
                if (board[row + sizeOfShip][col] != border) { board[row + sizeOfShip][col] = missedSquare; }
                if (board[row - 1][col] != border) { board[row - 1][col] = missedSquare; }
            }
        } else { //dir = horizontal

            if (board[row][col - 1] === hitSquare) { // current is right
                if (board[row][col - sizeOfShip] != border) { board[row][col - sizeOfShip] = missedSquare; }
                if (board[row][col + 1] != border) { board[row][col + 1] = missedSquare; }
            }
            else { //current is left
                if (board[row][col - 1] != border) { board[row][col - 1] = missedSquare; }
                if (board[row][col + sizeOfShip] != border) { board[row][col + sizeOfShip] = missedSquare; }
            }
        }
    }
}

 sunkShip=(board, shipsToFind, squares, i, r, c) =>{
    for (let k = 0; k < shipsToFind[i][0].length; k++) {

        const row = shipsToFind[i][0][k][0];
        const col = shipsToFind[i][0][k][1];
        squares[row][col].className = "hit-and-sunk"
        disableAround(i, r, c, board);
    }
}

 winMessage=(player)=> {
    setTimeout(function () {
        player === "player" ? alert("You won! Play again?") : alert("You lost. Play again?");
        shoot = 0;
        randomOrPlaceYourShips = 0;
        squaresAround = [];
        currentSumShip = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        winningSumShip = [4, 3, 3, 2, 2, 2, 1, 1, 1, 1];
        placeYourShips = 0;
        chosenShip = "none";
        chosenShipId = 0;
        placedShipsCount = 0;
        shipsToFind = [];
        shipsToFindO = [];
        changeButtons(true);
        resetShipsOnClick();
        document.getElementById("table-oponent").remove();
        resetLeftShips(leftShips);
        resetLeftShips(leftShipsOponent);
    }, 1000);//wait 1 sec    
}

 hitShip=(player, board, shipsToFind, leftShips, squares, I, J, currentSumShip, winningSumShip)=> {

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
                        sunkShip(board, shipsToFind, squares, i, row + 1, col + 1);
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

 hit=(player, board, shipsToFind, leftShips, squares, I, J, currentSumShip, winningSumShip)=> {

    if (squares[I][J].className === "ship" || squares[I][J].className === "shipO") {
        if (turn === "player") {
            hitShip(player, board, shipsToFind, leftShips, squares, I, J, currentSumShip, winningSumShip)
            disableCorners(board, I + 1, J + 1)
            turn = "oponent";
            shootOnClick();
        } else {
            alert("its not your turn");
        }
    }
    colorNearSquares(squares, board);
    //printBoard(board);
}

const missShip = function (board, squares, i, j) {
    squares[i][j].className = "miss";
    board[i + 1][j + 1] = missedSquare;
}

miss=(board, squares, i, j) => {
    if (squares[i][j].className === "default") {
        if (turn === "player") {
            missShip(board, squares, i, j);
            turn = "oponent";
            shootOnClick();
        } else {
            alert("its not your turn");
        }
    }
}

 playGuess=(player, board, shipsToFind, squares, leftShips)=>  {

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

 disableCorners=(board, row, col)=>  {

    let corners = [{ x: -1, y: -1 }, { x: 1, y: 1 }, { x: 1, y: -1 }, { x: -1, y: 1 }];

    for (i in corners) {

        const cornerX = corners[i].x + row;
        const cornerY = corners[i].y + col;

        if (cornerX != 0 && cornerX != 11 && cornerY != 0 && cornerY != 11) {
            board[cornerX][cornerY] = missedSquare;

        }

    }
}

 aroundShoot=(row, col)=>  {

    let around = [{ x: -1, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 0 }, { x: 0, y: -1 }];
    let corners = [{ x: -1, y: -1 }, { x: 1, y: 1 }, { x: 1, y: -1 }, { x: -1, y: 1 }];

    for (i in around) {
        const x = around[i].x + row;
        const y = around[i].y + col;
        const cornerX = corners[i].x + row;
        const cornerY = corners[i].y + col;
        let isInArray = false;
        for (k in squaresAround) {
            if (squaresAround[k][0] == x && squaresAround[k][1] == y) {
                isInArray = true;
            }
        }
        if (!isInArray) {
            if (x != 0 && x != 11 && y != 0 && y != 11) {
                const square = [x, y]
                squaresAround.push(square);
            }
            if (cornerX != 0 && cornerX != 11 && cornerY != 0 && cornerY != 11) {
                board[cornerX][cornerY] = missedSquare;

            }
        }
    }
}


colorNearSquares=(squares, board) =>{
    for (let row = 0; row < boardSize; row++) {
        for (let col = 0; col < boardSize; col++) {
            if (board[row][col] === 1) {
                squares[row - 1][col - 1].className = "miss";
            }
        }
    }
}

 randomSquareShoot=(player, board, shoot) => {
    let randomSquare;
    let squareShooted = 0;

    if (squaresAround.length > 0) {
        for (i in squaresAround) {

            const r = squaresAround[i][0];
            const c = squaresAround[i][1];

            if (board[r][c] === shipSquare) {
                if (turn === "oponent") {
                    squareShooted = 1;
                    board[r][c] = hitSquare;
                    aroundShoot(r, c)
                    hitShip(player, board, shipsToFind, leftShips, squares, r - 1, c - 1, currentSumShip, winningSumShip);
                    turn = "player";
                    return { x: r, y: c }
                }
            } else if (board[r][c] === defaultSquare) {
                if (turn === "oponent") {
                    squareShooted = 1;
                    board[r][c] = missedSquare;
                    missShip(board, squares, r - 1, c - 1);
                    turn = "player";
                    return { x: r, y: c }
                }
            }
        }
    } else {

        while (squareShooted === 0 && shoot <= 100 && turn === "oponent") {
            const randomRow = Math.round(Math.random() * 100) % 10 + 1;
            const randomCol = Math.round(Math.random() * 100) % 10 + 1;
            randomSquare = { x: randomRow, y: randomCol };
            if (board[randomRow][randomCol] === 0) {
                if (turn === "oponent") {
                    squareShooted = 1;
                    missShip(board, squares, randomRow - 1, randomCol - 1);
                    turn = "player";
                }
            } else if (board[randomRow][randomCol] === shipSquare) {
                if (turn === "oponent") {
                    aroundShoot(randomRow, randomCol)
                    squareShooted = 1;
                    hitShip(player, board, shipsToFind, leftShips, squares, randomRow - 1, randomCol - 1, currentSumShip, winningSumShip);
                    turn = "player";
                }
            } else {
                //console.log("the same shoot");
            }
        }
    }
    board[0][0] = shoot;
    //printBoard(board);
    //colorNearSquares(squares, board);
    return randomSquare;
}

 shootOnClick=()=>  {
    setTimeout(function () {
        shoot++;
        const randomSquare = randomSquareShoot("oponent", board, shoot);
        if (!randomSquare) {
            shoot--;
            alert("its your turn");
        }
        if (shoot === 100) {
            document.querySelector("#shoot-btn").className = "disappeared";
        }
        turn = "player";
        //printBoard(board);
    }, 1000);//wait 1 sec    
}

 clearShips=() =>{

    const shipsToDrag = document.querySelector(".ships-to-drag").childNodes;

    for (index in shipsToDrag) {

        if (index % 2 === 1) {
            shipsToDrag[index].classList.add("ship-left-disappeared");
        }
    }
}

 randomShipsOnClick=() =>{
    resetShipsOnClick()
    clearShips()
    board = createEmptyBoardAndBorders();
    turn = "player"
    shipsToFind = createRandomShips(board);
    drawTable(board, "player");
    randomOrPlaceYourShips = 1;
    squares = getSquares("table-player");
}

 resetShipsToDrag=()=> {
    const shipsToDrag = document.querySelector(".ships-to-drag").childNodes;

    for (index in shipsToDrag) {

        if (index % 2 === 1) {
            shipsToDrag[index].classList.remove("ship-left-disappeared");
        }
    }
    for (ship of draggedShips) {

        const chosenSquares = ship.childNodes;

        for (index in chosenSquares) {
            if (index % 2 === 1) {
                chosenSquares[index].style.background = "rgb(35, 170, 163)";
            }
        }
    }
}



 resetShipsOnClick=() =>{
    chosenShip = "none";
    board = createEmptyBoardAndBorders();
    randomOrPlaceYourShips = 0;
    resetShipsToDrag();
    drawTable(board, "player");
    squaresD = getSquares("table-player");
    hoverS(squaresD);
}
const buttonDefaultId=["#random-btn","#rotate-btn", "#reset-btn", "#play-btn"];
const elementPlayIdClass=[".ships-left", ".ships-left-oponent","#quit-btn"];
 changeButtons=(play)=> {
    if (play) {
        for(let i of buttonDefaultId){
            document.querySelector(i).className = "";
        }
        for(let i of elementPlayIdClass){
            document.querySelector(i).classList.add("disappeared");
        }
        document.querySelector(".ships-to-drag").classList.remove("disappeared");
    } else {
        for(let i of buttonDefaultId){
            document.querySelector(i).className = "disappeared";
        }
        document.querySelector(".ships-to-drag").classList.add("disappeared");
        for(let i of elementPlayIdClass){
            document.querySelector(i).classList.remove("disappeared");
        }
    }
}

 randomOponentShips=()=> {
    boardOponent = createEmptyBoardAndBorders();
    shipsToFindO = createRandomShips(boardOponent);
    drawTable(boardOponent, "oponent");
    squaresO = getSquares("table-oponent");
}

 resetLeftShips=(leftShips) =>{

    for (ship of leftShips) {
        ship.classList.remove('ship-left-sunked');
    }
}

 quitOnClick=() =>{

    const answer = confirm("Are you sure you want to end game?");
    if (answer) {
        shoot = 0;
        randomOrPlaceYourShips = 0;
        squaresAround = [];
        currentSumShip = new Array(10).fill(0);
        winningSumShip = [4, 3, 3, 2, 2, 2, 1, 1, 1, 1];
        placeYourShips = 0;
        chosenShip = "none";
        chosenShipId = 0;
        placedShipsCount = 0;
        shipsToFind = [];
        shipsToFindO = [];
        changeButtons(true);
        resetShipsOnClick();
        document.getElementById("table-oponent").remove();
        resetLeftShips(leftShips);
        resetLeftShips(leftShipsOponent);
    }
}

 rotateShipOnClick=() =>{
    if (setDirection === "horizontal") { setDirection = "vertical" } else {
        setDirection = "horizontal"
    }
}

 chooseShip=(id)=> {
    chosenShipId = parseInt(id[2]);
    const shipsToDrag = document.querySelector(".ships-to-drag");
    if (chosenShip !== "none") {
        const chosenSquares = chosenShip.childNodes;
        for (index in chosenSquares) {
            if (index % 2 === 1) {
                chosenSquares[index].style.background = "rgb(35, 170, 163)";
            }
        }
    }

    chosenShip = shipsToDrag.querySelector("#" + id);
    const chosenSquares = chosenShip.childNodes;
    for (index in chosenSquares) {
        if (index % 2 === 1) {
            chosenSquares[index].style.background = "rgb(13, 82, 78)";
        }
    }
}

 hover=(squares, I, J)=> {
    let ok = false;
    if (chosenShip !== "none") {
        if (setDirection === "horizontal") {
            params = { dir: "horizontal", x: ++I, y: ++J }
        }
        else {
            params = { dir: "vertical", x: ++I, y: ++J }
        }
        const dxdy = createShip(params, chosenShipId);
        const sizeThatFits = sizeThatCanBePlaced(board, params, dxdy);
        if (sizeThatFits === chosenShipId) {
            const near = getNearCount(board, params, dxdy);
            if (8 * chosenShipId === near) {
                shipsToFind = placeShip(shipsToFind, board, params, dxdy);
                ok = true;
            }
        }
        if (ok) {
            I--;
            J--;
            //printBoard(board);
            placedShipsCount++;
            if (placedShipsCount === 10) {
                placeYourShips = 1;
                randomOrPlaceYourShips = 1;
            }
            if (setDirection === "horizontal") {
                for (let i = 0; i < chosenShipId; i++) {
                    squares[I][J + i].className = "ship";
                }
            }
            else {
                for (let i = 0; i < chosenShipId; i++) {
                    squares[I + i][J].className = "ship";
                }
            }
            chosenShip.classList.add("ship-left-disappeared");
            draggedShips.push(chosenShip);
            chosenShip = "none";
        }
    }
}

 hoverS=(squares) =>{
    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            squares[i][j].addEventListener("click", function () { hover(squares, i, j); }, { once: true });
        }
    }
}

 playOnClick=() =>{
    if (placeYourShips === 1) {
        turn = "player"
        drawTable(board, "player");
        squares = getSquares("table-player");
    }
    if (randomOrPlaceYourShips === 1) {
        randomOrPlaceYourShips = 0;
        changeButtons(false);
        randomOponentShips();
        leftShips = getLeftShips(".ships-left");
        leftShipsOponent = getLeftShips(".ships-left-oponent");
        playGuess("player", boardOponent, shipsToFindO, squaresO, leftShipsOponent);
    }
    else {
        alert("Place or random your ships");
    }
}

 hoverSquareColor=(square)=> {
    if (chosenShip !== "none") {

        for (let i = 0; i < chosenShipId; i++) {
            if (setDirection === "horizontal") {
                if (11 - chosenShipId > (parseInt(square.id[3]))) {
                    const squareID = "#id" + (parseInt(square.id[2])).toString() + (parseInt(square.id[3]) + i).toString();
                    if (document.querySelector(squareID).className === "default") {
                        document.querySelector(squareID).className = "hoverSquare";
                    }
                }
            } else {
                if (11 - chosenShipId > (parseInt(square.id[2]))) {
                    const squareID = "#id" + (parseInt(square.id[2]) + i).toString() + (parseInt(square.id[3])).toString();
                    if (document.querySelector(squareID).className === "default") {
                        document.querySelector(squareID).className = "hoverSquare";
                    }
                }
            }
        }
    }
}

 defaultSquareColor=(square) =>{
    if (chosenShip !== "none") {
        for (let i = 0; i < chosenShipId; i++) {
            if (setDirection === "horizontal") {
                const squareID = "#id" + (parseInt(square.id[2])).toString() + (parseInt(square.id[3]) + i).toString();
                if (11 - chosenShipId > (parseInt(square.id[3]))) {
                    if (document.querySelector(squareID).className === "hoverSquare") {
                        {
                            document.querySelector(squareID).className = "default";
                        }
                    }
                }
            } else {
                const squareID = "#id" + (parseInt(square.id[2]) + i).toString() + (parseInt(square.id[3])).toString();
                if (11 - chosenShipId > (parseInt(square.id[2]))) {
                    if (document.querySelector(squareID).className === "hoverSquare") {
                        {
                            document.querySelector(squareID).className = "default";
                        }
                    }
                }
            }
        }
    }
}

squaresD = getSquares("table-player");
hoverS(squaresD);
