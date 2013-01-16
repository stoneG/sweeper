var nRows = 8;
var nCols = 8;
var nMines = 10;

function Board(nRows, nCols, nMines) {
  var board = this, isMine;
  board.nRows = nRows;
  board.nCols = nCols;
  board.nMines = nMines;
  board.cells = [];

  /**
   * Initializes board logic.
   */
  this.init = function() {
    board.minesLeft = board.nMines;
    var i, j;

    /**
     * Randomly assigns mines to an array index.
     *
     * @returns {Array}
     */
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

  /**
   * Gets indexes of all neighbors of a given cell.
   *
   * @param {Number} row
   *   The row index of given cell.
   * @param {Number} col
   *   The column index of given cell.
   *
   * @returns {Array} of neighbor cell indexes.
   */
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

  /**
   * Get the number of mines neighboring the given cell.
   *
   * @param {Number} row
   * @param {Number} col
   * 
   * @returns {Number}
   */
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

  /**
   * Output the <tr> and <td> elements of the board. Establish click behavior
   * and disable right clicking on <td> elements.
   */
  this.build = function() {
    var i, j, row, col;
    for (i = 0; i < board.nRows; i++) {
      row = document.createElement('tr');
      for (j = 0; j < board.nCols; j++) {
        col = document.createElement('td');
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

  /**
   * Handle click events.
   * @param {Object} event
   * @param {Number} row
   * @param {Number} col
   */
  this.click = function(event, row, col) {
    var index = row * nRows + col;
    if (!board.cells[index].locked) {
      switch (event.which) {
        case 1:
          board.cells[row * nRows + col].sweep();
          break;
        case 3:
          board.cells[row * nRows + col].flag();
          break;
      }
    }
  };
}

function Cell(row, col, isMine) {
  var cell = this,
    number = 0;
  cell.row = row;
  cell.col = col;
  cell.isMine = isMine;
  cell.displayed = '';
  cell.htmlTag = 'tr:eq(' + cell.row + ') td:eq(' + cell.col + ')';
  cell.locked = false;

  this.sweep = function() {
    var underlying;
    if (cell.isMine) {
      underlying = '\u26C2';
    } else {
      underlying = cell.number;
    }
    cell.displayed = underlying;
    $(cell.htmlTag).text(underlying);
    cell.locked = true;
  };

  this.flag = function() {
    if ($(cell.htmlTag).text() == '\u2690') {
      cell.displayed = '';
      $(cell.htmlTag).text('');
    } else {
      cell.displayed = '\u2690';
      $(cell.htmlTag).text(cell.displayed);
    }
  };
}

$(document).ready(function() {
  window.b = new Board(nRows, nCols, nMines);
  window.b.init();
  window.b.build();
});
