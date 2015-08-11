describe("minesweeper.CellView", function () {
  function buildArgs(overrides) {
    return _.defaults(overrides || {}, {
      parentView: { parentView: buildBoardView() },
      element: createElement(),
      model: buildCell()
    });
  }

  function buildBoardView(overrides) {
    return _.defaults(overrides || {}, {
      render: function () { },
      endGame: function () { }
    });
  }

  function createElement(name) {
    name = name || "dummy-cell";
    return document.createElement(name);
  }

  function buildCell(overrides) {
    return _.defaults(overrides || {}, {
      encounter: function () { },
      getNumberOfAdjacentMines: function () { return 0; }
    });
  }

  describe("when activated", function () {
    describe("when the element is clicked", function () {
      it("calls #encounter on the Cell", function () {
        var element = createElement();
        var cell = buildCell();
        spyOn(cell, "encounter");
        var args = buildArgs({
          element: element,
          model: cell
        });
        var view = new minesweeper.CellView(args);
        view.activate();

        var event = new Event("click");
        element.dispatchEvent(event);

        expect(cell.encounter).toHaveBeenCalled();
      });

      describe("if the cell is a mine", function () {
        it("calls #endGame on the board view", function () {
          var boardView = buildBoardView();
          spyOn(boardView, "endGame");
          var element = createElement();
          var cell = buildCell({ isMine: true });
          var args = buildArgs({
            parentView: { parentView: boardView },
            element: element,
            model: cell
          });
          var view = new minesweeper.CellView(args);
          view.activate();

          var event = new Event("click");
          element.dispatchEvent(event);

          expect(boardView.endGame).toHaveBeenCalled();
        });
      });

      describe("if the cell is not a mine", function () {
        it("calls #render on the board view", function () {
          var boardView = buildBoardView();
          spyOn(boardView, "render");
          var element = createElement();
          var cell = buildCell({ isMine: false });
          var args = buildArgs({
            parentView: { parentView: boardView },
            element: element,
            model: cell
          });
          var view = new minesweeper.CellView(args);
          view.activate();

          var event = new Event("click");
          element.dispatchEvent(event);

          expect(boardView.render).toHaveBeenCalled();
        });
      });
    });
  });

  describe("#render", function () {
    it("clears out any existing content first", function () {
      var element = createElement();
      element.innerHTML = "This should be cleared out";
      var cell = buildCell({ isMine: true });
      var args = buildArgs({ element: element, model: cell });
      var view = new minesweeper.CellView(args);

      view.render();

      expect(element.innerHTML).toEqual("<div></div>");
    });

    describe("if the cell is a mine", function () {
      it("adds the 'mine' class to the element", function () {
        var element = createElement();
        var cell = buildCell({ isMine: true });
        var args = buildArgs({ element: element, model: cell });
        var view = new minesweeper.CellView(args);

        view.render();

        expect(element.classList.contains("mine")).toBe(true);
      });
    });

    describe("if the cell has been revealed", function () {
      it("adds the 'revealed' class to the element", function () {
        var element = createElement();
        var cell = buildCell({ isRevealed: true });
        var args = buildArgs({ element: element, model: cell });
        var view = new minesweeper.CellView(args);

        view.render();

        expect(element.classList.contains("revealed")).toBe(true);
      });

      describe("if the cell has mines adjacent to it", function () {
        it("fills in the cell with the number of mines", function () {
          var element = createElement();
          var cell = buildCell({
            isRevealed: true,
            getNumberOfAdjacentMines: function () { return 3; }
          });
          var args = buildArgs({ element: element, model: cell });
          var view = new minesweeper.CellView(args);

          view.render();

          expect(element.innerHTML).toEqual("<div>3</div>");
        });
      });

      describe("if the cell is a mine", function () {
        it("adds a bomb icon to the content element", function () {
          var element = createElement();
          var cell = buildCell({ isRevealed: true, isMine: true });
          var args = buildArgs({ element: element, model: cell });
          var view = new minesweeper.CellView(args);

          view.render();

          expect(element.innerHTML).toEqual('<div><i class="fa fa-bomb"></i></div>');
        });
      });
    });

  });

  describe("#appendTo", function () {
    it("adds the view's element to the given element", function () {
      var element = createElement("dummy-cell");
      var args = buildArgs({ element: element });
      var view = new minesweeper.CellView(args);
      var parentElement = createElement();

      view.appendTo(parentElement);

      expect(parentElement.querySelector("dummy-cell")).toBeTruthy();
    });
  });
});
