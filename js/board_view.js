(function (exports) {
  "use strict";

  function BoardView(args) {
    var view = this;
    //var rowViewCollection = args.rowViewCollection;
    var element = args.element;
    var model = args.model;
    var size = args.size;

    var activate = function () {
      rowViewCollection.forEach(function (rowView) {
        rowView.activate();
      });
    };

    var render = function () {
      element.innerHTML = "";
      rowViewCollection.appendTo(element);
      rowViewCollection.render();
    };

    var endGame = function () {
      view.render();

      rowViewCollection.forEach(function (rowView) {
        rowView.deactivate();
      });
    };

    //var createCellElement = function () {
      //var element = document.createElement("div");
      //element.classList.add("cell");
      //return element;
    //};

    var rowViewCollection = new ViewCollection({
      models: model.cells,
      viewClass: minesweeper.RowView,
      buildElement: function () {
        return document.createElement("tr");
      }
    });

    //model.cells.forEach(function (cell) {
      //rowViewCollection.addView({
        //parentView: view,
        //element: createCellElement(),
        //model: cell,
        //size: size
      //});
    //});

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
