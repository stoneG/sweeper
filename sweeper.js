var nRows = 8;
var nCols = 8;
var nMines = 10;

function Board(nRows, nCols, nMines) {
    var board = this, isMine;
    board.nRows = nRows;
    board.nCols = nCols;
    board.nMines = nMines;
    board.cells = [];

    this.init = function() {
        board.minesLeft = board.nMines;
        var i, j;
        board.mines = function() {
            var mines = [], position;
            for (i = 0; i < board.nMines; i++) {
                position = Math.floor(Math.random() * board.nCols * board.nRows);
                if (mines[position]) {
                    i--;
                } else {
                    mines[position] = true;
                }
            }
            return mines;
        }();
        for (i = 0; i < board.nRows; i++) {
            board.cells[i] = [];
            for (j = 0; j < board.nCols; j++) {
                isMine = board.mines[i * nRows + j] || false;
                board.cells[i][j] = new Cell(i, j, isMine);
                if (!isMine) {
                    board.cells[i][j].number = board.getNumber(i, j);
                }
            }
        }
    };

    this.getNeighbors = function(row, col) {
        var neighbors = [],
            i, j;
        for (i = Math.max(row-1,0); i < Math.min(row+2, board.nRows); i++) {
            for (j = Math.max(col-1,0); j < Math.min(col+2, board.nCols); j++) {
                if ((i != row) || (j != col)) {
                    neighbors.push(i * nRows + j);
                }
            }
        }
        return neighbors;
    };

    this.getNumber = function(row, col) {
        var neighbors = this.getNeighbors(row, col),
            number = 0;
        for (var i = 0; i < neighbors.length; i++) {
            if (board.mines[neighbors[i]]) {
                number++;
            }
        }
        return number;
    };
}

function Cell(row, col, isMine) {
    var cell = this,
        number = 0;
    cell.row = row;
    cell.col = col;
    cell.isMine = isMine;

    /*this.sweep = function() {
        if (cell.isMine)
            // TODO show bomb
        else
            // TODO show number
    };*/
}
