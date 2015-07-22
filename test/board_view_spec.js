describe("minesweeper.BoardView", function () {
  describe("#render", function () {
    it("returns an element filled with rendered cells", function () {
      var cells = [ { first: 'cell' }, { second: 'cell' } ];

      (function () {
        var numberOfCalls = 0;

        spyOn(minesweeper, "CellView").andCallFake(function () {
          var cell = cells[numberOfCalls];
          numberOfCalls++;
          return cell;
        });
      })();

      var model = { cells: cells };
      var view = minesweeper.BoardView({ model: model });

      view.render();

      expect(minesweeper.CellView).toHaveBeenCalledWith({ model: cells[0] });
      expect(minesweeper.CellView).toHaveBeenCalledWith({ model: cells[1] });
    });
  });
});
