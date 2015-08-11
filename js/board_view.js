(function (exports) {
  "use strict";

  function BoardView(args) {
    var me = this;
    var bodyElement = args.bodyElement;
    var element = args.element;
    var board = args.model;
    var cellSize = args.cellSize;

    var activate = function () {
      rowViewCollection.activate();
    };

    var render = function () {
      element.style.width = (cellSize * board.size) + "px";
      element.style.height = (cellSize * board.size) + "px";

      element.innerHTML = "";
      rowViewCollection.appendTo(element);
      rowViewCollection.render();
    };

    var endGame = function () {
      me.render();
      rowViewCollection.deactivate();
      bodyElement.classList.add("game-over");
    };

    var rowViewCollection = new minesweeper.ViewCollection({
      parentView: me,
      models: board.rows,
      viewClass: minesweeper.RowView,
      buildElement: function () {
        var element = document.createElement("div");
        element.classList.add("row");
        return element;
      }
    });

    me.activate = activate;
    me.render = render;
    me.endGame = endGame;
  }

  if (!("minesweeper" in exports)) {
    exports.minesweeper = {};
  }

  minesweeper.BoardView = BoardView;
})(this);
