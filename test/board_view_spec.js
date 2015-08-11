describe("minesweeper.BoardView", function () {
  function buildArgs(overrides) {
    return _.defaults(overrides || {}, {
      bodyElement: createBodyElement(),
      element: createElement(),
      model: buildBoard(),
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

  function buildRow() {
    return {};
  }

  function createBodyElement() {
    return document.createElement("dummy-body");
  }

  function createElement() {
    return document.createElement("dummy-board");
  }

  function buildBoard(overrides) {
    return _.defaults(overrides || {}, {
      rows: []
    });
  }

  beforeEach(function () {
    this.spyOnViewCollection = spyOn(minesweeper, "ViewCollection")
      .and.returnValue(buildViewCollection());
  });

  describe("the constructor", function () {
    it("calls ViewCollection with the rows and other arguments", function () {
      var rows = [buildRow(), buildRow()];
      var board = { rows: rows };
      var args = buildArgs({ model: board });

      new minesweeper.BoardView(args);

      expect(minesweeper.ViewCollection).toHaveBeenCalled();
      var call = minesweeper.ViewCollection.calls.first();
      expect(call.args[0].models).toBe(rows);
      expect(call.args[0].viewClass).toBe(minesweeper.RowView);
      expect(call.args[0].buildElement().outerHTML).toEqual('<div class="row"></div>');
    });
  });

  describe("#activate", function () {
    it("calls #activate on the view collection", function () {
      var rowViewCollection = buildViewCollection();
      spyOn(rowViewCollection, "activate");
      this.spyOnViewCollection.and.returnValue(rowViewCollection);
      var view = new minesweeper.BoardView(buildArgs());

      view.activate();

      expect(rowViewCollection.activate).toHaveBeenCalled();
    });
  });

  describe("#render", function () {
    it("sets the pixel dimensions of the board", function () {
      var element = createElement();
      var board = buildBoard({ size: 10 });
      var args = buildArgs({
        element: element,
        model: board,
        cellSize: 5
      });
      var view = new minesweeper.BoardView(args);

      view.render();

      expect(element.style.width).toEqual("50px");
      expect(element.style.height).toEqual("50px");
    });

    it("clears out any existing content first", function () {
      var element = createElement();
      element.innerHTML = "This should be cleared out";
      var args = buildArgs({ element: element });
      var view = new minesweeper.BoardView(args);

      view.render();

      expect(element.innerHTML).toEqual("");
    });

    it("calls #appendTo on the view collection with the board element", function () {
      var rowViewCollection = buildViewCollection();
      spyOn(rowViewCollection, "appendTo");
      this.spyOnViewCollection.and.returnValue(rowViewCollection);
      var element = createElement();
      var args = buildArgs({ element: element });
      var view = new minesweeper.BoardView(args);

      view.render();

      expect(rowViewCollection.appendTo).toHaveBeenCalledWith(element);
    });

    it("calls #render on the view collection", function () {
      var rowViewCollection = buildViewCollection();
      spyOn(rowViewCollection, "render");
      this.spyOnViewCollection.and.returnValue(rowViewCollection);
      var view = new minesweeper.BoardView(buildArgs());

      view.render();

      expect(rowViewCollection.render).toHaveBeenCalled();
    });
  });

  describe("#endGame", function () {
    it("calls #render", function () {
      var view = new minesweeper.BoardView(buildArgs());
      spyOn(view, "render");

      view.endGame();

      expect(view.render).toHaveBeenCalled();
    });

    it("calls #deactivate on the view collection", function () {
      var rowViewCollection = buildViewCollection();
      spyOn(rowViewCollection, "deactivate");
      this.spyOnViewCollection.and.returnValue(rowViewCollection);
      var view = new minesweeper.BoardView(buildArgs());

      view.endGame();

      expect(rowViewCollection.deactivate).toHaveBeenCalled();
    });

    it("adds a 'game-over' class to the body element", function () {
      var bodyElement = createBodyElement();
      var args = buildArgs({ bodyElement: bodyElement });
      var view = new minesweeper.BoardView(args);

      view.endGame();

      expect(bodyElement.classList.contains("game-over")).toBe(true);
    });
  });
});
