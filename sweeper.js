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
            for (j = 0; j < board.nCols; j++) {
                isMine = board.mines[i * nRows + j] || false;
                board.cells[i * nRows + j] = new Cell(i, j, isMine);
                if (!isMine) {
                    board.cells[i * nRows + j].number = board.getNumber(i, j);
                } else {
                    board.cells[i * nRows + j].number = -1;
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

    this.draw = function() {
        var i, j, row, col;
        for (i = 0; i < board.nRows; i++) {
            row = document.createElement('tr');
            for (j = 0; j < board.nCols; j++) {
                col = document.createElement('td');
                /* if (board.cells[i * nRows + j].isMine) {
                    tableHTML += 'b';
                } else {
                    tableHTML += board.cells[i * nRows + j].number;
                }*/
                $(col).mousedown(function(event) {
                    event.preventDefault();
                    var cellRow = $(this).parent().prevAll().length;
                    var cellCol = $(this).prevAll().length; 
                    board.click(event, cellRow, cellCol);
                });
                $(col).on("contextmenu", false);
                $(row).append(col)
            }
            $('#grid').append(row)
        }
    };

    this.click = function(event, row, col) {
        event.preventDefault();
        switch (event.which) {
            case 1:
                board.cells[row * nRows + col].sweep();
                break;
            case 2:
                break;
            case 3:
                board.cells[row * nRows + col].flag();
        }
        event.preventDefault();
        return false;
    };
}

function Cell(row, col, isMine) {
    var cell = this,
        number = 0;
    cell.row = row;
    cell.col = col;
    cell.isMine = isMine;

    this.sweep = function() {
        var underlying;
        if (cell.isMine) {
            underlying = '\u26C2';
        } else {
            underlying = cell.number;
        }
        $('tr:eq(' + cell.row + ') td:eq(' + cell.col + ')').text(underlying);
    };

    this.flag = function() {
        $('tr:eq(' + cell.row + ') td:eq(' + cell.col + ')').text('\u2690');
    };
}

$(document).ready(function() {
        window.b = new Board(nRows, nCols, nMines);
        window.b.init();
        window.b.draw();
});
