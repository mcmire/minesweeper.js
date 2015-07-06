function encounterCell(cell) {
  // Don't reveal a cell that's already been revealed
  if (!cell.hasClass('revealed')) {
    cell.addClass('revealed');

    if (!cell.data('isMine')) {
      // The cell is near a mine

      var x = cell.data('x');
      var y = cell.data('y');

      var adjacentCells = [
        $('td.x-' + (x - 1) + '.y-' + (y - 1)),
        $('td.x-' + x + '.y-' + (y - 1)),
        $('td.x-' + (x + 1) + '.y-' + (y - 1)),
        $('td.x-' + (x - 1) + '.y-' + y),
        $('td.x-' + (x + 1) + '.y-' + y),
        $('td.x-' + (x - 1) + '.y-' + (y + 1)),
        $('td.x-' + x + '.y-' + (y + 1)),
        $('td.x-' + (x + 1) + '.y-' + (y + 1))
      ];

      // Count mines that are in the vicinity,
      // i.e., in a 3x3 radius around this cell

      var numberOfAdjacentMines = 0;
      for (var k = 0; k < adjacentCells.length; k++) {
        if (adjacentCells[k].data('isMine')) {
          numberOfAdjacentMines++;
        }
      }

      if (numberOfAdjacentMines > 0) {
        cell.append(numberOfAdjacentMines);
      } else {
        // Reveal adjacent cells that aren't mines, recursively
        for (var k = 0; k < adjacentCells.length; k++) {
          if (adjacentCells[k].length && !adjacentCells[k].data('isMine')) {
            encounterCell(adjacentCells[k]);
          }
        }
      }
    }
  }
}

// Set some globals

var cellSize = 50;  // pixels
var boardLength = 9;  // number of rows and cells
var boardSize = (cellSize * boardLength);
var totalNumberOfCells = boardLength * boardLength;
var numberOfMines = 10;
var board = $("#board");

// Generate mines

var mines = [];
for (var i = 0; i < numberOfMines; i++) {
  var mine = Math.floor(Math.random() * totalNumberOfCells);
  mines.push(mine);
}

// Generate board

for (var y = 0; y < boardLength; y++) {
  var row = $('<tr>');
  for (var x = 0; x < boardLength; x++) {
    var cell = $('<td>');

    // Store the coordinates of the cell so we can find adjacent cells
    cell.data('x', x);
    cell.data('y', y);
    cell.addClass('x-' + x);
    cell.addClass('y-' + y);

    // Determine whether cell is a mine
    if (mines.indexOf((y * boardLength) + x) !== -1) {
      cell.addClass('mine');
      cell.data('isMine', true);
    }

    cell.on("click", function () {
      var cell = $(this);

      if (cell.data('isMine')) {
        // Reveal everything
        for (var y = 0; y < boardLength; y++) {
          for (var x = 0; x < boardLength; x++) {
            var cell = $('td.x-' + x + '.y-' + y);
            encounterCell(cell);
          }
        }
      } else {
        encounterCell(cell);
      }
    });

    row.append(cell);
  }
  board.append(row);
}

board.css({
  width: boardSize + 'px',
  height: boardSize + 'px'
});
