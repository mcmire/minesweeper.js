(function (exports) {
  function ViewCollection(args) {
    var element = args.element;
    var models = args.models;
    var viewClass = args.viewClass;
    var buildElement = args.buildElement;

    function forEach(fn) {
      views.forEach(fn);
    }

    function render() {
      _.invoke(views, "render");
    }

    function appendTo(element) {
      _.invoke(views, "appendTo", element);
    }

    var views = _.map(models, function (model) {
      return new viewClass({
        element: buildElement(),
        model: model
      });
    });

    this.forEach = forEach;
    this.render = render;
    this.appendTo = appendTo;
  }

  if (!("minesweeper" in exports)) {
    exports.minesweeper = {};
  }

  minesweeper.ViewCollection = ViewCollection;
})(this);
