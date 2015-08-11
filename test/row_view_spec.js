describe("minesweeper.RowView", function () {
  function buildArgs(overrides) {
    return _.defaults(overrides || {}, {
      element: createElement(),
      model: buildRow(),
    });
  }

  function buildViewCollection(overrides) {
    return _.defaults(overrides || {}, {
      activate: function () { },
      deactivate: function () { },
      appendTo: function () { },
      render: function () { }
    });
  }

  function buildCell() {
    return {};
  }

  function createElement() {
    return document.createElement("dummy-row");
  }

  function buildRow() {
    return { cells: [] };
  }

  beforeEach(function () {
    this.spyOnViewCollection = spyOn(minesweeper, "ViewCollection")
      .and.returnValue(buildViewCollection());
  });

  describe("the constructor", function () {
    it("calls ViewCollection with the cells and other arguments", function () {
      var cells = [buildCell(), buildCell()];
      var board = { cells: cells };
      var args = buildArgs({ model: board });

      new minesweeper.RowView(args);

      expect(minesweeper.ViewCollection).toHaveBeenCalled();
      var call = minesweeper.ViewCollection.calls.first();
      expect(call.args[0].models).toBe(cells);
      expect(call.args[0].viewClass).toBe(minesweeper.CellView);
      expect(call.args[0].buildElement().outerHTML).toEqual('<div class="cell"></div>');
    });
  });

  describe("#activate", function () {
    it("calls #activate on the view collection", function () {
      var cellViewCollection = buildViewCollection();
      spyOn(cellViewCollection, "activate");
      this.spyOnViewCollection.and.returnValue(cellViewCollection);
      var view = new minesweeper.RowView(buildArgs());

      view.activate();

      expect(cellViewCollection.activate).toHaveBeenCalled();
    });
  });

  describe("#appendTo", function () {
    it("calls #appendTo on the view collection with the row element", function () {
      var cellViewCollection = buildViewCollection();
      spyOn(cellViewCollection, "appendTo");
      this.spyOnViewCollection.and.returnValue(cellViewCollection);
      var element = createElement();
      args = buildArgs({ element: element });
      var view = new minesweeper.RowView(buildArgs());

      view.appendTo(createElement());

      expect(cellViewCollection.appendTo).toHaveBeenCalledWith(element);
    });

    it("adds the view's element to the given element", function () {
      var element = createElement("dummy-row");
      var args = buildArgs({ element: element });
      var view = new minesweeper.RowView(args);
      var parentElement = createElement();

      view.appendTo(parentElement);

      expect(parentElement.querySelector("dummy-row")).toBeTruthy();
    });
  });

  describe("#render", function () {
    it("clears out any existing content first", function () {
      var element = createElement();
      element.innerHTML = "This should be cleared out";
      var args = buildArgs({ element: element });
      var view = new minesweeper.RowView(args);

      view.render();

      expect(element.innerHTML).toEqual("");
    });

    it("calls #appendTo on the view collection with the row element", function () {
      var cellViewCollection = buildViewCollection();
      spyOn(cellViewCollection, "appendTo");
      this.spyOnViewCollection.and.returnValue(cellViewCollection);
      var element = createElement();
      var args = buildArgs({ element: element });
      var view = new minesweeper.RowView(args);

      view.render();

      expect(cellViewCollection.appendTo).toHaveBeenCalledWith(element);
    });

    it("calls #render on the view collection", function () {
      var cellViewCollection = buildViewCollection();
      spyOn(cellViewCollection, "render");
      this.spyOnViewCollection.and.returnValue(cellViewCollection);
      var view = new minesweeper.RowView(buildArgs());

      view.render();

      expect(cellViewCollection.render).toHaveBeenCalled();
    });
  });
});
