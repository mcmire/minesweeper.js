(function (exports) {
  "use strict";

  function BoardView(args) {
    var view = this;
    var cellViewCollection = args.cellViewCollection;
    var element = args.element;
    var model = args.model;
    var size = args.size;

    var activate = function () {
      cellViewCollection.forEach(function (cellView) {
        cellView.activate();
      });
    };

    var render = function () {
      element.innerHTML = "";

      //cellViewCollection.forEachRow(function (row) {
        //var tr = document.createElement("tr");

        //row.forEach(function (cellView) {
          //cellView.appendTo(tr);
          //cellView.render();
        //});

        //element.appendChild(tr);
      //});

      rowViewCollection.appendTo(element);
      rowViewCollection.render();

      rowViewCollection.forEach(function (row) {
        row.forEach(function (rowView) {
          rowView.appendTo(element);
          rowView.render();
        });
      });
    };

    var endGame = function () {
      view.render();

      cellViewCollection.forEach(function (cellView) {
        cellView.deactivate();
      });
    };

    var createCellElement = function () {
      var element = document.createElement("div");
      element.classList.add("cell");
      return element;
    };

    model.cells.forEach(function (cell) {
      cellViewCollection.addView({
        parentView: view,
        element: createCellElement(),
        model: cell,
        size: size
      });
    });

    this.size = size;
    this.activate = activate;
    this.render = render;
    this.endGame = endGame;
  }

  if (!("minesweeper" in exports)) {
    exports.minesweeper = {};
  }

  minesweeper.BoardView = BoardView;
})(this);
