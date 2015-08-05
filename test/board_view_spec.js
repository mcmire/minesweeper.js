describe("minesweeper.BoardView", function () {
  function buildArgs(overrides) {
    return _.defaults(overrides || {}, {
      cellViewCollection: buildCellViewCollection(),
      element: createElement(),
      model: buildBoard()
    });
  }

  function buildCellViewCollection(overrides) {
    return _.defaults(overrides || {}, {
      addView: function () { },
      forEachRow: function () { },
      forEach: function () { },
    });
  }

  function buildCellView() {
    return {
      appendTo: function () { },
      activate: function () { },
      render: function () { },
      deactivate: function () { },
    };
  }

  function buildCell() {
    return {};
  }

  function createElement() {
    return document.createElement("dummy-board");
  }

  function buildBoard() {
    return { cells: [] };
  }

  function AnyElement(options) {
    this.options = options;

    this.asymmetricMatch = function (element) {
      return element.nodeName.toLowerCase() === options.nodeName &&
        element.className === options.className;
    };
  }

  function anyElement(options) {
    return new AnyElement(options);
  }

  describe("the constructor", function () {
    it("adds a view to represent each cell in the board", function () {
      var CellView = function (args) { return args; };
      var cellViewCollection = buildCellViewCollection();
      spyOn(cellViewCollection, "addView");
      var cells = [buildCell(), buildCell()];
      var board = { cells: cells };
      var args = buildArgs({
        cellViewCollection: cellViewCollection,
        model: board,
        size: 10
      });
      var view = new minesweeper.BoardView(args);
      var aCellElement = anyElement({ nodeName: "div", className: "cell" });

      expect(cellViewCollection.addView).toHaveBeenCalledWith({
        parentView: view,
        element: aCellElement,
        model: cells[0],
        size: 10
      });
      expect(cellViewCollection.addView).toHaveBeenCalledWith({
        parentView: view,
        element: aCellElement,
        model: cells[1],
        size: 10
      });
    });
  });

  describe("#activate", function () {
    it("calls #activate on each CellView", function () {
      var cellViews = [buildCellView(), buildCellView()];
      cellViews.forEach(function (cellView) {
        spyOn(cellView, "activate");
      });
      var cellViewCollection = buildCellViewCollection({
        forEach: function (fn) { cellViews.forEach(fn); }
      });
      var board = { cells: [buildCell(), buildCell()] };
      var args = buildArgs({
        cellViewCollection: cellViewCollection,
        model: board
      });
      var view = new minesweeper.BoardView(args);

      view.activate();

      cellViewCollection.forEach(function (cellView) {
        expect(cellView.activate).toHaveBeenCalled();
      });
    });
  });

  describe("#render", function () {
    it("calls #appendTo on each row of CellViews with the board's element", function () {
      var cellViewRows = [
        [buildCellView(), buildCellView()],
        [buildCellView(), buildCellView()],
      ];
      cellViewRows.forEach(function (row) {
        row.forEach(function (view) {
          spyOn(view, "appendTo");
        });
      });
      var cellViewCollection = buildCellViewCollection({
        forEachRow: function (fn) { cellViewRows.forEach(fn); }
      });
      var element = createElement();
      var board = {
        cells: _.times(4, function() { return buildCell(); })
      };
      var args = buildArgs({
        cellViewCollection: cellViewCollection,
        element: element,
        model: board
      });
      var view = new minesweeper.BoardView(args);

      view.activate();

      cellViewCollection.forEachRow(function (row) {
        row.forEach(function (view) {
          expect(view.appendTo).toHaveBeenCalledWith(element);
        });
      });
    });

    xit("calls #render on each row of CellViews", function () {
      var cellViews = [buildCellView(), buildCellView()];
      cellViews.forEach(function (cellView) {
        spyOn(cellView, "render");
      });
      var cellViewCollection = buildCellViewCollection({
        forEach: function (fn) { cellViews.forEach(fn); }
      });
      var board = { cells: [buildCell(), buildCell()] };
      var args = buildArgs({
        cellViewCollection: cellViewCollection,
        model: board
      });
      var view = new minesweeper.BoardView(args);

      view.render();

      cellViewCollection.forEach(function (cellView) {
        expect(cellView.render).toHaveBeenCalled();
      });
    });
  });

  describe("#endGame", function () {
    it("calls #render", function () {
      var args = buildArgs();
      var view = new minesweeper.BoardView(args);
      spyOn(view, "render");

      view.endGame();

      expect(view.render).toHaveBeenCalled();
    });

    it("calls #deactivate on all of the cell views", function () {
      var cellViews = [buildCellView(), buildCellView()];
      cellViews.forEach(function (cellView) {
        spyOn(cellView, "deactivate");
      });
      var cellViewCollection = buildCellViewCollection({
        forEach: function (fn) { cellViews.forEach(fn); }
      });
      var board = { cells: [buildCell(), buildCell()] };
      var args = buildArgs({
        cellViewCollection: cellViewCollection,
        model: board
      });
      var view = new minesweeper.BoardView(args);

      view.endGame();

      cellViewCollection.forEach(function (cellView) {
        expect(cellView.deactivate).toHaveBeenCalled();
      });
    });
  });
});
