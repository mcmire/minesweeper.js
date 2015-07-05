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

    // Determine whether cell is a mine
    if (mines.indexOf((y * boardLength) + x) !== -1) {
      cell.addClass('mine');
    }

    row.append(cell);
  }
  board.append(row);
}

board.css({
  width: boardSize + 'px',
  height: boardSize + 'px'
});
