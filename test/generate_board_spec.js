describe("minesweeper.generateBoard", function () {
  it("returns a Board of cells generated using the given parameters", function () {
    var board = minesweeper.generateBoard({
      size: 2,
      numberOfMines: 2
    });

    var cells = _.flatten(_.map(board.rows, function (row) {
      return row.cells;
    }));
    var boardAssignedToAllCells = _.all(cells, function (cell) {
      return cell.board === board;
    });
    var cellLocations = _.map(cells, function (cell) {
      return { x: cell.x, y: cell.y };
    });
    var numberOfMines = _.reduce(cells, function (sum, cell) {
      if (cell.isMine) {
        return sum + 1;
      } else {
        return sum;
      }
    }, 0);

    expect(boardAssignedToAllCells).toBe(true);
    expect(cellLocations).toEqual([
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 0, y: 1 },
      { x: 1, y: 1 },
    ]);
    expect(numberOfMines).toBe(2);
  });
});
