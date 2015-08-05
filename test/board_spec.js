describe("minesweeper.Board", function () {
  describe("#addCell", function () {
    it("builds a Cell and adds it to cells", function () {
      var board = new minesweeper.Board();

      board.addCell({ x: 0, y: 0, isMine: true });

      var cell = board.cells[0];
      expect(cell.board).toBe(board);
      expect(cell.location).toEqual({ x: 0, y: 0 });
      expect(cell.isMine).toBe(true);
    });
  });

  describe("#encounterCell", function () {
    function buildCell(overrides) {
      return _.defaults(overrides || {}, {
        reveal: function () { },
        isNearMine: function () { },
        getAdjacentSafeCells: function () { return []; }
      });
    }

    describe("if the given cell is a mine", function () {
      it("calls #reveal on all cells", function () {
        var board = new minesweeper.Board();
        var mine = buildCell({ isMine: true });
        var otherCells = [buildCell(), buildCell()];
        board.cells = [mine].concat(otherCells);
        board.cells.forEach(function (cell) {
          spyOn(cell, "reveal");
        });

        board.encounterCell(mine);

        board.cells.forEach(function (cell) {
          expect(cell.reveal).toHaveBeenCalled();
        });
      });
    });

    describe("if the given cell is safe", function () {
      describe("and is blank", function () {
        describe("and has not already been revealed before", function () {
          it("calls #reveal on the cell", function () {
            var board = new minesweeper.Board();
            var safeCell = buildCell({ isMine: false, isRevealed: false });
            spyOn(safeCell, "reveal");
            board.cells = [safeCell];

            board.encounterCell(safeCell);

            expect(safeCell.reveal).toHaveBeenCalled();
          });

          describe("and has an adjacent safe cell", function () {
            describe("which has not been revealed before", function () {
              it("calls #reveal on the adjacent cell", function () {
                var board = new minesweeper.Board();
                var adjacentSafeCell = buildCell({ isRevealed: false });
                spyOn(adjacentSafeCell, "reveal");
                var blankCell = buildCell({
                  isMine: false,
                  isNearMine: function () { return false; },
                  isRevealed: false,
                  getAdjacentSafeCells: function () {
                    return [adjacentSafeCell];
                  }
                });
                board.cells = [blankCell];

                board.encounterCell(blankCell);

                expect(adjacentSafeCell.reveal).toHaveBeenCalled();
              });

              describe("when the adjacent cell itself has an adjacent safe cell", function () {
                describe("when the outer adjacent cell is blank", function () {
                  it("calls #reveal on its adjacent cell", function () {
                    var board = new minesweeper.Board();
                    var innerAdjacentSafeCell = buildCell();
                    spyOn(innerAdjacentSafeCell, "reveal");
                    var outerAdjacentSafeCell = buildCell({
                      isRevealed: false,
                      isNearMine: function () { return false; },
                      getAdjacentSafeCells: function () {
                        return [innerAdjacentSafeCell];
                      }
                    });
                    var blankCell = buildCell({
                      isMine: false,
                      isNearMine: function () { return false; },
                      isRevealed: false,
                      getAdjacentSafeCells: function () {
                        return [outerAdjacentSafeCell];
                      }
                    });
                    board.cells = [blankCell];

                    board.encounterCell(blankCell);

                    expect(innerAdjacentSafeCell.reveal).toHaveBeenCalled();
                  });
                });

                describe("when the outer adjacent cell is near a mine", function () {
                  it("does not call #reveal on its adjacent cell", function () {
                    var board = new minesweeper.Board();
                    var innerAdjacentSafeCell = buildCell();
                    spyOn(innerAdjacentSafeCell, "reveal");
                    var outerAdjacentSafeCell = buildCell({
                      isRevealed: false,
                      isNearMine: function () { return true; },
                      getAdjacentSafeCells: function () {
                        return [innerAdjacentSafeCell];
                      }
                    });
                    var blankCell = buildCell({
                      isMine: false,
                      isNearMine: function () { return false; },
                      isRevealed: false,
                      getAdjacentSafeCells: function () {
                        return [outerAdjacentSafeCell];
                      }
                    });
                    board.cells = [blankCell];

                    board.encounterCell(blankCell);

                    expect(innerAdjacentSafeCell.reveal).not.toHaveBeenCalled();
                  });
                });
              });
            });

            describe("which has already been revealed before", function () {
              it("does not call #reveal on the adjacent cell", function () {
                var board = new minesweeper.Board();
                var adjacentSafeCell = buildCell({ isRevealed: true });
                spyOn(adjacentSafeCell, "reveal");
                var blankCell = buildCell({
                  isMine: false,
                  isNearMine: function () { return false; },
                  isRevealed: false,
                  getAdjacentSafeCells: function () {
                    return [adjacentSafeCell];
                  }
                });
                board.cells = [blankCell];

                board.encounterCell(blankCell);

                expect(adjacentSafeCell.reveal).not.toHaveBeenCalled();
              });
            });
          });
        });

        describe("and has already been revealed before", function () {
          it("does not call #reveal on that cell", function () {
            var board = new minesweeper.Board();
            var safeCell = buildCell({ isMine: false, isRevealed: true });
            spyOn(safeCell, "reveal");
            board.cells = [safeCell];

            board.encounterCell(safeCell);

            expect(safeCell.reveal).not.toHaveBeenCalled();
          });

          it("does not call #reveal on any safe cells adjacent to that cell", function () {
            var board = new minesweeper.Board();
            var adjacentSafeCell = buildCell({ isRevealed: false });
            spyOn(adjacentSafeCell, "reveal");
            var blankCell = buildCell({
              isMine: false,
              isNearMine: function () { return false; },
              isRevealed: true,
              getAdjacentSafeCells: function () {
                return [adjacentSafeCell];
              }
            });
            board.cells = [blankCell];

            board.encounterCell(blankCell);

            expect(adjacentSafeCell.reveal).not.toHaveBeenCalled();
          });
        });
      });

      describe("and is near a mine", function () {
        describe("assuming the cell has not been revealed yet", function () {
          it("calls #reveal on the cell", function () {
            var board = new minesweeper.Board();
            var cellNearToMine = buildCell({
              isMine: false,
              isNearMine: function () { return true; },
              isRevealed: false
            });
            spyOn(cellNearToMine, "reveal");
            board.cells = [cellNearToMine];

            board.encounterCell(cellNearToMine);

            expect(cellNearToMine.reveal).toHaveBeenCalled();
          });

          it("does not call #reveal on any safe cells adjacent to that cell", function () {
            var board = new minesweeper.Board();
            var adjacentSafeCell = buildCell({ isRevealed: false });
            spyOn(adjacentSafeCell, "reveal");
            var cellNearToMine = buildCell({
              isMine: false,
              isNearMine: function () { return true; },
              isRevealed: false,
              getAdjacentSafeCells: function () {
                return [adjacentSafeCell];
              }
            });
            board.cells = [cellNearToMine];

            board.encounterCell(cellNearToMine);

            expect(adjacentSafeCell.reveal).not.toHaveBeenCalled();
          });
        });
      });
    });
  });

  describe("#findCellsAdjacentTo", function () {
    function convertTo4x4Board(board) {
      _.times(4, function (y) {
        _.times(4, function (x) {
          board.cells.push({ x: x, y: y });
        });
      });
    }

    describe("if the given cell has no cell to its left", function () {
      it("omits a column in the list of returned cells", function () {
        var board = new minesweeper.Board();
        convertTo4x4Board(board);

        var adjacentCells = board.findCellsAdjacentTo({ x: 0, y: 1 });
        expect(adjacentCells).toEqual([
          { x: 0, y: 0 },
          { x: 1, y: 0 },
          { x: 1, y: 1 },
          { x: 0, y: 2 },
          { x: 1, y: 2 },
        ]);
      });
    });

    describe("if the given cell has no cell to its right", function () {
      it("omits a column in the list of returned cells", function () {
        var board = new minesweeper.Board();
        convertTo4x4Board(board);

        var adjacentCells = board.findCellsAdjacentTo({ x: 3, y: 1 });
        expect(adjacentCells).toEqual([
          { x: 2, y: 0 },
          { x: 3, y: 0 },
          { x: 2, y: 1 },
          { x: 2, y: 2 },
          { x: 3, y: 2 },
        ]);
      });
    });

    describe("if the given cell has no cell above it", function () {
      it("omits a row in the list of returned cells", function () {
        var board = new minesweeper.Board();
        convertTo4x4Board(board);

        var adjacentCells = board.findCellsAdjacentTo({ x: 1, y: 0 });
        expect(adjacentCells).toEqual([
          { x: 0, y: 0 },
          { x: 2, y: 0 },
          { x: 0, y: 1 },
          { x: 1, y: 1 },
          { x: 2, y: 1 }
        ]);
      });
    });

    describe("if the given cell has no cell below it", function () {
      it("omits a row in the list of returned cells", function () {
        var board = new minesweeper.Board();
        convertTo4x4Board(board);

        var adjacentCells = board.findCellsAdjacentTo({ x: 1, y: 3 });
        expect(adjacentCells).toEqual([
          { x: 0, y: 2 },
          { x: 1, y: 2 },
          { x: 2, y: 2 },
          { x: 0, y: 3 },
          { x: 2, y: 3 },
        ]);
      });
    });

    describe("if the given cell has cells all around it", function () {
      it("returns those cells", function () {
        var board = new minesweeper.Board();
        convertTo4x4Board(board);

        var adjacentCells = board.findCellsAdjacentTo({ x: 1, y: 1 });
        expect(adjacentCells).toEqual([
          { x: 0, y: 0 },
          { x: 1, y: 0 },
          { x: 2, y: 0 },
          { x: 0, y: 1 },
          { x: 2, y: 1 },
          { x: 0, y: 2 },
          { x: 1, y: 2 },
          { x: 2, y: 2 },
        ]);
      });
    });
  });
});
