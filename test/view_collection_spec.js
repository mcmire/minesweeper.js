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
      render: function () { },
      activate: function () { },
      deactivate: function () { },
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
      var parentView = { a: "view" };
      var models = [buildModel(), buildModel()];
      var View = function (args) { return args; };
      var elements = [createElement(), createElement()];
      var viewCollection = new minesweeper.ViewCollection({
        parentView: parentView,
        models: models,
        viewClass: View,
        additionalViewArguments: { something: "else" },
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
          parentView: parentView,
          element: elements[0],
          model: models[0],
          something: "else"
        },
        {
          parentView: parentView,
          element: elements[1],
          model: models[1],
          something: "else"
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

  describe("#activate", function () {
    it("calls #activate on each child view", function () {
      var models = [buildModel(), buildModel()];
      var views = [];
      var View = function () {
        var view = buildView();
        spyOn(view, "activate");
        views.push(view);
        return view;
      };
      var viewCollection = new minesweeper.ViewCollection({
        models: models,
        viewClass: View,
        buildElement: function () { return createElement(); }
      });

      viewCollection.activate();

      expect(views[0].activate).toHaveBeenCalled();
      expect(views[1].activate).toHaveBeenCalled();
    });
  });

  describe("#deactivate", function () {
    it("calls #deactivate on each child view", function () {
      var models = [buildModel(), buildModel()];
      var views = [];
      var View = function () {
        var view = buildView();
        spyOn(view, "deactivate");
        views.push(view);
        return view;
      };
      var viewCollection = new minesweeper.ViewCollection({
        models: models,
        viewClass: View,
        buildElement: function () { return createElement(); }
      });

      viewCollection.deactivate();

      expect(views[0].deactivate).toHaveBeenCalled();
      expect(views[1].deactivate).toHaveBeenCalled();
    });
  });
});
