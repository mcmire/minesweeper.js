(function (exports) {
  "use strict";

  function generateBoard(args) {
    var size = args.size;
    var numberOfMines = args.numberOfMines;
    var totalNumberOfCells = size * size;
    var board = new minesweeper.Board({ size: size });
    var mineLocations = generateMineLocations(
      numberOfMines,
      totalNumberOfCells
    );

    addCells(board, mineLocations, size);

    return board;
  }

  function generateMineLocations(numberOfMines, totalNumberOfCells) {
    var mineLocations = [];

    for (var i = 0; mineLocations.length < numberOfMines; i++) {
      var mineLocation = Math.floor(Math.random() * totalNumberOfCells);

      if (mineLocations.indexOf(mineLocation) === -1) {
        mineLocations.push(mineLocation);
      }
    }

    return mineLocations;
  }

  function addCells(board, mineLocations, size) {
    for (var y = 0; y < size; y++) {
      for (var x = 0; x < size; x++) {
        board.addCell({
          x: x,
          y: y,
          isMine: isMineAtLocation(x, y, mineLocations, size)
        });
      }
    }
  }

  function isMineAtLocation(x,y, mineLocations, size) {
    return mineLocations.indexOf((y * size) + x) !== -1;
  }

  if (!("minesweeper" in window)) {
    exports.minesweeper = {};
  }

  minesweeper.generateBoard = generateBoard;
})(this);
