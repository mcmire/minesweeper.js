(function (exports) {
  "use strict";

  function Board() {
    var board = this;
    var cells = [];

    var addCell = function (givenArgs) {
      var args = _.extend({}, givenArgs, { board: board });
      board.cells.push(new minesweeper.Cell(args));
    };

    var encounterCell = function (cell) {
      if (cell.isMine) {
        _.invoke(board.cells, "reveal");
      } else {
        revealCellAndSurroundingSafeArea(cell);
      }
    };

    var revealCellAndSurroundingSafeArea = function (cell) {
      if (!cell.isRevealed) {
        cell.reveal();

        if (!cell.isNearMine()) {
          cell.getAdjacentSafeCells().forEach(function (adjacentCell) {
            revealCellAndSurroundingSafeArea(adjacentCell);
          });
        }
      }
    };

    var findCellsAdjacentTo = function (cell) {
      var x = cell.x, y = cell.y;
      var adjacentCells = [
        findCell(x - 1, y - 1),
        findCell(x, y - 1),
        findCell(x + 1, y - 1),
        findCell(x - 1, y),
        findCell(x + 1, y),
        findCell(x - 1, y + 1),
        findCell(x, y + 1),
        findCell(x + 1, y + 1)
      ];

      return adjacentCells.filter(function (cell) { return cell; });
    };

    var findCell = function (x, y) {
      return _.find(board.cells, function (cell) {
        return cell.x === x && cell.y === y;
      });
    };

    this.cells = cells;
    this.addCell = addCell;
    this.encounterCell = encounterCell;
    this.findCellsAdjacentTo = findCellsAdjacentTo;
  }

  if (!("minesweeper" in window)) {
    exports.minesweeper = {};
  }

  minesweeper.Board = Board;
})(this);
