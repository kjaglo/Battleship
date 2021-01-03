let board = []

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

let shipsToFind=[];

let currentSumShip = [0,0,0,0,0,0,0,0,0,0];
let winningSumShip = [1,1,1,1,2,2,2,3,3,4];


let texts = [];
let squares = [];
let buttons = [];

///
const createEmptyBoard = function() {
    for (let i = 0; i < 10; i++) {
        const row = [];
        for (let j = 0; j < 10; j++) {
            row.push(0);
        }
        board.push(row);
    }
}

///
const printBoard = function() {
    for (let i = 0; i < 10; i++) {
        
        console.log(board[i]);
        
    }

}

///
const createRandomShips = function() {

    //ships
    board[0][0]=shipSquare;

    board[0][3]=shipSquare;

    board[2][9]=shipSquare;

    board[2][6]=shipSquare;


    board[9][9]=shipSquare;
    board[8][9]=shipSquare;

    board[6][6]=shipSquare;
    board[6][7]=shipSquare;

    board[8][0]=shipSquare;
    board[7][0]=shipSquare;

    board[0][7]=shipSquare;
    board[0][8]=shipSquare;
    board[0][9]=shipSquare;
    
    board[2][2]=shipSquare;
    board[3][2]=shipSquare;
    board[4][2]=shipSquare;

    board[9][3]=shipSquare;
    board[9][4]=shipSquare;
    board[9][5]=shipSquare;
    board[9][6]=shipSquare;

 
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
const getButtons = function(){
    for (let m = 0; m < 7; m++) {
        buttons.push(document.getElementsByTagName('button')[m]);
    }
}

///
const showShips = function(td, i, j) {
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

                td.appendChild(document.createTextNode("i"+(i-1)+" j"+j)); 
                
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
    if(board[i-1][j]!=shipSquare) {
        board[i-1][j]=nearShipSquare;
        squares[i-1][j].className="near";
    }
}

const leftup = function(i,j) {
    if(board[i-1][j-1]!=shipSquare) {
        board[i-1][j-1]=nearShipSquare;
        squares[i-1][j-1].className="near";

    }
}

const left = function(i,j) {
    if(board[i][j-1]!=shipSquare){
        board[i][j-1]=nearShipSquare;
        squares[i][j-1].className="near";

    }
}

const leftdown = function(i,j) {
    if(board[i+1][j-1]!=shipSquare){
        board[i+1][j-1]=nearShipSquare;
        squares[i+1][j-1].className="near";

    }
}

const down = function(i,j) {
    if(board[i+1][j]!=shipSquare) {
        board[i+1][j]=nearShipSquare;
        squares[i+1][j].className="near";

    }
}

const rightdown = function(i,j) {
    if(board[i+1][j+1]!=shipSquare) {
        board[i+1][j+1]=nearShipSquare;
        squares[i+1][j+1].className="near";

    }
}

const right = function(i,j) {
    if(board[i][j+1]!=shipSquare) {
        board[i][j+1]=nearShipSquare;
        squares[i][j+1].className="near";

    }
}

const rightup = function(i,j) {
    if(board[i-1][j+1]!=shipSquare) {
        board[i-1][j+1]=nearShipSquare;
        squares[i-1][j+1].className="near";

    }
}

///
const createNear = function() {
    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            if(board[i][j]==shipSquare){
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
                    if(j==0) {
                        right(i,j);
                        rightup(i,j);
                        up(i,j);
                    }
                    else if(j==9) {
                        up(i,j);
                        leftup(i,j);
                        left(i,j);
                    }
                    else{
                    right(i,j);
                    rightup(i,j);
                    up(i,j);
                    leftup(i,j);
                    left(i,j);
                    }
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
    board[row][col] = hitSquare;


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
    board[i][j] = missedSquare; 

}

let shipsOne = 0;
let shipsTwo = 0;
let shipsThree = 0;
let shipsFour = 0;



///
const sumAllShips = function(){
    if(shipsOne+shipsTwo+shipsThree+shipsFour==10){
        let body = document.getElementsByTagName('body')[0];
        let div = document.createElement('div');
        div.innerHTML = "<h1>YOU PLACED ALL SHIPS!!!</h1>";
    
        body.appendChild(div);}
        
}

const chooseShip = function(chosenShipId, i,j) {
    console.log("SWITCH3:", chosenShipId);
    square = squares[i][j];
    switch(chosenShipId){
        case "ship1":
            chosenShipId="";

            if(shipsOne<4) {
                if(square.className == "default")
                {
                    texts[shipsOne].className = "crossed-text";
                square.className = "ship";

                board[i][j]=shipSquare;
                shipsOne++;
                createNear();
            }
            }
            break;
        case "ship2v":
            if(shipsTwo<3) {
                if(i<=8){

                if(square.className == "default"&&squares[i+1][j].className == "default")
                {
                    texts[4+shipsTwo].className = "crossed-text";
                    square.className = "ship";
                    squares[i+1][j].className = "ship";

                board[i][j]=shipSquare;
                board[i+1][j]=shipSquare;
                shipsTwo++;
                createNear();
            }
            }
            }
            break;
            case "ship2h":
                if(shipsTwo<3) {
                    if(j<=8){
                    if(square.className == "default"&&squares[i][j+1].className == "default")
                    {
                        texts[4+shipsTwo].className = "crossed-text";
                        square.className = "ship";
                        squares[i][j+1].className = "ship";
    
                    board[i][j]=shipSquare;
                    board[i][j+1]=shipSquare;
                    shipsTwo++;
                    createNear();
                }
                }
            }
                break;

                case "ship3v":
                    if(shipsThree<2) {
                        if(i<=7){

                        if(square.className == "default"&&squares[i+1][j].className == "default"&&squares[i+2][j].className == "default")
                        {
                            texts[7+shipsThree].className = "crossed-text";
                            square.className = "ship";
                            squares[i+1][j].className = "ship";
                            squares[i+2][j].className = "ship";
        
                        board[i][j]=shipSquare;
                        board[i+1][j]=shipSquare;
                        board[i+2][j]=shipSquare;
                        shipsThree++;
                        createNear();
                    }
                    }
                    }
                    break;
                    case "ship3h":
                        if(shipsThree<2) {
                            if(j<=7){
    
                            if(square.className == "default"&&squares[i][j+1].className == "default"&&squares[i][j+2].className == "default")
                            {
                                texts[7+shipsThree].className = "crossed-text";
                                square.className = "ship";
                                squares[i][j+1].className = "ship";
                                squares[i][j+2].className = "ship";
            
                            board[i][j]=shipSquare;
                            board[i][j+1]=shipSquare;
                            board[i][j+2]=shipSquare;
                            shipsThree++;
                            createNear();
                        }
                        }
                        }
                        break;
                        case "ship4v":
                            if(shipsFour<1) {
                                if(i<=6){
        
                                if(square.className == "default"&&squares[i+1][j].className == "default"&&squares[i+2][j].className == "default"&&squares[i+3][j].className == "default")
                                {
                                    texts[9].className = "crossed-text";
                                    square.className = "ship";
                                    squares[i+1][j].className = "ship";
                                    squares[i+2][j].className = "ship";
                                    squares[i+3][j].className = "ship";
                
                                board[i][j]=shipSquare;
                                board[i+1][j]=shipSquare;
                                board[i+2][j]=shipSquare;
                                board[i+3][j]=shipSquare;
                                shipsFour++;
                                createNear();
                            }
                            }
                            }
                            break;
                            case "ship4h":
                                if(shipsFour<1) {
                                    if(j<=6){
            
                                    if(square.className == "default"&&squares[i][j+1].className == "default"&&squares[i][j+2].className == "default"&&squares[i][j+3].className == "default")
                                    {
                                        texts[9].className = "crossed-text";
                                        square.className = "ship";
                                        squares[i][j+1].className = "ship";
                                        squares[i][j+2].className = "ship";
                                        squares[i][j+3].className = "ship";
                    
                                    board[i][j]=shipSquare;
                                    board[i][j+1]=shipSquare;
                                    board[i][j+2]=shipSquare;
                                    board[i][j+3]=shipSquare;

                                    shipsFour++;
                                    createNear();
                                }
                                }
                                }
                                break;
                                default:
                                    console.log("No clicked!");
                                    break;
        }
        console.log(shipsOne, shipsTwo, shipsThree, shipsFour);
                sumAllShips();


}
///
let chosenBtn=buttons[0];
function chooseSquare(buttonId) {
    //const buttonId=button.id;
//     if(chosenBtn!=button)
// {
// chosenBtn.removeEventListener("click", function() {chooseSquare(buttons[m]);}, {once : true});
// chosenBtn=button;
// }
    console.log("ID: ", buttonId);
    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {

            
     
                squares[i][j].addEventListener("click", function() {chooseShip(buttonId, i, j);});
                //button.className="ship-btn-clicked";
            
            
        }
    }
}
///
const playPlaceShips = function() {
    //let chosenShip = document.getElementById("ship2h");
               for (let m = 0; m < 7; m++) {
                   if(buttons[m].className!="ship-btn-clicked"){
        buttons[m].addEventListener("click", function() {chooseSquare(buttons[m]);}, {once : true});
    }
}
   
}


function clickBtn(id){
console.log("clicked");

console.log(id);

}

createEmptyBoard();
//createRandomShips();
drawTable();
getSquares();
getText();
getButtons();
//console.log(buttons);
playPlaceShips();
