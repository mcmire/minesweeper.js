(function (exports) {
  "use strict";

  function RowView(args) {
    var me = this;
    var boardView = args.parentView;
    var element = args.element;
    var row = args.model;

    var activate = function () {
      cellViewCollection.activate();
    };

    var deactivate = function () {
      cellViewCollection.deactivate();
    };

    var appendTo = function (parentElement) {
      cellViewCollection.appendTo(element);
      parentElement.appendChild(element);
    };

    var render = function () {
      element.innerHTML = "";
      cellViewCollection.appendTo(element);
      cellViewCollection.render();
    };

    me.parentView = boardView;

    var cellViewCollection = new minesweeper.ViewCollection({
      parentView: me,
      models: row.cells,
      viewClass: minesweeper.CellView,
      additionalViewArguments: { boardView: boardView },
      buildElement: function () {
        var element = document.createElement("div");
        element.classList.add("cell");
        return element;
      }
    });

    me.activate = activate;
    me.deactivate = deactivate;
    me.appendTo = appendTo;
    me.render = render;
  }

  if (!("minesweeper" in exports)) {
    exports.minesweeper = {};
  }

  minesweeper.RowView = RowView;
})(this);
