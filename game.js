(function () {
  function generateMineLocations(numberOfMines, boardLength) {
    var totalNumberOfCells = boardLength * boardLength;
    var mineLocations = [];

    for (var i = 0; i < numberOfMines; i++) {
      var mineLocation = Math.floor(Math.random() * totalNumberOfCells);
      mineLocations.push(mineLocation);
    }

    return mineLocations;
  }

  function generateBoard(board, cellSize, boardLength, mineLocations) {
    var boardSize = (cellSize * boardLength);

    for (var y = 0; y < boardLength; y++) {
      var row = $('<tr>');

      for (var x = 0; x < boardLength; x++) {
        var cell = generateCell(x, y, mineLocations, boardLength);
        row.append(cell);
      }

      board.append(row);
    }

    board.css({
      width: boardSize + 'px',
      height: boardSize + 'px'
    });
  }

  function generateCell(x, y, mineLocations, boardLength) {
    var cell = $('<td>');

    cell.data('x', x);
    cell.data('y', y);
    cell.addClass('x-' + x);
    cell.addClass('y-' + y);

    if (isMineLocatedAt(x, y, mineLocations, boardLength)) {
      cell.addClass('mine');
      cell.data('isMine', true);
    }

    cell.on("click", function (event) {
      encounterCell($(event.target), boardLength);
    });

    return cell;
  }

  function encounterCell(cell, boardLength) {
    if (cell.data('isMine')) {
      revealAllCells(boardLength);
    } else {
      recursivelyEncounterBlank(cell);
    }
  }

  function revealAllCells(boardLength) {
    for (var y = 0; y < boardLength; y++) {
      for (var x = 0; x < boardLength; x++) {
        var cell = $('td.x-' + x + '.y-' + y);
        revealCell(cell);
      }
    }
  }

  function revealCell(cell) {
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
  }

  function recursivelyEncounterBlank(cell) {
    if (revealCell(cell) && getNumberOfMinesAdjacentTo(cell) === 0) {
      recursivelyEncounterBlanksIn(findCellsAdjacentTo(cell));
    }
  }

  function recursivelyEncounterBlanksIn(cells) {
    cells.forEach(function (cell) {
      if (!cell.data('isMine')) {
        recursivelyEncounterBlank(cell);
      }
    });
  }

  var getNumberOfMinesAdjacentTo = function (cell) {
    return countMinesInArea(findCellsAdjacentTo(cell));
  };

  function findCellsAdjacentTo(cell) {
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
  }

  function countMinesInArea(cells) {
    var count = 0;

    for (var i = 0; i < cells.length; i++) {
      if (cells[i].data('isMine')) {
        count++;
      }
    }

    return count;
  }

  function isMineLocatedAt(x, y, mines, boardLength) {
    return mines.indexOf((y * boardLength) + x) !== -1;
  }

  (function () {
    var cellSize = 50;  // pixels
    var boardLength = 9;  // number of rows and cells
    var numberOfMines = 10;
    var board = $("#board");
    var mineLocations = generateMineLocations(numberOfMines, boardLength);

    generateBoard(board, cellSize, boardLength, mineLocations);
  })();
})();
