(function (exports) {
  "use strict";

  function CellViewCollection(View) {
    var rows = [];
    var views = [];

    var addView = function (args) {
      var view = new View(args);
      var cell = view.model;
      var row;

      if (!(cell.y in rows)) {
        rows[cell.y] = [];
      }

      row = rows[cell.y];

      row.push(view);
      row.sort(function (a, b) {
        return a.model.x - b.model.x;
      });

      views.push(view);
    };

    var forEach = function (fn) {
      views.forEach(fn);
    };

    var forEachRow = function (fn) {
      rows.forEach(fn);
    };

    //var getRows = function () {
      //return rows;
    //};

    this.addView = addView;
    this.forEachRow = forEachRow;
    this.forEach = forEach;
    //this.getRows = getRows;
  }

  if (!("minesweeper" in exports)) {
    exports.minesweeper = {};
  }

  minesweeper.CellViewCollection = CellViewCollection;
})(this);
