const chess = new Chess('r5k1/6pp/P7/6N1/8/r1N4P/6PK/6R1 w - - 0 1');
const pieces = ['p', 'r', 'n', 'b', 'k', 'q' ];
let squareSize = 50;
let boardSize = 8 * squareSize;
let padding = 0;
let boardImg;
let piecesImages = {};
let selection = {row: -1, col: -1};
let playingAsWhite = true;

function setup() {
  createCanvas(windowWidth, windowHeight);
  boardImg = loadImage('/assets/images/board.png', (image) => image.resize(boardSize, boardSize));
  for (let x = 0; x < 2; x++) {
    for (let i = 0; i < pieces.length; i++ ) {
      let pieceIdentifier = `${x ? 'w' : 'b'}${pieces[i]}`;
      piecesImages[pieceIdentifier] = loadImage(`/assets/images/${pieceIdentifier}.png`, (image) => image.resize(squareSize, squareSize));
    }
  }
}

function isInBoard(x, y) {
  return ( x > windowWidth / 2 - boardSize / 2 && x < windowWidth / 2 + boardSize / 2 && y > windowHeight / 2 - boardSize / 2 && y < windowHeight / 2 + boardSize / 2 )
}

function draw() {
  background(220);
  
  translate(windowWidth / 2 - boardSize / 2, windowHeight / 2 - boardSize / 2);
  image(boardImg, 0, 0);
  let board = chess.board();
  for (row = 0; row < 8; row++) { 
    for (col = 0; col < 8; col++) {
      let item = board[row][col];
      if (item) {
        if (selection.row === row && selection.col === col) {
          fill(186,203,43);
          rect(col * squareSize, row * squareSize, squareSize, squareSize);
        }
        image(piecesImages[`${item.color}${item.type}`], col * squareSize, row * squareSize);
      }
    }
  }
}

function numberToFile(col) {
  return ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'][col];
}

function generateMove(item, itemLocation, targetLocation, board) {
  let isTaking = !!board[targetLocation.row][targetLocation.col];
  let isPawn = item.type === 'p';
  let originationFile = numberToFile(itemLocation.col);
  let destinationFile = numberToFile(targetLocation.col);
  console.log((8 - targetLocation.row).toString());
  let finalString = 
    (!isPawn ? item.type.toUpperCase() : '') + 
    (isTaking && isPawn ? originationFile : '') +
    (isTaking ? 'x' : '') +
    (destinationFile) + (8 - targetLocation.row).toString();
  return finalString;
}

function mouseClicked() {
  if (isInBoard(mouseX, mouseY)) {
    let clickLocation = { row: Math.floor((mouseY - (windowHeight / 2 - boardSize / 2)) / squareSize ), col: Math.floor((mouseX - (windowWidth / 2 - boardSize / 2)) / squareSize)  } ;
    let board = chess.board();

    // undo selections when the same square is clicked
    if (selection.row === clickLocation.row && clickLocation.col === selection.col) {
      selection = {row: -1, col: -1};
      return;
    }

    let item = board[clickLocation.row][clickLocation.col];
    // check if the user clicks on the pieces of the side they are playing
    if (item && (item.color === (playingAsWhite ? 'w' : 'b'))) {
      selection = clickLocation;
    } else {
      let originationFile = numberToFile(selection.col);
      let originationRank = 8 - selection.row;
      let destinationFile = numberToFile(clickLocation.col);
      let destinationRank = 8 - clickLocation.row;
      let promotion = 'q';


      let playingItem = board[selection.row][selection.col];

      if (playingItem.type === 'p' && destinationRank === 8 && originationRank === 7 ) {
        promotion = prompt("Make your promotion choice", "q/r/b/n");
      }

      let result = chess.move({
        from: `${originationFile}${originationRank}`,
        to: `${destinationFile}${8 - clickLocation.row }`,
        promotion: promotion
      });
      console.log(result);
      if (result) {
        // selection = {row: -1, col: -1};
        playingAsWhite = !playingAsWhite;
      }
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
