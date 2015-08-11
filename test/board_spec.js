describe("minesweeper.Board", function () {
  beforeEach(function () {
    this.spyOnCell = spyOn(minesweeper, "Cell")
      .and.callFake(function (args) { return _.clone(args); });
  });

  function expectCellToHaveBeenAddedTo(board, cellData) {
    var actualCell = board.rows[cellData.y].cells[cellData.x];
    expect(actualCell.board).toBe(board);
    expect(actualCell.x).toBe(cellData.x);
    expect(actualCell.y).toBe(cellData.y);
    expect(actualCell.isMine).toBe(cellData.isMine);
  }

  describe("#addCell", function () {
    it("builds a Cell and adds it to rows", function () {
      var board = new minesweeper.Board({});
      var cells = [
        { x: 0, y: 0, isMine: true },
        { x: 1, y: 0, isMine: true },
        { x: 0, y: 1, isMine: false }
      ];

      cells.forEach(function (cell) {
        board.addCell(cell);
        expectCellToHaveBeenAddedTo(board, cell);
      });
    });
  });

  describe("#encounterCell", function () {
    function buildCell(overrides) {
      return _.defaults(overrides || {}, {
        reveal: function () { },
        isSafe: function () { },
        getAdjacentNonMines: function () { return []; }
      });
    }

    function recordInstantiatedCells(test, callback) {
      var instantiatedCells = [];

      test.spyOnCell.and.callFake(function (args) {
        var cell = _.clone(args);
        callback(cell);
        instantiatedCells.push(cell);
        return cell;
      });

      return instantiatedCells;
    }

    describe("if the given cell is a mine", function () {
      it("calls #reveal on all cells", function () {
        var instantiatedCells = recordInstantiatedCells(this, function (cell) {
          cell.reveal = jasmine.createSpy("reveal");
        });
        var mine = buildCell({ isMine: true });
        var otherCells = [buildCell(), buildCell()];
        var allCells = [mine].concat(otherCells);
        var board = new minesweeper.Board({});
        allCells.forEach(function (cell) {
          board.addCell(cell);
        });

        board.encounterCell(mine);

        instantiatedCells.forEach(function (cell) {
          expect(cell.reveal).toHaveBeenCalled();
        });
      });
    });

    describe("if the given cell is safe", function () {
      describe("and is blank", function () {
        describe("and has not already been revealed before", function () {
          it("calls #reveal on the cell", function () {
            var board = new minesweeper.Board({});
            var nonMine = buildCell({ isMine: false, isRevealed: false });
            spyOn(nonMine, "reveal");
            board.cells = [nonMine];

            board.encounterCell(nonMine);

            expect(nonMine.reveal).toHaveBeenCalled();
          });

          describe("and has an adjacent safe cell", function () {
            describe("which has not been revealed before", function () {
              it("calls #reveal on the adjacent cell", function () {
                var board = new minesweeper.Board({});
                var adjacentNonMine = buildCell({ isRevealed: false });
                spyOn(adjacentNonMine, "reveal");
                var blankCell = buildCell({
                  isMine: false,
                  isSafe: function () { return true; },
                  isRevealed: false,
                  getAdjacentNonMines: function () {
                    return [adjacentNonMine];
                  }
                });
                board.cells = [blankCell];

                board.encounterCell(blankCell);

                expect(adjacentNonMine.reveal).toHaveBeenCalled();
              });

              describe("when the adjacent cell itself has an adjacent safe cell", function () {
                describe("when the outer adjacent cell is blank", function () {
                  it("calls #reveal on its adjacent cell", function () {
                    var board = new minesweeper.Board({});
                    var innerAdjacentNonMine = buildCell();
                    spyOn(innerAdjacentNonMine, "reveal");
                    var outerAdjacentNonMine = buildCell({
                      isRevealed: false,
                      isSafe: function () { return true; },
                      getAdjacentNonMines: function () {
                        return [innerAdjacentNonMine];
                      }
                    });
                    var blankCell = buildCell({
                      isMine: false,
                      isSafe: function () { return true; },
                      isRevealed: false,
                      getAdjacentNonMines: function () {
                        return [outerAdjacentNonMine];
                      }
                    });
                    board.cells = [blankCell];

                    board.encounterCell(blankCell);

                    expect(innerAdjacentNonMine.reveal).toHaveBeenCalled();
                  });
                });

                describe("when the outer adjacent cell is near a mine", function () {
                  it("does not call #reveal on its adjacent cell", function () {
                    var board = new minesweeper.Board({});
                    var innerAdjacentNonMine = buildCell();
                    spyOn(innerAdjacentNonMine, "reveal");
                    var outerAdjacentNonMine = buildCell({
                      isRevealed: false,
                      isSafe: function () { return false; },
                      getAdjacentNonMines: function () {
                        return [innerAdjacentNonMine];
                      }
                    });
                    var blankCell = buildCell({
                      isMine: false,
                      isSafe: function () { return true; },
                      isRevealed: false,
                      getAdjacentNonMines: function () {
                        return [outerAdjacentNonMine];
                      }
                    });
                    board.cells = [blankCell];

                    board.encounterCell(blankCell);

                    expect(innerAdjacentNonMine.reveal).not.toHaveBeenCalled();
                  });
                });
              });
            });

            describe("which has already been revealed before", function () {
              it("does not call #reveal on the adjacent cell", function () {
                var board = new minesweeper.Board({});
                var adjacentNonMine = buildCell({ isRevealed: true });
                spyOn(adjacentNonMine, "reveal");
                var blankCell = buildCell({
                  isMine: false,
                  isSafe: function () { return true; },
                  isRevealed: false,
                  getAdjacentNonMines: function () {
                    return [adjacentNonMine];
                  }
                });
                board.cells = [blankCell];

                board.encounterCell(blankCell);

                expect(adjacentNonMine.reveal).not.toHaveBeenCalled();
              });
            });
          });
        });

        describe("and has already been revealed before", function () {
          it("does not call #reveal on that cell", function () {
            var board = new minesweeper.Board({});
            var nonMine = buildCell({ isMine: false, isRevealed: true });
            spyOn(nonMine, "reveal");
            board.cells = [nonMine];

            board.encounterCell(nonMine);

            expect(nonMine.reveal).not.toHaveBeenCalled();
          });

          it("does not call #reveal on any safe cells adjacent to that cell", function () {
            var board = new minesweeper.Board({});
            var adjacentNonMine = buildCell({ isRevealed: false });
            spyOn(adjacentNonMine, "reveal");
            var blankCell = buildCell({
              isMine: false,
              isSafe: function () { return true; },
              isRevealed: true,
              getAdjacentNonMines: function () {
                return [adjacentNonMine];
              }
            });
            board.cells = [blankCell];

            board.encounterCell(blankCell);

            expect(adjacentNonMine.reveal).not.toHaveBeenCalled();
          });
        });
      });

      describe("and is near a mine", function () {
        describe("assuming the cell has not been revealed yet", function () {
          it("calls #reveal on the cell", function () {
            var board = new minesweeper.Board({});
            var cellNearToMine = buildCell({
              isMine: false,
              isSafe: function () { return false; },
              isRevealed: false
            });
            spyOn(cellNearToMine, "reveal");
            board.cells = [cellNearToMine];

            board.encounterCell(cellNearToMine);

            expect(cellNearToMine.reveal).toHaveBeenCalled();
          });

          it("does not call #reveal on any safe cells adjacent to that cell", function () {
            var board = new minesweeper.Board({});
            var adjacentNonMine = buildCell({ isRevealed: false });
            spyOn(adjacentNonMine, "reveal");
            var cellNearToMine = buildCell({
              isMine: false,
              isSafe: function () { return false; },
              isRevealed: false,
              getAdjacentNonMines: function () {
                return [adjacentNonMine];
              }
            });
            board.cells = [cellNearToMine];

            board.encounterCell(cellNearToMine);

            expect(adjacentNonMine.reveal).not.toHaveBeenCalled();
          });
        });
      });
    });
  });

  describe("#findCellsAdjacentTo", function () {
    function convertTo4x4Board(board) {
      _.times(4, function (y) {
        _.times(4, function (x) {
          board.addCell({ x: x, y: y });
        });
      });
    }

    function extractLocationFrom(cells) {
      return _.map(cells, function (cell) {
        return { x: cell.x, y: cell.y };
      });
    }

    describe("if the given cell has no cell to its left", function () {
      it("omits a column in the list of returned cells", function () {
        var board = new minesweeper.Board({});
        convertTo4x4Board(board);

        var adjacentCells = extractLocationFrom(
          board.findCellsAdjacentTo({ x: 0, y: 1 })
        );
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
        var board = new minesweeper.Board({});
        convertTo4x4Board(board);

        var adjacentCells = extractLocationFrom(
          board.findCellsAdjacentTo({ x: 3, y: 1 })
        );
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
        var board = new minesweeper.Board({});
        convertTo4x4Board(board);

        var adjacentCells = extractLocationFrom(
          board.findCellsAdjacentTo({ x: 1, y: 0 })
        );
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
        var board = new minesweeper.Board({});
        convertTo4x4Board(board);

        var adjacentCells = extractLocationFrom(
          board.findCellsAdjacentTo({ x: 1, y: 3 })
        );
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
        var board = new minesweeper.Board({});
        convertTo4x4Board(board);

        var adjacentCells = extractLocationFrom(
          board.findCellsAdjacentTo({ x: 1, y: 1 })
        );
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
