(function (exports) {
  "use strict";

  function generateBoard(args) {
    var size = args.size;
    var numberOfMines = args.numberOfMines;

    var getTotalNumberOfCells = function () {
      return (size * size);
    };

    var generateMineLocations = function () {
      var mineLocations = [];

      for (var i = 0; mineLocations.length < numberOfMines; i++) {
        var mineLocation = Math.floor(Math.random() * getTotalNumberOfCells());

        if (mineLocations.indexOf(mineLocation) === -1) {
          mineLocations.push(mineLocation);
        }
      }

      return mineLocations;
    };

    var addCells = function (board, mineLocations) {
      for (var y = 0; y < size; y++) {
        for (var x = 0; x < size; x++) {
          board.addCell({
            x: x,
            y: y,
            isMine: isMineAtLocation(mineLocations, x, y)
          });
        }
      }
    };

    var isMineAtLocation = function (mineLocations, x, y) {
      return mineLocations.indexOf((y * size) + x) !== -1;
    };

    var board = new minesweeper.Board();
    var mineLocations = generateMineLocations();
    addCells(board, mineLocations);

    return board;
  }

  if (!("minesweeper" in window)) {
    exports.minesweeper = {};
  }

  minesweeper.generateBoard = generateBoard;
})(this);
