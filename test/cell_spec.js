describe("minesweeper.Cell", function () {
  function buildBoard() {
    return {
      encounterCell: function () { },
      countMinesInArea: function () { },
      findCellsAdjacentTo: function () { }
    };
  }

  function buildCell(overrides) {
    var args = _.defaults(overrides || {}, {
      board: buildBoard(),
      x: 0,
      y: 0,
      isMine: false
    });

    return new minesweeper.Cell(args);
  }

  describe("isRevealed", function () {
    it("is false by default", function () {
      var cell = buildCell();
      expect(cell.isRevealed).toBe(false);
    });
  });

  describe("#encounter", function () {
    it("calls #encounterCell on the Board", function () {
      var board = buildBoard();
      spyOn(board, "encounterCell");
      var cell = buildCell({ board: board });

      cell.encounter();

      expect(board.encounterCell).toHaveBeenCalledWith(cell);
    });
  });

  describe("#reveal", function () {
    it("sets isRevealed to true", function () {
      var cell = buildCell();

      cell.reveal();

      expect(cell.isRevealed).toBe(true);
    });
  });

  describe("#isSafe", function () {
    describe("if the number of adjacent mines is 0", function () {
      it("returns true", function () {
        cell = buildCell();
        cell.getNumberOfAdjacentMines = function () { return 0; };

        expect(cell.isSafe()).toBe(true);
      });
    });

    describe("if the number of adjacent mines is more than 0", function () {
      it("returns false", function () {
        cell = buildCell();
        cell.getNumberOfAdjacentMines = function () { return 1; };

        expect(cell.isSafe()).toBe(false);
      });
    });
  });

  describe("#getNumberOfAdjacentMines", function () {
    it("calls #findCellsAdjacentTo on the Board with itself", function () {
      var board = {};
      board.findCellsAdjacentTo =
        jasmine.createSpy("findCellsAdjacentTo").and.returnValue([]);
      var cell = buildCell({ board: board });

      cell.getNumberOfAdjacentMines();

      expect(board.findCellsAdjacentTo).toHaveBeenCalledWith(cell);
    });

    it("returns the number of adjacent cells that are mines", function () {
      var board = {
        findCellsAdjacentTo: function () {
          return [
            { isMine: true },
            { isMine: false },
            { isMine: false },
            { isMine: true },
          ];
        }
      };
      var cell = buildCell({ board: board });

      expect(cell.getNumberOfAdjacentMines()).toBe(2);
    });
  });

  describe("#findAdjacentNonMines", function () {
    it("calls #findCellsAdjacentTo on the Board with itself", function () {
      var board = {};
      board.findCellsAdjacentTo =
        jasmine.createSpy("findCellsAdjacentTo").and.returnValue([]);
      var cell = buildCell({ board: board });

      cell.getAdjacentNonMines();

      expect(board.findCellsAdjacentTo).toHaveBeenCalledWith(cell);
    });

    it("returns the adjacent cells that are not mines", function () {
      var mines = [
        { isMine: true },
        { isMine: true },
      ];
      var nonMines = [
        { isMine: false },
        { isMine: false },
      ];
      var board = {
        findCellsAdjacentTo: function () {
          return mines.concat(nonMines);
        }
      };
      var cell = buildCell({ board: board });

      expect(cell.getAdjacentNonMines()).toEqual(nonMines);
    });
  });
});
