class ChessBoard {
    constructor(rows, columns) {
        this.rows = rows;
        this.columns = columns;
        this.queenPos = [];
        this.kingPos = [];
    }

    // KingPos and QueenPos are both arrays of length 2,
    // first position is the column, second pos is the row
    isKingThreatened(kingPos, queenPos) {
        if (kingPos[0] == queenPos[0]) { // checking column
            return true;
        } else if (kingPos[1] == queenPos[1]) {  // checking row
            return true;
        } else {  // check diagonals next
            let colDiff = Math.abs(kingPos[0] - queenPos[0]);
            let rowDiff = Math.abs(kingPos[1] - queenPos[1]);
            if (colDiff == rowDiff) {
                return true;
            }
        }
        return false;
    }
}

let board;
function generateBoard() {
    clearBoard();
    let rows = document.getElementById("rows").value;
    let cols = document.getElementById("columns").value;
    if (rows <= 0 || cols <= 0) {
        alert("Cannot have 0 or less columns or rows!");
        clearBoard();
        return;
    }
    board = new ChessBoard(rows, cols);

    let boardElement = document.getElementById("chessboard");
    for (let x = 0; x < rows; x++) {
        let row = boardElement.insertRow();
        for (let y = 0; y < cols; y++) {
            let newCell = row.insertCell();
            newCell.id = `${y},${x}`;
            newCell.setAttribute("ondragover", "allowDrop(event)");
            newCell.setAttribute("ondrop", "drop(event)");
            // if odd cell, color it black
            if ((x + y + 1) % 2 == 0) {
                newCell.className = 'blackSquare';
            }
        }
    }
}

// function resetBoard() {
//     if (window.confirm("Are you sure you want to reset the board?")) {
//         clearBoard();
//     }
// }

function clearBoard() {
    document.getElementById("chessboard").innerHTML = "";
    document.getElementById("outputText").innerHTML = "";
}

function kingInCheck() {
    document.getElementById("outputText").innerHTML = "";
    let kingPiece = document.getElementById("kingPiece");
    let queenPiece = document.getElementById("queenPiece");

    let piecePlaced = true;
    if (kingPiece.parentElement.className == 'pieceSquare') {
        alert("Please place the king on the board!");
        piecePlaced = false;
    }
    if (queenPiece.parentElement.className == 'pieceSquare') {
        alert("Please place the queen on the board!");
        piecePlaced = false;
    }
    if (!piecePlaced) {
        return;
    }

    // Calculate King Coordinates
    let kingSquareId = document.getElementById(kingPiece.parentElement.id).id;
    let kingCol = parseInt(kingSquareId.split(",")[0]);
    let kingRow = parseInt(kingSquareId.split(",")[1]);
    let kingCoords = [kingCol, kingRow];

    // Calculate Queen Coordinates
    let queenSquareId = document.getElementById(queenPiece.parentElement.id).id;
    let queenCol = parseInt(queenSquareId.split(",")[0]);
    let queenRow = parseInt(queenSquareId.split(",")[1]);
    let queenCoords = [queenCol, queenRow];

    if (kingSquareId == queenSquareId || kingSquareId == "queenPiece" || queenSquareId == "kingPiece") {
        alert("King and Queen cannot be on the same square!");
        return;
    }

    if (board.isKingThreatened(kingCoords, queenCoords)) {
        document.getElementById("outputText").innerHTML = "<strong>King is in check!</strong>";
    } else {
        document.getElementById("outputText").innerHTML = "King is <strong>NOT</strong> in check.";
    }
}

// Drag n Drop Event Functions
function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData("text/plain", ev.target.id);
}

function drop(ev) {
    let data = ev.dataTransfer.getData("text/plain");
    ev.target.appendChild(document.getElementById(data));
    ev.preventDefault();
}
