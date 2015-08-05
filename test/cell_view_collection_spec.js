describe("minesweeper.CellViewCollection", function () {
  function View(args) {
    return args;
  }

  //describe("#addView", function () {
    //it("uses the provided constructor to build a view and add it, organizing the views by rows", function () {
      //var collection = new minesweeper.CellViewCollection(View);

      //collection.addView({ model: { x: 1, y: 0 } });
      //collection.addView({ model: { x: 0, y: 1 } });
      //collection.addView({ model: { x: 0, y: 0 } });

      //var views = collection.getRows();
      //expect(views).toEqual([
        //[
          //{ model: { x: 0, y: 0 } },
          //{ model: { x: 1, y: 0 } }
        //],
        //[
          //{ model: { x: 0, y: 1 } }
        //]
      //]);
    //});
  //});

  describe("#forEachRow", function () {
    it("runs the given function for each row of cells", function () {
      var collection = new minesweeper.CellViewCollection(View);
      collection.addView({ model: { x: 1, y: 0 } });
      collection.addView({ model: { x: 0, y: 1 } });
      collection.addView({ model: { x: 0, y: 0 } });

      var yieldedViews = [];
      collection.forEachRow(function (row) {
        yieldedViews.push(row);
      });
      expect(yieldedViews).toEqual([
        [
          { model: { x: 0, y: 0 } },
          { model: { x: 1, y: 0 } }
        ],
        [
          { model: { x: 0, y: 1 } }
        ]
      ]);
    });
  });

  describe("#forEach", function () {
    it("runs the given function for each view", function () {
      var collection = new minesweeper.CellViewCollection(View);
      collection.addView({ model: { x: 1, y: 0 } });
      collection.addView({ model: { x: 0, y: 1 } });
      collection.addView({ model: { x: 0, y: 0 } });

      var yieldedViews = [];
      collection.forEach(function (view) {
        yieldedViews.push(view);
      });
      expect(yieldedViews).toEqual([
        { model: { x: 1, y: 0 } },
        { model: { x: 0, y: 1 } },
        { model: { x: 0, y: 0 } }
      ]);
    });
  });

  //describe("#getRows", function () {
    //it("returns the rows that it has built", function () {
      //var collection = new minesweeper.CellViewCollection(View);
      //collection.addView({ model: { x: 1, y: 0 } });
      //collection.addView({ model: { x: 0, y: 1 } });
      //collection.addView({ model: { x: 0, y: 0 } });

      //expect(collection.getRows()).toEqual([
        //[
          //{ model: { x: 0, y: 0 } },
          //{ model: { x: 1, y: 0 } }
        //],
        //[
          //{ model: { x: 0, y: 1 } }
        //]
      //]);
    //});
  //});
});
