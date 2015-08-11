(function (exports) {
  function ViewCollection(args) {
    var me = this;
    var parentView = args.parentView;
    var models = args.models;
    var viewClass = args.viewClass;
    var additionalViewArguments = args.additionalViewArguments || {};
    var buildElement = args.buildElement;

    function forEach(fn) {
      views.forEach(fn);
    }

    function appendTo(element) {
      _.invoke(views, "appendTo", element);
    }

    function render() {
      _.invoke(views, "render");
    }

    function activate() {
      _.invoke(views, "activate");
    }

    function deactivate() {
      _.invoke(views, "deactivate");
    }

    var views = _.map(models, function (model) {
      var defaults = {
        parentView: parentView,
        element: buildElement(),
        model: model
      };
      var args = _.extend({}, defaults, additionalViewArguments);
      return new viewClass(args);
    });

    me.forEach = forEach;
    me.appendTo = appendTo;
    me.render = render;
    me.activate = activate;
    me.deactivate = deactivate;
  }

  if (!("minesweeper" in exports)) {
    exports.minesweeper = {};
  }

  minesweeper.ViewCollection = ViewCollection;
})(this);
