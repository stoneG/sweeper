var nRows = 2;
var nCols = 2;
var nMines = 1;

function Board(nRows, nCols, nMines) {
  var board = this, isMine;
  board.nRows = nRows;
  board.nCols = nCols;
  board.nMines = nMines;
  board.cells = [];
  board.locked = false;
  board.win = false;
  board.cheating = false;

  /**
   * Initializes board logic.
   */
  this.init = function() {
    board.minesLeft = board.nMines;
    board.nRows = nRows;
    board.nCols = nCols;
    board.nMines = nMines;
    board.cells = [];
    board.locked = false;
    board.win = false;
    board.cheating = false;
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
    }
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
   * Handle (1) left-click and (3) right-click events. If player sweeps a mine,
   * the board locks.
   * @returns {Undefined} if board is locked.
   */
  this.click = function(event, index) {
    var neighbors;
    if (board.locked) {
      return;
    }
    if (!board.cells[index].swept) {
      switch (event.which) {
        case 1:
          if (board.cells[index].sweep()) {
            board.locked = true;
            this.result();
            break;
          }
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
  };

  /**
   * Toggles cheat mode, which displays all mines without retribution.
   * @returns {Undefined} if board is locked.
   */
  this.cheat = function() {
    var i,
        toggle;
    if (board.locked) {
      return;
    }
    if (board.cheating) {
      toggle = 'unreveal';
      board.cheating = false;
    } else {
      toggle = 'reveal';
      board.cheating = true;
    }
    for (i = 0; i < board.mines.length; i++) {
      if (board.mines[i]) {
        board.cells[i][toggle]();
      }
    }
  };

  this.submit = function() {
    var i;
    if (board.locked) {
      return;
    }
    for (i = 0; i < board.cells.length; i++) {
      if (!board.mines[i] && !board.cells[i].swept) {
        board.locked = true;
        this.result();
        return;
      }
    }
    board.locked = true;
    board.win = true;
    this.result();
  };

  /**
   * Resets the board with new mine placement and rebuilds the HTML.
   */
  this.rebuild = function() {
    $('#result').text('');
    this.init();
    $('#grid').empty();
    this.build();
  };

  /**
   * Updates board with win/lose message
   */
  this.result = function() {
    if (board.win) {
      $('#result').text('You are the winning Sweeper!');
    } else if (board.cheating) {
      $('#result').text('Wow, how did you lose while you were cheating?!');
    } else {
      $('#result').text('Game Over, sweep elsewhere.');
    }
  };
}

function Cell(row, col, isMine) {
  var cell = this,
      mine = '\u26C2',
      flag = '\u2690';
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
   * @returns {String} if player sweeps a mine.
   */
  this.sweep = function() {
    $(cell.htmlTag).attr('id', 'clicked');
    if (cell.isMine) {
      $(cell.htmlTag).text(mine);
      return mine;
    }
    cell.displayed = cell.number || '';
    $(cell.htmlTag).addClass('colorize' + cell.displayed);
    $(cell.htmlTag).text(cell.displayed);
    cell.swept = true;
  };

  /**
   * Toggles flag on cell, then updates output on board.
   */
  this.flag = function() {
    if ($(cell.htmlTag).text() == flag) {
      cell.displayed = '';
      $(cell.htmlTag).removeClass('flag');
      $(cell.htmlTag).text('');
    } else {
      cell.displayed = flag;
      $(cell.htmlTag).addClass('flag');
      $(cell.htmlTag).text(cell.displayed);
    }
  };

  this.reveal = function() {
    if (cell.isMine) {
      $(cell.htmlTag).addClass('reveal');
    }
  };

  this.unreveal = function() {
    $(cell.htmlTag).removeClass('reveal');
  };

}

$(document).ready(function() {
  window.b = new Board(nRows, nCols, nMines);
  window.b.init();
  window.b.build();
});
