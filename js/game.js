(function () {
  function Board(args) {
    var element = args.element;
    var cellSizeInPixels = args.cellSizeInPixels;
    var lengthInCells = args.lengthInCells;
    var numberOfMines = args.numberOfMines;

    var mineLocations = [];
    var cells = [];

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
          row.append(cell.element);
          addCell(cell, x, y);
        }

        element.append(row);
      }

      element.css({
        width: getSizeInPixels() + 'px',
        height: getSizeInPixels() + 'px'
      });
    };

    var generateCell = function (x, y) {
      return new Cell({
        board: board,
        x: x,
        y: y,
        isMine: isMineLocatedAt(x, y)
      });
    };

    var findCell = function (x, y) {
      if (x in cells && y in cells[x]) {
        return cells[x][y];
      }
    };

    var addCell = function (cell, x, y) {
      if (!(x in cells)) {
        cells[x] = [];
      }

      cells[x][y] = cell;
    };

    var encounterCell = function (cell) {
      if (cell.isMine) {
        revealAllCells();
      } else {
        recursivelyEncounterBlank(cell);
      }
    };

    var revealAllCells = function () {
      cells.forEach(function (row) {
        row.forEach(function (cell) {
          cell.reveal();
        });
      });
    };

    var recursivelyEncounterBlank = function (cell) {
      if (cell.reveal() && cell.getNumberOfAdjacentMines() === 0) {
        recursivelyEncounterBlanksIn(cell.getAdjacentCells());
      }
    };

    var recursivelyEncounterBlanksIn = function (cells) {
      var blanks = cells.filter(function (cell) {
        return !cell.isMine;
      });

      blanks.forEach(function (blank) {
        recursivelyEncounterBlank(blank);
      });
    };

    var findCellsAdjacentTo = function (cell) {
      var x = cell.x, y = cell.y;
      var adjacentCells = [
        findCell(x - 1, y - 1),
        findCell(x, y - 1),
        findCell(x + 1, y - 1),
        findCell(x - 1, y),
        findCell(x + 1, y),
        findCell(x - 1, y + 1),
        findCell(x, y + 1),
        findCell(x + 1, y + 1)
      ];

      return adjacentCells.filter(function (cell) { return cell; });
    };

    var countMinesInArea = function (cells) {
      var mines = cells.filter(function (cell) { return cell.isMine; });
      return mines.length;
    };

    var isMineLocatedAt = function (x, y) {
      return mineLocations.indexOf((y * lengthInCells) + x) !== -1;
    };

    this.generate = generate;
    this.encounterCell = encounterCell;
    this.findCellsAdjacentTo = findCellsAdjacentTo;
    this.countMinesInArea = countMinesInArea;
  }

  function Cell(args) {
    var _this = this;
    var board = args.board;
    var x = args.x;
    var y = args.y;
    var isMine = args.isMine;
    var hasBeenRevealed = false;

    var element = $('<td>');

    if (isMine) {
      element.addClass('mine');
    }

    var reveal = function () {
      if (hasBeenRevealed) {
        return false;
      } else {
        revealNumberOfAdjacentMines();
        element.addClass('revealed');
        hasBeenRevealed = true;
        return true;
      }
    };

    var getAdjacentCells = function () {
      return board.findCellsAdjacentTo(_this);
    };

    var getNumberOfAdjacentMines = function () {
      return board.countMinesInArea(getAdjacentCells());
    };

    var revealNumberOfAdjacentMines = function () {
      var number = getNumberOfAdjacentMines();

      if (number > 0) {
        element.append('<div>' + number + '</div>');
      }
    };

    this.element = element;
    this.x = x;
    this.y = y;
    this.isMine = isMine;
    this.reveal = reveal;
    this.getAdjacentCells = getAdjacentCells;
    this.getNumberOfAdjacentMines = getNumberOfAdjacentMines;

    element.on('click', function (event) {
      board.encounterCell(_this);
    });
  }

  var board = new Board({
    element: $('#board'),
    cellSizeInPixels: 50,
    lengthInCells: 9,
    numberOfMines: 10
  });

  board.generate();
})();
