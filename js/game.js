(function () {
  var size = 9;
  var boardElement = document.querySelector("#board");
  var board = minesweeper.generateBoard({ size: size, numberOfMines: 10 });
  var boardView = new minesweeper.BoardView({
    bodyElement: document.body,
    element: boardElement,
    model: board,
    cellSize: 50
  });

  boardView.activate();
  boardView.render();
})();
