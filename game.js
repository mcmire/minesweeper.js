(function () {
  function Board(args) {
    var element = args.element;
    var cellSizeInPixels = args.cellSizeInPixels;
    var lengthInCells = args.lengthInCells;
    var numberOfMines = args.numberOfMines;

    var mineLocations = [];

    var getTotalNumberOfCells = function () {
      return (lengthInCells * lengthInCells);
    };

    var getSizeInPixels = function () {
      return (cellSizeInPixels * lengthInCells);
    };

    var generate = function () {
      generateMineLocations();
      generateCells();
    };

    var generateMineLocations = function () {
      for (var i = 0; i < numberOfMines; i++) {
        var mineLocation = Math.floor(Math.random() * getTotalNumberOfCells());
        mineLocations.push(mineLocation);
      }
    };

    var generateCells = function () {
      for (var y = 0; y < lengthInCells; y++) {
        var row = $('<tr>');

        for (var x = 0; x < lengthInCells; x++) {
          var cell = generateCell(x, y);
          row.append(cell);
        }

        element.append(row);
      }

      element.css({
        width: getSizeInPixels() + 'px',
        height: getSizeInPixels() + 'px'
      });
    };

    var generateCell = function (x, y) {
      var cell = $('<td>');

      cell.data('x', x);
      cell.data('y', y);
      cell.addClass('x-' + x);
      cell.addClass('y-' + y);

      if (isMineLocatedAt(x, y)) {
        cell.addClass('mine');
        cell.data('isMine', true);
      }

      cell.on('click', function (event) {
        encounterCell($(event.target));
      });

      return cell;
    };

    var encounterCell = function (cell) {
      if (cell.data('isMine')) {
        revealAllCells();
      } else {
        recursivelyEncounterBlank(cell);
      }
    };

    var revealAllCells = function () {
      for (var y = 0; y < lengthInCells; y++) {
        for (var x = 0; x < lengthInCells; x++) {
          var cell = $('td.x-' + x + '.y-' + y);
          revealCell(cell);
        }
      }
    };

    var revealCell = function (cell) {
      if (cell.hasClass('revealed')) {
        return false;
      } else {
        var numberOfAdjacentMines = getNumberOfMinesAdjacentTo(cell);

        if (numberOfAdjacentMines > 0) {
          cell.append("<div>" + numberOfAdjacentMines + "</div>");
        }

        cell.addClass('revealed');

        return true;
      }
    };

    var recursivelyEncounterBlank = function (cell) {
      if (revealCell(cell) && getNumberOfMinesAdjacentTo(cell) === 0) {
        recursivelyEncounterBlanksIn(findCellsAdjacentTo(cell));
      }
    };

    var recursivelyEncounterBlanksIn = function (cells) {
      cells.forEach(function (cell) {
        if (!cell.data('isMine')) {
          recursivelyEncounterBlank(cell);
        }
      });
    };

    var getNumberOfMinesAdjacentTo = function (cell) {
      return countMinesInArea(findCellsAdjacentTo(cell));
    };

    var findCellsAdjacentTo = function (cell) {
      var x = cell.data('x');
      var y = cell.data('y');
      var cells = [
        $('td.x-' + (x - 1) + '.y-' + (y - 1)),
        $('td.x-' + x + '.y-' + (y - 1)),
        $('td.x-' + (x + 1) + '.y-' + (y - 1)),
        $('td.x-' + (x - 1) + '.y-' + y),
        $('td.x-' + (x + 1) + '.y-' + y),
        $('td.x-' + (x - 1) + '.y-' + (y + 1)),
        $('td.x-' + x + '.y-' + (y + 1)),
        $('td.x-' + (x + 1) + '.y-' + (y + 1))
      ];

      return cells.filter(function (cell) { return cell.length > 0; });
    };

    var countMinesInArea = function (cells) {
      var count = 0;

      for (var i = 0; i < cells.length; i++) {
        if (cells[i].data('isMine')) {
          count++;
        }
      }

      return count;
    };

    var isMineLocatedAt = function (x, y) {
      return mineLocations.indexOf((y * lengthInCells) + x) !== -1;
    };

    this.generate = generate;
  }

  var board = new Board({
    element: $('#board'),
    cellSizeInPixels: 50,
    lengthInCells: 9,
    numberOfMines: 10
  });

  board.generate();
})();
