(function (exports) {
  "use strict";

  function Cell(args) {
    var me = this;
    var board = args.board;
    var x = args.x;
    var y = args.y;

    var encounter = function () {
      board.encounterCell(me);
    };

    var reveal = function () {
      me.isRevealed = true;
    };

    var isSafe = function () {
      return me.getNumberOfAdjacentMines() === 0;
    };

    var getNumberOfAdjacentMines = function () {
      return getAdjacentMines().length;
    };

    var getAdjacentNonMines = function () {
      var adjacentCells = me.board.findCellsAdjacentTo(me);

      return adjacentCells.filter(function (cell) {
        return !cell.isMine;
      });
    };

    var getAdjacentMines = function () {
      var adjacentCells = me.board.findCellsAdjacentTo(me);

      return adjacentCells.filter(function (cell) {
        return cell.isMine;
      });
    };

    me.board = board;
    me.x = x;
    me.y = y;
    me.isMine = args.isMine;
    me.isRevealed = false;
    me.encounter = encounter;
    me.reveal = reveal;
    me.isSafe = isSafe;
    me.getNumberOfAdjacentMines = getNumberOfAdjacentMines;
    me.getAdjacentNonMines = getAdjacentNonMines;
  }

  if (!("minesweeper" in window)) {
    exports.minesweeper = {};
  }

  minesweeper.Cell = Cell;
})(this);
