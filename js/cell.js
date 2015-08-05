(function (exports) {
  "use strict";

  function Cell(args) {
    var cell = this;
    var board = args.board;
    var location = { x: args.x, y: args.y };

    var reveal = function () {
      cell.isRevealed = true;
    };

    var getNumberOfAdjacentMines = function () {
      return getAdjacentMines().length;
    };

    var getAdjacentSafeCells = function () {
      var adjacentCells = cell.board.findCellsAdjacentTo(cell);

      return adjacentCells.filter(function (cell) {
        return !cell.isMine;
      });
    };

    var getAdjacentMines = function () {
      var adjacentCells = cell.board.findCellsAdjacentTo(cell);

      return adjacentCells.filter(function (cell) {
        return cell.isMine;
      });
    };

    this.board = board;
    this.location = location;
    this.isMine = args.isMine;
    this.isRevealed = false;
    this.reveal = reveal;
    this.getNumberOfAdjacentMines = getNumberOfAdjacentMines;
    this.getAdjacentSafeCells = getAdjacentSafeCells;
  }

  if (!("minesweeper" in window)) {
    exports.minesweeper = {};
  }

  minesweeper.Cell = Cell;
})(this);
