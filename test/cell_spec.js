describe("minesweeper.Cell", function () {
  function buildBoard() {
    return {
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

  describe("#reveal", function () {
    it("sets isRevealed to true", function () {
      var cell = buildCell();
      cell.reveal();
      expect(cell.isRevealed).toBe(true);
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

  describe("#findAdjacentSafeCells", function () {
    it("calls #findCellsAdjacentTo on the Board with itself", function () {
      var board = {};
      board.findCellsAdjacentTo =
        jasmine.createSpy("findCellsAdjacentTo").and.returnValue([]);
      var cell = buildCell({ board: board });

      cell.getAdjacentSafeCells();

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

      expect(cell.getAdjacentSafeCells()).toEqual(nonMines);
    });
  });
});
