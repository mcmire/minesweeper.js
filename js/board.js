(function (exports) {
  "use strict";

  function Board(args) {
    var me = this;
    var size = args.size;
    var cells = [];
    var rows = [];

    var addCell = function (args) {
      var cell = new minesweeper.Cell({
        board: me,
        x: args.x,
        y: args.y,
        isMine: args.isMine
      });

      cells.push(cell);

      if (!(args.y in rows)) {
        rows[args.y] = { cells: [] };
      }
      rows[args.y].cells[args.x] = cell;
    };

    var encounterCell = function (cell) {
      if (cell.isMine) {
        _.invoke(cells, "reveal");
      } else {
        revealCellAndSurroundingSafeArea(cell);
      }
    };

    var revealCellAndSurroundingSafeArea = function (cell) {
      if (!cell.isRevealed) {
        cell.reveal();

        if (cell.isSafe()) {
          cell.getAdjacentNonMines().forEach(function (adjacentCell) {
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

      return adjacentCells.filter(function (cell) {
        return cell !== undefined;
      });
    };

    var findCell = function (x, y) {
      return _.find(cells, function (cell) {
        return cell.x === x && cell.y === y;
      });
    };

    me.size = size;
    me.rows = rows;
    me.addCell = addCell;
    me.encounterCell = encounterCell;
    me.findCellsAdjacentTo = findCellsAdjacentTo;
  }

  if (!("minesweeper" in window)) {
    exports.minesweeper = {};
  }

  minesweeper.Board = Board;
})(this);
