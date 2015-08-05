(function () {
  var size = 9;
  var cellViewCollection = new minesweeper.ViewCollection(minesweeper.CellView);
  var boardElement = document.querySelector("#board");
  var board = minesweeper.generateBoard({ size: size, numberOfMines: 10 });
  var boardView = new minesweeper.BoardView({
    cellViewCollection: cellViewCollection,
    element: boardElement,
    model: board,
    size: size
  });

  boardView.activate();
  boardView.render();
})();
