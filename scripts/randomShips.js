const board = []
const size = 10;
const boardSize = size+2;

function createEmptyBoardAndBorders() {
    for(let row=0; row<boardSize; row++) {
        const boardRow = [];
        for(let col=0; col<boardSize; col++) {
            if(col == 0 || col == 11 || row == 0 || row == 11) {
                boardRow.push(9); // create border
            } else { 
                boardRow.push(0); // create board
            }
        }
        board.push(boardRow);
    }
}

function printBoard() {
    for(let row=0; row<boardSize; row++) {
        for(let col=0; col<boardSize; col++) {
            document.getElementById("printingArea").innerHTML += board[row][col];
            document.getElementById("printingArea").innerHTML += " ";
        }
        document.getElementById("printingArea").innerHTML += "<br>";
    }
    document.getElementById("printingArea").innerHTML += "<br>";

}

function randomParameters(){
    const randomRow = Math.round(Math.random()*100) % 10+1;
    const randomCol = Math.round(Math.random()*100) % 10+1;

    let randomDirection = Math.round(Math.random()*10) % 2;

    if(randomDirection==0){
        randomDirection = "vertical";
    } else {
        randomDirection = "horizontal";
    }
    console.log(randomRow);
    console.log(randomCol);
    console.log(randomDirection);
    return {x:randomRow, y:randomCol, dir:randomDirection};
    
}

function placeNear(params) {
const dxdy = [{x:-1, y:0},{x:-1, y:1},{x:0, y:1},{x:1, y:1},{x:1, y:0},{x:1, y:-1},{x:0, y:-1},{x:-1, y:-1}];
    for(item of dxdy){
        if(board[params.x+item.x][params.y+item.y]==0){
            board[params.x+item.x][params.y+item.y]=2;
        }
            
    }
}

function placeShip(params, dxdy) {
    for(item of dxdy){
        board[params.x+item.x][params.y+item.y]=1;
    }
}

function sizeThatCanBePlaced(params, dxdy) {
    let size=0;
    for(item of dxdy){
        if(board[params.x+item.x][params.y+item.y]==9){
            return size;
        } else if (board[params.x+item.x][params.y+item.y]==0){
            size++;
        }
    }
    return size;  
}

function chooseShip(params, shipLength) {

    const dxdy1 = [{x:0, y:0}]

    const dxdy2h = [{x:0, y:0},{x:0, y:1}]
    const dxdy2v = [{x:0, y:0},{x:1, y:0}]

    const dxdy3h = [{x:0, y:0},{x:0, y:1},{x:0, y:2}]
    const dxdy3v = [{x:0, y:0},{x:1, y:0},{x:2, y:0}]

    const dxdy4h = [{x:0, y:0},{x:0, y:1},{x:0, y:2},{x:0, y:3}]
    const dxdy4v = [{x:0, y:0},{x:1, y:0},{x:2, y:0},{x:3, y:0}]

    switch(shipLength){
        case 1:
            return dxdy1;
            break;

        case 2:
            switch(params.dir){
                case "horizontal": 
                    return dxdy2h;
                break;
        
                case "vertical":
                    return dxdy2v;
                break;
            }
        case 3:
            switch(params.dir){
                case "horizontal": 
                    return dxdy3h;
                break;
        
                case "vertical":
                    return dxdy3v;
                break;
            }
        case 4:
            switch(params.dir){
                case "horizontal": 
                    return dxdy4h;
                break;
        
                case "vertical":
                    return dxdy4v;
                break;
            }
    }

}

function createRandomShips() {
    shipsPlaced=[0,0,0,0,0,0,0,0,0,0];
    shipsLengths = [4,3,3,2,2,2,1,1,1,1];

    for(i in shipsPlaced) {
        //i=0;
        console.log(shipsPlaced[i]);
        console.log(shipsLengths[i]);
    
        while(shipsPlaced[i]==0) {
            const params = randomParameters();
    
            console.log(params);
        
            const dxdy = chooseShip(params, shipsLengths[i]);
            const sizeThatFits = sizeThatCanBePlaced(params, dxdy);
    
        
            if(sizeThatFits==shipsLengths[i]){
                shipsPlaced[i]=1;
                console.log("Ship can be placed here");
                placeShip(params,dxdy);
                placeNear(params);
                
                
            } else {
                console.log("Ship cannot be placed here :( ");
            }
            console.log(shipsPlaced[i]);
    
        }
    }
}



     


createEmptyBoardAndBorders();
createRandomShips();
printBoard();
