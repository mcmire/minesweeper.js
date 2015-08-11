(function (exports) {
  "use strict";

  function CellView(args) {
    var me = this;
    var rowView = args.parentView;
    var boardView = rowView.parentView;
    var element = args.element;
    var cell = args.model;

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

    var appendTo = function (parentElement) {
      parentElement.appendChild(element);
    };

    var render = function () {
      var contentElement = document.createElement("div");
      var numberOfAdjacentMines;

      element.innerHTML = "";

      if (cell.isMine) {
        element.classList.add("mine");
      }

      if (cell.isRevealed) {
        element.classList.add("revealed");

        if (cell.isMine) {
          contentElement.innerHTML = '<i class="fa fa-bomb"></i>';
        } else {
          numberOfAdjacentMines = cell.getNumberOfAdjacentMines();

          if (numberOfAdjacentMines > 0) {
            contentElement.innerText = numberOfAdjacentMines;
          }
        }
      }

      element.appendChild(contentElement);
    };

    me.activate = activate;
    me.appendTo = appendTo;
    me.render = render;
  }

  if (!("minesweeper" in window)) {
    exports.minesweeper = {};
  }

  minesweeper.CellView = CellView;
})(this);
