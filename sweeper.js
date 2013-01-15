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

        board.mines = function() {
            var mines = [], position;
            for (var i = 0; i < board.nMines; i++) {
                position = Math.floor(Math.random() * board.nCols * board.nRows);
                if (mines[position])
                    i--;
                else
                    mines[position] = true;
            };
            return mines;
        }();

        for (var i = 0; i < board.nRows; i++) {
            board.cells[i] = []
            for (var j = 0; j < board.nCols; j++) {
                isMine = board.mines[i * nRows + j] || false;
                board.cells[i][j] = new Cell(i, j, isMine);
                if (!isMine)
                    board.cells[i][j].number = board.get_number(i, j)
            };
        };
    };

    this.get_number(row, col) {
        // TODO calculate cell's number
    };
}

function Cell(row, col, isMine) {
    var cell = this, number;
    cell.row = row;
    cell.col = col;
    cell.isMine = isMine;

    this.sweep = function() {
        if (cell.isMine)
            // TODO show bomb
        else
            // TODO show number
    };
}
