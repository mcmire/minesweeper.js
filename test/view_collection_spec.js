describe("minesweeper.ViewCollection", function () {
  function createElement() {
    return document.createElement("dummy-element");
  }

  function buildModel() {
    return { a: "model" };
  }

  function buildView() {
    return {
      appendTo: function () { },
      render: function () { }
    };
  }

  function convertViewCollectionToArray(viewCollection) {
    var views = [];

    viewCollection.forEach(function (view) {
      views.push(view);
    });

    return views;
  }

  describe("constructor", function () {
    it("builds a new view for each model pointing to the parent view", function () {
      var element = createElement();
      var models = [buildModel(), buildModel()];
      var View = function (args) { return args; };
      var elements = [createElement(), createElement()];
      var viewCollection = new minesweeper.ViewCollection({
        element: element,
        models: models,
        viewClass: View,
        buildElement: (function () {
          var i = 0;

          return function () {
            var element = elements[i];
            i++;
            return element;
          };
        })()
      });

      var views = convertViewCollectionToArray(viewCollection);
      expect(views).toEqual([
        {
          element: elements[0],
          model: models[0]
        },
        {
          element: elements[1],
          model: models[1]
        }
      ]);
    });
  });

  describe("#appendTo", function () {
    it("calls #appendTo on each child view", function () {
      var models = [buildModel(), buildModel()];
      var views = [];
      var View = function () {
        var view = buildView();
        spyOn(view, "appendTo");
        views.push(view);
        return view;
      };
      var viewCollection = new minesweeper.ViewCollection({
        models: models,
        viewClass: View,
        buildElement: function () { return createElement(); }
      });
      var otherElement = { another: "element" };

      viewCollection.appendTo(otherElement);

      expect(views[0].appendTo).toHaveBeenCalledWith(otherElement);
      expect(views[1].appendTo).toHaveBeenCalledWith(otherElement);
    });
  });

  describe("#render", function () {
    it("calls #render on each child view", function () {
      var models = [buildModel(), buildModel()];
      var views = [];
      var View = function () {
        var view = buildView();
        spyOn(view, "render");
        views.push(view);
        return view;
      };
      var viewCollection = new minesweeper.ViewCollection({
        models: models,
        viewClass: View,
        buildElement: function () { return createElement(); }
      });

      viewCollection.render();

      expect(views[0].render).toHaveBeenCalled();
      expect(views[1].render).toHaveBeenCalled();
    });
  });
});
