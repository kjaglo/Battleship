const board = []
const size = 10;
const boardSize = size + 2;
let shipsToFind=[];

function createEmptyBoardAndBorders() {
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
}

function printBoard() {
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


function checkNear(params, dxdyShip) {
    around = 0;
    const dxdy = [{ x: -1, y: 0 }, { x: -1, y: 1 }, { x: 0, y: 1 }, { x: 1, y: 1 }, { x: 1, y: 0 }, { x: 1, y: -1 }, { x: 0, y: -1 }, { x: -1, y: -1 }];
    for (square of dxdyShip) {

        for (item of dxdy) {
            console.log("here", params.x + item.x + square.x, params.y + item.y + square.y)

            if (board[params.x + item.x + square.x][params.y + item.y + square.y] == 0 || board[params.x + item.x + square.x][params.y + item.y + square.y] == 9) {
                around += 1;
            }
        }
    }
    return around;
}



// function placeNear(params, dxdyShip) {
//     const dxdy = [{x:-1, y:0},{x:-1, y:1},{x:0, y:1},{x:1, y:1},{x:1, y:0},{x:1, y:-1},{x:0, y:-1},{x:-1, y:-1}];
//     for(square of dxdyShip){

//     for(item of dxdy){

//             if(board[params.x+item.x+square.x][params.y+item.y+square.y]==0 ) {
//                 board[params.x+item.x+square.x][params.y+item.y+square.y]=2;
//             } 
//         }
//     }
// }



function placeShip(params, dxdy) {
    const squares = [];        
    console.log("DYDYDYDY,", dxdy.length);

    for (item of dxdy) {
        board[params.x + item.x][params.y + item.y] = 5;
        squares.push([params.x + item.x-1,params.y + item.y-1])
    }

    switch (dxdy.length){
        case 1:
            //const ship1 = [squares],[0];
            shipsToFind.push([squares,[0]]);
        break;
        case 2:
            // const ship2 = ;
            shipsToFind.push([squares,[0,0]]);
        break;        
        case 3:
        // const ship3 = [squares],[0,0,0];
        shipsToFind.push([squares,[0,0,0]]);
    break;
    case 4:
        // const ship4 = [squares],[0,0,0,0];
        shipsToFind.push([squares,[0,0,0,0]]);
    break;
    }

}

function sizeThatCanBePlaced(params, dxdy) {
    let size = 0;
    for (item of dxdy) {
        if (board[params.x + item.x][params.y + item.y] == 9) {
            return size;
        } else if (board[params.x + item.x][params.y + item.y] == 0) {
            size++;
        }

    }
    console.log("size placed: ", size)
    return size;
}

function chooseShip(params, shipLength) {
    console.log("len: ", shipLength)

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
    console.log("ship:", dxdy.x);
    return dxdy;
}

function createRandomShips() {
    shipsPlaced = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    shipsLengths = [4, 3, 3, 2, 2, 2, 1, 1, 1, 1];

    for (i in shipsPlaced) {
        //i=0;
        //console.log(shipsPlaced[i]);
        console.log(shipsLengths[i]);

        while (shipsPlaced[i] == 0) {
            const params = randomParameters();

            console.log(params);

            const dxdy = chooseShip(params, shipsLengths[i]);
            const sizeThatFits = sizeThatCanBePlaced(params, dxdy);


            if (sizeThatFits == shipsLengths[i]) {
                console.log("fit", sizeThatFits);
                const near = checkNear(params, dxdy);
                if (8 * shipsLengths[i] == near) {
                    shipsPlaced[i] = 1;
                    console.log("Ship can be placed here");
                    placeShip(params, dxdy);
                    //placeNear(params, dxdy);
                    //printBoard();
                }

            } else {
                console.log("Ship cannot be placed here");
            }
            //console.log(shipsPlaced[i]);

        }
    }
}






createEmptyBoardAndBorders();
createRandomShips();
//printBoard();

///////////////////////////////////////////////////////////

// board:

// 0 (default) - nothing
// 1 - miss
// 2 - hit ship
// 3 - sunk ship
// 4 - near ship
// 5 - ship

const defaultSquare = 0;
const missedSquare = 1;
const hitSquare = 2;
const sunkSquare = 3;
const nearShipSquare = 4;
const shipSquare = 5;


let currentSumShip = [0,0,0,0,0,0,0,0,0,0];
// let winningSumShip = [1,1,1,1,2,2,2,3,3,4];
let winningSumShip = [4,3,3,2,2,2,1,1,1,1];

let texts = [];
let squares = [];

const createShips = function() {

    //ships 
    const ship1a = [[[0,0]],[0]];
    const ship1b = [[[0,3]],[0]];
    const ship1c = [[[2,9]],[0]];
    const ship1d = [[[2,6]],[0]];

    const ship2a = [[[9,9],[8,9]],[0,0]];
    const ship2b = [[[6,6],[6,7]],[0,0]];
    const ship2c = [[[8,0],[7,0]],[0,0]];

    const ship3a = [[[0,7],[0,8],[0,9]],[0,0,0]];
    const ship3b = [[[2,2],[3,2],[4,2]],[0,0,0]];

    const ship4 = [[[9,3],[9,4],[9,5],[9,6]],[0,0,0,0]];

    shipsToFind = [ship1a, ship1b, ship1c, ship1d, ship2a, ship2b, ship2c, ship3a, ship3b, ship4];

}

///
const getSquares = function(){

    let k = 0;
    for (let i = 0; i < 10; i++) {
        let squaresRow = [];
        for (let j = 0; j < 10; j++) {
            squaresRow.push(document.getElementsByTagName('TD')[k]);
            k++;
    
        }
        squares.push(squaresRow);
    }
}
    
///  
const getText = function(){
    for (let m = 0; m < 10; m++) {
        texts.push(document.getElementsByTagName('li')[m]);
    }
}

///
const showShips = function(td, i, j) {
    i++;
    j++;
    switch(board[i-1][j]) {

        case 1: td.className="miss";
        break;

        case 2: td.className="hit";
        break;

        case 3: td.className="hit-and-sunk";
        break; 

        case 4: td.className="near";
        break; 

        case 5: td.className="ship";
        break;  

        default: td.className="default";
        break;  
    }
}

///
const dontShowShips = function(td) {
    td.className="default";
}

///
const drawTable = function() {

    let body = document.getElementsByTagName('body')[0];

    let table = document.getElementsByTagName('table')[0];

    //table.setAttribute('border', '1');
    
    let tbdy = document.createElement('tbody');
    
    for (let i = 0; i < 11; i++) {

        let tr = document.createElement('tr');

        let th = document.createElement('th');
    
        if(i==0) {
         //th.appendChild(document.createTextNode('X'));
         }

         else {
         th.appendChild(document.createTextNode(String.fromCharCode(65+i-1)));// Rownames: ASCII A-J
         }

         tr.appendChild(th);

        for (let j = 0; j < 10; j++) {

            if(i==0) {
                let th = document.createElement('th');
                th.appendChild(document.createTextNode(j+1)); // Colnames: 1-10
                tr.appendChild(th);
            }

            else {
                let td = document.createElement('td');

                //td.appendChild(document.createTextNode("i"+(i-1)+" j"+j)); 
                
                showShips(td, i, j);
                //dontShowShips(td);

                tr.appendChild(td);
            }
        }

        tbdy.appendChild(tr);
    }

    table.appendChild(tbdy);

    body.appendChild(table)
}

///
const up = function(i,j) {
    i++;
    j++;
    if(board[i-1][j]!=shipSquare) {
        board[i-1][j]=nearShipSquare;
    }
}

const leftup = function(i,j) {    i++;
    j++;
    if(board[i-1][j-1]!=shipSquare) {
        board[i-1][j-1]=nearShipSquare;
    }
}

const left = function(i,j) {
    i++;
    j++;
    if(board[i][j-1]!=shipSquare){
        board[i][j-1]=nearShipSquare;
    }
}

const leftdown = function(i,j) {
    i++;
    j++;
    if(board[i+1][j-1]!=shipSquare){
        board[i+1][j-1]=nearShipSquare;
    }
}

const down = function(i,j) {
    i++;
    j++;
    if(board[i+1][j]!=shipSquare) {
        board[i+1][j]=nearShipSquare;
    }
}

const rightdown = function(i,j) {
    i++;
    j++;
    if(board[i+1][j+1]!=shipSquare) {
        board[i+1][j+1]=nearShipSquare;
    }
}

const right = function(i,j) {
    i++;
    j++;
    if(board[i][j+1]!=shipSquare) {
        board[i][j+1]=nearShipSquare;
    }
}

const rightup = function(i,j) {
    i++;
    j++;
    if(board[i-1][j+1]!=shipSquare) {
        board[i-1][j+1]=nearShipSquare;
    }
}

///
const createNear = function() {
    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            if(board[i+1][j+1]==shipSquare){
                if(i==0){
                    if(j==0){
                        down(i,j);
                        right(i,j);
                        rightdown(i,j);
                    }
                    else if(j==9){
                        down(i,j);
                        left(i,j);
                        leftdown(i,j);                       
                    }
                    else {
                        left(i,j);
                        leftdown(i,j); 
                        down(i,j);
                        rightdown(i,j);
                        right(i,j);
                    } //end else
                } //end if i == 0
                else if (i == 9) {
                    right(i,j);
                    rightup(i,j);
                    up(i,j);
                    leftup(i,j);
                    left(i,j);
                } //end if i == 9
                else if (j == 0) {
                    down(i,j);
                    rightdown(i,j);
                    right(i,j);
                    rightup(i,j);
                    up(i,j);
                } //end if j == 0      
                else if (j == 9) {
                    up(i,j);
                    leftup(i,j);
                    left(i,j);
                    leftdown(i,j);                       
                    down(i,j);
                } //end if j == 9
                else {
                    left(i,j);
                    leftdown(i,j);                       
                    down(i,j);
                    rightdown(i,j);
                    right(i,j);
                    rightup(i,j);
                    up(i,j);
                    leftup(i,j);

                } //end else        
            }
        }
    }
}

///
function currentHitSumAll() {
    for(let i=0; i<shipsToFind.length; i++) {
        if(winningSumShip[i]!=currentSumShip[i]) {
            return false;
        }
    }
    return true;

}

///
function currentHitSumShip(i) {
    let sum=0;
    for(let k=0; k<shipsToFind[i][0].length; k++) {
        sum=sum+shipsToFind[i][1][k];
    }
    return sum;
    
}

///
function sunkShip(i) {
    for(let k=0; k<shipsToFind[i][0].length; k++) {

            const row = shipsToFind[i][0][k][0];
            const col = shipsToFind[i][0][k][1];

            squares[row][col].className="hit-and-sunk"
    }
}

///
const winMessage = function() {


    let body = document.getElementsByTagName('body')[0];
    let div = document.createElement('div');
    div.innerHTML = "<h1>YOU WON!!!</h1>";

    body.appendChild(div);
}

///
function hitShip(I, J) {

    const row = I;
    const col = J;

    squares[row][col].className = "hit";
    board[row+1][col+1] = hitSquare;


    for(let i=0; i<shipsToFind.length; i++) {
        for(let j=0; j<shipsToFind[i].length; j++) {
            for(let k=0; k<shipsToFind[i][j].length; k++) {
                if(shipsToFind[i][j][k][0]==row && shipsToFind[i][j][k][1]==col) {
                    shipsToFind[i][1][k] = 1;
                    currentSumShip[i]=currentSumShip[i] + 1; //add hit square

                    if(currentHitSumShip(i)==shipsToFind[i][j].length) {
                        sunkShip(i);
                        texts[i].className = "crossed-text";
                    }
                    if(currentHitSumAll()) {
                        winMessage();
                    }
                }
            }
        }
    }
}

///
const missShip = function(i, j) {
    
    squares[i][j].className = "miss";
    board[i+1][j+1] = missedSquare; 

}

///
const playGuess = function() {
    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {

            if(board[i+1][j+1]==shipSquare) {
                squares[i][j].addEventListener("click", function() {hitShip(i, j);}, {once : true});

            }
            else if(board[i+1][j+1]== defaultSquare|| board[i+1][j+1]==nearShipSquare) {
                squares[i][j].addEventListener("click", function() {missShip(i, j);}, {once : true});

            }     
        }
    }
}

// createRandomShips();
// createNear();
 drawTable();
getSquares();
getText();
 playGuess();

 console.log(shipsToFind[0][0][0]);
 const ship4 = [[[[9,3],[9,4],[9,5],[9,6]],[0,0,0,0]]];
 console.log(ship4[0][0][0]);
 console.log(winningSumShip);
 console.log(currentSumShip);

