(function (exports) {
  "use strict";

  function CellView(args) {
    var view = this;
    var boardView = args.parentView;
    var element = args.element;
    var cell = args.model;
    var size = args.size;

    var activate = function () {
      element.addEventListener("click", function (event) {
        cell.encounter();

        if (cell.isMine) {
          boardView.endGame();
        } else {
          boardView.render();
        }
      });
    };

    var render = function () {
      element.style.width = (boardView.size * size) + "px";
      element.style.height = (boardView.size * size) + "px";

      if (cell.isMine) {
        element.classList.add("mine");
      }

      if (cell.isRevealed) {
        element.classList.add("revealed");
      }

      revealNumberOfAdjacentMines();
    };

    var appendTo = function (otherElement) {
      otherElement.appendChild(element);
    };

    var revealNumberOfAdjacentMines = function () {
      var number = cell.getNumberOfAdjacentMines();
      var div;

      if (number > 0) {
        div = document.createElement("div");
        div.innerText = number;
        element.appendChild(div);
      }
    };

    this.activate = activate;
    this.render = render;
    this.appendTo = appendTo;
  }

  if (!("minesweeper" in window)) {
    exports.minesweeper = {};
  }

  minesweeper.CellView = CellView;
})(this);
