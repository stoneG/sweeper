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
     * @returns {Array}
     */
    board.mines = function() {
      var mines = [],
          position,
          attributes,
          index;
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
        index = i * nRows + j;
        isMine = board.mines[index] || false;
        board.cells[index] = new Cell(i, j, isMine);
        if (!isMine) {
          attributes = board.getCellAttributes(i, j);
          board.cells[index].number = attributes.number;
          board.cells[index].neighbors = attributes.neighbors;
        } else {
          board.cells[index].number = -1;
        }
      }
    }
  };

  /**
   * Gets indexes of all neighbors of a given cell.
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
   * Get the indexes and the number of mines neighboring the given cell.
   * @returns {Object}
   */
  this.getCellAttributes = function(row, col) {
    var neighbors = this.getNeighbors(row, col),
      number = 0;
    for (var i = 0; i < neighbors.length; i++) {
      if (board.mines[neighbors[i]]) {
        number++;
      }
    }
    return {
      'neighbors': neighbors,
      'number': number
    };
  };

  /**
   * Output the <tr> and <td> elements of the board. Establish click behavior
   * on <td> elements and disable right click default behavior on the board.
   */
  this.build = function() {
    var i, j, row, col;
    for (i = 0; i < board.nRows; i++) {
      row = document.createElement('tr');
      for (j = 0; j < board.nCols; j++) {
        col = document.createElement('td');
        $(col).mousedown(function(event) {
          var cellRow = $(this).parent().prevAll().length;
          var cellCol = $(this).prevAll().length; 
          board.click(event, cellRow * nRows + cellCol);
        });
        $(row).append(col)
      }
      $('#grid').append(row)
    }
    $('#grid').on("contextmenu", false);
  };

  /**
   * Handle (1) left-click and (3) right-click events.
   */
  this.click = function(event, index) {
    var neighbors;
    if (!board.cells[index].swept) {
      switch (event.which) {
        case 1:
          board.cells[index].sweep();
          if (board.cells[index].number === 0) {
            neighbors = board.cells[index].neighbors;
            for (var i = 0; i < neighbors.length; i++) {
              this.click(event, neighbors[i]);
            }
          }
          break;
        case 3:
          board.cells[index].flag();
          break;
      }
    }
  }

  this.rebuild = function() {
    board.cells = [];
    this.init();
    $('#grid').empty();
    this.build();
  }
};

function Cell(row, col, isMine) {
  var cell = this;
  cell.number = 0;
  cell.neighbors = [];
  cell.row = row;
  cell.col = col;
  cell.isMine = isMine;
  cell.displayed = '';
  cell.htmlTag = 'tr:eq(' + cell.row + ') td:eq(' + cell.col + ')';
  cell.swept = false;

  /**
   * Reveals underlying number or mine of a cell, then updates output on board.
   * Finally locks cell to prevent further changes.
   */
  this.sweep = function() {
    var underlying;
    if (cell.isMine) {
      underlying = '\u26C2';
    } else {
      underlying = cell.number;
    }
    cell.displayed = underlying;
    $(cell.htmlTag).text(underlying);
    cell.swept = true;
  };

  /**
   * Toggles flag on cell, then updates output on board.
   */
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
