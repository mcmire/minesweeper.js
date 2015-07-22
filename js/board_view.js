(function (exports) {
  "use strict";

  function BoardView(element) {
    var render = function () {
      element.clear();

      cells.forEach(function (cell) {
        var cellElement = $('<div class="cell">');
        var cellView = new CellView(cell);
        element.append(cellView.render());
      });
    };

    this.render = render;
  }

  if (!("minesweeper" in exports)) {
    exports.minesweeper = {};
  }

  minesweeper.BoardView = BoardView;
})(this);
